<template>
    <div class="diceContainner">
        <div class="dice" @click="doDice" >
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
export default {
  name: 'DiceComponent ',
  props: {
  },
  data(){
    return {
      dice:6
    }
  },
  methods:{
    doDice(limit){
      if(!limit && limit!==0){
        limit=7;
      }
      console.log("limit:",limit);
      if(limit===0){
        return;
      }
      this.$nextTick(()=>{
        this.dice=Math.ceil(Math.random()*6);
        console.log("(9-limit)*100:",((9-limit)*100));
        setTimeout(
          ()=>{
            this.doDice(limit-1)
          }
          ,
          (8-limit)*100
        );
      });
    }
  },
  mounted() {
    this.dice=Math.ceil(Math.random()*6);
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