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
        <Button v-if="!showCellSelector" :disabled="!hasPermission" type="primary" size="large" @click="confirmPayment">确认支付</Button>
        <Button v-if="!showCellSelector" :disabled="!hasPermission" size="large" @click="cancel">取消</Button>
    </div>
    <CashBoxModal otherPlayerIndex="-1" :yourPlayerIndex="playerIndex" :payAmount="500" @confirmPay="pay" ref="cashBoxModal" />
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import CellSelector from './CellSelector.vue';
import { payForSecurityCompany,cancelSecurityCompany,hasRolePermission,getPlayer} from '../../api/gameApi.js'
import { isValidJSON } from '../../util/jsonUtils'

export default {
    name: 'SecurityCompanyComponent',
    emits: ['confirm', 'close'],
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
            yourName:'',
            hasPermission:false,
            webSocket: undefined,
        }
    },
    async mounted(){
        this.hasPermission = await hasRolePermission();
        const player = await getPlayer(this.playerIndex);
        this.yourName = player.name;
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        const token = localStorage . getItem ( 'token' );
        this.webSocket = new WebSocket(`${protocol}//${location.host}/ws/game/securityCompany?token=${token}`);
        this.webSocket.onopen=()=>{
            console.log('WebSocket connected!');
        };
        this.webSocket.onmessage = async (event) => {
            console.log('Received message:', event.data);
            if(!isValidJSON(event.data)){
                return;
            }
            const data = JSON.parse(event.data);
            const sessionId = localStorage.getItem('sessionId');
            if (data.sessionId === sessionId) {
                console.warn('收到了自己发给自己的消息');
                return;
            }
            if (data.action==='showSelector' ){
                this.showCellSelector = data.show
                
            }
        
        };
        this.webSocket.onclose = () => {
            console.log('WebSocket closed!');
        };
        this.webSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    },
    unmounted(){
        try{
            this.webSocket.close();
        }catch(e){
            console.error('error!',e);
        }
    },
    methods: {
        confirmPayment(){
            console.log("confirmPayment...");
            this.$refs.cashBoxModal.show();
        },
        async selectdCell(forwardStep) {
            console.log("selectdCell...",forwardStep);
            if (!this.hasPermission){
                this.$Message.error(`没轮到你，现在请${this.yourName}操作。`);
                return;
            }
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
            const sessionId = localStorage.getItem('sessionId');
            this.webSocket.send(JSON.stringify({action:'showSelector',show:true,sessionId}))
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/message.scss";
</style>