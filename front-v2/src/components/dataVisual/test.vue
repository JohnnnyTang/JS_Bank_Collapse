<template>

    <div class="main">
        <totalController></totalController>
        <div class="map" ref="mapDom"></div>
    </div>

</template>

<script setup>
import { onMounted, reactive, ref, watch, createApp } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios';
import totalController from './common/totalController.vue';
// import { initLoadedMap } from '../../utils/mapUtils';



const mapDom = ref()

onMounted(async () => {
    // const map = await initLoadedMap(mapDom)
    // console.log(layerTree);

})



</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;




}

:deep(.el-tree-node__label){
    font-size: calc(0.6vw + 0.7vh);
}
:deep(.el-tree-node__content){
    padding: 0.5vh;
}
:deep(.el-tree){
    background-color: rgba($color: #000000, $alpha: 0.0);
}



.map {
    position: absolute;
    width: 100vw;
    height: 92vh;
}


</style>