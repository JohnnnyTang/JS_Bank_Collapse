<template>
    <div class="section-choose-content" ref="containerDom">
        <div id="map" class="map-container"></div>

        <el-dialog v-model="sectionConfirmShow" title="绘制断面确认" width="40vh" :before-close="sectionConfirmClose">
            <span>确认使用此断面进行计算</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelSectionRese">取消</el-button>
                    <el-button type="primary" @click="cancelSectionRese">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <div class="current-param-container section">
            <div class="current-year-title">当前绘制断面</div>
            <div class="current-year-content" :class="{ 'two-line': sectionLineLabel != '' }">
                {{
                    sectionLineLabel == ''
                    ? '暂未绘制'
                    : '起点：' + sectionLineLabel
                }}
            </div>
            <div class="current-year-content two-line" v-if="sectionLineLabel != ''">
                {{ '终点：' + sectionLineLabelSec }}
            </div>
        </div>
    </div>
</template>

<script setup>
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref, onUnmounted } from 'vue'
import { initPureScratchMap } from '../../../utils/mapUtils'
import { useMultiIndexStore } from '@/store/multiIndexStore'

const containerDom = ref()
const sectionConfirmShow = ref(false)
const sectionLineLabel = ref('')
const sectionLineLabelSec = ref('')

const calcEnable = ref(false)
const paramFill = [false, false]

const sectionConfirmClose = () => { }

const cancelSectionRese = () => {
    sectionConfirmShow.value = false
}


const multiIndexStore = useMultiIndexStore()
let map = null

const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        line_string: true,
        trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    // defaultMode: '',
    styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
            id: 'gl-draw-line',
            type: 'line',
            filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['==', 'mode', 'draw_line_string'],
            ],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#D20C0C',
                'line-dasharray': [0.2, 2],
                'line-width': 2,
            },
        },
        // vertex point halos
        {
            id: 'gl-draw-polygon-and-line-vertex-halo-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['==', 'mode', 'draw_line_string'],
            ],
            paint: {
                'circle-radius': 5,
                'circle-color': '#FFF',
            },
        },
        // vertex points
        {
            id: 'gl-draw-polygon-and-line-vertex-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['==', 'mode', 'draw_line_string'],
            ],
            paint: {
                'circle-radius': 3,
                'circle-color': '#D20C0C',
            },
        },
        // INACTIVE (static, already drawn)
        // line stroke
        {
            id: 'gl-draw-line-static',
            type: 'line',
            filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'draw_line_string'],
            ],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#ff6262',
                'line-width': 3,
            },
        },
    ],
})





const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
onMounted(async () => {

    map = await initPureScratchMap({ id: 'map' })
    mapFlyToRiver(map)
    attachBaseLayer(map)
    map.on('draw.create', function (e) {
        console.log('aaa')
        console.log(e.features[0])
        sectionConfirmShow.value = true
        let lineFeature = e.features[0]
        sectionLineLabel.value =
            lineFeature.geometry.coordinates[0][0].toFixed(6) +
            ',' +
            lineFeature.geometry.coordinates[0][1].toFixed(6)
        sectionLineLabelSec.value =
            lineFeature.geometry.coordinates[1][0].toFixed(6) +
            ',' +
            lineFeature.geometry.coordinates[1][1].toFixed(6)
        let startWebMerCoord = convertToMercator(
            lineFeature.geometry.coordinates[0],
        )
        let endWebMerCoord = convertToMercator(
            lineFeature.geometry.coordinates[1],
        )
        paramFill[1] = true
        if (paramFill.includes(false)) {
            return
        } else {
            multiIndexStore.updateSectionStatus(1)
            calcEnable.value = true
        }
    })
})

onUnmounted(() => {

})

const attachBaseLayer = (map) => {
    map.addSource('mzsOverWaterSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsOverWaterBound/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsUnderWaterSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsUnderWaterBound/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsPlaceLabelSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsPlaceLineSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mapRaster2020', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
        ],
        tileSize: 1024,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.509, 32.023, 120.555, 32.0402],
    })
    map.addSource('mapRaster2021', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/mzs/2021/Before/{x}/{y}/{z}',
        ],
        tileSize: 1024,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.5116, 32.02316, 120.555, 32.0402],
    })
    map.addSource('mapRaster2022', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/mzs/2022/Before/{x}/{y}/{z}',
        ],
        tileSize: 1024,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.51, 32.02, 120.552, 32.04046],
    })
    map.addSource('mapRaster2023', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/mzs/2023/Before/{x}/{y}/{z}',
        ],
        tileSize: 1024,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.50548, 32.0224, 120.55304, 32.0415],
    })
    map.addSource('riverBeachSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/riverBeach/{x}/{y}/{z}'],
    })
    // 民主沙面
    map.addLayer({
        id: 'riverBeachArea',
        type: 'fill',
        source: 'riverBeachSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(210,244,247, 1)',
        },
    })
    map.addLayer({
        id: 'mzsLine',
        type: 'line',
        source: 'mzsPlaceLineSource',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(26, 87, 138, 0.6)',
            'line-width': 2,
        },
    })
    map.addLayer({
        id: 'mzsLabel',
        type: 'symbol',
        source: 'mzsPlaceLabelSource',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'left',
        },
        paint: {
            'text-color': 'rgba(31, 14, 126, 0.75)',
        },
    })
    map.addLayer({
        id: 'mzsOverWaterBound',
        type: 'fill',
        source: 'mzsOverWaterSource',
        'source-layer': 'default',
        paint: {
            'fill-color': '#a2800f',
            'fill-opacity': 0.5,
            'fill-outline-color': 'rgba(162, 128, 15, 0.)'
        },
    })
    map.addLayer({
        id: 'mzsUnderWaterBound',
        type: 'fill',
        source: 'mzsUnderWaterSource',
        'source-layer': 'default',
        paint: {
            'fill-color': '#101B94',
            'fill-opacity': 0.5,
            'fill-outline-color': 'rgba(16, 27, 148, 0.)'
        },
    })
    map.addControl(draw)
}
const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.47987922676836, 32.03001616423072],
            [120.59589640208264, 32.048171362618625],
        ],
        {
            pitch: 0,
            duration: 1500,
            // zoom: 8,
        },
    )
}
const convertToMercator = (lonLat) => {
    var D2R = Math.PI / 180,
        // 900913 properties
        A = 6378137.0,
        MAXEXTENT = 20037508.342789244

    // compensate longitudes passing the 180th meridian
    // from https://github.com/proj4js/proj4js/blob/master/lib/common/adjust_lon.js
    var adjusted =
        Math.abs(lonLat[0]) <= 180
            ? lonLat[0]
            : lonLat[0] - Math.sign(lonLat[0]) * 360
    var xy = [
        A * adjusted * D2R,
        A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lonLat[1] * D2R)),
    ]

    // if xy value is beyond maxextent (e.g. poles), return maxextent
    if (xy[0] > MAXEXTENT) xy[0] = MAXEXTENT
    if (xy[0] < -MAXEXTENT) xy[0] = -MAXEXTENT
    if (xy[1] > MAXEXTENT) xy[1] = MAXEXTENT
    if (xy[1] < -MAXEXTENT) xy[1] = -MAXEXTENT

    return xy
}


</script>

<style lang="scss" scoped>
div.section-choose-content {
    position: relative;
    height: 60vh;
    width: 50vw;
    overflow: hidden;

    &.section-choose-content {
        div.map-container {
            width: 100%;
            height: 100%;
            background-color: hsl(194, 69%, 91%);
            transition: .3s linear;
        }
    }


    div.current-param-container {
        position: absolute;
        left: 2%;
        top: 2%;

        width: 10%;
        height: 15%;
        // background-color: #004faa;
        text-align: center;
        border-radius: 6px;
        overflow: hidden;
        font-weight: bold;

        border: 2px solid #1735ae;

        &.section {
            width: 28%;
        }

        div.current-year-title {
            height: 45%;
            display: grid;
            place-items: center;
            background-color: #1753ae;
            font-size: 5%;
            color: #cefffd;
        }

        div.current-year-content {
            height: 55%;
            display: grid;
            place-items: center;
            background-color: #dcebf8;
            color: #001cb8;
            font-size: calc(0.6vw + 0.6vh);

            &.two-line {
                height: 27.5%;
                font-size: calc(0.3vw + 0.3vh);
            }
        }
    }
}

:deep(.el-progress__text) {
    // color: rgba(162, 128, 15, 0.5);
    font-size: calc(0.6vw + 0.6vh) !important;
}

:deep(.mapboxgl-ctrl-group button) {
    width: 38px;
    height: 38px;
}

:deep(.mapbox-gl-draw_line) {
    background-size: contain;
}

:deep(.mapbox-gl-draw_trash) {
    background-size: contain
}
</style>
