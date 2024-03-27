<template>
    <canvas id="GPUFrame"></canvas>
    <div id="map" ref="mapContainerRef"></div>
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
            // id == TerrainLayer
        }
        if (e.key === '2') {
            map.removeLayer('TerrainLayer')
        }
        if (e.key === '3') {
            flowlayer = new FlowLayer()
            map.addLayer(flowlayer)

            // id == FlowLayer
        }
        if (e.key === '4') {
            map.removeLayer('FlowLayer')
            flowlayer.hide()


        }
    })
    // main()
})

</script>
  
<style lang="scss" scoped>
#GPUFrame {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    z-index: 1;
    pointer-events: none;
}

#map {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    z-index: 0;
}
</style>
  