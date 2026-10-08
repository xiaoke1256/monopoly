<template>
    <Modal
        v-model="showBankruptModal"
        footer-hide
        :closable="false"
        :mask-closable="false">
        <template #header>
            <div style="display:flex;align-items:center;gap:12px;">
                <PlayerAvatar :playerIndex="playerIndex" />
                <span style="font-size:20px;font-weight:600;color:#2d8cf0;">破产</span>
            </div>
        </template>
        <template #default>
            <div style="text-align: center;">{{ bankruptMessage }}</div>
            <div class="action-buttons">
                <Button type="primary" size="large" @click="confirmBankrupt">确定</Button>
                <Button size="large" @click="cancleBankrupt">取消</Button>
            </div>
        </template>
    </Modal>
</template>
<script>
import { Button } from 'view-ui-plus';
import { bankrupt,getPlayers,getBankruptInfos,getBankruptInfo } from '@/api/gameApi.js';
import { createWebSocket, closeWebSocket,send } from '../../util/socketUtils.js'
export default {
    name: 'BankruptComponent',
    emits: ['close'],
    components: {
        Button
    },
    props: {
        playerIndex:{
            type: Number,
            default: -1
        }
    },
    data(){
        return {
            showBankruptModal:false,
            bankruptInfos:[],
            players: [],
            bankruptMessage:'确认要宣布破产？',
            webSocket: undefined,
        }
    },
    mounted(){
        this.webSocket = createWebSocket('/ws/game/bankrupt',(data)=>{
            if (data.action==='showBankruptModal'){
                this.showBankruptModal = data.show;
            }
        });
        getBankruptInfos().then((data)=>{
            console.log("getBankruptInfos data:", data);
            this.bankruptInfos = data.bankruptInfos;
            console.log("this.playerIndex:",this.playerIndex);
            if(this.bankruptInfos.some((info)=>info.playerIndex===this.playerIndex)){
                getBankruptInfo({playerIndex: this.playerIndex}).then((bankruptInfo)=>{
                    this.bankruptMessage = `${bankruptInfo?.message}确认要宣布破产？` || '确认要宣布破产？';
                });
            }
            
        });
        getPlayers().then((players)=>{
            this.players = players;
        });
    },
    unmounted(){
        closeWebSocket(this.webSocket);
    },
    methods:{
        confirmBankrupt(){
            bankrupt({playerIndex:this.playerIndex}).then(({message,endTurn,isGameOver})=>{
                this.bankruptMessage = message;
                setTimeout(()=>{
                    this.showBankruptModal = false;
                    send(this.webSocket,{action:'showBankruptModal',show:false});
                    this.$emit('close',{message,endTurn,isGameOver});
                },500)
            })
        },
        cancleBankrupt(){
            this.showBankruptModal = false;
        },
        openBankruptModal(){
            this.showBankruptModal = true;
            send(this.webSocket,{action:'showBankruptModal',show:true});
        },
        show(){
            this.showBankruptModal = true;
        },
        close(){
            this.showBankruptModal = false;
        }
    },
    computed:{
        isBankrupt(){
            if(!this.bankruptInfos){
                return false;
            }
            const playerInfo = this.bankruptInfos.find((info)=>info.playerIndex===this.playerIndex);
            return !!playerInfo;
        },
        hasPermission(){
            const userId = this.players[this.playerIndex]?.userId;
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            return userId === userInfo.id;
        }
    },
    watch:{
        showBankruptModal(newVal){
            send(this.webSocket,{action:'showBankruptModal',show:newVal});
        },
        playerIndex(newVal){
            if(!this.bankruptInfos){
                this.bankruptMessage = '确认要宣布破产？';
                return;
            }
            getBankruptInfo({playerIndex: newVal}).then((bankruptInfo)=>{
                this.bankruptMessage = `${bankruptInfo?.message}确认要宣布破产？` || '确认要宣布破产？';
            });
        }
    }
}
</script>
<style lang="scss" scoped>
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