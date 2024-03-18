<template>
    <div class="data-visual-container">
        <div id="map" ref="mapContainerRef"></div>
        <sceneContainer />
        <layerControl :allLayers="dataScene[selectedsceneindex].allLayers" :layerScene="dataScene[selectedsceneindex].layerScene" />
        <searchContainer />

    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted, ref } from 'vue';
import { initMap } from '../utils/mapUtils';

import sceneContainer from '../components/dataVisual/sceneContainer.vue';
import layerControl from '../components/dataVisual/layerControl.vue';
import searchContainer from '../components/dataVisual/searchContainer.vue';
const mapContainerRef = ref();

// mapbox://styles/nujabesloo/cltoh2lrx001g01qv4ptsdh8g

let map = null;
const selectedsceneindex = ref(2)
const dataScene = [
    {
        layerScene: '水利一张图',
        allLayers: ['船舶', '码头', '水域']
    },
    {
        layerScene: '河湖码头',
        allLayers: ['码头']
    },
    {
        layerScene: '典型崩岸',
        allLayers: ['一级预警崩岸', '二级预警崩岸', '三级预警崩岸']
    },
    {
        layerScene: '过江通道',
        allLayers: ['已建通道', '在建通道', '规划通道']
    }
]





onMounted(async () => {

    //q:
    map = initMap(mapContainerRef)
    // console.log(map);

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