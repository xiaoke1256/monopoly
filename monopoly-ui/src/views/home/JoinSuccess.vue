<template>
  <div class="game-manager-container">
    <div class="game-manager-card">
      <Result type="success" title="提交成功">
        <template #extra>
          {{ message }}
        </template>
      </Result>
    </div>
  </div>
</template>
<script >
import { useRoute } from 'vue-router'
import { isValidJSON } from '../../util/jsonUtils'

export default {
  name: 'JoinSuccess',
  data() {
    return {
        roomNo:'',
        nickname:'',
        message:'请等待对方开启游戏...',
        webSocket: undefined,
    }
  },
  mounted(){
    const route = useRoute()
    if(route.query.roomNo) {
      this.roomNo = route.query.roomNo
      //TODO 如果roomNo没传要提示用户重新加入
    }
    if(!this.roomNo){
      this.$Message.error({content:'为传入邀请码，请重新扫码',onClose:()=>{this.$router.replace('/joinGame');}});
    }
    if(route.query.nickname) {
      this.nickname = route.query.nickname
      this.message = `请等待${this.nickname?this.nickname:'对方'}开启游戏...`
    }
    const token = localStorage.getItem('token');
    if(!token){
      this.$Message.error({content:'尚未登录，请先登录',onClose:()=>{this.$router.replace('/login');}});
    }
    const sessionId = localStorage.getItem('sessionId');
    console.log("sessionId:",sessionId);
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.webSocket = new WebSocket(`${protocol}//${location.host}/ws/gm/invitee?roomNo=${this.roomNo}&sessionId=${sessionId}`); 
    this.webSocket.onopen=()=>{
      console.log('WebSocket connected!');
    };
    this.webSocket.onmessage = (event) => {
      console.log('Received message:', event.data);
      if(!isValidJSON(event.data)){
        return;
      }
      const data = JSON.parse(event.data)
      if(data.success){
        this.message = '游戏启动啦！享受游戏吧。(5秒后将进入游戏...)';
        setTimeout(()=>{
          this.$router.push('/game');
        },5000)
      }
    };
    this.webSocket.onclose = () => {
      console.log('WebSocket closed!');
    };
    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
}
</script>
<style>
@import "@/assets/styles/game-manage.scss";

</style>