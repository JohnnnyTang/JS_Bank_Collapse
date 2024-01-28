<template>
    <div class="historyDIV">
        <h3>历史崩岸信息</h3>
        <el-table
            :data="tableData"
            size="small"
            style="width: 24vw; height: 42vh; margin: 0vw 1vw"
            :row-style="{ height: '20px' }"
            :cell-style="{ padding: '0px' }"
            v-loading="loading"
        >
            <el-table-column prop="时间" label="时间" align="center" />
            <el-table-column prop="崩岸地点" label="崩岸地点" align="center" />
            <el-table-column prop="崩岸类型" label="崩岸类型" align="center" />
            <el-table-column prop="岸别" label="岸别" align="center" />
            <el-table-column prop="所在河段" label="所在河段" align="center" />
            <!-- <el-table-column prop="time" label="时间" align="center" />
            <el-table-column prop="place" label="崩岸地点" align="center" />
            <el-table-column prop="type" label="崩岸类型" align="center" />
            <el-table-column prop="side" label="岸别" align="center" />
            <el-table-column prop="river" label="所在河段" align="center" /> -->
        </el-table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { historyInfo } from '../../utils/geojson/monitordata';
import BackEndRequest from '../../api/backendIns';

const tableData = ref([]);
const loading = ref(true)
onMounted(async () => {
    tableData.value = historyInfo;
    // const historydata = (await BackEndRequest.getHistoryInfo()).data
    // console.log(historydata);
    loading.value = false
    // tableData.value = historydata;
});
</script>

<style lang="scss" scoped>
.historyDIV {
    width: 26vw;
    height: 50vh;
    background-color: hsl(210, 30%, 14%);
    border-radius: 1vh;
    box-shadow: 0px 0px 8px 4px hsla(210, 70%, 12%, 0.7);

    h3 {
        margin-top: 2vh;
        margin-bottom: 1vh;
        text-align: center;
        color: hsl(210, 70%, 90%);
    }

    :deep(.el-table__inner-wrapper::before) {
        background: hsl(210, 70%, 30%);
    }

    :deep(.el-table .el-table__cell) {
        border: 0px solid black;
    }

    :deep(.el-table thead th.el-table__cell) {
        color: hsl(210, 70%, 90%);
        background: hsl(210, 70%, 20%);
    }

    :deep(.el-table tbody tr:nth-child(2n)) {
        color: hsl(210, 70%, 90%);
        background: hsl(210, 70%, 24%);
    }

    :deep(.el-table__body tr:nth-child(2n):hover > td) {
        background: hsl(210, 70%, 32%);
    }

    :deep(.el-table tbody tr:nth-child(2n + 1)) {
        color: hsl(210, 70%, 90%);
        background: hsl(210, 70%, 16%);
    }

    :deep(.el-table__body tr:nth-child(2n + 1):hover > td) {
        background: hsl(210, 70%, 32%);
    }
}
</style>
