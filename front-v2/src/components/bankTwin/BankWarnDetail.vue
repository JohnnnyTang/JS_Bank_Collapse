<template>
    <div
        class="warn-detail-container"
        :class="props.warnActive ? 'active' : 'in-active'"
        v-if="props.warnActive"
    >
        <div class="warn-detail-title">报警处置详情</div>
        <div class="warn-detail-content" v-loading="detailLoading">
            <el-scrollbar class="accordion-scroll">
                <el-collapse
                    v-model="collapseOpenItem"
                    @change="collapseChange"
                >
                    <el-collapse-item
                        v-for="(warn, index) in warnInfoStore.warnInfo"
                        :key="warn.id"
                        :name="warn.deviceId"
                    >
                        <template #title>
                            <div
                                class="title-warn-index"
                                style="color: red; margin-left: 1vw"
                            >
                                {{
                                    '报警' +
                                    (warnInfoStore.warnInfo_history.indexOf(
                                        warn,
                                    ) +
                                        1) +
                                    '-'
                                }}
                            </div>
                            <div class="title-warn-content">
                                {{
                                    deviceIdMap[warn.deviceId].replace(
                                        '-',
                                        '',
                                    ) +
                                    '-' +
                                    warn.warnTime.replaceAll('-', '')
                                }}
                            </div>
                            <div
                                class="deal-warn-button"
                                @click="startDealWithWarn(index)"
                            >
                                处置
                            </div>
                        </template>
                        <div class="detail-content-container">
                            <el-descriptions
                                direction="vertical"
                                :column="4"
                                border
                                style="width: 100%"
                            >
                                <el-descriptions-item
                                    label="报警区域"
                                    :span="1"
                                    >{{
                                        deviceIdPlaceMap[warn.deviceId]
                                    }}</el-descriptions-item
                                >
                                <el-descriptions-item
                                    label="报警时间"
                                    :span="1"
                                    >{{ warn.warnTime }}</el-descriptions-item
                                >
                                <el-descriptions-item
                                    label="风险点责任人"
                                    :span="1"
                                    >高卫南</el-descriptions-item
                                >
                                <el-descriptions-item
                                    label="责任人联系方式"
                                    :span="1"
                                    >15161059955</el-descriptions-item
                                >
                                <el-descriptions-item label="巡查队伍" :span="2"
                                    >靖江市西来镇巡堤查险队</el-descriptions-item
                                >
                                <el-descriptions-item
                                    label="巡查队责任人"
                                    :span="1"
                                    >刘宏江</el-descriptions-item
                                >
                                <el-descriptions-item
                                    label="巡查队联系方式"
                                    :span="1"
                                    >13921738638</el-descriptions-item
                                >
                                <el-descriptions-item label="抢险队伍" :span="2"
                                    >江苏龙源水利工程有限公司抢险队
                                </el-descriptions-item>
                                <el-descriptions-item
                                    label="抢险队责任人"
                                    :span="1"
                                    >吴明灿</el-descriptions-item
                                >
                                <el-descriptions-item
                                    label="抢险队联系方式"
                                    :span="1"
                                    >13815981186</el-descriptions-item
                                >
                            </el-descriptions>

                            <div
                                class="deal-confirm-buttons"
                                v-if="curDealWith[index]"
                            >
                                <div
                                    class="confirm-deal button"
                                    @click="confirmDealWithWarn(warn)"
                                >
                                    确认处置
                                </div>
                                <div
                                    class="cancel-deal button"
                                    @click="
                                        cancelDealWithWarm(index, warn.deviceId)
                                    "
                                >
                                    取消
                                </div>
                            </div>
                        </div>
                    </el-collapse-item>
                    <div
                        v-show="warnInfoStore.warnInfo.length == 0"
                        class="no-data"
                    >
                        暂无未处置报警
                    </div>
                    <el-collapse-item style="margin-top: 0.5vh">
                        <template #title>
                            <div
                                style="
                                    margin-left: 1vw;
                                    font-size: calc(0.8vw + 0.6vh);
                                    color: rgb(0, 193, 243);
                                "
                            >
                                已处置报警列表
                            </div>
                        </template>
                        <div class="detail-content-container">
                            <div class="head device-status-row">
                                <div class="device-id device-item head">
                                    序号
                                </div>
                                <div class="device-time device-item head">
                                    报警时间
                                </div>
                                <div class="device-name device-item head">
                                    报警设备
                                </div>
                                <div class="device-place device-item head">
                                    报警位置
                                </div>
                                <div class="device-deal device-item head">
                                    处置
                                </div>
                            </div>
                            <div
                                class="device-status-row body"
                                v-for="(item, index) in dealtWarnList"
                                :key="index"
                            >
                                <div class="device-id device-item body">
                                    {{ index + 1 }}
                                </div>
                                <div class="device-time device-item body">
                                    <div class="up">
                                        {{ item.warnTime.split(' ')[0] }}
                                    </div>
                                    <div class="down">
                                        {{ item.warnTime.split(' ')[1] }}
                                    </div>
                                </div>
                                <div class="device-name device-item body">
                                    {{ deviceIdMap[item.deviceId] }}
                                </div>
                                <div class="device-place device-item body">
                                    {{ deviceIdPlaceMap[item.deviceId] }}
                                </div>
                                <div class="device-deal device-item body">
                                    <div
                                        class="withdraw-button"
                                        @click="withdrawDeal(item)"
                                    >
                                        撤回处置
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style="
                                text-align: center;
                                width: 100%;
                                height: 4vh;
                                line-height: 4vh;
                                font-size: calc(0.6vw + 0.8vh);
                            "
                            v-if="dealtWarnList.length === 0"
                        >
                            暂无已处置报警
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-scrollbar>
        </div>
        <div class="plan-button-group">
            <div class="plan-button-title">
                <div>处置预案</div>
                <div>预览</div>
            </div>
            <div
                class="plan-button-item"
                v-for="but in buttonInfoList"
                :key="but.index"
                @click="openPlanPdf(but)"
            >
                <div class="plan-button-name">{{ but.name }}</div>
                <div class="plan-button-func">预览</div>
            </div>
        </div>
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="fit-content"
            :append-to-body="true"
        >
            <VuePDF :pdf="pdf" :page="curPage" />
            <el-pagination
                layout="prev, pager, next"
                background
                :page-count="pages"
                v-model:current-page="curPage"
                style="justify-content: center"
            />
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import BackEndRequest from '../../api/backend'
import { useMapStore, useWarnInfoStore } from '../../store/mapStore'
import { removeWarningDeviceStyle } from '../bankManage/mapInit.js'
const props = defineProps({
    warnActive: {
        type: Boolean,
        default: true,
    },
})
const detailLoading = ref(false)
const warnInfoStore = useWarnInfoStore()
const warnDetailList = ref([])
const curDealWith = ref(new Array(10).fill(false))

const collapseOpenItem = ref([])

const dealtWarnList = computed(() => {
    let res = []
    warnInfoStore.warnInfo_history.map((item) => {
        if (item.ifDealt !== 0) {
            res.push(item)
        }
    })
    // console.log('computed dealt warn', res)
    return res
})

const deviceIdMap = {
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
    'MZS120.51726088_32.04054582_3': 'KX-01',
    'MZS120.51738292_32.04054923_3': 'KX-02',
    'MZS120.51749021_32.04053105_3': 'KX-03',
    'MZS120.51957026_32.04008655_3': 'KX-04',
    'MZS120.51967889_32.04004108_3': 'KX-05',
    'MZS120.51986665_32.03998992_3': 'KX-06',
    'MZS120.52557975_32.03825056_3': 'KX-07',
    'MZS120.52565217_32.03813574_3': 'KX-08',
    'MZS120.52566826_32.03799363_3': 'KX-09',
    'MZS120.513203_32.042733_2': 'YL-01',
    'MZS120.515433_32.04231_2': 'YL-02',
    'MZS120.521221_32.040331_2': 'YL-03',
    'MZS120.529078_32.034385_2': 'YL-04',
    'MZS120.541648_32.030524_2': 'YL-05',
    'MZS120.548925_32.029361_2': 'YL-06',
    'MZS120.552209_32.028149_2': 'YL-07',
    'MZS120.51967889_32.04004108_4': 'CX-01',
    'MZS120.51986665_32.03998992_4': 'CX-02',
    'MZS120.52557975_32.03825056_4': 'CX-03',
    'MZS120.52565217_32.03813574_4': 'CX-04',
    'MZS120.52566826_32.03799363_4': 'CX-05',
    'MZS120.51726088_32.04054582_4': 'CX-06',
    'MZS120.51738292_32.04054923_4': 'CX-07',
    'MZS120.51749021_32.04053105_4': 'CX-08',
    'MZS120.51957026_32.04008655_4': 'CX-09',
}

const deviceIdPlaceMap = {
    '': '暂无',
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
    'MZS120.51726088_32.04054582_3': 'MZ02顺堤',
    'MZS120.51738292_32.04054923_3': 'MZ02顺堤',
    'MZS120.51749021_32.04053105_3': 'MZ02顺堤',
    'MZS120.51957026_32.04008655_3': 'MZ03顺堤尾',
    'MZS120.51967889_32.04004108_3': 'MZ03顺堤尾',
    'MZS120.51986665_32.03998992_3': 'MZ03顺堤尾',
    'MZS120.52557975_32.03825056_3': 'MZ04江滩办',
    'MZS120.52565217_32.03813574_3': 'MZ04江滩办',
    'MZS120.52566826_32.03799363_3': 'MZ04江滩办',
    'MZS120.513203_32.042733_2': 'MZ02顺堤',
    'MZS120.515433_32.04231_2': 'MZ03顺堤尾',
    'MZS120.521221_32.040331_2': 'MZ04江滩办',
    'MZS120.529078_32.034385_2': 'MZ06张靖皋桥位',
    'MZS120.541648_32.030524_2': 'MZ08海事码头',
    'MZS120.548925_32.029361_2': 'MZ09码头下游',
    'MZS120.552209_32.028149_2': 'MZ10雷达站',
    'MZS120.51967889_32.04004108_4': 'MZ02顺堤',
    'MZS120.51986665_32.03998992_4': 'MZ02顺堤',
    'MZS120.52557975_32.03825056_4': 'MZ02顺堤',
    'MZS120.52565217_32.03813574_4': 'MZ03顺堤尾',
    'MZS120.52566826_32.03799363_4': 'MZ03顺堤尾',
    'MZS120.51726088_32.04054582_4': 'MZ03顺堤尾',
    'MZS120.51738292_32.04054923_4': 'MZ04江滩办',
    'MZS120.51749021_32.04053105_4': 'MZ04江滩办',
    'MZS120.51957026_32.04008655_4': 'MZ04江滩办',
}

const buttonInfoList = ref([
    {
        index: 0,
        name: '南通段预案',
        url: '/pdf/11.长江南通段民主沙撤离预案.pdf',
        pageNum: '29',
    },
    {
        index: 1,
        name: '靖江段预案',
        url: '/pdf/30.靖江市民主沙行洪运用预案.pdf',
        pageNum: '41',
    },
    {
        index: 2,
        name: '重点防御预案',
        url: '/pdf/75靖江市民主沙(右缘)险工段重点防御预案.pdf',
        pageNum: '63',
    },
])

const curPage = ref(1)

const curPdf = ref('/pdf/11.长江南通段民主沙撤离预案.pdf')

const { pdf, pages, info } = usePDF(curPdf)

const dialogVisible = ref(false)
const dialogTitle = ref('')

const detailInfo = ref({
    basic: '',
    cause: '',
    plan: '',
    after: '',
    video: '',
})

const deviceTypeList = ['GNSS', '应力桩', '水压力计', '测斜仪']

const openPlanPdf = (info) => {
    curPage.value = 1
    dialogVisible.value = true
    curPdf.value = info.url
}

const startDealWithWarn = (index) => {
    curDealWith.value[index] = true
}

const cancelDealWithWarm = (index, deviceId) => {
    curDealWith.value[index] = false
    if (collapseOpenItem.value.includes(deviceId)) {
        console.log('id inside......')
        collapseOpenItem.value.splice(
            collapseOpenItem.value.indexOf(deviceId),
            1,
        )
    }
}

const filterDealtWarnInfo = (warnList) => {
    let res = []
    warnList.map((item) => {
        if (item.ifDealt !== 0) {
            res.push(item)
        }
    })
    // console.log('filtered dealt warn', res)
    return res
}

const confirmDealWithWarn = async (warnItem) => {
    if (!warnInfoStore.fake) {
        await BackEndRequest.updateWarnDealtStatus(warnItem.id, 1)
    }
    if (warnItem.id in warnInfoStore.warnPopupMap) {
        // console.log(
        //     'dealing with this',
        //     warnInfoStore.warnPopupMap[warnItem.id],
        // )
        warnInfoStore.warnPopupMap[warnItem.id].remove()
        delete warnInfoStore.warnPopupMap[warnItem.id]

        let id = warnItem.deviceId
        let type = deviceTypeList[id.split('_').pop() - 1]
        console.log(type, id)
        removeWarningDeviceStyle(useMapStore().getMap(), type, id)
    }
    if (warnItem.id in warnInfoStore.areaBreatheInterval) {
        clearInterval(warnInfoStore.areaBreatheInterval[warnItem.id])
        delete warnInfoStore.areaBreatheInterval[warnItem.id]
    }
    warnInfoStore.removeInfoItem(warnItem)
    warnInfoStore.videoActive = [null, null]
    // console.log('dealing', warnItem)
    warnItem.ifDealt = 1
    // historyRowLoading.value[warnIndex] = false
}

const collapseChange = (opened) => {
    console.log('changed collapse', opened)
}

const withdrawDeal = async (warnItem) => {
    if (!warnInfoStore.fake) {
        await BackEndRequest.updateWarnDealtStatus(warnItem.id, 0)
    }

    warnInfoStore.restoreWarn(warnItem)
    warnInfoStore.videoActive = [0, 2]
}

watch(
    () => warnInfoStore.curDealId,
    (newVal) => {
        if (newVal && newVal != '') {
            // console.log("123123123123", newVal)
            startDealWithWarn(newVal - 1)
            // console.log(
            //     '21312313123213',
            //     warnInfoStore.warnInfo_history[newVal - 1].id,
            // )
            collapseOpenItem.value.push(
                warnInfoStore.warnInfo_history[newVal - 1].deviceId,
            )
        }
    },
)

onMounted(() => {
    warnDetailList.value = warnInfoStore.warnInfo
})
</script>

<style lang="scss" scoped>
div.warn-detail-container {
    position: absolute;
    right: 0.5vw;
    top: 10vh;
    height: 43vh;
    width: 27.5vw;

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
        height: 32vh;
        width: 27vw;
        margin-left: 0.25vw;

        background-color: #acd7ff6b;

        div.accordion-scroll {
            height: 100%;
            width: 100%;
        }

        div.no-data {
            margin-top: 1vh;
            text-align: center;
            width: 100%;
            height: 4vh;
            line-height: 4vh;
            font-weight: bold;
            font-size: calc(0.8vw + 0.8vh);

            background-color: #c7ebff;
        }

        :deep(.el-collapse) {
            --el-collapse-border-color: #104da8;
            --el-collapse-header-height: 8vh;
            .el-collapse-item__header {
                background-color: rgb(210, 242, 255);
                padding-left: 0vw;
                font-weight: bold;
                color: #14129e;
                font-size: calc(0.8vw + 0.4vh);
                &.is-active {
                    color: rgb(221, 251, 255);
                    background-color: #0019a5;
                }

                div.deal-warn-button {
                    position: relative;
                    right: -3vw;
                    padding: 0 1vw 0 1vw;
                    background-color: #8bbcfc;
                    height: 4vh;
                    line-height: 4vh;
                    border-radius: 4px;
                    font-weight: normal;

                    color: #000f41;
                    border: 2px solid black;

                    &:hover {
                        font-weight: bold;
                        color: #ebf3ff;
                        background-color: #00328f;
                    }
                }
            }

            .el-collapse-item__content {
                background-color: rgb(221, 251, 255);
            }
        }
        :deep(.el-collapse-item__wrap) {
            background-color: transparent !important;
        }
        div.detail-content-container {
            width: 100%;
            // height: 32vh;
            height: fit-content;
            // margin-left: 1%;
            // padding-left: 2%;
            // padding-right: 2%;
            // background-color: rgb(92, 125, 154);
            border-bottom: 2px solid #0018a3;

            display: flex;
            flex-flow: row wrap;
            justify-content: center;

            // :deep(div.el-descriptions__title) {
            //     font-size: calc(0.6vw + 0.4vh);
            //     color: #021e7a;
            // }

            &.dealt {
                margin-top: 2vh;
            }

            :deep(
                    .el-descriptions__body
                        .el-descriptions__table
                        .el-descriptions__cell
                ) {
                font-size: calc(0.5vw + 0.3vh);
                text-align: center;
                background-color: #0a1e91;
                color: rgba(246, 250, 255, 1);
                // box-shadow: 0 0 0 1px #dbedff inset;

                &.is-bordered-content {
                    text-align: center;
                    font-size: calc(0.5vw + 0.3vh);
                    color: hsl(234, 100%, 15%);
                    box-shadow: 0 0 0 1px #b4a3ff inset;
                    background-color: rgb(238, 248, 255);
                    font-weight: 600;
                }
            }

            div.deal-confirm-buttons {
                height: 5vh;
                width: 100%;

                display: flex;
                flex-flow: row nowrap;

                justify-content: space-around;
                align-items: center;
                margin-top: 1vh;
                padding-bottom: 1vh;

                div.button {
                    width: 15%;
                    height: 4vh;
                    line-height: 4vh;

                    text-align: center;

                    padding: 0 1vw 0 1vw;
                    border-radius: 6px;
                    background-color: #8bbcfc;
                    color: #000f41;
                    font-size: calc(0.6vw + 0.6vh);
                    border: 2px solid black;

                    &:hover {
                        font-weight: bold;
                        color: #ebf3ff;
                        background-color: #00328f;
                        cursor: pointer;
                    }
                }
            }

            div.device-status-row {
                height: 4vh;
                line-height: 4vh;
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
                    height: 4vh;
                    line-height: 4vh;
                    text-align: center;
                    font-size: calc(0.5vw + 0.4vh);
                    border-radius: 2px;

                    background-color: #d2f2ff;
                    font-weight: bold;
                    color: #0237b3;

                    &.device-id {
                        width: 10%;
                    }

                    &.device-name {
                        width: 24%;

                        &.body {
                            font-size: calc(0.5vw + 0.6vh);
                        }
                    }

                    &.device-time {
                        width: 24%;
                        display: flex;
                        flex-flow: row wrap;
                        &.body {
                            line-height: 2vh;
                            font-size: calc(0.3vw + 0.6vh);

                            div {
                                width: 100%;

                                &.up {
                                    color: #5a8bff;
                                }
                            }
                        }
                        justify-content: center;
                    }

                    &.device-place {
                        width: 24%;
                        &.body {
                            font-size: calc(0.4vw + 0.6vh);
                        }
                    }
                    &.device-deal {
                        width: 18%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        div.withdraw-button {
                            height: 3vh;
                            line-height: 3vh;
                            width: fit-content;
                            padding: 0 10% 0 10%;
                            background-color: #0019a5;
                            color: rgb(230, 242, 255);
                            font-weight: normal;
                            border-radius: 4px;

                            &:hover {
                                font-weight: bold;
                                cursor: pointer;
                                color: #75faff;
                            }
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
    }

    div.plan-button-group {
        height: 5.6vh;
        width: 26.5vw;
        margin-left: 0.5vw;
        margin-top: 0.5vh;

        // background-color: red;
        border-radius: 2px;
        box-shadow:
            4px 3px rgb(0, 111, 175),
            -4px -3px rgb(20, 94, 255);
        display: flex;
        flex-flow: row nowrap;

        justify-content: space-between;
        align-items: center;

        div.plan-button-title {
            height: 4.5vh;
            line-height: 2vh;
            padding-left: 0.5vw;
            padding-right: 0.5vw;

            font-size: calc(0.5vw + 0.65vh);
            font-weight: bold;

            box-shadow: 3px 0px rgb(4, 0, 255);
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
        }

        div.plan-button-item {
            margin-right: 0.5vw;
            padding-left: 0.5vw;
            padding-right: 0.5vw;
            font-size: calc(0.5vw + 0.4vh);
            height: 4vh;
            line-height: 2vh;
            font-weight: bold;

            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            border-radius: 4px;

            border: 2px solid rgb(0, 119, 255);
            background-color: #8beeff;

            &:hover {
                cursor: pointer;
                border: 2px solid rgb(0, 204, 255);
                background-color: #002897;
                color: #dcebff;
            }
        }
    }
}
</style>
