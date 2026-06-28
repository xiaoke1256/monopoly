<template>
    <div class="main">
        
        <div id="map-container" class="map-container">
            <div id="map-div" class="map-div">
                <!-- 上边一行 -->
                <div>
                    <div class="corner-top-left">
                        <div class="background" >
                            <img src="@/assets/building3.svg" width="100%" height="100%" style="width:100%;height:100%;"/>
                        </div>
                        <div style="position: absolute;left: 44%;top: 0%;font-size: 1.5vh;">柜坊</div>
                        
                    </div>
                    
                </div>
                <div class="top-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(key+1)}`" class="block">
                        <div class="empty-land" >
                            <img v-if="cells[key+1]?.type==='property'" src="@/assets/shop.svg" width="100%" height="100%" />
                            <img v-if="cells[key+1]?.type==='utility'" src="@/assets/qifu1.svg" width="100%" height="100%"/>
                            <img v-if="cells[key+1]?.type==='chance'" src="@/assets/chance.svg" width="100%" height="100%"/>
                            <img v-if="cells[key+1]?.type==='question'" src="@/assets/question.svg" width="100%" height="100%"/>
                            <div style="top:-2%;margin-top:11% ;" v-if="cells[key+1]?.type==='property'" class="notice">{{cells[key+1]?.name}}</div>
                        </div>
                        <div class="road road-bg" style="" >
                        </div>
                    </div>
                </div>
                <div>
                    <div class="corner-top-right">
                        <div class="background" >
                            <img src="@/assets/building3.svg" width="100%" height="100%" style="width:100%;height:100%;"/>
                        </div>
                        <div style="position: absolute;left: 44%;top: 0%;font-size: 1.5vh;">医馆</div>
                    </div>
                </div>
                <!-- 中间一行 -->
                <div class="side left-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(39-key)}`" class="block">
                        <div class="road road-bg-v" style="" >
                        </div>
                        <div class="empty-land" >
                            <img v-if="cells[39-key]?.type==='property'" src="@/assets/shop2.svg" width="100%" height="100%"/>
                            <img v-if="cells[39-key]?.type==='utility'" src="@/assets/qifu2.svg" width="100%" height="100%"/>
                            <img v-if="cells[39-key]?.type==='chance'" src="@/assets/chance.svg" width="100%" height="100%"/>
                            <img v-if="cells[39-key]?.type==='question'" src="@/assets/question.svg" width="100%" height="100%"/>
                            <div style="writing-mode: vertical-rl;margin-right:93%;margin-top:-5%" v-if="cells[39-key]?.type==='property'" class="notice">{{cells[39-key]?.name}}</div>
                        </div>
                        
                    </div>
                </div>
                <div class="center"></div>
                <div class="side right-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(key+11)}`" class="block">
                        <div class="road road-bg-v" style="" >
                        </div>
                        <div class="empty-land" >
                            <img v-if="cells[key+11]?.type==='property'" src="@/assets/shop2.svg" width="100%" height="100%"/>
                            <img v-if="cells[key+11]?.type==='utility'" src="@/assets/qifu2.svg" width="100%" height="100%"/>
                            <img v-if="cells[key+11]?.type==='chance'" src="@/assets/chance.svg" width="100%" height="100%"/>
                            <img v-if="cells[key+11]?.type==='question'" src="@/assets/question.svg" width="100%" height="100%"/>
                            <div style="writing-mode: vertical-rl;margin-left:103%;margin-top:-5%" v-if="cells[key+11]?.type==='property'" class="notice">{{cells[key+11]?.name}}</div>
                        </div>
                    </div>
                </div>
                <!-- 下边一行 -->
                <div>
                    <div class="corner-bottom-left">
                        <div class="background" >
                            <img src="@/assets/building4.svg" width="66.67%" height="100%" />
                        </div>
                        <div style="position: absolute;left: 60%;top: 0%;font-size: 1.5vh;">镖局</div>
                    </div>
                </div>
                <div class="bottom-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(29-key)}`" class="block">
                        <div class="empty-land" >
                            <img v-if="cells[29-key]?.type==='property'" src="@/assets/shop.svg" width="100%" height="100%" />
                            <img v-if="cells[29-key]?.type==='utility'" src="@/assets/qifu1.svg" width="100%" height="100%"/>
                            <img v-if="cells[29-key]?.type==='chance'" src="@/assets/chance.svg" width="100%" height="100%"/>
                            <img v-if="cells[29-key]?.type==='question'" src="@/assets/question.svg" width="100%" height="100%"/>
                            <div style="top:-2%;margin-top:11% ;" v-if="cells[29-key]?.type==='property'" class="notice">{{cells[29-key]?.name}}</div>
                        </div>
                        <div class="road road-bg" style="" >
                        </div>
                    </div>
                </div>
                <div>
                    <div class="corner-bottom-right">
                        <div class="background" >
                            <img src="@/assets/building4.svg" width="66.67%" height="100%"/>
                        </div>
                        <div style="position: absolute;left: 23%;top: 0%;font-size: 1.5vh;">大理寺</div>
                    </div>
                </div>
                <div id="other">
                     <div id="player1" style="z-index: 10;position: absolute;font-size: 1.5vh;">
                        <img src="@/assets/player1.svg" width="5vh" height="5vh" style="width:3.5vh;height:7vh;"/>
                    </div>
                    <div id="player2" style="z-index: 11;position: absolute;font-size: 1.5vh;">
                        <img src="@/assets/player2.png" width="5vh" height="5vh" style="width:3.5vh;height:7vh;"/>
                    </div>
                </div>
               
            </div>
            
        </div>   

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
            <Dice/>
        </div>
        <template #footer>
            <div></div>
        </template>
    </Modal> 
</template>
<script>
import axios from 'axios';
import Dice from './Dice.vue';

export default {
  name: 'MainIndex',
  components: {
    Dice
  },
  props: {
  },
  data() {
    return {
      showModal:true,
      cells: [],
      loading: false,
      error: null
    };
  },
  mounted() {
    //从后台读取地图数据
    this.fetchMapData();

    this.playerMoveToBlock(1, 13);
    this.playerMoveToBlock(2, 32);
  },
  methods: {
    async fetchMapData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/map/default');
        this.cells = response.data.map.cells;
        console.log('地图数据已读取:', this.cells);
      } catch (err) {
        this.error = err.message;
        console.error('读取地图数据失败:', err);
      } finally {
        this.loading = false;
      }
    },
    playerMoveToBlock(playerId,blockId) {
        blockId = blockId%40;
        this.$nextTick(() => {
            
            let mapContainer = document.getElementById('map-container');
            let mapDiv = document.getElementById('map-div');
            const skyHeight = mapContainer.offsetHeight-mapDiv.offsetHeight
            const mapContainerRect = mapContainer.getBoundingClientRect();

            let player1 = document.getElementById(`player${playerId}`);
            let block = document.getElementById(`block-${blockId}`);
            if (player1&&!block) {
                const playerHeight = player1.offsetHeight;
                let top = 0; 
                let left = 0; 
                let dWidth = 0; 
                let dHeight = 0;
                if(blockId==0){
                    let road = document.getElementsByTagName('body')[0].getElementsByClassName('corner-top-left')[0];
                    const rect = road.getBoundingClientRect();
                    top = rect.top + window.scrollY; // 绝对顶部位置
                    left = rect.left /*+ window.scrollX*/-mapContainerRect.left; // 绝对左侧位置
                    const width = road.offsetWidth; // 强制浏览器计算布局，确保获取到正确的尺寸
                    const height = road.offsetHeight;
                    const pDWidth = width*0.67*0.2*(playerId-1);
                    const pDHeight = height*0.33*0.2*(playerId-1);
                    dWidth = width*(0.33+0.2*0.33)+pDWidth;
                    dHeight = height*(0.67+0.2*0.67)+pDHeight;

                    // 对player1进行操作
                    console.log("top:", top, "left:", left);
                }else if(blockId==10){
                    let road = document.getElementsByTagName('body')[0].getElementsByClassName('corner-top-right')[0];
                    const rect = road.getBoundingClientRect();
                    top = rect.top + window.scrollY; // 绝对顶部位置
                    left = rect.left /*+ window.scrollX*/-mapContainerRect.left; // 绝对左侧位置
                    const width = road.offsetWidth; // 强制浏览器计算布局，确保获取到正确的尺寸
                    const height = road.offsetHeight;
                    const pDWidth = width*0.67*0.2*(playerId-1);
                    const pDHeight = height*0.33*0.2*(playerId-1);
                    dWidth = width*(0.2)+pDWidth;
                    dHeight = height*(0.67+0.67*0.2)+pDHeight;
                    // 对player1进行操作
                    console.log("top:", top, "left:", left);
                }else if(blockId==20){
                    let road = document.getElementsByTagName('body')[0].getElementsByClassName('corner-bottom-right')[0];
                    const rect = road.getBoundingClientRect();
                    top = rect.top + window.scrollY; // 绝对顶部位置
                    left = rect.left /*+ window.scrollX*/-mapContainerRect.left; // 绝对左侧位置
                    const width = road.offsetWidth; // 强制浏览器计算布局，确保获取到正确的尺寸
                    const height = road.offsetHeight;
                    const pDWidth = width*0.67*0.2*(playerId-1);
                    const pDHeight = height*0.33*0.2*(playerId-1);
                    dWidth = width*(0.2)+pDWidth;
                    dHeight = height*(0.67+0.67*0.2)+pDHeight;
                    // 对player1进行操作
                    console.log("top:", top, "left:", left);
                }else if(blockId==30){
                    let road = document.getElementsByTagName('body')[0].getElementsByClassName('corner-bottom-left')[0];
                    const rect = road.getBoundingClientRect();
                    top = rect.top + window.scrollY; // 绝对顶部位置
                    left = rect.left /*+ window.scrollX*/-mapContainerRect.left; // 绝对左侧位置
                    const width = road.offsetWidth; // 强制浏览器计算布局，确保获取到正确的尺寸
                    const height = road.offsetHeight;
                    const pDWidth = width*0.67*0.2*(playerId-1);
                    const pDHeight = height*0.33*0.2*(playerId-1);
                    dWidth = width*(0.33+0.2*0.33)+pDWidth;
                    dHeight = height*(0.67+0.67*0.2)+pDHeight;
                    // 对player1进行操作
                    console.log("top:", top, "left:", left);
                }
                player1.style.position = 'absolute';
                console.log("即将重新定位","top:",top,"skyHeight:",skyHeight,"playerHeight:",playerHeight,"dHeight:",dHeight);
                player1.style.top = (top-skyHeight-playerHeight+dHeight)+'px';
                player1.style.left = (left+dWidth)+'px';
                return;
            }
            let road = block.getElementsByClassName('road')[0];
            
            if (player1&&road) {
                const rect = road.getBoundingClientRect();
                const top = rect.top + window.scrollY; // 绝对顶部位置
                const left = rect.left /*+ window.scrollX*/-mapContainerRect.left; // 绝对左侧位置
                const width = road.offsetWidth; // 强制浏览器计算布局，确保获取到正确的尺寸
                const height = road.offsetHeight;
                const pDWidth = width*0.2*(playerId-1);
                const pDHeight = height*0.2*(playerId-1)+height*0.4;
                const playerHeight = player1.offsetHeight;
                // 对player1进行操作
                console.log("top:", top, "left:", left,"playerHeight:",playerHeight);
                //alert("top:"+top+ " left:"+left+" playerHeight:"+playerHeight);
                player1.style.position = 'absolute';
                player1.style.top = (top-skyHeight-playerHeight+pDHeight)+'px';
                player1.style.left = (left+width*0.2+pDWidth)+'px';
            }
        });
    }
  }
}
</script>
<style lang="scss" scoped>
.main{
    height: 100%;
    overflow-y: hidden;
}
.map-container{
    height: 100%;
    aspect-ratio: 100 / 53;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    //overflow-y: hidden;
    background: #355197;
    margin: auto;
}
.map-div {
    // max-width: 100vw;
    // max-height: 100vh;
    // width: 100vmin;
    width: 100%;
    height: 94.34%;
    background-color: lightblue; 
    display: grid;
    grid-template-columns: 12.5% 75% 12.5%;
    grid-template-rows: 12.5% 75% 12.5%;
    position: relative;
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
            aspect-ratio: 2 / 1;
            top: 0;
            left: 0;
            img {
                position: absolute;
                left: 0;
                bottom: 0;
                width:100%;
                height: auto;
            }
        }
        .road-bg {
            background-size: cover; // 或 contain，按需
            width:100%;
            aspect-ratio: 4 / 1;
            position: absolute;
            bottom: 0;
        }
    }
}

.top-side {
    .road-bg {
            background-image: url('@/assets/road2.svg');
    }
}

.bottom-side {
    .road-bg {
            background-image: url('@/assets/road-bottom.svg');
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
            aspect-ratio: 2 / 1;
            right: 0;
            img {
                position: absolute;
                right: 0;
                bottom: 0;
                width:110%;
                height: auto;
                transform: scaleX(-1);
            }
        }
        .road-bg-v {
            position: absolute;
            left: 0;
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
            aspect-ratio: 2 / 1;
            left: 0;
            img {
                position: absolute;
                left: 0;
                bottom: 0;
                width:110%;
                height: auto;
            }
        }
        .road-bg-v {
            position: absolute;
            right: 0;
            height:100%;
            aspect-ratio: 1 / 1;
            transform: scaleX(-1);
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
    background-size: 100% 100%; // 或 contain，按需 
    background-repeat: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .notice{
        position: absolute;
        left:0;
        right:0;
        margin-top: 0;
        font-size: 10px;
        color: #333;
    }
}
.corner-top-right {
    width:100%;
    height: 100%;
    position: relative;
    background-color: #D3E6A1;
    background-image: url('@/assets/road-corner2.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom left;
    img{
        position: absolute;
        left: 0;
        bottom: 33.33%;
    }
}
.corner-top-left {
    width:100%;
    height: 100%;
    position: relative;
    .background{
        width:100%;
        height: 100%;
        background-color: #D3E6A1;
        background-image: url('@/assets/road-corner2.svg');
        transform: scaleX(-1);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: bottom left; 
        img{
            position: absolute;
            left: 0;
            bottom: 33.33%;
        }
    }
}
.corner-bottom-right {
    width:100%;
    height: 100%;
    position: relative;
    background-color: #D3E6A1;
    background-image: url('@/assets/road-bottom-corner2.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center left;
    img{
        position: absolute;
        left: 0;
        bottom: 33.33%;
    }
}
.corner-bottom-left {
    width:100%;
    height: 100%;
    position: relative;
    .background{
        width:100%;
        height: 100%;
        background-color: #D3E6A1;
        background-image: url('@/assets/road-bottom-corner2.svg');
        transform: scaleX(-1);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center left;
        img{
            position: absolute;
            left: 0;
            bottom: 33.33%;
        }
    }
}

</style>