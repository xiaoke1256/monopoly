<template>
    <div class="message">
        <div class="message-icon">
            <span class=""></span>
        </div>
            <div class="message-content">
            <p class="message-text">{{ message }}</p>
        </div>
    </div>
    <div class="action-buttons">
        <CellSelector v-if="showCellSelector" @selectd="selectdCell" ></CellSelector>
        <Button v-if="!showCellSelector"  type="primary" size="large" @click="confirmPayment">确认支付</Button>
    </div>
    <CashBoxModal otherPlayerIndex="-1" :yourPlayerIndex="playerIndex" :payAmount="500" @confirmPay="pay" ref="cashBoxModal" />
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import CellSelector from './CellSelector.vue';
import { payForSecurityCompany} from '../../api/gameApi.js'

export default {
    name: 'SecurityCompanyComponent',
    components: {
        Button,CashBoxModal,CellSelector
    },
    props: {
        playerIndex: {
            type: Number,
            default: -1
        },
    },
    data(){
        return {
            message:'先支付500文，然后选择你要到达的地方',
            showCellSelector:false,
            yourSelectedMoney:{},
            otherSelectedMoney:{},
        }
    },
    methods: {
        confirmPayment(){
            console.log("confirmPayment...");
            this.$refs.cashBoxModal.show();
        },
        async selectdCell(forwardStep) {
            console.log("selectdCell...",forwardStep);
            await payForSecurityCompany({
                playerIndex:this.playerIndex,
                yourSelectedMoney:this.yourSelectedMoney,
                otherSelectedMoney:this.otherSelectedMoney,
                forwardStep});
            this.$emit('confirm');

        },
        async cancelPurchase() {
            console.log("cancelPurchase...");
        },
        async pay({yourSelectedMoney,otherSelectedMoney,successCallback,failCallback}) {
            console.log("after pay ... ,",yourSelectedMoney,otherSelectedMoney,successCallback,failCallback);
            this.yourSelectedMoney = yourSelectedMoney;
            this.otherSelectedMoney = otherSelectedMoney;
            successCallback();
            this.showCellSelector = true;
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