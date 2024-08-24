<template>
    <div class="section-choose-content" ref="containerDom" id="section-draw-container">
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
        <div class="section-selectior-item" v-show="demListShow">
            <el-select v-model="selectedDem" placeholder="选择地形" style="width: 10vw; height: 3.5vh"
                @change="selectedDemChange">
                <el-option v-for="(item, index) in props.demResources" :key="index" :label="item.name + '地形'
                    " :value="item.path">
                    <!-- <span>{{ item.year }}</span> -->
                    <div style="text-align: center;">{{ item.name + '地形' }}</div>

                    <!-- <span style="float: left">{{
                        item.year
                    }}</span>
                    <span style="float: right">{{
                        item.time == 'before' ? '汛前' : '汛后'
                    }}</span> -->
                </el-option>
            </el-select>
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
import { useMapStore } from '@/store/mapStore'

const mapStore = useMapStore()
const containerDom = ref()
const sectionConfirmShow = ref(false)
const sectionLineLabel = ref('')
const sectionLineLabelSec = ref('')
const selectedDem = ref('')
const calcEnable = ref(false)
const paramFill = [false, false]
const sectionConfirmClose = () => { }
const cancelSectionRese = () => {
    sectionConfirmShow.value = false
}

// demResources 
const props = defineProps({
    demResources: {
        type: Array,
        default: () => [{ year: 1998 },
        { year: 2004 }]
    },
    demListShow: {
        type: Boolean,
        default: true
    }
})


const sectionRasterList = ref([
    // { year: 2020, time: 'before', layerName: '' },
    // { year: 2021, time: 'before', layerName: '' },
    // { year: 2022, time: 'before', layerName: '' },
    // { year: 2023, time: 'before', layerName: '' },
    { year: 1998 },
    { year: 2004 }
])


// const multiIndexStore = useMultiIndexStore()
let line = null
let map = null
const emit = defineEmits(['sectionDraw', 'demSelect'])

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
                'line-color': '#d18800',
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
                'circle-color': '#d49100',
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
                'line-color': '#000000',
                'line-width': 3,
            },
        },
    ],
})

const resizeMap = () => {
    setTimeout(() => {
        console.log('resize')
        if (map) {
            console.log('map resize')
            map.resize()
            mapFlyToRiver(map)
        }
    }, 1);
}

const getSection = () => {
    if (line) {
        const geojson = {
            "type": "FeatureCollection",
            "features": [line]
        }
        return geojson
    }
    else {
        console.warn('No feature found')
        return null
    }
}

const selectedDemChange = (val) => {
    emit('demSelect', val)
}



const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
onMounted(async () => {

    map = await initPureScratchMap({ id: 'map' })
    map.resize()
    mapStore.setMap(map)
    mapFlyToRiver(map)
    attachBaseLayer(map)
    // map.showTileBoundaries = true;
    map.on('draw.create', function (e) {
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
        line = lineFeature
        emit('sectionDraw', line)
        paramFill[1] = true
        if (paramFill.includes(false)) {
            return
        } else {
            // multiIndexStore.updateSectionStatus(1)
            calcEnable.value = true
        }
    })
    map.resize()

})

onUnmounted(() => {

})

defineExpose({
    resizeMap,
    getSection
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
    height: 100%;
    width: 100%;
    overflow: hidden;

    &.section-choose-content {
        div.map-container {
            width: 100%;
            height: 100%;
            background-color: hsl(194, 69%, 91%);
            // transition: .3s linear;
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
            width: 25%;
        }

        div.current-year-title {
            height: 45%;
            display: grid;
            place-items: center;
            background-color: #1753ae;
            font-size: calc(0.6vw + 0.8vh);
            color: #cefffd;
        }

        div.current-year-content {
            height: 55%;
            display: grid;
            place-items: center;
            background-color: #dcebf8;
            color: #001cb8;
            font-size: calc(0.4vw + 0.4vh);

            &.two-line {
                height: 27.5%;
                font-size: calc(0.4vw + 0.4vh);
            }
        }
    }

    div.section-selectior-item {
        position: absolute;
        right: 4vw;
        top: 2.4vh;
        width: 10vw;
        height: 3.3vh;

        line-height: 3.3vh;
        text-align: center;

        // background-color: #eef3ff;
        :deep(.el-select) {
            height: 3.3vh;
            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 2px 2px,
                rgba(0, 119, 255, 0.6) 3px 4px;
            border-radius: 6px;
            background-color: rgba(0, 119, 255, 1);
        }

        :deep(.el-select__wrapper) {
            height: 3.3vh;
            line-height: 3.3vh;
            border-radius: 6px;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.5vw + 0.6vh);
            background-color: #e6f7ff;
        }

        :deep(.el-select__placeholder) {
            color: #738ab6;
        }

        :deep(.el-icon) {
            width: 0.5vw;
            height: 0.5vw;

            svg {
                width: 0.5vw;
                height: 0.5vw;

                path {
                    fill: #001cb8;
                }
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
