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
                <span class="info-value rent">{{ rentAmount }}文</span>
            </div>
        </div>
        <div class="action-buttons">
            <Button v-if="isBankrupt" size="large" @click="openBankruptModal" >宣布破产</Button>
            <Button type="primary" :disabled="isBankrupt" size="large" @click="confirmPayment">确认支付</Button>
        </div>
    </div>
    <CashBoxModal :otherPlayerIndex="owner.index" :yourPlayerIndex="playerIndex" :payAmount="rentAmount" @confirmPay="pay" ref="cashBoxModal" />
    <GModal
        :show="showBankruptModal"
        :playerIndex="playerIndex"
        title="破产"
        >
        <Bankrupt v-if="showBankruptModal" :playerIndex="playerIndex" @close="closeBankruptModal" />
    </GModal>
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import Bankrupt from './Bankrupt.vue';
import GModal from '@/components/Modal.vue';
import { payRent,getPayRentEvent } from '../../api/gameApi.js'

export default {
    name: 'PayRentComponent',
    components: {
        Button,CashBoxModal,Bankrupt,GModal
    },
    props: {
        cell: {
            type: Object,
            default: () => ({})
        },
        owner: {
            type: Object,
            default: () => ({})
        },
        playerIndex: {
            type: Number,
            default: -1
        },
        rentAmount: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            showBankruptModal:false,
            bankruptPlayerIndexs:[]
        }
    },
    async mounted(){
        console.log("mounted");
        this.payAmount = this.rentAmount;
        const eventInfo = await getPayRentEvent({playerIndex:this.playerIndex});
        this.bankruptPlayerIndexs = eventInfo.bankruptPlayerIndexs
    },
    methods: {
        confirmPayment() {
            this.$refs.cashBoxModal.show();
        },
        pay({yourSelectedMoney,otherSelectedMoney,successCallback,failCallback}){
            payRent({yourSelectedMoney, otherSelectedMoney}).then(({action, message, currentPlayerIndex, isWaiting})=>{
                successCallback();
                this.$emit('confirm', { action, message, currentPlayerIndex, isWaiting }); //执行结果传给父页面
            }).catch((err)=>{
                console.error(err);
                failCallback();
            })
            
        },
        openBankruptModal(){
            console.log("点击了破产按钮")
            this.showBankruptModal = true;
        },
        closeBankruptModal({message,endTurn,isGameOver}){
            this.showBankruptModal = false;
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
.pay-rent {
    padding: 8px 4px 0;

    .question {
        font-size: 16px;
        color: #333;
        text-align: center;
        margin: 16px 0 20px;
    }

    .info-card {
        background: #f8fafc;
        border: 1px solid #e8eaec;
        border-radius: 8px;
        padding: 12px 20px;
        margin-bottom: 24px;
    }

    .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px dashed #e8eaec;
        font-size: 15px;

        &:last-child {
            border-bottom: none;
        }
    }

    .info-label {
        color: #666;
        font-weight: 500;
    }

    .info-value {
        font-weight: 600;

        &.name {
            color: #2d8cf0;
            font-size: 16px;
        }

        &.owner {
            color: #19be6b;
        }

        &.rent {
            color: #ed4014;
            font-size: 18px;
        }
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 16px;

        .ivu-btn {
            min-width: 120px;
            font-size: 15px;
        }
    }
}
</style>