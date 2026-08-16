<template>
    <div class="main">
        <Map ref="map" @game-loaded="onGameLoaded"/>
    </div>
    <Button v-if="!showDiceModal" style="position:absolute;bottom:0;right:0" type="primary" @click="showDiceModal=true" size="large">Continue</Button>
    <Modal
        v-model="showDiceModal"
        footer-hide
        :closable="false">
        <template #header>
            <div style="display:flex;align-items:center;gap:12px;">
                <PlayerAvatar :playerIndex="currentPlayerIndex" />
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
        footer-hide
        width="520">
        <template #header>
            <div style="display:flex;align-items:center;gap:12px;">
                <PlayerAvatar :playerIndex="currentPlayerIndex" />
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
    <Modal
        v-model="showUpgradePropertyModal"
        :closable="false"
        :mask-closable="false"
        footer-hide
        width="520">
        <template #header>
            <div style="display:flex;align-items:center;gap:12px;">
                <PlayerAvatar :playerIndex="currentPlayerIndex" />
                <span style="font-size:20px;font-weight:600;color:#2d8cf0;">升级店铺</span>
            </div>
        </template>
        <div style="padding:4px 0;">
            <BuyProperty :cell="currentCell" :playerIndex="currentPlayerIndex" :forUpgrade="true" @confirm="upgradeProperty" @cancel="endTurn" />
        </div>
        <template #footer>
            <div></div>
        </template>
    </Modal> 
    <Modal
        v-model="showPayRentModal"
        :closable="false"
        :mask-closable="false"
        footer-hide
        width="520">
        <template #header>
            <div style="display:flex;align-items:center;gap:12px;">
                <PlayerAvatar :playerIndex="currentPlayerIndex" />
                <span style="font-size:20px;font-weight:600;color:#ed4014;">支付租金</span>
            </div>
        </template>
        <div style="padding:4px 0;">
            <PayRent :cell="currentCell" :owner="rentOwner" :playerIndex="currentPlayerIndex" :rentAmount="rentAmount" @confirm="payRent" />
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
import PayRent from './PayRent.vue';
import PlayerAvatar from '@/components/PlayerAvatar.vue';
import { Modal, Button } from 'view-ui-plus';

export default {
  name: 'MainIndex',
  components: {
    Dice,
    Modal,
    Map,
    BuyProperty,
    PayRent,
    Button,
    PlayerAvatar
  },
  props: {
  },
  data() {
    return {
      showDiceModal:false,
      showBuyPropertyModal:false,
      showUpgradePropertyModal:false,
      showPayRentModal:false,
      currentCell:{},
      rentOwner:{},
      rentAmount:0,
      currentPlayerIndex: 0,
      loading: false,
      error: null
    };
  },
  mounted() {
    axios.get('/api/game/player-status').then(response => {
       const playerStatus = response.data.playerStatus;
       const currentPlayerPosition = response.data.currentPlayerPosition;
       if(playerStatus==='before-dice') {
           this.showDiceModal=true;
       } else {
           this.onPlayerMoveComplete(currentPlayerPosition);
       }
    });
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
        }else if ('upgradeProperty'===action) {
            // 处理升级地产逻辑
            console.log('玩家可以升级地产');   
            // 打开升级地产的弹窗
            this.currentCell = response.data.cell;
            this.showUpgradePropertyModal = true;

        }else if('payRent'===action){
            console.log('玩家需要支付租金');
            this.currentCell = response.data.cell;
            this.rentOwner = response.data.owner;
            console.log("this.rentOwner:",this.rentOwner);
            this.rentAmount = response.data.rentAmount;
            this.showPayRentModal = true;
        }else if('nothing'===action){
            console.log('玩家无需操作，直接结束回合');
            this.endTurn();
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
    upgradeProperty({yourSelectedMoney,otherSelectedMoney}){
        // 处理升级地产逻辑
        console.log('玩家确认升级地产');
        axios.post(`/api/game/player/${this.currentPlayerIndex}/payForUpgradeProperty`, {
            cellId: this.currentCell.id,
            yourSelectedMoney,
            otherSelectedMoney
        }).then(response => {
            console.log('升级地产成功:', response.data);
            //界面上提示“商铺升级成功”
            this.$Modal.success({
                title: '升级成功',
                content: '您已成功升级该地产！',
                onOk: () => {
                    //重新加载地图
                    this.$refs.map.fetchMapData();
                    this.currentPlayerIndex = response.data.currentPlayerIndex; // 更新当前玩家索引
                    this.showUpgradePropertyModal = false;
                    //TODO : 先休眠一下，再显示要切换玩家了。
                    this.showDiceModal = true; // 显示掷骰子弹窗，开始下一回合
                }
            });

        }).catch(error => {
            console.error('升级地产失败:', error);
        });
    },
    payRent({yourSelectedMoney,otherSelectedMoney}) {
        console.log('玩家确认支付租金');
        console.log('Received rent payment data:', {yourSelectedMoney,otherSelectedMoney});
        axios.post(`/api/game/player/${this.currentPlayerIndex}/payRent`, {
            cellId: this.currentCell.id,yourSelectedMoney,otherSelectedMoney
        }).then(response => {
            console.log('支付租金成功:', response.data);
            this.$Modal.success({
                title: '支付成功',
                content: `您已成功支付租金 ${this.rentAmount} 文！`,
                onOk: () => {
                    this.$refs.map.fetchMapData();
                    this.currentPlayerIndex = response.data.currentPlayerIndex;
                    this.showPayRentModal = false;
                    this.showDiceModal = true;
                }
            });

        }).catch(error => {
            console.error('支付租金失败:', error);
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
            this.showUpgradePropertyModal = false;
            this.showPayRentModal = false;
            this.showDiceModal = true; // 显示掷骰子弹窗，开始下一回合
        })
        .catch(error => {
            console.error('结束回合失败:', error);
        });
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
.main{
    height: 100%;
    overflow-y: hidden;
}
</style>