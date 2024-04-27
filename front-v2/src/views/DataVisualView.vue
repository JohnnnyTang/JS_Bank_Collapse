<template>
    <div class="data-visual-container">
        <div id="map" ref="mapContainerRef"></div>

        <sceneContainer></sceneContainer>

        <!-- toolset -->
        <!-- <layerControl></layerControl>
        <searchContainer></searchContainer>
        <fullscreen></fullscreen> -->
        <totalController></totalController>

        <!-- scenes desc -->
        <sceneRelate></sceneRelate>

        <!-- webgpu -->
        <canvas id="GPUFrame"></canvas>

    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { initMap, flytoLarge, flytoSmall, initScratchMap, addMarkerToMap } from '../utils/mapUtils';
import { Scene } from '../components/dataVisual/Scene';
import { useMapStore, useSceneStore, useMapLayerStore } from '../store/mapStore'
import sceneContainer from '../components/dataVisual/sceneContainer.vue';

import sceneRelate from '../components/dataVisual/scenesRelate/sceneRelate.vue';
import totalController from '../components/dataVisual/common/totalController.vue'


const mapContainerRef = ref();
const mapStore = useMapStore()
const sceneStore = useSceneStore()
const selectedScene = computed(() => sceneStore.selectedScene)
let map = null;
const selectedFeature = computed(() => sceneStore.selectedFeature)
const mapLayerStore = useMapLayerStore()

mapLayerStore.$subscribe((a, b) => {
    console.log(a, b);
})

watch(selectedScene, async (newV, oldV) => {
    map = mapStore.getMap()
    oldV.allLayers.length && oldV.removeLayers(map)
    if (!newV.allLayers.length) {
        await newV.initLayers(map)
    }
    else {
        newV.showLayers(map, [])
    }
})

onMounted(async () => {
    let mapInstance = await initScratchMap(mapContainerRef.value)
    // let mapInstance = initMap(mapContainerRef.value)
    mapStore.setMap(mapInstance)
    map = mapStore.getMap()
    console.log('have map!');
    flytoLarge(map)

    const defaultScene = new Scene()
    defaultScene.title = '全江概貌'
    sceneStore.setSelectedScene(defaultScene)

    //test 
    // addMarkerToMap(map, [119.9617548378, 32.04382454852],'testMarker','/icons/warning3.png')


})

onUnmounted(() => {

})




</script>

<style lang="scss" scoped>
div.data-visual-container {
    user-select: none;
    pointer-events: none;
    position: relative;
    width: 100vw;
    height: 92vh;

    #map {
        position: absolute;
        width: 100vw;
        height: 92vh;
        pointer-events: all;
        background-color: hsl(194, 69%, 91%);
        z-index: 1;
    }

    #GPUFrame {
        position: absolute;
        width: 100vw;
        height: 92vh;
        background-color: rgba(240, 248, 255, 0);
        z-index: 2;
        pointer-events: none;
    }

    .mapbox-improve-map {
        display: none;
    }
}

:deep(.mapboxgl-popup.mapboxgl-popup-anchor-bottom) {

    .mapboxgl-popup-content {
        padding: 0;
        background-color: transparent;
        border: none
    }

    .mapboxgl-popup-tip {
        // background-color: transparent;

        // border-top-color: transparent;
        border-top-color: rgb(161, 214, 255);
        border-top-width: 30px;
        border-left-width: 7px;
        border-right-width: 7px;
        border-bottom-width: 0px;
        border-style: solid;
        // border-color: blue($color: #000000);
    }
}

#warning1-marker {
    background-image: url('https://docs.mapbox.com/mapbox-gl-js/assets/washington-monument.jpg');
    background-size: contain;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
}


:deep(.el-tree-node__label) {
    font-size: calc(0.6vw + 0.7vh);
}

:deep(.el-tree-node__content) {
    padding: 0.5vh;
}

:deep(.el-tree) {
    background-color: rgba($color: #000000, $alpha: 0.0);
}
</style>