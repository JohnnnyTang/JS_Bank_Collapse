<template>
    <div class="bankListDIV">
        <h3>崩岸预警信息</h3>
        <el-table :data="tableData" max-height="300" size="small" style="width: 100%; height: 300px; "
            @row-dblclick="rowDoubleClick" border:true v-loading="loading">
            <el-table-column prop="bankName" label="名称" width="100" align="center" />
            <el-table-column prop="riverName" label="所处河段" width="80" align="center" />
            <el-table-column prop="warningLevel" label="预警等级" width="80" align="center" />
        </el-table>

    </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount, watch } from 'vue';
import BackEndRequest from "../../api/backendIns"

let tableData = ref([])
const loading = ref(true)

const emit = defineEmits(['showChange'])

const rowDoubleClick = (item) => {

    emit('showChange',{
        showFather:false,
        showChild:true,
        childInfo:item
    })
}
watch(tableData,(val)=>{
    if(tableData.value!=[])
        loading.value = false
})

onBeforeMount(async () => {
    tableData.value = (await BackEndRequest.getbankLineData()).data
})

onMounted(async () => {
    // tableData.value = (await BackEndRequest.getbankLineData()).data
})




</script>

<style lang="scss" scoped>
.bankListDIV {
    width: 20vw;
    height: 50vh;
    background-color: rgba(144, 175, 194, 0.418);
    border-radius: 2vh;

    h3 {
        text-align: center;
        margin-top: 1vh;
        margin-bottom: 1vh;
    }

    // .bankListChildDIV {
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     z-index: 1;
    // }

}
</style>