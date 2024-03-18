<template>
    <div class="scene-container">

        <div class="scene-title"> 长江江苏段 </div>
        <div class="card-container">
            <sceneCard v-for="(info, index) in sceneCardInfo" :key="index" :title="info.title" :desc="info.desc"
                :iconSrc="info.iconSrc" @click="clickSceneHandler(info)"></sceneCard>
            <hr>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import sceneCard from './sceneCard.vue'


const clickSceneHandler = (scene)=>{
    console.log(scene);
}


const sceneCardInfo = ref([
    {
        title: '水利一张图',
        desc: '展示关键水利工程信息。',
        iconSrc: './icons/beach.png'
    },
    {
        title: '河湖码头',
        desc: '展示河湖码头信息，助力水资源管理和调度。',
        iconSrc: './icons/pier.png'
    },
    {
        title: '过江通道',
        desc: '展示三类过江通道,助力有关规划决策.',
        iconSrc: './icons/gate.png'
    },
    {
        title: '实时水情',
        desc: '反映当前水域的水位、流速等信息，用于水资源管理和调度.',
        iconSrc: './icons/water-drop.png'
    },
    {
        title: '典型崩岸',
        desc: '描绘典型崩岸地貌，用于分析地质特征和防范措施.',
        iconSrc: './icons/collapse.png'
    },
    {
        title: '预警分区',
        desc: '标示潜在灾害风险区域，帮助提前预警和应对应急情况.',
        iconSrc: './icons/warning.png'
    },
    {
        title: '全江地形',
        desc: '呈现整个江河的地形高低变化，为水文分析提供基础数据.',
        iconSrc: './icons/terrain.png'
    },
    {
        title: '平面冲淤',
        desc: '呈现整个江河岸段的冲淤情况',
        iconSrc: './icons/shore.png'
    },

])

onMounted(async () => {

})

</script>

<style lang="scss">
.scene-container {
    position: absolute;
    background: rgb(209, 254, 255);
    background: linear-gradient(0deg, rgba(209, 254, 255, 0.6082808123249299) 0%, rgba(4, 203, 255, 0.49343487394957986) 100%);
    height: 92vh;
    overflow: hidden;



    .scene-title {
        height: 4.5vh;
        margin-top: 0.5vh;
        font-size: calc(1vw + 1vh);
        font-weight: 800;
        text-align: center;

        color: rgb(0, 81, 233);
        text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 3px 2px 1px #CCCCCC, 2px 3px 1px #EEEEEE, 4px 3px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 5px 4px 1px #CCCCCC, 4px 5px 1px #EEEEEE, 6px 5px 1px #CCCCCC, 5px 6px 1px #EEEEEE, 7px 6px 1px #0f41e7;

    }

    .card-container {
        height: 85vh;
        overflow-y: scroll;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(6, 181, 197, 0.219);
        }

        &::-webkit-scrollbar-thumb {
            background-color: #15a1e294;
            border-radius: 5px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: #3af0f781;
        }
    }




}
</style>