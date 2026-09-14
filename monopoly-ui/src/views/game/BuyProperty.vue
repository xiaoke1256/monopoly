<template>
    <div class="buy-property">
        <p class="question">您是否要{{ forUpgrade ? '升级' : '购买' }}这处店铺？</p>
        <div class="info-card">
            <div class="info-row">
                <span class="info-label">店铺名称</span>
                <span class="info-value name">{{ cell.name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">购买价格</span>
                <span class="info-value price">{{ cell.price }}文</span>
            </div>
            <div class="info-row" v-if="cell.upgradeCost">
                <span class="info-label">升级价格</span>
                <span class="info-value upgrade">{{ cell.upgradeCost }}文</span>
            </div>
            <div class="info-row">
                <span class="info-label">店铺租金</span>
                <span class="info-value rent">{{ rent }}文</span>
            </div>
        </div>
        <div class="action-buttons">
            <Button type="primary" size="large" @click="confirmPurchase">{{ forUpgrade ? '确认升级' : '确认购买' }}</Button>
            <Button size="large" @click="cancelPurchase">{{ forUpgrade ? '取消升级' : '取消购买' }}</Button>
        </div>
    </div>
    <CashBoxModal otherPlayerIndex="-1" :yourPlayerIndex="playerIndex" :payAmount="forUpgrade ? cell.upgradeCost : cell.price" @confirmPay="pay" ref="cashBoxModal" />
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import { payForProperty , payForUpgradeProperty , cancelForProperty , cancelUpgradeProperty } from '../../api/gameApi.js'
export default {
    name: 'BuyPropertyComponent',
    components: {
        Button,CashBoxModal
    },
    props: {
        cell: {
            type: Object,
            default: () => ({})
        },
        forUpgrade: {
            type: Boolean,
            default: false
        },
        playerIndex: {
            type: Number,
            default: -1
        },
    },
    methods: {
        confirmPurchase() {
            this.$refs.cashBoxModal.show();
        },
        async cancelPurchase() {
            try{
                const playerIndex = this.playerIndex;
                let result = {};
                if (this.forUpgrade){
                    result = await cancelUpgradeProperty({playerIndex});
                }else {
                    result = await cancelForProperty({playerIndex});
                }
                console.log('取消支付成功，准备回调父组件:', result);
                this.$emit('cancel',{...result});
            }catch(error){
                console.error('Error processing payment:', error);
            }
            
        },
        async pay({yourSelectedMoney,otherSelectedMoney,successCallback,failCallback}) {
            try{
                const playerIndex = this.playerIndex;
                const cellId = this.cell.id;
                let result = {};
                if (this.forUpgrade){
                    result = await payForUpgradeProperty({cellId,playerIndex,yourSelectedMoney,otherSelectedMoney});
                }else {
                    result = await payForProperty({cellId,playerIndex,yourSelectedMoney,otherSelectedMoney});
                }
                successCallback();
                console.log('支付租金成功，准备回调父组件:', { yourSelectedMoney, otherSelectedMoney });
                this.$emit('confirm',{...result,forUpgrade:this.forUpgrade});
            }catch(error){
                console.error('Error processing payment:', error);
                failCallback();
            }
        }
    },
    computed:{
        rent(){
            return this.cell.rent * Math.pow(2,(this.cell.level-1));
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/buy-property.scss";;
</style>
