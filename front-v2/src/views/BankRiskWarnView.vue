<template>
    <div class="risk-warn-container">
        <div class="map-container" id="map"></div>
        <div class="selector-container">
            <div class="place-selector-container selector-item-container">
                <div class="place-title selector-title">岸段选择：</div>
                <div class="place selector-content">
                    <el-select
                        v-model="placeValue"
                        placeholder="选择岸段"
                        style="width: 10vw; height: 3.5vh"
                        @change="sceneSelectChange"
                        popper-class="risk-popper"
                    >
                        <el-option
                            v-for="item in placeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                            <span class="section-name-text">{{
                                item.label
                            }}</span>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="scene-selector-container selector-item-container">
                <div class="scene-title selector-title">评估情景：</div>
                <div class="scene selector-content">
                    <el-select
                        v-model="sceneValue"
                        placeholder="选择专题"
                        style="width: 10vw; height: 3.5vh"
                        @change="sceneSelectChange"
                        popper-class="risk-popper"
                    >
                        <el-option
                            v-for="item in scenceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                            <span
                                style="float: left"
                                class="section-name-text"
                                >{{ item.place }}</span
                            >
                            <span
                                style="float: right"
                                class="section-class-text"
                                >{{ item.year }}</span
                            >
                        </el-option>
                        <template #footer>
                            <div class="add-select-button">新增评估情景</div>
                        </template>
                    </el-select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
import router from '../router/index'

let map = null

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.46987922676836, 32.03201616423072],
            [120.61089640208264, 32.052171362618625],
        ],
        {
            duration: 1500,
            zoom: 13,
        },
    )
}

const sceneValue = ref('mzs2024')

const scenceList = ref([
    {
        value: 'mzs2019',
        label: '民主沙2019地形',
        year: '2019',
        place: '民主沙右缘',
    },
    {
        value: 'mzs2023',
        label: '民主沙2023地形',
        year: '2023',
        place: '民主沙右缘',
    },
    {
        value: 'mzs2024',
        label: '民主沙2024地形',
        year: '2024',
        place: '民主沙右缘',
    },
])

const placeValue = ref('mzs')

const placeList = ref([{ value: 'mzs', label: '民主沙右缘示范段' }])

const sceneSelectChange = () => {}

const onAddOption = () => {}

onMounted(() => {
    map = new mapboxgl.Map({
        container: 'map', // container ID
        accessToken:
            'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.542, 32.036], // starting position [lng, lat]
        zoom: 8, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })
    map.on('load', async () => {
        // console.log('map loaded!!!')
        mapFlyToRiver(map)
        map.addSource('mzsPlaceLabelSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}'],
        })
        map.addSource('mzsPlaceLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankAreaSSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankAreaOne/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
        })
        map.addSource('dockAreaSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/dockArea/{x}/{y}/{z}'],
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
        // map.addLayer({
        //     id: 'mzsLabel',
        //     type: 'symbol',
        //     source: 'mzsPlaceLabelSource',
        //     'source-layer': 'default',
        //     layout: {
        //         'text-field': ['get', 'label'],
        //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        //         // 'text-offset': [0, 1.25],
        //         'text-anchor': 'left',
        //     },
        //     paint: {
        //         'text-color': 'rgba(31, 14, 126, 0.75)',
        //     },
        // })
        map.addLayer({
            id: 'dockArea',
            type: 'fill',
            source: 'dockAreaSource',
            'source-layer': 'default',
            paint: {
                'fill-color': '#18b915',
            },
        })
        map.addLayer({
            id: 'mzsSectionArea1',
            type: 'fill',
            source: 'mzsBankAreaSSource',
            'source-layer': 'default',
            paint: {
                'fill-color': [
                    'match',
                    ['get', 'stability'],
                    '较稳定',
                    '#18b915',
                    '稳定',
                    '#06bef1',
                    '不稳定',
                    '#df8105',
                    '较不稳定',
                    '#ee3603',
                    '#18b915',
                ],
            },
        })

        map.addLayer({
            id: 'mzsBankLine',
            type: 'line',
            source: 'mzsBankLineSource',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(31, 14, 223, 0.5)',
                'line-width': 4,
            },
        })
        // map.on('click', (e) => {
        //     console.log(map.queryRenderedFeatures([e.point.x, e.point.y]))

        // })
    })
})
</script>

<style lang="scss" scoped>
div.risk-warn-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;

    background: rgb(68, 105, 138);

    div.map-container {
        width: 100vw;
        height: 92vh;

        background-color: antiquewhite;
    }

    div.selector-container {
        position: absolute;
        top: 2vh;
        left: 1vw;
        height: 16vh;
        width: 24vw;
        border-radius: 8px;
        overflow: hidden;

        background-color: rgba(164, 212, 255, 0.8);
        backdrop-filter: blur(8px);
        border: 1px solid #0049a8;

        div.selector-item-container {
            height: 8vh;
            width: 22vw;
            padding-left: 1vw;
            padding-right: 1vw;
            line-height: 8vh;

            font-size: calc(0.8vw + 0.4vh);
            font-weight: bold;
            display: flex;
            &.place-selector-container {
                border-bottom: 2px solid #116cf5;
            }

            div.selector-title {
                letter-spacing: 0.3rem;
                width: 7vw;
            }

            div.selector-content {
                width: 14vw;
                height: 8vh;

                // background-color: #466ca7;
                :deep(.el-select) {
                    width: 14vw !important;
                    height: 5vh !important;
                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 2px 2px,
                        rgba(0, 119, 255, 0.6) 3px 3px;
                    border-radius: 6px;
                }

                :deep(.el-select__wrapper) {
                    height: 5vh;
                    line-height: 5vh;
                    border-radius: 6px;
                    font-family: 'Microsoft YaHei';
                    font-weight: bold;
                    font-size: calc(0.5vw + 0.8vh);
                    background-color: #e6f7ff;
                }

                :deep(.el-select__placeholder) {
                    color: #368dff;
                }

                :deep(.el-icon) {
                    width: 1vw;
                    height: 1vw;

                    svg {
                        width: 1vw;
                        height: 1vw;

                        path {
                            fill: #00098a;
                        }
                    }
                }
                :deep(.el-select__tags-text) {
                    color: #2b61f7;
                    font-size: calc(0.4vw + 0.4vh);
                }
            }
        }
    }
}

@keyframes border-dance {
    0% {
        background-position:
            0 0,
            100% 100%,
            0 100%,
            100% 0;
    }
    100% {
        background-position:
            100% 0,
            0 100%,
            0 0,
            100% 100%;
    }
}
</style>
