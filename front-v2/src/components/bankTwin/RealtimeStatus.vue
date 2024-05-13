<template>
    <div class="device-info-container">
        <dv-border-box12
            :dur="5"
            :color="['rgb(28, 75, 187)', 'rgb(140, 255, 255)']"
        >
            <div class="device-info-content">
                <div class="monitor-title-container">实时监测动态</div>
                <div class="monitor-info-splitter">
                    <dv-decoration3
                        style="width: 50%; height: 100%"
                        :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                    />
                    <dv-decoration3
                        style="width: 50%; height: 100%"
                        :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                    />
                </div>
                <div class="device-status-container">
                    <dv-border-box12
                        :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                    >
                        <div class="small-title-container">
                            <div class="small-title-icon"></div>
                            <div class="small-title-text">设备实时监测状态</div>
                        </div>
                        <div class="device-status-content">
                            <div class="head device-status-row">
                                <div class="device-name device-item head">
                                    设备
                                </div>
                                <div class="device-count device-item head">
                                    正常数/总数
                                </div>
                                <div class="device-time device-item head">
                                    最新更新时间
                                </div>
                            </div>
                            <div
                                class="device-status-row body"
                                v-for="(item, index) in deviceStatusDataList"
                                :key="index"
                            >
                                <div class="device-name device-item body">
                                    {{ item.name }}
                                </div>
                                <div
                                    class="device-count device-item body"
                                    v-loading="deviceStatusLoading"
                                >
                                    <div class="normal">{{ item.count }}</div>
                                    <div>/</div>
                                    <div>{{ item.count }}</div>
                                </div>
                                <div
                                    class="device-time device-item body"
                                    v-loading="deviceStatusLoading"
                                >
                                    {{ item.time }}
                                </div>
                            </div>
                        </div>
                    </dv-border-box12>
                </div>
                <div class="section-selector">
                    <div class="section-selectior-item type">
                        <el-select
                            v-model="selectedDeviceType"
                            placeholder="选择设备类型"
                            style="width: 10vw; height: 3.5vh"
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
                    </div>
                    <div class="section-selectior-item">
                        <el-select
                            v-model="selectedDevice"
                            placeholder="选择具体设备"
                            style="width: 6vw; height: 3.5vh"
                            @change="deviceSelectChange"
                        >
                            <el-option
                                v-for="item in deviceList"
                                :key="item"
                                :label="item"
                                :value="item"
                            >
                                <span class="section-name-text">{{
                                    item
                                }}</span>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="nav-data-button" @click="navToMoreData">
                        更多数据
                    </div>
                </div>
                <div class="device-chart-container">
                    <dv-border-box10
                        :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                    >
                        <div
                            class="device-chart-dom"
                            ref="chartDom"
                            v-loading="chartDataLoading"
                        ></div>
                    </dv-border-box10>
                </div>
            </div>
        </dv-border-box12>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import * as echarts from 'echarts'
import BackEndRequest from '../../api/backend'
import {
    genGnssOptionOfDevice,
    genStressOptionOfDevice,
    genIncinometerOptionOfDevice,
    genManometerOptionOfDevice,
} from './dataChartSettings'
import router from '../../router'

const chartDom = ref()
const chartDataLoading = ref(true)
const deviceStatusLoading = ref(true)

const deviceStatusDataList = ref([
    { name: '位移基准/测量站', count: 13, time: '2024' },
    { name: '应力桩', count: 7, time: '2024' },
    { name: '孔隙水压力计', count: 9, time: '2024' },
    { name: '测斜仪', count: 9, time: '2024' },
    { name: '视频监控', count: 3, time: '2024' },
])

const deviceListMap = {
    '位移基准/测量站': [
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
    '位移基准/测量站': 'gnss',
    测斜仪: 'inclinometer',
    孔隙水压力计: 'manometer',
    应力桩: 'stress',
}

const deviceTypeErrorMap = {
    '位移基准/测量站': 5,
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
    'KX-10': 'MZS120.56944728_32.02070961_1',
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
    '位移基准/测量站': {
        timeUnit: 'day',
        timeCount: 2,
    },
    测斜仪: {
        timeUnit: 'day',
        timeCount: 4,
    },
    孔隙水压力计: {
        timeUnit: 'day',
        timeCount: 4,
    },
    应力桩: {
        timeUnit: 'hour',
        timeCount: 5,
    },
}

const selectedDeviceType = ref('位移基准/测量站')

const deviceList = ref(deviceListMap['位移基准/测量站'])
console.log(deviceList)
const selectedDevice = ref('CL-01')

const sectionClassColorMap = ref({
    警告: 'warning',
    预警: 'pre-warning',
    关注: 'attention',
    普通: 'normal',
    统计: 'all',
})
const deviceTypeList = ref([
    '位移基准/测量站',
    '测斜仪',
    '孔隙水压力计',
    '应力桩',
])

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

const deviceTypeSelectChange = async (deviceType) => {
    console.log(deviceType)
    deviceList.value = deviceListMap[deviceType]
    selectedDevice.value = deviceListMap[deviceType][0]
    echartIns.clear()
    chartDataLoading.value = true
    await deviceSelectChange(deviceListMap[deviceType][0])
}

const deviceSelectChange = async (deviceName) => {
    console.log('device change', deviceName)
    chartDataLoading.value = true
    let data = (
        await BackEndRequest.getMonitorDataByTypeIdWithTime(
            deviceTypeNameMap[selectedDeviceType.value],
            deviceIdMap[deviceName],
            deviceTypeTimeMap[selectedDeviceType.value].timeUnit,
            deviceTypeTimeMap[selectedDeviceType.value].timeCount,
        )
    ).data
    if (selectedDeviceType.value == '位移基准/测量站') {
        gnssOption = genGnssOptionOfDevice(
            data,
            deviceTypeErrorMap['位移基准/测量站'],
        )
        // console.log('option', gnssOption)
        echartIns.setOption(gnssOption)
        chartDataLoading.value = false
    } else if (selectedDeviceType.value == '应力桩') {
        stressOption = genStressOptionOfDevice(
            data,
            deviceTypeErrorMap['应力桩'],
        )
        echartIns.setOption(stressOption)
        chartDataLoading.value = false
    } else if (selectedDeviceType.value == '测斜仪') {
        inclinoOption = genIncinometerOptionOfDevice(
            data,
            deviceTypeErrorMap['测斜仪'],
        )
        echartIns.setOption(inclinoOption)
        chartDataLoading.value = false
    } else {
        manoOption = genManometerOptionOfDevice(
            data,
            deviceTypeErrorMap['孔隙水压力计'],
        )
        echartIns.setOption(manoOption)
        chartDataLoading.value = false
    }
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

onMounted(async () => {
    await updateNewestTime()
    let myDate = new Date()
    deviceStatusDataList.value[4].time =
        zeroFill(myDate.getHours()) +
        ':' +
        zeroFill(myDate.getMinutes()) +
        ':' +
        zeroFill(myDate.getSeconds())
    setInterval(() => {
        myDate = new Date()
        deviceStatusDataList.value[4].time =
            zeroFill(myDate.getHours()) +
            ':' +
            zeroFill(myDate.getMinutes()) +
            ':' +
            zeroFill(myDate.getSeconds())
    }, 1000)
    setInterval(() => {
        updateNewestTime()
    }, 1000*60*5)
    deviceStatusLoading.value = false
    // console.log('213', newestDataStatus)
    echartIns = echarts.init(chartDom.value)
    let initialData = (
        await BackEndRequest.getMonitorDataByTypeIdWithTime(
            'gnss',
            deviceIdMap['CL-01'],
            'day',
            2,
        )
    ).data
    gnssOption = genGnssOptionOfDevice(
        initialData,
        deviceTypeErrorMap['位移基准/测量站'],
    )
    // console.log('option', gnssOption)
    echartIns.setOption(gnssOption)
    chartDataLoading.value = false
    // console.log('initialData', initialData)
})
</script>

<style lang="scss" scoped>
$shadowWhite: #b3b3b3;
$shadowGreen: #00ca22;
$shadowBlue: #005ae0;
$shadowOrange: #c54f00;
$shadowRed: #cf0000;

div.device-info-container {
    z-index: 3;
    box-shadow: 4px 8px 8px -4px rgb(0, 86, 199);

    position: absolute;
    left: 1vw;
    top: 25vh;
    width: 24vw;
    height: 66vh;

    div.device-info-content {
        width: 23vw;
        margin-left: 0.5vw;
        margin-right: 0.5vw;
        height: 55vh;
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
            width: 95%;
            margin-top: 0.5vh;
            margin-left: 2.5%;
            height: 24.2vh;

            div.small-title-container {
                position: absolute;
                width: 95%;
                margin-left: 2.5%;
                margin-top: 1vh;
                height: 3.5vh;
                line-height: 3.5vh;
                font-size: calc(0.6vw + 0.8vh);
                display: flex;
                border-radius: 2px;

                background: linear-gradient(
                    90deg,
                    rgba(0, 56, 128, 1) 0%,
                    rgba(16, 104, 203, 1) 60%,
                    rgba(68, 159, 255, 1) 100%
                );

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
                position: absolute;
                top: 5vh;
                width: 95%;
                margin-left: 2.5%;
                height: 18vh;

                // background-color: #c4fbff;

                div.device-status-row {
                    height: 16.6%;
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

                        box-shadow:
                            rgba(13, 70, 228, 0.6) 0px 2px 4px,
                            rgba(6, 55, 189, 0.4) 0px 7px 13px -3px,
                            rgba(9, 61, 204, 0.3) 0px -3px 0px inset;
                    }
                }
            }
            // background-color: #2622fd;
        }

        div.section-selector {
            height: 3.5vh;
            width: 21vw;
            margin-left: 1vw;

            // background-color: #6493ff;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            column-gap: 0.25vw;

            div.section-selectior-item {
                width: 6vw;
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
                    border-radius: 3px;
                }

                :deep(.el-select__wrapper) {
                    height: 3.3vh;
                    line-height: 3.3vh;
                    border-radius: 3px;
                    font-family: 'Microsoft YaHei';
                    font-weight: bold;
                    font-size: calc(0.5vw + 0.6vh);
                    background-color: #e6f7ff;
                }

                &.type {
                    width: 10vw;
                    :deep(.el-select__wrapper) {
                        font-size: calc(0.5vw + 0.25vh);
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

        div.device-chart-container {
            width: 95%;
            margin-left: 2.5%;
            height: 30vh;
            margin-top: 1vh;
            border-radius: 10px;

            // background-color: #6493ff;

            div.device-chart-dom {
                width: 96%;
                margin-left: 2%;
                height: 96%;
                padding-top: 2%;
                padding-bottom: 2%;

                // background-color: #2a5fdb;
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
