<template>
    <div class="warn-table-container">
        <div class="warn-table-header">
            {{ nameMap[curWarnItem] + '-数据预警情况' }}
        </div>
        <div class="warn-table-content">
            <el-table
                :data="tableDataMap[curWarnItem]"
                stripe
                style="width: 100%"
                height="83vh"
            >
                <el-table-column
                    v-for="(key, index) in columnListA"
                    :key="index"
                    :prop="columnPropMap[key]"
                    :label="key"
                />
                <el-table-column label="预警类型">
                    <template #default="scope">
                        <el-button
                            size="large"
                            style="
                                font-weight: bold;
                                background-color: rgb(32, 181, 13);
                                color: aliceblue;
                                font-size: calc(0.4vw + 0.6vh);
                            "
                            @click="handleEdit(scope.$index, scope.row)"
                            >正常</el-button
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="(key, index) in columnListB"
                    :key="index"
                    :prop="columnPropMap[key]"
                    :label="key"
                />
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

const route = useRoute()

const curWarnItem = ref('')

const nameMap = {
    gnss: 'GNSS',
    inclinometer: '测斜仪',
    manometer: '孔隙水压力计',
    stress: '应力桩',
    risk: '实时风险',
    stable: '岸坡稳定',
}

const columnListA = ['名称', '预警原因', '预警时间']

const columnListB = ['处理状态', '处理时间', '处理方式']

const columnPropMap = {
    名称: 'name',
    预警原因: 'cause',
    预警时间: 'time',
    预警类型: 'type',
    处理状态: 'status',
    处理时间: 'dealTime',
    处理方式: 'method',
}

const tableDataMap = reactive({
    '': [],
    gnss: [
        {
            name: 'CL-01',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-02',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-03',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-04',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-05',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-06',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-07',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-08',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-09',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CL-10',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
    ],
    inclinometer: [
        {
            name: 'CX-01',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CX-02',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CX-03',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CX-04',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CX-05',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CX-06',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CX-07',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CX-08',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'CX-09',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
    ],
    manometer: [
        {
            name: 'KX-01',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'KX-02',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'KX-03',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'KX-04',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'KX-05',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'KX-06',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'KX-07',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'KX-08',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'KX-09',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
    ],
    stress: [
        {
            name: 'YL-01',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'YL-02',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'YL-03',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'YL-04',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'YL-05',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'YL-06',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'YL-07',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
    ],
    risk: [
        {
            name: 'JC-01',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-02',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-03',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-04',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-05',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-06',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-07',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-08',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-09',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-10',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-11',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-12',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-13',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
    ],
    stable: [
        {
            name: 'JC-01',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-02',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-03',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-04',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-05',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-06',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-07',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-08',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-09',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-10',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-11',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-12',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
        {
            name: 'JC-13',
            cause: '-',
            time: '-',
            type: '正常',
            status: '-',
            dealTime: '-',
            method: '-',
        },
    ],
})

onBeforeRouteUpdate((to, from) => {
    curWarnItem.value = to.params.id
})

onMounted(() => {
    curWarnItem.value = route.params.id
    console.log(tableDataMap[curWarnItem.value])
})
</script>

<style lang="scss" scoped>
div.warn-table-container {
    position: absolute;
    left: 12.5vw;
    top: 1vh;

    width: 87vw;
    height: 90vh;

    background-color: rgb(210, 239, 255);
    border-radius: 12px;

    div.warn-table-header {
        height: 6vh;
        width: 85vw;
        margin-left: 1vw;

        text-align: center;
        line-height: 6vh;
        font-size: calc(0.7vw + 0.8vh);
        font-weight: bold;

        border-bottom: 2px solid #0530a8;
    }

    div.warn-table-content {
        width: 85vw;
        height: 83vh;
        margin-left: 1vw;
        margin-top: 0.5vh;
        background-color: #0530a8;
    }
}

:deep(.el-table__inner-wrapper::before) {
    background: hsl(210, 70%, 30%);
}

:deep(.el-table__border-left-patch) {
    background: transparent;
}

:deep(.el-table .el-table__cell) {
    border: 1px solid #c0cfff;
}

:deep(.el-table thead th.el-table__cell) {
    color: #032b99;
    background: rgba(161, 194, 255, 0.8);
    font-size: calc(0.6vw + 0.5vh);
    height: 3vh;
    border: 1px solid #1339b8;
    div.cell {
        height: 3vh;
        line-height: 3vh;
        text-align: center;
    }
}

:deep(.el-table tbody tr) {
    transition: all 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.15);
    height: fit-content;
    div.cell {
        height: fit-content;
        line-height: 2vh;
        font-size: calc(0.6vw + 0.2vh);
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        font-weight: bold;
        text-align: center;
        color: #044999;
    }
}

:deep(.el-table__body tr:hover td) {
    background: hsl(210, 100%, 16%);
    color: #0c0052;
    font-weight: bold;
}
</style>
