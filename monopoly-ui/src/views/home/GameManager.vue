<template>
  <div class="game-manager-container">
    <div class="game-manager-card">
      <Tabs >
        <TabPane label="恢复游戏">
          <h1 class="title">🎲 请选择一个游戏开始您的冒险</h1>
          <div class="select-wrapper">
            <select
              v-model="selected"
              class="game-select"
              size="8"
            >
              <option v-for="game in games" :key="game._id" :value="game._id">
                {{ game.name }}（{{ formatDate(game.updatedAt) }}）
              </option>
            </select>
          </div>
          <div class="actions">
            <Button type="primary" size="large" long :loading="loading" @click="startGame">开始游戏</Button>
          </div>
        </TabPane>
        <TabPane label="创建游戏" >
          <h1 class="title">🎲 开始一个新的游戏吧</h1>
          <Form :model="createForm" label-position="left" >
            <FormItem label="选择地图" prop="mapId">
              <Select v-model="createForm.mapId" placeholder="请选择地图" >
                <Option v-for="map in maps" :key="map._id" :value="map._id" >{{ map.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="游戏名称" prop="name">
              <Input v-model="createForm.name" />
            </FormItem>
            <FormItem label="玩家" prop="players">
              <div v-for="(player,index) in createForm.players" :key="index" class="player-row" >
                <Poptip width="150" class="poptip-flex" placement="right" trigger="hover">
                  <Select v-model="createForm.players[index].roleId" placeholder="请选择玩家角色"  >
                    <Option v-for="role in roles" :key="role.roleId" :value="role.roleId" >{{ role.name }}</Option>
                  </Select>
                  <template #content>
                    <img v-if="getRoleImg(index)" style="width: 100%;aspect-ratio: 1 / 2 ; object-fit: contain " :src="getRoleImg(index)" />
                  </template>
                </Poptip>
                <Select v-if="createForm.players[index].type!=='other'" class="player-type-select" v-model="createForm.players[index].type"  >
                  <Option v-for="playerType in playerTypes" :key="playerType.code" :value="playerType.code" :disabled="playerType.code==='ai' || playerType.code==='other'" >{{ playerType.name }}</Option>
                </Select>
                <div class="player-nickname-div" v-if="createForm.players[index].type==='other'" >{{ createForm.players[index].nickname }}</div>
                <Button v-if="index>0" class="player-action-btn" icon="md-remove" @click="deletePlayer" ></Button>
                <div v-if="index==0" class="player-action-placeholder" ></div>
              </div>
              <div style="display:flex;flex-direction:row;justify-content:space-between;gap: 4px;">
                <Button style="flex: 7;" type="dashed" long icon="md-add" @click="addPlayer" >新增玩家</Button>
                <Poptip style="flex: 1;" trigger="hover" width="100" content="邀请码">
                  <Button icon="md-barcode" :disabled="!createForm.mapId" @click="showRoomNo" ></Button>
                </Poptip>
              </div>
            </FormItem>
          </Form>
          <div class="actions">
            <Button type="primary" size="large" long :loading="loading" @click="startNewGame">开始游戏</Button>
          </div>
          <Modal v-model="isShowRoomNo" class-name="vertical-center-modal" width="300">
            <div class="qrcode-container">
              <div>
                扫描以下二维码，可以加入游戏。
              </div>
              <div>
                <QrcodeVue :value="createForm.roomNo" />
              </div>
              <div>邀请码：{{ createForm.roomNo}}</div>
            </div>
            <template #footer >
              <div style="text-align: center;" >
                <Button type="default" size="large" @click="isShowRoomNo=false">关闭</Button>
              </div>
            </template>
          </Modal>
        </TabPane>
      </Tabs>
      
    </div>
  </div>
</template>

<script>
import { getValidGames, startExistGame, createGame, generateRoomNo } from '../../api/gameManageApi';
import { getMaps } from '../../api/mapApi';
import { formatDate } from '../../util/dateUtils';
import { imageMap } from '../../util/imagesMap.js';
import QrcodeVue from 'qrcode.vue'

function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

function isValidJSON(str) {
    if (typeof str !== 'string') {
        return false;
    }
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

export default {
  name: 'GameSelector',
  components: {
    QrcodeVue
  },
  data() {
    return {
      games: [],
      selected: [],
      loading: false,
      maps:[],
      map:{},
      roles:[],
      playerTypes:[{code:'self',name:'本玩家'},{code:'other',name:'邀请其他玩家'},{code:'ai',name:'ai玩家'}],
      createForm:{
        mapId:null,
        name:'',
        roomNo:null,
        players:[
          {roleId:0,type:'self'}
        ]
      },
      isShowRoomNo:false,
      webSocket: undefined,
    };
  },
  async mounted() {
    this.games = await getValidGames();
    this.maps = await getMaps();
    console.log("this.maps:",this.maps);
  },
  methods: {
    formatDate,
    async startGame() {
      if (!this.selected || this.selected.length === 0) {
        this.$Message.warning('请先选择一个游戏');
        return;
      }
      this.loading = true;
      try {
        const result = await startExistGame({ gameId: this.selected });
        if (result.success) {
          this.$Message.success('正在进入游戏...');
          this.$router.push('/game');
        }
      } finally {
        this.loading = false;
      }
    },
    async startNewGame() {
      if (!this.createForm.mapId){
        this.$Message.error('请选择地图。');
        return;
      }
      if (this.createForm.players.length < 2){
        this.$Message.error('至少要有两个玩家。');
        return;
      }
      if(hasDuplicates(this.createForm.players.map((p)=>p.roleId))){
        this.$Message.error('玩家角色不能重复。');
        return;
      }
      
      const players = this.createForm.players.map((p)=>{
        const {roleId,type} = p;
        let userId = p.userId;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (type==='self') {
          userId = userInfo.id;
        }
        return {roleId,userId}
      });

      try {
        this.loading = true;
        const result = await createGame({...this.createForm,players});
        if (result.success) {
          this.$Message.success('正在进入游戏...');
          this.$router.push('/game');
        }
      } finally {
        this.loading = false;
      }
    },
    addPlayer(){
      this.createForm.players.push({roleId:0,type:'self'})
    },
    deletePlayer(index){
      this.createForm.players.splice(index, 1);
    },
    async showRoomNo(){
      if(!this.createForm.roomNo){
        this.createForm.roomNo = await generateRoomNo();
        const roomNo = this.createForm.roomNo;
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.webSocket = new WebSocket(`${protocol}//${location.host}/ws/gm/invite?roomNo=${roomNo}`); 
        this.webSocket.onopen=()=>{
          console.log('WebSocket connected!');
        };
        this.webSocket.onmessage = (event) => {
          console.log('Received message:', event.data);
          if(!isValidJSON(event.data)){
            return;
          }
          //1.应该收到连接成功或链接失败的消息
          //2.接受到请求gameInfo的消息。则须将界面上的游戏信息发送过去。
          const data = JSON.parse(event.data);
          const {action,sessionId} = data;
          console.log("action:",action);
          console.log("action === 'request-for-gameInfo':",(action === 'request-for-gameInfo') );
          if(action === 'request-for-gameInfo'){
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log("userInfo:",userInfo)
            const requestMsg = {
              sessionId,
              data:{
                userName:userInfo?.nickname,
                gameName:this.createForm?.name,
                mapId:this.createForm?.mapId,
                mapName:this.map?.name,
              }
            }
            this.webSocket.send(JSON.stringify(requestMsg) );
            console.log('已发送消息：',requestMsg);
          }
          //3.接受到成为游戏玩家的消息，则将游戏玩家信息显示到界面。
          else if(action === 'add-player'){
            const roomNo = data.roomNo;
            const mapId = data.mapId;
            const player = data.player;
            if(roomNo !== this.createForm.roomNo){
              console.error("无效roomNo，无须处理：",roomNo);
              return;
            }
            if(mapId !== this.createForm.mapId){
              console.error("mapId 已修改。",mapId);
              this.$Message.info('地图发生变动，需重新扫描二维码。');
              return;
            }
            this.createForm.players.push({roleId:player.roleId,type:'other',userId:player.userId,nickname:player.nickname});
            const requestMsg = {
              sessionId,
              data:{
                success:true
              }
            }
            this.webSocket.send(JSON.stringify(requestMsg) );
            console.log('已发送确认消息:',requestMsg);
          }
        };
        this.webSocket.onclose = () => {
          console.log('WebSocket closed!');
        };
        this.webSocket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      }
      this.isShowRoomNo = true;
    },
    getRoleImg(index){
      return imageMap[this.roles[this.createForm.players[index]?.roleId]?.image];
    }
  },
  unmounted(){
    //关闭ws
    try{
      this.webSocket.close();
    }catch(e){
      console.error(e);
    }
    this.webSocket = undefined;
  },
  watch:{
    "createForm.mapId":function(newVal){
      const map = this.maps.find((map)=>map._id === newVal);
      this.map = map;
      this.roles = map.roles;
      this.createForm.name = map.name;
    }
  },
};
</script>

<style lang="scss" scoped>
.game-manager-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-manager-card {
  width: 480px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.title {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
  font-size: 24px;
}

.select-wrapper {
  margin-bottom: 24px;
}

.game-select {
  width: 100%;
  min-height: 280px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  background: #fff;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }

  option {
    padding: 8px 10px;
    font-size: 14px;
    color: #333;

    &:hover {
      background: #f5f7ff;
    }

    &:checked {
      background: #667eea;
      color: #fff;
    }
  }
}

.player-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin: 1px 0;

  .poptip-flex {
    flex: 5 1 0%;
    display: flex;
    min-width: 0;

    :deep(.ivu-poptip-rel) {
      width: 100%;
      min-width: 0;
      display: block;
    }

    :deep(.ivu-select) {
      width: 100%;
    }
  }

  .player-type-select {
    flex: 3 1 0%;
    min-width: 0;

    :deep(.ivu-select) {
      width: 100%;
    }
  }

  .player-nickname-div {
    flex: 3 1 0%;
    min-width: 0;
    margin: 1px;
  }

  .player-action-btn,
  .player-action-placeholder {
    flex: 1 1 0%;
    min-width: 0;
  }

  .player-action-placeholder {
    margin: 1px;
  }
}


.qrcode-container {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

</style>
