<template>
    <div class="selector-containner"  @scroll.passive="handleScroll" ref="selectorContainner">
        <!-- <div style="flex:0 0 20%; border: solid 1px #aaa;" v-for="(cell,index) in cells" :key="index" >
            <div>{{cell.name}}</div>
        </div> -->
        <Card :class="{'cell-card':true,'selected':selectdIndex==index}" v-for="(cell,index) in cells" :key="index" @click="selectd(index+1)" >
            <div style="width: 100%;position: relative;" >
                <div class="cell-containner" >
                    <div v-if="cell.type==='property'" class="color-div" style="width:100%;height:100%;">
                        <div :style="colorStyle(cell)"></div>
                    </div>
                    <img :src="buildingImage(cell)" :style="imageStyle(cell)" width="100%" height="100%" />
                </div>
                <div style="position: relative;text-align: center;font-family: 'STXinwei', 'FZWeibei', 'Weibei SC', 'serif';" >{{cell.name}}</div>
            </div>
        </Card>
    </div>
</template>
<script>
import { getCurrentMap ,getPlayers ,hasRolePermission } from '../../api/gameApi.js'
import {imageMap} from '../../util/imagesMap.js';
import { throttle ,onScrollXAction } from '../../util/scrollUtils.js'
import { createWebSocket, closeWebSocket,send } from '../../util/socketUtils.js'


export default {
    name: 'CellSelectorComponent',
    emits: ['selectd'],
    components: {
    },
    props: {
        playerIndex: {
            type: Number,
            default: -1
        },
    },
    data(){
        return {
            cells:[],
            players:[],
            yourName:'',
            hasPermission:false,
            webSocket: undefined,
            selectdIndex:-1,
        }
    },
    async mounted (){
        this.hasPermission = await hasRolePermission();
        this.webSocket = createWebSocket('/ws/game/cellSelector',(data)=>{
            if (data.action==='scroll' ){
                const scrollRate = data.scrollRate;
                this.$refs.selectorContainner.scrollLeft = this.$refs.selectorContainner.scrollWidth*scrollRate
            }else if (data.action==='selectd'){
                this.selectdIndex = data.selectdIndex;
            }
        });
        const cells = await getCurrentMap();
        this.players = await getPlayers();
        const player = this.players[this.playerIndex]
        this.yourName = player.name;
        const securityCompanyCell = cells.filter((cell)=>cell.type==='security-company')[0];
        const cellsForSelect = cells.slice(securityCompanyCell.position+1,cells.length)
        for(let i = 0;i < 20-(cells.length-securityCompanyCell.position);i++){
            cellsForSelect.push(cells[i]);
        }
        this.cells = cellsForSelect
    },
    unmounted(){
        closeWebSocket(this.webSocket)
    },
    methods:{
        buildingImage(cell){
            if(cell?.type==='property'){
                return imageMap[cell?.buildStyle[`lv${cell?.level}`].image];
            } else {
                return imageMap[cell?.buildingImage]
            }
        },
        imageStyle(cell){
            if(cell.position >30){
                return {width:'110%',transform:'scaleX(-1)'}
            } else{
                return {width:'100%'}
            }
        },
        colorStyle(cell){
            return {...cell.buildStyle[`lv${cell.level}`].colorStyle,background:this.buildingColor(cell)};
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
                if (player.name === '舞姬') return 'limeGreen';
                if (player.name === '大理寺卿') return 'lightcoral';
            }
            return '#aaa';
        },
        selectd(forwardStep){
            if(!this.hasPermission){
                this.$Message.error(`没轮到你，现在请${this.yourName}操作。`);
                return;
            }
            console.log("step:",forwardStep);
            send(this.webSocket,{action:'selectd',selectdIndex:(forwardStep-1)});
            this.selectdIndex = forwardStep-1;
            setTimeout(() => {
                this.$emit('selectd',forwardStep);
            }, 500); 
        },
        handleScroll:throttle(function(e){onScrollXAction(e,(scrollLeft,scrollWidth)=>{
            console.log("scrollLeft:",scrollLeft,"scrollWidth:",scrollWidth);
            send(this.webSocket,{action:'scroll',scrollRate:(scrollLeft/scrollWidth)});
            console.log("发送了webSocket");
        })},200)
    }

}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/cell-selector.scss";;
</style>