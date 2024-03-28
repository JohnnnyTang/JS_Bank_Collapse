<template>
    <div class="layer-controller">
        <div class="layer-controller-content" v-draggable="{ 'bounds': 'parent','axis':'x' }">
            <div class="layer-controller-icon-container" @click="showLayersCard = !showLayersCard">
                <!-- <el-tooltip :content="showLayersCard ? '最小化' : '图层管理'" placement="top" effect="light" :show-arrow="false"> -->
                <div class="layer-controller-icon" :style="{ backgroundImage: `url(${iconSrc})` }"></div>
                <!-- </el-tooltip> -->
            </div>

            <Transition name="slidefade">
                <div class="layer-controller-main" v-show="showLayersCard">
                    <div class="layer-controller-main-title">图层管理</div>
                    <div class="layer-controller-scene-title">{{ selectedScene.title }}</div>

                    <el-checkbox-group v-model="checkedLayer" @change="handleCheckedLayerChange">
                        <el-checkbox v-for="layerID in selectedScene.allLayers" :key="layerID" :label="layerID"
                            :value="layerID">{{ layerID
                            }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted, ref, computed, watch } from 'vue';
import { useMapStore, useSceneStore } from '../../store/mapStore';

const mapStore = useMapStore()
const sceneStore = useSceneStore()
const showLayersCard = ref(false)
const checkedLayer = ref([])
const selectedScene = computed(() => sceneStore.selectedScene)


// const props = defineProps({
//     allLayers: Array,
//     layerScene: String,
// })
// watch(props, () => {
//     checkedLayer.value = props.allLayers
// })

watch(selectedScene, (newV, oldV) => {
    checkedLayer.value = newV.allLayers
})


const handleCheckedLayerChange = () => {
    let map = mapStore.getMap()
    // visible layer
    checkedLayer.value.forEach(layerID => {
        map.setLayoutProperty(layerID, 'visibility', 'visible');
    })
    // invisible layer
    let invisibleLayer = selectedScene.value.allLayers.filter(v => !checkedLayer.value.includes(v))
    invisibleLayer.forEach(layerID => {
        map.setLayoutProperty(layerID, 'visibility', 'none');
    });
}


const iconSrc = computed(() => {
    return showLayersCard.value ? './icons/resize.png' : './icons/layers.png'
})

onMounted(async () => {

})




</script>

<style lang="scss" scoped>
.layer-controller {
    user-select: none;
    position: absolute;
    pointer-events: none;
    width: 90vw;
    left: 10vw;
    height: 60vh;
    top: 1vh;
    bottom: 1vh;
    z-index: 3;
    .layer-controller-content {
        position: absolute;
        pointer-events: all;
        top: 12vh;
        right: 2vw;
        width: auto;
        height: auto;

        // icon button
        .layer-controller-icon-container {
            position: absolute;
            z-index: 999;
            right: 0;
            top: 0;
            width: 6.5vh;
            height: 6.5vh;
            background-color: rgb(255, 245, 245);
            border-radius: 6vh;
            display: flex;
            align-items: center;
            justify-content: center;

            .layer-controller-icon {
                width: 5vh;
                height: 5vh;
                background-size: contain;
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
            z-index: 3;
            right: 0vw;
            top: 0vh;
            height: 25vh;
            width: 12vw;
            padding: 1vh;
            background: #ffffff;
            transition: 300ms;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

            .layer-controller-main-title {
                display: flex;
                justify-content: center;
                height: 3vh;
                line-height: 3vh;
                font-size: 20px;
                font-weight: 900;
                color: rgb(27, 35, 61);
                //background: #FFFFFF;

                text-shadow: 1px 1px 0 #bcbcbc, 2px 2px 0 #9c9c9c;
                padding-bottom: 5px;
            }

            .layer-controller-scene-title {
                display: flex;
                justify-content: center;
                height: 1.5vh;
                line-height: 1.5vh;
                font-size: 15px;
                color: #353480;
                font-weight: 700;
                margin-bottom: 10px;
            }

            .el-checkbox-group {
                height: 20vh;
                overflow-x: hidden;
                overflow-y: auto;

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
                    padding-left: 1vw;
                    margin: 0px;
                    display: block;
                    color: #000000;

                    :deep() .el-checkbox__input {
                        transform: translateY(2px);
                    }

                    :deep().el-checkbox__label {
                        text-shadow: 1px 1px 0 #dfdada;
                        color: #00183d;

                    }
                }
            }

        }


    }



    .slidefade-enter-active,
    .slidefade-leave-active {
        transition: opacity 300ms linear;
    }

    .slidefade-enter-from,
    .slidefade-leave-to {
        opacity: 0;
    }
}
</style>