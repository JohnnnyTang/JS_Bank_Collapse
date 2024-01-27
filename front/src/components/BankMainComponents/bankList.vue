<template>
    <div class="bankListDIV">
        <h3>崩岸预警信息</h3>
        <el-table
            :data="tableData"
            size="small"
            style="width: 18vw; height: 42vh; margin: 0vw 1vw"
            @row-dblclick="rowDoubleClick"
            v-loading="loading"
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
import { defineEmits, onBeforeMount, onMounted, ref, watch } from 'vue';
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

onBeforeMount(async () => {
    tableData.value = (await BackEndRequest.getbankLineData()).data;
});

onMounted(async () => {
    // tableData.value = (await BackEndRequest.getbankLineData()).data
});
</script>

<style lang="scss" scoped>
.bankListDIV {
    width: 20vw;
    height: 50vh;
    background-color: hsl(210, 70%, 20%);
    border-radius: 2vh;
    box-shadow: 0px 0px 8px 4px hsla(210, 70%, 12%, 0.7);

    h3 {
        text-align: center;
        margin-top: 1vh;
        margin-bottom: 2vh;
        color: hsl(210, 70%, 90%);
    }

    :deep(.el-table th.el-table__cell.is-leaf) {
        border: 0px solid black;
    }

    :deep(.el-table thead th.el-table__cell) {
        background: hsl(210, 70%, 90%);
    }

    :deep(.el-table tbody tr:hover) {
        background: hsl(210, 70%, 60%);
    }

    :deep(.el-table tbody tr:nth-child(2n)) {
        color: hsl(210, 70%, 30%);
        background: hsl(210, 70%, 90%);
    }

    :deep(.el-table tbody tr:nth-child(2n + 1)) {
        color: hsl(210, 70%, 90%);
        background: hsl(210, 70%, 30%);
    }
}
</style>
