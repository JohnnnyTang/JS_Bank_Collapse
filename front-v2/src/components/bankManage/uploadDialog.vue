<template>
    <el-dialog v-model="dialogFormVisible" width="18vw" :show-close="false" v-if="props.type === 'model'" ref="dialogRef"
        custom-class="dialog-class">
        <template #header="{ titleId, titleClass }">
            <div class="form-header">
                {{ dialogFormTitle }}
            </div>
        </template>
        <el-form :model="dialogInfo[props.type]">
            <el-form-item v-for="(  item, index  ) in  dialogInfo[props.type]  " :key="index" :label="item.label">
                <el-input v-model="item.value" autocomplete="off" />
            </el-form-item>
        </el-form>
        <el-upload style="height: fit-content;" drag action="#" :multiple="false" :show-file-list="true" ref="uploadRef"
            :auto-upload="false" :file-list="fileList" :on-preview="handlePreview" :on-remove="handleRemove"
            :http-request="handleFileUpload">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                <em>拖拽文件至此处</em>或<em>点击</em>进行上传
            </div>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过500kb</div> -->
        </el-upload>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancleUploadHandler">取消</el-button>
                <el-button type="primary" @click="confirmUploadHandler">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElLoading } from 'element-plus'
import axios from 'axios'

const props = defineProps({
    type: {
        type: String,
        default: 'model'
    },
    subType: {
        type: String,
        default: 'DEM'
    },
    bankEnName: {
        type: String,
        default: 'Mzs'
    },
})
const dialogRef = ref(null)

///////////////// dialog info ////////////////
const dialogFormVisible = ref(false)
const dialogFormTitle = computed(() => {
    const titleMap = {
        'model': {
            'DEM': '地形数据',
            'Hydrodynamic': '预算工况数据',
            'Boundary': '岸段边界数据',
            'Config': '配置数据'
        }
    }
    return titleMap[props.type][props.subType] + '上传'
})
const segment = computed(() => {
    return props.bankEnName
})
const fileType = computed(() => {
    const fileTypeMap = {
        'model': {
            'DEM': 'tiff',
            'Hydrodynamic': 'Hydrodynamic',
            'Boundary': 'shapefile',
            'Config': 'json'
        }
    }
    return fileTypeMap[props.type][props.subType]
})
const category = computed(() => {
    return props.subType
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
const uploadRef = ref(null)
const fileList = ref([])
const upLoading = ref(false)
let loadingInstance = null
watch(upLoading, (val) => {
    if (val) {
        loadingInstance = ElLoading.service({ target: '.dialog-class', text: '正在上传中...', lock: true, background: 'rgba(255, 255, 255, 0.715)', parent: dialogRef.value })
    } else {
        loadingInstance.close()
    }
})

const handlePreview = (file) => {
    console.log('preview! ', file)
}
const handleRemove = (file, fileList) => {
    console.log('remove! ', file, fileList)
    console.log('Cancel the transfer! ', file.name)
}
const handleFileUpload = (file) => {
    // post info to server
    upLoading.value = true
    // file info 
    const fileInfo = parseInfoFromArray(dialogInfo.value[props.type])
    console.log('fileInfo!!', fileInfo)
    // build form data
    const formData = new FormData()
    formData.append('file', file.file)
    formData.append('info', JSON.stringify(fileInfo))
    console.log('formData!!', formData)


    axios.post('/model/data/bankResource/up/modelServer/resource/file', formData).then(res => {
        console.log('上传成功！', res)
        dialogFormVisible.value = false
        upLoading.value = false
    }).catch(err => {
        console.error('上传失败！', err)
    })
    setTimeout(() => {
        upLoading.value = false
        // dialogFormVisible.value = false
    }, 1000)
}
const cancleUploadHandler = () => {
    dialogFormVisible.value = false
}
const confirmUploadHandler = (res) => {
    uploadRef.value.submit()
    // dialogFormVisible.value = false
}





//////////////// expose ////////////////////
defineExpose({
    dialogFormVisible
})




//////////////// helper ///////////////////
/**
 * 解析数组并返回对象
 * @param {Object[]} arr - 包含文件信息的数组
 * @param {string} arr[].label - 文件的标签
 * @param {string} arr[].enName - 文件的英文名称
 * @param {string} arr[].value - 文件的值
 * @returns {Object} - 解析后的对象
 */
const parseInfoFromArray = (arr) => {
    const obj = {}
    arr.forEach(item => {
        obj[item.enName] = item.value
    })
    // 补充
    obj['segment'] = segment.value
    obj['fileType'] = fileType.value
    obj['category'] = category.value
    return obj
}
</script>

<style lang="scss" scoped>
:deep(.el-form) {
    background-color: red;
}

div.form-header {
    position: relative;
    height: 4vh;
    margin-top: -1vh;
    text-align: center;
    font-size: calc(0.9vw + 1vh);
    color: #0539a8;
    letter-spacing: .3rem;
    font-weight: 800;
}
</style>