<template>
    <div class="data-visual-container">
        <div id="map" ref="mapContainerRef"></div>
        <sceneContainer/>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted,ref } from 'vue';
import { initMap } from '../utils/mapUtils';
import sceneContainer from '../components/dataVisual/sceneContainer.vue';

const mapContainerRef = ref();

// mapbox://styles/nujabesloo/cltoh2lrx001g01qv4ptsdh8g

let map = null;


onMounted(async() => {

    //q:
    map = initMap(mapContainerRef)
    // console.log(map);

})




</script>

<style lang="scss" scoped>
div.data-visual-container {
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