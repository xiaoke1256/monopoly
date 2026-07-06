<template>
    <div class="buy-property-containner">
        <p>您是否要购买这处店铺？</p>
        <p>店铺名称: {{ cell.name }}</p>
        <p>购买价格: {{ cell.price }}</p>
        <p>升级价格: {{ cell.upgradeCost }}</p>
        <p>店铺租金: {{ cell.rent }}</p>
        <Button type="primary" @click="confirmPurchase">确认购买</Button>
        <Button type="default" @click="cancelPurchase">取消购买</Button>
    </div>
</template>
<script>
import { Button } from 'view-ui-plus';
export default {
    name: 'BuyPropertyComponent ',
    components: {
        Button
    },
    props: {
        cell:{}
    },
    methods: {
        confirmPurchase() {
            // 处理确认购买逻辑
        },
        cancelPurchase() {
            // 处理取消购买逻辑
        }
    }
}
</script>
<style lang="scss" scoped>
</style>