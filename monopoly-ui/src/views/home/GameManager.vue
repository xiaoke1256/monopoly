<template>
  <div >
    <div >
      <h1 class="title">请选择游戏</h1>
      <select multiple="true" >
        <option v-for="game in games" :key="game._id" >{{game.name}}({{formatDate(game.updatedAt) }})</option>
      </select>
    </div>
    <div class="actions">
      <button @click="$router.push('/game')">开始游戏</button>
    </div>
  </div>
</template>
<script>
import {getValidGames} from '../../api/gameManageApi'
import {formatDate} from '../../util/dateUtils'

export default {
  name: 'GameSelector',
  components: {

  },
  data(){
    return {
      games:[],
    }
  },
  async mounted(){
    this.games = await getValidGames();
  },
  methods:{
    formatDate,
  }
}
</script>