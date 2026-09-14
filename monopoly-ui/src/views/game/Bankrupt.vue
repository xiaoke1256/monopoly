<template>
    <div style="text-align: center;">{{ bankruptMessage }}</div>
    <div class="action-buttons">
        <Button type="primary" size="large" @click="confirmBankrupt">确定</Button>
        <Button size="large" @click="cancleBankrupt">取消</Button>
    </div>
</template>
<script>
import { Button } from 'view-ui-plus';
import { bankrupt,getBankruptInfo } from '@/api/gameApi.js';
export default {
    name: 'BankruptComponent',
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
            bankruptMessage:'确认要宣布破产？'
        }
    },
    mounted(){
        getBankruptInfo({playerIndex:this.playerIndex}).then(({message})=>{
            this.bankruptMessage = `${message}确认要宣布破产？`;
        });
    },
    methods:{
        confirmBankrupt(){
            bankrupt({playerIndex:this.playerIndex}).then(({message,endTurn,isGameOver})=>{
                this.bankruptMessage = message;
                setTimeout(()=>{
                    this.$emit('close',{message,endTurn,isGameOver});
                    // this.showBankruptModal = false;
                    // if(endTurn){
                    //     this.$emit('close',{message,endTurn,isGameOver});
                    // }
                },500)
            })
        },
        cancleBankrupt(){
            this.$emit('close',{});
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