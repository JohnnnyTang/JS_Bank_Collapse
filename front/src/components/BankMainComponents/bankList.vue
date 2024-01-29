<template>
    <div class="bankListDIV">
        <h3>崩岸预警信息</h3>
        <el-table :data="tableData" size="small" style="width: 18vw; height: 42vh; margin: 0vw 1vw"
            @row-dblclick="rowDoubleClick" v-loading="loading" :row-class-name="tableRowClassName">
            <el-table-column prop="bankName" label="名称" align="center" />
            <el-table-column prop="riverName" label="所处河段" align="center" />
            <el-table-column prop="warningLevel" label="预警等级" align="center" />
        </el-table>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import BackEndRequest from '../../api/backendIns';

let tableData = ref([]);
const loading = ref(true);

const emit = defineEmits(['showChange']);

const rowDoubleClick = (item) => {
    emit('showChange', {
        showFather: false,
        showChild: true,
        childInfo: item,
    });
};
watch(tableData, (val) => {
    if (tableData.value != []) loading.value = false;
});


const tableRowClassName = (row) => {
    if (row.row.bankName === '民主沙') {
        return 'highLight-row'
    }
}

onMounted(async () => {
    let data = (await BackEndRequest.getbankLineData()).data
    let mzsIndex = data.findIndex((element) => element.bankName === '民主沙')
    let mzsItem = data.find((element) => element.bankName === '民主沙')
    data.splice(mzsIndex, 1)
    data.unshift(mzsItem)
    tableData.value = data;

});
</script>

<style lang="scss" scoped>
.bankListDIV {
    width: 20vw;
    height: 50vh;
    background-color: hsl(210, 30%, 14%);
    border-radius: 1vh;
    box-shadow: 0px 0px 8px 4px hsla(210, 70%, 12%, 0.7);

    h3 {
        text-align: center;
        margin-top: 1vh;
        margin-bottom: 2vh;
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

    :deep(.el-table tbody tr.highLight-row) {
        background: hsl(210, 70%, 16%);
        animation: shine 2.4s infinite;
    }

    :deep(.el-table tbody tr.highLight-row:hover > td) {
        cursor: pointer;
    }

    @keyframes shine {

        0%,
        100% {
            color: #ffd900;
            text-shadow: 0 0 10px #fffb06, 0 0 10px #fffb06;
            font-size: large;
        }

        50% {
            text-shadow: 0 0 10px #eeebdd, 0 0 10px #eeebdd;
            font-size: medium;
        }
    }

}</style>
