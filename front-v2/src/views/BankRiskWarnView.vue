<template>
    <div class="risk-warn-container">
        <div class="map-container" id="map"></div>
        <div class="scene-select-container">
            <div class="scene-select-title">专题崩岸风险计算</div>
            <div class="risk-scene-content">
                <RiskSceneCard
                    v-for="(item, index) in sceneCardInfoList"
                    :key="index"
                    :name="item.name"
                    :year="item.year"
                    :time-string="item.createTime"
                    :active="item.active"
                    :index="index"
                    @change-scene="changeScene"
                />
                <div class="add-scene-card" @click="navToMultiCalc">
                    <div class="add-scene-content">
                        <div class="add-scene-icon"></div>
                        <div class="add-scene-text">自定义风险计算</div>
                    </div>
                </div>
            </div>
        </div>
        <SectionStable v-loading="stableLoading" ref="sectionStableVue" />
        <div class="nav-manage-button" @click="navToMultiCalc">
            <div class="nav-manage-icon"></div>
            <div class="nav-manage-text">自定义风险计算</div>
        </div>
        <div class="stable-legend-container">
            <div class="stable-legend-item" v-for="i in 4" :key="i">
                <div class="stable-legend-mark" :status-id="i"></div>
                <div class="stable-legend-text">{{ statusList[i-1] }}</div>
            </div>
        </div>
        <SectionRiskVue />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import SectionStable from '../components/bankTwin/SectionStable.vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import RiskSceneCard from '../components/bankRisk/RiskSceneCard.vue'
import SectionRiskVue from '../components/bankRisk/SectionRisk.vue'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
import router from '../router/index'

let map = null

const sectionStableVue = ref()

const statusList = ['较稳定', '稳定', '不稳定', '较不稳定']

const navToMultiCalc = () => {
    router.push('/modelStore/riskWarning')
}

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.46987922676836, 32.03201616423072],
            [120.61089640208264, 32.052171362618625],
        ],
        {
            pitch: 52.45,
            duration: 1500,
            // zoom: 8,
        },
    )
}

const stableLoading = ref(true)

const sceneCardInfoList = ref([
    {
        name: '民主沙右缘预警岸段',
        year: '2023',
        createTime: '2024年4月10日',
        active: true,
    },
    {
        name: '民主沙右缘预警岸段',
        year: '2019',
        createTime: '2024年4月16日',
        active: false,
    },
])

const sectionPaint = {
    default: {
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
    2019: {
        'fill-color': [
            'match',
            ['get', 'stability_2019'],
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
}

let lastActiveIndex = 0
let firstTimeCalc = true

const changeScene = (val) => {
    if (val != lastActiveIndex) {
        sceneCardInfoList.value[lastActiveIndex].active = false
        sceneCardInfoList.value[val].active = true
        lastActiveIndex = val
        if (val == 1) {
            if (firstTimeCalc) {
                setTimeout(() => {
                    map.setPaintProperty(
                        'mzsSectionArea1',
                        'fill-color',
                        sectionPaint['2019']['fill-color'],
                    )
                }, 1200)
                firstTimeCalc = false
            } else {
                map.setPaintProperty(
                    'mzsSectionArea1',
                    'fill-color',
                    sectionPaint['2019']['fill-color'],
                )
            }
            stableLoading.value = true
            setTimeout(() => {
                sectionStableVue.value.changeData(1)
                stableLoading.value = false
            }, 1200)
        } else {
            map.setPaintProperty(
                'mzsSectionArea1',
                'fill-color',
                sectionPaint['default']['fill-color'],
            )
            stableLoading.value = true
            setTimeout(() => {
                sectionStableVue.value.changeData(0)
                stableLoading.value = false
            }, 1200)
        }
    }
    return
}

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
            tiles: [tileServer + '/tile/vector/mzsBankAreaS/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
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
        setTimeout(() => {
            map.addLayer(
                {
                    id: 'mzsSectionArea1',
                    type: 'fill',
                    source: 'mzsBankAreaSSource',
                    'source-layer': 'default',
                    paint: sectionPaint.default,
                },
                'mzsBankLine',
            )
            stableLoading.value = false
        }, 1500)

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
$rotate-border-width: 3px;
$rotate-border-length: 12px;
$rotate-border-color: rgb(24, 54, 189);
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

    div.scene-select-container {
        position: absolute;
        left: 1vw;
        top: 4vh;

        width: 24vw;
        height: 84vh;
        background-color: rgba(213, 235, 255, 0.6);
        backdrop-filter: blur(8px);
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid #002a69;

        div.scene-select-title {
            height: 6vh;
            line-height: 6vh;
            width: 24vw;

            background-color: rgb(16, 97, 173);
            text-align: center;
            font-size: calc(0.9vw + 0.9vh);
            font-weight: bold;
            color: aliceblue;

            border-bottom: 3px solid #00e1ff;
        }

        div.risk-scene-content {
            height: 70vh;
            width: 24vw;

            // background-color: #00e1ff;

            div.add-scene-card {
                margin-top: 3vh;
                margin-left: 1vw;
                width: 22vw;
                height: 12vh;
                border-radius: 14px;
                border: 2px dashed rgb(24, 54, 189);

                &:hover {
                    border: none;
                    background: linear-gradient(
                            90deg,
                            $rotate-border-color 50%,
                            transparent 50%
                        ),
                        linear-gradient(
                            90deg,
                            $rotate-border-color 50%,
                            transparent 50%
                        ),
                        linear-gradient(
                            0deg,
                            $rotate-border-color 50%,
                            transparent 50%
                        ),
                        linear-gradient(
                            0deg,
                            $rotate-border-color 50%,
                            transparent 50%
                        );
                    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
                    background-size:
                        $rotate-border-length $rotate-border-width,
                        $rotate-border-length $rotate-border-width,
                        $rotate-border-width $rotate-border-length,
                        $rotate-border-width $rotate-border-length;
                    padding: calc($rotate-border-width + 3px);
                    animation: border-dance 10s infinite linear;
                }

                div.add-scene-content {
                    width: 22vw;
                    height: 12vh;
                    border-radius: 14px;

                    background-color: rgba(9, 82, 151, 0.6);
                    backdrop-filter: blur(8px);

                    display: flex;
                    flex-flow: row wrap;
                    justify-content: center;
                    align-content: center;
                    transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);

                    &:hover {
                        cursor: pointer;
                        transform: scale(0.99, 0.99);
                    }

                    div.add-scene-icon {
                        height: 6vh;
                        width: 6vh;
                        background-color: #bce7ff;

                        border-top-left-radius: 10px;
                        border-bottom-left-radius: 10px;
                        background-image: url('/add.png');
                        background-size: 80% 80%;
                        background-position: 50% 50%;
                        background-repeat: no-repeat;
                    }
                    div.add-scene-text {
                        height: 6vh;
                        line-height: 6vh;
                        background-color: #bce7ff;

                        text-align: center;
                        padding-left: 0.2vw;
                        padding-right: 0.4vw;

                        font-size: calc(0.6vw + 0.6vh);
                        font-weight: bold;
                        border-top-right-radius: 10px;
                        border-bottom-right-radius: 10px;
                    }
                }
            }
        }
    }

    div.nav-manage-button {
        position: absolute;
        right: 0;
        top: 2vh;

        width: 6vh;
        height: 6vh;
        background-color: rgb(3, 61, 138);
        transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;

        display: flex;
        flex-flow: row nowrap;
        overflow: hidden;
        z-index: 3;

        &:hover {
            width: 24vh;
            cursor: pointer;
            animation: zoom-in-out 1s infinite linear;
        }

        div.nav-manage-icon {
            width: 6vh;
            height: 6vh;
            flex-shrink: 0;

            background-image: url('/calculator.png');
            background-size: 75%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
        }

        div.nav-manage-text {
            width: 18vh;
            height: 6vh;
            line-height: 6vh;
            text-align: center;

            font-size: calc(0.9vw + 0.4vh);
            font-weight: bold;
            color: rgb(140, 255, 255);
        }
    }

    div.stable-legend-container {
        position: absolute;
        top: 1vh;
        right: 29vh;

        height: 10vh;
        width: 6vw;

        background-color: #cce4ff;
        border: 2px solid #152baa;

        display: flex;
        flex-flow: column nowrap;
        border-radius: 8px;
        overflow: hidden;

        div.stable-legend-item {
            display: flex;
            flex-flow: row nowrap;
            height: 25%;
            width: 100%;

            div.stable-legend-mark {
                width: 32%;
                height: 2vh;
                margin-top: 0.25vh;
                margin-left: 3%;
                border-radius: 12px;

                &[status-id='1'] {
                    background-color: #08e02c;
                }
                &[status-id='2'] {
                    background-color: #1092ce;
                }
                &[status-id='3'] {
                    background-color: rgb(223,129,5);
                }
                &[status-id='4'] {
                    background-color: rgb(238,54,3);
                }
            }

            div.stable-legend-text {
                width: 64%;
                height: 2.5vh;
                line-height: 2.5vh;
                text-align: center;
                font-weight: bold;
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
