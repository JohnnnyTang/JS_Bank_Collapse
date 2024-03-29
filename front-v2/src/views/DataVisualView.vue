<template>
    <div class="data-visual-container">
        <div id="map" ref="mapContainerRef"></div>
        <sceneContainer />
        <!-- <layerControl v-draggable="{ 'bounds': 'parent' }" /> -->
        <layerControl></layerControl>
        <!-- <searchContainer v-draggable="{ 'bounds': 'parent' }" /> -->
        <searchContainer></searchContainer>
        <bankLineRelate></bankLineRelate>
        
        
        <!-- <monitorChart /> -->
        <canvas id="GPUFrame"></canvas>


    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { initMap, flytoLarge, flytoSmall, initScratchMap } from '../utils/mapUtils';
import { Scene } from '../components/dataVisual/Scene';
import { useMapStore, useSceneStore } from '../store/mapStore'
import sceneContainer from '../components/dataVisual/sceneContainer.vue';
import layerControl from '../components/dataVisual/layerControl.vue';
import searchContainer from '../components/dataVisual/searchContainer.vue';
import monitorChart from '../components/dataVisual/monitorDevice/monitorChart.vue';
import BackEndRequest from '../api/backend';
import bankLineRelate from '../components/dataVisual/scenesRelate/bankLineRelate.vue';


const mapContainerRef = ref();
const mapStore = useMapStore()
const sceneStore = useSceneStore()
const selectedScene = computed(() => sceneStore.selectedScene)
let map = null;
const selectedFeature = computed(() => sceneStore.selectedFeature)
let firstTime = true


watch(selectedScene, async (newV, oldV) => {
    map = mapStore.getMap()
    oldV && oldV.removeLayers(map)
    if (!newV.allLayers.length) {
        await newV.initAllLayers(map)
        if (firstTime) {
            firstTime = false
            console.log(selectedScene);
        }
    }
    else {
        newV.showLayers(map, [])
    }
})



onMounted(async () => {

    let mapInstance = await initScratchMap(mapContainerRef.value)
    mapStore.setMap(mapInstance)
    map = mapStore.getMap()
    flytoLarge(map)


    const defaultScene = new Scene()
    defaultScene.title = '预警岸段'
    sceneStore.setSelectedScene(defaultScene)


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
        background-color: rgb(124, 179, 203);
    }

    #GPUFrame {
        position: absolute;
        width: 100vw;
        height: 92vh;
        background-color: rgba(240, 248, 255, 0);
        z-index: 1;
        pointer-events: none;
    }

    .mapbox-improve-map {
        display: none;
    }
}

:deep(.mapboxgl-popup.mapboxgl-popup-anchor-bottom) {

    .mapboxgl-popup-content {
        padding: 0;
    }

    .mapboxgl-popup-tip {
        border-top-color: rgb(161, 214, 255);
        border-top-width: 30px;
        border-left-width: 7px;
        border-right-width: 7px;
        border-bottom-width: 0px;
        border-style: solid;
        // border-color: blue($color: #000000);
    }
}
</style>