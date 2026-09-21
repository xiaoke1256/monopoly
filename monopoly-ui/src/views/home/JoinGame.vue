<template>
   <div class="gameManager-container">
    <div class="gameManager-card">
      <h1 class="title">🎲 加入游戏</h1>
      <div class="join-game-form" >
        <div class="row">
          <Input placeholder="请填写邀请码" v-model="roomNo" /> <Button :disabled="!!mapId" @click="sendRoomNo" >发送</Button>
        </div>
        <div v-if="!!gameName" class="row">
          <div style="flex:1" >游戏名称：</div><div style="flex:3" >{{ gameName }}</div>
        </div>
        <div v-if="!!mapName" class="row">
          <div style="flex:1">游戏地图：</div><div style="flex:3" >{{ mapName }}</div>
        </div>
        <div v-if="!!userName" class="row">
          <div style="flex:1">邀请玩家：</div><div style="flex:3" >{{ userName }}</div>
        </div>
        <div class="row">
          <Select v-model="roleId" placeholder="请选择玩家角色"  >
            <Option v-for="role in roles" :key="role.roleId" :value="role.roleId" >{{ role.name }}</Option>
          </Select>
        </div>
      </div>
      <div class="actions">
        <Button type="primary" size="large" long >加入</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { getMapById } from '../../api/mapApi';
import { useRoute } from 'vue-router'

export default {
  name: 'JoinGame',
  data(){
    return {
      roomNo:'',
      userName:'',
      gameName:'',
      mapId:undefined,
      mapName:'',
      roleId:0,
      roles:[],
    }
  },
  async mounted(){
    const token = localStorage.getItem('token');
    const route = useRoute()
    if(!token){
      this.$Message.error({content:'尚未登录，请先登录',onClose:()=>{this.$router.replace('/login');}});
    }
    
    //console.log("route.query.mapId:",route.query.mapId)
    if(route.query.mapId) {
      this.mapId = route.query.mapId;
      const map = await getMapById(this.mapId);
      this.roles = map.roles;
      this.mapName = map.name;
    }
    if(route.query.roomNo) {
      this.roomNo = route.query.roomNo;
    }
  },
  methods:{
    sendRoomNo(){
      if(!this.roomNo){
        this.$Message.error('请先填写邀请码');
        return;
      }
      console.log(this.roomNo);
      //启动 ws 等待获取游戏信息
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const sessionId = localStorage.getItem('sessionId');
      let socket = new WebSocket(`${protocol}//${location.host}/ws/gm/invitee/gameInfo?sessionId=${sessionId}&roomNo=${this.roomNo}`); 
      socket.onopen=()=>{
        console.log('WebSocket connected!');
      };
      socket.onmessage = (event) => {
        console.log('Received message:', event.data);
        //1.应该收到连接成功或链接失败的消息
        //2.然后接受到gameInfo的消息。如果成功接受到则关闭ws
      };
      socket.onclose = () => {
        console.log('WebSocket closed!');
      };
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      //socket.send(this.roomNo);

      //
    }
  },
  watch:{
    async specifyMapId(newValue){
      console.log("newValue:",newValue)
      const map = await getMapById(newValue);
      this.roles = map.roles;
      this.mapName = map.name;
    }
  }
}
</script>
<style lang="scss" scoped>
.gameManager-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gameManager-card {
  width: 400px;
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

.form {
  margin-top: 20px;
}

.footer {
  text-align: center;
  margin-top: 24px;
  color: #999;
  font-size: 14px;

  .link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.join-game-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .row{
    display: flex;
    flex-direction: row;
    gap: 4px;
  }
}
</style>