<template>
    <el-dialog v-model="dialogFormVisible" width="18vw" :show-close="false" ref="dialogRef" custom-class="dialog-class"
        :destroy-on-close="true">
        <template #header="{ }">
            <div class="form-header">
                {{ dialogFormTitle }}
            </div>
        </template>
        <el-form :model="dialogInfo[props.type][props.subType]" label-position="top">
            <!-- <el-radio-group v-model="DEMFileType" v-if="props.type === 'model' && props.subType === 'DEM'">
                <el-radio value="tif">tif</el-radio>
                <el-radio value="txt">txt</el-radio>
            </el-radio-group> -->
            <el-form-item v-for="(  item, index  ) in  dialogInfo[props.type][props.subType]  " :key="index"
                :label="item.label" :required="item.required">

                <el-input v-if="item.type === 'input'" v-model="item.value" autocomplete="off" />

                <el-radio-group v-model="item.value" v-else-if="item.type === 'radios'">
                    <el-radio v-for="(_, radioIndex) in item.radioLabelArray" :value='item.radioValueArray[radioIndex]'
                        :key="radioIndex"> {{
                            item.radioLabelArray[radioIndex] }} </el-radio>
                </el-radio-group>

                <el-upload v-else-if="item.type === 'file'" style="height: fit-content;" drag action="#" :multiple="false"
                    :show-file-list="true" ref="uploadRef" :auto-upload="false" :file-list="fileList"
                    :on-preview="handlePreview" :on-remove="handleRemove" :on-change="handleFileChange" accept=".zip"
                    :http-request="handleFileUpload">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text" v-html="uploadDescription"></div>
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
import { ref, onMounted, computed, watch } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import axios from 'axios'
import { resourceUploadNeeded, resourceUploadTitle, fileTypeDict, uploadDescriptionMap } from './bankResource'
import BankResourceHelper from '../modelStore/views/bankResourceHelper';
import { useResourceStore } from '../../store/resourceStore';


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
    attachInfo: {
        type: Object,
        default: {}
    }
})
const dialogRef = ref(null)

const resourceStore = useResourceStore()


watch(() => props.attachInfo, (val, oldVal) => {
    console.log('attachInfo changed', val)
    if (val.configRadioValue) { //从配置列表中的占位行点击了上传
        dialogInfo.value[props.type][props.subType][1].value = val.configRadioValue
    }
})


///////////////// special //////////////////
// const DEMFileType = ref('txt')



///////////////// dialog info ////////////////
const dialogFormVisible = ref(false)
const dialogFormTitle = computed(() => {
    return resourceUploadTitle[props.type][props.subType] + '上传'
})

const dialogInfo = ref(resourceUploadNeeded)


//////////////// upload /////////////////////
const uploadRef = ref(null)
const fileList = ref([])
const upLoading = ref(false)
const uploadingStart = () => {
    upLoading.value = true
    ElMessage.info({
        message: '文件正在上传中,请稍后...',
        offset: 100
    })
    dialogFormVisible.value = false
}

const handlePreview = (file) => {
    console.log('preview! ', file)
}
const handleRemove = (file, fileList) => {
    console.log('remove! ', file, fileList)
    console.log('Cancel the transfer! ', file.name)
}
let formData = null
let requestInfoFromJsonFile = null
const handleFileChange = (file) => {
    console.log('file change!')
}
const handleFileUpload = (file) => {
    console.log('handleFileUpload!!', file, fileList.value)

    console.log(props.type, props.subType)
    console.log(dialogInfo.value[props.type][props.subType])

    if (props.type === 'device') {
        // 前端解析json后构建请求体
        uploadingStart()
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            try {
                ////// request body
                let fileContent = JSON.parse(e.target.result)
                console.log(fileContent)
                requestInfoFromJsonFile = Object.assign({}, fileContent)

                ////// http request
                if (requestInfoFromJsonFile) {
                    BankResourceHelper.uploadBankDevice(requestInfoFromJsonFile, props.bankEnName).then(res => {
                        setTimeout(() => {
                            normalSuccessCallback(res)
                        }, 3000);
                    }).catch(err => {
                        normalFailCallback(err)
                    })
                }

            } catch (err) {
                console.log(err)
                normalFailCallback(err)
                ElMessage.error({
                    message: '请上传正确的设备配置文件！',
                    offset: 100
                })
            }
        }
        fileReader.readAsText(file.file)
    }
    else if (props.type === 'model') {
        // 上传文件至后端
        upLoading.value = true
        uploadingStart()


        ///// file info 
        const fileInfo = parseInfoFromArray(dialogInfo.value[props.type][props.subType])
        if (!fileInfo) {
            upLoading.value = false
            return
        }

        // next process of fileInfo
        const [fileName, fileType] = extractFileNameAndType(file.file.name)
        fileInfo['name'] = fileName
        if (props.subType === 'DEM')
            fileInfo['fileType'] = fileType === 'txt' ? fileType : 'tiff'

        // addon in 2024 11 29
        fileInfo['year'] = fileInfo['year'] || '2023'
        fileInfo['month'] = fileInfo['month'] || '04'
        fileInfo['set'] = fileInfo['set'] || 'standard'
        fileInfo['description'] = fileInfo['description'] || ''
        
        console.log(fileInfo)


        ///// build form data
        formData = new FormData()
        formData.append('file', file.file)
        formData.append('info', JSON.stringify(fileInfo))


        console.log(fileInfo)

        /// http request
        if (props.subType == 'Section') {
            BankResourceHelper.uploadBankSectionResourceFile(formData).then(res => {
                if (res.data == "数据资源已存在！") {
                    normalFailCallback(res)
                } else {
                    normalSuccessCallback(res)
                }
            }).catch(err => {
                normalFailCallback(err)
            })
        } else {

            if (props.subType == 'Config') {
                let _realSubType = "Boundary"
                if (dialogInfo.value[props.type][props.subType][1].value === _realSubType) {
                    const _name = dialogInfo.value[props.type][props.subType][0].value ?
                        dialogInfo.value[props.type][props.subType][0].value : 'Boundary'
                    const info = {
                        'name': _name,
                        'fileType': fileTypeDict[props.type][_realSubType],
                        'segment': props.bankEnName,
                        'category': _realSubType,
                        'year': '2023',// 写死了, 参数文件应不必要年份月份
                        'month': '04', // 写死了, 参数文件应不必要年份月份
                        'set': 'standard',// 工况集这个概念前端体现不明显, 默认standard
                        'description': '',
                    }
                    console.log(info)
                    // 更新info
                    formData.delete('info')
                    formData.append('info', JSON.stringify(info))
                }
            }

            BankResourceHelper.uploadBankCalculateResourceFile(formData).then(res => {
                normalSuccessCallback(res)
            }).catch(err => {
                normalFailCallback(err)
            })
        }

    }
    else if (props.type === 'visual') {

        upLoading.value = true
        uploadingStart()
        ////// file info
        const fileInfo = {}
        const needed = dialogInfo.value[props.type][props.subType]
        needed.forEach(item => {
            if (!item.enName.includes('file')) fileInfo[item.enName] = item.value
        })
        // 补充
        fileInfo['segment'] = props.bankEnName
        if (fileInfo['fields'] === "") delete fileInfo['fields']

        ////// build form data
        formData = new FormData()
        formData.append('file', file.file)
        formData.append('info', JSON.stringify(fileInfo))

        ////// http request
        BankResourceHelper.uploadBankVisualResourceFile(formData, props.bankEnName).then(res => {
            normalSuccessCallback(res)
        }).catch(err => {
            normalFailCallback(err)
        })

    }

}
const cancleUploadHandler = () => {
    dialogFormVisible.value = false
}
const confirmUploadHandler = (e) => {

    // console.log(' uploadRef.value!',  uploadRef.value[0])
    // uploadRef.value && uploadRef.value.map((item) => item.submit())

    uploadRef.value && uploadRef.value[0].submit()

}





//////////////// 上传时的文本描述 //////////////////
const stringToHTML = (str) => {
    var dom = document.createElement('span');
    dom.innerHTML = str;
    return dom;
}

const uploadDescription = computed(() => {
    if (props.type === 'model' && props.subType === 'Config') {
        if (dialogInfo.value[props.type][props.subType][1].value === "Boundary") {
            return stringToHTML(uploadDescriptionMap[props.type][props.subType][1]).innerHTML
        }
        return stringToHTML(uploadDescriptionMap[props.type][props.subType][0]).innerHTML
    }
    return stringToHTML(uploadDescriptionMap[props.type][props.subType]).innerHTML
})




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

    // 水动力工况需要提供边界文件
    let boundaryPath
    if (props.subType === 'Hydrodynamic') {
        try {
            console.log(resourceStore.resourceInfo['模型资源管理'][1]["resourceList"][2]["path"])
            boundaryPath = resourceStore.resourceInfo['模型资源管理'][1]["resourceList"][2]["path"]
        } catch (e) {
            ElMessage.error('请先上传岸段边界矢量文件!')
            return false
        }
    }
    const obj = {}
    arr.forEach(item => {
        if (!item.enName.includes('file')) obj[item.enName] = item.value
    })
    // 补充
    obj['segment'] = props.bankEnName
    obj['fileType'] = fileTypeDict[props.type][props.subType]
    obj['category'] = props.subType
    obj['temp'] = false
    obj['boundary'] = boundaryPath
    return obj
}
/**
 * 从 "aaa.bbb"的文件名中提取 "aaa"
 * @param {string} res 
 */
const extractFileNameAndType = (res) => {
    const arr = res.split('.')
    return [arr[0], arr[1]]
}



const normalSuccessCallback = (res) => {
    ElMessage.success({ message: '上传成功！', offset: 100 })
    console.log('上传成功！', res.data)
    dialogFormVisible.value = false
    BankResourceHelper.refreshBankResource(resourceStore.resourceInfo, props.bankEnName, props.type, props.subType)
    upLoading.value = false
}
const normalFailCallback = (err) => {
    ElMessage.error({ message: '上传失败！', offset: 100 })
    console.error('上传失败！', err)
    BankResourceHelper.refreshBankResource(resourceStore.resourceInfo, props.bankEnName, props.type, props.subType)
    upLoading.value = false
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
    letter-spacing: .3rem;
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