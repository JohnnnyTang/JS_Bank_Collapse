<template>
    <div class="data-visual-container">
        <div id="map" ref="mapContainerRef"></div>
        <sceneContainer @selectScene="selectSceneHandler" />
        <layerControl :allLayers="selectedScene.allLayers" :layerScene="selectedScene.title" />
        <searchContainer :selectedScene="selectedScene" />

    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { initMap, flytoLarge, flytoSmall } from '../utils/mapUtils';
import { Scene } from '../components/dataVisual/Scene';
import { useMapStore } from '../store/mapStore'
import sceneContainer from '../components/dataVisual/sceneContainer.vue';
import layerControl from '../components/dataVisual/layerControl.vue';
import searchContainer from '../components/dataVisual/searchContainer.vue';


const mapContainerRef = ref();
const mapStore = useMapStore()
let map = null;
const selectedScene = ref(new Scene())

const selectSceneHandler = (sceneInstance) => {
    selectedScene.value = sceneInstance
}


watch(selectedScene, async (newV, oldV) => {
    // console.log(newV,oldV);
    oldV && oldV.removeLayers(map)
    if (!newV.allLayers.length) {
        await newV.initAllLayers(map)
    }
    else {
        newV.showLayers(map, [])
    }
})



onMounted(async () => {

    //q:
    let mapInstance = initMap(mapContainerRef)
    mapStore.setMap(mapInstance)
    map = mapStore.getMap()
    flytoLarge(map)
    // console.log(map);

})

onUnmounted(() => {

})




</script>

<style lang="scss" scoped>
div.data-visual-container {
    user-select: none;
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    background-color: rgb(126, 253, 8);

    #map {
        position: absolute;
        width: 100vw;
        height: 92vh;
        background-color: rgb(124, 179, 203);
    }

    .mapbox-improve-map {
        display: none;
    }


}
</style>