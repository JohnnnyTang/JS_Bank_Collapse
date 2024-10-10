<template>
    <div class="twin-main-container" ref="containerDom">
        <!-- <div class="nav-manage-button" @click="navToManage">
            <div class="nav-manage-icon"></div>
            <div class="nav-manage-text">监测详情</div>
            <div class="nav-arrow-icon"></div>
        </div> -->
        <div class="visual-tab-container" v-if="showViewButton">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 100)">
                <!-- <e-tab style="z-index: 3; font-size: calc(0.4vw + 0.4vh)" :items="items" :columns="2"
                    @change="viewChangeClick"></e-tab> -->
                <el-radio-group v-model="viewRadio" @change="viewChangeClick">
                    <el-radio-button v-for="item in items" :label=item.label :value=item.value />
                </el-radio-group>
            </DvBorderBox12>
        </div>
        <BankBasicInfoVue />
        <RealtimeStatusVue :domHide="domHideMap.status" :device-type="currentDeviceType" :show-vedio="showVedio" />
        <!-- <RealtimeVideoVue :active="!warnActive" :domHide="domHideMap.video" /> -->
        <!-- <SectionRisk />
        <DeviceWarn /> -->

        <div class="marquee-container" v-loading="warnLoading">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 140)">
                <div class="marquee-block" ref="marqueeBlockDom" :style="{ animationDuration: animateTime }"
                    style="animation-iteration-count: infinite">
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
        </div>
        <!-- <div
            class="button-block"
            @click="warnActive = !warnActive"
            :class="{ active: warnActive }"
            v-if="!domHideMap.video"
        >
            {{ buttonText }}
        </div> -->

        <div class="monitor-legend-container">
            <div class="monitor-legend-title" @click="deviceShowControl(-1)">
                监测设备
            </div>
            <div class="monitor-legend-block">
                <!-- GNSS only -->
                <div class="monitor-legend-item GNSS">
                    <div class="item-title" @click="deviceShowControl(-2)">
                        <span>{{ gnssLegendInfo.text1 }}</span>
                        <span style="font-weight: bold">{{
                            gnssLegendInfo.strong
                        }}</span>
                        <span>{{ gnssLegendInfo.text2 }}</span>
                    </div>
                    <div style="display: flex; flex-direction: row">
                        <div class="legend-block" style="margin-right: 0.5vw">
                            <div class="icon-block GNSS-icon" :style="{
                                backgroundImage: `url(${gnssLegendInfo.icon1})`,
                            }"></div>
                            <span style="
                                    text-align: center;
                                    font-size: calc(0.5vw + 0.4vh);
                                    width: 100%;
                                    display: block;
                                    line-height: 2.5vh;
                                    color: rgb(16, 71, 165);
                                    text-shadow: #7388c148 1px 1px 0;
                                ">
                                {{ gnssLegendInfo.device1 }}</span>

                            <label class="device-check-container" @click="deviceShowControl(0)">
                                <input type="checkbox" class="input" disabled v-model="deviceShowing[0]" />
                                <span class="custom-checkbox"></span>
                            </label>
                        </div>
                        <div class="legend-block">
                            <div class="icon-block GNSS-icon" :style="{
                                backgroundImage: `url(${gnssLegendInfo.icon2})`,
                            }"></div>
                            <span style="
                                    text-align: center;
                                    font-size: calc(0.5vw + 0.4vh);
                                    width: 100%;
                                    display: block;
                                    line-height: 2.5vh;
                                    color: rgb(16, 71, 165);
                                    text-shadow: #7388c148 1px 1px 0;
                                ">
                                {{ gnssLegendInfo.device2 }}</span>
                            <label class="device-check-container" @click="deviceShowControl(1)">
                                <input type="checkbox" class="input" disabled v-model="deviceShowing[1]" />
                                <span class="custom-checkbox"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <!-- others -->
                <div v-for="(item, index) in legendList" :key="index" class="monitor-legend-item">
                    <div class="item-title" @click="deviceShowControl(index + 2, true)">
                        <span>{{ item.text1 }}</span>
                        <span style="font-weight: bold">{{ item.strong }}</span>
                        <span>{{ item.text2 }}</span>
                    </div>
                    <div class="legend-block">
                        <div class="icon-block" :style="{ backgroundImage: `url(${item.icon})` }"></div>
                        <span style="
                                text-align: center;
                                font-size: calc(0.5vw + 0.4vh);
                                width: 100%;
                                display: block;
                                line-height: 2.5vh;
                                color: rgb(16, 71, 165);
                                text-shadow: #7388c148 1px 1px 0;
                            ">
                            {{ item.device }}</span>
                        <label class="device-check-container" @click="deviceShowControl(index + 2)">
                            <input type="checkbox" class="input" disabled v-model="deviceShowing[index + 2]" />
                            <span class="custom-checkbox"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="warn-status-container" v-loading="warnLoading">
            <div class="warn-status-title">{{ info["name"] }}状态</div>
            <div class="warn-status-content" :class="statusText == '正常' ? 'normal' : 'warn'">
                {{ statusText }}
            </div>
        </div>
        <BanWarnDetail :warnActive="warnActive" v-loading="warnLoading" :domHide="domHideMap.warn" />
        <!-- <WarnHistoryTable v-show="warnActive" /> -->

        <div class="map-container" id="map" style="z-index: 2" ref="mapDom"></div>

        <!-- BANK3D -->
        <canvas id="GPUFrame" class="GPU" style="z-index: 2"></canvas>
        <canvas id="UnityCanvas" class="GPU" ref="unityCanvaDom" style="z-index: 1"></canvas>
        <div class="loading-container" v-show="threeDLoading">
            <dv-loading class="loading-icon">
                <div class="loading-message">三维视图资源加载中</div>
            </dv-loading>
        </div>
        <div class="hide-status-button left" :class="{ 'in-active': domHideMap.status }" @click="hideDom('status')">
            <HideDomButtom :direction="domHideMap.status ? 'right' : 'left'" />
        </div>
        <!-- <div
            class="hide-status-button right"
            :class="{
                'in-active': domHideMap.video,
                'warn-active': warnActive,
            }"
            @click="hideDom('video')"
        >
            <HideDomButtom :direction="domHideMap.video ? 'left' : 'right'" />
        </div> -->
        <div class="hide-status-button right warn" :class="{ 'in-active': domHideMap.warn, 'warn-active': warnActive }"
            @click="hideDom('warn')" v-if="warnActive">
            <HideDomButtom :direction="domHideMap.warn ? 'left' : 'right'" />
        </div>
    </div>
</template>

<script setup>

import {
    onMounted, ref, reactive, onUnmounted, watch, computed, nextTick, createApp
} from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ETab } from 'e-datav-vue3'
import BankBasicInfoVue from '../components/bankTwin/BankBasicInfo.vue'
import { useBankNameStore } from '../store/bankNameStore';
import RealtimeStatusVue from '../components/bankTwin/RealtimeStatus.vue'
import BanWarnDetail from '../components/bankTwin/BankWarnDetail.vue'
import HideDomButtom from '../components/bankTwin/HideDomButtom.vue'
import {
    mapInit,
    addDeviceClickEvent,
    removeDeviceClickEvent,
    deviceOnClick,
} from '../components/bankManage/mapInit'
import threeDdevice from '../components/bankTwin/threeDdevice.vue'

import { useMapStore, useWarnInfoStore } from '../store/mapStore'
import BackEndRequest from '../api/backend';
import * as customLayers from '../utils/WebGL/customLayers'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { initPureScratchMap, refreshMap } from '../utils/mapUtils'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const route = useRoute()
const containerDom = ref(null)
const animateTime = ref('0s')
const marqueeBlockDom = ref()
const unityCanvaDom = ref()
const mapDom = ref()
const warnActive = ref(true)

const showVedio = ref(false)
const showViewButton = ref(false)
const buttonText = computed(() => {
    return warnActive.value ? '更多' : '▼'
})
const currentDeviceType = ref('位移测量站')

const detailLoading = ref(false)
const warnLoading = ref(true)
// const activeView = ref('tab1')
const threeDLoading = ref(false)
const deviceShowing = ref([true, true, true, true, true, true])

let map = null
const warnInfoStore = useWarnInfoStore()

const statusText = ref('正常')

const domHideMap = ref({
    video: false,
    status: false,
    warn: true,
})
///////////////////////////////////////////////////////////
const bankNameStore = useBankNameStore()
console.log(bankNameStore)

const info = reactive({
    "name": '',
    "riskLevel": '',
    "monitorLength": '',
    "monitorStartTime": '2024-04-20',
    "deviceNum": 0
})
///////////////////////////////////////////////////////////
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

// const showDom = ref([false, false])
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
        icon: '/icons/应力桩.png',
        text1: '土体',
        strong: '应力应变',
        text2: '监测',
        device: '应力桩',
    },
    {
        icon: '/icons/孔隙水压力计.png',
        text1: '土体',
        strong: '潜水位',
        text2: '监测',
        device: '孔隙水压力计',
    },
    {
        icon: '/icons/测斜仪.png',
        text1: '土体',
        strong: '内部位移',
        text2: '监测',
        device: '测斜仪',
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // {
    //     icon: '/icons/测斜仪.png',
    //     text1: '土体',
    //     strong: '微应变',
    //     text2: '监测',
    //     device: '分布式光纤',
    // },
    ////////////////////////////////////////////////////////////////////////////////////////////////
    {
        icon: '/icons/视频监控.png',
        text1: '  ',
        strong: '视频监控',
        text2: '  ',
        device: '摄像头',
    },
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
    ////////////////////////////////////////////////////////////////////////////////////////////////
    分布式光纤: {
        'MZS120_32_5': 'GX-01',
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////
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
    'MZS120.541648_32.030524_2': 'MZ08海事码头',
}

//////////////////////////////////////////////////////////////////////
const updateInfo = async () => {
    BackEndRequest.getBankBasicInfo().then(res => {
        info.name = res.data.name
        info.riskLevel = res.data.riskLevel
        info.monitorLength = res.data.monitorLength
        info.monitorStartTime = res.data.monitorStartTime

        BackEndRequest.getMonitorInfo().then(res => {
            // console.log('device NUm is ', res.length)
            info.deviceNum = res.length
        })
    })
}

watch(() => bankNameStore.globalBankName, (newV, oldV) => {
    updateInfo()
})
//////////////////////////////////////////////////////////////////////

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.45997922676836, 32.00001616423072],
            [120.60909640208264, 32.084171362618625],
        ],
        {
            // pitch: 32.45,
            duration: 1000,
            // zoom: 8,
        },
    )
}
const mapFlyToRiver2 = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.43987922676836, 32.03201616423072],
            [120.59089640208264, 32.052171362618625],
        ],
        {
            duration: 1500,
            // zoom: 11.5,
        },
    )
}

const hideDom = (domName) => {
    domHideMap.value[domName] = !domHideMap.value[domName]
}

// const gnssShow = true

// const GNSSShow = () => {
//     let map = useMapStore().getMap()

//     // map.
// }
const deviceShowControl = (index, only = false) => {
    let layerNameList = [
        'GNSS',
        'GNSS基准站',
        '应力桩',
        '孔隙水压力计',
        '测斜仪',
        '监控摄像头',
    ]
    let nameMap = {
        'GNSS': '位移测量站',
        'GNSS基准站': '位移测量站',
        '应力桩': '应力桩',
        '孔隙水压力计': '孔隙水压力计',
        '测斜仪': '测斜仪'
    }
    if (index == -2) {
        deviceShowing.value = [true, true, false, false, false, false]
        currentDeviceType.value = '位移测量站'
    }
    else if (index == -1) {
        if (deviceShowing.value.includes(true)) {
            deviceShowing.value = [false, false, false, false, false, false]
        } else {
            deviceShowing.value = [true, true, true, true, true, true]
        }
    }
    else if (index == 0 || index == 1) {
        let gnssShowing = [deviceShowing.value[0], deviceShowing.value[1]]
        if (gnssShowing.includes(true)) {
            deviceShowing.value[0] = deviceShowing.value[1] = false
        } else {
            deviceShowing.value[0] = deviceShowing.value[1] = true
            currentDeviceType.value = nameMap[layerNameList[index]]
        }
    }
    else {
        if (only) {
            deviceShowing.value = [false, false, false, false, false, false]
            deviceShowing.value[index] = true
            index != 5 && (currentDeviceType.value = nameMap[layerNameList[index]])

        } else {
            deviceShowing.value[index] = !deviceShowing.value[index]
            if (index != 5 && deviceShowing.value[index]) {
                (currentDeviceType.value = nameMap[layerNameList[index]])
            }

        }
    }

    let map = useMapStore().getMap()
    deviceShowing.value.forEach((item, index) => {
        item
            ? map.setLayoutProperty(
                layerNameList[index],
                'visibility',
                'visible',
            )
            : map.setLayoutProperty(layerNameList[index], 'visibility', 'none')
    })
}
const viewRadio = ref('2d')
const viewChangeClick = (value) => {
    // console.log('view Change!', value)
    let map = useMapStore().getMap()
    if (!map)
        ElMessage({
            type: 'warning',
            message: '请等待地图加载后重试',
        })
    let dom = document.getElementById('map')

    if (value == '2d') {
        // dom.style.pointerEvents = 'auto'
        map.on(
            'click',
            ['GNSS', '测斜仪', '孔隙水压力计', '应力桩'],
            deviceOnClick,
        )
        unityLayer && unityLayer.remove()
        map.getLayer('Mask-Layer') && map.removeLayer('Mask-Layer')
        map.getLayer('UnityLayer') && map.removeLayer('UnityLayer')
        mapFlyToRiver(map)
        let fatherDom = document.querySelector('#DeviceInfoBox')
        // fatherDom.innerHTML = ''
        clearDom(fatherDom)
    } else if (value == '3d') {
        map.off(
            'click',
            ['GNSS', '测斜仪', '孔隙水压力计', '应力桩'],
            deviceOnClick,
        )
        threeDLoading.value = true
        console.log('pickUp')
        const script = document.createElement('script')
        script.src =
            '/scratchSomething/unity/collapseBank/build/output.loader.js'
        document.head.appendChild(script)
        script.onload = async () => {
            // DeviceInfoBox
            console.log('output.loader.js imported')
            unityLayer = new customLayers.UnityLayer(
                [120.556596, 32.042607],
                0,
                unityCanvaDom.value,
            )
            map.addLayer(unityLayer)
            setTimeout(() => {
                threeDLoading.value = false
                createCompIns()
            }, 10000)
            // map.addLayer(maskLayer)
        }
    }
}
// const resizeObserver = new ResizeObserver((entries) => {
//     mapFlyToRiver(map)
// })

// const subscribe = warnInfoStore.$subscribe((mutaton, state) => {
//     if(mutaton.events.key === "_transitioningPaint") {
//         return
//     }
//     console.log('in sub', mutaton.events.key)
//     updateWarnInfoDesc(state.warnInfo)
// }, { detached: false })

const updateWarnInfoDesc = async (warnInfo) => {
    const DEVICETYPEMAP = ['GNSS', '应力桩', '水压力计', '测斜仪']
    let WARN_TEXT = []
    // console.log('warnInfo! ', warnInfo)
    let deviceNameList = []
    let warnTimeList = []
    // console.log('print warn info', warnInfoStore.warnInfo)
    if (warnInfo.length == 0) {
        statusText.value = '正常'
    } else {
        statusText.value = '报警'
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
        // (${buildLocStr(deviceId)})
        let warnString = `
            警告：于${warnTime}，${gnssIdSectionMap[deviceId]}断面的 \
            ${deviceName}(${deviceNameMap[deviceName][deviceId]})报警， \
            请及时处置！
        `
        WARN_TEXT.push(warnString)
    }
    warnLoading.value = false
    // warnKeyValList.value[2].val = deviceNameList.join(',')
    // warnKeyValList.value[1].val = warnTimeList.join(',')
    // warnKeyValList.value[5].val = '是'

    warningList.value = WARN_TEXT
    if (warnInfo.length > 0) {
        warnActive.value = true
        domHideMap.value.video = false
        domHideMap.value.warn = false
    }

    // 第一次是没有初始化完的长度 所以很快 实际上很长
    await nextTick()
    // console.log('123123 length: ', marqueeBlockDom.value.offsetWidth)
    const marqueeBlockWidth = marqueeBlockDom.value.offsetWidth
    animateTime.value = `${marqueeBlockWidth / warnInfo.length / 36}s`
    if (warnInfo.length == 0) {
        animateTime.value = 0
    }
}


watch(
    () => warnInfoStore.warnInfo,
    (newV, oldV) => {
        console.log('new val warn', newV)
        updateWarnInfoDesc(newV)
        mapFlyToRiver(useMapStore().getMap())
    },
    { immediate: true, deep: true, flush: 'sync' },
)

watch(
    () => warnInfoStore.curDealId,
    (newVal) => {
        if (newVal && newVal != '') {
            // console.log("123123123123", newVal)
            warnActive.value = true
            // mapFlyToRiver(useMapStore().getMap())
        }
    },
)

// 岸段切换
onBeforeRouteUpdate((to, from) => {

 
    useBankNameStore().globalBankName = to.params.id
    if (to.params.id === 'Mzs') {
        showVedio.value = true
        showViewButton.value = true
    } else {
        showVedio.value = false
        showViewButton.value = false
    }
    // refreshMap(useMapStore().getMap())
    mapInit(useMapStore().getMap(), true)


})

onMounted(async () => {
    // setTimeout(() => {
    //     warnActive.value = true
    // }, 3000)
    // console.log(route.params.id)
    updateInfo()
    useBankNameStore().globalBankName = route.params.id
    if (useBankNameStore().globalBankName === 'Mzs') {
        showVedio.value = true
        showViewButton.value = true
    } else {
        showVedio.value = false
        showViewButton.value = false
    }

    //////////return loaded Map
    map = await initPureScratchMap(mapDom.value)
    // map = await initBaseMap(mapDom.value)
    map.on('render', () => {
        map.triggerRepaint()
    })
    // mapFlyToRiver(map)
    warnInfoStore.warnInfo.length ? mapFlyToRiver(map) : mapFlyToRiver2(map)

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
    }, 1000)
})

onUnmounted(() => {
    if (useMapStore().getMap()) {
        useMapStore().getMap().remove()
        useMapStore().destroyMap()
    }
})

///////// DEBUG REGION
const createCompIns = () => {
    const bankApp = createApp(threeDdevice)
    let fatherDom = document.querySelector('#DeviceInfoBox')

    let tempDiv = document.createElement('div')
    tempDiv.id = 'tempDiv'
    tempDiv.style.position = 'absolute'
    bankApp.mount(tempDiv)
    fatherDom.appendChild(tempDiv)
}
const clearDom = (dom) => {
    var children = dom.childNodes
    for (var i = children.length - 1; i >= 0; i--) {
        dom.removeChild(children[i])
    }
}
</script>

<style lang="scss" scoped>
@keyframes gradientScroll {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

div.twin-main-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    overflow: hidden;

    // background-color: rgb(100, 154, 202);
    background-color: hsl(194, 69%, 91%);

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
        // background-color: hsl(194, 69%, 91%);
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
        top: 10vh;
        right: 29.6vw;

        width: 10vw;
        height: 6vh;
        z-index: 3;
        border-radius: 10px;

        font-size: calc(0.6vw + 0.4vh);
        background-color: rgb(0, 56, 141);
        box-shadow: 4px 8px 8px -4px rgba(0, 11, 34, 0.9);

        // background-color: antiquewhite;
        :deep(.dv-border-box-12) {

            .border-box-content {
                // background-color: red;
                display: flex;
                justify-content: center;
                align-items: center;

                .el-radio-group {
                    width: 9vw;
                    height: 4.5vh;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    .el-radio-button {
                        display: block;
                        height: 4vh;
                        width: 4vw;
                        margin: 0vh 0.2vw;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        z-index: 2;
                        transition: .5s ease-in-out;

                        &.is-active {
                            .el-radio-button__inner {
                                color: white;

                                &::after {
                                    content: '';
                                    position: absolute;
                                    top: -0.15vh;
                                    left: -0.15vw;
                                    bottom: -0.15vh;
                                    right: -0.15vw;
                                    background-image: linear-gradient(45deg, rgb(235, 88, 104), #0400ff, rgb(90, 244, 255));
                                    background-size: 200% 200%;
                                    animation: gradientScroll 3s ease-in-out infinite;
                                    z-index: -1;
                                    border-radius: inherit;
                                    /* 如果需要圆角 */
                                }
                            }
                        }

                        .el-radio-button__original-radio {
                            display: none;
                        }

                        .el-radio-button__inner {
                            position: relative;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 4vh;
                            width: 3.6vw;
                            background-color: rgb(5, 33, 98);
                            font-size: calc(0.5vw + 0.4vh);
                            border: none;
                            border-radius: 10px;
                            color: rgb(184, 184, 184);

                            &:hover {
                                font-weight: 800;
                                font-size: calc(0.5vw + 0.5vh);
                                color: white;
                            }
                        }
                    }
                }
            }
        }



    }

    div.marquee-container {
        position: absolute;
        left: 27.4vw;
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
                width: 96%;
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
                        transform: translateX(0.6vw);
                    }
                }
            }
        }
    }

    div.button-block {
        position: absolute;
        background-color: rgb(151, 248, 248);
        border-radius: 7px;
        right: 1vw;
        width: fit-content;
        height: 3vh;
        top: 3.5vh;
        padding: 0 0.4vw 0 0.4vw;
        line-height: 3vh;
        text-align: center;
        border-right: #a4bfff 2px solid;
        border-bottom: #a4bfff 4px solid;
        font-weight: bolder;
        color: #1d00be;
        z-index: 4;
        font-size: calc(1vw + 1vh);
        transform: scaleX(1.4) translateX(-20%);

        /* 初始阴影 */
        &:hover {
            background-color: #0400fd;
            color: #aaffff;
            cursor: pointer;
            font-weight: bold;
        }

        &.active {
            top: 54.5vh;
            font-weight: normal;
            font-size: calc(0.5vw + 0.5vh);
            transform: none;
        }
    }

    div.monitor-legend-container {
        position: absolute;
        bottom: 1vh;
        left: 28.5lvw;
        width: 45vw;
        height: 10vh;
        user-select: none;
        z-index: 4;
        display: flex;
        flex-flow: row nowrap;
        // justify-content: space-between;
        justify-content: space-around;

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
            padding-left: 0.8vw;
            padding-right: 0.8vw;

            &:hover {
                cursor: pointer;
            }
        }

        div.monitor-legend-block {
            position: relative;
            width: 45vw;
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
                width: 7vw;
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
                    font-size: calc(0.5vw + 0.4vh);

                    &:hover {
                        cursor: pointer;
                    }
                }

                div.legend-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    &:hover {
                        cursor: pointer;
                    }

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

                    .device-check-container {
                        margin-top: 0.3vh;

                        // font-size: 40px;
                        .input[type='checkbox'] {
                            display: none;
                        }

                        .custom-checkbox {
                            display: inline-block;
                            width: calc(0.4vw + 0.4vh);
                            height: calc(0.4vw + 0.4vh);
                            // background-color: #0400fc;
                            border: 2px solid rgb(3, 36, 184);
                            border-radius: 20%;
                            position: relative;
                            cursor: pointer;
                        }

                        /* Style for the custom checkmark */
                        .custom-checkbox::after {
                            // content: "";
                            // position: absolute;
                            // top: 50%;
                            // left: 50%;
                            // transform: translate(-50%, -50%);
                            // width: calc(0.3vw + 0.3vh);
                            // height: calc(0.3vw + 0.3vh);
                            // background-color: #0400fc;
                            // border-radius: 10%;
                            // opacity: 0;
                            content: '';
                            position: absolute;
                            top: 10%;
                            left: 25%;
                            // transform: translate(-50%, -50%);
                            width: calc(0.1vh + 0.1vw);
                            height: calc(0.2vh + 0.2vw);
                            border: solid #013c63;
                            border-width: 0 2px 2px 0;
                            opacity: 0;
                            transform: rotate(45deg);
                        }

                        /* Show the checkmark when checkbox is checked */
                        .input[type='checkbox']:checked+.custom-checkbox::after {
                            opacity: 1;
                        }
                    }
                }
            }

            div.GNSS {
                width: 14vw;

                div.item-title {
                    cursor: pointer;
                }
            }
        }
    }

    // div.warn-history-container {
    //     position: absolute;
    //     right: 1vw;
    //     bottom: 1vh;
    //     height: 34vh;
    //     width: 24vw;

    //     backdrop-filter: blur(16px);
    //     box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    //     background-color: rgba(156, 195, 255, 0.4);
    //     border-radius: 4px;
    //     border: 2px solid rgb(28, 105, 247);
    //     z-index: 3;
    //     border-radius: 4px;
    //     overflow: hidden;

    //     div.warn-history-title {
    //         height: 4vh;
    //         line-height: 4vh;
    //         width: 100%;
    //         background-color: transparent;
    //         text-align: center;
    //         font-size: calc(0.8vw + 0.8vh);
    //         font-weight: bold;
    //         color: #0400fd;
    //         text-shadow:
    //             #eef3ff 1px 1px,
    //             #eef3ff 2px 2px,
    //             #6493ff 3px 3px;
    //         letter-spacing: 0.4rem;
    //         border-bottom: 2px solid #0400fd;
    //     }

    //     div.warn-histroy-content {
    //         height: 30vh;
    //         width: 23vw;
    //         margin-left: 0.5vw;

    //         div.device-status-content {
    //             // position: absolute;
    //             // top: 5vh;
    //             width: 100%;
    //             // margin-left: 2.5%;
    //             height: 30vh;

    //             // background-color: #c4fbff;

    //             div.device-status-row {
    //                 height: 4vh;
    //                 width: 100%;
    //                 border-radius: 2px;

    //                 // background-color: #2622fd;

    //                 display: flex;
    //                 flex-flow: row nowrap;
    //                 justify-content: space-around;

    //                 &.head {
    //                     padding-bottom: 4px;
    //                 }

    //                 div.device-item {
    //                     width: 28%;
    //                     height: 100%;
    //                     line-height: 3.2vh;
    //                     text-align: center;
    //                     font-size: calc(0.5vw + 0.4vh);
    //                     border-radius: 2px;

    //                     background-color: #d2f2ff;
    //                     font-weight: bold;
    //                     color: #2a5fdb;

    //                     &.device-name {
    //                         width: 40%;
    //                     }

    //                     &.device-time {
    //                         width: 32%;
    //                     }

    //                     &.device-count {
    //                         display: flex;
    //                         justify-content: center;

    //                         div.normal {
    //                             color: #00ca22;
    //                         }
    //                     }

    //                     &.head {
    //                         background-color: #2a5fdb;
    //                         border: 1px solid #aaffff;
    //                         font-weight: bold;
    //                         color: #dafdff;
    //                         box-shadow:
    //                             rgba(208, 252, 255, 0.6) 0px 2px 4px,
    //                             rgba(208, 252, 255, 0.4) 0px 7px 13px -3px,
    //                             rgba(208, 252, 255, 0.3) 0px -3px 0px inset;
    //                     }

    //                     box-shadow: rgba(13, 70, 228, 0.6) 0px 2px 4px,
    //                     rgba(6, 55, 189, 0.4) 0px 7px 13px -3px,
    //                     rgba(9, 61, 204, 0.3) 0px -3px 0px inset;
    //                 }
    //             }
    //         }
    //     }
    // }

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

    div.hide-status-button {
        position: absolute;
        left: 25.6vw;
        top: 18.5vh;

        width: 1.4vw;
        height: 2vw;

        background-color: #e5f0ffc4;
        backdrop-filter: blur(8px);
        z-index: 3;

        transition: all ease-in-out 0.2s;

        &.left {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;

            &.in-active {
                left: 0vw;
            }
        }

        &.right {
            left: 75vw;
            top: 3.2vh;
            z-index: 4;
            transition: none;

            &.warn-active {
                top: 54.2vh;
            }

            &.in-active {
                left: 98.6vw;
            }

            &.warn {
                top: 10.2vh;
            }
        }

        &:hover {
            cursor: pointer;
            transform: scale(1.05);
            filter: drop-shadow(2px 2px 1px rgb(73, 182, 255));
        }
    }
}

.hide-left {
    transform: translateX(calc(-100% - 1vw));
}

.hide-right {
    transform: translateX(calc(100% + 1vw));
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
    right: 3px;
    top: 3px;
    z-index: 3;
    // border: none;
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
