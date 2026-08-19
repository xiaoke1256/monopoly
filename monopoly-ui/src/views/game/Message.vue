<template>
  <div class="message">
    <p>{{ content }}</p>
  </div>
  <div class="action-buttons">
    <Button v-if="payAmount > 0" type="primary" size="large" @click="confirmPayment">确认支付</Button>
    <Button v-if="payAmount < 0 && otherPlayerIndex < 0" type="primary" size="large" @click="confirmPayment">领取</Button>
  </div>
  <Modal
        v-model="showPayModal"
        width="90%"
        class-name="vertical-center-modal"
        @on-ok="pay">
        <div style="height: 100%;padding:4px 0;">
            <CashBox v-if="showPayModal" :otherPlayerIndex="otherPlayerIndex" :yourPlayerIndex="playerIndex" :payAmount="payAmount" ref="cashBox" />
        </div>
        <template #footer>
            <div style="text-align:center;">
                <Button :loading="payModalLoading" type="primary" size="large" @click="pay">确认</Button>
            </div>
        </template>
    </Modal> 
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBox from './CashBox.vue';
import { getPlayerMessage } from '@/api/gameApi.js';

export default {
    name: 'MessageComponent',
    components: {
        Button,CashBox
    },
    props: {
        playerIndex: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            showPayModal: false,
            payModalLoading: false,
            content:'',
            otherPlayerIndex:-1,
            payAmount:0
        };
    },
    mounted() {
        console.log("MessageComponent mounted");
        //从后台查找当前的消息。
        getPlayerMessage(this.playerIndex).then((data) => {
            console.log("getPlayerMessage data:", data);
            if(!data.exists){
                this.content = "暂无消息";
                return;
            }
            this.content = data.message;
            this.otherPlayerIndex = data.otherPlayerIndex||-1;
            this.payAmount = data.payAmount;
        }).catch((error) => {
            console.error('Error fetching player message:', error);
        });
    },
    methods: {
        confirmPayment() {
            this.showPayModal = true;
        }
    }
}
</script>
<style lang="scss" scoped>
.message {
    padding: 8px;
    background-color: #f0f0f0;
    border-radius: 4px;
    text-align: center; 
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