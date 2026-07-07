<template>
    <div class="main">
        <Map ref="map" @game-loaded="onGameLoaded"/>
    </div>
    <Button v-if="!showDiceModal" style="position:absolute;bottom:0;right:0" type="primary" @click="showDiceModal=true" size="large">Continue</Button>
    <Modal
        v-model="showDiceModal"
        :closable="false">
        <template #header>
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:48px;height:48px;border-radius:50%;overflow:hidden;background:#f8fafc;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <img :src="playerImage" style="width:100%;height:100%;display:block;object-fit:cover;"/>
                </div>
                <span style="font-size:20px;font-weight:600;color:#2d8cf0;">掷骰子</span>
            </div>
        </template>
        <div style="text-align:center;padding:12px 0;">
            <Dice @diceRolled="handleDiceRolled"/>
        </div>
        <template #footer>
            <div></div>
        </template>
    </Modal> 
    <Modal
        v-model="showBuyPropertyModal"
        :closable="false"
        :mask-closable="false"
        width="520">
        <template #header>
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:48px;height:48px;border-radius:50%;overflow:hidden;background:#f8fafc;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <img :src="playerImage" style="width:100%;height:100%;display:block;object-fit:cover;"/>
                </div>
                <span style="font-size:20px;font-weight:600;color:#2d8cf0;">购买店铺</span>
            </div>
        </template>
        <div style="padding:4px 0;">
            <BuyProperty :cell="currentCell" @confirm="buyProperty" @cancel="endTurn" />
        </div>
        <template #footer>
            <div></div>
        </template>
    </Modal> 
</template>
<script>
import axios from 'axios';
import Dice from './Dice.vue';
import Map from './Map.vue';
import BuyProperty from './BuyProperty.vue';
import { Modal, Button } from 'view-ui-plus';

export default {
  name: 'MainIndex',
  components: {
    Dice,
    Modal,
    Map,
    BuyProperty,
    Button
  },
  props: {
  },
  data() {
    return {
      showDiceModal:true,
      showBuyPropertyModal:false,
      showPayModal:false,
      currentCell:{},
      currentPlayerIndex: 0,
      loading: false,
      error: null
    };
  },
  mounted() {
  },
  methods: {
    onGameLoaded(playerIndex) {
        this.currentPlayerIndex = playerIndex;
    },

    async handleDiceRolled() {
        const response = await axios.get('/api/game/dice-value')
        const diceValue = response.data.dice;
        console.log('骰子点数:', diceValue);

        axios.post(`/api/game/player/${this.currentPlayerIndex}/move`, {
            steps: diceValue
        }).then(response => {
            const newPosition = response.data.newPosition;
            this.$refs.map.movePlayerToBlock(newPosition, () => {
                console.log('玩家移动完成，新位置:', newPosition);
                this.onPlayerMoveComplete(newPosition);
            });
        }).catch(error => {
            console.error('移动玩家失败:', error);
        });
        this.showDiceModal = false;
    },
    async onPlayerMoveComplete(newPosition) {
        console.log('玩家移动完成，新位置:', newPosition);
        // TODO: 在此处添加移动完成后的业务逻辑,购买地产等。
        // 查询后台，以确认后续操作。
        const response = await axios.get(`/api/game/player/${this.currentPlayerIndex}/arrived`);
        console.log('下一回合:', response.data);
        const action = response.data.action; // 可能的值: 'buyProperty', 'payRent', 'upgradeProperty', 'drawCard', 'other'
        if('buyProperty'===action){
            // 处理购买地产逻辑
            console.log('玩家可以购买地产');
            // 打开购买地产的弹窗
            this.currentCell = response.data.cell;
            this.showBuyPropertyModal = true;
        }

    },
    buyProperty() {
        // 处理购买地产逻辑
        console.log('玩家确认购买地产');
        axios.post(`/api/game/player/${this.currentPlayerIndex}/payForProperty`, {
            cellId: this.currentCell.id
        }).then(response => {
            console.log('购买地产成功:', response.data);
            //界面上提示“商铺购买成功”
            this.$Modal.success({
                title: '购买成功',
                content: '您已成功购买该地产！',
                onOk: () => {
                    //重新加载地图
                    this.$refs.map.fetchMapData();
                    this.currentPlayerIndex = response.data.currentPlayerIndex; // 更新当前玩家索引
                    this.showBuyPropertyModal = false;
                    //TODO : 先休眠一下，再显示要切换玩家了。
                    this.showDiceModal = true; // 显示掷骰子弹窗，开始下一回合
                }
            });

        }).catch(error => {
            console.error('购买地产失败:', error);
        });
    },
    endTurn(){
        axios.post(`/api/game/player/${this.currentPlayerIndex}/endTurn`)
        .then(response => {
            console.log('回合结束:', response.data);
            // 处理回合结束后的逻辑，例如切换到下一个玩家
            this.currentPlayerIndex = response.data.currentPlayerIndex; // 更新当前玩家索引
            this.$refs.map.currentPlayerIndex = this.currentPlayerIndex;
            this.showBuyPropertyModal = false;
            this.showDiceModal = true; // 显示掷骰子弹窗，开始下一回合
        })
        .catch(error => {
            console.error('结束回合失败:', error);
        });
    }
  },
  computed: {
        playerImage() {
            // 根据当前玩家索引返回对应的玩家头像
            const playerIndex = this.currentPlayerIndex;
            console.log('当前玩家索引:', playerIndex);
            return playerIndex === 0 ? require('@/assets/player1.svg') : require('@/assets/player2.png');
        }
  }
}
</script>
<style lang="scss" scoped>
.main{
    height: 100%;
    overflow-y: hidden;
}
</style>