<template>
    <el-dialog v-model="dialogFormVisible" width="18vw" :show-close="false" ref="dialogRef" custom-class="dialog-class"
        :destroy-on-close="true">
        <template #header="{ }">
            <div class="form-header">
                {{ dialogFormTitle }}
            </div>
        </template>
        <el-form v-if="props.type === 'device'" :model="deviceInfo">
            <el-form-item v-for="(  key, idx  ) in  Object.keys(deviceInfo) " :key="idx" :label="deviceInfo[key].label">

                <el-input v-if="deviceInfo[key].type === 'input'"
                    v-model="dialogValues[deviceInfo[key]['mappedMonitorInfoField']]" autocomplete="off" />

                <el-radio-group v-model="dialogValues[deviceInfo[key]['mappedMonitorInfoField']]"
                    v-else-if="deviceInfo[key]['type'] === 'radios'">
                    <el-radio v-for="(_, radioIndex) in deviceInfo[key].radioLabelArray"
                        :value='deviceInfo[key].radioValueArray[radioIndex]' :key="radioIndex"> {{
                            deviceInfo[key].radioLabelArray[radioIndex] }} </el-radio>
                </el-radio-group>

            </el-form-item>
        </el-form>

        <!-- <el-form :model="dialogInfo[props.type][props.subType]">
            <el-form-item v-for="(  item, index  ) in  dialogInfo[props.type][props.subType]  " :key="index"
                :label="item.label" label-position="top" :label-width="'3vw'">

                <el-input v-if="item.type === 'input'" v-model="dialogValues[item.enName]" autocomplete="off" />

                <el-radio-group v-model="dialogValues[item.enName]" v-else-if="item.type === 'radios'">
                    <el-radio v-for="(_, radioIndex) in item.radioLabelArray" :value='item.radioValueArray[radioIndex]'> {{
                        item.radioLabelArray[radioIndex] }} </el-radio>
                </el-radio-group>

            </el-form-item>
        </el-form> -->


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
import { resourceUploadTitle, fileTypeDict, deviceCategoryUploadInfo } from './bankResource'
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
    resourceItemInfo: {
        type: Object,
        default: {}
    }
})
const dialogRef = ref(null)
const resourceStore = useResourceStore()

////////////////// uploading component ////////
const upLoading = ref(false)
let loadingInstance = null
watch(upLoading, (val) => {
    if (val) {
        loadingInstance = ElLoading.service({ target: '.dialog-class', text: '正在上传中...', lock: true, background: 'rgba(255, 255, 255, 0.715)', parent: dialogRef.value })
    } else {
        loadingInstance.close()
    }
})




///////////////// dialog info ////////////////
const dialogFormVisible = ref(false)
const dialogFormTitle = computed(() => {
    return resourceUploadTitle[props.type][props.subType] + '更新'
})
const itemInfoCpy = props.resourceItemInfo._rawValue
const dialogValues = ref(itemInfoCpy)

watch(props.resourceItemInfo, (newVal, oldVal) => {
    const copyValue = Object.assign({}, newVal)
    dialogValues.value = copyValue
})


const deviceInfo = ref(deviceCategoryUploadInfo)


//////////////// upload /////////////////////


const cancleUploadHandler = () => {
    dialogFormVisible.value = false
}

const confirmUploadHandler = (res) => {

    if (props.type === 'device') {
        console.log('dialogValues', dialogValues.value)

        const newInfo = {
            "aspect": dialogValues.value.sectionId,
            "deviceId": dialogValues.value.machineId,
            "deviceName": dialogValues.value.name,
            "type": dialogValues.value.type,
            "longitude": dialogValues.value.longitude,
            "latitude": dialogValues.value.latitude,
            "elevation": dialogValues.value.elevation,
        }
        const code = dialogValues.value.code
        upLoading.value = true
        BankResourceHelper.updateBankDevice(newInfo, props.bankEnName, code)
            .then(res => {
                normalSuccessCallback(res)
            }).catch(err => {
                normalFailCallback(err)
            })

    }

    else if (props.type === 'model') {
        console.log('no update')
    }
    else if (props.type === 'visual') {
        console.log('no update')
    }
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
    obj['segment'] = props.bankEnName
    obj['fileType'] = fileTypeDict[props.type][props.subType]
    obj['category'] = props.subType
    return obj
}

const normalSuccessCallback = (res) => {
    ElMessage.success({ message: '更新成功！', offset: 100 })
    console.log('SUCCESS::', res.data)
    dialogFormVisible.value = false
    BankResourceHelper.refreshBankResource(resourceStore.resourceInfo, props.bankEnName, props.type, props.subType)
    upLoading.value = false
}
const normalFailCallback = (err) => {
    console.error('更新失败！', err)
    ElMessage.error({ message: '更新失败！', offset: 100 })
    upLoading.value = false
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