<template>
    <div class="device-info-container" :class="{ 'hide-left': props.domHide }">
        <dv-border-box12 :dur="5" :color="['rgb(28, 75, 187)', 'rgb(140, 255, 255)']">
            <div class="device-info-content">
                <div class="monitor-title-container">设备状态</div>
                <!-- <div class="monitor-info-splitter">
                    <dv-decoration3
                        style="width: 50%; height: 100%"
                        :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                    />
                    <dv-decoration3
                        style="width: 50%; height: 100%"
                        :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                    />
                </div> -->
                <div class="device-status-container">
                    <!-- <div class="small-title-container">
                            <div class="small-title-icon"></div>
                            <div class="small-title-text">设备状态</div>
                        </div> -->
                    <div class="device-status-content">
                        <div class="head device-status-row">
                            <div class="device-name device-item head">
                                设备类型
                            </div>
                            <div class="device-count device-item head">
                                报警数/在线数/总数
                            </div>
                            <!-- <div class="device-time device-item head">
                                    最新更新时间
                                </div> -->
                            <!-- <div class="device-freq device-item head">
                                    更新频次
                                </div> -->
                        </div>
                        <div class="device-status-row body" v-for="(item, index) in deviceStatusDataList" :key="index">
                            <el-tooltip class="box-item" effect="light" content="点击查看数据" placement="right" :offset="-6"
                                :hide-after="10" v-if="item.name != '视频监控'">
                                <div class="device-name device-item body" @click="changeDeviceType(item.name)" :class="{
                                    click: item.name != '视频监控',
                                }">
                                    {{ item.name }}
                                </div>
                            </el-tooltip>
                            <div class="device-name device-item body" v-else>
                                {{ item.name }}
                            </div>
                            <div class="device-count device-item body" v-loading="deviceStatusLoading">
                                <div class="warn">
                                    {{ warnDeviceCount[index] }}
                                </div>
                                <div>/</div>
                                <div class="normal">{{ item.count }}</div>
                                <div>/</div>
                                <div>{{ item.count }}</div>
                            </div>
                            <!-- <div
                                    class="device-time device-item body"
                                    v-loading="deviceStatusLoading"
                                >
                                    {{ item.time }}
                                </div> -->
                            <!-- <div class="device-freq device-item body">
                                    {{ item.freq }}
                                </div> -->
                        </div>
                    </div>
                    <div class="device-chart-container">
                        <div class="section-selector">
                            <!-- <div class="section-selectior-item type">
                                    <el-select
                                        v-model="selectedDeviceType"
                                        placeholder="选择设备类型"
                                        style="width: 12vw; height: 3.5vh"
                                        @change="deviceTypeSelectChange"
                                    >
                                        <el-option
                                            v-for="item in deviceTypeList"
                                            :key="item"
                                            :label="'设备类型：' + item"
                                            :value="item"
                                        >
                                            <span class="section-name-text">{{
                                                item
                                            }}</span>
                                        </el-option>
                                    </el-select>
                                </div> -->
                            <div class="section-selectior-item">
                                <el-select v-model="selectedDevice" placeholder="选择具体设备" style="width: 4.5vw; height: 2.4vh"
                                    @change="deviceSelectChange">
                                    <el-option v-for="(item, index) in deviceList" :key="index" :label="item" :value="item">
                                        <span class="section-name-text">{{
                                            item
                                        }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="device-update-time">
                                <div class="static">数据更新时间：</div>
                                <div class="update-time" v-loading="updateTimeLoading">
                                    {{
                                        deviceUpdateTime +
                                        '(' +
                                        deviceTypeTimeMap[selectedDeviceType]
                                            .freq +
                                        ')'
                                    }}
                                </div>
                            </div>
                            <div class="section-selectior-item">
                                <el-select v-model="selectedDataMode" placeholder="选择查看模式"
                                    style="width: 4.5vw; height: 2.4vh" @change="dataModeChange">
                                    <el-option v-for="item in ['实时', '长期']" :key="item" :label="item" :value="item">
                                        <span class="section-name-text">{{
                                            item
                                        }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                            <!-- <div class="nav-data-button" @click="navToMoreData">
                        更多数据
                    </div> -->
                        </div>
                        <div class="device-chart-dom" ref="chartDom" v-loading="chartDataLoading" @dblclick="navToMoreData">
                        </div>
                    </div>
                    <div class="video-content-container">
                        <div class="video-box" v-for="(item, index) in videoList" :key="index" :id="item.order">
                            <div class="video-content">
                                <iframe :src="item.videoUrl + token" width="100%" height="100%" :id="item.name"
                                    allowfullscreen>
                                </iframe>
                            </div>
                            <div class="video-title" :class="videoList[index].warn ? 'warn' : 'normal'
                                " @click="focusOn(index)">
                                {{ item.name }}
                            </div>
                            <!-- <div
                                class="video-focus"
                                v-if="item.order != 0"
                                @click="focusOn(index)"
                            >
                                放大
                            </div> -->
                            <div class="small-pic" v-if="item.order == 0" :id="index"></div>
                        </div>
                    </div>
                    <div class="video-control-opener" :class="{ open: videoControlOpen }">
                        <div class="left tri"></div>
                        <div class="control-open-text" @click="videoControlOpen = !videoControlOpen">
                            {{
                                videoControlOpen
                                ? '◀监控云台控制◀'
                                : '▶监控云台控制▶'
                            }}
                        </div>
                        <div class="right tri"></div>
                    </div>
                    <div class="video-controller-container" v-if="videoControlOpen">
                        <div class="crc-directions">
                            <div class="crc-directions-up" @click="basicVideoFunction(0)">
                                <ArrowUpBold style="
                                        width: 3vh;
                                        height: 3vh;
                                        display: block;
                                    " />
                            </div>
                            <div class="crc-directions-left" @click="basicVideoFunction(2)">
                                <ArrowLeftBold style="
                                        width: 3vh;
                                        height: 3vh;
                                        display: block;
                                    " />
                            </div>
                            <div class="crc-directions-right" @click="basicVideoFunction(3)">
                                <ArrowRightBold style="
                                        width: 3vh;
                                        height: 3vh;
                                        display: block;
                                    " />
                            </div>
                            <div class="crc-directions-down" @click="basicVideoFunction(1)">
                                <ArrowDownBold style="
                                        width: 3vh;
                                        height: 3vh;
                                        display: block;
                                    " />
                            </div>
                        </div>
                        <div class="function-button-group">
                            <div class="preset button-title">预设点</div>
                            <div class="preset button-column">
                                <div class="preset button-item" v-for="(item, i) in videoList[
                                    curBigVideoIndex
                                ].presetPt" :key="i" @click="move2PresetPoint(i + 1)" :class="item.status">
                                    {{ item.name }}
                                </div>
                            </div>
                            <div class="zoom button-title">视角缩放</div>
                            <div class="zoom button-column">
                                <div class="zoom button-item" v-for="(func, index) in zoomFuncList" :key="index"
                                    @click="basicVideoFunction(index + 4)">
                                    {{ func.label }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </dv-border-box12>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
// import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import axios from 'axios'
import * as echarts from 'echarts'
import BackEndRequest from '../../api/backend'
import {
    genGnssOptionOfDevice,
    genStressOptionOfDevice,
    genIncinometerOptionOfDevice,
    genManometerOptionOfDevice,
    toggleOptionDataMode,
} from './dataChartSettings'
import router from '../../router'
import { useWarnInfoStore } from '../../store/mapStore'

const props = defineProps({
    domHide: {
        type: Boolean,
        default: false,
    },
    deviceType: {
        type: String,
        default: '位移测量站'
    }
})

const token = ref(
    'at.aiesix6wdmxhqgov73ss8cwi1cojuwbk-5j41zyk35u-04bzsju-xgfi1zltr',
)

const chartDom = ref()
const chartDataLoading = ref(true)
const deviceStatusLoading = ref(true)
const updateTimeLoading = ref(false)
const videoControlOpen = ref(false)

const deviceStatusDataList = ref([
    { name: '位移测量站', count: 10, time: '2024', freq: '10分钟' },
    { name: '应力桩', count: 7, time: '2024', freq: '1分钟' },
    { name: '孔隙水压力计', count: 9, time: '2024', freq: '1小时' },
    { name: '测斜仪', count: 9, time: '2024', freq: '1小时' },
    // { name: '视频监控', count: 3, time: '2024', freq: '实时' },
])

const warnDeviceCount = ref([0, 0, 0, 0, '-'])

const domHide = ref(true)

const deviceUpdateTime = ref('2024-06-15 14:00:00')

const deviceListMap = {
    位移测量站: [
        'CL-01',
        'CL-02',
        'CL-03',
        'CL-04',
        'CL-05',
        'CL-06',
        'CL-07',
        'CL-08',
        'CL-09',
        'CL-10',
    ],
    测斜仪: [
        'CX-01',
        'CX-02',
        'CX-03',
        'CX-04',
        'CX-05',
        'CX-06',
        'CX-07',
        'CX-08',
        'CX-09',
    ],
    孔隙水压力计: [
        'KX-01',
        'KX-02',
        'KX-03',
        'KX-04',
        'KX-05',
        'KX-06',
        'KX-07',
        'KX-08',
        'KX-09',
    ],
    应力桩: ['YL-01', 'YL-02', 'YL-03', 'YL-04', 'YL-05', 'YL-06', 'YL-07'],
}

const deviceTypeNameMap = {
    位移测量站: 'gnss',
    测斜仪: 'inclinometer',
    孔隙水压力计: 'manometer',
    应力桩: 'stress',
}

const deviceTypeErrorMap = {
    位移测量站: 5,
    测斜仪: 3,
    孔隙水压力计: 0.2,
    应力桩: 40,
}

const deviceIdMap = {
    'CL-01': 'MZS120.51749289_32.04059243_1',
    'CL-02': 'MZS120.51977143_32.04001152_1',
    'CL-03': 'MZS120.52557975_32.03825056_1',
    'CL-04': 'MZS120.52660704_32.03676583_1',
    'CL-05': 'MZS120.53334877_32.03227055_1',
    'CL-06': 'MZS120.54599538_32.02837993_1',
    'CL-07': 'MZS120.55327892_32.02707923_1',
    'CL-08': 'MZS120.55649757_32.02592404_1',
    'CL-09': 'MZS120.56334257_32.02298144_1',
    'CL-10': 'MZS120.56944728_32.02070961_1',
    'KX-01': 'MZS120.51726088_32.04054582_3',
    'KX-02': 'MZS120.51738292_32.04054923_3',
    'KX-03': 'MZS120.51749021_32.04053105_3',
    'KX-04': 'MZS120.51957026_32.04008655_3',
    'KX-05': 'MZS120.51967889_32.04004108_3',
    'KX-06': 'MZS120.51986665_32.03998992_3',
    'KX-07': 'MZS120.52557975_32.03825056_3',
    'KX-08': 'MZS120.52565217_32.03813574_3',
    'KX-09': 'MZS120.52566826_32.03799363_3',
    'YL-01': 'MZS120.513203_32.042733_2',
    'YL-02': 'MZS120.515433_32.04231_2',
    'YL-03': 'MZS120.521221_32.040331_2',
    'YL-04': 'MZS120.529078_32.034385_2',
    'YL-05': 'MZS120.541648_32.030524_2',
    'YL-06': 'MZS120.548925_32.029361_2',
    'YL-07': 'MZS120.552209_32.028149_2',
    'CX-01': 'MZS120.51967889_32.04004108_4',
    'CX-02': 'MZS120.51986665_32.03998992_4',
    'CX-03': 'MZS120.52557975_32.03825056_4',
    'CX-04': 'MZS120.52565217_32.03813574_4',
    'CX-05': 'MZS120.52566826_32.03799363_4',
    'CX-06': 'MZS120.51726088_32.04054582_4',
    'CX-07': 'MZS120.51738292_32.04054923_4',
    'CX-08': 'MZS120.51749021_32.04053105_4',
    'CX-09': 'MZS120.51957026_32.04008655_4',
}

const deviceTypeTimeMap = {
    位移测量站: {
        timeUnit: 'day',
        timeCount: 60,
        realTimeCount: 1,
        realTimeUnit: 'hour',
        freq: '10分钟',
    },
    测斜仪: {
        timeUnit: 'day',
        timeCount: 3,
        realTimeCount: 6,
        realTimeUnit: 'hour',
        freq: '1小时',
    },
    孔隙水压力计: {
        timeUnit: 'day',
        timeCount: 3,
        realTimeCount: 6,
        realTimeUnit: 'hour',
        freq: '1小时',
    },
    应力桩: {
        timeUnit: 'hour',
        timeCount: 24,
        realTimeCount: 1,
        realTimeUnit: 'hour',
        freq: '1分钟',
    },
}

const selectedDeviceType = ref('位移测量站')

const deviceList = ref(deviceListMap['位移测量站'])
// console.log(deviceList)
const selectedDevice = ref('CL-01')

const selectedDataMode = ref('实时')

const sectionClassColorMap = ref({
    警告: 'warning',
    预警: 'pre-warning',
    关注: 'attention',
    普通: 'normal',
    统计: 'all',
})

const deviceTypeList = ref(['位移测量站', '应力桩', '孔隙水压力计', '测斜仪'])

const videoList = ref([
    {
        name: '民主沙海事码头监控',
        position: '32.0316674, 120.5402574',
        deviceId: 'FB5033035',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=`,
        order: 0,
        presetPt: [
            { name: '上游岸段', status: 'normal' },
            { name: '下游岸段', status: 'normal' },
            { name: 'CL-06', status: 'normal' },
            { name: '海事码头', status: 'normal' },
        ],
        warn: false,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        position: '32.0381061, 120.5263473',
        deviceId: 'FB5033037',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.live&autoplay=1&accessToken=`,
        order: 1,
        presetPt: [
            { name: '下游岸段', status: 'normal' },
            { name: '上游岸段', status: 'normal' },
            { name: 'CL-04', status: 'normal' },
            { name: '小港池', status: 'normal' },
        ],
        warn: false,
    },
    {
        name: '民主沙上游围堤监控',
        position: '32.0432963, 120.5122242',
        deviceId: 'FB5033036',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.live&autoplay=1&accessToken=`,
        order: 2,
        presetPt: [
            { name: '下游岸段', status: 'normal' },
            { name: '上游岸段', status: 'normal' },
            { name: 'CL-02', status: 'normal' },
            { name: 'JZ-01', status: 'normal' },
        ],
        warn: false,
    },
])

const zoomFuncList = [
    { label: '放大', func: '' },
    { label: '缩小', func: '' },
    { label: '远焦距', func: '' },
    { label: '近焦距', func: '' },
]

let controlParam = {
    deviceSerial: 'FB5033035',
    channelNo: '1',
    direction: '9',
    speed: 1,
}

let presetParam = {
    deviceSerial: 'FB5033035',
    channelNo: '1',
    index: '1',
}

const functionIndexList = [0, 1, 2, 3, 8, 9, 10, 11]

let curBigVideoIndex = ref(0)

const focusOn = (index) => {
    ;[
        videoList.value[curBigVideoIndex.value].order,
        videoList.value[index].order,
    ] = [
            videoList.value[index].order,
            videoList.value[curBigVideoIndex.value].order,
        ]
    curBigVideoIndex.value = index
}

const navToMoreData = () => {
    router.push(
        '/bankManage/monitor/' + deviceTypeNameMap[selectedDeviceType.value],
    )
}

let gnssOption = {}
let stressOption = {}
let inclinoOption = {}
let manoOption = {}
let echartIns = null
let deviceOptionMap = {
    位移测量站: {},
    测斜仪: {},
    孔隙水压力计: {},
    应力桩: {},
}
let deviceGenOptionMap = {
    位移测量站: genGnssOptionOfDevice,
    测斜仪: genIncinometerOptionOfDevice,
    孔隙水压力计: genManometerOptionOfDevice,
    应力桩: genStressOptionOfDevice,
}

const changeDeviceType = (deviceName) => {
    selectedDeviceType.value = deviceName
    deviceTypeSelectChange(deviceName)
}

const deviceTypeSelectChange = async (deviceType) => {
    // console.log(deviceType)
    deviceList.value = deviceListMap[deviceType]
    selectedDevice.value = deviceListMap[deviceType][0]
    echartIns.clear()
    chartDataLoading.value = true
    updateTimeLoading.value = true
    await deviceSelectChange(deviceListMap[deviceType][0])
    updateTimeLoading.value = false
    chartDataLoading.value = false
}

let curDeviceData = null
let realTimeData = null
let curUpdateInterval = null

const toggleChartOptionFromData = (deviceData) => {
    // console.log('select data mode', selectedDataMode.value)
    deviceOptionMap[selectedDeviceType.value] = deviceGenOptionMap[
        selectedDeviceType.value
    ](
        deviceData,
        deviceTypeErrorMap[selectedDeviceType.value],
        selectedDataMode.value,
    )
    // console.log('option', gnssOption)
    echartIns.setOption(deviceOptionMap[selectedDeviceType.value])
    // if (selectedDeviceType.value == '位移测量站') {
    //     deviceOptionMap[selectedDeviceType.value] = deviceGenOptionMap[selectedDeviceType.value](
    //         deviceData,
    //         deviceTypeErrorMap[selectedDeviceType.value],
    //         selectedDataMode.value,
    //     )
    //     // console.log('option', gnssOption)
    //     echartIns.setOption(deviceOptionMap[selectedDeviceType.value])
    // } else if (selectedDeviceType.value == '应力桩') {
    //     stressOption = genStressOptionOfDevice(
    //         deviceData,
    //         deviceTypeErrorMap['应力桩'],
    //         selectedDataMode.value,
    //     )
    //     echartIns.setOption(stressOption)
    // } else if (selectedDeviceType.value == '测斜仪') {
    //     inclinoOption = genIncinometerOptionOfDevice(
    //         deviceData,
    //         deviceTypeErrorMap['测斜仪'],
    //         selectedDataMode.value,
    //     )
    //     echartIns.setOption(inclinoOption)
    // } else {
    //     manoOption = genManometerOptionOfDevice(
    //         deviceData,
    //         deviceTypeErrorMap['孔隙水压力计'],
    //         selectedDataMode.value,
    //     )
    //     echartIns.setOption(manoOption)
    // }
}

const deviceSelectChange = async (deviceName) => {
    // console.log('device change', deviceName)
    chartDataLoading.value = true
    updateTimeLoading.value = true
    curDeviceData = (
        await BackEndRequest.getMonitorDataByTypeIdWithTime(
            deviceTypeNameMap[selectedDeviceType.value],
            deviceIdMap[deviceName],
            deviceTypeTimeMap[selectedDeviceType.value].timeUnit,
            deviceTypeTimeMap[selectedDeviceType.value].timeCount,
        )
    ).data
    if (curDeviceData.length > 0) {
        let newestData = curDeviceData.slice(-1)[0]
        deviceUpdateTime.value = newestData.measureTime
    }
    chartDataLoading.value = false
    updateTimeLoading.value = false
    // console.log('device data', curDeviceData)
    toggleChartOptionFromData(curDeviceData)
}

const dataModeChange = (dataMode) => {
    if (curDeviceData != null) {
        console.log('in change.. no data request')
        // chartDataLoading.value = true
        // updateTimeLoading.value = true
        // if (curDeviceData.length > 0) {
        //     let newestData = curDeviceData.slice(-1)[0]
        //     deviceUpdateTime.value = newestData.measureTime
        // }
        // chartDataLoading.value = false
        // updateTimeLoading.value = false
        // // console.log('device data', curDeviceData)
        // toggleChartOptionFromData(curDeviceData)
        deviceOptionMap[selectedDeviceType.value] = toggleOptionDataMode(
            deviceOptionMap[selectedDeviceType.value],
            selectedDeviceType.value,
            dataMode
        )
        echartIns.setOption(deviceOptionMap[selectedDeviceType.value])
    } else {
        // console.log('request data', curDeviceData)
        deviceSelectChange(selectedDevice.value)
    }
}

const basicVideoFunction = async (functionIndex) => {
    controlParam.deviceSerial = videoList.value[curBigVideoIndex.value].deviceId
    controlParam.direction = functionIndexList[functionIndex]
    // console.log('curent func param', controlParam)
    let stRes = await axios.post(
        'https://open.ys7.com/api/lapp/device/ptz/start',
        null,
        {
            params: { accessToken: token.value, ...controlParam },
        },
    )
    setTimeout(async () => {
        let stopRes = await axios.post(
            'https://open.ys7.com/api/lapp/device/ptz/stop',
            null,
            {
                params: { accessToken: token.value, ...controlParam },
            },
        )
        // console.log('control stopped', stRes, stopRes)
    }, 100)
}

const move2PresetPoint = async (presetIndex) => {
    presetParam.deviceSerial = videoList.value[curBigVideoIndex.value].deviceId
    presetParam.index = presetIndex
    // console.log('preset param', presetParam)
    let stRes = await axios.post(
        'https://open.ys7.com/api/lapp/device/preset/move',
        null,
        {
            params: { accessToken: token.value, ...presetParam },
        },
    )
    // console.log('preset move', stRes)
}

const moveBack2Origin = async () => {
    const moveBackPost = []
    for (let video of videoList.value) {
        // console.log(video)
        moveBackPost.push(
            axios.post(
                'https://open.ys7.com/api/lapp/device/preset/move',
                null,
                {
                    params: {
                        accessToken: token.value,
                        channelNo: '1',
                        index: '1',
                        deviceSerial: video.deviceId,
                    },
                },
            ),
        )
    }
    const res = await axios.all(moveBackPost)
    // console.log('back back', res)
}

function zeroFill(i) {
    if (i >= 0 && i <= 9) {
        return '0' + i
    } else {
        return i
    }
}

async function updateNewestTime() {
    let newestDataStatus = (
        await BackEndRequest.getAllTypeMonitorNewestData()
    ).map((item) => {
        return item.data
    })
    newestDataStatus.map((item, index) => {
        deviceStatusDataList.value[index].time = item.measureTime.split(' ')[1]
    })
}

async function updateNewestData() {
    if (curDeviceData == null) return
    let deviceNewestData = (
        await BackEndRequest.getDeviceNewestData(
            deviceTypeNameMap[selectedDeviceType.value],
            deviceIdMap[selectedDevice.value],
        )
    ).data
    if (
        curDeviceData.length == 0 ||
        deviceNewestData.measureTime !=
        curDeviceData[curDeviceData.length - 1].measureTime
    ) {
        curDeviceData.push(deviceNewestData)
        toggleChartOptionFromData(curDeviceData)
        deviceUpdateTime.value = deviceNewestData.measureTime
        console.log('data update')
    } else {
        console.log('no update data')
    }
}

watch(
    () => useWarnInfoStore().warnInfo,
    (newVal) => {
        // console.log('watching23321!!!!!!!!!!')
        const warnDataCount = [0, 0, 0, 0, '-']
        // console.log('warn', warnData)
        newVal.map((item, index) => {
            warnDataCount[+(item.deviceId.split('_').pop() - 1)] =
                warnDataCount[+(item.deviceId.split('_').pop() - 1)] + 1
        })
        warnDeviceCount.value = warnDataCount
        // console.log(warnDeviceCount)
    },
    { immediate: true, deep: true, flush: 'sync' },
)

watch(
    () => useWarnInfoStore().videoActive,
    (newVal, oldVal) => {
        if (oldVal[0] != null) {
            videoList.value[oldVal[0]].warn = false
            if (oldVal[1] != null) {
                videoList.value[oldVal[0]].presetPt[oldVal[1]].status = 'normal'
            }
        }
        if (newVal[0] != null) {
            videoList.value[newVal[0]].warn = true
            if (newVal[1] != null) {
                videoList.value[newVal[0]].presetPt[newVal[1]].status = 'warn'
                move2PresetPoint(newVal[1] + 1)
            }
        } else {
            move2PresetPoint(1)
        }
    },
)

watch(
    () => props.deviceType,
    (v) => {
        changeDeviceType(v)
    }
)

onMounted(async () => {
    // await updateNewestTime()
    // let myDate = new Date()
    // deviceStatusDataList.value[4].time =
    //     zeroFill(myDate.getHours()) +
    //     ':' +
    //     zeroFill(myDate.getMinutes()) +
    //     ':' +
    //     zeroFill(myDate.getSeconds())
    // setInterval(() => {
    //     myDate = new Date()
    //     deviceStatusDataList.value[4].time =
    //         zeroFill(myDate.getHours()) +
    //         ':' +
    //         zeroFill(myDate.getMinutes()) +
    //         ':' +
    //         zeroFill(myDate.getSeconds())
    // }, 1000)

    deviceStatusLoading.value = false
    updateTimeLoading.value = true
    // console.log('213', newestDataStatus)
    echartIns = echarts.init(chartDom.value)
    curDeviceData = (
        await BackEndRequest.getMonitorDataByTypeIdWithTime(
            'gnss',
            deviceIdMap['CL-01'],
            deviceTypeTimeMap['位移测量站'].timeUnit,
            deviceTypeTimeMap['位移测量站'].timeCount,
        )
    ).data
    let newestData = curDeviceData.slice(-1)[0]
    deviceUpdateTime.value = newestData.measureTime
    updateTimeLoading.value = false
    deviceOptionMap['位移测量站'] = genGnssOptionOfDevice(
        curDeviceData,
        deviceTypeErrorMap['位移测量站'],
        selectedDataMode.value,
    )
    // console.log('option', deviceOptionMap['位移测量站'])
    echartIns.setOption(deviceOptionMap['位移测量站'])
    chartDataLoading.value = false
    setInterval(async () => {
        chartDataLoading.value = true
        updateTimeLoading.value = true
        await updateNewestData()
        chartDataLoading.value = false
        updateTimeLoading.value = false
    }, 1000 * 60)
    // console.log('initialData', initialData)
})

onBeforeUnmount(async () => {
    await moveBack2Origin()
})
</script>

<style lang="scss" scoped>
$shadowWhite: #b3b3b3;
$shadowGreen: #00ca22;
$shadowBlue: #005ae0;
$shadowOrange: #c54f00;
$shadowRed: #cf0000;
$hoverColor: rgb(0, 160, 252);
$splitColor: rgba(0, 51, 160, 0.575);
$controlSize: 12vh;

div.device-info-container {
    z-index: 3;
    box-shadow: 4px 8px 8px -4px rgb(0, 86, 199);

    position: absolute;
    left: 1vw;
    top: 18.5vh;
    width: 26vw;
    height: 72.5vh;

    transition: all ease-in-out 0.2s;

    div.device-info-content {
        width: 25.4vw;
        margin-left: 0.3vw;
        margin-right: 0.3vw;
        height: 72.5vh;
        margin-top: 0vh;
        margin-bottom: 0.5vh;

        div.monitor-title-container {
            height: 4vh;
            line-height: 4vh;
            width: 100%;
            text-align: center;
            background-color: transparent;
            font-size: calc(0.8vw + 0.8vh);
            font-weight: bold;
            letter-spacing: 0.3rem;
            color: #2622fd;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
        }

        div.monitor-info-splitter {
            height: 2vh;
            width: 90%;
            margin-left: 5%;

            display: flex;

            // background-color: #2622fd;
        }

        div.device-status-container {
            position: relative;
            width: 98%;
            // margin-top: 0.2vh;
            margin-left: 1%;
            height: 24.2vh;

            div.small-title-container {
                position: relative;
                width: 95%;
                margin-left: 2.5%;
                margin-top: 1vh;
                height: 3.5vh;
                line-height: 3.5vh;
                font-size: calc(0.6vw + 0.8vh);
                display: flex;
                border-radius: 2px;

                background: linear-gradient(90deg,
                        rgba(0, 56, 128, 1) 0%,
                        rgba(16, 104, 203, 1) 60%,
                        rgba(68, 159, 255, 1) 100%);

                text-align: left;
                color: #c4fbff;
                font-weight: bold;

                div.small-title-icon {
                    height: 3.5vh;
                    width: 4vh;

                    background-image: url('/project-status.png');
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: 50% 50%;
                }
            }

            div.device-status-content {
                position: relative;
                // top: 1vh;
                width: 97%;
                margin-left: 1.5%;
                height: 6vh;
                display: flex;
                flex-flow: column wrap;

                // background-color: #c4fbff;

                div.device-status-row {
                    height: 100%;
                    width: 20%;
                    border-radius: 2px;

                    // background-color: #2622fd;

                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: space-around;

                    // &.head {
                    //     // padding-bottom: 4px;
                    // }

                    // &.body {
                    //     &:hover {
                    //         div.device-item {
                    //             background-color: #bee0ff;
                    //         }
                    //     }
                    // }

                    div.device-item {
                        width: 100%;
                        height: 33.3%;
                        // line-height: 2vh;
                        text-align: center;
                        font-size: calc(0.48vw + 0.36vh);
                        border-radius: 2px;

                        background-color: #d2f2ff;
                        font-weight: bold;
                        color: #2a5fdb;

                        &.device-name {
                            width: 100%;
                        }

                        &.device-time {
                            width: 100%;
                        }

                        &.device-freq {
                            width: 100%;
                        }

                        &.device-count {
                            height: 66.7%;
                            align-items: center;
                            display: flex;
                            justify-content: center;
                            column-gap: 0.2vw;

                            div.normal {
                                color: #00ca22;
                            }

                            div.warn {
                                color: rgb(255, 30, 0);
                            }
                        }

                        &.click {
                            &:hover {
                                cursor: pointer;
                                color: rgb(88, 223, 228);
                            }
                        }

                        &.head {
                            background-color: #2a5fdb;
                            border: 1px solid #aaffff;
                            font-weight: bold;
                            color: #dafdff;
                            font-size: calc(0.46vw + 0.3vh);
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

            // background-color: #2622fd;

            div.device-chart-container {
                position: relative;
                width: 97%;
                margin-left: 1.5%;
                height: 28vh;
                // margin-top: 1vh;
                border-radius: 4px;

                background-color: #e0f1ff;
                overflow: hidden;

                div.device-chart-dom {
                    width: 100%;
                    // margin-left: 2%;
                    height: 25vh;
                    // padding-top: 2%;
                    // padding-bottom: 2%;

                    // background-color: #2a5fdb;
                }

                div.section-selector {
                    height: 3vh;
                    // width: 21vw;
                    // margin-left: 1vw;
                    // padding-top: 0.5vh;
                    // margin-top: 0.5vh;
                    width: 100%;

                    // background-color: #6493ff;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: center;
                    column-gap: 0.25vw;

                    div.section-selectior-item {
                        width: 4.5vw;
                        height: 2.4vh;

                        line-height: 2.4vh;
                        text-align: center;
                        letter-spacing: 0.12rem;

                        // background-color: #eef3ff;
                        :deep(.el-select) {
                            height: 2.4vh;
                            box-shadow:
                                rgba(0, 132, 255, 0.8) 1px 1px,
                                rgba(0, 119, 255, 0.7) 2px 2px,
                                rgba(0, 119, 255, 0.6) 3px 3px;
                            border-radius: 3px;
                        }

                        :deep(.el-select__wrapper) {
                            height: 2.4vh;
                            line-height: 2.4vh;
                            border-radius: 3px;
                            font-family: 'Microsoft YaHei';
                            font-weight: bold;
                            font-size: calc(0.45vw + 0.42vh);
                            background-color: #e6f7ff;
                        }

                        &.type {
                            width: 12vw;

                            :deep(.el-select__wrapper) {
                                font-size: calc(0.45vw + 0.5vh);
                            }
                        }

                        :deep(.el-select__placeholder) {
                            color: #1267c9;
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

                    div.device-update-time {
                        position: relative;
                        width: fit-content;
                        line-height: 2.4vh;
                        height: 2.4vh;
                        margin-top: 0.2vh;
                        background-color: #e6f7ff;
                        color: #0056b8;

                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;

                        padding-left: 1%;
                        padding-right: 1%;
                        border-radius: 4px;

                        font-size: calc(0.42vw + 0.32vh);

                        div.update-time {
                            color: #00ca22;
                            // background-color: #deffe0;
                            font-weight: bold;
                        }

                        box-shadow: rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 2px 2px,
                        rgba(0, 119, 255, 0.6) 3px 3px;
                    }

                    div.nav-data-button {
                        width: 4vw;
                        height: 3.5vh;

                        background-color: #0748aa;

                        box-shadow:
                            rgba(0, 132, 255, 0.8) 1px 1px,
                            rgba(0, 119, 255, 0.7) 2px 2px,
                            rgba(0, 119, 255, 0.6) 3px 3px;
                        border-radius: 6px;

                        line-height: 3.5vh;
                        text-align: center;
                        color: #c4fbff;
                        font-size: calc(0.5vw + 0.4vh);
                        transition: all 0.1s ease-in-out;

                        &:hover {
                            cursor: pointer;
                            transform: translate3d(2px, 2px, 2px);
                            font-weight: bold;
                            box-shadow: rgba(0, 132, 255, 0.8) 1px 1px;
                        }
                    }
                }
            }

            div.video-content-container {
                position: relative;
                top: 1vh;

                height: 32vh;
                width: 98%;
                margin-left: 1%;
                // margin-left: 1.5%;

                z-index: 4;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
                align-content: flex-start;

                background-color: #005ae0;

                div.video-box {
                    // margin-top: 1vh;
                    width: 6vw;
                    // margin-left: 0.5vw;
                    height: 10vh;

                    // background-color: rgba(3, 63, 173, 1);

                    div.video-content {
                        height: calc(100% - 3vh);
                        width: 100%;

                        background-color: rgb(34, 75, 165);
                    }

                    div.video-title {
                        line-height: 1vh;
                        height: 2vh;
                        text-align: center;

                        // font-weight: bold;
                        font-size: calc(0.3vw + 0.5vh);
                        color: #eef3ff;
                        transform: translateY(-100%);

                        &.warn {
                            background-color: red;
                            color: #eef3ff;
                        }
                    }

                    div.video-focus {
                        position: relative;
                        line-height: 3vh;
                        height: 3vh;
                        text-align: center;
                        width: fit-content;
                        margin-top: 0.5vh;
                        padding-left: 0.5vw;
                        padding-right: 0.5vw;
                        left: 50%;
                        transform: translateX(-50%);
                        border-radius: 4px;

                        font-weight: bold;
                        font-size: calc(0.4vw + 0.6vh);
                        color: #eef3ff;
                        background-color: #487fff;

                        &:hover {
                            background-color: #0037ad;
                            color: #9df8ff;
                            cursor: pointer;
                        }
                    }

                    div.small-pic {
                        width: 6.5vw;
                        height: 6.5vh;

                        position: relative;
                        top: -32vh;
                        right: -17.8vw;
                        background-color: #ffffff8e;

                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: 50% 50%;

                        &[id='0'] {
                            background-image: url('/mzsBase-monitor3.png');
                        }

                        &[id='1'] {
                            background-image: url('/mzsBase-monitor2.png');
                        }

                        &[id='2'] {
                            background-image: url('/mzsBase-monitor1.png');
                        }
                    }

                    &[id='0'] {
                        width: 100%;
                        height: 32vh;
                        order: 1;

                        div.video-title {
                            font-size: calc(0.6vw + 0.6vh);
                            line-height: 3vh;
                            height: 3vh;
                            font-weight: bold;
                            transform: translateY(0);
                        }
                    }

                    &[id='1'] {
                        order: 2;
                        transform: translateY(-100%);

                        &:hover {
                            div.video-title {
                                color: #9df8ff;
                                font-weight: bold;
                                cursor: pointer;
                            }
                        }

                        div.video-content {
                            opacity: 0.85;
                        }
                    }

                    &[id='2'] {
                        order: 3;
                        transform: translateY(-100%);

                        &:hover {
                            div.video-title {
                                color: #9df8ff;
                                font-weight: bold;
                                cursor: pointer;
                            }
                        }

                        div.video-content {
                            opacity: 0.85;
                        }
                    }
                }
            }

            div.video-control-opener {
                position: relative;
                width: 2.4vh;
                line-height: 2.4vh;
                color: #e3fdff;
                height: 19vh;
                left: 24.8vw;
                top: -30.4vh;
                justify-content: center;
                border-left: 2px solid blue;
                writing-mode: vertical-lr;

                // padding: 0 0.5vw 0 0.5vw;

                font-size: calc(0.5vw + 0.6vh);

                display: flex;

                div.control-open-text {
                    background-color: #001885;

                    &:hover {
                        cursor: pointer;
                        font-weight: bold;
                        color: #9df8ff;
                    }
                }

                div.tri {
                    width: 2.4vh;
                    height: 2.4vh;
                    background: linear-gradient(-135deg,
                            transparent 49%,
                            #001885 51%,
                            #001885 100%);

                    &.right {
                        background: linear-gradient(-45deg,
                                transparent 49%,
                                #001885 51%,
                                #001885 100%);
                    }
                }

                &.open {
                    border-left: none;
                    border-right: 2px solid blue;

                    div.tri {
                        background: linear-gradient(135deg,
                                transparent 49%,
                                #001885 51%,
                                #001885 100%);

                        &.right {
                            background: linear-gradient(45deg,
                                    transparent 49%,
                                    #001885 51%,
                                    #001885 100%);
                        }
                    }

                    border-top: none;
                }
            }

            div.video-controller-container {
                position: absolute;
                left: calc(24.8vw + 2.4vh);
                top: 34vh;

                width: 19vw;
                height: 22vh;
                display: flex;
                flex-flow: column wrap;
                justify-content: center;
                align-content: flex-start;
                column-gap: 1vw;

                background-color: #a4cbff94;
                border: 2px solid #001885;
                border-radius: 4px;

                .crc {
                    position: relative;
                    list-style-type: none;
                    margin: 0;

                    // transform: translate(
                    //     -4px,
                    //     -50%
                    // ); //2px border offset fix
                    &-directions {
                        position: relative;
                        display: block;
                        height: $controlSize;
                        width: $controlSize;
                        background: white;
                        // top: 50%;
                        // left: 50%;
                        // transform: translate(-50%, -50%);
                        z-index: 2;
                        border-radius: 50%;
                        box-shadow: 12px 8px 20px -10px rgba(0, 0, 0, 0.4);

                        &::before {
                            position: relative;
                            content: '';
                            display: block;
                            height: $controlSize;
                            width: $controlSize;
                            border-radius: 50%;
                            background: linear-gradient(45deg,
                                    transparent 49%,
                                    $splitColor 51%,
                                    $splitColor 51%,
                                    transparent 51%);
                            z-index: 2;
                        }

                        &::after {
                            position: relative;
                            content: '';
                            display: block;
                            height: $controlSize;
                            width: $controlSize;
                            transform: translateY(-$controlSize);
                            border-radius: 50%;
                            background: linear-gradient(135deg,
                                    transparent 49%,
                                    $splitColor 51%,
                                    $splitColor 51%,
                                    transparent 51%);
                            z-index: 2;
                        }

                        &-up {
                            position: absolute;
                            top: 1vh;
                            left: 50%;
                            transform: translateX(-50%);
                            cursor: pointer;
                            transition: all 250ms ease-in-out;

                            svg {
                                &:hover {
                                    :deep(path) {
                                        fill: $hoverColor !important;
                                    }
                                }
                            }

                            z-index: 4;
                        }

                        &-down {
                            position: absolute;
                            bottom: 1vh;
                            left: 50%;
                            transform: translateX(-50%);
                            cursor: pointer;
                            transition: all 250ms ease-in-out;

                            svg {
                                &:hover {
                                    :deep(path) {
                                        fill: $hoverColor !important;
                                    }
                                }
                            }

                            z-index: 4;
                        }

                        &-left {
                            position: absolute;
                            top: 50%;
                            left: 1vh;
                            transform: translateY(-50%);
                            cursor: pointer;
                            transition: all 250ms ease-in-out;

                            svg {
                                &:hover {
                                    :deep(path) {
                                        fill: $hoverColor !important;
                                    }
                                }
                            }

                            z-index: 4;
                        }

                        &-right {
                            position: absolute;
                            top: 50%;
                            right: 1vh;
                            transform: translateY(-50%);
                            cursor: pointer;
                            transition: all 250ms ease-in-out;

                            svg {
                                &:hover {
                                    :deep(path) {
                                        fill: $hoverColor !important;
                                    }
                                }
                            }

                            z-index: 4;
                        }
                    }
                }

                div.function-button-group {
                    width: calc(18vw - $controlSize);
                    height: 21vh;

                    // background-color: #0059fd;

                    display: flex;
                    flex-flow: column wrap;
                    column-gap: 0.5vw;
                    border-radius: 4px;
                    overflow: hidden;
                    padding: 0.2vh;

                    div.button-title {
                        width: 40%;
                        height: 2vh;
                        line-height: 2vh;
                        text-align: center;
                        font-size: calc(0.35vw + 0.6vh);
                        font-weight: bold;
                        color: #eef3ff;
                        border-top-right-radius: 4px;
                        border-top-left-radius: 4px;
                        border: #000985 solid 2px;

                        background-color: #0062e2;
                    }

                    div.button-column {
                        width: 40%;
                        height: 18vh;
                        border-bottom-right-radius: 4px;
                        background-color: #b3daff;
                        display: flex;
                        flex-flow: column nowrap;
                        justify-content: space-around;
                        align-items: center;
                        border-bottom-left-radius: 4px;
                        border-bottom: #001885 solid 2px;
                        border-right: #001885 solid 2px;
                        border-left: #001885 solid 2px;

                        div.button-item {
                            width: 80%;
                            height: 2vh;
                            line-height: 2vh;
                            text-align: center;
                            border-radius: 4px;
                            color: #eef3ff;
                            // font-weight: bold;
                            font-size: calc(0.35vw + 0.6vh);

                            background-color: #001885;

                            &:hover {
                                cursor: pointer;
                                font-weight: bold;
                                color: #9df8ff;
                            }

                            &.warn {
                                color: #eef3ff;
                                background-color: red;
                                animation: breathing 1s linear infinite;
                                font-weight: bold;

                                @keyframes breathing {
                                    0% {
                                        transform: scale(1);
                                    }

                                    50% {
                                        transform: scale(0.95);
                                    }

                                    100% {
                                        transform: scale(1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // border-radius: 12px;
}

:deep(.dv-border-svg-container use) {
    stroke-width: 4;
}

:deep(.dv-border-box-8) {
    background-color: rgba(156, 195, 255, 0.4);
    backdrop-filter: blur(8px);
}

:deep(.dv-border-box-12) {
    background-color: rgba(156, 195, 255, 0.4);
    backdrop-filter: blur(8px);
    border-radius: 6px;
}

:deep(.section-name-text) {
    font-weight: bold;
    font-size: calc(0.4vw + 0.4vh);
}

:deep(.section-class-text) {
    font-size: calc(0.4vw + 0.4vh);

    &[id='warning'] {
        color: $shadowRed;
    }

    &[id='pre-warning'] {
        color: $shadowOrange;
    }

    &[id='attention'] {
        color: $shadowBlue;
    }

    &[id='normal'] {
        color: $shadowGreen;
    }

    &[id='all'] {
        color: #3d00ad;
    }
}
</style>
