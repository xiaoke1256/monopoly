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
                <Button v-if="exchangeing" :loading="payModalLoading" type="primary" size="large" @click="exchange">兑换</Button>
                <Button v-if="!exchangeing" :loading="payModalLoading" type="primary" size="large" @click="pay">确认</Button>
            </div>
        </template>
    </Modal> 
</template>
<script>
import { Modal, Button } from 'view-ui-plus';
import CashBox from './CashBox.vue';
import { exchange } from '../../api/gameApi.js'
export default {
  name: 'MainIndex',
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
  }
  
}
</script>
<style lang="scss" scoped>
</style>