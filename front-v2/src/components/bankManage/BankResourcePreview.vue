<template>
    <div class="bank-resouce-create-container" v-loading="loading">
        <div class="main-title">已建岸段</div>
        <div class="desc-box-container">
            <div class="change-button-container delete" v-show="bank.bankEnName != 'Mzs' && bank.bankEnName != ''">
                <div class="change-button delete" v-if="!changeStatus" @click="deleteBank">
                    删除
                </div>
            </div>
            <div class="title-container">岸段基本信息</div>
            <div class="change-button-container">
                <div class="change-button" v-if="!changeStatus" @click="startModify">
                    修改
                </div>
                <div class="change-button modify" v-if="changeStatus" @click="commitModify">
                    提交
                </div>
                <div class="cancel-button" v-if="changeStatus" @click="cancelModify">
                    取消
                </div>
            </div>
            <el-scrollbar height="77vh">
                <div class="detail-content-container">

                    <div class="bank-name">
                        <div class="bankName-key">岸段名称</div>
                        <div class="bankName-val" v-if="changeStatus">
                            <el-input v-model="bank.name" style="
                                width: 100%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            " placeholder="请输入" :type="'text'" :autosize="{ minRows: 4, maxRows: 6 }" />
                        </div>
                        <div class="bankName-val" v-else>
                            {{ bank.name }}
                        </div>
                    </div>


                    <div class="detail-box-item" v-for="(item, index) in bankBasicInfo" :key="index" :class="item.type">
                        <div class="detail-key">{{ item.key }}</div>
                        <div class="detail-val" v-if="changeStatus">
                            <el-select v-if="item.key === '预警级别'" v-model="item.val" placeholder="请选择预警级别"
                                style="width: 100%;height: 100%; font-size: calc(0.6vw + 0.6vh);">
                                <el-option v-for="(item, index) in warnLevelList" :key="index" :value="item">
                                    <span style="width: 100%;text-align: center;">{{ item }}</span>
                                </el-option>
                            </el-select>
                            <el-date-picker v-else-if="item.key === '监测起始时间'" v-model="item.val" type="date"
                                placeholder="请选择监测起始时间" format="YYYY-MM-DD" date-format="MMM DD, YYYY" />
                            <!-- <div v-else-if="item.key === '中心坐标'" class="full">
                                <el-input v-model="lnglat.lng" style="
                                        width: 50%;
                                        height: 100%;
                                        font-size: calc(0.6vw + 0.6vh);
                                    " placeholder="请输入经度" type="number" :step="0.0000001"
                                    :autosize="{ minRows: 4, maxRows: 6 }" />
                                <el-input v-model="lnglat.lat" style="
                                            width: 50%;
                                            height: 100%;
                                            font-size: calc(0.6vw + 0.6vh);
                                        " placeholder="请输入纬度" type="number" :step="0.0000001"
                                    :autosize="{ minRows: 4, maxRows: 6 }" />
                            </div> -->
                            <el-input v-else v-model="item.val" style="
                                width: 100%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            " :placeholder="item.key === '中心坐标' ? '请输入坐标: [经度,维度]' : '请输入' + item.key" :type="item.type.includes('long-text')
                                ? 'textarea'
                                : 'text'
                                " :autosize="{ minRows: 4, maxRows: 6 }" />
                        </div>
                        <!-- <div class="detail-val" v-else>{{ item.val }}</div> -->

                        <div class="detail-val" v-else>{{
                            // item.key === '监测起始时间' ? item.val.slice(0, 10) : item.val
                            item.key === '监测起始时间' && item.val ? item.val.slice(0, 10) : item.val
                        }}</div>

                    </div>

                </div>
            </el-scrollbar>
        </div>

        <div class="resource-box-container">
            <div class="one-type-resource-container" v-for="(key, resourceCatogoryIndex) in  Object.keys(resourceInfo)  "
                :key="resourceCatogoryIndex" :ref=handleRef>
                <div class="title-container">
                    <span @click="typeIndexChange(0)" class="page left" :class="{ ban: nowTypeIndex === 0 }">上一页</span>
                    <span>{{ key }}</span>
                    <span @click="typeIndexChange(1)" class="page right"
                        :class="{ ban: nowTypeIndex === Object.keys(resourceInfo).length - 1 }">下一页</span>
                </div>
                <div class="resource-content-container">
                    <el-scrollbar height="75vh">
                        <div class="resource-box-item" v-for="(  item, resourceTypeIndex  ) in   resourceInfo[key]  "
                            :key="resourceTypeIndex">
                            <div class="resource-title">
                                {{ item.key }}
                                <div class="resource-caculate-btn" v-show="item.calculate"
                                    @click="resourceCaculateClickHandler">计算
                                </div>
                                <div class="resource-set-btn" v-show="item.set" @click="handleSetClick">设置
                                </div>
                                <div class="resource-upload-btn" v-show="item.upload"
                                    @click="resourceUploadClickHandler(resourceTypeIndex)">上传
                                </div>
                            </div>
                            <div class="resource-content">

                                <el-table :data="item.resourceList" style="width: 95%; margin-left: 2.5%;" max-height="25vh"
                                    :row-class-name="tableRowClassName">
                                    <el-table-column label="序号" align="center" :min-width="20">
                                        <template #default="scope">
                                            {{ scope.$index + 1 }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-for="(  column, index  ) in  tableColumnInfo[key][item.key]  "
                                        :key="index" :prop="column.prop" :label="column.label"
                                        :min-width="column['min-width']" align="center">
                                        <template #default="scope" v-if="column.asTag">
                                            <div style="display: flex; align-items: center;justify-content: center;">
                                                <el-tag>{{ scope.row.fileType }}</el-tag>
                                            </div>
                                        </template>
                                    </el-table-column>

                                    <el-table-column fixed="right" label="操作" min-width="20%" align="center"
                                        v-if="(item.delete || item.update || item.u)">
                                        <template #default="scope">
                                            <el-button link type="primary" size="small" v-if="scope.row.setting"
                                                @click.prevent="settingRow(scope.$index, resourceTypeIndex, scope.row)">
                                                设置
                                            </el-button>
                                            <el-button link type="primary" size="small" v-if="scope.row.upload"
                                                @click.prevent="uploadRow(scope.$index, resourceTypeIndex, scope.row)">
                                                上传
                                            </el-button>
                                            <el-button link type="danger" size="small"
                                                v-if="item.delete && !scope.row.placeHolder"
                                                @click.prevent="deleteRow(scope.$index, resourceTypeIndex, scope.row)">
                                                删除
                                            </el-button>
                                            <el-button link type="warning" size="small"
                                                v-if="item.update && !scope.row.placeHolder"
                                                @click.prevent="updateRow(scope.$index, resourceTypeIndex, scope.row)">
                                                更新
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>


        </div>
    </div>

    <UploadDialog ref="uploadDialogRef" :type="uploadDialogBaseInfo.type" :sub-type="uploadDialogBaseInfo.subType"
        :bank-en-name="uploadDialogBaseInfo.bankEnName" :attach-info="uploadAttachInfo"></UploadDialog>

    <UpdateDialog ref="updateDialogRef" :type="updateDialogBaseInfo.type" :sub-type="uploadDialogBaseInfo.subType"
        :bank-en-name="updateDialogBaseInfo.bankEnName" :resource-item-info="updateDialogBaseInfo.itemInfo"></UpdateDialog>

    <!-- 弹出对话框 -->

    <el-dialog v-model="showSetDialog" style="height: 60vh;width: 30vw;overflow-y: scroll;" :show-close="false">
        <div class="form-header">
            {{ selectedValue === 'PQ' ? '造床流量系数设置' : '权重阈值参数设置' }}
        </div>

        <!-- <div style="display: flex;justify-content: center;">
            <el-form :model="modelParamsInfoData" style="margin-top: 3vh;width: 20vw;" class="custom">
                <el-form-item v-for="index in modelParamsInfoRange" :key="index" :label="modelParamsInfoData[index][0]"
                    label-width="4vw">
                    <input v-model="modelParamsInfoData[index][1]" type="text" />
                </el-form-item>
            </el-form>
        </div> -->

        <!-- 初始值选择项 -->
        <div class="set-radio-group-container" v-if="intoTheSetDialogByTitleButton">
            <el-radio-group v-model="selectedValue" style="margin-top: 10px;">
                <el-radio value="PQ" size="large">造床流量系数</el-radio>
                <el-radio value="template" size="large">权重阈值参数</el-radio>
            </el-radio-group>
        </div>

        <div style="display: flex;justify-content: center;">
            <el-form :model="PQData" v-if="selectedValue == 'PQ'" style="width: 20vw;">
                <el-form-item v-for="index in PQRange" :key="index" :label="`${index}年`" class="custom">
                    <input v-model="PQData[index]" type="number" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="addPQData" type="primary" style="width: 2vw;">+</el-button>
                    <el-button @click="deletePQData" type="primary" style="width: 2vw;">-</el-button>
                </el-form-item>
            </el-form>
        </div>

        <SetThresholdForm ref="setThresholdFormRef" v-if="selectedValue == 'template'" />

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showSetDialog = false">取消</el-button>
                <el-button type="primary" @click=handleSetConfirm>确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, toRaw, watch, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router';
import BankResourceHelper from '../modelStore/views/bankResourceHelper';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue'
import { useResourceStore } from '../../store/resourceStore'
import axios from 'axios';
import { initialTableDatas, tableColumns, typeDict, resourceTypeDict, getBankBasic_Style_Info, categoryNameDict } from './bankResource'
// import UploadDialog from './UploadDialog.vue'
import UploadDialog from './uploadDialog.vue'
import UpdateDialog from './updateDialog.vue'
import SetThresholdForm from '../modelStore/riskWarn/SetThresholdForm.vue'

//////////////////////////// global
const warnLevelList = ["I 级预警岸段", "Ⅱ 级预警岸段", "Ⅲ 级预警岸段"]

const route = useRoute();
const router = useRouter();
onBeforeRouteUpdate(async (to, from) => {
    const toBankEnName = to.params.id
    changeStatus.value = false
    initOneBank(toBankEnName)
})
const emit = defineEmits(['refresh-bank-list'])

const resourceStore = useResourceStore()


//////////////////////////// bank basic info ////////////////////////////
const bank = reactive({
    name: '',
    bankEnName: ''
})
const lnglat = reactive({
    lng: '',
    lat: ''
})
const bankBasicInfo = ref()
const changeStatus = ref(false)
let originalBankBasicInfo = null
let originalBank = {
    name: '',
    bankEnName: ''
}
const startModify = () => {

    changeStatus.value = true
    originalBankBasicInfo = bankBasicInfo.value.map(item => ({ ...item })) // deep copy
    originalBank.name = bank.name
    originalBank.bankEnName = bank.bankEnName
}
const cancelModify = () => {
    // console.log('退出修改状态')
    changeStatus.value = false
    bankBasicInfo.value = originalBankBasicInfo // 手动退出，恢复原值
    bank.name = originalBank.name
    bank.bankEnName = originalBank.bankEnName
}
const deleteBank = () => {
    ElMessageBox.confirm(
        '确认删除该岸段？',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {

        BankResourceHelper.deleteBank(bank.bankEnName).then(res => {
            const deleteMsg = res.data
            ElMessage.success({
                'offset': 100,
                'message': deleteMsg
            })
            //删除岸段后回退到mzs，mzs不可删除
            emit('refresh-bank-list', true)
            router.push('/bankManage/preview/Mzs')
        }).catch(_ => {
            console.log(_)
            ElMessage.error({
                'offset': 100,
                'message': '删除失败'
            })
        })

    }).catch(_ => {
        ElMessage.info({
            'offset': 100,
            'message': '取消删除'
        })
    })




}


const commitModify = () => {
    // console.log('提交修改')
    ElMessageBox.confirm(
        '确认修改岸段信息？',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(async () => {

        let nowBasicInfo = bankBasicInfo.value
        let center = [parseFloat(lnglat.lng), parseFloat(lnglat.lat)]
        let ReqBody = {
            "bank": bank.bankEnName,
            "name": bank.name,
            "riskLevel": nowBasicInfo[0].val,
            "center": center,
            "monitorLength": nowBasicInfo[1].val,
            "monitorStartTime": nowBasicInfo[2].val,
            "introduction": nowBasicInfo[3].val,
            "management": {
                "department": nowBasicInfo[4].val,
                "contact": nowBasicInfo[5].val,
            }
        }
        const updateMsg = (await BankResourceHelper.updateBankBasicInfo(bank.bankEnName, ReqBody)).data
        emit('refresh-bank-list', true)
        ElNotification.success({
            'title': updateMsg,
            'offset': 120
        })

        const _thisBankBasicInfo = (await BankResourceHelper.getOneBankBasicInfo(bank.bankEnName)).data
        console.log('true!!')
        bank.name = _thisBankBasicInfo.name
        bankBasicInfo.value = getBankBasic_Style_Info(_thisBankBasicInfo)
        changeStatus.value = false
    }).catch(_ => {
        console.log('取消修改', _);
        bankBasicInfo.value = originalBankBasicInfo // 恢复原值
        bank.name = originalBank.name
        bank.bankEnName = originalBank.bankEnName
        changeStatus.value = false
    })
}


/////////////////////////// bank resource info ///////////////////////////
///////// page change /////////
const resourceTypeRefs = ref([])
const handleRef = (el) => {
    resourceTypeRefs.value.push(el)
}
const nowTypeIndex = ref(0)
const typeIndexWatcher = watch(nowTypeIndex, (newVal, oldVal) => {
    const transfromDict = {
        0: 'translateX(0%)',
        1: 'translateX(-100%)',
        2: 'translateX(-200%)'
    }
    resourceTypeRefs.value.forEach(refItem => {
        refItem.style.transform = transfromDict[newVal];
    })
})
const nowSubTypeIndex = ref(0)

const typeIndexChange = (add) => {
    if (add) {
        if (nowTypeIndex.value === - 1 + Object.keys(resourceInfo.value).length) return
        nowTypeIndex.value = (nowTypeIndex.value + 1) % Object.keys(resourceInfo.value).length
    } else {
        if (nowTypeIndex.value === 0) return
        nowTypeIndex.value = (nowTypeIndex.value - 1 + Object.keys(resourceInfo.value).length) % Object.keys(resourceInfo.value).length
    }
}


// const resourceInfo = resourceStore.resourcesObject
const resourceInfo = ref({})


///////////// bank resource upload
const uploadDialogRef = ref(null)
const uploadAttachInfo = ref({})
const uploadDialogBaseInfo = computed(() => {
    return {
        type: typeDict[nowTypeIndex.value],
        subType: resourceTypeDict[typeDict[nowTypeIndex.value]][nowSubTypeIndex.value],
        bankEnName: bank.bankEnName,
    }
})

const resourceUploadClickHandler = (resourceTypeIndex) => {
    nowSubTypeIndex.value = resourceTypeIndex
    uploadDialogRef.value.dialogFormVisible = true
}

const resourceCaculateClickHandler = () => {
    router.push('/modelStore/stabilityCalc')
}


///////////// bank resource update
const updateDialogRef = ref(null)
const operatingResourceItem = ref({
    "aspect": '',
    "deviceId": '',
    "deviceName": '',
    "type": '',
    "longitude": '',
    "latitude": '',
    "elevation": '',
})
const updateDialogBaseInfo = computed(() => {
    return {
        type: typeDict[nowTypeIndex.value],
        subType: resourceTypeDict[typeDict[nowTypeIndex.value]][nowSubTypeIndex.value],
        bankEnName: bank.bankEnName,
        itemInfo: operatingResourceItem,
    }
})
const resourceItemUpdateClickHandler = () => {
    updateDialogRef.value.dialogFormVisible = true
}


///////////// bank resource table operation
const tableColumnInfo = tableColumns

const tableRowClassName = ({
    row,
    rowIndex,
}) => {
    if (row.placeHolder) {
        return 'placeholder-row'
    }
    return ''
}
const settingRow = (rowIndex, resourceTypeIndex, info) => {
    console.log('click setting from row', console.log(info))
    if (info.placeHolder) {
        if (info.name === "造床流量系数")
            selectedValue.value = 'PQ'
        else if (info.name === "权重阈值参数")
            selectedValue.value = 'template'
    }
    intoTheSetDialogByTitleButton.value = false
    showSetDialog.value = true
}
const uploadRow = (rowIndex, resourceTypeIndex, info) => {
    console.log('click upload from row', info, resourceTypeIndex)

    const configRadioMap = {
        "岸段边界文件": "Boundary",
        "造床流量系数": "PQ",
        "权重阈值参数": "template",
    }
    if ("模型参数文件" === resourceInfo.value[categoryNameDict[nowTypeIndex.value]][resourceTypeIndex].key) {
        uploadAttachInfo.value = {
            "configRadioValue": configRadioMap[info.name],
        }
    }
    resourceUploadClickHandler(resourceTypeIndex)
}
const deleteRow = (rowIndex, resourceTypeIndex, info) => {

    // console.log('now catogory index', nowTypeIndex.value)
    // console.log('now resource index', resourceTypeIndex)
    // console.log('now item index', rowIndex)
    operatingResourceItem.value = info

    console.log('operatingItem', info)

    ElMessageBox.confirm(
        '确认删除该条资源？',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        console.log('确认删除');
        // frontend delete
        let resourceList = resourceInfo.value[categoryNameDict[nowTypeIndex.value]][resourceTypeIndex].resourceList
        resourceList.splice(rowIndex, 1)

        // backend delete 。。。
        switch (typeDict[nowTypeIndex.value]) {
            case 'model':
                let subType = resourceTypeDict[typeDict[nowTypeIndex.value]][resourceTypeIndex]
                console.log('subType', subType)
                if (subType == 'Section') {
                    BankResourceHelper.deleteSectionResourceFile(bank.bankEnName, info.name).then(res => {
                        console.log(res)
                    }).catch(e => {
                        console.warn(e)
                    })
                } else {
                    BankResourceHelper.deleteBankCalculateResourceFile(subType, bank.bankEnName, info.name).then(res => {
                        console.log(res)
                    }).catch(e => {
                        console.warn(e)
                    })
                }
                break;

            case 'visual':
                BankResourceHelper.deleteBankVisualResourceFile(info.tileName, bank.bankEnName).then(res => {
                    console.log(res)
                }).catch(e => {
                    console.warn(e)
                })
                break;

            case 'device':
                BankResourceHelper.deleteBankDevice(info.code).then(res => {
                    console.log(res)
                }).catch(e => {
                    console.warn(e)
                })
                break;

        }

        ElMessage.success({
            'offset': 100,
            'message': '删除成功！'
        })

        let _type = typeDict[nowTypeIndex.value]
        let _subType = resourceTypeDict[_type][resourceTypeIndex]
        BankResourceHelper.refreshBankResource(resourceStore.resourceInfo, bank.bankEnName, _type, _subType)

    }).catch(_ => {
        console.log('取消删除', _);
    })
}
const updateRow = (rowIndex, resourceTypeIndex, info) => {

    nowSubTypeIndex.value = resourceTypeIndex
    operatingResourceItem.value = info

    // updateDialog show
    resourceItemUpdateClickHandler()
}





const loading = ref(false)
onMounted(async () => {
    const _thisBankEnName = route.params.id
    await initOneBank(_thisBankEnName)

    // for refresh
    watch(() => resourceStore.resourceInfo, (newVal, oldVal) => {
        // do refresh
        resourceInfo.value = toRaw(newVal)
    })

})


////////////////// helper ///////////////////

const initOneBank = async (bankEnName) => {
    loading.value = true
    const _thisBankEnName = bankEnName
    const _thisBankBasicInfo = (await BankResourceHelper.getOneBankBasicInfo(_thisBankEnName)).data

    // // bank resource init
    const _ogDEM = (await BankResourceHelper.getBankCalculateResourceList('DEM', _thisBankEnName)).data
    const _ogConfig = (await BankResourceHelper.getBankCalculateResourceList('Config', _thisBankEnName)).data
    const _ogBound = (await BankResourceHelper.getBankCalculateResourceList('Boundary', _thisBankEnName)).data
    const _ogSection = (await BankResourceHelper.getBankCalculateResourceList('Section', _thisBankEnName)).data
    const _ogHydro = (await BankResourceHelper.getBankCalculateResourceList('Hydrodynamic', _thisBankEnName)).data

    // prepare
    const _demList = BankResourceHelper.DEMResourcetoList(_ogDEM)
    const demList = BankResourceHelper.prepareData(_demList, 'DEM')

    const _configList = BankResourceHelper.ConfigResourcetoList(_ogConfig)
    const _boundList = BankResourceHelper.BoundaryResourcetoList(_ogBound)
    const _confList = _configList.concat(_boundList)
    const confList = BankResourceHelper.prepareData(_confList, 'Config')

    const _sectionList = BankResourceHelper.SectionResourcetoList(_ogSection)
    const sectionList = BankResourceHelper.prepareData(_sectionList, 'Section')

    const _hydroList = BankResourceHelper.HydrodynamicResourcetoList(_ogHydro)
    const hydroList = BankResourceHelper.prepareData(_hydroList, 'Hydrodynamic')


    // const _ogDEM = []
    // const _ogHydro = []
    // const _ogBound = []
    // const _ogConfig = []
    // const _ogSection = []
    const _thisBankResourceInfo = [
        {
            key: '岸段地形资源',
            upload: true,
            calculate: false,
            set: false,
            update: false,
            delete: true,
            resourceList: demList
        },
        {
            key: '模型参数文件',
            upload: true,
            calculate: false,
            set: true,
            update: false,
            delete: false,
            u:true,
            resourceList: confList
        },
        {
            key: '判别断面文件',
            upload: true,
            calculate: false,
            set: false,
            update: false,
            delete: true,
            resourceList: sectionList
        },
        {
            key: '水动力预算工况',
            upload: true,
            calculate: true,
            set: false,
            update: false,
            delete: true,
            resourceList: hydroList
        },
        // {
        //     key: '岸段边界矢量',
        //     upload: true,
        //     calculate: false,
        //     set: false,
        //     update: false,
        //     delete: true,
        //     resourceList: BankResourceHelper.BoundaryResourcetoList(_ogBound)
        // },
    ]

    // visual resource init
    const demTileList = (await BankResourceHelper.getBankVisualResourceList('DEM', bankEnName)).data
    demTileList.map(item => item.fileType = '地形切片')
    const vectorTileList = (await BankResourceHelper.getBankVisualResourceList("vector", bankEnName)).data
    vectorTileList.map(item => {
        item.fileType = '矢量切片'
        item.name = item.tileName
    })

    const _thisVisualResourceInfo = [
        {
            key: '栅格可视化资源',
            upload: false,
            update: false,
            delete: false,
            resourceList: demTileList
        },
        {
            key: '其他可视化资源',
            upload: true,
            update: false,
            delete: true,
            resourceList: vectorTileList
        }
    ]

    // device resource init
    let _thisDeviceResourceInfo = []

    const _GNSS = (await BankResourceHelper.getBankDeviceResourceList("GNSS", bankEnName)).data
    const _Incline = (await BankResourceHelper.getBankDeviceResourceList("INCLINE", bankEnName)).data
    const _Stress = (await BankResourceHelper.getBankDeviceResourceList("STRESS", bankEnName)).data
    const _Menometer = (await BankResourceHelper.getBankDeviceResourceList("MENOMETER", bankEnName)).data
    const _Vedio = (await BankResourceHelper.getBankDeviceResourceList("VEDIO", bankEnName)).data

    // const _GNSS = []
    // const _Incline = []
    // const _Stress = []
    // const _Menometer = []
    // const _Vedio = []
    _thisDeviceResourceInfo = [
        {
            key: 'GNSS设备',
            upload: true,
            update: true,
            delete: true,
            resourceList: _GNSS
        },
        {
            key: '孔隙水压力计设备',
            upload: true,
            update: true,
            delete: true,
            resourceList: _Menometer
        },
        {
            key: '应力桩设备',
            upload: true,
            update: true,
            delete: true,
            resourceList: _Stress
        },
        {
            key: '测斜仪设备',
            upload: true,
            update: true,
            delete: true,
            resourceList: _Incline
        },
        {
            key: '监控摄像设备',
            upload: true,
            update: true,
            delete: true,
            resourceList: _Vedio
        },
        {
            key: '其他设备',
            upload: true,
            update: true,
            delete: true
        }
    ]
    //////////////////
    bank.name = _thisBankBasicInfo.name
    bank.bankEnName = _thisBankEnName
    console.log(_thisBankBasicInfo)
    bankBasicInfo.value = getBankBasic_Style_Info(_thisBankBasicInfo)
    console.log(bankBasicInfo.value)
    resourceInfo.value = {
        '模型资源管理': _thisBankResourceInfo,
        '可视化资源管理': _thisVisualResourceInfo,
        '设备资源管理': _thisDeviceResourceInfo,
        // '模型资源管理': [],
        // '可视化资源管理': [],
        // '设备资源管理': []
    }
    /// store init value
    resourceStore.resourceInfo = {
        '模型资源管理': _thisBankResourceInfo,
        '可视化资源管理': _thisVisualResourceInfo,
        '设备资源管理': _thisDeviceResourceInfo,
    }
    loading.value = false
}









////////////////// set ///////////////////
const showSetDialog = ref(false)

// 定义两种模型参数初始值
const PQData = reactive({
    2010: 2.59,
    2011: 0.15,
    2012: 2.42,
    2013: 0.00,
    2014: 0.67,
    2015: 1.29,
    2016: 3.2,
    2017: 1.1,
    2018: 0.29,
    2019: 1.68,
    2020: 3.68,
    2021: 1.35,
    2022: 1.10,
    2023: 0.0
})
const PQRange = ref([2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023])

const addPQData = () => {
    const nextYear = PQRange.value[PQRange.value.length - 1] + 1; // 获取下一年
    PQRange.value.push(nextYear); // 将下一年加入PQRange
    PQData[nextYear] = 0
}
const deletePQData = () => {
    const finalYear = PQRange.value[PQRange.value.length - 1];
    PQRange.value.pop(finalYear);
    delete PQData[finalYear]
}

// 当前选择的初始值
const selectedValue = ref('PQ')
const modelParamsInfoData = reactive({
    'year': ['年份', '2023'],
    'month': ['月份', '04'],
    'set': ['工况集', 'standard'],
    'description': ['备注', ''],
})

const modelParamsInfoRange = ['year', 'month', 'set', 'description']

const intoTheSetDialogByTitleButton = ref(false)
const handleSetClick = () => {
    intoTheSetDialogByTitleButton.value = true
    showSetDialog.value = true
}

const setThresholdFormRef = ref(null)

const handleSetConfirm = async () => {
    ElMessage.info({
        message: '正在将参数上传至后台服务,请稍后...',
        offset: 100
    })
    const info = {
        'name': '',
        'fileType': 'json',
        'segment': bank.bankEnName,
        'category': 'Config',
        'year': modelParamsInfoData.year[1],
        'month': modelParamsInfoData.month[1],
        'set': modelParamsInfoData.set[1],
        'description': modelParamsInfoData.description[1],
    }


    if (info.year == '' || info.month == '' || info.set == '') {
        ElMessage({
            message: '年份、月份、工况集为必填项',
            type: 'warning',
        })
    } else {
        showSetDialog.value = false
    }

    if (selectedValue.value == 'PQ') {
        console.log(toRaw(PQData))
        info.name = 'PQ'
        BankResourceHelper.handleModelParamsUpload(PQData, 'PQ', info).then(res => {
            ElMessage.success({ message: '上传成功！', offset: 100 })
            BankResourceHelper.refreshBankResource(resourceStore.resourceInfo, bank.bankEnName, 'model', 'Config')
        }).catch(e => {
            ElMessage.error({ message: '上传失败！', offset: 100 })
        })
    } else {
        console.log(toRaw(setThresholdFormRef.value.thresholdParmas))
        info.name = 'template'
        BankResourceHelper.handleModelParamsUpload(setThresholdFormRef.value.thresholdParmas, 'template', info).then(res => {
            ElMessage.success({ message: '上传成功！', offset: 100 })
            BankResourceHelper.refreshBankResource(resourceStore.resourceInfo, bank.bankEnName, 'model', 'Config')
        }).catch(e => {
            ElMessage.error({ message: '上传失败！', offset: 100 })
        })
    }
}

</script>

<style lang="scss" scoped>
div.bank-resouce-create-container {
    position: absolute;
    left: 12vw;
    top: 1vh;

    width: 87vw;
    height: 88.5vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    margin-left: 0.5vw;
    padding-right: 0.5vw;

    border-radius: 12px;
    // margin-bottom: 1vh;
    overflow: hidden;

    background-color: rgb(233, 247, 255);


    div.main-title {
        position: absolute;
        width: 100%;
        height: 6vh;
        top: 0;
        left: 0;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;

        line-height: 6vh;
        text-align: center;
        font-size: calc(1.2vw + 1vh);
        font-weight: bold;
        color: #ffffff;
        letter-spacing: 5px;
        background-color: rgb(50, 84, 174);

    }

    div.desc-box-container {
        // position: relative;
        position: absolute;
        top: 6vh;

        width: 30vw;
        height: 82vh;

        margin-top: 1vh;
        margin-bottom: 1vh;
        margin-left: 0.5vw;
        margin-right: 0.5vw;

        background-color: aliceblue;
        border-right: 2px solid #7aa8ff;
        // border: 2px solid #7aa8ff;

        // border-radius: 12px;

        // box-shadow: 10px 12px 20px -10px rgba(0, 0, 0, 0.8);

        overflow: hidden;

        div.title-container {
            width: 30vw;
            height: 7vh;
            margin-left: 0.5vw;

            line-height: 7vh;

            text-align: center;

            font-size: calc(1vw + 1vh);
            font-weight: bold;

            border-bottom: 4px solid #0040a0;
            color: #001d7a;
        }

        div.change-button-container {
            position: absolute;
            width: 6vw;
            height: 4vh;
            top: 1.8vh;
            right: 2.5vw;

            // background-color: #0040a0;

            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;

            text-align: center;
            font-weight: bold;
            font-size: calc(0.8vw + 0.4vh);

            &.delete {
                right: auto;
                left: 2.5vw;
            }

            div.change-button {
                width: 8vw;
                height: 4vh;
                line-height: 4vh;
                border-radius: 6px;

                background-color: #b4ddff;
                transition: all 0.2s ease-in-out;

                box-shadow:
                    rgba(0, 132, 255, 0.8) 1px 1px,
                    rgba(0, 119, 255, 0.7) 2px 2px,
                    rgba(0, 119, 255, 0.6) 3px 3px;

                &.modify {
                    width: 3.2vw;
                }

                &:hover {
                    cursor: pointer;
                    transform: translate3d(2px, 2px, 2px);
                    color: #0539a8;
                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 2px 2px,
                        rgba(0, 119, 255, 0.6) 3px 3px,
                        rgba(0, 119, 255, 0.4) 4px 4px;
                }

                &.delete {
                    background-color: #ffc9b4;
                    box-shadow:
                        rgba(255, 165, 81, 0.8) 1px 1px,
                        rgba(255, 165, 81, 0.7) 2px 2px,
                        rgba(255, 165, 81, 0.6) 3px 3px;

                    &:hover {
                        cursor: pointer;
                        transform: translate3d(2px, 2px, 2px);
                        color: #722f02;
                        box-shadow:
                            rgba(255, 165, 81, 0.8) 1px 1px,
                            rgba(255, 165, 81, 0.7) 2px 2px,
                            rgba(255, 165, 81, 0.6) 3px 3px,
                            rgba(255, 165, 81, 0.4) 4px 4px;
                    }
                }
            }

            div.cancel-button {
                width: 3.2vw;
                height: 4vh;
                line-height: 4vh;
                transition: all 0.6s ease-in-out;

                border-radius: 6px;
                color: #f0f8ff;
                background-color: #2358eb;
                box-shadow:
                    rgba(29, 142, 248, 0.8) 1px 1px,
                    rgba(26, 133, 255, 0.7) 2px 2px,
                    rgba(25, 132, 255, 0.6) 3px 3px;

                &:hover {
                    cursor: pointer;
                    color: #85f7ff;
                    transform: translate3d(2px, 2px, 2px);
                    box-shadow:
                        rgba(29, 142, 248, 0.8) 1px 1px,
                        rgba(26, 133, 255, 0.7) 2px 2px,
                        rgba(25, 132, 255, 0.6) 3px 3px,
                        rgba(35, 138, 255, 0.4) 4px 4px;
                }
            }
        }

        div.detail-content-container {
            width: 25vw;
            margin-left: 2.5vw;
            // padding-right: 0.5vw;
            height: fit-content;

            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-content: flex-start;
            row-gap: 3vh;

            div.bank-name {
                width: 38vw;
                height: 8vh;
                font-size: calc(0.8vw + 0.8vh);
                border-bottom: 3px solid rgb(31, 123, 209);
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                div.bankName-key {
                    height: 8vh;
                    line-height: 8vh;
                    font-weight: bold;
                    font-size: calc(0.8vw + 1vh);
                    color: #002397;
                }

                div.bankName-val {
                    height: 8vh;
                    line-height: 8vh;
                    width: 50%;
                    text-align: right;
                    font-weight: bold;
                    color: #000822;
                    font-size: calc(0.8vw + 1vh);
                }
            }

            div.detail-box-item {
                width: 12.5vw;
                height: 16vh;
                font-size: calc(0.8vw + 0.8vh);
                border-bottom: 3px solid rgb(31, 123, 209);

                div.detail-key {
                    height: 8vh;
                    line-height: 8vh;
                    font-weight: bold;
                    font-size: calc(0.8vw + 1vh);
                    color: #002397;
                }

                div.detail-val {
                    height: 8vh;
                    line-height: 8vh;

                    div.detail-val-row {
                        height: 4vh;
                        line-height: 4vh;
                    }
                }

                &.single {
                    width: 38vw;
                }

                &.unique {
                    width: 38vw;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    height: 8vh;

                    div.detail-key {
                        width: 50%;
                    }

                    div.detail-val {
                        width: 50%;
                        height: 8vh;
                        line-height: 8vh;
                        text-align: right;
                    }
                }

                &.long-text {
                    height: 35vh;

                    div.detail-val {
                        line-height: normal;
                        height: 16vh;
                    }
                }

                &.medium-text {
                    height: 15vh;

                    div.detail-val {
                        line-height: normal;
                        height: 16vh;
                    }
                }

                &.left {
                    text-align: left;
                }

                &.right {
                    text-align: right;
                }
            }



            // background-color: antiquewhite;
        }
    }

    div.resource-box-container {

        // position: relative;
        position: absolute;
        top: 6vh;
        right: 0;

        width: 55vw;
        height: 82vh;

        margin-top: 1vh;
        margin-bottom: 1vh;
        margin-left: 0.5vw;
        margin-right: 0.5vw;

        background-color: aliceblue;

        border-right: 2px solid #7aa8ff;

        overflow: hidden;
        display: flex;
        flex-direction: row;

        div.one-type-resource-container {

            position: relative;
            width: 100%;
            height: 100%;
            transition: .4s ease-in-out;

            div.title-container {
                position: relative;
                width: 54vw;
                height: 7vh;
                margin-left: 0.5vw;

                line-height: 7vh;

                text-align: center;

                font-size: calc(1vw + 1vh);
                font-weight: bold;

                border-bottom: 4px solid #0040a0;
                color: #001d7a;
                // transition: .3s ease-in-out;

                .page {
                    position: absolute;
                    top: 0;
                    width: 5vw;
                    height: 7vh;
                    line-height: 7vh;
                    font-size: calc(0.8vw + 0.8vh);
                    color: #001d7a;
                    cursor: pointer;

                    &.left {
                        left: 1vw;
                    }

                    &.right {
                        right: 1vw;
                    }

                    &.ban {
                        color: #969696;
                        cursor: not-allowed;
                    }
                }
            }

            div.resource-content-container {
                position: relative;
                width: 55vw;
                margin-left: 0.5vw;
                height: 75vh;

                div.resource-box-item {
                    position: relative;
                    width: 53vw;
                    margin-left: 0.5vw;
                    height: fit-content;

                    div.resource-title {
                        position: relative;
                        width: 53vw;
                        height: 5vh;
                        line-height: 5vh;
                        text-align: left;
                        font-size: calc(0.9vw + 0.7vh);
                        font-weight: bold;
                        border-bottom: 2px solid #5b9dff;
                        color: #001d7a;

                        div.resource-upload-btn {
                            position: absolute;
                            right: 1vw;
                            top: .5vh;
                            width: 5vw;
                            height: 4vh;
                            line-height: 4vh;
                            text-align: center;
                            font-size: calc(0.8vw + 0.7vh);
                            font-weight: bold;
                            background-color: rgb(64, 102, 206);
                            color: #ffffff;
                            border-radius: 5px;

                            &:hover {
                                cursor: pointer;
                                background-color: rgb(93, 169, 255);
                            }
                        }

                        div.resource-caculate-btn {
                            position: absolute;
                            right: 7vw;
                            top: .5vh;
                            width: 5vw;
                            height: 4vh;
                            line-height: 4vh;
                            text-align: center;
                            font-size: calc(0.8vw + 0.7vh);
                            font-weight: bold;
                            background-color: rgb(64, 102, 206);
                            color: #ffffff;
                            border-radius: 5px;

                            &:hover {
                                cursor: pointer;
                                background-color: rgb(93, 169, 255);
                            }
                        }

                        div.resource-set-btn {
                            position: absolute;
                            right: 7vw;
                            top: .5vh;
                            width: 5vw;
                            height: 4vh;
                            line-height: 4vh;
                            text-align: center;
                            font-size: calc(0.8vw + 0.7vh);
                            font-weight: bold;
                            background-color: rgb(64, 102, 206);
                            color: #ffffff;
                            border-radius: 5px;

                            &:hover {
                                cursor: pointer;
                                background-color: rgb(93, 169, 255);
                            }
                        }
                    }

                    div.resource-content {
                        position: relative;
                        width: 53vw;
                        // height: 25vh;
                        height: fit-content;
                        letter-spacing: 0.1rem;
                    }
                }
            }
        }

    }
}

:deep(.el-input) {
    &.necessary {
        ::before {
            content: "*";
            color: red;
            position: absolute;
            top: .3vh;
            right: .5vw;
            font-size: 24px;
            z-index: 5;
        }
    }

    &.el-date-editor--date {
        width: 100%;
        height: 100%;
        font-size: calc(0.6vh + 0.6vw);
        // background-color: red;
    }
}

div.full {
    position: relative;
    width: 100%;
    height: 100%;
}

:deep(.el-select) {


    .el-select__placeholder.is-transparent {
        font-size: calc(0.6vh + 0.6vw);
    }

    .el-select__wrapper {
        height: inherit;
        line-height: inherit;
    }
}

:deep(.el-input__inner[type=number]) {

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }

    -moz-appearance: textfield;
}

.set-radio-group-container {
    display: flex;
    justify-content: center;
    /* 水平居中 */
    margin-bottom: 2vh;
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
    margin-bottom: 1vh;
}

input {
    position: relative;
    height: 3.5vh;
    width: 90%;

    border: none !important;
    border-right: 2px solid rgb(2, 143, 199) !important;
    border-bottom: 1px solid rgb(5, 88, 121) !important;
    border-radius: 5px;
    text-align: center;
    background-color: rgb(187, 230, 255);

    display: grid;
    place-items: center;
    font-size: calc(0.6vw + 0.5vh);
    transition: .3s ease-in-out;

    &:focus {
        background-color: rgb(236, 245, 254);
        color: rgb(3, 99, 177);
        font-weight: bold;
    }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type="number"] {
    -moz-appearance: textfield;
}

.custom {
    font-weight: bold;
}

:deep(.el-table__row) {

    --el-table-row-hover-bg-color: rgb(194, 206, 238);

    &.placeholder-row {
        background-color: rgb(214, 214, 214);
        color: rgb(143, 143, 143);
    }
}

:deep(.el-button.is-link) {
    font-size: medium;
    color: #375699;

    &:hover {
        color: #0051ff;
    }
}
</style>