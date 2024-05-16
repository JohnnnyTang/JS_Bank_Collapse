<template>
    <div class="twin-main-container" ref="containerDom">
        <div class="nav-manage-button" @click="navToManage">
            <div class="nav-manage-icon"></div>
            <div class="nav-manage-text">监测详情</div>
            <div class="nav-arrow-icon"></div>
        </div>
        <div class="visual-tab-container">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 100)">
                <e-tab style="z-index: 3; font-size: calc(0.4vw + 0.4vh)" :items="items" :columns="2"></e-tab>
            </DvBorderBox12>
        </div>
        <BankBasicInfoVue />
        <RealtimeStatusVue />
        <RealtimeVideoVue :active="!warnActive" />
        <!-- <SectionRisk />
        <DeviceWarn /> -->

        <div class="marquee-container">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 100)">
                <div class="marquee-block" ref="marqueeBlockDom" :style="{ animationDuration: animateTime }">
                    <div class="no-warn-block" v-if="warningList.length == 0"
                        style="font-size: calc(0.5vw + 0.7vh); color: #e7f2ff">
                        {{ `近一小时内无报警信息` }}
                    </div>
                    <div v-else class="warn-block" v-for="(warningString, index) in warningList" :key="index">
                        <div style="
                                background-size: contain;
                                background-image: url('/icons/warning.png');
                                width: 3vh;
                                height: 3vh;
                            "></div>
                        <div style="
                                font-size: calc(0.5vw + 0.7vh);
                                color: #e7f2ff;
                                margin-left: 0.5vw;
                            ">
                            {{ warningString }}
                        </div>
                    </div>
                </div>
            </DvBorderBox12>
        </div>

        <div class="monitor-legend-container">
            <div class="monitor-legend-title">监测设备图例</div>
            <div class="monitor-legend-block">
                <!-- GNSS only -->
                <div class="monitor-legend-item GNSS">
                    <div class="item-title">
                        <span>{{ gnssLegendInfo.text1 }}</span>
                        <span style="font-weight: bold">{{ gnssLegendInfo.strong }}</span>
                        <span>{{ gnssLegendInfo.text2 }}</span>
                    </div>
                    <div style="display: flex; flex-direction: row;">
                        <div class="legend-block">
                            <div class="icon-block GNSS-icon" :style="{ backgroundImage: `url(${gnssLegendInfo.icon1})` }">
                            </div>
                            <span style="
                                text-align: center;
                                width: 100%;
                                display: block;
                                line-height: 2.5vh;
                                color: rgb(16,71,165);
                                text-shadow: #7388c148 1px 1px 0;
                            ">
                                {{ gnssLegendInfo.device1 }}</span>
                        </div>
                        <div class="legend-block">
                            <div class="icon-block GNSS-icon" :style="{ backgroundImage: `url(${gnssLegendInfo.icon2})` }">
                            </div>
                            <span style="
                                text-align: center;
                                width: 100%;
                                display: block;
                                line-height: 2.5vh;
                                color: rgb(16,71,165);
                                text-shadow: #7388c148 1px 1px 0;
                            ">
                                {{ gnssLegendInfo.device2 }}</span>
                        </div>
                    </div>

                </div>
                <!-- others -->
                <div v-for="(item, index) in legendList" :key="index" class="monitor-legend-item">
                    <div class="item-title">
                        <span>{{ item.text1 }}</span>
                        <span style="font-weight: bold">{{ item.strong }}</span>
                        <span>{{ item.text2 }}</span>
                    </div>
                    <div class="legend-block">
                        <div class="icon-block" :style="{ backgroundImage: `url(${item.icon})` }"></div>
                        <span style="
                                text-align: center;
                                width: 100%;
                                display: block;
                                line-height: 2.5vh;
                                color: rgb(16,71,165);
                                text-shadow: #7388c148 1px 1px 0;
                            ">
                            {{ item.device }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="warn-detail-container" :class="warnActive ? 'active' : 'in-active'">
            <div class="warn-detail-title">预警信息详情</div>
            <div class="warn-detail-content">
                <div class="key-val-container" v-for="(item, index) in warnKeyValList" :key="index">
                    <div class="key-text">{{ item.key + '：' }}</div>
                    <el-scrollbar>
                        <div class="val-text">{{ item.val }}</div>
                    </el-scrollbar>
                </div>
            </div>
        </div>

        <div class="warn-history-container" :class="warnActive ? 'active' : 'in-active'">
            <div class="warn-detail-title">历史预警信息</div>
        </div>

        <div class="map-container" id="map"></div>
    </div>
</template>

<script setup>
import router from '../router'
import { onMounted, ref, onUnmounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ETab } from 'e-datav-vue3'
import {
    BorderBox12 as DvBorderBox12,
    BorderBox7 as DvBorderBox7,
} from '@kjgl77/datav-vue3'
import BankBasicInfoVue from '../components/bankTwin/BankBasicInfo.vue'
import RealtimeStatusVue from '../components/bankTwin/RealtimeStatus.vue'
import RealtimeVideoVue from '../components/bankTwin/RealtimeVideo.vue'
// import SectionRisk from '../components/bankTwin/SectionRisk.vue'
// import DeviceWarn from '../components/bankTwin/DeviceWarn.vue'
import { mapInit } from '../components/bankManage/mapInit'
import { useMapStore, useWarnInfoStore } from '../store/mapStore'
import dayjs from 'dayjs'

const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const containerDom = ref(null)
const animateTime = ref('0s')
const marqueeBlockDom = ref()
const warnActive = ref(false)

// mapboxgl.accessToken =
//     'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'
let map = null
const warnInfoStore = useWarnInfoStore()
const token = ref(
    'at.9muaq1l4dwsnaqkfbhn98qxe10ud6kgw-54xl36oksd-1bmu6o1-pilufj5d3',
)

const items = ref([
    { label: '二维视图', value: 'tab1' },
    { label: '三维视图', value: 'tab2' },
])

const warningList = ref([])
/*
    {
        icon: '/icons/GNSS测量站.png',
        text1: '土体',
        strong: '表面位移',
        text2: '监测',
        device: 'GNSS',
    },
*/
const gnssLegendInfo = {
    icon1: '/icons/GNSS测量站.png',
    icon2: '/icons/GNSS基准站.png',
    text1: '土体',
    strong: '表面位移',
    text2: '监测',
    device1: 'GNSS测量站',
    device2: 'GNSS基准站',
}
const legendList = [
    {
        icon: '/icons/测斜仪.png',
        text1: '土体',
        strong: '内部位移',
        text2: '监测',
        device: '测斜仪',
    },
    {
        icon: '/icons/孔隙水压力计.png',
        text1: '土体',
        strong: '潜水位',
        text2: '监测',
        device: '孔隙水压力计',
    },
    {
        icon: '/icons/应力桩.png',
        text1: '土体',
        strong: '应力应变',
        text2: '监测',
        device: '应力桩',
    },
]

const gnssIdMap = {
    'MZS120.51749289_32.04059243_1': 'CL-01',
    'MZS120.51977143_32.04001152_1': 'CL-02',
    'MZS120.52557975_32.03825056_1': 'CL-03',
    'MZS120.52660704_32.03676583_1': 'CL-04',
    'MZS120.53334877_32.03227055_1': 'CL-05',
    'MZS120.54599538_32.02837993_1': 'CL-06',
    'MZS120.55327892_32.02707923_1': 'CL-07',
    'MZS120.55649757_32.02592404_1': 'CL-08',
    'MZS120.56334257_32.02298144_1': 'CL-09',
    'MZS120.56944728_32.02070961_1': 'CL-10',
}

const warnKeyValList = ref([
    { key: '危险区域', val: '暂无' },
    { key: '出险时间', val: '暂无' },
    { key: '设备信息', val: '暂无' },
    { key: '管理单位', val: '暂无' },
    { key: '联系方式', val: '暂无' },
    { key: '是否发送通知', val: '暂无' },
])

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.46957922676836, 32.01001616423072],
            [120.61109640208264, 32.074171362618625],
        ],
        {
            pitch: 32.45,
            duration: 1500,
            // zoom: 8,
        },
    )
}

// const resizeObserver = new ResizeObserver((entries) => {
//     mapFlyToRiver(map)
// })

watch(
    () => warnInfoStore.warnInfo,
    (newV, oldV) => {
        updateWarnInfoDesc()
    },
)

function unique(arr) {
    return Array.from(new Set(arr))
}

const navToManage = () => {
    router.push('/bankManage')
}
const updateWarnInfoDesc = () => {
    const DEVICETYPEMAP = ['GNSS', '应力桩', '水压力计', '测斜仪']
    let warnInfo = warnInfoStore.warnInfo
    let WARN_TEXT = []
    console.log('1231', warnInfo)
    let deviceNameList = []
    let warnTimeList = []

    for (let i = 0; i < warnInfo.length; i++) {
        // 报警设备信息
        let deviceId = warnInfo[i].deviceId
        deviceNameList.push(gnssIdMap[warnInfo[i].deviceId])
        warnTimeList.push(warnInfo[i].warnTime.split(' ')[1])
        let deviceName = DEVICETYPEMAP[deviceId.slice(-1) - 1]
        let warnTime = dayjs(warnInfo[i].warnTime).format('M月D日H时m分s秒')
        let threeDiff = warnInfo[i].threeDiff.toFixed(3)

        let warnString = `警告：${deviceName}(${deviceId})于${warnTime}土体表面累计位移${threeDiff}mm
        ！`
        WARN_TEXT.push(warnString)
    }
    warnKeyValList.value[2].val = unique(deviceNameList).join(',')
    warnKeyValList.value[1].val = unique(warnTimeList).join(',')
    warnKeyValList.value[5].val = '是'

    warningList.value = WARN_TEXT
    warnActive.value = true

    const marqueeBlockWidth = marqueeBlockDom.value.offsetWidth
    animateTime.value = `${marqueeBlockWidth}s`
}

onMounted(async () => {
    setTimeout(() => {
        warnActive.value = true
    }, 3000)
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
        useMapStore().setMap(map)
        map.addSource('ptVector', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/placeLabel/{x}/{y}/{z}'],
        })
        map.addSource('test', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/center/mzsBankLine/{x}/{y}/{z}'],
        })
        await mapInit(map, true)
        map.addLayer({
            id: '点1',
            type: 'symbol',
            source: 'ptVector',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-font':['Open Sans Bold','Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'left',
                'text-size': 20,
            },
            paint: {
                'text-color': 'rgb(0, 42, 105)',
            },
        })

        map.addLayer({
            id: '点2',
            type: 'symbol',
            source: 'test',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-font':['Open Sans Bold','Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'top',
                'text-size': 12,
            },
            paint: {
                'text-color': 'rgb(0, 42, 105)',
            },
        })

        // map.on('click', (e) => {
        //     console.log(map.queryRenderedFeatures([e.point.x, e.point.y]))

        // })

        // resizeObserver.observe(containerDom.value)
    })

    // const videoAccessKey = (await axios.post(
    //     'https://open.ys7.com/api/lapp/token/get?appKey=d228a2fab09d4c879b4449c356bbd90d&appSecret=0c46042ef59aed43c4eddbb80d637369',
    // )).data
    // console.log('res', videoAccessKey)
    // if (videoAccessKey.data.accessToken) {
    //     console.log('get key')
    //     token.value = videoAccessKey.data.accessToken
    // }
})

onUnmounted(() => {
    // resizeObserver.disconnect()
    // resizeObserver.unobserve(containerDom.value)
    console.log('onUnmounted')
    map && map.remove()
    console.log('map.remove')
})
</script>

<style lang="scss" scoped>
div.twin-main-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    overflow: hidden;

    background-color: rgb(100, 154, 202);

    div.nav-manage-button {
        position: absolute;
        right: 0;
        top: 2vh;

        width: 10vw;
        height: 6vh;
        background-color: rgb(0, 42, 105);
        transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;

        display: flex;
        flex-flow: row nowrap;
        overflow: hidden;
        z-index: 3;

        &:hover {
            cursor: pointer;

            div.nav-arrow-icon {
                width: 2.4vw;
            }
        }

        div.nav-manage-icon {
            width: 2.6vw;
            height: 6vh;
            flex-shrink: 0;

            background-image: url('/dashboard.png');
            background-size: 100%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
        }

        div.nav-manage-text {
            width: 5vw;
            height: 6vh;
            line-height: 6vh;
            text-align: center;

            font-size: calc(0.75vw + 0.4vh);
            font-weight: bold;
            color: rgba(32, 75, 116, 0.4);
            color: rgb(140, 255, 255);
        }

        div.nav-arrow-icon {
            width: 2vw;
            height: 6vh;
            flex-shrink: 0;

            background-image: url('/right-arrow.png');
            background-size: 100%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
            transition: all 0.2s cubic-bezier(0.68, -0.15, 0.265, 1.15);
        }
    }

    div.map-container {
        position: absolute;
        width: 100vw;
        height: 92vh;
        top: 0;
        left: 0;
        z-index: 2;
    }

    div.visual-tab-container {
        position: absolute;
        top: 2vh;
        right: 15vw;

        width: 10vw;
        height: 6vh;
        z-index: 3;
        border-radius: 10px;

        font-size: calc(0.6vw + 0.4vh);
        background-color: rgb(0, 56, 141);
        box-shadow: 4px 8px 8px -4px rgba(0, 11, 34, 0.9);
        // background-color: antiquewhite;
    }

    div.realtime-video-container {
        position: absolute;
        right: 1vw;
        top: 9vh;

        height: 82vh;
        width: 24vw;

        z-index: 4;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;

        backdrop-filter: blur(12px);
        box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
        background-color: rgba(156, 195, 255, 0.4);
        border-radius: 4px;
        border: 2px solid rgb(28, 105, 247);

        div.realtime-video-title {
            height: 4vh;
            line-height: 4vh;
            text-align: center;

            font-size: calc(0.8vw + 0.8vh);
            font-weight: bold;
            color: #0400fd;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
            letter-spacing: 0.4rem;

            border-bottom: 2px solid #0400fd;
        }

        div.video-box {
            width: 23vw;
            margin-left: 0.5vw;
            height: 25vh;

            background-color: rgba(3, 63, 173, 1);

            div.video-content {
                height: 22vh;
                width: 23vw;

                background-color: rgb(34, 75, 165);
            }

            div.video-title {
                line-height: 3vh;
                height: 3vh;
                text-align: center;

                font-weight: bold;
                font-size: calc(0.6vw + 0.6vh);
                color: #eef3ff;
            }
        }
    }

    div.marquee-container {
        position: absolute;
        left: 28vw;
        top: 2vh;
        width: 44vw;
        height: 5vh;
        // background-color: rgb(0, 75, 249);
        z-index: 4;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        :deep(.border-box-content) {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 95%;
            overflow: hidden;
            transform: translateX(2.5%);

            div.marquee-block {
                display: flex;
                flex-direction: row;
                white-space: nowrap;
                justify-content: flex-start;
                // animation: marquee 15s linear infinite;
                animation-name: marquee;
                animation-duration: 0s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;

                div.warn-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    width: fit-content;
                    margin-right: 1vw;
                }

                div.no-warn-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    width: fit-content;
                }
            }
        }
    }

    div.monitor-legend-container {
        position: absolute;
        bottom: 1vh;
        left: 27vw;
        width: 46vw;
        height: 10vh;

        z-index: 4;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;

        backdrop-filter: blur(12px);
        box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
        background-color: rgba(156, 195, 255, 0.4);
        border-radius: 4px;
        border: 2px solid rgb(28, 105, 247);

        div.monitor-legend-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            top: 0vh;
            height: 4vh;
            line-height: 4vh;
            text-align: center;

            background-color: rgb(4, 70, 168);
            color: rgb(212, 255, 253);

            font-size: calc(0.8vw + 0.8vh);
            font-weight: bold;
            letter-spacing: 0.2rem;
            padding-left: 0.5vw;
            padding-right: 0.5vw;
        }

        div.monitor-legend-block {
            position: relative;
            width: 46vw;
            height: 7vh;
            margin-top: 2vh;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;

            div.monitor-legend-item {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                width: 10vw;
                height: 6vh;
                border: #0400fd 1px solid;
                box-shadow:
                    inset 5px 5px 5px #478bf2bc,
                    inset -5px -5px 5px #478bf2bc;
                // box-shadow: inset 5px 5px 5px #0400fd, inset -5px -5px 5px #0400fd;

                border-radius: 5%;
                color: #1d00be;
                text-shadow: #40b4bf 1px 1px 0;

                div.item-title {
                    height: 3vh;
                    line-height: 3vh;
                }

                div.legend-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    div.icon-block {
                        position: relative;
                        width: 2vh;
                        height: 2vh;
                        background-size: contain;
                        background-repeat: no-repeat;
                        margin-right: 0.2vw;
                        margin-left: 0.2vw;
                        transform: translateY(16%);
                    }

                    div.GNSS-icon {
                        // width: 2.5vh;
                        // height: 2.5vh;
                        // transform: translateY(16%);
                    }
                }



            }

            div.GNSS {
                width: 14vw;
            }
        }
    }

    div.warn-detail-container {
        position: absolute;
        right: 1vw;
        top: 10vh;
        height: 45vh;
        width: 24vw;

        backdrop-filter: blur(12px);
        box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
        background-color: rgba(156, 195, 255, 0.8);
        border-radius: 4px;
        border: 2px solid rgb(28, 105, 247);
        z-index: 3;
        border-radius: 4px;
        overflow: hidden;

        div.warn-detail-title {
            height: 4vh;
            line-height: 4vh;
            width: 100%;
            background-color: transparent;
            text-align: center;
            font-size: calc(0.8vw + 0.8vh);
            font-weight: bold;
            color: #0400fd;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
            letter-spacing: 0.4rem;
            border-bottom: 2px solid #0400fd;
        }

        div.warn-detail-content {
            height: 40vh;
            width: 23vw;
            margin-left: 0.5vw;
            // margin-top: 0.5vh;

            // background-color: #6493ff;

            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            justify-content: center;

            div.key-val-container {
                margin-top: 0.6vh;
                width: 90%;
                height: 6vh;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                // background-color: #0446a8;
                text-align: center;
                border-bottom: 2px solid rgb(0, 32, 175);

                &:first-child {
                    margin-top: 0;
                }

                div.icon {
                    width: 20%;
                    height: 3vh;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: 50% 50%;
                    background-color: transparent;

                    &#warning-icon {
                        background-image: url('/warning.png');
                    }

                    &#length-icon {
                        background-image: url('/distance.png');
                    }
                }

                div.key-text {
                    width: width;
                    line-height: 6vh;
                    background-color: transparent;
                    font-size: calc(0.7vw + 0.6vh);
                    color: #0043fd;
                }


                div.val-text {
                    line-height: 6vh;
                    font-size: calc(0.7vw + 0.5vh);
                    font-weight: bold;
                    color: #1d00be;
                    // max-width: 70%;
                    width: 12vw;
                    text-align: right // text-align: center;
                }

                // &:nth-child(2n + 1) {
                //     text-align: left;

                //     // padding-left: 6%;
                //     // border-right: 2px solid rgb(0, 32, 175);
                // }
                // &:nth-child(2n) {
                //     text-align: right;
                //     justify-content: flex-end;
                //     // padding-right: 6%;
                //     // border-left: 2px solid rgb(0, 32, 175);
                // }
            }
        }
    }

    div.warn-history-container {
        position: absolute;
        right: 1vw;
        bottom: 1vh;
        height: 34vh;
        width: 24vw;

        backdrop-filter: blur(16px);
        box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
        background-color: rgba(156, 195, 255, 0.4);
        border-radius: 4px;
        border: 2px solid rgb(28, 105, 247);
        z-index: 3;
        border-radius: 4px;
        overflow: hidden;

        div.warn-detail-title {
            height: 4vh;
            line-height: 4vh;
            width: 100%;
            background-color: transparent;
            text-align: center;
            font-size: calc(0.8vw + 0.8vh);
            font-weight: bold;
            color: #0400fd;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
            letter-spacing: 0.4rem;
            border-bottom: 2px solid #0400fd;
        }
    }

    /* 根据需要调整动画的持续时间 */
}

:deep(.iEdpB) {
    font-size: calc(0.4vw + 0.4vh);
}

:deep(.active.active .iEdpB) {
    color: rgb(198, 244, 255);
    font-weight: bold;
}

:deep(.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip) {
    display: none;
}

:deep(.mapboxgl-popup-tip) {
    border: none;
}

:deep(.mapboxgl-popup-content) {
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
}

:deep(.mapboxgl-popup-close-button) {
    right: 5px;
    top: 5px;
    border: none;
    display: none;
}

:deep(.el-overlay) {
    background-color: none;
}

@keyframes marquee {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-50%);
    }
}
</style>
