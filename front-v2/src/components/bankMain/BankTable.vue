<template>
    <div class="bank-table-container">
        <div class="bank-table-title">
            <div class="bank-table-icon"></div>
            <div class="table-title-text">预警岸段信息</div>
        </div>
        <el-table
            :data="bankInfo"
            height="38vh"
            style="width: 100%"
            :border="true"
            :row-class-name="rowClassName"
            ref="bankTableDomRef"
            v-loading="tableLoading"
        >
            <el-table-column prop="bankName" label="名称" align="center" />
            <el-table-column prop="riverName" label="所处河段" align="center" />
            <el-table-column
                prop="warningLevel"
                label="预警等级"
                align="center"
            />
        </el-table>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
// import { bankInfo } from './data'
import BackEndRequest from '../../api/backend'

const rowClassName = ref('even-state')
const bankTableDomRef = ref(null)
const tableLoading = ref(true)
const bankInfo = ref([])

// setTimeout(() => {
//     rowClassName.value = 'odd-state'
// }, 3000)

let curRowIndex = 0
let scrollTopVal = 0

onMounted(async () => {
    bankInfo.value = (await BackEndRequest.getBankLineSimpleData()).data
    tableLoading.value = false
    // await nextTick()
    let tableRows = bankTableDomRef.value.$el.querySelectorAll(
        '.el-table__body tbody .el-table__row',
    )
    let rowNumber = bankInfo.value.length
    let scrollBar = bankTableDomRef.value.$el.querySelectorAll(
        '.el-scrollbar__wrap',
    )[0]
    // console.log(scrollBar)

    setInterval(() => {
        // console.log(tableRows, scrollBar)
        if (tableRows.length == 0) {
            tableRows = bankTableDomRef.value.$el.querySelectorAll(
                '.el-table__body tbody .el-table__row',
            )
            scrollBar = bankTableDomRef.value.$el.querySelectorAll(
                '.el-scrollbar__wrap',
            )[0]
            console.log(tableRows, scrollBar)
        } else if (tableRows[curRowIndex].offsetHeight != 0) {
            console.log(111, curRowIndex, rowNumber)

            if (curRowIndex < rowNumber - 2) {
                rowClassName.value =
                    rowClassName.value === 'even-state'
                        ? 'odd-state'
                        : 'even-state'
                // console.log(tableRows[curRowIndex].getBoundingClientRect())
                scrollTopVal +=
                    tableRows[curRowIndex].getBoundingClientRect().height
                // bankTableDomRef.value.scrollTo(0, scrollTopVal)
                scrollBar.scrollTop = scrollTopVal
                curRowIndex += 1
            } else {
                scrollBar.scrollTop = 0
                curRowIndex = 0
                scrollTopVal = 0
                rowClassName.value = 'even-state'
            }
        }
    }, 3000)
})
</script>

<style lang="scss" scoped>
div.bank-table-container {
    position: absolute;
    top: 12.6vh;
    left: 1vw;
    width: 20vw;
    height: 44vh;

    background-color: rgba(0, 61, 192, 1);
    backdrop-filter: blur(5px);

    border: solid 3px #0064e7;
    border-radius: 0.2rem;
    overflow: hidden;

    div.bank-table-title {
        width: 20vw;
        height: 6vh;

        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 0.4vw;

        // border-style: solid;
        border-bottom: inset 2px #0064e7;

        background-color: rgba(0, 61, 192, 1);

        div.bank-table-icon {
            height: 4vh;
            width: 4vh;
            background-image: url('/river.png');
            background-size: contain;
        }

        div.table-title-text {
            width: fit-content;
            height: 6vh;
            line-height: 6vh;
            text-align: center;
            font-size: calc(1vw + 0.3vh);
            font-weight: 600;
            // color: #173eaa;
            color: #e3f4ff;
            text-shadow:
                #173eaa 1px 1px,
                #173eaa 2px 2px,
                #173eaa 3px 3px;
        }
    }
    .el-table {
        background-color: rgba(54, 100, 226, 0.4);
        scroll-behavior: smooth;
        transition: all 1s cubic-bezier(0.68, -0.25, 0.265, 1.15);
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
    border: 1px solid #c6e7f0;
}

:deep(.el-table thead th.el-table__cell) {
    color: #173eaa;
    background: rgba(238, 244, 255, 0.6);
    font-size: calc(0.6vw + 0.3vh);
    height: 2vh;
    div.cell {
        height: 2vh;
        line-height: 2vh;
    }
}

:deep(.el-table tbody tr) {
    transition: all 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.15);
    height: fit-content;
    div.cell {
        height: fit-content;
        line-height: 2vh;
        font-size: calc(0.6vw + 0.2vh);
    }
}

:deep(.el-table tbody tr:nth-child(2n)) {
    &.even-state {
        color: hsl(209, 58%, 39%);
        background: rgb(235, 242, 255);
        font-weight: 600;
    }

    &.odd-state {
        color: rgba(230, 243, 255, 0.9);
        background: rgb(45, 87, 177);
        font-weight: 600;
    }
}

:deep(.el-table__body tr:nth-child(2n):hover > td) {
    background: hsl(210, 70%, 32%);
}

:deep(.el-table tbody tr:nth-child(2n + 1)) {
    &.even-state {
        color: rgba(230, 243, 255, 0.9);
        background: rgb(45, 87, 177);
        font-weight: 600;
    }

    &.odd-state {
        color: hsl(209, 58%, 39%);
        background: rgb(235, 242, 255);
        font-weight: 600;
    }
}

:deep(.el-table__body tr:nth-child(2n + 1):hover > td) {
    background: hsl(210, 70%, 32%);
}

:deep(.el-table tbody tr.highLight-row) {
    background: hsl(210, 70%, 16%);
    animation: shine 2.4s infinite;
}

:deep(.el-table tbody tr.highLight-row:hover > td) {
    cursor: pointer;
}
</style>
