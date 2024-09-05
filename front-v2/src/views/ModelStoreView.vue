<template>
  <div class="model-store-container">
    <ModelCardVue v-for="(infoItem, index) in infoItemList" :key="index" :infoItem="infoItem" />
    <BottomWaveVue />
  </div>
  <!-- <div class="nav-knowledge-button" @click="navToKnowLedge">
        <div class="nav-knowledge-icon"></div>
        <div class="nav-knowledge-text">知识平台</div>
    </div> -->
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
import { useRouter } from 'vue-router';
const router = useRouter();
import { onMounted } from 'vue';
import axios from 'axios';
import BankResourceHelper from '../components/modelStore/views/bankResourceHelper';

const navToKnowLedge = () => {
  router.push('/knowledgeStore');
}

onMounted(async () => {

  // let demData = (await BankResourceHelper.getBankCalculateResourceList('DEM', 'Mzs')).data
  // let demList = BankResourceHelper.DEMResourcetoList(demData)
  // console.log(demList)
  let hydroData = (await BankResourceHelper.getBankCalculateResourceList('Hydrodynamic', 'Mzs')).data
  let hydroTreeData = BankResourceHelper.HydroResourceToTree(hydroData, 'Mzs')
  console.log(hydroTreeData)
  // console.log('---------------')
  // console.log(await BankResourceHelper.getBankNamesList())
  // console.log('---------------')
  // console.log(await BankResourceHelper.getOneBankBasicInfo('Mzs'))
  // console.log('---------------')
  // console.log(await BankResourceHelper.getBankCalculateResourceList('Hydrodynamic', 'Mzs'))
  // console.log('---------------')
  // console.log(await BankResourceHelper.getBankCalculateResourceList('DEM', 'Mzs'))
  // console.log('---------------')
  // console.log(await BankResourceHelper.getBankCalculateResourceList('Boundary', 'Mzs'))
  // console.log('---------------')
})

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

div.nav-knowledge-button {
  position: absolute;
  right: 0;
  top: 10vh;

  width: 6vh;
  height: 6vh;
  background-color: rgb(53, 84, 98);
  transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;

  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  z-index: 10;

  &:hover {
    width: 16vh;
    cursor: pointer;
  }

  div.nav-knowledge-icon {
    width: 6vh;
    height: 6vh;
    flex-shrink: 0;

    background-image: url('/knowledge.png');
    background-size: 75%;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }

  div.nav-knowledge-text {
    width: 10vh;
    height: 6vh;
    line-height: 6vh;
    text-align: center;

    font-size: calc(0.9vw + 0.4vh);
    font-weight: bold;
    color: rgba(32, 75, 116, 0.4);
    color: rgb(140, 255, 255);
  }
}

div.model-store-container {
  display: grid;
  /* 指定为网格布局 */
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(45vh, auto);
  /* 设置网格行的最小高度为45vh，最大高度根据内容自适应 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  gap: 0.2vw;
  /* 设置网格项之间的间距 */
  width: 100vw;
  height: 92vh;
  overflow: hidden;
  background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
  background-size: 200% 200%;
  animation: slideBackgroundColor 4s ease infinite;
}

div.model-arror {
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