<template>
    <div class="flowspeed-content">
        <div class="flowspeed-title">
            计算流速过程
            <div
                class="btn-draw"
                @click="drawButtonClickHandler"
                :class="{ forbbidden: props.status === false }"
            >
                测点绘制
            </div>
        </div>
        <div class="riskInfo-item flowspeed">
            <!-- <div class="item-title">
                沿岸流速分布：
            </div> -->

            <!-- <div class="profile-condition-container">
                <div class="profile-condition-text">
                    当前水文条件：{{ props.type }}
                </div>
            </div> -->
            <!-- <div ref="flowGraphRef" class="flowspeed graph" element-loading-background="rgba(214, 235, 255,0.8)"></div> -->
            <div
                class="graph-container flowspeed"
                id="flowspeed-chart-container"
                v-show="hasData === true"
            >
                <div
                    id="flowspeed-chart"
                    ref="flowspeedGraphRef"
                    class="flowspeed graph"
                    v-loading="props.flowspeedChartLoad"
                    element-loading-background="rgba(255, 255, 255, 0.4)"
                ></div>
            </div>
            <div class="blank-graph" v-show="hasData === false">
                <span v-if="true" style="z-index: 10">暂无数据</span>
            </div>
        </div>

        <div class="riskInfo-item flowfield">
            <div class="item-title">流场信息：</div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, watch, toRaw } from 'vue'
import { drawFlowspeedGraph } from './util.js'
import { useHydrodynamicStore } from '../../store/modelStore'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

const hydrodynamicStore = useHydrodynamicStore()

const props = defineProps(['status', 'flowspeedChartLoad', 'timeStep'])

const route = useRoute()

const emit = defineEmits(['handleDrawEvent'])

let chartIns = null
const flowspeedGraphRef = ref(null)
const hasData = ref(false)

const drawButtonClickHandler = () => {
    emit('handleDrawEvent')
}

const getTideLineDataOption = (data) => {
    const usData = data[0].us
    const vsData = data[0].vs
    const timeData = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25,
    ]

    const tideLineOption = {
        grid: {
            left: '1%',
            right: '3%',
            bottom: '12%',
            top: '17%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: timeData,
            name: '时间步',
            nameLocation: 'middle',
            nameGap: 23,
            nameTextStyle: {
                fontWeight: 'bold',
            },
        },
        yAxis: {
            type: 'value',
            name: '速度(m/s)',
            nameTextStyle: {
                fontWeight: 'bold',
            },
        },
        series: [
            {
                name: '东西向流速',
                data: usData,
                type: 'line',
                symbol: 'none',
            },
            {
                name: '南北向流速',
                data: vsData,
                type: 'line',
                symbol: 'none',
            },
        ],
    }
    return tideLineOption
}

const updateData = (data) => {
    hasData.value = true
    console.log(data)
    let tideLineOption = getTideLineDataOption(data)
    hydrodynamicStore.showingOption = tideLineOption
}

const defaultData = [
    {
        us: [
            '0.72456875225',
            '0.65458696795',
            '0.41120411483',
            '0.17161489738',
            '0.31642125073',
            '0.54155104957',
            '0.70956310321',
            '0.63356335557',
            '0.59658627573',
            '0.6398957933',
            '0.64477681833',
            '0.66071618973',
            '0.67243264692',
            '0.5886927053',
            '0.24917254981',
            '0.045899785235',
            '0.23572885596',
            '0.38818200666',
            '0.5585431447',
            '0.58730337796',
            '0.54108509337',
            '0.57902414439',
            '0.62466046868',
            '0.63069473985',
            '0.72769589971',
            '0.72414346019',
        ],
        vs: [
            '-0.92814517566',
            '-0.8748384524',
            '-0.59225560009',
            '-0.23981493733',
            '-0.2864782849',
            '-0.47888834013',
            '-0.63461389673',
            '-0.8878456969',
            '-0.86246530897',
            '-0.75437836442',
            '-0.81004963998',
            '-0.85580479137',
            '-0.8868238064',
            '-0.79983000236',
            '-0.39037965986',
            '-0.046745513799',
            '-0.1962600264',
            '-0.32368051254',
            '-0.47887967646',
            '-0.77208005288',
            '-0.75552256759',
            '-0.83331613899',
            '-0.91899364294',
            '-0.93736301143',
            '-0.90766315818',
            '-0.94337724743',
        ],
    },
]

onMounted(() => {
    chartIns = echarts.init(flowspeedGraphRef.value)

    let tidePointWatcher = null
    let markLineWatcher = null

    tidePointWatcher = watch(
        () => hydrodynamicStore.showingOption,
        (newVal) => {
            markLineWatcher && markLineWatcher() // rm watcher

            let option = JSON.parse(JSON.stringify(toRaw(newVal))) // deep copy
            console.log('showing option change!::', option)
            chartIns.setOption(option)

            markLineWatcher = watch(
                () => props.timeStep,
                (newVal) => {
                    hydrodynamicStore.flowFieldCurrentTimeStep = newVal
                    let showingOption = JSON.parse(
                        JSON.stringify(toRaw(hydrodynamicStore.showingOption)),
                    ) // deep copy
                    let markLineOption = hydrodynamicStore.getMarkLineOption()
                    showingOption.series[0].markLine = markLineOption
                    chartIns.setOption(showingOption)
                },
            )
        },
    )

    let bk = route.params.id
    if (bk === 'Mzs') {
        updateData(defaultData)
    }
})

onBeforeRouteUpdate(() => {
    let bk = route.params.id
    if (bk === 'Mzs') {
        updateData(defaultData)
    } else {
        hasData.value = false
    }
})

defineExpose({
    updateData,
})
</script>

<style lang="scss" scoped>
div.flowspeed-content {
    position: absolute;
    top: 40.5vh;
    height: 25vh;
    // left: 1vw;
    // width: 30.2vw;
    left: 0.3vw;
    width: 26vw;
    border-radius: 4px;
    // border: #167aec 1px solid;
    box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);
    background-color: rgb(208, 236, 255);
    backdrop-filter: blur(5px);
    z-index: 2;

    div.flowspeed-title {
        position: absolute;
        padding-left: 1vw;
        height: 4.2vh;
        width: 25vw;
        line-height: 4.5vh;
        border-radius: 6px;
        // background-color: rgba(235, 240, 247, 0.4);
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.6vw + 0.6vh);
        box-shadow: 0px 3px rgb(49, 121, 255);
        color: rgb(0, 138, 218);
        background-color: rgb(240, 248, 255);
        display: flex;
        align-items: center;

        .btn-draw {
            position: absolute;
            right: 0.8vw;
            width: 4vw;
            height: 2.5vh;
            text-align: center;
            line-height: 3vh;
            background: #0254bed0;
            color: #fff;
            font-family: inherit;
            font-weight: 900;
            font-size: calc(0.4vw + 0.7vh);
            border: 1px solid rgb(3, 107, 167);
            border-radius: 0.4em;
            box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: 0.3s linear;

            &:hover {
                background: #348cffd0;
            }

            &.forbbidden {
                cursor: not-allowed;
            }
        }
    }

    div.riskInfo-item {
        position: absolute;
        height: 19.3vh;
        width: 25vw;
        top: 5vh;
        border-radius: 6px;
        border: #3b85e7 2px solid;

        &.flowspeed {
            // right: 9.5vw;
            width: 18vw;
            // background-color: #b6b9eb;
        }

        &.flowfield {
            right: 0.4vw;
            width: 7vw;
        }

        div.item-title {
            position: absolute;
            top: 0.5vh;
            left: 0.5vw;
            font-size: calc(0.8vh + 0.6vw);
            font-weight: 600;
            font-family: 'Microsoft YaHei';
            // color: #a231e4;
            // text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
        }

        div.profile-condition-container {
            position: absolute;
            width: 7.2vw;
            height: 3vh;
            left: 12.6vw;
            top: 0.3vh;
            background-color: rgba(143, 161, 219, 0.4);
            border-radius: 4px;

            div.profile-condition-text {
                position: absolute;
                left: 0.4vw;
                top: 0.5vh;
                width: 8vw;
                height: 2vh;
                font-size: calc(0.6vh + 0.4vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
            }
        }

        div.graph-container {
            position: absolute;
            width: 19.5vw;
            top: 0.5vh;
            left: 0.25vw;

            &.flowspeed {
                height: 15vh;
                width: 17vw;
                backdrop-filter: blur(5px);
                // background-color: #00098a;
            }

            div.graph {
                position: relative;
                width: 100%;
                height: 100%;

                &.flowspeed {
                    width: 17vw;
                    height: 15vh;
                    // background-color: #00098a;
                    // height: 17vh;
                    // background-color: #00098a;
                }
            }
        }

        div.blank-graph {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #055279;
            height: 100%;
            width: 100%;
        }
    }
}

div.profile-selector-container {
    position: absolute;
    width: 13vw;
    height: 4vh;
    right: 1vw;
    // background-color: #d1d2db;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .select-descriptiopn {
        width: 6vw;
        margin-right: 0vw;
        line-height: 4vh;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.6vw + 0.4vh);
        box-shadow: 0px 3px rgb(49, 121, 255);
        color: rgb(0, 80, 166);
        display: flex;
    }

    :deep(.el-select) {
        // left: 4vw;
        top: 0.4vh;
        width: 6.5vw !important;
        height: 3vh !important;
        box-shadow:
            rgba(248, 248, 248, 0.3) 1px 1px,
            rgba(171, 184, 211, 0.7) 1px 1px,
            rgba(243, 244, 245, 0.6) 2px 2px;
        border-radius: 6px;
    }

    :deep(.el-select__wrapper) {
        height: 3vh;
        line-height: 3vh;
        border-radius: 6px;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.4vw + 0.5vh);
        background-color: rgba(165, 219, 253, 0.9);
    }

    :deep(.el-select__placeholder) {
        color: rgb(0, 80, 166);
    }

    :deep(.el-icon) {
        width: 0.8vw;
        height: 0.8vw;

        svg {
            width: 0.8vw;
            height: 0.8vw;

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

div#flowspeed-chart-container {
    margin-top: 0;
}

div#flowspeed-chart {
    width: 17.5vw;
    height: 18vh;
}
</style>
