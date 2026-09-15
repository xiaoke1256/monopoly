<template>
    <div id="map-container" class="map-container">
            <div id="map-div" class="map-div">
                <!-- 上边一行 -->
                <div>
                    <div class="corner-top-left">
                        <div class="background" >
                            <img src="@/assets/building3.svg" width="100%" height="100%" style="width:100%;height:100%;"/>
                        </div>
                        <div class="notice">柜坊</div>
                        
                    </div>
                    
                </div>
                <div class="top-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(key+1)}`" class="block">
                        <div class="empty-land" >
                            <div v-if="cells[key+1]?.type==='property'" style="width:100%;height:100%;">
                                <div :style="colorStyle(cells[key+1])"></div>
                            </div>
                            <img :src="buildingImage(cells[key+1])" width="100%" height="100%" />
                            <div :style="textStyle(cells[key+1])" v-if="cells[key+1]?.type==='property'" class="notice">{{cells[key+1]?.name}}</div>
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
                        <div class="notice">医馆</div>
                    </div>
                </div>
                <!-- 中间一行 -->
                <div class="side left-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(39-key)}`" class="block">
                        <div class="road road-bg-v" style="" >
                        </div>
                        <div class="empty-land" >
                            <div v-if="cells[39-key]?.type==='property'" style="width:100%;height:100%;">
                                <div :style="colorStyle(cells[39-key])"></div>
                            </div>
                            <img :src="buildingImage(cells[39-key])" width="100%" height="100%"/>
                            <div :style="textStyle(cells[39-key])" v-if="cells[39-key]?.type==='property'" class="notice">{{cells[39-key]?.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="center"></div>
                <div class="side right-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(key+11)}`" class="block">
                        <div class="road road-bg-v" style="" >
                        </div>
                        <div class="empty-land" >
                            <div v-if="cells[key+11]?.type==='property'" style="width:100%;height:100%;">
                                <div :style="colorStyle(cells[key+11])"></div>
                            </div>
                            <img :src="buildingImage(cells[key+11])" width="100%" height="100%"/>
                            <div :style="textStyle(cells[key+11])" v-if="cells[key+11]?.type==='property'" class="notice">{{cells[key+11]?.name}}</div>
                        </div>
                    </div>
                </div>
                <!-- 下边一行 -->
                <div>
                    <div class="corner-bottom-left">
                        <div class="background" >
                            <img src="@/assets/building4.svg" width="66.67%" height="100%" />
                        </div>
                        <div class="notice">镖局</div>
                    </div>
                </div>
                <div class="bottom-side">
                    <div v-for="key in [...Array(9).keys()]" :key="key" :id="`block-${(29-key)}`" class="block">
                        <div class="empty-land" >
                            <div v-if="cells[29-key]?.type==='property'" style="width:100%;height:100%;">
                                <div :style="colorStyle(cells[29-key])"></div>
                            </div>
                            <img :src="buildingImage(cells[29-key])" width="100%" height="100%" />
                            <div :style="textStyle(cells[29-key])" v-if="cells[29-key]?.type==='property'" class="notice">{{cells[29-key]?.name}}</div>
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
                        <div class="notice">大理寺</div>
                    </div>
                </div>
                <div id="other">
                     <div v-for="(player,index) in players" :key="index"  :id="`player${index}`" style="z-index: 10;position: absolute;font-size: 1.5vh;">
                        <img :src="playerImage(player)" width="5vh" height="5vh" style="width:3.5vh;height:7vh;"/>
                    </div>
                </div>
               
            </div>
            
        </div>   
</template>
<script>
import axios from 'axios';
import { animate } from 'animejs';
import {imageMap} from '../../util/imagesMap.js';

export default {
    name: 'MapComponent',
    props: {
    },
    data(){
        return {
            cells: [],
            players: [],
            currentPlayerIndex: 0,
            loading: false,
            error: null
        }
    },
    mounted() {
        this.fetchMapData();
    },
    methods:{
        async fetchMapData() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('/api/game/current');
                console.log('地图数据已读取:', response);
                const gameData = response?.data?.game;
                this.currentPlayerIndex = gameData.currentPlayerIndex;
                this.cells = gameData.cells;
                this.players = gameData.players;
                console.log('玩家数据已读取:', this.players);
                for(let i = 0; i < this.players.length; i++){
                    this.locatePlayerToBlock(i, this.players[i].position);
                }
                console.log('地图数据已读取:', this.cells);
            } catch (err) {
                this.error = err.message;
                console.error('读取地图数据失败:', err);
            } finally {
                this.loading = false;
                this.$emit('game-loaded', this.currentPlayerIndex);
            }
        },
        getLocationOfPlayer(playerIdx,blockId) {
            blockId = blockId%40;
            let mapContainer = document.getElementById('map-container');
            let mapDiv = document.getElementById('map-div');
            const skyHeight = mapContainer.offsetHeight-mapDiv.offsetHeight
            const mapContainerRect = mapContainer.getBoundingClientRect();

            let playerDiv = document.getElementById(`player${playerIdx}`);
            let block = document.getElementById(`block-${blockId}`);
            if (playerDiv&&!block) {
                const playerHeight = playerDiv.offsetHeight;
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
                    const pDWidth = width*0.67*0.2*(playerIdx);
                    const pDHeight = height*0.33*0.2*(playerIdx)+height*0.33*0.2;
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
                    const pDWidth = width*0.67*0.2*(playerIdx);
                    const pDHeight = height*0.33*0.2*(playerIdx)+height*0.33*0.2;
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
                    const pDWidth = width*0.67*0.2*(playerIdx);
                    const pDHeight = height*0.33*0.2*(playerIdx);
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
                    const pDWidth = width*0.67*0.2*(playerIdx);
                    const pDHeight = height*0.33*0.2*(playerIdx);
                    dWidth = width*(0.33+0.2*0.33)+pDWidth;
                    dHeight = height*(0.67+0.67*0.2)+pDHeight;
                    // 对player1进行操作
                    console.log("top:", top, "left:", left);
                }
                return {left: left+dWidth, top: top-skyHeight-playerHeight+dHeight};
            }
            let road = block.getElementsByClassName('road')[0];
            
            if (playerDiv&&road) {
                const rect = road.getBoundingClientRect();
                const top = rect.top + window.scrollY; // 绝对顶部位置
                const left = rect.left /*+ window.scrollX*/-mapContainerRect.left; // 绝对左侧位置
                const width = road.offsetWidth; 
                const height = road.offsetHeight;
                const pDWidth = width*0.2*(playerIdx);
                const pDHeight = height*0.2*(playerIdx)+height*0.5;
                const playerHeight = playerDiv.offsetHeight;
                // 对player1进行操作
                console.log("top:", top, "left:", left,"playerHeight:",playerHeight);
                //alert("top:"+top+ " left:"+left+" playerHeight:"+playerHeight);
                return {left: left+width*0.2+pDWidth, top: top-skyHeight-playerHeight+pDHeight};
            }
        },
        locatePlayerToBlock(playerIdx,blockId) {
            this.$nextTick(() => {
                const location = this.getLocationOfPlayer(playerIdx,blockId);
                let playerDiv = document.getElementById(`player${playerIdx}`);
                playerDiv.style.position = 'absolute';
                playerDiv.style.top = location.top+'px';
                playerDiv.style.left = location.left+'px';
            });
        },
        async moving(playerDiv,curPosition,targetPosition,callback) {
            console.log("curPosition,targetPosition:",curPosition,targetPosition);
            if(curPosition==targetPosition) {
                this.players[this.currentPlayerIndex].position = targetPosition;
                if (callback) callback(targetPosition);
                return;
            }
            const newPosition = (curPosition + 1)%this.cells.length;
            const location = this.getLocationOfPlayer(this.currentPlayerIndex, newPosition);
            playerDiv.style.position = 'absolute';
            animate(`#player${this.currentPlayerIndex}`, {
                top: location.top + 'px',
                left: location.left + 'px',
                duration: 500,
                easing: 'easeInOutQuad',
                onBegin: (/*animation*/) => {
                    console.log('动画开始');
                },
                onUpdate: (/*animation*/) => {
                    // 动画每一帧执行
                },
                onComplete: (/*animation*/) => {
                    this.moving(playerDiv,newPosition,targetPosition,callback);
                }
            });

        },
        movePlayerToBlock(targetPosition, callback) {
            const currentPlayer = this.players[this.currentPlayerIndex];
            const playerDiv = document.getElementById(`player${this.currentPlayerIndex}`);
            if (!playerDiv) {
                console.error(`未找到玩家${this.currentPlayerIndex}的DOM元素`);
                return;
            }
            this.moving(playerDiv, currentPlayer.position, targetPosition,callback);
        },
        buildingColor(cell) {
            //const cell = this.cells[position];
            console.log("cell:", cell);
            if (!cell || !cell.owner) return '#aaa';
            let ownerId = cell.owner;
            console.log("ownerId:", ownerId);
            console.log("typeof ownerId:", typeof ownerId);
            if (typeof ownerId === 'object' && ownerId !== null) {
                ownerId = ownerId.id || ownerId._id || Object.values(ownerId)[0];
            }
            const player = this.players.find(p => String(p._id) === String(ownerId));
            console.log("player:", player);
            if (player) {
                return player.color;
            }
            return '#aaa';
        },
        buildingImage(cell){
            if(cell?.type==='property'){
                return imageMap[cell?.buildStyle[`lv${cell?.level}`].image];
            } else {
                return imageMap[cell?.buildingImage]
            }
        },
        textStyle(cell){
            return cell.buildStyle[`lv${cell.level}`].textStyle;
        },
        colorStyle(cell){
            return {...cell.buildStyle[`lv${cell.level}`].colorStyle,background:this.buildingColor(cell)};
        },
        playerImage(player){
            return imageMap[player?.image];
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/map.scss";
</style>