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
                <span class="info-value rent">{{ cell.rent }}文</span>
            </div>
        </div>
        <div class="action-buttons">
            <Button type="primary" size="large" @click="confirmPurchase">{{ forUpgrade ? '确认升级' : '确认购买' }}</Button>
            <Button size="large" @click="cancelPurchase">取消购买</Button>
        </div>
    </div>
</template>
<script>
import { Button } from 'view-ui-plus';
export default {
    name: 'BuyPropertyComponent',
    components: {
        Button
    },
    props: {
        cell: {
            type: Object,
            default: () => ({})
        },
        forUpgrade: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        confirmPurchase() {
            this.$emit('confirm');
        },
        cancelPurchase() {
            this.$emit('cancel');
        }
    }
}
</script>
<style lang="scss" scoped>
.buy-property {
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

        &.price {
            color: #ff9900;
        }

        &.upgrade {
            color: #19be6b;
        }

        &.rent {
            color: #ed4014;
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
