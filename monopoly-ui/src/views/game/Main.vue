<template>
    <div class="main">
        <Map ref="map"/>
    </div>
    <Button v-if="!showModal" style="position:absolute;bottom:0;right:0" type="primary" @click="showModal=true" size="large">Continue</Button>
    <Modal
        v-model="showModal"
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
</template>
<script>
import axios from 'axios';
import Dice from './Dice.vue';
import Map from './Map.vue';
import { Modal, Button } from 'view-ui-plus';

export default {
  name: 'MainIndex',
  components: {
    Dice,
    Modal,
    Map,
    Button
  },
  props: {
  },
  data() {
    return {
      showModal:true,
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
            // console.log(`玩家 ${currentPlayer.name} 移动到位置 ${newPosition}`);
            // const playerDiv = document.getElementById(`player${this.currentPlayerIndex}`);
            // if (playerDiv) {
            //     playerDiv.style.position = 'absolute';
            //     this.moving(playerDiv, currentPlayer.position, newPosition);
            // }
        }).catch(error => {
            console.error('移动玩家失败:', error);
        });
        this.showModal = false;
    },
    onPlayerMoveComplete(newPosition) {
        console.log('玩家移动完成，新位置:', newPosition);
        // TODO: 在此处添加移动完成后的业务逻辑,购买地产等。
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