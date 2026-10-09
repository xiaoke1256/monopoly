<template>
    <div class="pay-rent">
        <p class="question">您进入了其他玩家的店铺，需要支付租金</p>
        <div class="info-card">
            <div class="info-row">
                <span class="info-label">店铺名称</span>
                <span class="info-value name">{{ cell.name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">店铺所有者</span>
                <span class="info-value owner">{{ owner.name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">支付租金</span>
                <span class="info-value rent">{{ rentAmount }}文 {{ playerIndex }}</span>
            </div>
        </div>
        <div class="action-buttons">
            <Button v-if="isBankrupt" :disabled="!hasPermission" size="large" @click="openBankruptModal" >宣布破产</Button>
            <Button type="primary" :disabled="isBankrupt||!hasPermission" size="large" @click="confirmPayment">确认支付</Button>
        </div>
    </div>
    <CashBoxModal :otherPlayerIndex="owner.index" :yourPlayerIndex="playerIndex" :payAmount="rentAmount" @confirmPay="pay" ref="cashBoxModal" />
    <Bankrupt :playerIndex="playerIndex" @close="closeBankruptModal" ref="bankruptModal" />
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import Bankrupt from './Bankrupt.vue';
import { payRent,getPayRentEvent,hasRolePermission } from '../../api/gameApi.js'

export default {
    name: 'PayRentComponent',
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
    data(){
        return {
            bankruptPlayerIndexs:[],
            hasPermission:false,
            cell:{},
            owner:{},
            rentAmount:0,
        }
    },
    async mounted(){
        console.log("mounted");
        this.payAmount = this.rentAmount;
        const eventInfo = await getPayRentEvent({playerIndex:this.playerIndex});
        this.cell = eventInfo.cell;
        this.owner = eventInfo.owner;
        this.rentAmount = eventInfo.payAmount;
        this.bankruptPlayerIndexs = eventInfo.bankruptPlayerIndexs
        this.hasPermission = await hasRolePermission()
    },
    methods: {
        confirmPayment() {
            this.$refs.cashBoxModal.show();
        },
        pay({yourSelectedMoney,otherSelectedMoney,successCallback,failCallback}){
            payRent({playerIndex:this.playerIndex, yourSelectedMoney, otherSelectedMoney}).then(({action, message, currentPlayerIndex, isWaiting})=>{
                successCallback();
                this.$emit('confirm', { action, message, currentPlayerIndex, isWaiting }); //执行结果传给父页面
            }).catch((err)=>{
                console.error(err);
                failCallback();
            })
            
        },
        openBankruptModal(){
            console.log("点击了破产按钮")
            this.$refs.bankruptModal.show();
        },
        closeBankruptModal({message,endTurn,isGameOver}){
            this.$refs.bankruptModal.close();
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
@import "@/assets/styles/pay-rent.scss";
</style>