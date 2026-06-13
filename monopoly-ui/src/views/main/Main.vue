<template>
    <div class="main">
        
        <div class="map-container">
            <div class="map-div">
                <div class="end-row" >
                    <div></div>
                    <div v-for="key in [...Array(9).keys()]" :key="key" class="block">
                        <div class="empty-land" style="width:100%;height:47%;" >
                            <div class="notice">空地</div>
                        </div>
                        <div class="road-bg" style="" >
                        </div>
                    </div>
                    <div></div>
                </div>
                <div class="mid-row" >
                    <div class="side">
                        <div v-for="key in [...Array(9).keys()]" :key="key" class="block">
                            <div class="empty-land" >
                                <div class="notice">空地</div>
                            </div>
                            <div class="road-bg-v" style="" >
                            </div>
                        </div>
                    </div>
                    <div class="center"></div>
                    <div class="side">
                        <div v-for="key in [...Array(9).keys()]" :key="key" class="block">
                            <div class="road-bg-v" style="" >
                            </div>
                            <div class="empty-land" >
                                <div class="notice">空地</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="end-row" >
                    <div></div>
                    <div v-for="key in [...Array(9).keys()]" :key="key" class="block">
                        <div class="empty-land" style="width:100%;height:47%;" >
                            <div class="notice">空地</div>
                        </div>
                        <div class="road-bg" style="" >
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>    
    </div>
</template>
<script>
export default {
  name: 'MainIndex',
  props: {
  }
}
</script>
<style lang="scss" scoped>
.main{
    height: 100%;
}
.map-container{
    height: 100%;
    display: flex;
    justify-content: center;
}
.map-div {
    height: 100%;
    aspect-ratio: 1 / 1; /* 例如，16:9 的长宽比 */
    background-color: lightblue; 
}
.end-row {
    display: flex;
    direction: row;
    justify-content: center;
    height: 15%;
    .block {
        width: 7.78%;
        height: 100%;
        background-color: chocolate;
    }
}
.mid-row {
    display: flex;
    direction: row;
    justify-content: center;
    height: 70%;
    .side {
        width: 15%;
        height: 100%;
        background-color: lightgray;
        .block {
            height: 11.11%;
            width: 100%;
            background-color: chocolate;
            display: flex;
            direction: row;
        }
    }
    .center {
        width: 70%;
        height: 100%;
        background-color: lavenderblush;
    }
    
}

.road-bg {
  background-image: url('@/assets/road.svg');
  background-size: cover; // 或 contain，按需
  width:100%;
  aspect-ratio: 1 / 1;
}
.road-bg-v {
  background-image: url('@/assets/road_v.svg');
  background-size: cover; // 或 contain，按需
  width:100%;
  aspect-ratio: 1 / 1;
}
.empty-land{
    background-image: url('@/assets/emptyland.svg');
    background-size: cover; // 或 contain，按需 
    width:100%;
    aspect-ratio: 1 / 1;
    display: flex;
    direction: column;
    justify-content: center;
    align-items: center;
    .notice{
        margin-top: 5px;
        font-size: 10px;
        color: #333;
    }
}
</style>