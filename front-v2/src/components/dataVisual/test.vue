<template>
    <canvas id="GPUFrame"></canvas>
    <div id="map" ref="mapContainerRef"></div>

    <div class="drag-parent">
        <div class="drag-comp" v-draggable="{ 'bounds': 'parent' }">
            <div class="drag-comp-content">
                <h1>title</h1>
                <p>desc</p>
                <button>clickme</button>
            </div>
        </div>

    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { main } from '../../utils/m_demLayer/main'
import { initScratchMap } from '../../utils/mapUtils'

// src\utils\m_demLayer\terrainLayer.js
import TerrainLayer from '../../utils/m_demLayer/terrainLayer.js'
import FlowLayer from '../../utils/m_demLayer/flowLayer.js'


const mapContainerRef = ref();
let flowlayer;

onMounted(async () => {
    const map = await initScratchMap(mapContainerRef.value)
    window.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            map.addLayer(new TerrainLayer(14))
        }
        if (e.key === '2') {
            map.removeLayer('TerrainLayer')
        }
        if (e.key === '3') {
            flowlayer = new FlowLayer()
            map.addLayer(flowlayer)
        }
        if (e.key === '4') {
            map.removeLayer('FlowLayer')
            flowlayer.hide()
        }
    })



})

</script>

<style lang="scss" scoped>
#GPUFrame {
    position: absolute;
    width: 100vw;
    height: 92vh;
    z-index: 1;
    pointer-events: none;
}

.drag-parent {
    position: absolute;
    width: 100vw;
    height: 94vh;
    top: 4vh;
    pointer-events: none;


    .drag-comp {

        cursor: move;
        pointer-events: all;

        width: 200px;
        height: 200px;
        background-color: bisque;

        .drag-comp-content {
            color: brown;
            font-weight: 700;
            text-align: center;
        }
    }
}




#map {
    position: absolute;
    width: 100vw;
    height: 92vh;
    z-index: 0;
}
</style>