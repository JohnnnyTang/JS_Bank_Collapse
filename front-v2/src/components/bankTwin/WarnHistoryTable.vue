<template>
    <div
        class="warn-history-container"
        :class="props.warnActive ? 'active' : 'in-active'"
    >
        <div class="warn-history-title">报警信息列表</div>
        <div class="warn-histroy-content" v-loading="historyLoading">
            <div class="device-status-content">
                <div class="head device-status-row">
                    <div class="device-id device-item head">序号</div>
                    <div class="device-name device-item head">报警时间</div>
                    <div class="device-count device-item head">报警位置</div>
                    <div class="device-time device-item head">是否处置</div>
                </div>
                <el-scrollbar height="30vh">
                    <div
                        class="device-status-row body"
                        v-for="(item, index) in warnHistoryList"
                        :key="index"
                        v-loading="historyRowLoading[index]"
                    >
                        <div class="device-id device-item body">
                            {{ index + 1 }}
                        </div>
                        <div class="device-name device-item body">
                            {{ item.warnTime }}
                        </div>
                        <div class="device-count device-item body">
                            <div>{{ gnssIdSectionMap[item.deviceId] }}</div>
                        </div>
                        <div class="device-time device-item body">
                            <div :class="item.ifDealt == 1 ? 'yes' : 'no'">
                                {{ item.ifDealt ? '是' : '否' }}
                            </div>
                            <div
                                class="deal-button"
                                v-if="item.ifDealt == 0"
                                @click="dealWithWarn(index)"
                            >
                                处置
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import BackEndRequest from '../../api/backend'
import { useMapStore, useWarnInfoStore } from '../../store/mapStore'
import { removeWarningDeviceStyle } from '../bankManage/mapInit.js'

const props = defineProps({
    warnActive: {
        type: Boolean,
    },
})
const historyLoading = ref(true)
const historyRowLoading = ref(new Array(100).fill(false))
const warnStore = useWarnInfoStore()

const deviceTypeList = ["GNSS", "应力桩", "水压力计", "", "测斜仪"]

const warnHistoryList = ref([
    {
        id: '暂无',
        warnTime: '暂无',
        place: '暂无',
        ifDealt: '是',
        deviceId: '',
    },
])

const gnssIdSectionMap = {
    '': '暂无',
    'MZS120.51749289_32.04059243_1': '南顺堤',
    'MZS120.51977143_32.04001152_1': '南顺堤尾部',
    'MZS120.52557975_32.03825056_1': '江滩办事处',
    'MZS120.52660704_32.03676583_1': '小港池',
    'MZS120.53334877_32.03227055_1': '张靖皋桥位上游',
    'MZS120.54599538_32.02837993_1': '海事码头',
    'MZS120.55327892_32.02707923_1': '海事码头下游',
    'MZS120.55649757_32.02592404_1': '雷达站',
    'MZS120.56334257_32.02298144_1': '民主沙尾部主路',
    'MZS120.56944728_32.02070961_1': '民主沙尾部',
}


const dealWithWarn = async (warnIndex) => {
    console.log(warnHistoryList.value[warnIndex], '123123123212231')
    historyRowLoading.value[warnIndex] = true
    await BackEndRequest.updateWarnDealtStatus(
        warnHistoryList.value[warnIndex].id,
        1,
    )
    if (warnHistoryList.value[warnIndex].id in warnStore.warnPopupMap) {
        console.log(
            'dealing with this',
            warnStore.warnPopupMap[warnHistoryList.value[warnIndex].id],
        )
        warnStore.warnPopupMap[warnHistoryList.value[warnIndex].id].remove()
        delete warnStore.warnPopupMap[warnHistoryList.value[warnIndex].id]

        let id = warnHistoryList.value[warnIndex].deviceId
        let type = deviceTypeList[id.split('_').pop()-1]
        removeWarningDeviceStyle(useMapStore().getMap(), type, id)
        warnStore.removeInfoItem(warnHistoryList.value[warnIndex])
    }

    warnHistoryList.value[warnIndex].ifDealt = 1
    historyRowLoading.value[warnIndex] = false
}

onMounted(async () => {
    const warnData = (await BackEndRequest.getHistoryWarnInfo('day', 1)).data
    // console.log('warn', warnData)
    historyRowLoading.value = new Array(warnData.length).fill(false)
    // console.log('123123', historyRowLoading.value)
    warnHistoryList.value = warnData
    historyLoading.value = false
})
</script>

<style lang="scss" scoped>
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
                    width: 32%;
                    height: 4vh;
                    line-height: 4vh;
                    text-align: center;
                    font-size: calc(0.5vw + 0.4vh);
                    border-radius: 2px;

                    background-color: #d2f2ff;
                    font-weight: bold;
                    color: #0237b3;

                    &.device-id {
                        width: 12%;
                    }

                    &.device-name {
                        width: 34%;
                        &.body {
                            font-size: calc(0.5vw + 0.2vh);
                        }
                    }

                    &.device-time {
                        width: 21%;
                        display: flex;
                        justify-content: center;
                    }

                    &.device-time {
                        display: flex;
                        justify-content: center;

                        div.yes {
                            color: #00ca22;
                        }
                        div.no {
                            color: #ff0000;
                        }
                        div.deal-button {
                            padding-left: 6%;
                            padding-right: 6%;
                            height: 3vh;
                            line-height: 3vh;
                            margin-top: 0.5vh;
                            margin-left: 0.5vw;
                            height: fit-content;
                            border-radius: 0.5rem;
                            background-color: #0237b3;
                            font-weight: normal;
                            color: #e0f6ff;

                            &:hover {
                                font-weight: bold;
                                cursor: pointer;
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
}
</style>
