<template>
  <div class="message">
    <div class="message-icon">
      <span class="icon-text">📜</span>
      <span>{{ title }}</span>
    </div>
    <div class="message-content">
      <p class="message-text">{{ content }}</p>
    </div>
  </div>
  <div class="action-buttons">
    <Button v-if="isBankrupt" :disabled="!isYourTurn" size="large" @click="openBankruptModal" >宣布破产</Button>
    <Button v-if="payAmount > 0" :disabled="isBankrupt || !isYourTurn" type="primary" size="large" @click="confirmPayment">支付</Button>
    <Button v-if="payAmount < 0 && otherPlayerIndex < 0" :disabled="!isYourTurn" type="primary" size="large" @click="confirmPayment">领取</Button>
    <Button v-if="!payAmount " :disabled="!isYourTurn" type="primary" size="large" @click="confirmMsg">确定</Button>
  </div>
  <CashBoxModal :otherPlayerIndex="otherPlayerIndex" :yourPlayerIndex="yourPlayerIndex" :payAmount="payAmount" @confirmPay="pay" ref="cashBoxModal" />
  <GModal
    :show="showBankruptModal"
    :playerIndex="yourPlayerIndex"
    title="破产"
    >
    <Bankrupt v-if="showBankruptModal" :playerIndex="yourPlayerIndex" @close="closeBankruptModal" />
  </GModal>
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import Bankrupt from './Bankrupt.vue';
import { getPlayerChance, consumeChance, getPlayers } from '@/api/gameApi.js';
import GModal from '@/components/Modal.vue';
import { createWebSocket,closeWebSocket,send } from '@/util/socketUtils.js';

export default {
    name: 'ChanceComponent',
    emits: ['confirm'],
    components: {
        Button,CashBoxModal,GModal,Bankrupt
    },
    props: {
        playerIndex: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            title: '',
            content:'',
            otherPlayerIndex:-1,
            yourPlayerIndex:-1,
            payAmount:0,
            bankruptPlayerIndexs:[],
            showBankruptModal:false,
            players:[],
            currentPlayerUserId:'',
            webSocket: undefined,
        };
    },
    async mounted() {
        this.webSocket = createWebSocket('/ws/game/chance',(data)=>{
            if (data.action==='refreshChance'){
                this.loadChance();
            }
        });
        console.log("MessageComponent mounted");
        this.players = await getPlayers();
        this.currentPlayerUserId = this.players[this.playerIndex].userId
        this.loadChance();
    },
    unmounted(){
        closeWebSocket(this.webSocket);
    },
    methods: {
        loadChance() {
            //从后台查找当前的消息。
            getPlayerChance(this.playerIndex,this.messageType).then((data) => {
                console.log("getPlayerMessage data:", data);
                this.title = data.title
                this.content = data.description;
                this.bankruptPlayerIndexs=data.bankruptPlayerIndexs;
                const payments = data.payments;
                const payment = payments.filter((p)=>!p.isPaid)[0];
                if(payment){//需要支付
                    this.otherPlayerIndex = -1;
                    this.yourPlayerIndex = payment.playerIndex;
                    this.payAmount = payment.payAmount;
                }
                
                this.payAmount = data.payAmount;
            }).catch((error) => {
                console.error('Error fetching player message:', error);
            });
        },
        /* 支付按钮 */
        confirmPayment() {
            this.$refs.cashBoxModal.show();
        },
        /* 确定按钮 */
        confirmMsg() {
            consumeChance({playerIndex:this.playerIndex}).then((data)=>{
                console.log("consumeMessage data:", data);
                this.$emit('confirm',data);
            }).catch((error)=>{
                console.error('Error processing payment:', error);
            });
        },
        /* 支付操作完成后 */
        pay({yourSelectedMoney,otherSelectedMoney,successCallback,failCallback}) {
            consumeChance({playerIndex:this.yourPlayerIndex,yourSelectedMoney,otherSelectedMoney}).then((data)=>{
                console.log("payForMessage data:", data);
                successCallback();
                if(data.hasNext){
                    //还有下一笔支付
                    this.loadChance();
                    // 发送websocket消息，通知其他玩家刷新机会卡
                    send(this.webSocket,{action:'refreshChance'});
                }else{
                    this.$emit('confirm',data);
                }
            }).catch((error)=>{
                console.error('Error processing payment:', error);
                failCallback();
            });
        },
        openBankruptModal(){
            this.showBankruptModal = true;
        },
        closeBankruptModal({message,endTurn,isGameOver}){
            this.showBankruptModal = false;
            if(endTurn){
                this.$emit('confirm',{message,endTurn,isGameOver});
            }
        }
    },
    computed:{
        isBankrupt(){
            return this.bankruptPlayerIndexs.includes(this.yourPlayerIndex)
        },
        isYourTurn(){
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log("isYourTurn check:",this.yourPlayerIndex,this.currentPlayerUserId,userInfo.id);
            if(this.yourPlayerIndex < 0){
                return this.currentPlayerUserId=== userInfo.id;
            }
            console.log("isYourTurn check:",this.players[this.yourPlayerIndex],userInfo.id);
            return this.players[this.yourPlayerIndex].userId === userInfo.id;
            
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/message.scss";
</style>