<template>
  <div class="message">
    <div class="message-icon">
      <span class="icon-text">📜</span>
    </div>
    <div class="message-content">
      <p class="message-text">{{ content }}</p>
    </div>
  </div>
  <div class="action-buttons">
    <Button v-if="isBankrupt" :disabled="!hasPermission" size="large" @click="openBankruptModal" >宣布破产</Button>
    <Button v-if="payAmount > 0" :disabled="isBankrupt || !hasPermission" type="primary" size="large" @click="confirmPayment">确认支付</Button>
    <Button v-if="payAmount < 0 && otherPlayerIndex < 0" :disabled="!hasPermission" type="primary" size="large" @click="confirmPayment">领取</Button>
    <Button v-if="!payAmount " :disabled="!hasPermission" type="primary" size="large" @click="confirmMsg">确定</Button>
  </div>
  <CashBoxModal :otherPlayerIndex="otherPlayerIndex" :yourPlayerIndex="playerIndex" :payAmount="payAmount" @confirmPay="pay" ref="cashBoxModal" />
  <Bankrupt :playerIndex="playerIndex" @close="closeBankruptModal" ref="bankruptModal" />
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import Bankrupt from './Bankrupt.vue';
import { getPlayerMessage, payForMessage, consumeMessage, hasRolePermission } from '@/api/gameApi.js';

export default {
    name: 'MessageComponent',
    emits: ['confirm', 'bankrupted'],
    components: {
        Button,CashBoxModal,Bankrupt
    },
    props: {
        playerIndex: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            messageType:'',
            content:'',
            otherPlayerIndex:-1,
            payAmount:0,
            bankruptPlayerIndexs:[],
            hasPermission:false,
        };
    },
    async mounted() {
        this.hasPermission = await hasRolePermission();
        console.log("MessageComponent mounted");
        //从后台查找当前的消息。
        getPlayerMessage(this.playerIndex).then((data) => {
            console.log("getPlayerMessage data:", data);
            if(!data.exists){
                this.content = "暂无消息";
                return;
            }
            this.content = data.message;
            this.messageType = data.messageType;
            this.otherPlayerIndex = data.otherPlayerIndex||-1;
            this.payAmount = data.payAmount;
            this.bankruptPlayerIndexs = data.bankruptPlayerIndexs;
        }).catch((error) => {
            console.error('Error fetching player message:', error);
        });
    },
    methods: {
        /* 支付按钮 */
        confirmPayment() {
            this.$refs.cashBoxModal.show();
        },
        /* 确定按钮 */
        confirmMsg() {
            consumeMessage({playerIndex:this.playerIndex,messageType:this.messageType}).then((data)=>{
                console.log("consumeMessage data:", data);
                this.$emit('confirm',data);
            }).catch((error)=>{
                console.error('Error processing payment:', error);
            });
        },
        /* 支付操作完成后 */
        pay({yourSelectedMoney,otherSelectedMoney,successCallback,failCallback}) {
            payForMessage({playerIndex:this.playerIndex,yourSelectedMoney,otherSelectedMoney,messageType:this.messageType}).then((data)=>{
                console.log("payForMessage data:", data);
                successCallback();
                this.$emit('confirm',data);
            }).catch((error)=>{
                console.error('Error processing payment:', error);
                failCallback();
            });
        },
        openBankruptModal(){
            console.log("点击了破产按钮")
            this.$refs.bankruptModal.show();
        },
        closeBankruptModal({message,endTurn,isGameOver}){
            if(endTurn){
                this.$emit('bankrupted',{message,action:endTurn?'endTurn':'',endTurn,isGameOver});
            }
        }
    },
    computed:{
        isBankrupt(){
            return this.bankruptPlayerIndexs.includes(this.playerIndex)
        },
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/message.scss";
</style>