<template>
    <div class="data-visual-container">
        <div id="map" ref="mapContainerRef"></div>
        <sceneContainer />
        <layerControl />
        <searchContainer />
        <monitorChart />
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


const mapContainerRef = ref();
const mapStore = useMapStore()
const sceneStore = useSceneStore()
const selectedScene = computed(() => sceneStore.selectedScene)
let map = null;
const selectedFeature = computed(() => sceneStore.selectedFeature)


// const selectFeatureHandler = (feature) => {
//     if (selectedScene.value.title === '实时监测设备') {
//         oneSpecMonitorMetaInfo.value = feature;

//     }
// }


watch(selectedScene, async (newV, oldV) => {
    oldV && oldV.removeLayers(map)
    if (!newV.allLayers.length) {
        await newV.initAllLayers(map)
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
</style>