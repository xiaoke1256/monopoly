<template>
    <div class="cash-box-container">
        <div class="box-row">
            <PlayerAvatar width="10%" :playerIndex="otherPlayerIndex"></PlayerAvatar>
            <div id="otherBox" class="cash-box" >
                <img class="coin" v-for="i in other.cash1-other.selected.cash1" @click="selectOtherBox(1,i)" :key="i" src="@/assets/cash/cash-1.svg" :style="otherCashPosition(1, i)" />
                <img class="selected coin" data-denomination="1" v-for="i in other.selected.cash1" @click="unSelectOtherBox(1,i)" :key="i" src="@/assets/cash/cash-1.svg" :style="otherCashPosition(1, i,true)" />
                
                <img class="banknote‌" v-for="i in other.cash20-other.selected.cash20" @click="selectOtherBox(20,i)" :key="i" src="@/assets/cash/cash-20.svg" :style="otherCashPosition(20, i)" />
                <img class="selected banknote‌" data-denomination="20" v-for="i in other.selected.cash20" @click="unSelectOtherBox(20,i)" :key="i" src="@/assets/cash/cash-20.svg" :style="otherCashPosition(20, i,true)" />

                <img class="banknote‌" v-for="i in other.cash100-other.selected.cash100" @click="selectOtherBox(100,i)" :key="i" src="@/assets/cash/cash-100.svg" :style="otherCashPosition(100, i)" />
                <img class="selected banknote‌" data-denomination="100" v-for="i in other.selected.cash100" @click="unSelectOtherBox(100,i)" :key="i" src="@/assets/cash/cash-100.svg" :style="otherCashPosition(100, i,true)" />

                <img class="banknote‌" v-for="i in other.cash200-other.selected.cash200" @click="selectOtherBox(200,i)" :key="i" src="@/assets/cash/cash-200.svg" :style="otherCashPosition(200, i)" />
                <img class="selected banknote‌" data-denomination="200" v-for="i in other.selected.cash200" @click="unSelectOtherBox(200,i)" :key="i" src="@/assets/cash/cash-200.svg" :style="otherCashPosition(200, i,true)" />

                <img class="banknote‌" v-for="i in other.cash500-other.selected.cash500" @click="selectOtherBox(500,i)" :key="i" src="@/assets/cash/cash-500.svg" :style="otherCashPosition(500, i)" />
                <img class="selected banknote‌" data-denomination="500" v-for="i in other.selected.cash500" @click="unSelectOtherBox(500,i)" :key="i" src="@/assets/cash/cash-500.svg" :style="otherCashPosition(500, i,true)" />

                <img class="banknote‌" v-for="i in other.cash1000-other.selected.cash1000" @click="selectOtherBox(1000,i)" :key="i" src="@/assets/cash/cash-1000.svg" :style="otherCashPosition(1000, i)" />
                <img class="selected banknote‌" data-denomination="1000" v-for="i in other.selected.cash1000" @click="unSelectOtherBox(1000,i)" :key="i" src="@/assets/cash/cash-1000.svg" :style="otherCashPosition(1000, i,true)" />

                <img class="silver1" v-for="i in other.cash2000-other.selected.cash2000" @click="selectOtherBox(2000,i)" :key="i" src="@/assets/cash/cash-2000.svg" :style="otherCashPosition(2000, i)" />
                <img class="selected silver1" data-denomination="2000" v-for="i in other.selected.cash2000" @click="unSelectOtherBox(2000,i)" :key="i" src="@/assets/cash/cash-2000.svg" :style="otherCashPosition(2000, i,true)" />

                <img class="silver2" v-for="i in other.cash5000-other.selected.cash5000" @click="selectOtherBox(5000,i)" :key="i" src="@/assets/cash/cash-5000.svg" :style="otherCashPosition(5000, i)" />
                <img class="selected silver2" data-denomination="5000" v-for="i in other.selected.cash5000" @click="unSelectOtherBox(5000,i)" :key="i" src="@/assets/cash/cash-5000.svg" :style="otherCashPosition(5000, i,true)" />
            </div>
        </div>
        <div class="box-space">
        </div>
        <div class="box-space">
        </div>
        <div class="box-row">
            <PlayerAvatar width="10%" :playerIndex="yourPlayerIndex"></PlayerAvatar>
            <div id="yourBox" class="cash-box" >
                <img class="coin" v-for="i in you.cash1-you.selected.cash1" @click="selectYourBox(1,i)" :key="i" src="@/assets/cash/cash-1.svg" :style="cashPosition(1, i)" />
                <img class="selected coin" data-denomination="1" v-for="i in you.selected.cash1" @click="unSelectYourBox(1,i)" :key="i" src="@/assets/cash/cash-1.svg" :style="cashPosition(1, i,true)" />

                <img class="banknote‌" v-for="i in you.cash20-you.selected.cash20" @click="selectYourBox(20,i)" :key="i" src="@/assets/cash/cash-20.svg" :style="cashPosition(20, i)" />
                <img class="selected banknote‌" data-denomination="20" v-for="i in you.selected.cash20" @click="unSelectYourBox(20,i)" :key="i" src="@/assets/cash/cash-20.svg" :style="cashPosition(20, i,true)" />
                
                <img class="banknote‌" v-for="i in you.cash100-you.selected.cash100" @click="selectYourBox(100,i)" :key="i" src="@/assets/cash/cash-100.svg" :style="cashPosition(100, i)" />
                <img class="selected banknote‌" data-denomination="100" v-for="i in you.selected.cash100" @click="unSelectYourBox(100,i)" :key="i" src="@/assets/cash/cash-100.svg" :style="cashPosition(100, i,true)" />
                
                <img class="banknote‌" v-for="i in you.cash200-you.selected.cash200" @click="selectYourBox(200,i)" :key="i" src="@/assets/cash/cash-200.svg" :style="cashPosition(200, i)" />
                <img class="selected banknote‌" data-denomination="200" v-for="i in you.selected.cash200" @click="unSelectYourBox(200,i)" :key="i" src="@/assets/cash/cash-200.svg" :style="cashPosition(200, i,true)" />

                <img class="banknote‌" v-for="i in you.cash500-you.selected.cash500" @click="selectYourBox(500,i)" :key="i" src="@/assets/cash/cash-500.svg" :style="cashPosition(500, i)" />
                <img class="selected banknote‌" data-denomination="500" v-for="i in you.selected.cash500" @click="unSelectYourBox(500,i)" :key="i" src="@/assets/cash/cash-500.svg" :style="cashPosition(500, i,true)" />
                
                <img class="banknote‌" v-for="i in you.cash1000-you.selected.cash1000" @click="selectYourBox(1000,i)"  :key="i" src="@/assets/cash/cash-1000.svg" :style="cashPosition(1000, i)" />
                <img class="selected banknote‌" data-denomination="1000" v-for="i in you.selected.cash1000" @click="unSelectYourBox(1000,i)" :key="i" src="@/assets/cash/cash-1000.svg" :style="cashPosition(1000, i,true)" />

                <img class="silver1" v-for="i in you.cash2000-you.selected.cash2000" @click="selectYourBox(2000,i)" :key="i" src="@/assets/cash/cash-2000.svg" :style="cashPosition(2000, i)" />
                <img class="selected silver1" data-denomination="2000" v-for="i in you.selected.cash2000" @click="unSelectYourBox(2000,i)" :key="i" src="@/assets/cash/cash-2000.svg" :style="cashPosition(2000, i,true)" />
                
                <img class="silver2" v-for="i in you.cash5000-you.selected.cash5000" @click="selectYourBox(5000,i)"  :key="i" src="@/assets/cash/cash-5000.svg" :style="cashPosition(5000, i)" />
                <img class="selected silver2" data-denomination="5000" v-for="i in you.selected.cash5000" @click="unSelectYourBox(5000,i)" :key="i" src="@/assets/cash/cash-5000.svg" :style="cashPosition(5000, i,true)" />
            </div>
        </div>
        <!-- <div>
            <Button type="primary" @click="exchange" >交换</Button>
        </div> -->
    </div>
</template>
<script>
import { animate } from 'animejs';
import PlayerAvatar from '@/components/PlayerAvatar.vue';

export default {
    name: 'CashBoxComponent',
    components: {PlayerAvatar},
    data(){
        return {
            other:{
                cash1: 2,
                cash20:2,
                cash100:2,
                cash200:2,
                cash500:2,
                cash1000:2,
                cash2000:2,
                cash5000:2,
                selected:{
                    cash1: 0,
                    cash20:0,
                    cash100:0,
                    cash200:0,
                    cash500:0,
                    cash1000:0,
                    cash2000:0,
                    cash5000:0,
                }
            },
            otherPlayerIndex:-1,
            you:{
                cash1: 2,
                cash20:2,
                cash100:2,
                cash200:5,
                cash500:0,
                cash1000:2,
                cash2000:2,
                cash5000:2,
                selected:{
                    cash1: 0,
                    cash20:0,
                    cash100:0,
                    cash200:0,
                    cash500:0,
                    cash1000:0,
                    cash2000:0,
                    cash5000:0,
                }
            },
            yourPlayerIndex:1
        }
    },
    methods:{
        cashPosition(denomination,index,isSelected=false ){
            let baseOffset = 0;
            if(isSelected){
                baseOffset = this.you[`cash${denomination}`]-this.you.selected[`cash${denomination}`]
            }
            let pos = 0;
            switch(denomination){
                case 1:
                    pos = 0;
                    break;
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
                case 2000:
                    pos = 6;
                    break;
                case 5000:
                    pos = 7;
                    break;
            }
            if (denomination===1){
                if(isSelected){
                    return {
                        left: (2+pos*(10+2.30)+((index-1)%7)*1.5)+'%',
                        bottom: (100+Math.floor((index-1)/7)*7.5)+'%',
                        xTop: (100-5+Math.floor((index-1)/7)*7.5)+'%'
                    }
                }else{
                    return {
                        left: (2+pos*(10+2.30)+5*Math.floor((index-1)/50))+'%',
                        bottom: (((index-1)%50)*1.5)+'%',
                        xTop: 6+(((100-index)%50)*1.5)+'%',
                    };
                }
                
            }else if (denomination===2000){
                if(isSelected){
                    return {
                        left: (2+pos*(10+2.30)+((index-1)%3)*3.5)+'%',
                        bottom: (100+Math.floor((index-1)/3)*7.5)+'%',
                        xTop: (100-5+Math.floor((index-1)/3)*7.5)+'%'
                    }
                }else{
                    return {
                        left: (1.5+pos*(10+2.30)+3.33*((index-1)%3))+'%',
                        bottom: (4+Math.floor((index-1)/3)*18.5)+'%',
                        xTop: (100-23+Math.floor((1-index)/3)*18.5)+'%'
                    };
                }
                
            }else if (denomination===5000){
                if(isSelected){
                    return {
                        left: (2+pos*(10+2.30)+((index-1)%2)*4.5)+'%',
                        bottom: (100+Math.floor((index-1)/2)*7.5)+'%',
                        xTop: (100-5+Math.floor((index-1)/2)*7.5)+'%'
                    }
                }else{
                    return {
                        left: (1.5+pos*(10+2.30)+5.4*Math.floor((index-1)%2))+'%',
                        bottom: (6+Math.floor((index-1)/2)*13.5)+'%',
                        xTop: (100-22+Math.floor((1-index)/2)*13.5)+'%'
                    };
                }
                
            }
            return {
                left: (2+pos*(10+2.30))+'%',
                bottom: (7+baseOffset*0.5+index*(isSelected?1.5:0.5)+(isSelected?15:0))+'%',
                xTop: (14-baseOffset*0.5-index*(isSelected?1.5:0.5)-(isSelected?15:0))+'%'
            }
        },
        otherCashPosition(denomination,index,isSelected=false ){
            let baseOffset = 0;
            if(isSelected){
                baseOffset = this.other[`cash${denomination}`]-this.other.selected[`cash${denomination}`]
            }
            let pos = 0;
            switch(denomination){
                case 1:
                    pos = 7;
                    break;
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
                case 2000:
                    pos = 1;
                    break;
                case 5000:
                    pos = 0;
                    break;
            }
            if (denomination===1){
                if(isSelected){
                    return {
                        left: (2+pos*(10+2.30)+((index-1)%7)*1.5)+'%',
                        top: (100+Math.floor((index-1)/7)*7.5)+'%',
                        xTop: (100+Math.floor((index-1)/7)*7.5)+'%'
                    }
                }else{
                    return {
                        left: (2+pos*(10+2.30)+5*Math.floor((index-1)/50))+'%',
                        top: (baseOffset*0.5+((index-1)%50)*1.5)+'%',
                        xTop: (baseOffset*0.5+((index-1)%50)*1.5)+'%'
                    };
                }
                
            }else if (denomination===2000){
                if(isSelected){
                    return {
                        left: (2+pos*(10+2.30)+((index-1)%3)*3.5)+'%',
                        top: (100+Math.floor((index-1)/3)*7.5)+'%',
                        xTop: (100+Math.floor((index-1)/3)*7.5)+'%'
                    }
                }else{
                    return {
                        left: (1.5+pos*(10+2.30)+3.33*((index-1)%3))+'%',
                        top: (4+baseOffset*0.5+Math.floor((index-1)/3)*18.5)+'%',
                        xTop: (4+baseOffset*0.5+Math.floor((index-1)/3)*18.5)+'%'
                    };
                }
                
            }else if (denomination===5000){
                if(isSelected){
                    return {
                        left: (2+pos*(10+2.30)+((index-1)%2)*4.5)+'%',
                        top: (100+Math.floor((index-1)/2)*7.5)+'%',
                        xTop: (100+Math.floor((index-1)/2)*7.5)+'%'
                    }
                }else{
                    return {
                        left: (1.5+pos*(10+2.30)+5.4*((index-1)%2))+'%',
                        top: (6+baseOffset*0.5+Math.floor((index-1)/2)*13.5)+'%',
                        xTop: (6+baseOffset*0.5+Math.floor((index-1)/2)*13.5)+'%'
                    };
                }
                
            }
            return {
                left: (2+pos*(10+2.30))+'%',
                top: (7+baseOffset*0.5+index*(isSelected?1.5:0.5)+(isSelected?15:0))+'%',
                xTop: (7+baseOffset*0.5+index*(isSelected?1.5:0.5)+(isSelected?15:0))+'%'
            }
        },
        selectYourBox(denomination,currentIndex,maxIndex,isUnSelect=false){
            this.selectBox(denomination,currentIndex,isUnSelect,maxIndex,'you')
        },
        unSelectYourBox(denomination,currentIndex,maxIndex){
            this.selectYourBox(denomination,currentIndex,maxIndex,true);
        },
        selectBox(denomination,currentIndex,isUnSelect=false,maxIndex,boxName){
            if(!["other","you"].includes(boxName)){
                throw new Error("boxName 的取值范围只能是：'other','you'");
            }
            let box = this.other;
            if(boxName==='you'){
                box = this.you;
            }
            if(!maxIndex){
                if(!isUnSelect){
                    maxIndex = box[`cash${denomination}`]-box.selected[`cash${denomination}`]
                }else{
                    maxIndex = box.selected[`cash${denomination}`]
                }
            }
            if(denomination===2000 || denomination===5000){
                // 暂时不做判断
            }else if(currentIndex!=maxIndex){
                return;
            }
            const boxSelect = box.selected;
            if(!isUnSelect){
                boxSelect[`cash${denomination}`] ++;
            }else{
                boxSelect[`cash${denomination}`] --;
            }

        },
        selectOtherBox(denomination,currentIndex,isUnSelect=false,maxIndex){
            this.selectBox(denomination,currentIndex,isUnSelect,maxIndex,'other')
        },
        unSelectOtherBox(denomination,currentIndex,maxIndex){
            this.selectOtherBox(denomination,currentIndex,true,maxIndex);
        },
        exchange(callback){
            this.$nextTick(()=>{
                this.exchangeFrom(undefined,callback);
            });
        },
        exchangeFrom(from,callback){
            if(!from){
                from = "other"
            }
            console.log("from:",from)
            if(!["other","you"].includes(from)){
                throw new Error("from 的取值范围只能是：'other','you'");
            }
            let fromBox = '';
            let toBox = '';
            if("other"===from){
                fromBox = 'otherBox';
                toBox = 'yourBox';
            }else if("you"===from){
                fromBox = 'yourBox';
                toBox = 'otherBox';
            }
            console.log("document.getElementById(fromBox):",document.getElementById(fromBox))
            const cashes = document.getElementById(fromBox).getElementsByClassName('selected');
            console.log("cashes:",cashes)
            if(cashes && cashes.length>0){
                const  hasNext = cashes.length>1;
                var cashesArray = Array.from(cashes);
                const cash = cashesArray.pop();
                const denomination = parseInt(cash.dataset.denomination);
                console.log("denomination:",denomination);

                const pos = getRelativePosition(cash,document.getElementById(toBox))
                console.log("pos:",pos);
                //把cash 从fromBox中摘除，移到toBox中去
                cash.style.top=pos.top;
                cash.style.left=pos.left;
                cash.style.zIndex=99;
                cash.parentNode.removeChild(cash);
                document.getElementById(toBox).appendChild(cash);
                this.$nextTick(()=>{
                    //算出新的位置
                    let newPos = {};
                    if("other"===from){
                        newPos = this.cashPosition(denomination,this.you[`cash${denomination}`]+1)
                    }else if('you'===from){
                        newPos = this.otherCashPosition(denomination,this.other[`cash${denomination}`]+1)
                    } 
                    console.log("newPos:",newPos);
                    animate(cash,{
                        top: newPos.xTop,
                        left: newPos.left,
                        duration: 200,
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
                            if("other"===from){
                                this.other.selected[`cash${denomination}`] --;
                                this.other[`cash${denomination}`] --;
                                this.you[`cash${denomination}`] ++;
                            }else if('you'===from){
                                this.you.selected[`cash${denomination}`] --;
                                this.you[`cash${denomination}`] --;
                                this.other[`cash${denomination}`] ++;
                            }
                            //移动下一枚钱币
                            if(hasNext){
                                this.$nextTick(()=>{
                                    this.exchangeFrom(from,callback);
                                });
                            }else if("other"===from){
                                this.$nextTick(()=>{
                                    this.exchangeFrom('you',callback);
                                });
                            }else if(callback){
                                this.$nextTick(()=>{
                                    callback();
                                });
                            }
                        }
                    })
                });  
            }else if("other"===from){
                this.$nextTick(()=>{
                    this.exchangeFrom('you',callback);
                });
            }else if(callback){
                this.$nextTick(()=>{
                    callback();
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
    justify-content: center;
    align-items: center;
}
.box-space{
    width: 100%;
    aspect-ratio: 20 / 1;
}
.box-row{
    width: 100%;
    height: 45%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
.cash-box{
    width: 80%;
    aspect-ratio: 4 / 1;
    background-image: url('@/assets/cash/cash-box.svg');
    background-size: cover;
    position: relative;
    img.banknote‌ {
        position: absolute;
        width: 10%;
        aspect-ratio: 1 / 2;
    }
    img.coin {
        position: absolute;
        width: 5%;
        aspect-ratio: 1 / 1;
    }
    img.silver1 {
        position: absolute;
        width: 3.7%;
        aspect-ratio: 6 / 8;
    }
    img.silver2 {
        position: absolute;
        width: 5.5%;
        aspect-ratio: 8 / 6;
    }
}
</style>