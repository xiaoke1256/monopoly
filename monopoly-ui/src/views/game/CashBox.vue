<template>
    <div class="cash-box-container">
        <div id="otherBox" class="cash-box" >
            <img v-for="i in other.cash20-other.selected.cash20" @click="selectOtherBox(20,i,other.cash20-other.selected.cash20)" :key="i" src="@/assets/cash/cash-20.svg" :style="otherCashPosition(20, i)" />
            <img class="selected" data-denomination="20" v-for="i in other.selected.cash20" @click="unSelectOtherBox(20,i,other.selected.cash20)" :key="i" src="@/assets/cash/cash-20.svg" :style="otherCashPosition(20, (i+other.cash20-other.selected.cash20),true)" />

            <img v-for="i in other.cash100-other.selected.cash100" @click="selectOtherBox(100,i,other.cash100-other.selected.cash100)" :key="i" src="@/assets/cash/cash-100.svg" :style="otherCashPosition(100, i)" />
            <img class="selected" data-denomination="100" v-for="i in other.selected.cash100" @click="unSelectOtherBox(100,i,other.selected.cash100)" :key="i" src="@/assets/cash/cash-100.svg" :style="otherCashPosition(100, (i+other.cash100-other.selected.cash100),true)" />

            <img v-for="i in other.cash200-other.selected.cash200" @click="selectOtherBox(200,i,other.cash200-other.selected.cash200)" :key="i" src="@/assets/cash/cash-200.svg" :style="otherCashPosition(200, i)" />
            <img class="selected" data-denomination="200" v-for="i in other.selected.cash200" @click="unSelectOtherBox(200,i,other.selected.cash200)" :key="i" src="@/assets/cash/cash-200.svg" :style="otherCashPosition(200, (i+other.cash200-other.selected.cash200),true)" />

            <img v-for="i in other.cash500-other.selected.cash500" @click="selectOtherBox(500,i,other.cash500-other.selected.cash500)" :key="i" src="@/assets/cash/cash-500.svg" :style="otherCashPosition(500, i)" />
            <img class="selected" data-denomination="500" v-for="i in other.selected.cash500" @click="unSelectOtherBox(500,i,other.selected.cash500)" :key="i" src="@/assets/cash/cash-500.svg" :style="otherCashPosition(500, (i+other.cash500-other.selected.cash500),true)" />

            <img v-for="i in other.cash1000-other.selected.cash1000" @click="selectOtherBox(1000,i,other.cash1000-other.selected.cash1000)" :key="i" src="@/assets/cash/cash-1000.svg" :style="otherCashPosition(1000, i)" />
            <img class="selected" data-denomination="1000" v-for="i in other.selected.cash1000" @click="unSelectOtherBox(1000,i,other.selected.cash1000)" :key="i" src="@/assets/cash/cash-1000.svg" :style="otherCashPosition(1000, (i+other.cash1000-other.selected.cash1000),true)" />
        </div>
        <div id="yourBox" class="cash-box" >
            <img v-for="i in you.cash20-you.selected.cash20" @click="selectYourBox(20,i,you.cash20-you.selected.cash20)" :key="i" src="@/assets/cash/cash-20.svg" :style="cashPosition(20, i)" />
            <img v-for="i in you.selected.cash20" @click="unSelectYourBox(20,i,you.selected.cash20)" :key="i" src="@/assets/cash/cash-20.svg" :style="cashPosition(20, (i+you.cash20-you.selected.cash20),true)" />
            
            <img v-for="i in you.cash100-you.selected.cash100" @click="selectYourBox(100,i,you.cash100-you.selected.cash100)" :key="i" src="@/assets/cash/cash-100.svg" :style="cashPosition(100, i)" />
            <img v-for="i in you.selected.cash100" @click="unSelectYourBox(100,i,you.selected.cash100)" :key="i" src="@/assets/cash/cash-100.svg" :style="cashPosition(100, (i+you.cash100-you.selected.cash100),true)" />
            
            <img v-for="i in you.cash200-you.selected.cash200" @click="selectYourBox(200,i,you.cash200-you.selected.cash200)" :key="i" src="@/assets/cash/cash-200.svg" :style="cashPosition(200, i)" />
            <img v-for="i in you.selected.cash200" @click="unSelectYourBox(200,i,you.selected.cash200)" :key="i" src="@/assets/cash/cash-200.svg" :style="cashPosition(200, (i+you.cash200-you.selected.cash200),true)" />

            <img v-for="i in you.cash500-you.selected.cash500" @click="selectYourBox(500,i,you.cash500-you.selected.cash500)" :key="i" src="@/assets/cash/cash-500.svg" :style="cashPosition(500, i)" />
            <img v-for="i in you.selected.cash500" @click="unSelectYourBox(500,i,you.selected.cash500)" :key="i" src="@/assets/cash/cash-500.svg" :style="cashPosition(500, (i+you.cash500-you.selected.cash500),true)" />
            
            <img v-for="i in you.cash1000-you.selected.cash1000" @click="selectYourBox(1000,i,you.cash1000-you.selected.cash1000)"  :key="i" src="@/assets/cash/cash-1000.svg" :style="cashPosition(1000, i)" />
            <img v-for="i in you.selected.cash1000" @click="unSelectYourBox(1000,i,you.selected.cash1000)" :key="i" src="@/assets/cash/cash-1000.svg" :style="cashPosition(1000, (i+you.cash1000-you.selected.cash1000),true)" />
        </div>
        <div>
            <Button type="primary" @click="exchange" >交换</Button>
        </div>
    </div>
</template>
<script>
import { Button } from 'view-ui-plus';
import { animate } from 'animejs';

export default {
    name: 'CashBoxComponent',
    components: {Button},
    data(){
        return {
            other:{
                cash20:20,
                cash100:20,
                cash200:20,
                cash500:20,
                cash1000:20,
                selected:{
                    cash20:0,
                    cash100:0,
                    cash200:0,
                    cash500:0,
                    cash1000:0,
                }
            },
            you:{
                cash20:10,
                cash100:20,
                cash200:5,
                cash500:0,
                cash1000:2,
                selected:{
                    cash20:0,
                    cash100:0,
                    cash200:0,
                    cash500:0,
                    cash1000:0,
                }
            }
        }
    },
    methods:{
        cashPosition(denomination,index,isSelected=false ){
            let pos = 0;
            switch(denomination){
                case 20:
                    pos = 1;
                    break;
                case 100:
                    pos = 2;
                    break;
                case 200:
                    pos = 3;
                    break;
                case 500:
                    pos = 4;
                    break;
                case 1000:
                    pos = 5;
                    break;
            }
            return {
                left: (2+pos*(10+2.25))+'%',
                bottom: (7+index*0.5+(isSelected?15:0))+'%',
                xTop: (7-5+index*0.5+(isSelected?15:0))+'%'
            }
        },
        otherCashPosition(denomination,index,isSelected=false ){
            let pos = 0;
            switch(denomination){
                case 20:
                    pos = 6;
                    break;
                case 100:
                    pos = 5;
                    break;
                case 200:
                    pos = 4;
                    break;
                case 500:
                    pos = 3;
                    break;
                case 1000:
                    pos = 2;
                    break;
            }
            return {
                left: (2+pos*(10+2.25))+'%',
                top: (7+index*0.5+(isSelected?15:0))+'%'
            }
        },
        selectYourBox(denomination,currentIndex,maxIndex,isUnSelect=false){
            if(currentIndex!=maxIndex){
                return;
            }
            const boxSelect = this.you.selected;
            switch(denomination){
                case 20:
                    if(!isUnSelect){
                        boxSelect.cash20 ++;
                    }else{
                        boxSelect.cash20 --
                    }
                    break;
                case 100:
                    if(!isUnSelect){
                        boxSelect.cash100 ++;
                    }else{
                        boxSelect.cash100 --
                    }
                    break;
                case 200:
                    if(!isUnSelect){
                        boxSelect.cash200 ++;
                    }else{
                        boxSelect.cash200 --
                    }
                    break;
                case 500:
                    if(!isUnSelect){
                        boxSelect.cash500 ++;
                    }else{
                        boxSelect.cash500 --
                    }
                    break;
                case 1000:
                    if(!isUnSelect){
                        boxSelect.cash1000 ++;
                    }else{
                        boxSelect.cash1000 --
                    }
                    break;
            }

        },
        unSelectYourBox(denomination,currentIndex,maxIndex){
            this.selectYourBox(denomination,currentIndex,maxIndex,true);
        },
        selectOtherBox(denomination,currentIndex,maxIndex,isUnSelect=false){
            if(currentIndex!=maxIndex){
                return;
            }
            const boxSelect = this.other.selected;
            switch(denomination){
                case 20:
                    if(!isUnSelect){
                        boxSelect.cash20 ++;
                    }else{
                        boxSelect.cash20 --
                    }
                    break;
                case 100:
                    if(!isUnSelect){
                        boxSelect.cash100 ++;
                    }else{
                        boxSelect.cash100 --
                    }
                    break;
                case 200:
                    if(!isUnSelect){
                        boxSelect.cash200 ++;
                    }else{
                        boxSelect.cash200 --
                    }
                    break;
                case 500:
                    if(!isUnSelect){
                        boxSelect.cash500 ++;
                    }else{
                        boxSelect.cash500 --
                    }
                    break;
                case 1000:
                    if(!isUnSelect){
                        boxSelect.cash1000 ++;
                    }else{
                        boxSelect.cash1000 --
                    }
                    break;
            }

        },
        unSelectOtherBox(denomination,currentIndex,maxIndex){
            this.selectOtherBox(denomination,currentIndex,maxIndex,true);
        },
        exchange(){
            const cashes = document.getElementById('otherBox').getElementsByClassName('selected');
            if(cashes && cashes.length>0){
                const  hasNext = cashes.length>1;
                console.log("cashes:",cashes)
                var cashesArray = Array.from(cashes);
                const cash = cashesArray.pop();
                const denomination = parseInt(cash.dataset.denomination);
                console.log("denomination:",denomination);

                const pos = getRelativePosition(cash,document.getElementById('yourBox'))
                console.log("pos:",pos);
                //把cash 从otherBox中摘除，移到yourBox中去
                cash.style.top=pos.top;
                cash.style.left=pos.left;
                cash.parentNode.removeChild(cash);
                document.getElementById('yourBox').appendChild(cash);
                this.$nextTick(()=>{
                    //算出新的位置
                    const newPos = this.cashPosition(denomination,this.you[`cash${denomination}`]+1)
                    console.log("newPos:",newPos);
                    animate(cash,{
                        top: newPos.xTop,
                        left: newPos.left,
                        duration: 500,
                        easing: 'easeInOutQuad',
                        onBegin: (/*animation*/) => {
                            console.log('动画开始');
                        },
                        onUpdate: (/*animation*/) => {
                            // 动画每一帧执行
                        },
                        onComplete: (/*animation*/) => {
                            console.log('动画结束');
                            //cash.classList.remove("selected");
                            this.other.selected[`cash${denomination}`] --;
                            this.other[`cash${denomination}`] --;
                            this.you[`cash${denomination}`] ++;
                            //移动下一枚钱币
                            if(hasNext){
                                this.$nextTick(()=>{
                                    this.exchange();
                                });
                            }
                        }
                    })
                });
                    
                
            }
        },
    }
}

function getRelativePosition(element, relativeToElement) {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY; 
    const left = rect.left + window.scrollX;

    const toRect = relativeToElement.getBoundingClientRect();
    const width = toRect.width;
    const height = toRect.height;
    const toTop = toRect.top + window.scrollY;
    const toLeft = toRect.left + window.scrollX;

    return { left:((left-toLeft)/width*100)+'%', top:((top-toTop)/height*100)+'%' };
}
</script>
<style lang="scss" scoped>
.cash-box-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.cash-box{
    width: 80%;
    aspect-ratio: 4 / 1;
    background-image: url('@/assets/cash/cash-box.svg');
    background-size: cover;
    position: relative;
    img{
        position: absolute;
        width: 10%;
        aspect-ratio: 1 / 2;
    }
}
</style>