<template>
    <div class="main">
        
        <div class="map-container">
            <div class="map-div">
                <!-- 上边一行 -->
                <div>
                    <div class="corner-top-left">
                        <div class="background" >
                            <img src="@/assets/building.svg" width="100%" height="100%" style="width:100%;height:100%;"/>
                        </div>
                        <div style="position: absolute;left: 65%;top: 25%;font-size: 1.5vh;">柜坊</div>
                        
                    </div>
                    
                </div>
                <div class="top-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(key+1)}`" class="block">
                        <div class="empty-land" >
                            <div class="notice">空地<br/>800文</div>
                        </div>
                        <div class="road road-bg" style="" >
                        </div>
                    </div>
                </div>
                <div>
                    <div class="corner-top-right">
                        <div class="background" >
                            <img src="@/assets/building.svg" width="100%" height="100%" style="width:100%;height:100%;"/>
                        </div>
                        <div style="position: absolute;left: 15%;top: 25%;font-size: 1.5vh;">医馆</div>
                    </div>
                </div>
                <!-- 中间一行 -->
                <div class="side left-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(key+10)}`" class="block">
                        <div class="empty-land" >
                            <div class="notice">空地<br/>800文</div>
                        </div>
                        <div class="road road-bg-v" style="" >
                        </div>
                    </div>
                </div>
                <div class="center"></div>
                <div class="side right-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(39-key)}`" class="block">
                        <div class="road road-bg-v" style="" >
                        </div>
                        <div class="empty-land" >
                            <div class="notice">空地<br/>800文</div>
                        </div>
                    </div>
                </div>
                <!-- 下边一行 -->
                <div>
                    <div class="corner-bottom-left">
                        <div class="background" >
                            <img src="@/assets/building2.svg" width="100%" height="100%" style="width:100%;height:100%;"/>
                        </div>
                        <div style="position: absolute;left: 45%;top: 83%;font-size: 1.5vh;">镖局</div>
                    </div>
                </div>
                <div class="bottom-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(29-key)}`" class="block">
                        <div class="empty-land" >
                            <div class="notice">空地<br/>800文</div>
                        </div>
                        <div class="road road-bg" style="" >
                        </div>
                    </div>
                </div>
                <div>
                    <div class="corner-bottom-right">
                        <div class="background" >
                            <img src="@/assets/building2.svg" width="100%" height="100%" style="width:100%;height:100%;"/>
                        </div>
                        <div style="position: absolute;left: 35%;top: 83%;font-size: 1.5vh;">大理寺</div>
                    </div>
                </div>
            </div>
        </div>    
        <div id="player1" style="z-index: 10;;position: absolute;font-size: 1.5vh;">
            <img src="@/assets/player1.svg" width="5vh" height="5vh" style="width:5vh;height:5vh;"/>
        </div>
    </div>
</template>
<script>
export default {
  name: 'MainIndex',
  props: {
  },
  mounted() {
    this.$nextTick(() => {
        let player1 = document.getElementById('player1');
        let road = document.getElementById('block-1').getElementsByClassName('road')[0];
        if (player1&&road) {
            const rect = road.getBoundingClientRect();
            const top = rect.top + window.scrollY; // 绝对顶部位置
            const left = rect.left + window.scrollX; // 绝对左侧位置
            const width = road.offsetWidth; // 强制浏览器计算布局，确保获取到正确的尺寸
            const height = road.offsetHeight;
            // 对player1进行操作
            console.log("top:", top, "left:", left);
            player1.style.position = 'absolute';
            player1.style.top = (top-height*0.2)+'px';
            player1.style.left = (left+width*0.3)+'px';
        }
    });
  }
}
</script>
<style lang="scss" scoped>
.main{
    height: 100%;
    overflow: hidden;
}
.map-container{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
.map-div {
    max-width: 100vw;
    max-height: 100vh;
    width: 100vmin;
    height: 100vmin;
    background-color: lightblue; 
    display: grid;
    grid-template-columns: 15% 70% 15%;
    grid-template-rows: 15% 70% 15%;
}
.top-side,.bottom-side {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .block {
        width: 11.11%;
        height: 100%;
        background-color: chocolate;
        position: relative;
        .empty-land {
            position: absolute;
            width:100%;
            top: 0;
        }
        .road-bg {
            background-image: url('@/assets/road.svg');
            background-size: cover; // 或 contain，按需
            width:100%;
            aspect-ratio: 1 / 1;
            position: absolute;
            bottom: 0;
        }
    }
}

.side {
    background-color: lightgray;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .block {
        height: 11.11%;
        width: 100%;
        background-color: chocolate;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: relative;
    }
}
.left-side {
    .block {
        .empty-land {
            position: absolute;
            height:100%;
            left: 0;
        }
        .road-bg-v {
            position: absolute;
            right: 0;
            height:100%;
            aspect-ratio: 1 / 1;
        }
    }
}
.right-side {
    .block {
        .empty-land {
            position: absolute;
            height:100%;
            right: 0;
        }
        .road-bg-v {
            position: absolute;
            left: 0;
            height:100%;
            aspect-ratio: 1 / 1;
        }
    }
}

.map-div{
    .center {
        background-color: lavenderblush;
    }
}


.road-bg-v {
  background-image: url('@/assets/road_v.svg');
  background-size: cover; // 或 contain，按需
  aspect-ratio: 1 / 1;
}
.empty-land{
    background-image: url('@/assets/emptyland.svg');
    background-size: cover; // 或 contain，按需 
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .notice{
        margin-top: 5px;
        font-size: 10px;
        color: #333;
    }
}
.corner-top-right {
    width:100%;
    height: 100%;
    position: relative;
    background-color: #D3E6A1;
    background-image: url('@/assets/road-corner.svg');
    background-size: 51.5% 51.5%;
    background-repeat: no-repeat;
    background-position: bottom left;
}
.corner-top-left {
    width:100%;
    height: 100%;
    position: relative;
    .background{
        width:100%;
        height: 100%;
        background-color: #D3E6A1;
        background-image: url('@/assets/road-corner.svg');
        transform: scaleX(-1);
        background-size: 51.5% 51.5%;
        background-repeat: no-repeat;
        background-position: bottom left; 
    }
}
.corner-bottom-right {
    width:100%;
    height: 100%;
    position: relative;
    background-color: #D3E6A1;
    background-image: url('@/assets/road-bottom-corner.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center left;
}
.corner-bottom-left {
    width:100%;
    height: 100%;
    position: relative;
    .background{
        width:100%;
        height: 100%;
        background-color: #D3E6A1;
        background-image: url('@/assets/road-bottom-corner.svg');
        transform: scaleX(-1);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center left;
    }
}

</style>