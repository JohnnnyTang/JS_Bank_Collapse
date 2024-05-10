<template>
    <div class="data-visual-container">
        <div class="sideBar">
            <sideBar></sideBar>
        </div>
        <div class="mapBase">
            <div ref="mapContainer" id="map"></div>
            <canvas id="GPUFrame"></canvas>
        </div>
        <div class="tools-container">
            <div class="icon-container" v-for="i in 4">
                <div class="icon" :style="styles[i - 1]" @click="toolClick(i - 1)"
                    :class="{ 'active': activeStatus[i - 1] }">
                </div>
            </div>
        </div>


        <div class="search-pos" v-show="activeStatus[0]" v-draggable="{ bounds: 'body' }">
            <featSearch @close="closeHandler"></featSearch>
        </div>
        <div class="layer-pos" v-show="activeStatus[1]" v-draggable="{ bounds: 'body' }">
            <layerCtrl @close="closeHandler"></layerCtrl>
        </div>
        <div class="legend-pos" v-show="activeStatus[2]" v-draggable="{ bounds: 'body' }">
            <mapLegend @close="closeHandler"></mapLegend>
        </div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"

import { onMounted, ref } from 'vue';
import sideBar from '../components/dataVisual/common/sideBar.vue'
import layerCtrl from '../components/dataVisual/common/tool/layerCtrl.vue'
import featSearch from '../components/dataVisual/common/tool/featSearch.vue'
import mapLegend from '../components/dataVisual/common/tool/legend.vue'
import { initScratchMap } from '../utils/mapUtils';
import { useMapStore } from '../store/mapStore';



const mapContainer = ref()

const mapStore = useMapStore()


// data
const activeStatus = ref([false, false, false])
const styles = [
    { backgroundImage: `url('/icons/searching.png')` },
    { backgroundImage: `url('/icons/layers.png')` },
    { backgroundImage: `url('/icons/legend.png')` },
    { backgroundImage: `url('/icons/full.png')` },
]


// methods
const toolClick = (i) => {
    if (i == 3) { //zoom
        mapFlyToRiver(mapStore.getMap())
        return;
    }
    activeStatus.value[i] = !activeStatus.value[i]

}
const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [[118.75395171066617, 31.191536515956685],
        [121.94881134428226, 32.68858659779259],],
        { pitch: 52.45, duration: 1500, },
    )
}
const closeHandler = (index) => {
    console.log('hello');
    activeStatus.value[index] = false
}

onMounted(async () => {

    const mapInstance = await initScratchMap(mapContainer.value)
    mapStore.setMap(mapInstance)
    mapInstance.addControl(new mapboxgl.NavigationControl({
        showZoom: false,
        showCompass: true,
        visualizePitch: true
    }), 'top-right')

    mapFlyToRiver(mapInstance)

    window.addEventListener('keydown', () => {
        console.log(mapInstance.getBounds());
    })
})





</script>

<style lang="scss" scoped>
.data-visual-container {
    width: 100vw;
    height: 92vh;
    position: absolute;
    background-color: rgba(228, 242, 252, 0.6);
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .sideBar {
        position: relative;
        width: 18vw;
        height: 92vh;
    }

    .mapBase {
        position: relative;
        width: 82vw;
        height: 92vh;

        #map {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 0;
            background-color: hsl(194, 69%, 91%);
        }

        #GPUFrame {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
    }

    div.tools-container {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 4vw;
        height: 30vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        z-index: 2;

        .icon-container {
            position: relative;
            width: 6vh;
            height: 6vh;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
            background-color: rgb(255, 255, 255);

            .icon {
                width: 4vh;
                height: 4vh;
                background-size: contain;
                z-index: 2;

                &:hover {
                    box-shadow: 0px 10px 20px rgb(1, 110, 236), 0px -10px 20px rgb(1, 110, 236);
                    cursor: pointer;
                }
            }

            .active {
                box-shadow: 0px 10px 20px rgb(1, 110, 236), 0px -10px 20px rgb(1, 110, 236);
                cursor: pointer;
                transition: .3s ease-in-out;
            }
        }
    }

    div.search-pos {
        position: absolute;
        z-index: 2;
        right: 1vw;
        top: 10vh;
    }

    div.layer-pos {
        position: absolute;
        z-index: 2;
        right: 1vw;
        top: 10vh;
    }

    div.legend-pos {
        position: absolute;
        z-index: 2;
        right: 1vw;
        top: 10vh;
    }

}


:deep(.mapboxgl-ctrl-group button) {
    width: 5vh;
    height: 5vh;
}

:deep(.mapboxgl-ctrl button.mapboxgl-ctrl-compass .mapboxgl-ctrl-icon) {
    background-image: url('/icons/compass.svg');
}

</style>