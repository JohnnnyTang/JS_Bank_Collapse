<template>
    <el-dialog v-model="dialogFormVisible" width="18vw" :show-close="false" ref="dialogRef" :destroy-on-close="true">
        <template #header="{ titleId, titleClass }">
            <div class="form-header">
                知识库文件上传
            </div>
        </template>
        <el-form :model="dialogForm" label-position="left">

            <el-form-item :label="'文件名'">
                <el-input v-model="dialogForm.name" autocomplete="off" />
            </el-form-item>

            <el-form-item :label="'文件类型'">
                <el-radio-group v-model="dialogForm.type">
                    <el-radio value="pdf">文档(pdf)</el-radio>
                    <el-radio value="picture">图片(png)</el-radio>
                    <el-radio value="video">视频(mp4)</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item :label="'存储路径'" :required="true">
                <el-tag v-for="tag in dialogForm.dirPath" :key="tag" closable :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{ tag }}
                </el-tag>
                <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
                    @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                <el-button v-else class="button-new-tag" size="small" @click="showInput">
                    + 新建路径
                </el-button>
            </el-form-item>

            <el-form-item :label="'文件上传'" :required="true">
                <el-upload style="height: fit-content;" drag action="#" :limit="1" :on-exceed="handleExceed"
                    :on-change="handleChange" :show-file-list="false" ref="uploadRef" :auto-upload="false"
                    :http-request="handleFileUpload">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        <em>拖拽文件至此处</em>或<em>点击</em>进行上传
                    </div>
                </el-upload>
            </el-form-item>


        </el-form>


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
import { ref, onMounted, computed, watch, reactive, nextTick } from 'vue'
import { ElMessage, genFileId } from 'element-plus'
import KnowStoreHelper, { MIME_TYPE } from '../knowStoreHelper'


const props = defineProps({
    info: {
        type: Object,
        default: {
            name: '',
            dirPath: [],
            type: '',
        }
    },
})
const emit = defineEmits(['uploadSuccess'])

watch(() => props.info.dirPath, (newVal, oldVal) => {
    const newDirPath = dpCpy(newVal)
    dialogForm.dirPath = newDirPath
})

///////////////// dialog & form ////////////////
const dialogFormVisible = defineModel('uploadShow')
const dialogRef = ref(null)

const dialogForm = reactive({
    name: props.info.name,
    dirPath: props.info.dirPath,
    type: props.info.type,
}, { deep: true })

////// dynamic tags //////
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag) => {
    dialogForm.dirPath.splice(dialogForm.dirPath.indexOf(tag), 1)
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}

const handleInputConfirm = () => {
    inputValue.value && dialogForm.dirPath.push(inputValue.value)
    inputVisible.value = false
    inputValue.value = ''
}


//////////////// upload /////////////////////
const uploadRef = ref(null)

const handleExceed = (files) => {
    uploadRef.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadRef.value.handleStart(file)
}
const handleChange = (file) => {
    const name = extractFileNameAndType(file.name)[0]
    const type = MIME_TYPE[file.raw.type]

    dialogForm.name = name
    dialogForm.type = type

}
const handleFileUpload = (file) => {
    info('开始上传，请稍后...')
    const theFile = file.file
    const theInfo = dialogForm
    KnowStoreHelper.uploadOneFile(theFile, theInfo).then((res) => {
        success(res.data)
        dialogFormVisible.value = false
        emit('uploadSuccess')
    })


}
const cancleUploadHandler = () => {
    dialogFormVisible.value = false
}
const confirmUploadHandler = (e) => {
    uploadRef.value.submit()
}





//////////////// helper ///////////////////

/**
 * 从 "aaa.bbb"的文件名中提取 "aaa"
 * @param {string} res 
 */
const extractFileNameAndType = (res) => {
    const arr = res.split('.')
    return [arr[0], arr[1]]
}
const dpCpy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}


const normalSuccessCallback = (res) => {
    ElMessage.success({ message: '上传成功！', offset: 100 })
    dialogFormVisible.value = false
}
const normalFailCallback = (err) => {
    console.error('上传失败！', err)
    ElMessage.error({ message: '上传失败！', offset: 100 })
}

const info = (msg) => {
    ElMessage.info({
        message: msg,
        offset: 100
    })
}
const success = (msg) => {
    ElMessage.success({
        message: msg,
        offset: 100
    })
}
</script>

<style lang="scss" scoped>
div.form-header {
    position: relative;
    height: 4vh;
    margin-top: -1vh;
    text-align: center;
    font-size: calc(0.9vw + 1vh);
    color: #0539a8;
    letter-spacing: .1rem;
    font-weight: 800;
}

:deep(.el-form-item) {
    label {
        font-size: calc(0.6vw + 0.5vh);
        font-weight: 600;
    }
}

:deep(.el-form-item__label) {
    font-size: calc(0.6vw + 0.5vh);
    font-weight: 600;
}
</style>