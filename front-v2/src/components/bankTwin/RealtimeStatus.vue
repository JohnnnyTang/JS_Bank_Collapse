<template>
    <div class="device-info-container">
        <dv-border-box8
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
                                    数量
                                </div>
                                <div class="device-percent device-item head">
                                    正常率
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
                                <div class="device-count device-item body">
                                    {{ item.count }}
                                </div>
                                <div class="device-percent device-item body">
                                    {{ item.percent }}
                                </div>
                            </div>
                        </div>
                    </dv-border-box12>
                </div>

                <div class="device-chart-container">
                    <dv-border-box10
                        :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                    >
                        <div class="device-chart-dom" ref="chartDomRef"></div>
                    </dv-border-box10>
                </div>
            </div>
        </dv-border-box8>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import { deviceStatusData } from './data'
import * as echarts from 'echarts'

const deviceStatusDataList = ref([
    { name: 'GNSS', count: 13, percent: '100%' },
    { name: '测斜仪', count: 9, percent: '100%' },
    { name: '孔隙水压力计', count: 9, percent: '100%' },
    { name: '应力桩', count: 7, percent: '100%' },
    { name: '视频监控', count: 3, percent: '100%' },
])

const chartDomRef = ref(null)

const option = {
    grid: {
        left: '2%',
        right: '2%',
        top: '2%',
        bottom: '3%',
    },
    visualMap: {
        type: 'continuous',
        min: 1,
        max: 14,
        inRange: {
            color: ['rgb(206,238,254)', 'rgb(4,70,168)'],
        },
        right: "5%",
        top: 'center',
        itemWidth: "40%",
        itemHeight: "200%",
    },
    series: {
        type: 'sunburst',
        data: deviceStatusData,
        center: ["42%", "50%"],
        radius: ['20%', '100%'],
        itemStyle: {
            borderRadius: 7,
            borderWidth: 2,
        },
        label: {
            // show: true,
            rotate: 'tangential',
            fontSize: 12,
            color: '#fff',
            textBorderColor: 'inherit',
            textBorderWidth: 1,
        },
        levels: [
            {},
            {
                label: {
                    rotate: 'tangential',
                    textBorderColor: 'inherit',
                    textBorderWidth: 1,
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            },
            {
                label: {
                    rotate: 'tangential',
                    fontSize: 16,
                },
            }
        ],
    },
}

onMounted(() => {
    const deviceStatusChart = echarts.init(chartDomRef.value)
    deviceStatusChart.setOption(option)
})
</script>

<style lang="scss" scoped>
div.device-info-container {
    z-index: 3;
    box-shadow: 4px 8px 8px -4px rgb(0, 86, 199);

    position: absolute;
    left: 1vw;
    top: 33vh;
    width: 20vw;
    height: 56vh;

    div.device-info-content {
        width: 19vw;
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
                border-radius: 8px;

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
                    border-radius: 8px;

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
                        font-size: calc(0.6vw + 0.5vh);
                        border-radius: 8px;

                        background-color: #d2f2ff;
                        font-weight: bold;
                        color: #2a5fdb;

                        &.device-name {
                            width: 44%;
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

        div.device-chart-container {
            width: 95%;
            margin-left: 2.5%;
            height: 23vh;
            margin-top: 1vh;
            border-radius: 10px;
            overflow: hidden;

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

:deep(.dv-border-box-10) {
    background-color: rgba(255, 255, 255, 0.63);
    backdrop-filter: blur(8px);
}
</style>
