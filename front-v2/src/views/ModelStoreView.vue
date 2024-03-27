<template>
    <div class="model-store-container">
        <ModelCardVue
            v-for="(infoItem,index) in infoItemList"
            :key="index"
            :infoItem="infoItem"
        />
    </div>
</template>

<script setup>
import ModelCardVue from '../components/modelStore/ModelCard.vue'

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
div.model-store-container  {
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    display: flex;
    background-color: rgb(236, 215, 250);

}
</style>