<template>
    <el-dialog v-model="dialogFormVisible" width="20vw" :show-close="false" v-if="props.type === 'model'">
        <template #header="{ titleId, titleClass }">
            <div class="form-header">
                {{ dialogFormTitle }}
            </div>
        </template>
        <el-form :model="dialogInfo">
            <el-form-item v-for="(  item, index  ) in   dialogInfo  " :key="index" :label="item.label">
                <el-input v-model="item.value" autocomplete="off" />
            </el-form-item>
        </el-form>
        <el-upload style="height: fit-content;" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :multiple="false" :show-file-list="true">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                <em>拖拽文件至此处</em>或<em>点击</em>进行上传
            </div>
        </el-upload>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancleUploadClickHandler">取消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
    type: {
        type: String,
        default: 'model'
    },
    subType: {
        type: String,
        default: 'DEM'
    }
})


///////////////// dialog info ////////////////
const dialogFormVisible = ref(false)
const dialogFormTitle = computed(() => {
    const titleMap = {
        'model': {
            'DEM': '地形数据',
            'Hydrodynamic': '水动力预算工况数据',
            'Boundary': '岸段边界数据',
            'Config': '配置数据'
        }
    }
    return titleMap[props.type][props.subType]
})
const dialogInfo = ref({
    'model': [
        {
            label: '文件名',
            enName: 'name',
            value: ''
        },
        {
            label: '年份',
            enName: 'year',
            value: '2023'
        },
        {
            label: '月份',
            enName: 'month',
            value: '04'
        },
        {
            label: '工况集',
            enName: 'set',
            value: 'standard'
        },
        {
            label: '备注',
            enName: 'description',
            value: ''
        },
    ]
})

//////////////// upload /////////////////////
const cancleUploadClickHandler = () => {
    dialogFormVisible = false
}
const confirmUploadHandler = (res) => {
    dialogFormVisible = false
}

</script>

<style lang="scss" scoped></style>