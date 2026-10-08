<template>
    <Modal
        v-model="showPayModal"
        width="90%"
        class-name="vertical-center-modal"
        @on-ok="pay">
        <div style="height: 100%;padding:4px 0;">
            <CashBox v-if="showPayModal" 
                :otherPlayerIndex="otherPlayerIndex" 
                :yourPlayerIndex="yourPlayerIndex" 
                :payAmount="payAmount" 
                @exchangeChange="onExchangeingChange"
                ref="cashBox" />
        </div>
        <template #footer>
            <div style="text-align:center;">
                <Button v-if="exchangeing" :disabled="!isYourTurn" :loading="payModalLoading" type="primary" size="large" @click="exchange">兑换</Button>
                <Button v-if="!exchangeing" :disabled="!isYourTurn" :loading="payModalLoading" type="primary" size="large" @click="pay">确认</Button>
            </div>
        </template>
    </Modal> 
</template>
<script>
import { Modal, Button } from 'view-ui-plus';
import CashBox from './CashBox.vue';
import { exchange,getPlayer } from '../../api/gameApi.js'
import { createWebSocket, closeWebSocket,send } from '../../util/socketUtils.js'
export default {
  name: 'MainIndex',
  emits: ['confirmPay'],
  components: {
    Modal, Button, CashBox
  },
  props: {
    yourPlayerIndex: {
      type: Number,
      default: -1
    },
    otherPlayerIndex: {
      type: Number,
      default: -1
    },
    payAmount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showPayModal: false,
      payModalLoading: false,
      exchangeing:false,
      webSocket: undefined,
      yourPlayer: undefined,
    };
  },
  methods:{
    show(){
        this.showPayModal = true;
    },
    pay(){
        this.payModalLoading = true;
        this.$refs.cashBox.pay(({isSuccess,yourSelectedMoney,otherSelectedMoney})=>{
            console.log("pay finished, isSuccess:",isSuccess);
            if(!isSuccess){
                this.payModalLoading = false;
                return;
            }
            this.$emit('confirmPay',{
                playerIndex:this.yourPlayerIndex,
                yourSelectedMoney,
                otherSelectedMoney,
                successCallback:()=>{
                    this.payModalLoading = false;
                    this.showPayModal=false;
                },
                failCallback:()=>{
                    this.payModalLoading = false;
                }
            });
        });
    },
    exchange(){
        this.payModalLoading = true;
        this.$refs.cashBox.exchange(({isSuccess,yourSelectedMoney,otherSelectedMoney})=>{
            console.log("pay finished, isSuccess:",isSuccess);
            if(!isSuccess){
                this.payModalLoading = false;
                return;
            }
            //传到后台处理兑换
            exchange({playerIndex:this.yourPlayerIndex,yourSelectedMoney,otherSelectedMoney}).then(()=>{
                this.$Message['success']({
                    background: true,
                    content: '兑换成功'
                });
                this.payModalLoading = false;
            }).catch((error)=>{
                console.error("兑换失败：",error);
                this.$Message['error']({
                    background: true,
                    content: '兑换失败'
                });
                this.payModalLoading = false;
            });
        });
    },
    onExchangeingChange(exchangeing){
        this.exchangeing = exchangeing;
    }
  },
  async mounted(){
    this.yourPlayer = await getPlayer(this.yourPlayerIndex);
    this.webSocket = createWebSocket('/ws/game/cashBoxModal',
        (data)=>{
            if (data.action==='showModal' ){
                if(this.showPayModal!==data.modal){
                    this.showPayModal = data.modal
                }
                
            }
            
        });
  },
  unmounted(){
    closeWebSocket(this.webSocket);
  },
  computed:{
    yourName(){
        return this.yourPlayer?.name?this.yourPlayer.name:'';
    },
    isYourTurn(){
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log("yourPlayer:",this.yourPlayer,"userInfo:",userInfo);
        return this.yourPlayer?.userId === userInfo.id;
    }
  },
  watch:{
    showPayModal(nweValue,oldValue){
        console.log("newValue:",nweValue,"oldValue:",oldValue)
        if(!this.isYourTurn){
            return;
        }
        //发送websocket给其他玩家。
        try{
            const sessionId = localStorage.getItem('sessionId');
            send(this.webSocket,{
                sessionId,
                action:'showModal',
                modal:nweValue
            });
            console.log("发了消息了")
        }catch(e){
            console.error(e);
        }
    },
    yourPlayerIndex(newVal,oldVal){
        //本控件有可能没有经历过卸载再重载的过程，而是直接修改了 playerIndex。
        console.log("yourPlayerIndex changed:",newVal,oldVal);
        getPlayer(newVal).then((player)=>{
            this.yourPlayer = player;
        }).catch((error)=>{
            console.error('Error fetching player:', error);
        });
    }
  }
  
}
</script>
<style lang="scss" scoped>
</style>