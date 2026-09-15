<template>
    <div class="avatar-div" :style="containerStyle">
        <div class="player-avatar" :style="{background: bgColor}">
            <img :src="playerImage" class="player-avatar-img"/>
        </div>
        <div v-if="showName" class="name" >{{playerName}}</div>
    </div>
</template>

<script>
export default {
    name: 'PlayerAvatar',
    props: {
        playerIndex: {
            type: Number,
            required: true
        },
        size: {
            type: [Number, String],
            default: 48
        },
        width:{
            type: [Number, String],
            default: undefined
        },
        bgColor: {
            type: String,
            default: '#f8fafc'
        },
        showName:{
           type:Boolean,
           default:false 
        }
    },
    data(){
        return {
            
        }
    },
    mouthed(){
    },
    computed: {
        containerStyle() {
            if(this.width!==undefined){
                const width = typeof this.width === 'number' ? `${this.width}px` : this.width;
                return {
                    width: width,
                    //background: this.bgColor
                }
            }
            const size = typeof this.size === 'number' ? `${this.size}px` : this.size;
            return {
                width: size,
                height: size,
                //background: this.bgColor
            };
        },
        playerImage() {
            // 根据当前玩家索引返回对应的玩家头像
            console.log('当前玩家索引:', this.playerIndex);
            if(this.playerIndex<0){
                return require('@/assets/abacus.svg')
            }
            return this.playerIndex === 0 ? require('@/assets/player1.svg') : require('@/assets/player2.png');
        },
        playerName(){
             console.log('当前玩家索引:', this.playerIndex);
            if(this.playerIndex<0){
                return '柜坊'
            }
            return this.playerIndex === 0 ? '舞姬' : '大理寺卿';
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/player-avatar.scss";
</style>
