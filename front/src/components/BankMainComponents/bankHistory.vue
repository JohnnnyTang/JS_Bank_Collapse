<template>
    <div class="historyDIV">
        <h3>历史崩岸信息</h3>
        <el-table :data="tableData" max-height="300" size="small" style="width: 100%; height: 300px; font-size: 10px;" border:true 
        :row-style="{height:'20px'}"  :cell-style="{padding:'0px'}">
            <el-table-column prop="时间" label="时间" width="80" align="center" />
            <el-table-column prop="崩岸地点" label="崩岸地点" width="60" align="center" />
            <el-table-column prop="崩岸类型" label="崩岸类型" width="60" align="center" />
            <el-table-column prop="岸别" label="岸别" width="60" align="center" />
            <el-table-column prop="所在河段" label="所在河段" width="60" align="center" />
        </el-table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { historyInfo } from '../../utils/geojson/monitordata';

const tableData = ref([])
onMounted(async () => {
    tableData.value = historyInfo
})

</script>

<style lang="scss" scoped>
.historyDIV {
    width: 320px;
    height: 350px;
    background-color: rgba(51, 63, 88, 0.719);

    // border-radius: 30px;
    box-shadow: 5px 5px 8px rgb(60, 60, 60),
        -5px -5px 8px rgb(60, 60, 60);

    h3{
        margin-top: 1vh;
        margin-bottom: 1vh;
        text-align: center;
    }

}
</style>