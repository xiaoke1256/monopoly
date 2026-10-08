<template>
  <div class="message">
    <div class="message-icon">
      <span class="icon-text">🏅</span>
    </div>
    <div class="message-content">
      <p class="message-text">{{ content }}</p>
    </div>
  </div>
  <div class="action-buttons">
    <Button type="primary" size="large" @click="returnMain">返回主页面</Button>
  </div>
</template>
<script>
import { Button } from 'view-ui-plus';
import { getFinalPlayer } from '@/api/gameApi.js';
import { createWebSocket,closeWebSocket,send } from '@/util/socketUtils.js';

export default {
    name: 'SuccessComponent',
    components: {
        Button
    },
    data() {
        return {
            content:'',
            player:{},
            webSocket: undefined,
        };
    },
    async mounted() {
        this.webSocket = createWebSocket('/ws/game/success',(data)=>{
            if (data.action==='toHome'){
                this.$router.push('/')
            }
        });
        const player = await getFinalPlayer();
        this.player = player;
        this.content = `${player.name}取得了最终胜利！`;
    },
    unmounted(){
        closeWebSocket(this.webSocket);
    },
    methods: {
        returnMain(){
            this.$router.push('/');
            send(this.webSocket,{action:'toHome'});
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/message.scss";
</style>