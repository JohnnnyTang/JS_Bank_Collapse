<template>
    <div class="model-temp-container">
        <div class="bg-img"></div>
        <BottomWaveVue/>
    </div>
</template>

<script setup>
import BottomWaveVue from './BottomWave.vue'
</script>

<style lang="scss" scoped>
div.model-temp-container {
    display: grid; /* 指定为网格布局 */
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(45vh, auto); /* 设置网格行的最小高度为45vh，最大高度根据内容自适应 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    gap: 0.2vw; /* 设置网格项之间的间距 */
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    // background: linear-gradient(to bottom right, #b4c5fc, #e0f0ff, #7486a1);
    background-color: aliceblue;
    background-size: 100% 100%;
    animation: slideBackgroundColor 4s ease infinite;

    div.bg-img {
        position: absolute;
        top: 10vh;
        left: 5vw;

        height: 80vh;
        width: 90vw;

        background-image: url('/modelFlowChart.png');
        background-size: contain;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        z-index: 10;
    }

}
</style>