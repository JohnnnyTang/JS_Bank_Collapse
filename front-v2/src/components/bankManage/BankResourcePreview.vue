<template>
    <div class="bank-resouce-create-container" v-loading="loading">
        <div class="main-title">岸段管理</div>
        <div class="desc-box-container">
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
                            item.key === '监测起始时间' ? item.val.slice(0, 10) : item.val
                        }}</div>

                    </div>

                </div>
            </el-scrollbar>
        </div>

        <div class="resource-box-container">
            <div class="one-type-resource-container" v-for="(key, resourceCatogoryIndex) in   Object.keys(resourceInfo)  "
                :ref=handleRef>
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
                                <div class="resource-upload-btn" v-show="item.upload"
                                    @click="resourceUploadClickHandler(resourceTypeIndex)">上传
                                </div>
                            </div>
                            <div class="resource-content">

                                <el-table :data="item.resourceList" style="width: 95%; margin-left: 2.5%;"
                                    max-height="25vh">
                                    <el-table-column v-for="(  column, index  ) in  tableColumnInfo[key]  " :key="index"
                                        :prop="column.prop" :label="column.label" :min-width="column['min-width']"
                                        align="center">
                                        <template #default="scope" v-if="column.asTag">
                                            <div style="display: flex; align-items: center;justify-content: center;">
                                                <el-tag>{{ scope.row.fileType }}</el-tag>
                                            </div>
                                        </template>
                                    </el-table-column>

                                    <el-table-column fixed="right" label="操作" min-width="20%" align="center"
                                        v-if="item.delete || item.update">
                                        <template #default="scope">
                                            <el-button link type="danger" size="small" v-if="item.delete"
                                                @click.prevent="deleteRow(scope.$index, resourceTypeIndex, scope.row)">
                                                删除
                                            </el-button>
                                            <el-button link type="warning" size="small" v-if="item.update"
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
        :bank-en-name="uploadDialogBaseInfo.bankEnName"></UploadDialog>

    <UpdateDialog ref="updateDialogRef" :type="updateDialogBaseInfo.type" :sub-type="uploadDialogBaseInfo.subType"
        :bank-en-name="updateDialogBaseInfo.bankEnName" :resource-item-info="updateDialogBaseInfo.itemInfo"></UpdateDialog>
</template>

<script setup>
import { ref, onMounted, reactive, toRaw, watch, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import BankResourceHelper from '../modelStore/views/bankResourceHelper';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue'
import { useResourceStore } from '../../store/resourceStore'
import axios from 'axios';
import { defaultTableColumns, typeDict, resourceTypeDict, getBankBasic_Style_Info, categoryNameDict } from './bankResource'
import UploadDialog from './UploadDialog.vue'
import UpdateDialog from './UpdateDialog.vue'

//////////////////////////// global
const warnLevelList = ["I 级预警岸段", "Ⅱ 级预警岸段", "Ⅲ 级预警岸段"]

const route = useRoute();
onBeforeRouteUpdate(async (to, from) => {
    const toBankEnName = to.params.id
    initOneBank(toBankEnName)
})
const emit = defineEmits(['update-bank-basic-info'])

const resourceStore = useResourceStore()





//////////////////////////// bank basic info ////////////////////////////
const bank = reactive({
    name: '',
    bankEnName: ''
})

const bankBasicInfo = ref()
const changeStatus = ref(false)
let originalBankBasicInfo = null
let originalBank = {
    name: '',
    bankEnName: ''
}
const startModify = () => {
    console.log('进入修改状态')
    changeStatus.value = true
    originalBankBasicInfo = bankBasicInfo.value.map(item => ({ ...item })) // deep copy
    originalBank.name = bank.name
    originalBank.bankEnName = bank.bankEnName
}
const cancelModify = () => {
    console.log('退出修改状态')
    changeStatus.value = false
    bankBasicInfo.value = originalBankBasicInfo // 手动退出，恢复原值
    bank.name = originalBank.name
    bank.bankEnName = originalBank.bankEnName
}

const commitModify = () => {
    console.log('提交修改')
    ElMessageBox.confirm(
        '确认修改岸段信息？',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(async () => {
        const parseLonLat = (inputStr) => {
            const coordinates = inputStr.slice(1, -1).split(',');
            const longitude = parseFloat(coordinates[0]);
            const latitude = parseFloat(coordinates[1]);
            return [longitude, latitude]
        }
        let nowBasicInfo = bankBasicInfo.value
        // let ReqBody = {
        //     "bank": bank.bankEnName,
        //     "name": bank.name,
        //     "riskLevel": nowBasicInfo[0].val,
        //     "center": parseLonLat(nowBasicInfo[1].val),
        //     "introduction": nowBasicInfo[2].val,
        //     "management": {
        //         "department": nowBasicInfo[3].val,
        //         "contact": nowBasicInfo[4].val,
        //     }
        // }
        let ReqBody = {
            "bank": bank.bankEnName,
            "name": bank.name,
            "riskLevel": nowBasicInfo[0].val,
            "center": parseLonLat(nowBasicInfo[1].val),
            "monitorLength": nowBasicInfo[2].val,
            "monitorStartTime": nowBasicInfo[3].val.toISOString(),
            "introduction": nowBasicInfo[4].val,
            "management": {
                "department": nowBasicInfo[5].val,
                "contact": nowBasicInfo[6].val,
            }
        }
        const updateMsg = (await BankResourceHelper.updateBankBasicInfo(bank.bankEnName, ReqBody)).data
        emit('update-bank-basic-info', true)
        ElNotification.success({
            'title': updateMsg,
            'offset': 120
        })
        changeStatus.value = false
    }).catch(_ => {
        console.log('取消修改');
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
const uploadDialogBaseInfo = computed(() => {
    return {
        type: typeDict[nowTypeIndex.value],
        subType: resourceTypeDict[typeDict[nowTypeIndex.value]][nowSubTypeIndex.value],
        bankEnName: bank.bankEnName,
    }
})

const resourceUploadClickHandler = (resourceTypeIndex) => {
    nowSubTypeIndex.value = resourceTypeIndex
    console.log(uploadDialogBaseInfo.value)
    uploadDialogRef.value.dialogFormVisible = true
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
const tableColumnInfo = defaultTableColumns


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
        if (bank.bankEnName === 'Zys') {
            BankResourceHelper.deleteBankDevice(info.code).then(res => {
                console.log(res)
            }).catch(e => {
                console.warn(e)
            })
        }

        ElMessage.success({
            'offset': 100,
            'message': '删除成功！'
        })

    }).catch(_ => {
        console.log('取消删除', _);
    })
}
const updateRow = (rowIndex, resourceTypeIndex, info) => {
    // console.log('now catogory index', nowTypeIndex.value)
    // console.log('now resource index', resourceTypeIndex)
    // console.log('now item index', rowIndex)
    nowSubTypeIndex.value = resourceTypeIndex
    operatingResourceItem.value = info

    // updateDialog show
    resourceItemUpdateClickHandler()
}


const loading = ref(false)
onMounted(async () => {
    const _thisBankEnName = route.params.id
    await initOneBank(_thisBankEnName)

    ///// debug 
    window.addEventListener('keydown', (e) => {
        console.log('resourceStore.resourceInfo', resourceStore.resourceInfo)
    })
    // for refresh
    watch(() => resourceStore.resourceInfo, (newVal, oldVal) => {
        console.log(newVal, oldVal)
        console.log('should update')
    })

})


////////////////// helper ///////////////////
const initOneBank = async (bankEnName) => {
    loading.value = true
    const _thisBankEnName = bankEnName
    const _thisBankBasicInfo = (await BankResourceHelper.getOneBankBasicInfo(_thisBankEnName)).data

    // // bank resource init
    const _ogDEM = (await BankResourceHelper.getBankCalculateResourceList('DEM', _thisBankEnName)).data
    const _ogHydro = (await BankResourceHelper.getBankCalculateResourceList('Hydrodynamic', _thisBankEnName)).data
    const _ogBound = (await BankResourceHelper.getBankCalculateResourceList('Boundary', _thisBankEnName)).data
    const _ogConfig = (await BankResourceHelper.getBankCalculateResourceList('Config', _thisBankEnName)).data
    // const _ogDEM = []
    // const _ogHydro = []
    // const _ogBound = []
    // const _ogConfig = []
    const _thisBankResourceInfo = [
        {
            key: '岸段地形资源',
            upload: true,
            update: false,
            delete: true,
            resourceList: BankResourceHelper.DEMResourcetoList(_ogDEM)
        },
        {
            key: '水动力预算工况',
            upload: true,
            update: false,
            delete: true,
            resourceList: BankResourceHelper.HydrodynamicResourcetoList(_ogHydro)
        },
        {
            key: '岸段边界矢量',
            upload: true,
            update: false,
            delete: true,
            resourceList: BankResourceHelper.BoundaryResourcetoList(_ogBound)
        },
        {
            key: '模型配置文件',
            upload: true,
            update: false,
            delete: true,
            resourceList: BankResourceHelper.ConfigResourcetoList(_ogConfig)
        },
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
            key: '矢量可视化资源',
            upload: true,
            update: false,
            delete: true,
            resourceList: vectorTileList
        },
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
    ]
    //////////////////
    bank.name = _thisBankBasicInfo.name
    bank.bankEnName = _thisBankEnName
    bankBasicInfo.value = getBankBasic_Style_Info(_thisBankBasicInfo)
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

        width: 43vw;
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
            width: 42vw;
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
            width: 8vw;
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
            width: 38vw;
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
                width: 19vw;
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

                &.long-text {
                    height: 24vh;

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

        width: 43vw;
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
                width: 42vw;
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
                width: 42vw;
                margin-left: 0.5vw;
                height: 75vh;

                div.resource-box-item {
                    position: relative;
                    width: 41vw;
                    margin-left: 0.5vw;
                    height: fit-content;

                    div.resource-title {
                        position: relative;
                        width: 41vw;
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
                    }

                    div.resource-content {
                        position: relative;
                        width: 41vw;
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


:deep(.el-select) {


    .el-select__placeholder.is-transparent {
        font-size: calc(0.6vh + 0.6vw);
    }

    .el-select__wrapper {
        height: inherit;
        line-height: inherit;
    }
}
</style>