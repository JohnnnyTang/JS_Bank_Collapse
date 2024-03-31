<template>
    <!-- <div id="map" ref="mapContainerRef"></div> -->
    <!-- <canvas id="GPUFrame"></canvas>
    <div id="map" ref="mapContainerRef"></div>

    <div class="drag-parent">
        <div class="drag-comp" v-draggable="{ 'bounds': 'parent' }">
            <div class="drag-comp-content">
                <h1>title</h1>
                <p>desc</p>
                <button>clickme</button>
            </div>
        </div>
    </div> -->
    <!-- <monitorDetail v-draggable="{'bounds': 'parent'}"></monitorDetail> -->
    <!-- <bankLineDetail></bankLineDetail>
    <channelDetail></channelDetail> -->
    <!-- <pureChart v-draggable="{'bounds': 'parent'}"></pureChart> -->
        <!-- <bankLineRelate v-draggable="{'bounds': 'parent'}"></bankLineRelate> -->
        <channelRelate v-draggable="{'bounds': 'parent'}"></channelRelate>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { main } from '../../utils/m_demLayer/main'
import { initScratchMap,initMap } from '../../utils/mapUtils'
import monitorDetail from './featureDetails/monitorDetail.vue'
import bankLineDetail from './featureDetails/bankLineDetail.vue';
import channelDetail from './featureDetails/channelDetail.vue';
import pureChart from './monitorDevice/pureChart.vue';
import bankLineRelate from './scenesRelate/bankLineRelate.vue';
import channelRelate from './scenesRelate/channelRelate.vue';

// src\utils\m_demLayer\terrainLayer.js
import TerrainLayer from '../../utils/m_demLayer/terrainLayer.js'
import FlowLayer from '../../utils/m_demLayer/flowLayer.js'
import BackEndRequest from '../../api/backend';


const mapContainerRef = ref();


onMounted(async () => {





    // const map = await initMap(mapContainerRef)
    // window.addEventListener('keydown', (e) => {
    //     if (e.key === '1') {
    //         map.addLayer(new TerrainLayer(14))
    //     }
    //     if (e.key === '2') {
    //         map.removeLayer('TerrainLayer')
    //     }
    //     if (e.key === '3') {
    //         flowlayer = new FlowLayer()
    //         map.addLayer(flowlayer)
    //     }
    //     if (e.key === '4') {
    //         map.removeLayer('FlowLayer')
    //         flowlayer.hide()
    //     }
    // })



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
    width: 90vw;
    left: 10vw;
    height: 90vh;
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