<template>
  <div >
    <div >
      <h1 class="title">请选择游戏</h1>
      <select multiple="true" v-model="selected" >
        <option v-for="game in games" :key="game._id" :value="game._id" >{{game.name}}({{formatDate(game.updatedAt) }})</option>
      </select>
    </div>
    <div class="actions">
      <Button type="primary" size="large"  @click="startGame">开始游戏</Button>
    </div>
  </div>
</template>
<script>
import {getValidGames,startExistGame} from '../../api/gameManageApi'
import {formatDate} from '../../util/dateUtils'

export default {
  name: 'GameSelector',
  components: {

  },
  data(){
    return {
      games:[],
      selected:''
    }
  },
  async mounted(){
    this.games = await getValidGames();
  },
  methods:{
    formatDate,
    async startGame(){
      const gameId = this.selected[0];
      const result = await startExistGame({gameId})
      if(result.success){
        this.$router.push('/game');
      }
    }
  }
}
</script>