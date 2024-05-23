<template>
    <div class="twin-main-container" ref="containerDom">
        <div class="nav-manage-button" @click="navToManage">
            <div class="nav-manage-icon"></div>
            <div class="nav-manage-text">监测详情</div>
            <div class="nav-arrow-icon"></div>
        </div>
        <div class="visual-tab-container">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 100)">
                <e-tab style="z-index: 3; font-size: calc(0.4vw + 0.4vh)" :items="items" :columns="2"
                    @change="viewChangeClick"></e-tab>
            </DvBorderBox12>
        </div>
        <BankBasicInfoVue />
        <RealtimeStatusVue />
        <RealtimeVideoVue :active="!warnActive" />
        <!-- <SectionRisk />
        <DeviceWarn /> -->

        <div class="marquee-container" v-loading="warnLoading">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 140)">
                <div class="marquee-block" ref="marqueeBlockDom" :style="{ animationDuration: animateTime }"
                    style="animation-iteration-count: infinite;">
                    <div class="no-warn-block" v-if="warningList.length == 0"
                        style="font-size: calc(0.7vw + 1vh); color: #e7f2ff">
                        {{ `暂无报警信息` }}
                    </div>
                    <div v-else class="warn-block" v-for="(warningString, index) in warningList" :key="index">
                        <div style="
                                background-size: contain;
                                background-image: url('/icons/warning.png');
                                width: 3vh;
                                height: 3vh;
                            "></div>
                        <div style="
                                font-size: calc(0.7vw + 1vh);
                                color: rgb(254, 14, 11);
                                margin-left: 0.5vw;
                                font-weight: bold;
                            ">
                            {{ warningString }}
                        </div>
                    </div>
                </div>
            </DvBorderBox12>
            <div class="button-block" @click="warnActive = !warnActive">
                {{ buttonText }}
            </div>
        </div>

        <div class="monitor-legend-container">
            <div class="monitor-legend-title" @click="deviceShowControl(-1)">监测设备图例</div>
            <div class="monitor-legend-block">
                <!-- GNSS only -->
                <div class="monitor-legend-item GNSS">
                    <div class="item-title">
                        <span>{{ gnssLegendInfo.text1 }}</span>
                        <span style="font-weight: bold">{{
                            gnssLegendInfo.strong
                        }}</span>
                        <span>{{ gnssLegendInfo.text2 }}</span>
                    </div>
                    <div style="display: flex; flex-direction: row">
                        <div class="legend-block" @click="deviceShowControl(0)">
                            <div class="icon-block GNSS-icon" :style="{
                                backgroundImage: `url(${gnssLegendInfo.icon1})`,
                            }"></div>
                            <span style="
                                    text-align: center;
                                    width: 100%;
                                    display: block;
                                    line-height: 2.5vh;
                                    color: rgb(16, 71, 165);
                                    text-shadow: #7388c148 1px 1px 0;
                                ">
                                {{ gnssLegendInfo.device1 }}</span>
                        </div>
                        <div class="legend-block" @click="deviceShowControl(1)">
                            <div class="icon-block GNSS-icon" :style="{
                                backgroundImage: `url(${gnssLegendInfo.icon2})`,
                            }"></div>
                            <span style="
                                    text-align: center;
                                    width: 100%;
                                    display: block;
                                    line-height: 2.5vh;
                                    color: rgb(16, 71, 165);
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
                    <div class="legend-block" @click="deviceShowControl(index + 2)">
                        <div class="icon-block" :style="{ backgroundImage: `url(${item.icon})` }"></div>
                        <span style="
                                text-align: center;
                                width: 100%;
                                display: block;
                                line-height: 2.5vh;
                                color: rgb(16, 71, 165);
                                text-shadow: #7388c148 1px 1px 0;
                            ">
                            {{ item.device }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="warn-status-container" v-loading="warnLoading">
            <div class="warn-status-title">民主沙右缘状态</div>
            <div class="warn-status-content" :class="statusText == '正常' ? 'normal' : 'warn'">
                {{ statusText }}
            </div>
        </div>
        <BanWarnDetail :warnActive="warnActive" v-loading="warnLoading" />
        <WarnHistoryTable v-show="warnActive" />

        <div class="map-container" id="map" style="z-index: 2" ref="mapDom"></div>

        <!-- BANK3D -->
        <canvas id="GPUFrame" class="GPU" style="z-index: 2"></canvas>
        <canvas id="UnityCanvas" class="GPU" ref="unityCanvaDom" style="z-index: 1;"></canvas>
        <div class="loading-container" v-show="threeDLoading">
            <dv-loading class="loading-icon">
                <div class="loading-message">三维视图资源加载中</div>
            </dv-loading>
        </div>
    </div>
</template>

<script setup>
import router from '../router'
import { onMounted, ref, onUnmounted, watch, computed, nextTick, createApp } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ETab } from 'e-datav-vue3'
import BankBasicInfoVue from '../components/bankTwin/BankBasicInfo.vue'
import RealtimeStatusVue from '../components/bankTwin/RealtimeStatus.vue'
import WarnHistoryTable from '../components/bankTwin/WarnHistoryTable.vue'
import RealtimeVideoVue from '../components/bankTwin/RealtimeVideo.vue'
import BanWarnDetail from '../components/bankTwin/BankWarnDetail.vue'
import { mapInit } from '../components/bankManage/mapInit'
// test bank3d popUP
import threedVue from '../components/bankTwin/threedPopup.vue'

import { useMapStore, useWarnInfoStore } from '../store/mapStore'
import * as customLayers from '../utils/WebGL/customLayers'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { initScratchMap, initPureScratchMap } from '../utils/mapUtils'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const containerDom = ref(null)
const animateTime = ref('0s')
const marqueeBlockDom = ref()
const unityCanvaDom = ref()
const mapDom = ref()
const warnActive = ref(false)
const buttonText = computed(() => {
    return warnActive.value ? '查看现场监控' : '查看预警详情'
})
const detailLoading = ref(false)
const warnLoading = ref(true)
const activeView = ref('tab1')
const threeDLoading = ref(false)

// mapboxgl.accessToken =
//     'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'
let map = null
const warnInfoStore = useWarnInfoStore()
const token = ref(
    'at.9muaq1l4dwsnaqkfbhn98qxe10ud6kgw-54xl36oksd-1bmu6o1-pilufj5d3',
)
const statusText = ref('正常')

// custome layer
/**
 * @type {customLayers.UnityLayer}
 */
let unityLayer
/**
 * @type {customLayers.MaskLayer}
 */
let maskLayer

const items = ref([
    { label: '二维视图', value: '2d' },
    { label: '三维视图', value: '3d' },
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
    {
        icon: '/icons/视频监控.png',
        text1: '  ',
        strong: '视频监控',
        text2: '  ',
        device: '摄像头',
    }
]

const deviceNameMap = {
    GNSS: {
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
    },
    水压力计: {
        'MZS120.51726088_32.04054582_3': 'KX-01',
        'MZS120.51738292_32.04054923_3': 'KX-02',
        'MZS120.51749021_32.04053105_3': 'KX-03',
        'MZS120.51957026_32.04008655_3': 'KX-04',
        'MZS120.51967889_32.04004108_3': 'KX-05',
        'MZS120.51986665_32.03998992_3': 'KX-06',
        'MZS120.52557975_32.03825056_3': 'KX-07',
        'MZS120.52565217_32.03813574_3': 'KX-08',
        'MZS120.52566826_32.03799363_3': 'KX-09',
    },
    测斜仪: {
        'MZS120.51967889_32.04004108_4': 'CX-01',
        'MZS120.51986665_32.03998992_4': 'CX-02',
        'MZS120.52557975_32.03825056_4': 'CX-03',
        'MZS120.52565217_32.03813574_4': 'CX-04',
        'MZS120.52566826_32.03799363_4': 'CX-05',
        'MZS120.51726088_32.04054582_4': 'CX-06',
        'MZS120.51738292_32.04054923_4': 'CX-07',
        'MZS120.51749021_32.04053105_4': 'CX-08',
        'MZS120.51957026_32.04008655_4': 'CX-09',
    },
    应力桩: {
        'MZS120.513203_32.042733_2': 'YL-01',
        'MZS120.515433_32.04231_2': 'YL-02',
        'MZS120.521221_32.040331_2': 'YL-03',
        'MZS120.529078_32.034385_2': 'YL-04',
        'MZS120.541648_32.030524_2': 'YL-05',
        'MZS120.548925_32.029361_2': 'YL-06',
        'MZS120.552209_32.028149_2': 'YL-07',
    },
}

const gnssIdSectionMap = {
    'MZS120.51749289_32.04059243_1': 'MZ02顺堤',
    'MZS120.51977143_32.04001152_1': 'MZ03顺堤尾',
    'MZS120.52557975_32.03825056_1': 'MZ04江滩办',
    'MZS120.52660704_32.03676583_1': 'MZ05小港池',
    'MZS120.53334877_32.03227055_1': 'MZ06张靖皋桥位',
    'MZS120.54599538_32.02837993_1': 'MZ08海事码头',
    'MZS120.55327892_32.02707923_1': 'MZ09码头下游',
    'MZS120.55649757_32.02592404_1': 'MZ10雷达站',
    'MZS120.56334257_32.02298144_1': 'MZ11主路',
    'MZS120.56944728_32.02070961_1': 'MZ12沙尾',

    // fake sectionNameMap
    // 'MZS120.55327892_32.02707923_1': '海事码头下游',
    'MZS120.51967889_32.04004108_4': 'MZ03顺堤尾',
    'MZS120.541648_32.030524_2': 'MZ08海事码头'

}

const warnKeyValList = ref([
    { key: '报警区域', val: '暂无' },
    { key: '出险时间', val: '暂无' },
    { key: '设备信息', val: '暂无' },
    { key: '管理单位', val: '江苏省水利厅' },
    { key: '联系方式', val: '025-85829326；18860847206' },
    { key: '是否发送通知', val: '暂无' },
])

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.45957922676836, 32.00001616423072],
            [120.62109640208264, 32.084171362618625],
        ],
        {
            // pitch: 32.45,
            duration: 1000,
            // zoom: 8,
        },
    )
}

const gnssShow = true

// const GNSSShow = () => {
//     let map = useMapStore().getMap()

//     // map.
// }
const deviceShowControl = (index) => {
    let layerNameList = ['GNSS', 'GNSS基准站', '测斜仪', '孔隙水压力计', '应力桩', '监控摄像头']
    let map = useMapStore().getMap()
    if (index == -1) {
        layerNameList.forEach((item) => {
            map.getLayer(item) && map.setLayoutProperty(item, 'visibility', 'visible')
        })
        return
    }
    let layerName = layerNameList[index]
    layerNameList.forEach((item) => {
        map.getLayer(item) && map.setLayoutProperty(item, 'visibility', 'none')
    })
    map.getLayer(layerName) && map.setLayoutProperty(layerName, 'visibility', 'visible')

}

const viewChangeClick = (value) => {
    // console.log('view Change!', value)
    let map = useMapStore().getMap()
    if (!map)
        ElMessage({
            type: 'warning',
            message: '请等待地图加载后重试',
        })
    if (value == '2d') {
        unityLayer && unityLayer.remove()
        map.getLayer('Mask-Layer') && map.removeLayer('Mask-Layer')
        map.getLayer('Unity-Layer') && map.removeLayer('Unity-Layer')
        mapFlyToRiver(map)
    } else if (value == '3d') {
        threeDLoading.value = true
        console.log('pickUp')
        console.log(pickUp)
        const script = document.createElement('script')
        script.src = '/scratchSomething/unity/collapseBank/build/output.loader.js'
        document.head.appendChild(script)
        script.onload = async () => {
            // DeviceInfoBox
            console.log('output.loader.js imported')
            unityLayer = new customLayers.UnityLayer([120.556596, 32.042607], 0, unityCanvaDom.value)
            map.addLayer(unityLayer)
            setTimeout(() => {
                threeDLoading.value = false
                // createCompIns()
            }, 3000)
            // map.addLayer(maskLayer)
        }


    }
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
const buildLocStr = (deviceId) => {
    deviceId = deviceId.replace('MZS', '')
    let str = deviceId.split('_').slice(0, 2).join(',')
    return str
}
const updateWarnInfoDesc = async () => {
    const DEVICETYPEMAP = ['GNSS', '应力桩', '水压力计', '测斜仪']
    let warnInfo = warnInfoStore.warnInfo
    let WARN_TEXT = []
    // console.log('warnInfo! ', warnInfo)
    let deviceNameList = []
    let warnTimeList = []
    // console.log('print warn info', warnInfo)
    if (warnInfo.length == 0) {
        statusText.value = '正常'
    }
    else {
        statusText.value = "报警"
    }

    for (let i = 0; i < warnInfo.length; i++) {
        // console.log('build warn', warnInfo[i])
        // 报警设备信息
        let deviceId = warnInfo[i].deviceId
        let deviceName = DEVICETYPEMAP[deviceId.slice(-1) - 1]

        deviceNameList.push(deviceNameMap[deviceName][warnInfo[i].deviceId])
        warnTimeList.push(warnInfo[i].warnTime.split(' ')[1])

        let warnTime = dayjs(warnInfo[i].warnTime).format('M月D日H时m分s秒')
        let threeDiff = warnInfo[i].threeDiff.toFixed(3)

        let warnString = `
            警告：于${warnTime}，${gnssIdSectionMap[deviceId]}断面(${buildLocStr(deviceId)})的 \
            ${deviceName}(${deviceNameMap[deviceName][deviceId]})周围区域即将发生崩岸险情 \
            请注意防汛处置！
        `
        WARN_TEXT.push(warnString)
    }
    warnLoading.value = false
    warnKeyValList.value[2].val = deviceNameList.join(',')
    warnKeyValList.value[1].val = warnTimeList.join(',')
    warnKeyValList.value[5].val = '是'

    warningList.value = WARN_TEXT
    warnActive.value = true
    // 第一次是没有初始化完的长度 所以很快 实际上很长
    await nextTick()
    console.log('123123 length: ', marqueeBlockDom.value.offsetWidth)
    const marqueeBlockWidth = marqueeBlockDom.value.offsetWidth
    animateTime.value = `${marqueeBlockWidth / warnInfo.length / 10}s`
}

onMounted(async () => {
    // setTimeout(() => {
    //     warnActive.value = true
    // }, 3000)
    // map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     accessToken:
    //         'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
    //     style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
    //     center: [120.542, 32.036], // starting position [lng, lat]
    //     zoom: 8, // starting zoom
    //     bounds: [
    //         [114.36611654985586, 30.55501729652339],
    //         [124.5709218840081, 35.31358005439914],
    //     ],
    // })
    //////////return loaded Map
    map = await initPureScratchMap(mapDom.value)
    map.on('render', () => {
        map.triggerRepaint()
    })
    mapFlyToRiver(map)
    useMapStore().setMap(map)
    await mapInit(map, true)


    // const videoAccessKey = (await axios.post(
    //     'https://open.ys7.com/api/lapp/token/get?appKey=d228a2fab09d4c879b4449c356bbd90d&appSecret=0c46042ef59aed43c4eddbb80d637369',
    // )).data
    // console.log('res', videoAccessKey)
    // if (videoAccessKey.data.accessToken) {
    //     console.log('get key')
    //     token.value = videoAccessKey.data.accessToken
    // }
    setTimeout(() => {
        warnLoading.value = false
    }, 1000);
})

onUnmounted(() => {
    useMapStore().getMap().remove()
    useMapStore().destroyMap()
})

///////// DEBUG REGION 
// const createCompIns = () => {
//     const bankApp = createApp(threedVue)
//     let fatherDom = document.querySelector('#DeviceInfoBox')
//     bankApp.mount(fatherDom)
// }
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

    canvas.GPU {
        position: absolute;
        width: 100vw;
        height: 92vh;
        top: 0;
        left: 0;
        pointer-events: none;
        background-color: transparent;
    }

    div.loading-container {
        position: absolute;
        top: 10vh;
        left: 57vw;
        width: 6vw;
        height: 10vh;
        background-color: rgba(249, 254, 255, 0.336);
        backdrop-filter: blur(5px);
        z-index: 5;

        :deep(.dv-loading.loading-icon) {
            position: absolute;
            top: -2.5vh;
            right: 0vw;
        }

        div.loading-message {
            text-align: center;
            position: absolute;
            left: 0.5vw;
            width: 5vw;
            height: 6vh;
            top: 7.3vh;
            font-size: calc(0.6vw + 0.4svh);
            font-weight: bold;
        }
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


    div.marquee-container {
        position: absolute;
        left: 28vw;
        top: 2vh;
        width: 44vw;
        height: 7vh;
        line-height: 7vh;
        // background-color: rgb(0, 75, 249);
        z-index: 4;
        overflow: hidden;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        :deep(.dv-border-box-12) {
            display: flex;
            justify-content: flex-start;

            .border-box-content {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 84%;
                margin-left: 2%;
                overflow: hidden;
                height: 7vh;
                // transform: translateX(2.5%);

                div.marquee-block {
                    display: flex;
                    flex-direction: row;
                    white-space: nowrap;
                    justify-content: center;
                    // animation: marquee 15s linear infinite;
                    animation-name: marquee;
                    animation-duration: 0s;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    height: 7vh;

                    div.warn-block {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        width: fit-content;
                        margin-right: 2vw;
                    }

                    div.no-warn-block {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        width: fit-content;
                        transform: translateX(4vw);
                    }
                }
            }
        }

        div.button-block {
            position: absolute;
            background-color: rgb(122, 227, 248);
            border-radius: 7px;
            right: 1%;
            width: 6vw;
            height: 4vh;
            line-height: 4vh;
            text-align: center;
            border-right: #a4bfff 2px solid;
            border-bottom: #a4bfff 4px solid;
            font-weight: bold;
            color: #1d00be;
            font-size: calc(0.6vw + 0.3vh);

            /* 初始阴影 */
            &:hover {
                cursor: pointer;
                border-right: #a4bfff 2px solid;
                border-bottom: #a4bfff 4px solid;
                transition: 0.3s;
            }

            &:active {
                cursor: pointer;
                border-right: #a4bfff 1px solid;
                border-bottom: #a4bfff 1px solid;
                transition: 0.3s;
            }
        }
    }

    div.monitor-legend-container {
        position: absolute;
        bottom: 1vh;
        left: 28vw;
        width: 43vw;
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

            &:hover {
                cursor: pointer;
            }
        }

        div.monitor-legend-block {
            position: relative;
            width: 43vw;
            height: 7vh;
            margin-top: 2vh;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

            div.monitor-legend-item {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                width: 6vw;
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

            &:hover {
                cursor: pointer;
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
                    text-align: right;
                    // text-align: center;
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

        div.warn-history-title {
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

        div.warn-histroy-content {
            height: 30vh;
            width: 23vw;
            margin-left: 0.5vw;

            div.device-status-content {
                // position: absolute;
                // top: 5vh;
                width: 100%;
                // margin-left: 2.5%;
                height: 30vh;

                // background-color: #c4fbff;

                div.device-status-row {
                    height: 4vh;
                    width: 100%;
                    border-radius: 2px;

                    // background-color: #2622fd;

                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-around;

                    &.head {
                        padding-bottom: 4px;
                    }

                    div.device-item {
                        width: 28%;
                        height: 100%;
                        line-height: 3.2vh;
                        text-align: center;
                        font-size: calc(0.5vw + 0.4vh);
                        border-radius: 2px;

                        background-color: #d2f2ff;
                        font-weight: bold;
                        color: #2a5fdb;

                        &.device-name {
                            width: 40%;
                        }

                        &.device-time {
                            width: 32%;
                        }

                        &.device-count {
                            display: flex;
                            justify-content: center;

                            div.normal {
                                color: #00ca22;
                            }
                        }

                        &.head {
                            background-color: #2a5fdb;
                            border: 1px solid #aaffff;
                            font-weight: bold;
                            color: #dafdff;
                            box-shadow:
                                rgba(208, 252, 255, 0.6) 0px 2px 4px,
                                rgba(208, 252, 255, 0.4) 0px 7px 13px -3px,
                                rgba(208, 252, 255, 0.3) 0px -3px 0px inset;
                        }

                        box-shadow: rgba(13, 70, 228, 0.6) 0px 2px 4px,
                        rgba(6, 55, 189, 0.4) 0px 7px 13px -3px,
                        rgba(9, 61, 204, 0.3) 0px -3px 0px inset;
                    }
                }
            }
        }
    }

    div.warn-status-container {
        position: absolute;
        left: 45vw;
        top: 10vh;
        width: 10vw;
        height: 10vh;

        background-color: #000cbbd5;
        backdrop-filter: blur(8px);
        z-index: 3;
        border-radius: 6px;
        text-align: center;
        overflow: hidden;

        box-shadow: 4px 6px 6px -4px rgb(0, 47, 117);

        div.warn-status-title {
            height: 4vh;
            line-height: 4vh;
            width: 10vw;
            font-size: calc(0.8vw + 0.3vh);
            font-weight: bold;
            color: #e3f9ff;
            box-shadow: 0px 2px rgb(0, 225, 255);
        }

        div.warn-status-content {
            height: 6vh;
            line-height: 6vh;
            width: 10vw;
            font-size: calc(1.1vw + 0.8vh);
            font-weight: bold;
            // background-color: #2688f8;
            color: #ebf8ff;
            text-align: cen;
            letter-spacing: 1rem;
            text-indent: 1rem;

            &.normal {
                background-color: #28bd03;
            }

            &.warn {
                background-color: rgb(209, 15, 15);
            }
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
