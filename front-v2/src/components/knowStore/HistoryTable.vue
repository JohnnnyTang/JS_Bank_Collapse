<template>
    <div class="history-table-container">
        <div class="history-title-container">
            <div class="history-title-icon"></div>
            <div class="history-title-text">历史崩岸列表</div>
        </div>
        <el-skeleton style="width: 28vw" :loading="loading" animated>
            <template #template>
                <!-- <el-skeleton-item
                    variant="rect"
                    style="width: 28vw; height: 72vh"
                /> -->
                <div style="
                        display: flex;
                        flex-flow: row wrap;
                        justify-content: space-around;
                        align-items: center;
                        justify-items: space-between;
                        height: 70vh;
                    ">
                    <el-skeleton-item variant="text" style="width: 30%; height: 4vh" v-for="i in 30" :key="i" />
                </div>
            </template>
            <template #default>
                <div class="history-search-cntainer">
                    <div class="history-search-input">
                        <el-input v-model="searchInput" style="width: 100%" placeholder="请输入筛选内容" clearable />
                    </div>
                    <div class="history-search-icon" @click="searchHandler"></div>
                </div>
                <div class="history-list-container">
                    <el-table :data="filteredList" stripe style="width: 100%" height="65vh"
                        row-class-name="history-table-row">
                        <el-table-column prop="time" label="时间" :width="tableColWidthList[0]" />
                        <el-table-column prop="place" label="位置" :width="tableColWidthList[1]" />
                        <el-table-column prop="river" label="河段" :width="tableColWidthList[2]" />
                        <el-table-column prop="side" label="岸别" :width="tableColWidthList[3]" />
                        <el-table-column label="更多" :width="tableColWidthList[4]">
                            <template #default="scope">
                                <div class="more-info-button" @click="
                                    handleClick(scope.$index, scope.row)
                                  " :class="{
                                    'in-scroll':
                                        (scope.row.detail != null)
                                }"></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog v-model="dialogTableVisible" width="800">
                    <el-descriptions :title="dialogTitleText" border>
                        <el-descriptions-item label="类别">{{ moreInfo.type }}</el-descriptions-item>
                        <el-descriptions-item label="口门长度">{{ moreInfo.length }}</el-descriptions-item>
                        <el-descriptions-item label="崩窝宽度">{{ moreInfo.width }}</el-descriptions-item>
                        <el-descriptions-item label="岸高">{{ moreInfo.height }}</el-descriptions-item>
                        <el-descriptions-item label="宽深比">{{ moreInfo.ratio }}</el-descriptions-item>
                        <el-descriptions-item label="崩塌土方量">{{ moreInfo.volume }}</el-descriptions-item>
                        <el-descriptions-item label="近岸冲刷">无数据</el-descriptions-item>
                        <el-descriptions-item label="坡陡">{{ moreInfo.steep }}</el-descriptions-item>
                        <el-descriptions-item label="崩窝进口夹角">{{ moreInfo.angle }}</el-descriptions-item>
                        <el-descriptions-item label="崩窝窝顶曲率">{{ moreInfo.curvature1 }}</el-descriptions-item>
                    </el-descriptions>
                </el-dialog>
            </template>
        </el-skeleton>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { number } from 'echarts'

const loading = ref(false)
const dialogTableVisible = ref(false)

let historyList = []
const filteredList = ref([])

const tableColWidthList = ref([0, 0, 0, 0])

const searchInput = ref('')
const dialogTitleText = ref('详细信息')
const moreInfo = ref({
    // place: '',
    // river: '',
    // time: '',
    type: '',
    length: 0,
    width: 0,
    height: 0,
    ratio: 0,
    volume: 0,
    steep: 0,
    angle: 0,
    curvature1: 0
})

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: import.meta.env.VITE_MAP_TILE_SERVER,
})

const emit = defineEmits(['scrollToSeeMore'])

function handleClick(index, row) {
    // console.log(1, index)
    if (row.detail && row.detail != '') {
        emit('scrollToSeeMore', index)
    } else {
        for (let key in moreInfo.value) {
            // console.log(key, row[key])
            if (row[key] && row[key] != '') {
                // console.log(key, typeof(row[key]), Number.isFinite(row[key]))
                if (Number.isFinite(row[key])) {
                    // console.log(1, row[key])
                    moreInfo.value[key] = row[key].toFixed(2)
                }
                else moreInfo.value[key] = row[key]
            }
            else {
                moreInfo.value[key] = '无数据'
            }
        }
        dialogTableVisible.value = true
    }
}
function searchHandler() {
    const searchText = searchInput.value.trim()
    if (searchText == '') {
        filteredList.value = historyList;
        return
    }
    const filteredListTemp = historyList.filter(item => {
        let keys = ['place', 'river', 'time', 'side']
        for (let key of keys) {
            if (item[key] && item[key] != '' && item[key].toString().includes(searchText)) {
                return true
            }
        }
        return false
    })
    filteredList.value = filteredListTemp
}
watch(searchInput, (newVal, oldVal) => {
    if (newVal === '') filteredList.value = historyList;
})

onMounted(async () => {
    const requestInfo = await backendInstance.get('/data/historyInfo/desc/sort')
    historyList = requestInfo.data
    filteredList.value = requestInfo.data


    let vw = window.innerWidth / 100
    let vh = window.innerHeight / 100
    let tableWidth = 27 * vw
    let iconColWidth = 6 * vh
    let colWidth = (tableWidth - iconColWidth) / 4
    tableColWidthList.value = [
        colWidth,
        colWidth,
        colWidth,
        colWidth,
        iconColWidth,
    ]
})
</script>

<style lang="scss" scoped>
$shadowBlue: #6ba7e0;

div.history-table-container {
    width: 28vw;
    height: 78vh;

    background-color: rgb(240, 248, 255);
    z-index: 5;
    margin-left: 3vw;
    margin-bottom: 1.5vh;

    border-radius: 4px;
    box-shadow: 0px 8px 40px -10px rgba(0, 0, 0, 0.8);
    overflow: hidden;

    div.history-title-container {
        height: 8vh;
        width: 26vw;
        margin-left: 1vw;

        background-color: rgb(240, 248, 255);
        border-top-right-radius: 1rem;
        border-top-left-radius: 1rem;
        border-bottom: inset 4px rgb(0, 11, 75);

        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;

        div.history-title-icon {
            height: 6vh;
            width: 6vh;

            background-image: url('/history.png');
            background-size: contain;
            background-repeat: no-repeat;
        }

        div.history-title-text {
            height: 6vh;
            width: fit-content;
            line-height: 6vh;

            font-weight: 600;
            font-size: calc(1.2vw + 0.6vh);

            background: linear-gradient(to right, #1452fa 0%, #002292 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    div.history-search-cntainer {
        height: 5vh;
        width: 26vw;
        margin-left: 1vw;
        // background-color: #173eaa;

        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;

        div.history-search-icon {
            height: 3.2vh;
            width: 3.2vh;
            margin-left: 1vw;
            background-image: url('/search.png');

            background-size: contain;
            background-repeat: no-repeat;
            transition: all 0.6s cubic-bezier(0.68, -0.45, 0.265, 1.45);

            &:hover {
                cursor: pointer;
                transform: scale(80%, 80%);
            }
        }

        div.history-search-input {
            width: 20vw;
        }
    }

    div.history-list-container {
        height: 65vh;
        width: 27vw;
        margin-left: 0.5vw;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;

        background-color: rgb(240, 248, 255);

        div.more-info-button {
            position: relative;
            height: 3vh;
            width: 3vh;
            left: 50%;
            transform: translateX(-50%);

            background-image: url('/three-dots.png');

            &.in-scroll {
                background-image: url('/next.png');
            }

            background-size: contain;
            background-repeat: no-repeat;
            transition: all 0.4s cubic-bezier(0.68, -0.45, 0.265, 1.45);

            &:hover {
                cursor: pointer;
                transform: scale(88%, 88%) translateX(-50%);
            }
        }
    }
}

:deep(.el-scrollbar__wrap) {
    scroll-behavior: smooth;
}

:deep(.el-table__inner-wrapper::before) {
    background: hsl(210, 70%, 30%);
}

:deep(.el-table__border-left-patch) {
    background: transparent;
}

:deep(.el-table .el-table__cell) {
    // border-right: 2px inset #739efc;
    border: 1px inset #739efc;
}

:deep(.el-table thead th.el-table__cell) {
    color: #f8faff;
    background: rgb(0, 16, 158);
    font-size: calc(0.7vw + 0.4vh);
    height: 3vh;
    border-right: inset 2px #157acc;
    border-bottom: inset 4px #05a3ff;
    text-shadow: #4bb0f3 1px 1px;

    div.cell {
        text-align: center;
        height: 3vh;
        line-height: 3vh;
    }

    // box-shadow:
    //     rgba(46, 82, 240, 0.75) 1px 0px,
    //     rgba(46, 82, 240, 0.4) 2px 0px,
    //     rgba(46, 82, 240, 0.2) 3px 0px,
    //     rgba(46, 82, 240, 0.2) 4px 0px;

    &:last-child {
        width: 2vw;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    &:first-child {
        width: 2vw;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }
}

// :deep(.el-table__body) {
//     border-collapse: separate;
//     border-spacing: 0 3px;
// }

:deep(.el-table tbody tr) {
    transition: all 0.6s cubic-bezier(0.68, -0.45, 0.265, 1.45);
    height: fit-content;
    border-radius: 4px;

    div.cell {
        text-align: center;
        height: fit-content;
        line-height: 2vh;
        font-size: calc(0.5vw + 0.3vh);
    }

    box-shadow: rgba(46, 82, 240, 0.75) 1px 0px,
    rgba(46, 82, 240, 0.4) 2px 0px,
    rgba(46, 82, 240, 0.2) 3px 0px,
    rgba(46, 82, 240, 0.2) 4px 0px;
}

:deep(.el-table tbody tr:nth-child(2n)) {
    color: rgba(0, 7, 37, 0.9);
    background: rgb(235, 242, 255);
    font-weight: 600;
}

:deep(.el-table__body tr:nth-child(2n):hover > td) {
    // color: hsl(233, 100%, 97%);
    // background: hsl(212, 100%, 78%);
    color: rgba(246, 250, 255, 0.9);
    background: rgb(17, 34, 187);
}

:deep(.el-table tbody tr:nth-child(2n + 1)) {
    color: rgba(0, 7, 37, 0.9);
    background: rgb(179, 221, 255);
    font-weight: 600;
}

:deep(.el-table__body tr:nth-child(2n + 1):hover > td) {
    color: rgba(246, 250, 255, 0.9);
    background: rgb(17, 34, 187);
}

:deep(.el-table tbody tr td:first-child) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

:deep(.el-table tbody tr td:last-child) {
    width: 2vw;
    // background: rgb(252, 251, 255);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

:deep(.el-table tbody tr.highLight-row) {
    background: hsl(210, 70%, 16%);
    animation: shine 2.4s infinite;
}

:deep(.el-table tbody tr.highLight-row:hover > td) {
    cursor: pointer;
}

:deep(.el-input) {
    --el-input-height: 3.6vh;
    font-size: calc(0.6vw + 0.4vh);
}

:deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #6442fa inset;

    &:hover {
        box-shadow: 0 0 0 2px #6442fa inset;
    }
}

:deep(.el-input__wrapper.is_focus) {
    box-shadow: 0 0 0 4px #6442fa inset;
}

:deep(.el-dialog) {
    z-index: 15;
    border-radius: 8px;
}

:deep(div.el-descriptions__title) {
    font-size: calc(0.8vw + 0.6vh);
    color: #021e7a;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
    font-size: calc(0.6vw + 0.3vh);
    text-align: center;
    background-color: rgba(0, 37, 158, 0.8);
    color: rgba(246, 250, 255, 1);
    border-radius: 8px;
    // box-shadow: 0 0 0 1px #dbedff inset;

    &.is-bordered-content {
        text-align: left;
        font-size: calc(0.6vw + 0.3vh);
        color: hsl(224, 97%, 28%);
        box-shadow: 0 0 0 1px #b4a3ff inset;
        background-color: rgb(238, 248, 255);
        font-weight: 600;
    }
}
</style>
