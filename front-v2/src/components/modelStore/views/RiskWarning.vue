<template>
    <div class="dataInterpretation-container">
        <ModelTitleVue :ModelName="ModelName" />
        <div class="model-content-container">
            <ModelFlowVue />
            <div class="model-run-container">
                <div class="model-run-title">{{ curRunModelName }}</div>
                <div class="model-run-content">
                    <SectionCalcVue
                        v-show="curRunModelName == '计算断面选择'"
                    />
                    <VelocityCalcVue
                        v-show="curRunModelName == '动力指标计算'"
                    />
                    <EvolveCalcVue
                        v-show="curRunModelName == '演变分析指标计算'"
                    />
                    <ElementCalcVue
                        v-show="curRunModelName == '多指标因子配置'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useMultiIndexStore } from '@/store/multiIndexStore'
import { onMounted, ref } from 'vue'
import ModelTitleVue from '../ModelTitle.vue'
import ElementCalcVue from '../riskCalc/ElementCalc.vue'
import EvolveCalcVue from '../riskCalc/EvolveCalc.vue'
import ModelFlowVue from '../riskCalc/ModelFlow.vue'
import SectionCalcVue from '../riskCalc/SectionCalc.vue'
import VelocityCalcVue from '../riskCalc/VelocityCalc.vue'

// TODO: pinia持久化
const multiIndexStore = useMultiIndexStore()

const ModelName = '风险预警模型'

const curRunModelName = ref('计算断面选择')

// console.log(multiIndexStore.taskIdMap)

onMounted(() => {
    // multiIndexStore.taskIdMap.section = '1'
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
img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
div.text {
    width: 50%;
    font-size: calc(0.5vh + 0.5vw);
    font-weight: 600;
    font-family: 'Microsoft YaHei';
    color: white;
    text-align: center;
}
div.dataInterpretation-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    flex-direction: column;
    background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
    background-size: 200% 200%;
    animation: slideBackgroundColor 4s ease infinite;

    div.model-content-container {
        width: 100%;
        height: 85vh;
        padding-top: 1vh;
        overflow: hidden;
        display: flex;
        flex-flow: column wrap;
        justify-content: space-around;
        align-content: space-around;

        // background-color: #2ac4c9;

        div.model-run-container {
            width: 75vw;
            height: 85vh;

            background-color: #d1e7ff;
            border-radius: 12px;
            overflow: hidden;

            div.model-run-title {
                width: 74vw;
                height: 6vh;
                line-height: 6vh;
                font-size: calc(0.8vw + 1.2vh);
                font-weight: bold;
                text-align: center;

                margin-left: 0.5vw;

                border-bottom: 3px solid #2a4ac9;
                color: #0e14cf;
            }

            div.model-run-content {
                height: 79vh;
                width: 75vw;

                // background-color: #2a4ac9;
            }
        }
    }
}
</style>
