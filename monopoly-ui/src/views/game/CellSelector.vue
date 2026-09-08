<template>
    <div class="selector-containner">
        <!-- <div style="flex:0 0 20%; border: solid 1px #aaa;" v-for="(cell,index) in cells" :key="index" >
            <div>{{cell.name}}</div>
        </div> -->
        <Card class="cell-card" v-for="(cell,index) in cells" :key="index" @click="selectd(index+1)" >
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
//import { Card } from 'view-ui-plus';
import { getCurrentMap ,getPlayers } from '../../api/gameApi.js'
import {imageMap} from '../../util/imagesMap.js';

export default {
    name: 'CellSelectorComponent',
    components: {
        //Card
    },
    data(){
        return {
            cells:[],
            players:[],
        }
    },
    async mounted (){
        const cells = await getCurrentMap();
        this.players = await getPlayers();
        const securityCompanyCell = cells.filter((cell)=>cell.type==='security-company')[0];
        const cellsForSelect = cells.slice(securityCompanyCell.position+1,cells.length)
        for(let i = 0;i < 20-(cells.length-securityCompanyCell.position);i++){
            cellsForSelect.push(cells[i]);
        }
        this.cells = cellsForSelect
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
            console.log("step:",forwardStep);
            this.$emit('selectd',forwardStep);
        }
    }

}
</script>
<style lang="scss" scoped>
.selector-containner{
    width: 100%;
    display: flex;
    justify-content: start;
    overflow-x: auto;
    .cell-card{
        flex: 0 0 19%;
        margin: 5px;
        position: relative;
        .cell-containner{
            position: relative;
            width:100%;
            aspect-ratio: 2 / 1;
            right: 0;
            .color-div{
                position: absolute;
                right: 0;
                bottom: 0;
            }
            img{
                position: absolute;
                height: auto;
                right: 0;
                bottom: 0;
            }
        }
    }
}
</style>