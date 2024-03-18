<template>
    <div class="layer-controller">
        <!-- <h1>geeko</h1> -->

        <div class="layer-controller-icon-container" @click="showLayersCard = !showLayersCard">
            <el-tooltip :content="showLayersCard ? '最小化' : '图层管理'" placement="top" effect="light" :show-arrow="false">
                <div class="layer-controller-icon" :style="{ backgroundImage: `url(${iconSrc})` }"></div>
            </el-tooltip>
        </div>


        <div class="layer-controller-main" v-show="showLayersCard">
            <div class="layer-controller-main-title">图层管理</div>
            <div class="layer-controller-scene-title">{{props.layerScene}}</div>

            <el-checkbox-group v-model="checkedLayer" @change="handleCheckedLayerChange">
                <el-checkbox v-for="city in allLayers" :key="city" :label="city" :value="city">{{ city }}</el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted, ref, computed } from 'vue';

const showLayersCard = ref(false)

const checkedLayer = ref([])
// const alllayers = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'asd', '1', '2', '3', '4', '5']
const alllayers = ['一级预警崩岸','二级预警崩岸','三级预警崩岸']


const props = defineProps({
    allLayers:Array,
    layerScene:String,
})

const handleCheckedLayerChange=()=>{
    console.log(checkedLayer.value);
}


const iconSrc = computed(() => {
    return showLayersCard.value ? './icons/resize.png' : './icons/layers.png'
})

// mapbox://styles/nujabesloo/cltoh2lrx001g01qv4ptsdh8g

onMounted(async () => {

})




</script>

<style lang="scss" scoped>
.layer-controller {
    user-select: none;


    // icon button
    .layer-controller-icon-container {
        //position
        position: absolute;
        right: 2vw;
        bottom: 3vh;
        z-index: 10;

        //size and border
        width: 6.5vh;
        height: 6.5vh;
        background-color: rgb(255, 255, 255);
        border-radius: 6vh;
        //center
        display: flex;
        align-items: center;
        justify-content: center;

        .layer-controller-icon {
            width: 5vh;
            height: 5vh;
            background-size: contain;
            //background-image: url('./icons/layers.png');
            transition: 300ms;

            &:hover {
                //transform: rotate3d(0, 1, 1, 15deg);
                cursor: pointer;
            }

            &:active {
                transform: rotate3d(0, 1, 1, 15deg);
                cursor: pointer;
            }
        }
    }



    // layer controller
    .layer-controller-main {
        position: absolute;
        right: 2vw;
        bottom: 3vh;
        height: 25vh;
        width: 10vw;
        padding: 10px;
        background-image: linear-gradient(-225deg, #fffeffd7 0%, #92f8f683 100%);
        transition: 300ms;
        border-radius: 1vh;
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;

        .layer-controller-main-title {
            display: flex;
            justify-content: center;
            height: 3vh;
            line-height: 3vh;
            font-size: 20px;
            font-weight: 900;
            color: #000000;
            //background: #FFFFFF;
            text-shadow: 1px 1px 0 #bcbcbc, 2px 2px 0 #9c9c9c;
            padding-bottom: 5px;
        }

        .layer-controller-scene-title{
            display: flex;
            justify-content: center;
            height: 1.5vh;
            line-height: 1.5vh;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .el-checkbox-group {
            height: 20vh;
            overflow-x: hidden;
            overflow-y: scroll;

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

            .el-checkbox {
                padding: 0px;
                margin: 0px;
                display: block;
                color: #000000;
            }
        }

    }
}
</style>