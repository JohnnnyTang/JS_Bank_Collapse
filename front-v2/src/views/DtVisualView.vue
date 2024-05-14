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


        <div class="search-pos" v-show="activeStatus[0]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <featSearch @close="closeHandler" @featureInfo="selectFeatureHandler"></featSearch>
        </div>
        <div class="layer-pos" v-show="activeStatus[1]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <layerCtrl @close="closeHandler"></layerCtrl>
        </div>
        <div class="legend-pos" v-show="activeStatus[2]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <mapLegend @close="closeHandler" :legendList="legendList"></mapLegend>
        </div>

        <div class="featDetail" v-draggable="{ bounds: 'body' }" v-show="showDetail">
            <featDetail :column="featureInfo.column" :ogData="featureInfo.ogData" :sourceId="featureInfo.sourceId"
                @close="closeHandlerr"></featDetail>
        </div>

    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"

import { onMounted, ref, watch, onUnmounted } from 'vue';
import sideBar from '../components/dataVisual/common/sideBar.vue'
import layerCtrl from '../components/dataVisual/common/tool/layerCtrl.vue'
import featSearch from '../components/dataVisual/common/tool/featSearch.vue'
import mapLegend from '../components/dataVisual/common/tool/legend.vue'
import featDetail from '../components/dataVisual/common/tool/featDetail.vue';
import { initScratchMap } from '../utils/mapUtils';
import { useMapStore, useNewSceneStore } from '../store/mapStore';
import { scenes, layerGroups } from '../components/dataVisual/js/SCENES';
import { sourceFieldMap, legendMap } from '../components/dataVisual/js/tilefieldMAP';
import axios from 'axios';


// data
const mapContainer = ref()
const mapStore = useMapStore()
const sceneStore = useNewSceneStore()
const activeStatus = ref([false, false, false])
const styles = [
    { backgroundImage: `url('/icons/searching.png')` },
    { backgroundImage: `url('/icons/layers.png')` },
    { backgroundImage: `url('/icons/legend.png')` },
    { backgroundImage: `url('/icons/full.png')` },
]
const featureInfo = ref({})
const showDetail = ref(false)
const legendList = ref([])
const t = ref('123')

watch(() => sceneStore.latestScene, (val) => {
    if (val == '重点岸段') {
        activeStatus.value[2] = true
        legendList.value = legendMap['重点岸段']

    } else if (val == '涉水工程') {
        activeStatus.value[2] = true
        // 展示过江通道图例
        legendList.value = legendMap['涉水工程']
    }
    else if (val == '全江概貌') {
        activeStatus.value[2] = true
        legendList.value = legendMap['全江概貌']
    }
})

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
    activeStatus.value[index] = false
}
const closeHandlerr = () => {
    showDetail.value = false
}
const selectFeatureHandler = (info) => {
    console.log(info);
    let sourceid = info.sourceId
    if (Object.keys(sourceFieldMap).includes(sourceid)) {
        console.log('showDetail!!');
        featureInfo.value = info
        showDetail.value = true
    }
}

onMounted(async () => {

    const mapInstance = await initScratchMap(mapContainer.value)
    mapStore.setMap(mapInstance)
    mapInstance.addControl(new mapboxgl.NavigationControl({
        showZoom: false,
        showCompass: true,
        visualizePitch: true
    }), 'top-right')
    mapInstance.addControl(new mapboxgl.ScaleControl({ maxWidth: 150 }), 'bottom-left');
    mapFlyToRiver(mapInstance)

    sceneStore.SCENEMAP.value = scenes
    sceneStore.LAYERGROUPMAP.value = layerGroups

    activeStatus.value[0] = true



    //#region test
    // feature get test
    // await layerAddFunctionMap['地形瓦片'](mapInstance)//mvt polygon
    // await layerAddFunctionMap['沙岛'](mapInstance)//mvt polygon
    // await layerAddFunctionMap['全江注记'](mapInstance)//mvt point
    // await layerAddFunctionMap['民主沙区划线'](mapInstance)//mvt line
    // await layerAddFunctionMap['GNSS'](mapInstance)//geojson point
    // await layerAddFunctionMap['一级预警岸段'](mapInstance)//geojson line

    /// feature get test
    // window.addEventListener('keydown', async (e) => {
    //     console.log(e.key);
    //     switch (e.key) {
    //         case '1':
    //             await tempFunction(mapInstance, '地形瓦片')
    //             break;
    //         case '2':
    //             await tempFunction(mapInstance, '全江注记')
    //             break;
    //         case '3':
    //             await tempFunction(mapInstance, '民主沙区划线')
    //             break; 
    //         case '4':
    //             await tempFunction(mapInstance, 'GNSS')
    //             break;
    //         case '5':
    //             await tempFunction(mapInstance, '一级预警岸段')
    //             break;
    //     }
    // })
    //#endregion

    // addNewLayer(mapInstance)


})

//////////// DEBUG FUNCTIONS
const tempFunction = async (mapInstance, layerName) => {
    // 获取要素数组的函数
    let properties = []

    let layer = mapInstance.getLayer(layerName)
    if (!layer) return properties

    let sourceId = layer.source
    let source = mapInstance.getSource(sourceId)
    if (!source) return properties

    if (source.type == 'geojson') {
        let geofeatures = source['_data']['features']
        for (let i = 0; i < geofeatures.length; i++) {
            properties.push(geofeatures[i]['properties'])
        }
    }
    else if (source.type == 'vector') {
        const res = await axios.get(`http://localhost:5173/api/tile/vector/${sourceId}/info`)
        properties = res.data
    }
    console.log(properties);
}

onUnmounted(() => {
    mapStore.destroyMap()
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
        right: 5vw;
        bottom: 1vh;
    }

    div.featDetail {
        position: absolute;
        z-index: 2;
        left: 20vw;
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

:deep(.mapboxgl-ctrl.mapboxgl-ctrl-scale) {
    text-align: center;
    font-size: calc(0.5vw + 0.5vh);
}
</style>