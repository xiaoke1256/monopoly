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
            <FormItem label="游戏名称" prop="mapId">
              <Input v-model="createForm.name" />
            </FormItem>
            <FormItem label="玩家" prop="players">
              <div v-for="(player,index) in createForm.players" :key="index" style="width: 100%;display:inline-flex;flex-direction:row;justify-content:space-between;gap: 4px;margin:1px 0" >
                <Select style="width: 40%;flex: 5;" v-model="createForm.players[index].roleId" placeholder="请选择玩家角色"  >
                  <Option v-for="role in roles" :key="role.roleId" :value="role.roleId" >{{ role.name }}</Option>
                </Select>
                <Select style="width: 35%;flex: 3;" v-model="createForm.players[index].type"  >
                  <Option v-for="playerType in playerTypes" :key="playerType.code" :value="playerType.code" :disabled="playerType.code==='ai'" >{{ playerType.name }}</Option>
                </Select>
                <Button v-if="index>0" style="flex: 1;" icon="md-remove" @click="deletePlayer" ></Button>
                <div v-if="index==0" style="flex: 1; margin:1px" ></div>
              </div>
              <div style="display:flex;flex-direction:row;justify-content:space-between;gap: 4px;">
                <Button style="flex: 7;" type="dashed" long icon="md-add" @click="addPlayer" >新增玩家</Button>
                <Button style="flex: 1;" long icon="md-barcode" @click="this.$Message.info('暂未实现');" ></Button>
              </div>
            </FormItem>
          </Form>
          <div class="actions">
            <Button type="primary" size="large" long :loading="loading" @click="startNewGame">开始游戏</Button>
          </div>
        </TabPane>
      </Tabs>
      
    </div>
  </div>
</template>

<script>
import { getValidGames, startExistGame, createGame } from '../../api/gameManageApi';
import { getMaps } from '../../api/mapApi';
import { formatDate } from '../../util/dateUtils';

function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

export default {
  name: 'GameSelector',
  data() {
    return {
      games: [],
      selected: [],
      loading: false,
      maps:[],
      roles:[],
      playerTypes:[{code:'self',name:'本玩家'},{code:'other',name:'邀请其他玩家'},{code:'ai',name:'ai玩家'}],
      createForm:{
        mapId:null,
        name:'',
        roomNo:null,
        players:[
          {roleId:0,type:'self'}
        ]
      }
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
        const result = await startExistGame({ gameId: this.selected[0] });
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
        const userInfo = localStorage.getItem('userInfo');
        if (type==='self') {
          userId = userInfo._id;
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
    }
  },
  watch:{
    "createForm.mapId":function(newVal){
      const map = this.maps.find((map)=>map._id === newVal)
      this.roles = map.roles;
      this.createForm.name = map.name;
    }
  }
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

.actions {
  margin-top: 8px;
}
</style>
