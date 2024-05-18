<template>
    <div class="info-show-container" v-if="shown">
        <div class="info-show-title">
            自定义断面信息：
        </div>
        <div
            ref="shapeGraphRef"
            class="shape graph"
            v-loading="shapeChartLoad"
            element-loading-background="rgba(255, 255, 255, 0.4)"
        ></div>
        <div 
            ref="erosionGraphRef"
            class="erosion graph"
            v-loading="erosionChartLoad"
            element-loading-background="rgba(255, 255, 255, 0.4)"
        ></div>
        <button @click="closeTempProfileDetailInfo">222</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { drawShapeGraph, drawErosionGraph } from './util.js'
import * as echarts from 'echarts'

let shapeChart = null
let erosionChart = null
const shapeChartLoad = ref(true)
const erosionChartLoad = ref(true)
const shapeGraphRef = ref(null)
const erosionGraphRef = ref(null)
let section;
let beforesection;
let slopeRate;
let erosion;

const props = defineProps({
    profileData: {
        type: Object,
    }
})
const profileData = props.profileData
const shown = props.shown

const emit = defineEmits(['closeTempProfileDetailInfo'])
const closeTempProfileDetailInfo = () => {
    emit('close')
}

const test = () => {
    emit('test','123')
}

const calProfileData = (profileData) => {
    shapeChartLoad.value = true
    erosionChartLoad.value = true
    try {
        section = profileData.section.map((value) => {return value[2] < -999 ? null : value[2]}),
        beforesection = profileData.beforeSection.map((value) => {return value[2] < -999 ? null : value[2]})
        slopeRate = profileData.SA[2]
        erosion = section.map((value, index) => {
            if (value!==null && beforesection[index]!==null){
                return value-beforesection[index]
            } else { return null }})
    } catch (error) {
        DrawGraph([],[],[],[])
        return false
    }
    DrawGraph(section, beforesection, slopeRate, erosion)
}

const DrawGraph = (section, beforesection, slopeRate, erosion) => {
    shapeChart = echarts.init(shapeGraphRef.value)
    drawShapeGraph(
        shapeChart,
        section,
        beforesection,
        slopeRate,
    )
    shapeChartLoad.value = false
    erosionChart = echarts.init(erosionGraphRef.value)
    drawErosionGraph(
        erosionChart,
        erosion
    )
    erosionChartLoad.value = false
}

onMounted(() => {
    calProfileData(profileData)
})
</script>

<style lang="scss" scoped>
    div.info-show-container {
        position: absolute;
        width: 23vw;
        height: 70vh;
        left: 45vw;
        top:2vh;
        background-color: rgba(54, 58, 63, 0.6);
        border-radius: 6px;
        border: #3b85e7 2px solid;

        div.info-show-title {
            position: absolute;
            width: 100%;
            height: 5vh;
            left: 0.5vw;
            top: 0.5vh;
            color:aliceblue;
            font-size: calc(0.7vw + 0.5vh);
            font-weight: bold;
        }
    }
</style>
