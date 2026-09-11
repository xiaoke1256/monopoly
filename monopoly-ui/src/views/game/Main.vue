<template>
    <div class="main">
        <Map ref="map" @game-loaded="onGameLoaded"/>
    </div>
    <Button v-if="!showDiceModal" style="position:absolute;bottom:0;right:0" type="primary" @click="showDiceModal=true" size="large">Continue</Button>
    <GModal
        :show="showDiceModal"
        :maskClosable="true"
        :playerIndex="currentPlayerIndex"
        @update:show="showDiceModal = $event"
        title="掷骰子">
        <Dice @diceRolled="handleDiceRolled"/>
    </GModal> 
    <GModal
        :show="showBuyPropertyModal"
        :playerIndex="currentPlayerIndex"
        title="购买店铺">
        <BuyProperty v-if="showBuyPropertyModal" :cell="currentCell" :playerIndex="currentPlayerIndex" @confirm="afterPayForProperty" @cancel="afterCancelForProperty" />
    </GModal> 
    <GModal
        :show="showUpgradePropertyModal"
        :playerIndex="currentPlayerIndex"
        title="升级店铺">
        <BuyProperty :cell="currentCell" :playerIndex="currentPlayerIndex" :forUpgrade="true" @confirm="afterPayForProperty" @cancel="afterCancelForProperty" />
    </GModal> 
    <GModal
        :show="showPayRentModal"
        :playerIndex="currentPlayerIndex"
        title="支付租金">
        <PayRent :cell="currentCell" :owner="rentOwner" :playerIndex="currentPlayerIndex" :rentAmount="rentAmount" @confirm="afterPayRent" />
    </GModal> 
    <GModal
        :show="showMessageModal"
        :playerIndex="currentPlayerIndex"
        title="消息">
        <Message v-if="showMessageModal" :playerIndex="currentPlayerIndex" :messageType="messageType" @confirm="closeMessageModal" />
    </GModal> 
    <GModal
        :show="showSecurityCompanyModal"
        :playerIndex="currentPlayerIndex"
        title="镖局">
        <SecurityCompany v-if="showSecurityCompanyModal" :playerIndex="currentPlayerIndex" @confirm="afterSelectCell" />
    </GModal> 
    <GModal
        :show="showQuestionModal"
        :playerIndex="currentPlayerIndex"
        title="问答卡">
        <Question v-if="showQuestionModal" :playerIndex="currentPlayerIndex" @close="closeQuestionModal" />
    </GModal> 
    <GModal
        :show="showChanceModal"
        :playerIndex="currentPlayerIndex"
        title="机会卡">
        <Chance v-if="showChanceModal" :playerIndex="currentPlayerIndex" @confirm="closeChanceModal" />
    </GModal>
</template>
<script>
import axios from 'axios';
import Dice from './Dice.vue';
import Map from './Map.vue';
import BuyProperty from './BuyProperty.vue';
import PayRent from './PayRent.vue';
import SecurityCompany from './SecurityCompany.vue';
import Question from './Question.vue';
import { Button } from 'view-ui-plus';
import GModal from '@/components/Modal.vue';
import Message from './Message.vue';
import Chance from './Chance.vue';

export default {
  name: 'MainIndex',
  components: {
    Dice,
    Map,
    BuyProperty,
    PayRent,
    Button,
    Message,
    SecurityCompany,
    Question,
    Chance,
    GModal
  },
  props: {
  },
  data() {
    return {
      showDiceModal:false,
      showBuyPropertyModal:false,
      showUpgradePropertyModal:false,
      showPayRentModal:false,
      showMessageModal:false,
      showSecurityCompanyModal:false,
      showQuestionModal:false,
      showChanceModal:false,
      messageType:'',
      currentCell:{},
      rentOwner:{},
      rentAmount:0,
      currentPlayerIndex: 0,
      loading: false,
      error: null
    };
  },
  mounted() {
    this.checkStatus();
  },
  methods: {
    onGameLoaded(playerIndex) {
        this.currentPlayerIndex = playerIndex;
    },
    checkStatus(){
        axios.get('/api/game/player-status').then(response => {
            const playerStatus = response.data.playerStatus;
            const currentPlayerPosition = response.data.currentPlayerPosition;
            if(playerStatus==='before-dice') {
                const isWaiting = response.data.isWaiting;
                if(isWaiting){
                    this.onPlayerMoveComplete();
                    return
                }
                this.showDiceModal=true;
                console.log('玩家需要掷骰子',this.showDiceModal);
            } else if (playerStatus==='completed'){
                this.endTurn();
            } else {
                this.onPlayerMoveComplete(currentPlayerPosition);
            }
        });
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
    async onPlayerMoveComplete() {
        // 查询后台，以确认后续操作。
        const response = await axios.get(`/api/game/player/${this.currentPlayerIndex}/arrived`);
        console.log('下一回合:', response.data);
        const action = response.data.actionType; // 可能的值: 'buyProperty', 'payRent', 'upgradeProperty', 'drawCard', 'other'
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
        }else if('passGo'===action){
            console.log('玩家经过起点，获得奖励:', response.data.reward);
            this.showMessageModal = true;
        }else if('getSecurityCompany'===action){
            console.log('进入镖局:', response.data);
            this.showSecurityCompanyModal = true;
        }else if('showMessage'===action){
            console.log('显示消息:', response.data);
            this.showMessageModal = true;
            this.messageType = response.data.messageType
        }else if('question'===action){
            console.log('玩家抽取问答卡:', response.data);
            this.showQuestionModal = true;
        }else if('getChance'===action){
            console.log('玩家抽取机会卡:', response.data);
            this.showChanceModal = true;
        }else if('nothing'===action){
            console.log('玩家无需操作，直接结束回合');
            this.endTurn();
        }

    },
    afterPayForProperty({currentPlayerIndex,forUpgrade,isWaiting}){
        //界面上提示“商铺购买成功”
        this.$Modal.success({
            title: `${forUpgrade?'升级':'购买'}成功`,
            content: `您已成功${forUpgrade?'升级':'购买'}该地产！`,
            onOk: () => {
                //重新加载地图
                this.$refs.map.fetchMapData();
                this.currentPlayerIndex = currentPlayerIndex; // 更新当前玩家索引
                if(forUpgrade){
                    this.showUpgradePropertyModal = false;
                }else{
                    this.showBuyPropertyModal = false;
                }
                //TODO 先休眠一下，再显示要切换玩家了。
                if(isWaiting){
                    this.onPlayerMoveComplete();
                    return;
                }
                this.showDiceModal = true; // 显示掷骰子弹窗，开始下一回合
            }
        });
    },
    afterCancelForProperty({action, message, currentPlayerIndex,forUpgrade,isWaiting}) {
        console.log('已取消购买地产:', {action, message, currentPlayerIndex,isWaiting});
        this.$refs.map.fetchMapData();
        if(action==='endTurn'){
            console.log('已取消购买地产 - endTurn:', {action, message, currentPlayerIndex});
            this.currentPlayerIndex = currentPlayerIndex;
            
            if(forUpgrade){
                this.showUpgradePropertyModal = false;
            }else{
                this.showBuyPropertyModal = false;
            }
        }
        if(isWaiting){
            this.onPlayerMoveComplete();
            return;
        }
        this.showDiceModal = true;
    },
    afterPayRent({action, message, currentPlayerIndex,isWaiting}) {
        console.log('支付租金成功:', {action, message, currentPlayerIndex,isWaiting});
        this.$Modal.success({
            title: '支付成功',
            content: `您已成功支付租金 ${this.rentAmount} 文！`,
            onOk: () => {
                this.$refs.map.fetchMapData();
                if(action==='endTurn'){
                    this.currentPlayerIndex = currentPlayerIndex;
                }
                this.showPayRentModal = false;
                if(isWaiting){
                    this.onPlayerMoveComplete();
                    return;
                }
                this.showDiceModal = true;
            }
        });
    },
    closeMessageModal({action, currentPlayerIndex,isWaiting,message}) {
        const doClose = ()=>{
            this.showMessageModal = false;
            if(action==='endTurn' && currentPlayerIndex!=undefined){
                //需要切换玩家
                console.log("here .....")
                this.$refs.map.fetchMapData();
                this.currentPlayerIndex = currentPlayerIndex;
                if(isWaiting){
                    this.onPlayerMoveComplete();
                    return;
                }
                this.showDiceModal = true;
                return;
            }
            //检查当前的状态
            this.checkStatus();
        }
        console.log('玩家关闭消息弹窗:',action,currentPlayerIndex,isWaiting,message);
        
        if (message){
            this.$Modal.success({
                title: '',
                content: message,
                onOk: doClose
            });
        }else{
            doClose();
        }
        
    },
    closeQuestionModal(){
        this.showQuestionModal = false;
        this.checkStatus();
    },
    closeChanceModal(){
         this.showChanceModal = false;
        this.checkStatus();
    },
    afterSelectCell(){
        this.showSecurityCompanyModal = false;
        this.handleDiceRolled();
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
            //
            if(response.data.isWaiting){
                this.onPlayerMoveComplete();
                return;
            }
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