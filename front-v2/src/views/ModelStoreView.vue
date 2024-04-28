<template>
    <div class="model-store-container">
        <ModelCardVue
            v-for="(infoItem,index) in infoItemList"
            :key="index"
            :infoItem="infoItem"
        />
        <BottomWaveVue/>
    </div>
    <div class="model-arror a1">
      <img src="/modelArror.png" alt="">
    </div>
    <div class="model-arror a2">
      <img src="/modelArror.png" alt="">
    </div>
    <div class="model-arror a3">
      <img class="line" src="/modelArror.png" alt="">
    </div>
    <div class="model-arror a4">
      <img class="line" src="/modelArror.png" alt="">
    </div>
</template>

<script setup>
import ModelCardVue from '../components/modelStore/ModelCard.vue'
import BottomWaveVue from '../components/modelStore/BottomWave.vue'
import { infoItemList } from '../components/modelStore/modelInfoList.js'

</script>

<style lang="scss" scoped>
@keyframes slideBackgroundColor {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
div.model-store-container {
    display: grid; /* 指定为网格布局 */
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(45vh, auto); /* 设置网格行的最小高度为45vh，最大高度根据内容自适应 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    gap: 0.2vw; /* 设置网格项之间的间距 */
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
    background-size: 200% 200%;
    animation: slideBackgroundColor 4s ease infinite;
}

div.model-arror  {
  position: absolute;
  transform: translateX(-50%);
  z-index: 10;

  &.a1 {
    top: 20vh;
    left: 49.5vw;
  }

  &.a2 {
    top: 76vh;
    left: 49.5vw;
  }

  &.a3 {
    top: 46.5vh;
    left: 23vw;
  }

  &.a4 {
    top: 46.5vh;
    left: 73vw;
  }
}

img {
    width: 5vw;
    height: 10vh;
    object-fit: contain;
    // transform: rotate(90deg);
}

img.line {
    width: 5vw;
    height: 10vh;
    object-fit: contain;
    transform: rotate(90deg);
}
</style>