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
        <Button v-if="!showCellSelector"  size="large" @click="cancel">取消</Button>
    </div>
    <CashBoxModal otherPlayerIndex="-1" :yourPlayerIndex="playerIndex" :payAmount="500" @confirmPay="pay" ref="cashBoxModal" />
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import CellSelector from './CellSelector.vue';
import { payForSecurityCompany,cancelSecurityCompany} from '../../api/gameApi.js'

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
        async cancel() {
            console.log("cancel...");
            await cancelSecurityCompany({playerIndex:this.playerIndex});
            this.$emit('close');
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
@import "@/assets/styles/message.scss";
</style>