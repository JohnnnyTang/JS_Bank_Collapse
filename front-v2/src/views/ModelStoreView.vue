<template>
    <div class="model-store-container">
        <ModelCardVue
            v-for="(infoItem,index) in infoItemList"
            :key="index"
            :infoItem="infoItem"
        />
        <BottomWaveVue/>
    </div>
</template>

<script setup>
import ModelCardVue from '../components/modelStore/ModelCard.vue'
import BottomWaveVue from '../components/modelStore/BottomWave.vue'

const infoItemList = [
    {
        firstPage: false,
        routerPath: "dataInterpretation",
        name: "数据融合解译模型",
        description: "这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述"
    },
    {
        firstPage: false,
        routerPath: "soilAnalysis",
        name: "土体变形分析模型",
        description: "这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述"
    },
    {
        firstPage: false,
        routerPath: "stabilityAnalysis",
        name: "岸坡稳定性分析模型",
        description: "这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述"
    },
    {
        firstPage: false,
        routerPath: "riskWarning",
        name: "风险预警模型",
        description: "这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述#这里写模型描述"
    },
]

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
div.model-store-container  {
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    display: flex;
    // background-color: rgb(139, 167, 240);
    background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
    background-size: 200% 200%;
    animation: slideBackgroundColor 4s ease infinite;
}
</style>