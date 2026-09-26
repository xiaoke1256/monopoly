<template>
   <div class="game-manager-container">
    <div class="game-manager-card">
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
        <div v-if="!!mapId" class="row">
          <Select v-model="roleId" placeholder="请选择玩家角色"  >
            <Option v-for="role in roles" :key="role.roleId" :value="role.roleId" >{{ role.name }}</Option>
          </Select>
        </div>
      </div>
      <div class="actions">
        <Button type="primary" size="large" long @click="postPayer" >加入</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { getMapById } from '../../api/mapApi';
import {getGameInfoByTempRoomNo,postPayerToInviter } from '../../api/gameManageApi'
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
    async sendRoomNo(){
      if(!this.roomNo){
        this.$Message.error('请先填写邀请码');
        return;
      }
      console.log(this.roomNo);
      //获取游戏信息
      const data = await getGameInfoByTempRoomNo(this.roomNo);
      console.log("data:",data);
      const {gameName,mapId,mapName,userName} = data?.data
      this.gameName = gameName;
      this.mapId = mapId;
      this.mapName = mapName;
      this.userName = userName;
    },
    async postPayer(){
      const data = await postPayerToInviter({roomNo:this.roomNo,roleId:this.roleId,mapId:this.mapId});
      console.log('respons of postPayer:',data);
      if(data.success){
        console.log('成功跳转到等待游戏开始页面');
        this.$router.push(`/joinSuccess?roomNo=${this.roomNo}&nickname=${this.userName}`);
      }
    }
  },
  watch:{
    async mapId(newValue){
      console.log("newValue:",newValue)
      const map = await getMapById(newValue);
      this.roles = map.roles;
      this.mapName = map.name;
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/game-manage.scss";

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