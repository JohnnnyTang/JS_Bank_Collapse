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
        picsrc:"/dataInterpretation.png",
        routerPath: "dataInterpretation",
        name: "数据融合解译模型",
        description: "数据融合解译模型是一个实时数据解析系统，旨在将GNSS、孔隙水压力计、应力桩和测斜仪等部署在河岸的设备实时传输的数据进行解析入库，以监测河岸稳定性、水文地质勘测和工程安全预警。用户可以通过该模型可以获取到河岸边各设备传来的测量数据。",
        application: "河岸稳定性监测，水文地质勘测，工程安全预警",
        usescene: "河岸工程建设前期评估，河岸改造工程实时监测，河岸生态环境保护",
        input: "GNSS设备原始数据、孔隙水压力计设备原始数据、应力桩设备原始数据、测斜仪设备原始数据、设备位置信息",
        output: "GNSS解译数据、孔隙水压力计解译数据、应力桩解译数据、测斜仪解译数据",
    },
    {
        firstPage: false,
        picsrc:"/soilAnalysis.png",
        routerPath: "soilAnalysis",
        name: "土体变形分析模型",
        description: "土体变形分析模型旨在评估土体在不同情况下（特别是在河岸侵蚀条件下）的变形情况，能够合理估计水流对岸坡和岸坡趾部的水力侵蚀。模型估算基于河道几何形状的边界剪切应力，并考虑到两种可能由不同材料构成的区域的关键剪切应力和可侵蚀性：岸坡和岸坡趾部；假设河床高程是固定的。 这是因为模型假设侵蚀不是由运输限制的，且没有以任何方式包含沉积物运输的模拟。",
        application: "土体变形分析，河岸侵蚀研究",
        usescene: "河岸工程规划设计阶段，河岸环境保护项目实施前的风险评估，河岸退化治理方案的优化设计",
        input: "岸坡坐标，流量参数，河道坡度，河床、岸坡和趾部材料类型，侵蚀保护措施",
        output: "侵蚀量",
    },
    {
        firstPage: false,
        picsrc:"/stabilityAnalysis.png",
        routerPath: "stabilityAnalysis",
        name: "岸坡稳定性分析模型",
        description: "岸坡稳定性分析模型综合了三种极限平衡法，用于计算多层岸坡的安全系数（Fs）。考虑了土壤强度、孔隙水压力、水流造成的围压、植被加固和地表超载等因素。用户输入岸坡几何形状、土壤类型、植被覆盖和水位或孔隙水压力信息，计算Fs。根据Fs值，岸坡被归类为“稳定的”、“条件稳定的”或“不稳定的”，为岸坡工程设计提供关键参考。",
        application: "土地利用规划，自然灾害风险评估，生态环境保护，水资源管理",
        usescene: "岸坡工程设计阶段，岸坡环境保护项目，岸坡退化治理方案优化，水利工程规划与管理",
        input: "岸坡坐标，土壤类型，植被覆盖，水位或孔隙水压力，土壤加固和地表超载",
        output: "地形图（中间变量），冲淤图（中间变量），安全系数",
    },
    {
        firstPage: false,
        picsrc:"/riskWarning.png",
        routerPath: "riskWarning",
        name: "风险预警模型",
        description: "河岸崩塌风险预警模型是基于岸坡稳定性、土体变形分析和岸坡稳定性分析等模型输出结果，结合社会经济因素，用于评估河岸崩塌的风险。通过不同指标的权重设定，模型计算出崩塌概率，并根据风险矩阵生成相应的预警等级，为河岸管理和应急处置提供科学依据。",
        application: "河岸管理与规划，灾害风险管理，城市规划与建设",
        usescene: "河岸管理与维护，灾害应急响应",
        input: "岸坡稳定性分析结果，土体变形分析结果，崩岸指标权重",
        output: "崩塌概率计算结果，社会经济损失风险矩阵，预警等级",
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