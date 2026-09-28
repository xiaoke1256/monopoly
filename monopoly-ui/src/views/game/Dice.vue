<template>
    <div class="diceContainner">
        <div class="dice" disabled="true" @click="doDice" >
          <img v-if="dice===1" style="width:100%;height: 100%;" src="@/assets/dice/one.svg"/>
          <img v-if="dice===2" style="width:100%;height: 100%;" src="@/assets/dice/two.svg"/>
          <img v-if="dice===3" style="width:100%;height: 100%;" src="@/assets/dice/three.svg"/>
          <img v-if="dice===4" style="width:100%;height: 100%;" src="@/assets/dice/four.svg"/>
          <img v-if="dice===5" style="width:100%;height: 100%;" src="@/assets/dice/five.svg"/>
          <img v-if="dice===6" style="width:100%;height: 100%;" src="@/assets/dice/six.svg"/>
        </div>

    </div>
</template>
<script>
import { dice,hasRolePermission,getPlayer,getDiceValue } from '@/api/gameApi.js';
import { isValidJSON } from '../../util/jsonUtils'

export default {
  name: 'DiceComponent ',
  emits: ['diceRolled'],
  props: {
    playerIndex:{
      type: Number,
      default: -1
    }
  },
  data(){
    return {
      dice:6,
      isRolling:false,
      sessionId:'',
      webSocket: undefined,
      modalIsShowing: false,
    }
  },
  methods:{
    async doDice({limit=undefined,ignorePermission=false}={limit:undefined,ignorePermission:false}){
      const hasPermission = await hasRolePermission();
      //检查当前玩家是否权限操作
      if(!ignorePermission && !hasPermission){
        this.$Modal.error(
          {
            title: '没轮到你！',
            content: `现在请${this.playerName}掷骰子。`,
            onOk: ()=>{this.modalIsShowing=false;}
          }
        );
        this.modalIsShowing = true;
        return;
      }
      if(!limit && limit!==0){
        if(this.isRolling){
          return;
        }
        this.isRolling = true;
        limit=7;
        //向后台发送开始掷骰子的消息
        if(hasPermission){
          this.webSocket.send(JSON.stringify({action:'startDice',message:'开始掷骰子',sessionId:this.sessionId}))
        }
      }
      console.log("limit:",limit);
      if(limit===0){
        //如果无权限操作则等待 WebSocket触发。
        if(!hasPermission){
          return;
        }
        this.dice = (await dice());
        setTimeout(
          ()=>{
            this.isRolling = false;
            //关掉窗口，触发下一步事件
            this.webSocket.send(JSON.stringify({action:'onCloseModal',message:'即将关闭窗口',sessionId:this.sessionId}))
            this.$emit('diceRolled',this.dice);
          }
          ,
          1000
        );
        return;
      }
      this.$nextTick(()=>{
        this.dice=Math.ceil(Math.random()*6);
        console.log("(9-limit)*100:",((9-limit)*100));
        setTimeout(
          ()=>{
            this.doDice({limit:limit-1,ignorePermission})
          }
          ,
          (8-limit)*100
        );
      });
    }
  },
  async mounted() {
    this.dice=Math.ceil(Math.random()*6);
    //检查当前玩家是否权限操作,如果没有权限操作则创建webSocket
    this.player = await getPlayer(this.playerIndex);
    this.sessionId = localStorage.getItem('sessionId');

    //开启socket
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const token = localStorage . getItem ( 'token' );
    this.webSocket = new WebSocket(`${protocol}//${location.host}/ws/game/dice?token=${token}`); 
    this.webSocket.onopen=()=>{
      console.log('WebSocket connected!');
    };
    this.webSocket.onmessage = async (event) => {
      console.log('Received message:', event.data);
      if(!isValidJSON(event.data)){
        return;
      }
      const data = JSON.parse(event.data);
      if (data.action==='startDice' ){
        this.doDice({ignorePermission:true});
      } else if( data.action==='diced' ){
        //掷骰子完成，从后台获取 diceValue 触发下一步事件
        const data = await getDiceValue()
        this.dice = data.dice;
        //TODO 播放骰子停止的动画
      } else if( data.action==='onCloseModal' ){
        this.$emit('diceRolled',this.dice);
      }
      
    };
    this.webSocket.onclose = () => {
      console.log('WebSocket closed!');
    };
    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

  },
  unmounted(){
    try{
      this.webSocket.close();
    }catch(e){
      console.error('WebSocket close error:', e);
    }
    if(this.modalIsShowing){
      this.$Modal.remove()
      this.modalIsShowing = false;
    }
  },
  computed:{
    playerName(){
      return this.player.name
    }
  }
}
</script>
<style lang="scss" scoped>
.diceContainner{
  text-align: center;
}
.dice{
  margin: auto;
  border: solid 1px #999;
  border-radius: 5px;
  width: 40px;
  height: 40px;
}
</style>