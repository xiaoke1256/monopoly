<template>
    <div class="player-avatar" :style="containerStyle">
        <img :src="playerImage" class="player-avatar-img"/>
    </div>
</template>

<script>
export default {
    name: 'PlayerAvatar',
    props: {
        playerIndex: {
            type: String,
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
                    aspectRatio: "1 / 1",
                    background: this.bgColor
                }
            }
            const size = typeof this.size === 'number' ? `${this.size}px` : this.size;
            return {
                width: size,
                height: size,
                background: this.bgColor
            };
        },
        playerImage() {
            // 根据当前玩家索引返回对应的玩家头像
            console.log('当前玩家索引:', this.playerIndex);
            if(this.playerIndex<0){
                return require('@/assets/abacus.svg')
            }
            return this.playerIndex === 0 ? require('@/assets/player1.svg') : require('@/assets/player2.png');
        }
    }
}
</script>

<style lang="scss" scoped>
.player-avatar {
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.player-avatar-img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}
</style>
