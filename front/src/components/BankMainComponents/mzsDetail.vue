<template>
    <div class="mzsDetailDIV">
        <h3>民主沙崩岸</h3>
        <p>民主沙右缘位于长江澄通河段，分属泰州市的靖江市和南通市的如皋市，是水利部长江委、省市县的Ⅰ级预警岸段。近年民主沙南侧的浏海沙水道深槽坐弯、深泓左偏，致来民主沙右缘持续冲退，影响局部河势稳定。同时民主沙为张皋过江通道拟建桥址所在地。为保障民主沙、张皋过江通道防洪安全，选取民主沙右缘作为近期崩岸监测预警工程示范段。</p>
        <div class="img"></div>
    </div>
 
      
 
</template>

<script setup>
import { onMounted, ref, onBeforeMount, watch } from 'vue';


onMounted(async () => {
    // tableData.value = (await BackEndRequest.getbankLineData()).data
})




</script>

<style lang="scss" scoped>
.mzsDetailDIV {
    width: 20vw;
    height: 56vh;
    background-color: rgba(144, 175, 194, 0.418);
    border-radius: 2vh;

    h3 {
        text-align: center;
        margin-top: 1vh;
        margin-bottom: 1vh;
    }

    p{
        padding: 2vh;
        font-size: 2vh;
        color:rgb(173, 202, 228);
    }
    .img{
        margin-left: 4vw;
        width: 135px;
        height: 100px;
        background-image: url("/img/mzs.png");
        background-size: contain;
        background-repeat: no-repeat;
    }

}
</style>