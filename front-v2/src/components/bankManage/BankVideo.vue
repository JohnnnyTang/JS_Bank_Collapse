<template>
    <div class="bank-video-container">
        <div class="video-list-container">
            <dv-border-box12 backgroundColor="rgb(233, 250, 255)">
                <div class="video-list-title">实时现场监控视频</div>
                <div class="video-page-container">
                    <div
                        v-for="(item, index) in videoList"
                        :key="index"
                        class="video-box"
                    >
                        <div class="video-content">
                            <!-- <video
                                width="100%"
                                height="100%"
                                :id="item.name"
                                controls
                                preload="auto"
                                class="video-js vjs-default-skin"
                            ><source :src="item.videoUrl" /></video> -->
                            <!-- <videoPlay :src="item.videoUrl" autoPlay :type="m3u8"/> -->
                            <iframe
                                :src="item.videoUrl + token"
                                width="100%"
                                height="100%"
                                :id="item.name"
                                allowfullscreen
                            >
                            </iframe>
                        </div>
                        <div class="video-title">{{ item.name }}</div>
                    </div>
                </div>
                <div class="pagination-container">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-count="1"
                    />
                </div>
            </dv-border-box12>
        </div>
        <div class="video-info-container">
            <dv-border-box10>
                <div class="video-info-title">监控点位信息</div>
                <div
                    class="video-info-card"
                    v-for="(item, index) in videoList"
                    :key="index"
                >
                    <div class="video-card-title">{{ item.name }}</div>
                    <div class="video-key-val">
                        <div class="video-key">布设点位：</div>
                        <div class="video-val" v-if="changeStatus">
                            <el-input
                                v-model="item.position"
                                style="
                                    width: 100%;
                                    height: 100%;
                                    font-size: calc(0.6vw + 0.6vh);
                                "
                                :autosize="{ minRows: 4, maxRows: 6 }"
                            />
                        </div>
                        <div class="video-val" v-else>{{ item.position }}</div>
                    </div>
                    <div class="video-key-val">
                        <div class="video-key">设备编号：</div>
                        <div class="video-val">{{ item.code }}</div>
                    </div>
                    <!-- <div class="change-button-container">
                        <div
                            class="change-button"
                            @click="modifyData"
                            :class="{ modify: changeStatus }"
                        >
                            {{ changeStatus ? '提交' : '修改' }}
                        </div>
                        <div
                            class="cancel-button"
                            v-if="changeStatus"
                            @click="cancelClick"
                        >
                            取消
                        </div>
                    </div> -->
                </div>
                <div class="map-container" id="map"></div>
            </dv-border-box10>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import BackEndRequest from '../../api/backend'
import { loadImage } from '../../utils/mapUtils'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
// import 'viplayer/dist/index.css'
// import { videoPlay } from 'viplayer'
// const token = 'at.2q8ej4p4114dtudb20awr9763vfz1f6o-5j403u7nkd-1ya7mgb-wv9z5z55f'
const token = ref(
    'at.9muaq1l4dwsnaqkfbhn98qxe10ud6kgw-54xl36oksd-1bmu6o1-pilufj5d3',
)
const defaultVal = [
    {
        name: '民主沙上游围堤监控',
        code: 'FB5033036',
        position: '32.04023206, 120.51992163',
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.hd.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        code: 'FB5033037',
        position: '32.03683063, 120.52666202',
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.hd.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙海事码头监控',
        position: '32.02839471, 120.54611474',
        code: 'FB5033035',
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=`,
    },
]

const videoList = ref([
    {
        name: '民主沙上游围堤监控',
        code: 'FB5033036',
        position: '32.0432963, 120.5122242',
        videoUrl: `https://open.ys7.com/ezopen/h5/`,
        // videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.hd.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        code: 'FB5033037',
        position: '32.0381061, 120.5263473',
        videoUrl: `https://open.ys7.com/ezopen/h5/`,
        // videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.hd.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙海事码头监控',
        code: 'FB5033035',
        position: '32.0316674, 120.5402574',
        videoUrl: `https://open.ys7.com/ezopen/h5/`,
        // videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=`,
    },
])

const changeStatus = ref(false)

const modifyData = () => {
    if (changeStatus.value) {
    } else {
    }
    changeStatus.value = !changeStatus.value
}

const cancelClick = () => {
    videoList.value = defaultVal
    changeStatus.value = false
}

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.48957922676836, 32.03001616423072],
            [120.59109640208264, 32.054171362618625],
        ],
        {
            pitch: 32.45,
            duration: 1500,
            // zoom: 8,
        },
    )
}

const makeVideoDeviceGeojson = (vidInfoList) => {
    return {
        type: 'FeatureCollection',
        features: vidInfoList.map((item) => {
            return {
                type: 'Feature',
                properties: item,
                geometry: {
                    coordinates: [item.longitude, item.latitude],
                    type: 'Point',
                },
            }
        }),
    }
}

let map

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
        mapFlyToRiver(map)

        map.addSource('mzsPlaceLabelSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}'],
        })
        map.addSource('mzsPlaceLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankAreaSSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankAreaS/{x}/{y}/{z}'],
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
                'line-width': 1,
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
                'line-color': 'rgba(31, 14, 223, 0.75)',
                'line-width': 4,
            },
        })
        await loadImage(map, '/geoStyle/video_monitor.png', 'vid-device-icon')
        const videoDeviceInfoList = (await BackEndRequest.getVideoDeviceInfo())
            .data
        const vidGeojson = makeVideoDeviceGeojson(videoDeviceInfoList)
        map.addSource('vid-source', {
            type: 'geojson',
            data: vidGeojson,
        })
        map.addLayer({
            id: 'vid-icon',
            type: 'symbol',
            source: 'vid-source',
            layout: {
                'icon-image': 'vid-device-icon',
                'icon-size': 0.14,
                'icon-allow-overlap': true,
            },
        })
        map.addLayer({
            id: 'vid-label',
            type: 'symbol',
            source: 'vid-source',
            layout: {
                'text-field': ['get', 'machineId'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [-0.5, 1.25],
                'text-anchor': 'top',
                'text-allow-overlap': true,
            },
            paint: {
                'text-color': 'rgba(81, 34, 186, 1)',
            },
        })
        // console.log('vid', vidGeojson)
    })
})
</script>

<style lang="scss" scoped>
div.bank-video-container {
    width: 100%;
    height: 100%;
    // padding-top: 1vh;
    // padding-bottom: 1vh;
    // margin-left: 0.5vw;
    // padding-right: 0.5vw;

    border-radius: 12px;
    // margin-bottom: 1vh;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    // background-color: rgb(240, 255, 240);

    div.video-list-container {
        width: 60vw;
        height: 90vh;
        // background-color: rgb(233, 250, 255);

        border-radius: 8px;
        box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);

        div.video-list-title {
            width: 58vw;
            margin-left: 1vw;
            height: 6vh;
            line-height: 6vh;

            text-align: center;
            font-weight: bold;
            font-size: calc(0.9vw + 0.9vh);

            border-bottom: 3px solid;
        }

        div.video-page-container {
            width: 60vw;
            height: 78vh;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-around;
            align-content: space-around;
            // align-items: flex-start;

            div.video-box {
                width: 48%;
                height: 48%;

                background-color: rgba(172, 215, 255, 0.651);

                div.video-content {
                    height: 90%;
                    width: 100%;

                    background-color: rgb(34, 75, 165);
                }

                div.video-title {
                    line-height: 3vh;
                    height: 3vh;
                    text-align: center;

                    font-weight: bold;
                    font-size: calc(0.6vw + 0.6vh);
                }
            }

            // background-color: aliceblue;
        }

        div.pagination-container {
            height: 6vh;
            width: 30vw;
            margin-left: 15vw;

            // background-color: aliceblue;

            display: flex;
            justify-content: center;
            align-items: center;

            div.el-pagination {
                --el-pagination-font-size: calc(0.45vw + 0.45vh);
            }

            :deep(ul.el-pager) {
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold',
                    sans-serif;
                text-align: center;
            }

            :deep(button.btn-prev) {
                padding: 0 0 0 0;
            }
            :deep(button.btn-next) {
                padding: 0 0 0 0;
            }

            :deep(i.el-icon) {
                width: 100%;
                height: 100%;

                svg {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    div.video-info-container {
        width: 26vw;
        height: 90vh;
        border-radius: 8px;
        box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);

        background-color: rgb(215, 230, 250);

        div.video-info-title {
            width: 25vw;
            margin-left: 0.5vw;
            height: 6vh;
            line-height: 6vh;

            text-align: center;
            font-weight: bold;
            font-size: calc(0.9vw + 0.9vh);

            border-bottom: 3px solid;
        }

        div.video-info-card {
            width: 24vw;
            margin-left: 1vw;
            height: 13vh;
            border-radius: 8px;
            margin-top: 2vh;

            background-color: rgb(190, 242, 255);
            text-align: center;
            border: 2px solid #3361c4;
            box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);
            transition: all 0.3s cubic-bezier(0.68, -0.35, 0.265, 1.35);

            &:hover {
                transform: scale(1.05);
            }

            div.video-card-title {
                height: 4vh;
                width: 22vw;
                margin-left: 1vw;
                padding-left: 0.5vw;
                text-align: left;
                line-height: 4vh;

                font-size: calc(0.7vw + 0.6vh);
                font-weight: bold;

                border-bottom: 3px solid #1649b8;
            }

            div.video-key-val {
                height: 4vh;
                width: 24vw;
                display: flex;
                line-height: 4vh;
                font-size: calc(0.6vw + 0.5vh);

                div.video-key {
                    width: 8vw;
                    color: #0842c0;
                }
                div.video-val {
                    width: 16vw;
                    font-weight: bold;
                }
            }

            div.change-button-container {
                position: relative;
                width: 8vw;
                height: 4vh;
                top: 0vh;
                left: 14vw;

                // background-color: #0040a0;

                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;

                text-align: center;
                font-weight: bold;
                font-size: calc(0.8vw + 0.4vh);

                div.change-button {
                    width: 8vw;
                    height: 4vh;
                    line-height: 4vh;
                    border-radius: 6px;

                    background-color: #b4ddff;
                    transition: all 0.2s ease-in-out;

                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 2px 2px,
                        rgba(0, 119, 255, 0.6) 3px 3px;

                    &.modify {
                        width: 3.2vw;
                    }
                    &:hover {
                        cursor: pointer;
                        transform: translate3d(2px, 2px, 2px);
                        color: #0539a8;
                        box-shadow:
                            rgba(0, 132, 255, 0.8) 1px 1px,
                            rgba(0, 119, 255, 0.7) 2px 2px,
                            rgba(0, 119, 255, 0.6) 3px 3px,
                            rgba(0, 119, 255, 0.4) 4px 4px;
                    }
                }

                div.cancel-button {
                    width: 3.2vw;
                    height: 4vh;
                    line-height: 4vh;
                    transition: all 0.6s ease-in-out;

                    border-radius: 6px;
                    color: #f0f8ff;
                    background-color: #2358eb;
                    box-shadow:
                        rgba(29, 142, 248, 0.8) 1px 1px,
                        rgba(26, 133, 255, 0.7) 2px 2px,
                        rgba(25, 132, 255, 0.6) 3px 3px;

                    &:hover {
                        cursor: pointer;
                        color: #85f7ff;
                        transform: translate3d(2px, 2px, 2px);
                        box-shadow:
                            rgba(29, 142, 248, 0.8) 1px 1px,
                            rgba(26, 133, 255, 0.7) 2px 2px,
                            rgba(25, 132, 255, 0.6) 3px 3px,
                            rgba(35, 138, 255, 0.4) 4px 4px;
                    }
                }
            }
        }

        div.map-container {
            margin-left: 0.5vw;
            margin-top: 1vh;
            width: 25vw;
            height: 36vh;

            background-color: #1649b8;
        }
    }
}
</style>
