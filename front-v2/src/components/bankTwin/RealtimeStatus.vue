<template>
    <div class="device-info-container" :class="{ 'hide-left': props.domHide }">
        <dv-border-box12 :dur="5" :color="['rgb(28, 75, 187)', 'rgb(140, 255, 255)']" :key="componentKey">
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
                                <el-select v-model="selectedDevice" placeholder="选择具体设备"
                                    style="width: 4.5vw; height: 2.4vh;  font-size: 0.1vw + 0.1vh;"
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
                                        deviceTypeTimeMap[selectedDeviceType].freq +
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
                        </div>
                        <div>
                            <div class="goBack">
                                <el-button @click="goBack" v-if="showButton">返回原表</el-button>
                            </div>
                            <div class="infoButton">
                                <el-popover placement="top-start" :width="300" trigger="click"
                                    :popper-class="'device-indicator-popover'">
                                    <template #reference>
                                        <el-button type="primary" plain :icon="InfoFilled" circle />
                                    </template>
                                    <div class="device-indicator-info">
                                        <div class="device-indicator-info-title">{{ selectedDeviceType }}</div>
                                        <el-scrollbar :style="{ height: '26vh' }">
                                            <div class="device-indicator-info-content">
                                                <div class="indicator-info"
                                                    v-for="(item, idx) in indicatorDescriptionMap[shitMap[selectedDeviceType]]">
                                                    <div class="indicator-name">➤ {{ item.name }}</div>
                                                    <div class="indicator-desc">{{ item.desc }}</div>
                                                </div>
                                            </div>
                                        </el-scrollbar>

                                    </div>
                                </el-popover>
                            </div>
                            <div class="device-chart-dom" ref="chartDom" v-loading="chartDataLoading"
                                @dblclick="navToMoreData"></div>
                        </div>
                        <!-- <div style="z-index: 9999;position: absolute;top:10px;right: 200px;background-color: red">
                            <el-button @click="goBack">返回原始图表</el-button>
                        </div>

                        <div class="device-chart-dom" ref="chartDom" v-loading="chartDataLoading"
                            @dblclick="navToMoreData">

                        </div> -->
                    </div>

                    <div v-show="props.showVedio">
                        <div class="video-content-container">
                            <div class="video-box" v-for="(item, index) in videoList" :key="index" :id="item.order">
                                <div class="video-content">
                                    <div :id="item.name" style="width:100%; height:100%" @dblclick="fullScreen(index)"></div>
                                    <!-- <iframe :src="getIframeUrl(item)" width="100%" height="100%" :id="item.name"
                                        :key="item.key" allowfullscreen v-if="showVideo === true">
                                    </iframe> -->
                                    <!-- <div class="video-img" v-show="!item.playing" 
                                        :style="{ backgroundImage: `url('${item.screenshotImg}')` }"></div> -->
                                </div>
                                <div class="video-title" :class="videoList[index].warn ? 'warn' : 'normal'
                                    " @click="focusOn(index)">
                                    {{ item.name }}
                                </div>
                                <div class="small-pic" v-if="item.order == 0" :id="'sp' + index"></div>
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
            </div>
        </dv-border-box12>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, onBeforeMount, computed, reactive, createApp } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
// import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import axios from 'axios'
import * as echarts from 'echarts'
import BackEndRequest from '../../api/backend'
import dayjs from 'dayjs'
import {
    genGnssOptionOfDevice,
    genStressOptionOfDevice,
    genIncinometerOptionOfDevice,
    genManometerOptionOfDevice,
    genFiberOptionOfDevice,
    toggleOptionDataMode,
} from './dataChartSettings'
import router from '../../router'
import { useWarnInfoStore } from '../../store/mapStore'
import DeviceHelper from './deviceHelper'
import { useBankNameStore } from '../../store/bankNameStore'
import { InfoFilled } from '@element-plus/icons-vue'
import EZUIKit from 'ezuikit-js'

const route = useRoute()
const props = defineProps({
    domHide: {
        type: Boolean,
        default: false,
    },
    deviceType: {
        type: String,
        default: '位移测量站',
    },
    showVedio: {
        type: Boolean,
        default: false
    }
})

const token = ref(
    'empty token',
)

const chartDom = ref()
const chartDataLoading = ref(true)
const deviceStatusLoading = ref(true)
const updateTimeLoading = ref(false)
const videoControlOpen = ref(false)
const showButton = ref(false)

const deviceStatusDataList = ref([
    { name: '位移测量站', count: 10, time: '2024', freq: '10分钟' },
    { name: '应力桩', count: 7, time: '2024', freq: '1分钟' },
    { name: '孔隙水压力计', count: 9, time: '2024', freq: '1小时' },
    { name: '测斜仪', count: 9, time: '2024', freq: '1小时' },
    // { name: '分布式光纤', count: 1, time: '2024', freq: '1小时' },
    // { name: '视频监控', count: 3, time: '2024', freq: '实时' },
])

const warnDeviceCount = ref([0, 0, 0, 0, 0, '-'])

const domHide = ref(true)
const deviceUpdateTime = ref('2024-06-15 14:00:00')

const shitMap = {
    位移测量站: "GNSS",
    应力桩: "STRESS",
    孔隙水压力计: "MENOMETER",
    测斜仪: "INCLINE",
    视频监控: "VIDEO",
    分布式光纤: "fiber",
}

const monitorInfo = ref({})


const deviceTypeNameMap = {
    位移测量站: 'gnss',
    测斜仪: 'inclinometer',
    孔隙水压力计: 'manometer',
    应力桩: 'stress',
    // 分布式光纤: 'fiber',
}

const deviceTypeErrorMap = {
    位移测量站: 5,
    测斜仪: 3,
    孔隙水压力计: 0.2,
    应力桩: 40,
    // 分布式光纤: 1,
}

// const deviceIdMap = {
//     'CL-01': 'MZS120.51749289_32.04059243_1',
//     'CL-02': 'MZS120.51977143_32.04001152_1',
//     'CL-03': 'MZS120.52557975_32.03825056_1',
//     'CL-04': 'MZS120.52660704_32.03676583_1',
//     'CL-05': 'MZS120.53334877_32.03227055_1',
//     'CL-06': 'MZS120.54599538_32.02837993_1',
//     'CL-07': 'MZS120.55327892_32.02707923_1',
//     'CL-08': 'MZS120.55649757_32.02592404_1',
//     'CL-09': 'MZS120.56334257_32.02298144_1',
//     'CL-10': 'MZS120.56944728_32.02070961_1',
//     'KX-01': 'MZS120.51726088_32.04054582_3',
//     'KX-02': 'MZS120.51738292_32.04054923_3',
//     'KX-03': 'MZS120.51749021_32.04053105_3',
//     'KX-04': 'MZS120.51957026_32.04008655_3',
//     'KX-05': 'MZS120.51967889_32.04004108_3',
//     'KX-06': 'MZS120.51986665_32.03998992_3',
//     'KX-07': 'MZS120.52557975_32.03825056_3',
//     'KX-08': 'MZS120.52565217_32.03813574_3',
//     'KX-09': 'MZS120.52566826_32.03799363_3',
//     'YL-01': 'MZS120.513203_32.042733_2',
//     'YL-02': 'MZS120.515433_32.04231_2',
//     'YL-03': 'MZS120.521221_32.040331_2',
//     'YL-04': 'MZS120.529078_32.034385_2',
//     'YL-05': 'MZS120.541648_32.030524_2',
//     'YL-06': 'MZS120.548925_32.029361_2',
//     'YL-07': 'MZS120.552209_32.028149_2',
//     'CX-01': 'MZS120.51967889_32.04004108_4',
//     'CX-02': 'MZS120.51986665_32.03998992_4',
//     'CX-03': 'MZS120.52557975_32.03825056_4',
//     'CX-04': 'MZS120.52565217_32.03813574_4',
//     'CX-05': 'MZS120.52566826_32.03799363_4',
//     'CX-06': 'MZS120.51726088_32.04054582_4',
//     'CX-07': 'MZS120.51738292_32.04054923_4',
//     'CX-08': 'MZS120.51749021_32.04053105_4',
//     'CX-09': 'MZS120.51957026_32.04008655_4',
//     // 'GX-01': 'MZS120_32',
// }

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
    // 分布式光纤: {
    //     timeUnit: 'hour',
    //     timeCount: 3,
    //     realTimeCount: 6,
    //     realTimeUnit: 'hour',
    //     freq: '1小时',
    // },
}

const selectedDeviceType = ref('位移测量站')

const deviceList = ref([])
const selectedDevice = ref('')

const selectedDataMode = ref('实时')

const sectionClassColorMap = ref({
    警告: 'warning',
    预警: 'pre-warning',
    关注: 'attention',
    普通: 'normal',
    统计: 'all',
})

const deviceTypeList = ref(['位移测量站', '应力桩', '孔隙水压力计', '测斜仪'])
// const deviceTypeList = ref(['位移测量站', '应力桩', '孔隙水压力计', '测斜仪', '分布式光纤'])

const getIframeUrl = (item) => {
    return item.videoUrl + token.value
}
/// 添加Key属性，强制渲染
const videoList = ref([
    {
        name: '民主沙海事码头监控',
        position: '32.0316674, 120.5402574',
        deviceId: 'FB5033035',
        // videoUrl: `https://open.ys7.com/ezopen`,
        // videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=`,
        videoUrl: 'ezopen://open.ys7.com/FB5033035/1.live',
        order: 0,
        presetPt: [
            { name: '上游岸段', status: 'normal' },
            { name: '下游岸段', status: 'normal' },
            { name: 'CL-06', status: 'normal' },
            { name: '海事码头', status: 'normal' },
        ],
        warn: false,
        key: 0,
        // show: true,
        playing: true,
        screenshotImg: null,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        position: '32.0381061, 120.5263473',
        deviceId: 'FB5033037',
        // videoUrl: `https://open.ys7.com/ezopen`,
        // videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.live&autoplay=1&accessToken=`,
        videoUrl: 'ezopen://open.ys7.com/FB5033037/1.live',
        order: 1,
        presetPt: [
            { name: '下游岸段', status: 'normal' },
            { name: '上游岸段', status: 'normal' },
            { name: 'CL-04', status: 'normal' },
            { name: '小港池', status: 'normal' },
        ],
        warn: false,
        key: 1,
        // show: true,
        playing: true,
        screenshotImg: null
    },
    {
        name: '民主沙上游围堤监控',
        position: '32.0432963, 120.5122242',
        deviceId: 'FB5033036',
        // videoUrl: `https://open.ys7.com/ezopen`,
        // videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.live&autoplay=1&accessToken=`,
        videoUrl: 'ezopen://open.ys7.com/FB5033036/1.live',
        order: 2,
        presetPt: [
            { name: '下游岸段', status: 'normal' },
            { name: '上游岸段', status: 'normal' },
            { name: 'CL-02', status: 'normal' },
            { name: 'JZ-01', status: 'normal' },
        ],
        warn: false,
        key: 2,
        // show: true,
        playing: true,
        screenshotImg: null
    },
])
const uikitInstances = []
const userInteractInfo = reactive({
    lastInteractTime: dayjs(),
    refreshIframe: 1
})
const videoRef = ref();
const videoImgs64 = ref([])
window.addEventListener('mousemove', (e) => {
    // 用户交互，更新lastInteractTime
    userInteractInfo.lastInteractTime = dayjs()
    userInteractInfo.refreshIframe = 1
    videoList.value.forEach((item, index) => {
        if (!uikitInstances[index]) return
        if (item.playing) return
        item.playing = true
        const playPromise = uikitInstances[index].play();
        playPromise.then(() => {
            console.log("播放视频" + index)
        });
        // item.uikitInstance.play()
    })
})

const fullScreen = (index) => {
    uikitInstances[index].fullScreen()
}

const refreshInterval = setInterval(() => {
    // 检查上次交互和此次交互的分钟数
    let nowTime = dayjs()
    let diffTime = nowTime.diff(userInteractInfo.lastInteractTime, 'seconds')
    console.log(diffTime + 'seconds ' + '用户无操作')
    if (diffTime > 10) {
        videoList.value.forEach((item, index) => {
            if (!item.playing) return
            let uikitInstance = uikitInstances[index]
            if (!uikitInstance) return
            // const capturePicturePromise = uikitInstance.capturePicture();
            // capturePicturePromise.then((data) => {
            //     let base64Img = data.data.base64
            //     item.screenshotImg = base64Img
            //     const stopPromise = uikitInstance.stop();
            //     stopPromise.then(() => {
            //         item.playing = false
            //     });           
            // }).catch((err)=> {
            //     console.error('capture failed', err)
            // });
            const pausePromise = uikitInstance.pause();
            pausePromise.then(() => {
                console.log("暂停视频" + index)
                item.playing = false
            }).catch((err)=>{
                console.error("暂停失败", err)
            }); 
        })

    }
}, 1000 * 5 * 1)

const refreshIframe = (val) => {
    console.log('refresh iframe ! ', val)
    if (val) {  // show iframe
        token.value = validToken
        videoList.value.forEach((item) => {
            item.key += 1
        })
    } else { // hide iframe
        token.value = ''
        videoList.value.forEach((item) => {
            item.key += 1
        })
    }
}

watch(() => userInteractInfo.refreshIframe, (val) => {
    refreshIframe(val)
})


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
    if (uikitInstances.length !== 3) return;
    [
        videoList.value[curBigVideoIndex.value].order,
        videoList.value[index].order,
    ] = [
            videoList.value[index].order,
            videoList.value[curBigVideoIndex.value].order,
        ]
    curBigVideoIndex.value = index

    reSizeVideos()
}



// 调整播放器尺寸
const reSizeVideos = () => {
    videoList.value.forEach((item, index) => {
        const videoBox = document.getElementById(item.order);
        const videoDom = videoBox.querySelectorAll('.video-content')[0]
        if (videoDom) {
            const width = videoDom.offsetWidth;
            const height = videoDom.offsetHeight;
            uikitInstances[index].reSize(width, height)
        }
    })
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
let fiberOption = {}
let echartIns = null
let deviceOptionMap = {
    位移测量站: {},
    测斜仪: {},
    孔隙水压力计: {},
    应力桩: {},
    // 分布式光纤: {},
}
let deviceGenOptionMap = {
    位移测量站: genGnssOptionOfDevice,
    测斜仪: genIncinometerOptionOfDevice,
    孔隙水压力计: genManometerOptionOfDevice,
    应力桩: genStressOptionOfDevice,
    // 分布式光纤: genFiberOptionOfDevice,
}

const changeDeviceType = (deviceName) => {
    selectedDeviceType.value = deviceName
    deviceTypeSelectChange(deviceName)
}

const deviceTypeSelectChange = async (deviceType) => {
    let tp = shitMap[deviceType]
    deviceList.value = monitorInfo.value[tp] ? monitorInfo.value[tp]['DeviceList'] : []
    selectedDevice.value = deviceList.value[0]
    echartIns.clear()
    chartDataLoading.value = true
    updateTimeLoading.value = true
    await deviceSelectChange(selectedDevice.value)
    updateTimeLoading.value = false
    chartDataLoading.value = false
}

let curDeviceData = null
let realTimeData = null
let curUpdateInterval = null

const toggleChartOptionFromData = (deviceData) => {
    deviceOptionMap[selectedDeviceType.value] = deviceGenOptionMap[
        selectedDeviceType.value
    ](
        deviceData,
        deviceTypeErrorMap[selectedDeviceType.value],
        selectedDataMode.value,
    )
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const fiberNewOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['微应变'],
        top: '3%',
        right: '20%',
    },
    grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        top: '10%',
        containLabel: true
    },
    xAxis: {
        name: '距离(m)',
        type: 'category',
        boundaryGap: false,
        data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
            '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
            '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100',
            '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117',
            '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134',
            '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151',
            '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168',
            '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185',
            '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202',
            '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219',
            '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236',
            '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248', '249', '250', '251', '252', '253',
            '254', '255', '256', '257', '258', '259', '260', '261', '262', '263', '264', '265', '266', '267', '268', '269', '270',
            '271', '272', '273', '274', '275', '276', '277', '278', '279', '280', '281', '282', '283', '284', '285', '286', '287',
            '288', '289', '290', '291', '292', '293', '294', '295', '296', '297', '298', '299', '300', '301', '302', '303', '304',
            '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321',
            '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335', '336', '337', '338',
            '339', '340', '341', '342', '343', '344', '345', '346', '347', '348', '349', '350', '351', '352', '353', '354', '355',
            '356', '357', '358', '359', '360', '361', '362', '363', '364', '365', '366', '367', '368', '369', '370', '371', '372',
            '373', '374', '375', '376', '377', '378', '379', '380', '381', '382', '383', '384', '385', '386', '387', '388', '389',
            '390', '391', '392', '393', '394', '395', '396', '397', '398', '399', '400', '401', '402', '403', '404', '405', '406',
            '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423',
            '424', '425', '426', '427', '428', '429', '430', '431', '432', '433', '434', '435', '436', '437', '438', '439', '440',
            '441', '442', '443', '444', '445', '446', '447', '448', '449', '450', '451', '452', '453', '454', '455', '456', '457',
            '458', '459', '460', '461', '462', '463', '464', '465', '466', '467', '468', '469', '470', '471', '472', '473', '474',
            '475', '476', '477', '478', '479', '480', '481', '482', '483', '484', '485', '486', '487', '488', '489', '490', '491',
            '492', '493', '494', '495', '496', '497', '498', '499', '500', '501', '502', '503', '504', '505', '506', '507', '508',
            '509', '510', '511', '512', '513', '514', '515', '516', '517', '518', '519', '520', '521', '522', '523', '524', '525',
            '526', '527', '528', '529', '530', '531', '532', '533', '534', '535', '536', '537', '538', '539', '540', '541', '542',
            '543', '544', '545', '546', '547', '548', '549', '550', '551', '552', '553', '554', '555', '556', '557', '558', '559',
            '560', '561', '562', '563', '564', '565', '566', '567', '568', '569', '570', '571', '572', '573', '574', '575', '576',
            '577', '578', '579', '580', '581', '582', '583', '584', '585', '586', '587', '588', '589', '590', '591', '592', '593',
            '594', '595', '596', '597', '598', '599', '600', '601', '602', '603', '604', '605', '606', '607', '608', '609', '610',
            '611', '612', '613', '614', '615', '616', '617', '618', '619', '620', '621', '622', '623', '624', '625', '626', '627',
            '628', '629', '630', '631', '632', '633', '634', '635', '636', '637', '638', '639', '640', '641', '642', '643', '644',
            '645', '646', '647', '648', '649', '650', '651', '652', '653', '654', '655', '656', '657', '658', '659', '660', '661',
            '662', '663', '664', '665', '666', '667', '668', '669', '670', '671', '672', '673', '674'
            , '675', '676', '677', '678', '679', '680', '681', '682', '683', '684', '685', '686', '687', '688', '689', '690', '691',
            '692', '693', '694', '695', '696', '697', '698', '699', '700', '701', '702', '703', '704', '705', '706', '707', '708',
            '709', '710', '711', '712', '713', '714', '715', '716', '717', '718', '719',
            '720', '721', '722', '723', '724', '725', '726', '727', '728', '729', '730', '731', '732', '733', '734', '735', '736',
            '737', '738', '739', '740', '741', '742', '743', '744', '745', '746', '747', '748', '749', '750', '751', '752', '753',
            '754', '755', '756', '757', '758', '759', '760', '761', '762', '763', '764', '765', '766',
            '767', '768', '769', '770', '771', '772', '773', '774', '775', '776', '777', '778', '779', '780', '781', '782', '783',
            '784', '785', '786', '787', '788', '789', '790', '791', '792', '793', '794', '795', '796', '797', '798', '799', '800',
            '801', '802', '803', '804', '805', '806', '807', '808', '809', '810', '811', '812', '813',
            '814', '815', '816', '817', '818', '819', '820', '821', '822', '823', '824', '825', '826', '827', '828', '829', '830',
            '831', '832', '833', '834', '835', '836', '837', '838', '839', '840', '841', '842', '843', '844', '845', '846', '847',
            '848', '849', '850', '851', '852', '853', '854', '855', '856', '857', '858', '859', '860', '861', '862', '863', '864',
            '865', '866', '867', '868', '869', '870', '871', '872', '873', '874', '875',
            '876', '877', '878', '879', '880', '881', '882', '883', '884', '885', '886', '887', '888', '889', '890', '891', '892',
            '893', '894', '895', '896', '897', '898', '899', '900', '901', '902', '903', '904', '905', '906', '907', '908', '909',
            '910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '920', '921', '922',
            '923', '924', '925', '926', '927', '928', '929', '930', '931', '932', '933', '934', '935', '936', '937', '938', '939',
            '940', '941', '942', '943', '944', '945', '946', '947', '948', '949', '950', '951', '952', '953', '954', '955', '956',
            '957', '958', '959', '960', '961', '962', '963', '964', '965', '966', '967', '968', '969', '970', '971', '972', '973',
            '974', '975', '976', '977', '978', '979', '980', '981', '982', '983', '984', '985', '986', '987', '988', '989', '990',
            '991', '992', '993', '994', '995', '996', '997', '998', '999', '1000', '1001', '1002', '1003',
            '1004', '1005', '1006', '1007', '1008', '1009', '1010', '1011', '1012', '1013', '1014', '1015', '1016', '1017', '1018',
            '1019', '1020', '1021', '1022', '1023', '1024', '1025', '1026', '1027', '1028', '1029', '1030', '1031', '1032',
            '1033', '1034', '1035', '1036', '1037', '1038', '1039', '1040', '1041', '1042', '1043', '1044', '1045', '1046', '1047',
            '1048', '1049', '1050']
    },
    yAxis: {
        name: '微应变',
        type: 'value',
        scale: true,
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    backgroundColor: 'rgba(255,255,255,1)',
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100,
        },
        {
            type: 'slider',
            start: 0,
            end: 100,
        },
    ],
    visualMap: [
        {
            show: false,
            top: '4%',
            right: '2%',
            itemHeight: '20',
            itemWidth: '28',
            seriesIndex: 2,
            pieces: [
                {
                    gt: 0,
                    lte: 35,
                    color: '#45BF55',
                },
                {
                    gt: 35,
                    lte: 50,
                    color: '#FF8E00',
                },
                {
                    gt: 50,
                    color: '#FD0100',
                },
            ],
            outOfRange: {
                color: '#999',
            },
            formatter: '{value}~{value2}',
            orient: 'horizontal',
            align: 'left',
            // textGap: 20,
            itemGap: 20,
            textStyle: {
                fontFamily: 'Times',
                fontWeight: 'bold',
            },
        },
        {
            show: false,
            seriesIndex: 1,
            pieces: [
                {
                    gt: 35,
                    lte: 50,
                    color: '#FF8E00',
                },
                {
                    gt: 50,
                    color: '#FD0100',
                },
            ],
            outOfRange: {
                color: 'rgb(163,163,163)',
            },
        },
    ],
    axisLabel: {
        formatter: function (value) {
            // 根据需要更改格式化函数
            return value; // 移除换行
        }
    },
    series: [
        {
            name: '微应变',
            data: [2, 2, 1.46, 1.86, 1.6, 1.2, 1, 1.34, 1, 2, 2.34, 2.2, 1.94, 1.94, 0.4, -0.66, -0.86, -0.2, -0.66, 0.2, -0.66, -0.46, -0.34, 0.74, 2, 2.06, 2.66, 1.6, 0.8, 0.6, -0.54, -1.14, -1.46, -1.34, 0, 0.14, -0.06, -0.8,
                -1.26, -2, -0.94, -0.2, 0.4, -0.94, 0.54, 0.6, 2.26, 3.2, 3.26, 2.14, 2.46, 2.74, 4.06, 3.46, 3.8, 4.2, 4.26, 3.86, 4.14, 5.2, 3.6, 4.4, 4, 3.06, 4.06, 4.2, 4, 4.66, 5, 4.34, 4.8, 4.66, 4.4, 4.26, 4.54, 3.8, 3.14, 2.86,
                3.66, 3.2, 4.06, 3.8, 3.4, 2.66, 3.46, 3.14, 3.54, 2.66, 2.54, 3.54, 3.46, 3.34, 3.66, 3.86, 3.8, 4.26, 4.54, 4.8, 3.6, 3.14, 3.34, 3.06, 3.8, 3.34, 3.14, 2.86, 2.34, 2.86, 3, 3.74, 4.06, 4.6, 5.4, 5.2, 5, 4.86, 4.14,
                3.94, 3.46, 3, 3.86, 3.8, 3.26, 3.14, 3.74, 3.86, 3.6, 4.4, 4.86, 5.34, 4.94, 4.26, 4.26, 4.06, 4, 3.66, 3, 2.86, 2.8, 3.46, 3.74, 4.6, 3.14, 3.54, 3.86, 3.6, 3.4, 2.86, 2.94, 3.94, 4.54, 4.94, 4.74, 4.06, 5, 4.14, 3.8,
                3.86, 2.46, 2.26, 2.26, 2.54, 3.26, 3.26, 3.06, 2.94, 2.74, 2.4, 2.14, 2.34, 1.34, 1.14, 1.86, 1.34, 1.54, 2.86, 3.54, 4, 2.2, 1.54, 1.6, 2.8, 3.66, 4.54, 3.74, 3.06, 2.46, 2.74, 2.2, 2.14, 1.94, 2.4, 2.06, 2.14, 1.66,
                1.54, 1.26, 1.66, 1.86, 2.4, 2.46, 1.94, 1.66, 2.74, 1.54, 1.46, 1.8, 1.94, 1.74, 1.54, 1.54, 1.14, 1.2, 1.14, 2.06, 1.8, 1.66, 2.54, 2.8, 2.46, 2.34, 1.54, 1.66, 2.34, 2.66, 2.26, 2.06, 2.26, 2.06, 2.14, 2.46, 2.8,
                1.74, 1.26, 0.6, 1.54, 2.06, 1.8, 2.34, 1.94, 2.66, 1.86, 2.94, 4, 3.74, 3.66, 3.94, 4.4, 4, 2.4, 3.06, 3.94, 5.06, 4.74, 4.4, 3.86, 3, 4.06, 4, 3.94, 4.14, 5, 5.26, 6.34, 5.66, 4.66, 4.46, 4.2, 4.46, 4.46, 4.66, 2.66,
                5.46, 4.66, 4.66, 5.46, 5.54, 4.94, 4.34, 4.06, 5.46, 5.94, 6.46, 6.06, 5.8, 6, 5.34, 5, 4.4, 4.94, 5.26, 5.54, 6.46, 6, 5.46, 4.8, 4.34, 4.34, 4.86, 6.14, 5.26, 4.54, 4.26, 4.14, 4.26, 5.2, 4.6, 4.6, 3.86, 3.6, 3.54,
                4.54, 5.26, 4.8, 5, 5.06, 5.14, 4.66, 4.6, 3.46, 2.74, 2.66, 3.6, 5.4, 6, 4.06, 4.74, 4.94, 4.94, 4.8, 4.94, 5.06, 4.8, 4.66, 4.8, 4.94, 4.34, 4.26, 3.8, 4.26, 4.74, 4, 3.74, 3.66, 3.74, 3.46, 3.46, 3.54, 3.2, 3.4, 3.4,
                3.34, 3.34, 3.26, 3.34, 3.2, 3.34, 3.14, 3, 3.26, 3.54, 2.74, 1.54, 3.06, 3.6, 3.86, 4.74, 3.46, 2.6, 2.54, 2.54, 3.74, 5.06, 3.66, 2.74, 2.74, 3.14, 1.66, 2.54, 3.66, 3.34, 3.06, 4.66, 5, 5.66, 5.4, 5, 4.54, 4.74, 4.94,
                4.74, 3.86, 4.06, 4, 4.54, 2.8, 3.34, 3.06, 3.66, 3.94, 3.74, 3.8, 3.14, 3.4, 3, 2.34, 0.4, 0.74, 0.14, 0.2, 0.26, 0.34, 0.4, 0.74, 0.66, 0.94, 0.54, 0.4, -0.46, -1.46, -1.06, -0.94, -0.86, -1.26, -0.94, 0.14, 0.14,
                -0.34, -0.54, -0.86, -1.86, -0.66, -0.94, -0.2, -0.66, -1.34, -0.6, 1.2, 1.86, 1.6, 1.34, 0.94, 0.46, -0.26, 0.26, -0.06, 0.54, 0.6, 0.66, 0.46, 0.14, -0.26, -1.2, -1.54, -1.4, -1.54, -2, -1.4, -1.14, -1.26, -1.26,
                -0.8, -0.66, -0.6, -0.26, 0.2, 0.8, 0.46, 0.86, 0.54, -0.34, 0.2, 0.26, 1, 1.54, 2, 1.4, -0.74, -1.2, -1.6, -1.26, -1.54, -0.86, -0.54, 0.06, 0.2, -0.2, -0.34, 0.26, -0.54, -0.66, -0.86, 0.14, -0.06, 0.86, 1.2, 0.26,
                0.54, -0.6, -0.94, -1.74, -1.2, -0.86, -1.54, -1.8, -1.6, -1.6, -0.46, -1, -0.94, -2.2, -1.66, -1.2, -1.26, -0.4, -0.26, 0.14, 0.06, 0.14, -0.06, -0.66, -1.14, -1.94, -2.34, -2.66, -3, -2, -2.14, -2, -2.14, -4.06,
                -2.34, -2.4, -2.54, -2.6, -2.6, -2.4, -2.06, -1.26, -0.66, -1.26, -1.74, -2.8, -4.2, -4.4, -3.34, -2.54, -2.4, -4.2, -2.66, -2.14, -2, -2.4, -2.46, -3.94, -2.34, -3.34, -2.6, -4.14, -4.54, -4.14, -5.14, -4.14,
                -2.46, -2.74, -3.26, -3.34, -2.94, -3.4, -4.86, -4.86, -4.14, -3.8, -3.8, -2.6, -2, -1.86, -2.06, -3.4, -4.14, -2.66, -2.34, -3.14, -3.2, -3.66, -4.2, -4.54, -3.94, -2.54, -1.66, -1.6, -1.54, -2.14, -3.06, -4.74,
                -5.26, -4.6, -2.86, -2.8, -2.6, -1.94, -1.54, -1.66, -2.34, -3.54, -2.86, -4.14, -4, -4.8, -3.86, -2.2, -0.46, 0.14, -0.26, 1.6, 0.86, 0.86, 2.14, 1.74, 1.26, 0.26, 0.4, 0.46, 0.66, 0.74, 0.74, 1.54, 2.54, 2.66, 1.06,
                -3.86, -2.94, -3.94, -3.8, -3.26, -3, -3.14, -3.46, -3.66, -4.26, -3.34, -3.54, -3.94, -3.94, -3.86, -4.8, -4.94, -4.74, -4.8, -4.06, -4.14, -4.54, -2.94, -3.4, -3.2, -2.94, -2.54, -3, -2, -1.34, -1.06, -2, -2.46,
                -5.66, -5.26, -4, -2.8, -2.54, -2.06, -2.06, -2.34, -3.8, -5.6, -4.26, -3.34, -2.4, -2.26, -2.86, -4.26, -5.4, -5.66, -4.94, -3.4, -2.34, -3.2, -4.6, -5.4, -4.34, -3.6, -3.6, -3.8, -4.06, -6.14, -5.34, -4.94, -5.14,
                -1.06, -1.26, -0.6, -2.34, -2.26, -1.74, -2.2, -2, -2.74, -3.34, -3.26, -1.54, -1.6, -1.74, -1.2, 0.06, 0.74, 0.86, 0.46, 0.14, 0.54, 0.6, 0.4, 0.46, 0.54, 0.66, 0.86, 0.6, 0.54, 0.14, -0.54, -0.66, -0.46, -0.86,
                -0.06, -0.2, -1.8, -1.74, -1.26, -1.66, -1.94, -2.06, -1.86, -2.14, -0.26, -1.14, -0.46, -0.46, -0.06, -0.6, -0.6, -0.66, -0.94, -0.86, -0.4, 0.06, -0.14, -0.94, -2.4, -1.34, -1.06, -0.14, 1.14, 1.66, 2.46, 2.26,
                0.66, 0.66, 0.74, 0.74, 0.86, 1.8, 0.46, 0.66, 0.74, 0.8, 0.4, -0.06, -0.4, -0.14, 0.34, 0.46, 0.86, 0.74, 0.6, 2.06, 2.06, 2.2, 1.66, 1.94, 2.06, 2.14, 2.8, 3.86, 3.4, 2.94, 1.46, 1.34, 1.34, 1.14, 0.86, 0.94, 1.26,
                3.26, 3.46, 3.2, 2.94, 2.74, 2.86, 3, 2.66, 2, 2.46, 1.74, 2.26, 2.8, 3.4, 3.8, 3.74, 3.6, 3.46, 3.34, 2.74, 2.74, 3.2, 2.86, 3.34, 3.94, 4.06, 4.34, 4.86, 6.86, 6.6, 5.26, 3.74, 3.14, 3.34, 4.94, 4.74, 3.14, 2.26, 2.46,
                2.26, 2.54, 3.2, 3.54, 3.2, 2.46, 2.2, 2.2, 2.4, 2.54, 3.06, 3.14, 3.4, 3.6, 3.4, 2.8, 2.26, 2.26, 2.14, 2.26, 2.6, 2.66, 2.66, 1.8, 1.66, 2.66, 2.46, 2.14, 2.46, 3.54, 3.2, 3.06, 2.8, 2.4, 2.06, 2.54, 3.6, 3.94, 4.54,
                3.14, 2.26, 3.6, 3.6, 3.54, 4.26, 4.34, 3.26, 4.06, 3.86, 3.2, 3.26, 3.2, 3.26, 3.74, 4, 4.26, 4.14, 4.2, 3.6, 3.94, 4.66, 3.94, 3.2, 3.66, 4.06, 3.54, 2.06, 2.8, 2.66, 3.34, 3.4, 3.6, 3.4, 3.66, 3.14, 3.26, 3.2, 3.34,
                3.2, 3.46, 3.66, 3.14, 1.8, 2.4, 1.86, 2.2, 1.86, 1.8, 1.26, 1, 0.94, 0.34, -0.2, 0.14, 0.14, 0.2, 0.74, 0.26, 1.46, 2.14, 1.54, 0.54, -0.86, -0.54, -0.4, 0.26, 1.54, 0.74, 0.4, 1.14, 0.74, 1.8, 1.6, 0.74, 0.74, 1.14,
                1.34, 0.94, 0.4, -0.46, -0.94, 0.54, 0.4, 0.66, 0.6, 1.4, 0.8, 1.34, 1.86, 0.8, 2.34, 2.54, 2.26, 2.2, 2.2, 3.94, 3, 2.94, 3.14, 2.66, 0.14, -0.34, -0.54, -0.86, -1.86, 4.94, 4.34, 4.26, 3.8, 4.26, 4.74, 4, 3.74, 3.66,
                -1.26, -0.8, 0.26, 0.74, 0.06, 0.26, 0, -0.14, 0.2, 5.2, 3.6, 4.4, 4, 3.06, 4.06, 4.2, 4, 4.66, 5, 2.86, 3, 3.74, 4.06, 4.6, 5.4, -0.46, -1, -0.94, -2.2, -1.66, -1.2,
                1.34, 2.46, 2.14, 1.4, 0.46, 0.26, -0.26, 0.34, 0.54, 0.46, 2.54, 1.8, 2.86, 2.54, 0.8, -0.4, -0.26, -0.34, -0.26, 0.06, 1.06, 2, 1.6, 0.8, 0.06, -0.2, 0.2, 1.6, 0.4, 0.8, 1.2, 1.46, 0.86, 0, 0.2, 0.46, -0.2, -1, -1.6,
                0.34, 0.54, 0.74, 0.06, 0.06, -1.2, -1.66, -1.46, -0.8, -0.6, -0.86, -0.66, -0.34, -0.14, -0.8, -1.54, -2.14, -1.74, -1.14, -0.74, 2, 2, 1.46, 1.86, 1.6, 1.2, 1, 1.34, 1, 2, 2.34, 2.2, 1.94, 1.94, 0.4, -0.66, -0.86,
                -0.2, -0.66, 0.2, -0.66, -0.46, -1.66, 0.6, 0.74, 1.46, 0.54, 1.66, 1.86, 2.4, 2.46, 1.94, 1.66, 2.74, 1.54, 2.94, 4, 3.74, 3.66, 3.94, 4.4, 4, 4.06, 5, 4.14, 3.8, 3.86, 2.46, 5.26, 5.54, 6.46, 6, 5.46, 4.8,
                -0.34, 0.74, 2, 2.06, 2.66, 1.6, 0.8, 0.6, -0.54, -1.14, -1.46, -1.34, 0, 0.14, -0.06, -0.8, -1.26, -2, -0.94, -0.2, 0.4, -0.94, 0.54, 0.6, 2.26, 3.2, 3.26, 2.14, 2.46, 2.74, 4.06, 3.46, 3.8, 4.2, 4.26, 3.86, 4.14,
                4.34, 4.8, 4.66, 4.4, 4.26, 4.54, 3.8, 3.14, 2.86, 3.66, 3.2, 4.06, 3.8, 3.4, 2.66, 3.46, 3.14, 3.54, 2.66, 2.54, 3.54, 3.46, 3.34, 3.66, 3.86, 3.8, 4.26, 4.54, 4.8, 3.6, 3.14, 3.34, 3.06, 3.8, 3.34, 3.14, 2.86, 2.34,
                5.2, 5, 4.86, 4.14, 3.94, 3.46, 3, 3.86, 3.8, 3.26, 3.14, 3.74, 3.86, 3.6, 4.4, 4.86, 5.34, 4.94, 4.26, 4.26, 4.06, 4, 3.66, 3, 2.86, 2.8, 3.46, 3.74, 4.6, 3.14, 3.54, 3.86, 3.6, 3.4, 2.86, 2.94, 3.94, 4.54, 4.94, 4.74,
                2.26, 2.26, 2.54, 3.26, 3.26, 3.06, 2.94, 2.74, 2.4, 2.14, 2.34, 1.34, 1.14, 1.86, 1.34, 1.54, 2.86, 3.54, 4, 2.2, 1.54, 1.6, 2.8, 3.66, 4.54, 3.74, 3.06, 2.46, 2.74, 2.2, 2.14, 1.94, 2.4, 2.06, 2.14, 1.66, 1.54, 1.26,
                1.46, 1.8, 1.94, 1.74, 1.54, 1.54, 1.14, 1.2, 1.14, 2.06, 1.8, 1.66, 2.54, 2.8, 2.46, 2.34, 1.54, 1.66, 2.34, 2.66, 2.26, 2.06, 2.26, 2.06, 2.14, 2.46, 2.8, 1.74, 1.26, 0.6, 1.54, 2.06, 1.8, 2.34, 1.94, 2.66, 1.86,
                2.4, 3.06, 3.94, 5.06, 4.74, 4.4, 3.86, 3, 4.06, 4, 3.94, 4.14, 5, 5.26, 6.34, 5.66, 4.66, 4.46, 4.2, 4.46, 4.46, 4.66, 5.46, 4.66, 4.66, 5.46, 5.54, 4.94, 4.34, 4.06, 5.46, 5.94, 6.46, 6.06, 5.8, 6, 5.34, 5, 4.4, 4.94,
                4.34, 4.34, 4.86, 6.14, 5.26, 4.54, 4.26, 4.14, 4.26, 5.2, 4.6, 4.6, 3.86, 3.6, 3.54, 4.54, 5.26, 4.8, 5, 5.06, 5.14, 4.66, 4.6, 3.46, 2.74, 2.66, 3.6, 5.4, 6, 4.06, 4.74, 4.94, 4.94, 4.8, 4.94, 5.06, 4.8, 4.66, 4.8,
                3.74, 3.46, 3.46, 3.54, 3.2, 3.4, 3.4, 3.34, 3.34, 3.26, 3.34, 3.2, 3.34, 3.14, 3, 3.26, 3.54, 2.74, 1.54, 3.06, 3.6, 3.86, 4.74, 3.46, 2.6, 2.54, 2.54, 3.74, 5.06, 3.66, 2.74, 2.74, 3.14, 1.66, 2.54, 3.66, 3.34,
                3.06, 4.66, 5, 5.66, 5.4, 5, 4.54, 4.74, 0.2, 0.8, 0.46, 0.86, 0.54, -0.34, 0.2, 0.26, -2.54, -2.4, -4.2, -2.66, -2.14, -2, -2.4, 1.8, 1.6, 0.74, 0.74, 1.14, 1.34, -0.2, 0.2, 1.6, 0.4, 0.8,
                4.94, 4.74, 3.86, 4.06, 4, 4.54, 2.8, 3.34, 3.06, 3.66, 3.94, 3.74, 3.8, 3.14, 3.4, 3, 2.34, 0.4, 0.74, 0.14, 0.2, 0.26, 0.34, 0.4, 0.74, 0.66, 0.94, 0.54, 0.4, -0.46, -1.46, -1.06, -0.94, -0.86, -1.26, -0.94, 0.14,
                -0.66, -0.94, -0.2, -0.66, -1.34, -0.6, 1.2, 1.86, 1.6, 1.34, 0.94, 0.46, -0.26, 0.26, -0.06, 0.54, 0.6, 0.66, 0.46, 0.14, -0.26, -1.2, -1.54, -1.4, -1.54, -2, -1.4, -1.14, -1.26, -1.26, -0.8, -0.66, -0.6, -0.26,
                1, 1.54, 2, 1.4, -0.74, -1.2, -1.6, -1.26, -1.54, -0.86, -0.54, 0.06, 0.2, -0.2, -0.34, 0.26, -0.54, -0.66, -0.86, 0.14, -0.06, 0.86, 1.2, 0.26, 0.54, -0.6, -0.94, -1.74, -1.2, -0.86, -1.54, -1.8, -1.6, -1.6,
                -1.26, -0.4, -0.26, 0.14, 0.06, 0.14, -0.06, -0.66, -1.14, -1.94, -2.34, -2.66, -3, -2, -2.14, -2, -2.14, -2.34, -2.4, -2.54, -2.6, -2.6, -2.4, -2.06, -1.26, -0.66, -1.26, -1.74, -2.8, -4.2, -4.4, -3.34,
                -2.46, -3.94, -2.34, -3.34, -2.6, -4.14, -4.54, -4.14, -5.14, -4.14, -4.06, -3.66, -2.46, -2.74, -3.26, -3.34, -2.94, -3.4, -4.86, -4.86, -4.14, -3.8, -3.8, -2.6, -2, -1.86, -2.06, -3.4, -4.14, -2.66,
                -1.6, -1.54, -2.14, -3.06, -4.74, -5.26, -4.6, -3.86, -2.94, -3.94, -3.8, -3.26, -3, -3.14, -3.46, -3.66, -4.26, -3.34, -3.54, -3.94, -3.94, -3.86, -4.8, -4.94, -4.74, -4.8, -4.06, -4.14, -4.54, -2.94,
                -3.4, -3.2, -2.94, -2.54, -3, -2, -1.34, -5.4, -5.66, -4.94, -3.4, -2.34, -3.2, -4.6, -2.34, -3.14, -3.2, -3.66, -4.2, -4.54, -3.94, -2.54, -1.66, 2.06, 2.8, 2.66, 3.34, 3.4, 3.6, 0.74, 0.4, 1.14, 0.74,
                -1.06, -2, -2.46, -2.86, -2.8, -2.6, -1.94, -1.54, -1.66, -2.34, -3.54, -2.86, -4.14, -4, -4.8, -5.66, -5.26, -4, -2.8, -2.54, -2.06, -2.06, -2.34, -3.8, -5.6, -4.26, -3.34, -2.4, -2.26, -2.86, -4.26,
                -5.4, -4.34, -3.6, -3.6, -3.8, -4.06, -6.14, -5.34, -4.94, -5.14, -3.86, -2.2, -1.06, -1.26, -0.6, -2.34, -2.26, -1.74, -2.2, -2, -2.74, -3.34, -3.26, -1.54, -1.6, -1.74, -1.2, 0.06, 0.74, 0.86, 0.46, 0.14, 0.54, 0.6,
                -0.66, -0.46, -0.86, -0.46, 0.14, -0.26, -0.06, -0.2, -1.8, -1.74, -1.26, -1.66, -1.94, -2.06, -1.86, -2.14, -0.26, -1.14, -0.46, -0.46, -0.06, -0.6, -0.6, -0.66, -0.94, -0.86, -0.4, 0.06, -0.14, -0.94, -2.4, -1.34,
                2.46, 2.26, 1.6, 0.86, 0.86, 2.14, 1.74, 1.26, 0.26, 0.4, 0.46, 0.66, 0.74, 0.74, 0.66, 0.66, 0.74, 0.74, 0.86, 1.8, 0.46, 0.66, 0.74, 0.8, 0.4, -0.06, -0.4, -0.14, 0.34, 0.46, 0.86, 0.74, 0.6, 2.06, 2.06, 2.2, 1.66, 1.94,
                2.94, 1.46, 1.34, 1.34, 1.14, 0.86, 0.94, 1.26, 1.54, 2.54, 2.66, 1.06, 0.8, 0.54, 0.4, 0.66, 0.6, 1.4, 0.8, 1.34, 1.86, 3.26, 3.46, 3.2, 2.94, 2.74, 2.86, 3, 2.66, 2, 2.46, 1.74, 2.26, 2.8, 3.4, 3.8, 3.74, 3.6, 3.46, 3.34,
                2.74, 2.74, 3.2, 2.86, 3.34, 3.94, 4.06, 4.34, 4.86, 1.8, 1.66, 2.66, 2.46, 2.14, 2.06, 2.14, 2.8, 3.86, 3.4, 0.4, 0.46, 0.54, 0.66, 0.86, 0.6, 0.54, 0.14, -0.54, -1.06, -0.14, 1.14, 1.66,
                6.86, 6.6, 5.26, 3.74, 3.14, 3.34, 4.94, 4.74, 3.14, 2.26, 2.46, 2.34, 2.54, 2.26, 2.2, 2.2, 2.26, 2.54, 3.2, 3.54, 3.2, 2.46, 2.2, 2.2, 2.4, 2.54, 3.06, 3.14, 3.4, 3.6, 3.4, 2.8, 2.26, 2.26, 2.14, 2.26, 2.6, 2.66, 2.66,
                2.46, 3.54, 3.2, 3.06, 2.8, 2.4, 2.06, 2.54, 3.6, 3.94, 4.54, 3.94, 3.14, 2.26, 3.6, 3.6, 3.54, 4.26, 4.34, 3.26, 4.06, 3.86, 3.2, 3.26, 3.2, 3.26, 3.74, 4, 4.26, 4.14, 4.2, 3.6, 3.94, 4.66, 3.94, 3.2, 3.66, 4.06, 3.54,
                3.4, 3.66, 3.14, 3.26, 3.2, 3.34, 3, 2.94, 3.14, 2.66, 3.2, 3.46, 3.66, 3.14, 1.8, 2.4, 1.86, 2.2, 1.86, 1.8, 1.26, 1, 0.94, 0.34, -0.2, 0.14, 0.14, 0.2, 0.74, 0.26, 1.46, 2.14, 1.54, 0.54, -0.86, -0.54, -0.4, 0.26, 1.54,
                0.94, 0.4, -0.46, -0.94, -1.26, -0.8, 0.26, 0.74, 0.06, 0.26, 0, -0.14, 0.2, 1.34, 2.46, 2.14, 1.4, 0.46, 0.26, -0.26, 0.34, 0.54, 0.46, 2.54, 1.8, 2.86, 2.54, 0.8, -0.4, -0.26, -0.34, -0.26, 0.06, 1.06, 2, 1.6, 0.8, 0.06,
                1.2, 1.46, 0.86, 0, 0.2, 0.46, -0.2, -1, -1.6, -1.66, 0.6, 0.74, 1.46, 0.54, 0.34, 0.54, 0.74, 0.06, 0.06, -1.2, -1.66, -1.46, -0.8, -0.6, -0.86, -0.66, -0.34, -0.14, -0.8, -1.54, -2.14, -1.74, -1.14, -0.74],
            type: 'line'
        }
    ]
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const deviceSelectChange = async (deviceName) => {
    chartDataLoading.value = true
    updateTimeLoading.value = true
    showButton.value = false;
    if (deviceTypeNameMap[selectedDeviceType.value] != 'fiber') {
        // console.log(deviceTypeNameMap[selectedDeviceType.value]),
        let tp = shitMap[selectedDeviceType.value]
        let _deviceCode = monitorInfo.value[tp]["NAME_CODE_Map"][deviceName]
        // curDeviceData = (
        //     await BackEndRequest.getMonitorDataByTypeIdWithTime(
        //         // deviceTypeNameMap[selectedDeviceType.value],
        //         // deviceIdMap[deviceName],
        //         deviceTypeTimeMap[selectedDeviceType.value].timeUnit,
        //         deviceTypeTimeMap[selectedDeviceType.value].timeCount,
        //         _deviceCode
        //     )
        // ).data
        try {
            curDeviceData = (
                await BackEndRequest.getMonitorDataByTypeIdWithTime(
                    // 'gnss',
                    deviceTypeTimeMap[selectedDeviceType.value].timeUnit,
                    deviceTypeTimeMap[selectedDeviceType.value].timeCount,
                    _deviceCode
                )
            ).data
        } catch (e) {
            curDeviceData = []
        }
    } else {
        curDeviceData = []
        // 添加 click 事件监听器
        echartIns.on('click', function (params) {
            // 检查点击的是否是系列中的折点
            if (params.seriesType === 'line' && params.dataIndex !== undefined) {
                // 点击的是折点，更新 option 为 newOption
                echartIns.setOption(fiberNewOption, { notMerge: true });
                showButton.value = true;
                // console.log(showButton)
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (curDeviceData.length > 0) {
        let newestData = curDeviceData.slice(-1)[0]
        deviceUpdateTime.value = newestData.measureTime ? newestData.measureTime : "暂无"
    }
    chartDataLoading.value = false
    updateTimeLoading.value = false
    // console.log('device data', curDeviceData)
    toggleChartOptionFromData(curDeviceData)
}
//////////////////////////////////////////////////////////////////////////////
const goBack = () => {
    // 更改图标设置为原设置
    if (deviceTypeNameMap[selectedDeviceType.value] == 'fiber') {
        echartIns.setOption(deviceOptionMap[selectedDeviceType.value])
        showButton.value = false;
    }
};
//////////////////////////////////////////////////////////////////////////////
const dataModeChange = (dataMode) => {
    if (curDeviceData != null) {
        showButton.value = false

        // chartDataLoading.value = true
        // updateTimeLoading.value = true
        // if (curDeviceData.length > 0) {
        //     let newestData = curDeviceData.slice(-1)[0]
        //     deviceUpdateTime.value = newestData.measureTime ? newestData.measureTime: "暂无"
        // }
        // chartDataLoading.value = false
        // updateTimeLoading.value = false
        // // console.log('device data', curDeviceData)
        // toggleChartOptionFromData(curDeviceData)
        deviceOptionMap[selectedDeviceType.value] = toggleOptionDataMode(
            deviceOptionMap[selectedDeviceType.value],
            selectedDeviceType.value,
            dataMode,
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
    let tp = shitMap[selectedDeviceType.value]
    let _deviceCode = monitorInfo.value[tp]["NAME_CODE_Map"][selectedDevice.value]
    let deviceNewestData
    try {
        if (_deviceCode)
            deviceNewestData = (
                await BackEndRequest.getDeviceNewestData(
                    _deviceCode,
                )
            ).data
        else
            deviceNewestData = []
    } catch (e) {
        deviceNewestData = []
    }

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
        const warnDataCount = [0, 0, 0, 0, 0, '-']
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
    },
)

function distanceOpenTime(showTime) {
    //   let timer = showTime

    const currentTime = new Date()
    const targetTime = new Date(showTime)

    // 计算时间差（以毫秒为单位）
    const timeDiff = currentTime.getTime() - targetTime.getTime()

    // 将时间差转换为小时、分钟和秒数
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

    return days
}

const componentKey = ref(0)
const reRender = () => {
    // componentKey.value += 1
}

onBeforeRouteUpdate(async (to, from) => {

    useBankNameStore().globalBankName = to.params.id
    deviceStatusLoading.value = true


    const importantInfo = (await DeviceHelper.getProcessedMonitorInfo(to.params.id))
    monitorInfo.value = importantInfo

    deviceList.value = monitorInfo.value[shitMap[selectedDeviceType.value]] ? monitorInfo.value[shitMap[selectedDeviceType.value]]['DeviceList'] : []

    deviceStatusDataList.value[0].count = monitorInfo.value["GNSS"]['DeviceList'].length
    deviceStatusDataList.value[1].count = monitorInfo.value["STRESS"]['DeviceList'].length
    deviceStatusDataList.value[2].count = monitorInfo.value["MENOMETER"]['DeviceList'].length
    deviceStatusDataList.value[3].count = monitorInfo.value["INCLINE"]['DeviceList'].length

    selectedDevice.value = deviceList.value[0]

    deviceStatusLoading.value = false
    updateTimeLoading.value = true

    let tp = shitMap[selectedDeviceType.value]
    let _deviceCode = monitorInfo.value[tp]["NAME_CODE_Map"][deviceList.value[0]]
    try {
        if (_deviceCode) {
            curDeviceData = (
                await BackEndRequest.getMonitorDataByTypeIdWithTime(
                    // 'gnss',
                    deviceTypeTimeMap['位移测量站'].timeUnit,
                    deviceTypeTimeMap['位移测量站'].timeCount,
                    // deviceIdMap['CL-01'],
                    _deviceCode
                )
            ).data
        } else {
            curDeviceData = []
        }
    } catch (e) {
        console.log('catch request error! ', _deviceCode)
        curDeviceData = []
    }


    let newestData = curDeviceData.slice(-1)[0] ? curDeviceData.slice(-1)[0] : {}
    deviceUpdateTime.value = newestData.measureTime ? newestData.measureTime : "暂无"
    updateTimeLoading.value = false
    deviceOptionMap['位移测量站'] = genGnssOptionOfDevice(
        curDeviceData,
        deviceTypeErrorMap['位移测量站'],
        selectedDataMode.value,
    )
    // console.log(deviceOptionMap)
    // console.log('option', deviceOptionMap['位移测量站'])
    echartIns.setOption(deviceOptionMap['位移测量站'])
    chartDataLoading.value = false

    // setInterval(async () => {
    //     if (deviceTypeNameMap[selectedDeviceType.value] != 'fiber') {
    //         chartDataLoading.value = true
    //         updateTimeLoading.value = true
    //         await updateNewestData()
    //         // console.log(deviceTypeNameMap[selectedDeviceType.value])
    //         // console.log(deviceIdMap[selectedDevice.value])
    //         chartDataLoading.value = false
    //         updateTimeLoading.value = false
    //     }
    // }, 1000 * 60)

    setTimeout(async () => {
        if (deviceTypeNameMap[selectedDeviceType.value] != 'fiber') {
            chartDataLoading.value = true
            updateTimeLoading.value = true
            console.log(useBankNameStore().globalBankName)
            await updateNewestData()
            // console.log(deviceTypeNameMap[selectedDeviceType.value])
            // console.log(deviceIdMap[selectedDevice.value])
            chartDataLoading.value = false
            updateTimeLoading.value = false
        }
    }, 10)

    // reRender()
    // console.log('initialData', initialData)

})



let validToken = null
onBeforeMount(async () => {
    // const daysFromToken = distanceOpenTime('2024-06-25')
    // let leftDays = daysFromToken % 7
    // if (daysFromToken >= 7) {
    if (1) {
        let newToken = (await BackEndRequest.getVideoToken()).data
        if (newToken && newToken.data && newToken.data.accessToken) {
            token.value = newToken.data.accessToken
            validToken = newToken.data.accessToken
        }
        else {
            console.log("request token failed..")
        }
        // console.log('BeforeMount request for token', token.value)
    }
})

onMounted(async () => {

    useBankNameStore().globalBankName = route.params.id

    // DeviceHelper.getProcessedMonitorInfo(useBankNameStore().globalBankName).then(res => {
    //     console.log('processed monitor info', res)
    // })
    const importantInfo = (await DeviceHelper.getProcessedMonitorInfo(useBankNameStore().globalBankName))
    monitorInfo.value = importantInfo

    deviceList.value = monitorInfo.value[shitMap[selectedDeviceType.value]] ? monitorInfo.value[shitMap[selectedDeviceType.value]]['DeviceList'] : []

    deviceStatusDataList.value[0].count = monitorInfo.value["GNSS"]['DeviceList'].length
    deviceStatusDataList.value[1].count = monitorInfo.value["STRESS"]['DeviceList'].length
    deviceStatusDataList.value[2].count = monitorInfo.value["MENOMETER"]['DeviceList'].length
    deviceStatusDataList.value[3].count = monitorInfo.value["INCLINE"]['DeviceList'].length

    selectedDevice.value = deviceList.value[0]

    setTimeout(() => {
        console.log('init with new token!!')
        refreshIframe(1)
    }, 1);
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
    let tp = shitMap[selectedDeviceType.value]
    let _deviceCode = monitorInfo.value[tp]["NAME_CODE_Map"][deviceList.value[0]]
    try {
        if (_deviceCode) {
            curDeviceData = (
                await BackEndRequest.getMonitorDataByTypeIdWithTime(
                    // 'gnss',
                    deviceTypeTimeMap['位移测量站'].timeUnit,
                    deviceTypeTimeMap['位移测量站'].timeCount,
                    // deviceIdMap['CL-01'],
                    _deviceCode
                )
            ).data
        } else {
            curDeviceData = []
        }
    } catch (e) {
        curDeviceData = []
    }
    let newestData = curDeviceData.slice(-1)[0] ? curDeviceData.slice(-1)[0] : {}
    deviceUpdateTime.value = newestData.measureTime ? newestData.measureTime : "暂无"
    updateTimeLoading.value = false
    deviceOptionMap['位移测量站'] = genGnssOptionOfDevice(
        curDeviceData,
        deviceTypeErrorMap['位移测量站'],
        selectedDataMode.value,
    )
    // console.log(deviceOptionMap)
    // console.log('option', deviceOptionMap['位移测量站'])
    echartIns.setOption(deviceOptionMap['位移测量站'])
    chartDataLoading.value = false

    // setInterval(async () => {
    //     if (deviceTypeNameMap[selectedDeviceType.value] != 'fiber') {
    //         chartDataLoading.value = true
    //         updateTimeLoading.value = true
    //         await updateNewestData()
    //         // console.log(deviceTypeNameMap[selectedDeviceType.value])
    //         // console.log(deviceIdMap[selectedDevice.value])
    //         chartDataLoading.value = false
    //         updateTimeLoading.value = false
    //     }
    // }, 1000 * 60)
    // console.log('initialData', initialData)

    setTimeout(async () => {
        if (deviceTypeNameMap[selectedDeviceType.value] != 'fiber') {
            chartDataLoading.value = true
            updateTimeLoading.value = true
            console.log(useBankNameStore().globalBankName)
            await updateNewestData()
            // console.log(deviceTypeNameMap[selectedDeviceType.value])
            // console.log(deviceIdMap[selectedDevice.value])
            chartDataLoading.value = false
            updateTimeLoading.value = false
        }
    }, 10)


    videoList.value.forEach((item, index) => {
        uikitInstances[index] = new EZUIKit.EZUIKitPlayer({
            id: item.name,
            url: item.videoUrl,
            accessToken:token.value,
            download: false
        })
    })

    let timeout;
    window.addEventListener('resize', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            reSizeVideos()
        }, 300);
    });
})

onBeforeUnmount(async () => {
    await moveBack2Origin()
    refreshInterval && clearInterval(refreshInterval)
})


// (1) 顶端角度：反映应力桩顶端在受力过程中的倾斜角度变化，该角度的改变可以间接反映出岸坡顶部土壤应力的分布和变化情况，对于评估岸坡顶部的稳定性和可能的变形模式具有一定的参考价值。
// (2) 中部角度：测量应力桩中部的倾斜角度，中部角度的变化能够体现岸坡中部土壤应力的调整和转移，有助于分析岸坡内部结构的受力状态和潜在的薄弱环节。
// (3) 底端角度：监测应力桩底端的倾斜角度，底端角度的改变对于判断岸坡底部土壤的应力集中和稳定性至关重要，结合其他部位的角度变化，可以全面了解应力桩在岸坡不同深度处的受力响应。
// (4) 顶端最大应变：表示应力桩顶端在受力过程中所产生的最大应变值，应变是应力作用下物体变形程度的度量，顶端最大应变能够反映岸坡顶部土壤应力的强度和变化幅度，为评估岸坡顶部的承载能力提供重要依据。
// (5) 中部最大应变：指应力桩中部所承受的最大应变，中部最大应变的大小和变化趋势可以帮助分析岸坡中部土壤的应力分布和承载能力，对于确定岸坡内部的关键受力区域具有重要意义。
// (6) 底端最大应变：体现应力桩底端的最大变形程度，底端最大应变的监测数据对于评估岸坡底部土壤的应力状态和稳定性至关重要，结合顶端和中部的最大应变，可以全面了解应力桩在岸坡不同深度处的受力变形情况。
// (7) 顶端应力：直接测量应力桩顶端所承受的应力大小，顶端应力的变化反映了岸坡顶部土壤对桩体的作用力变化，对于判断岸坡顶部的承载能力和稳定性具有关键作用。
// (8) 中部应力：测量应力桩中部的应力值，中部应力的分布和变化情况可以帮助分析岸坡内部土壤应力的传递和分布规律，为评估岸坡的整体稳定性提供重要参考。
// (9) 底端应力：监测应力桩底端的应力大小，底端应力的大小直接关系到岸坡底部的稳定性，通过对底端应力的监测，可以及时发现岸坡底部可能存在的应力集中和不稳定因素。




const indicatorDescriptionMap = {
    'GNSS': [{
        name: 'X位移',
        desc: '表示岸坡在水平方向上沿 X 轴的位移变化，正值和负值分别表示在 X 轴正方向和负方向上的位移，可用于判断岸坡在该方向上的移动趋势和幅度'
    }, {
        name: 'Y位移',
        desc: '反映岸坡在水平方向上沿 Y 轴的位移情况，与 X 位移共同确定岸坡在水平平面内的位移矢量，有助于全面了解岸坡的水平移动状态。'
    }, {
        name: 'Z位移',
        desc: '即岸坡在垂直方向上的位移，对于评估岸坡的沉降或隆起等垂直方向的变形至关重要，结合 X、Y 位移可得到岸坡的三维位移信息。'
    }, {
        name: '三维累计位移',
        desc: '是岸坡在三维空间中位移的累积值，综合了 X、Y、Z三个方向的位移变化，能够直观地反映出岸坡在一段时间内的总体位移规模，对于长期监测和评估岸坡的稳定性具有重要意义。'
    }, {
        name: '五小时相对变化',
        desc: '指在连续的五个小时内，岸坡位移的相对变化量，通过该指标可以了解岸坡在短期内的位移速率和变化趋势，及时发现可能存在的快速变形情况，为及时采取措施提供依据。'
    }],
    'STRESS': [
        {
            name: '顶端角度',
            desc: '反映应力桩顶端在受力过程中的倾斜角度变化，该角度的改变可以间接反映出岸坡顶部土壤应力的分布和变化情况，对于评估岸坡顶部的稳定性和可能的变形模式具有一定的参考价值。'
        },
        {
            name: '中部角度',
            desc: '测量应力桩中部的倾斜角度，中部角度的变化能够体现岸坡中部土壤应力的调整和转移，有助于分析岸坡内部结构的受力状态和潜在的薄弱环节。'
        },
        {
            name: '底端角度',
            desc: '监测应力桩底端的倾斜角度，底端角度的改变对于判断岸坡底部土壤的应力集中和稳定性至关重要，结合其他部位的角度变化，可以全面了解应力桩在岸坡不同深度处的受力响应。'
        },
        {
            name: '顶端最大应变',
            desc: '表示应力桩顶端在受力过程中所产生的最大应变值，应变是应力作用下物体变形程度的度量，顶端最大应变能够反映岸坡顶部土壤应力的强度和变化幅度，为评估岸坡顶部的承载能力提供重要依据。'
        },
        {
            name: '中部最大应变',
            desc: '指应力桩中部所承受的最大应变，中部最大应变的大小和变化趋势可以帮助分析岸坡中部土壤的应力分布和承载能力，对于确定岸坡内部的关键受力区域具有重要意义。'
        },
        {
            name: '底端最大应变',
            desc: '体现应力桩底端的最大变形程度，底端最大应变的监测数据对于评估岸坡底部土壤的应力状态和稳定性至关重要，结合顶端和中部的最大应变，可以全面了解应力桩在岸坡不同深度处的受力变形情况。'
        },
        {
            name: '顶端应力',
            desc: '直接测量应力桩顶端所承受的应力大小，顶端应力的变化反映了岸坡顶部土壤对桩体的作用力变化，对于判断岸坡顶部的承载能力和稳定性具有关键作用。'
        },
        {
            name: '中部应力',
            desc: '测量应力桩中部的应力值，中部应力的分布和变化情况可以帮助分析岸坡内部土壤应力的传递和分布规律，为评估岸坡的整体稳定性提供重要参考。'
        },
        {
            name: '底端应力',
            desc: '监测应力桩底端的应力大小，底端应力的大小直接关系到岸坡底部的稳定性，通过对底端应力的监测，可以及时发现岸坡底部可能存在的应力集中和不稳定因素。'
        }
    ],
    'MENOMETER': [
        {
            name: '频率',
            desc: '频率是其测量孔隙水压力的关键指标。当孔隙水压力变化时，会引起传感器内钢弦张力的变化，从而导致钢弦振动频率的改变，通过测量频率的变化即可间接得到孔隙水压力的大小。'
        },
        {
            name: '温度',
            desc: '孔隙水压力计内部通常会内置温度传感器，用于对外界温度影响产生的变化进行温度修正，以提高测量数据的准确性，确保监测结果能够真实反映孔隙水压力的实际情况.'
        },
        {
            name: '水位高度',
            desc: '在潜水层，孔隙水压力计测出的是孔隙水压力计上方的水头压力，通过换算可以得到水位高度，而水位高度的变化与孔隙水压力密切相关，对于分析岸坡内部的水文地质条件和水分分布情况具有重要意义。'
        }
    ],
    'INCLINE': [
        {
            name: '顶部位移',
            desc: '指岸坡顶部在一定时间内的水平位移变化，反映了岸坡上部的移动情况，对于判断岸坡顶部的稳定性和可能的变形趋势具有重要作用。'
        }, {
            name: '中部位移',
            desc: '监测岸坡中部的水平位移，中部的位移情况往往能反映岸坡整体的变形趋势，是评估岸坡稳定性的关键指标之一，其变化可能预示着岸坡内部结构的变化和潜在的不稳定因素。'
        }, {
            name: '底部位移',
            desc: '测量岸坡底部的水平位移，由于底部的稳定性对于整个岸坡的稳定至关重要，底部移动的监测数据可以帮助判断岸坡是否存在底部滑动或不均匀沉降等问题。'
        },
        {
            name: '顶部日累计移动',
            desc: '记录岸坡顶部一天内的累计水平位移，通过对每日累计移动的分析，可以了解岸坡顶部在短期内的位移发展趋势，及时发现异常的位移增长情况。'
        },
        {
            name: '中部日累计移动',
            desc: '反映岸坡中部一天内的水平位移累积量，有助于分析岸坡中部在日常情况下的变形规律和稳定性变化，为长期的岸坡监测和维护提供数据支持。'
        },
        {
            name: '底部日累计移动',
            desc: '统计岸坡底部一天内的累计水平位移，对于评估岸坡底部的长期稳定性和潜在风险具有重要意义，结合其他部位的日累计移动数据，可以全面了解岸坡的整体变形状况。'
        }
    ]
}
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
    // height: 72.5vh;
    height: fit-content;
    transition: all ease-in-out 0.2s;

    div.device-info-content {
        width: 25.4vw;
        margin-left: 0.3vw;
        margin-right: 0.3vw;
        height: 72.5vh;
        // height: fit-content;
        // margin-top: 0vh;
        // margin-bottom: 0.5vh;

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
            height: fit-content;

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
                width: 81%;
                margin-left: 1.5%;
                height: 6vh;
                display: flex;
                flex-flow: column wrap;

                // background-color: #c4fbff;

                div.device-status-row {
                    height: 100%;
                    width: 24%;
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
                    z-index: 2;
                    // padding-top: 2%;
                    // padding-bottom: 2%;

                    // background-color: #2a5fdb;
                }

                div.infoButton {
                    z-index: 9999;
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    bottom: 0vh;
                    left: 0vw;
                    margin-left: 0.3%;
                    margin-bottom: 4.5%;



                }

                div.goBack {
                    z-index: 9999;
                    position: absolute;
                    top: 43px;
                    right: 30px;
                }

                div.chartContainer {
                    width: 100%;
                    height: 25vh;
                }

                div.newChartDiv {
                    width: 100%;
                    height: 25vh;
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
                            font-size: calc(0.4vw + 0.3vh);
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
                    position: relative;
                    // margin-top: 1vh;
                    width: 6vw;
                    // margin-left: 0.5vw;
                    height: 10vh;

                    // background-color: rgba(3, 63, 173, 1);

                    div.video-content {
                        position: relative;
                        height: calc(100% - 3vh);
                        width: 100%;

                        background-color: rgb(34, 75, 165);

                        div.video-img {
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: 100%;
                            // z-index:1000;
                            background-size: cover;
                        }
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

                        &[id='sp0'] {
                            background-image: url('/mzsBase-monitor3.png');
                        }

                        &[id='sp1'] {
                            background-image: url('/mzsBase-monitor2.png');
                        }

                        &[id='sp2'] {
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
                    font-size: calc(0.5vw + 0.55vh);
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
