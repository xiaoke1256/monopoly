<template>
    <div class="main">
        
        <div class="map-container">
            <div class="map-div">
                <div class="end-row" >
                    <div></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div></div>
                </div>
                <div class="mid-row" >
                    <div class="side">
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                    </div>
                    <div class="center"></div>
                    <div class="side">
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                        <div class="block"></div>
                    </div>
                </div>
                <div class="end-row" >
                    <div></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
                    <div class="block"></div>
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
        background-color: red;
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
            background-color: red;
        }
    }
    .center {
        width: 70%;
        height: 100%;
        background-color: lavenderblush;
    }
    
}
</style>