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
            <Button type="primary" size="large" @click="confirmPayment">确认支付</Button>
        </div>
    </div>
    <Modal
        v-model="showPayModal"
        width="90%"
        class-name="vertical-center-modal"
        @on-ok="pay">
        <div style="height: 100%;padding:4px 0;">
            <CashBox v-if="showPayModal" :otherPlayerIndex="owner.index" :yourPlayerIndex="playerIndex" :payAmount="rentAmount" ref="cashBox" />
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
export default {
    name: 'PayRentComponent',
    components: {
        Button,CashBox
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
            showPayModal:false,
            payModalLoading:false
        }
    },
    mounted(){
        console.log("mounted");
        this.payAmount = this.rentAmount;
    },
    methods: {
        confirmPayment() {
            this.showPayModal=true;
            //this.$emit('confirm');
        },
        pay(){
            this.payModalLoading = true;
            this.$nextTick(()=>{
                console.log("this.$refs.cashBox.exchange:",this.$refs.cashBox.exchange);
                this.$refs.cashBox.exchange(
                    ({isSuccess,yourSelectedMoney,otherSelectedMoney})=>{
                        console.log("exchange finished, isSuccess:",isSuccess);
                        this.payModalLoading = false;
                        if(isSuccess){
                            this.showPayModal = false;
                            console.log('支付租金成功，准备回调父组件:', { yourSelectedMoney, otherSelectedMoney });
                            this.$emit('confirm', { yourSelectedMoney, otherSelectedMoney });
                        }
                    }
                );
            });     
        }
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