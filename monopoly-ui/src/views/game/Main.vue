<template>
    <div class="main">
        <Map ref="map"/>
    </div>
    <Button v-if="!showDiceModal" style="position:absolute;bottom:0;right:0" type="primary" @click="showDiceModal=true" size="large">Continue</Button>
    <Modal
        v-model="showDiceModal"
        :closable="false">
        <template #header>
            <div>
                <img src="@/assets/player1.svg"  style="width:50px;height:50px;object-fit: cover;margin: 0 auto;"/>
            </div>
        </template>
        <div style="text-align:center">
            <Dice @diceRolled="handleDiceRolled"/>
        </div>
        <template #footer>
            <div></div>
        </template>
    </Modal> 
    <Modal
        v-model="showBuyPropertyModal"
        :closable="false">
        <template #header>
            <div>
                <img src="@/assets/player1.svg"  style="width:50px;height:50px;object-fit: cover;margin: 0 auto;"/>
                <h2>购买店铺</h2>
            </div>
        </template>
        <div style="text-align:center">
            <BuyProperty :cell="currentCell"/>
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
      loading: false,
      error: null
    };
  },
  mounted() {
    
  },
  methods: {

    async handleDiceRolled() {
        const response = await axios.get('/api/game/dice-value')
        const diceValue = response.data.dice;
        console.log('骰子点数:', diceValue);
        
        //const currentPlayer = this.players[this.currentPlayerIndex];
        axios.post(`/api/game/player/${this.$refs.map.currentPlayerIndex}/move`, {
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
        const response = await axios.get(`/api/game/player/${this.$refs.map.currentPlayerIndex}/arrived`);
        console.log('下一回合:', response.data);
        const action = response.data.action; // 可能的值: 'buyProperty', 'payRent', 'upgradeProperty', 'drawCard', 'other'
        if('buyProperty'===action){
            // 处理购买地产逻辑
            console.log('玩家可以购买地产');
            // 打开购买地产的弹窗
            this.currentCell = response.data.cell;
            this.showBuyPropertyModal = true;
        }

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