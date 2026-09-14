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

export default {
    name: 'SuccessComponent',
    components: {
        Button
    },
    data() {
        return {
            content:'',
            player:{}
        };
    },
    async mounted() {
        const player = await getFinalPlayer();
        this.player = player;
        this.content = `${player.name}取得了最终胜利！`;
    },
    methods: {
        returnMain(){
            this.$router.push('/')
        }
    }
}
</script>
<style lang="scss" scoped>
.message {
    padding: 20px 16px 12px;
    background: linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%);
    border-radius: 12px;
    text-align: center;
    position: relative;
    border: 2px solid #d4a853;
    box-shadow: 0 4px 16px rgba(212, 168, 83, 0.2);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #d4a853, #f0c060, #d4a853);
        border-radius: 12px 12px 0 0;
    }
}

.message-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: linear-gradient(145deg, #fff8e7, #f5e6c8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(212, 168, 83, 0.3);
    border: 3px solid #e8c87a;
    animation: float 2s ease-in-out infinite;
}

.icon-text {
    font-size: 32px;
    line-height: 1;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-4px);
    }
}

.message-content {
    padding: 8px 4px;
}

.message-text {
    font-size: 17px;
    color: #5a4a3a;
    line-height: 1.8;
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.action-buttons {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 16px;

    .ivu-btn {
        min-width: 120px;
        font-size: 15px;
    }
}
</style>