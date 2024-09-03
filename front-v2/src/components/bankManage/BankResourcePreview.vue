<template>
    <div class="bank-resouce-create-container" v-loading="loading">
        <div class="main-title">岸段资源管理
        </div>
        <div class="desc-box-container">
            <div class="title-container">岸段基本信息</div>
            <div class="detail-content-container">

                <div class="bank-name">
                    <div class="bankName-key">岸段名称</div>
                    <div class="bankName-val" v-if="changeStatus">
                        <el-input v-model="bank.name" style="
                                width: 100%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            " placeholder="请输入" :type="'text'" :autosize="{ minRows: 4, maxRows: 6 }" />
                        <!-- <el-input v-model="bank.bankEnName" style="
                                width: 50%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            " placeholder="请输入" :type="'text'" :autosize="{ minRows: 4, maxRows: 6 }" /> -->
                    </div>
                    <div class="bankName-val" v-else>
                        {{ bank.name }}
                    </div>
                </div>


                <div class="detail-box-item" v-for="(item, index) in bankBasicInfo" :key="index" :class="item.type">
                    <div class="detail-key">{{ item.key }}</div>
                    <div class="detail-val" v-if="changeStatus">
                        <el-input v-model="item.val" style="
                                width: 100%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            " placeholder="Please input" :type="item.type.includes('long-text')
                                ? 'textarea'
                                : 'text'
                                " :autosize="{ minRows: 4, maxRows: 6 }" />
                    </div>
                    <div class="detail-val" v-else-if="item.type.includes('two-row')">
                        <div class="detail-val-row">
                            {{ item.val.split(item.splitter)[0] }}
                        </div>
                        <div class="detail-val-row">
                            {{ item.val.split(item.splitter)[1] }}
                        </div>
                    </div>
                    <div class="detail-val" v-else>{{ item.val }}</div>


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
                </div>

            </div>
        </div>

        <div class="resource-box-container">
            <div class="one-type-resource-container" v-for="key in   Object.keys(resourceInfo)  " :ref=handleRef>
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
                                <div class="resource-upload-btn" v-show="key==='模型资源管理'"  @click="resourceUploadClickHandler(resourceTypeIndex)">上传
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
                                    <!-- <el-table-column fixed="right" label="Operations" min-width="20%" align="center">
                                        <template #default="scope">
                                            <el-button link type="primary" size="small"
                                                @click.prevent="deleteRow(scope.$index, resourceTypeIndex)">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column> -->
                                </el-table>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>


        </div>
    </div>

    <el-dialog v-model="dialogFormVisible" width="20vw" :show-close="false">
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
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, toRaw, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import BankResourceHelper from '../modelStore/views/bankResourceHelper';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue'
import axios from 'axios';
import { defaultTableColumns } from './bankResource'

//////////////////////////// global
const route = useRoute();
onBeforeRouteUpdate(async (to, from) => {
    const toBankEnName = to.params.id
    initOneBank(toBankEnName)
})
const emit = defineEmits(['update-bank-basic-info'])





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
        let ReqBody = {
            "bank": bank.bankEnName,
            "name": bank.name,
            "riskLevel": nowBasicInfo[0].val,
            "center": parseLonLat(nowBasicInfo[1].val),
            "introduction": nowBasicInfo[2].val,
            "management": {
                "department": nowBasicInfo[3].val,
                "contact": nowBasicInfo[4].val,
            }
        }

        const createMsg = (await BankResourceHelper.updateBankBasicInfo(bank.bankEnName, ReqBody)).data
        emit('update-bank-basic-info', true)
        ElNotification.success({
            'title': createMsg,
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
const typeIndexChange = (add) => {
    if (add) {
        if (nowTypeIndex.value === - 1 + Object.keys(resourceInfo.value).length) return
        nowTypeIndex.value = (nowTypeIndex.value + 1) % Object.keys(resourceInfo.value).length
    } else {
        if (nowTypeIndex.value === 0) return
        nowTypeIndex.value = (nowTypeIndex.value - 1 + Object.keys(resourceInfo.value).length) % Object.keys(resourceInfo.value).length
    }
}


const resourceInfo = ref({})

///////////// bank resource upload
const dialogFormVisible = ref(false)
const dialogFormTitle = ref('资源上传')
const dialogInfo = ref([
    {
        label: '岸段',
        enName: 'segment',
        value: ''
    },
    {
        label: '年份',
        enName: 'year',
        value: '2023'
    },
    {
        label: '工况集',
        enName: 'set',
        value: 'standard'
    },
    // {
    //     label: '文件类型',
    //     enName: 'category',
    //     value: 'DEM'    (DEM|Hydrodynamic|Boundary|Config)
    // }
    {
        label: '备注',
        enName: 'description',
        value: ''
    },
    // {
    //     label: '边界',
    //     enName: '',
    //     value: ''
    // },
    // {
    //     label: '其他',
    //     enName: 'temp',
    //     value: ''
    // },

])


const resourceUploadClickHandler = (resourceTypeIndex) => {
    const type = ['地形', '水动力', '边界', '配置']
    dialogFormTitle.value = `${type[resourceTypeIndex]}资源上传`
    dialogFormVisible.value = true
}



///////////// bank resource table operation
const tableColumnInfo = defaultTableColumns


const deleteRow = (rowIndex, resourceTypeIndex) => {
    console.log(rowIndex, resourceTypeIndex)
    // console.log('resourceType',resourceInfo.value[resourceTypeIndex])
    let resourceList = resourceInfo.value[resourceTypeIndex].resourceList
    resourceList.splice(rowIndex, 1)
}


const loading = ref(false)
onMounted(async () => {
    const _thisBankEnName = route.params.id
    await initOneBank(_thisBankEnName)
    console.log(bank.name)
    dialogInfo.value[0].value = bank.name
})





////////////////// helper ///////////////////
const initOneBank = async (bankEnName) => {
    loading.value = true
    const _thisBankEnName = bankEnName
    const _thisBankBasicInfo = (await BankResourceHelper.getOneBankBasicInfo(_thisBankEnName)).data
    console.log(_thisBankBasicInfo)

    // bank resource init
    const _ogDEM = (await BankResourceHelper.getBankResourceList('DEM', _thisBankEnName)).data
    const _ogHydro = (await BankResourceHelper.getBankResourceList('Hydrodynamic', _thisBankEnName)).data
    const _ogBound = (await BankResourceHelper.getBankResourceList('Boundary', _thisBankEnName)).data
    const _ogConfig = (await BankResourceHelper.getBankResourceList('Config', _thisBankEnName)).data
    const _thisBankResourceInfo = [
        {
            key: '岸段地形资源',
            resourceList: BankResourceHelper.DEMResourcetoList(_ogDEM)
        },
        {
            key: '水动力模型资源',
            resourceList: BankResourceHelper.HydrodynamicResourcetoList(_ogHydro)
        },
        {
            key: '岸段边界资源',
            resourceList: BankResourceHelper.BoundaryResourcetoList(_ogBound)
        },
        {
            key: '岸段配置资源',
            resourceList: BankResourceHelper.ConfigResourcetoList(_ogConfig)
        },
    ]

    // visual resource init
    ///////// fake data
    const _thisVisualResourceInfo = [
        {
            key: '栅格可视化资源',
            resourceList: [
                {
                    name: '示例栅格资源',
                    fileType: '地形切片',
                    uploadTime: '2024-09-01',
                }
            ]
        },
        {
            key: '矢量可视化资源',
            resourceList: [
                {
                    name: '示例矢量资源',
                    fileType: 'geojson',
                    uploadTime: '2024-09-01',
                }
            ]
        },
        {
            key: '其他',
            resourceList: [
                {
                    name: '示例资源',
                    fileType: 'config.json',
                    uploadTime: '2024-09-01',
                }
            ]
        },
    ]

    // device resource init
    const monitorInfo = (await axios.get('/api/data/monitorInfo')).data
    const { _GNSS, _Incline, _Stress, _Menometer, _Vedio } = parseMonitorInfo(monitorInfo)
    const _thisDeviceResourceInfo = [
        {
            key: 'GNSS设备',
            resourceList: _GNSS
        },
        {
            key: '孔隙水压力计设备',
            resourceList: _Menometer
        },
        {
            key: '应力桩设备',
            resourceList: _Stress
        },
        {
            key: '测斜仪设备',
            resourceList: _Incline
        },
        {
            key: '监控摄像设备',
            resourceList: _Vedio
        },
    ]


    //////////////////
    bank.name = _thisBankBasicInfo.name
    bank.bankEnName = _thisBankEnName
    bankBasicInfo.value = parseBasicInfo(_thisBankBasicInfo)
    resourceInfo.value = {
        '模型资源管理': _thisBankResourceInfo,
        '可视化资源管理': _thisVisualResourceInfo,
        '设备资源管理': _thisDeviceResourceInfo
    }
    loading.value = false
}

const parseBasicInfo = (basicInfo) => {
    return [
        { key: '预警级别', val: basicInfo["riskLevel"], type: ['half', 'left'] },
        {
            key: '中心坐标',
            val: basicInfo["center"],
            type: ['half', 'right'],
            splitter: ' ',
        },
        {
            key: '情况介绍',
            val: basicInfo["introduction"],
            type: ['single', 'long-text'],
        },
        {
            key: '管理单位',
            val: basicInfo["management"]["department"],
            type: ['half', 'left'],
        },
        {
            key: '管理单位联系方式',
            val: basicInfo["management"]["contact"],
            type: ['half', 'right'],
        },
    ]
}

const parseMonitorInfo = (monitorInfo) => {
    const _GNSS = []
    const _Incline = []
    const _Stress = []
    const _Menometer = []
    const _Vedio = []
    monitorInfo.forEach(item => {
        switch (item.type) {
            case '1':
                _GNSS.push(item)
                break;
            case '2':
                _Stress.push(item)
                break;
            case '3':
                _Menometer.push(item)
                break;
            case '4':
                _Incline.push(item)
                break;
            case '6':
                _Vedio.push(item)
                break;
            default:
                break;
        }
    })
    return { _GNSS, _Incline, _Stress, _Menometer, _Vedio }
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

        div.detail-content-container {
            width: 38vw;
            margin-left: 2.5vw;
            // padding-right: 0.5vw;
            height: calc(83vh - 4px);

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

            div.change-button-container {
                position: absolute;
                width: 8vw;
                height: 4vh;
                top: 2vh;
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
                    height: 30vh;

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
                        height: 25vh;
                        // background-color: aquamarine;

                        letter-spacing: 0.1rem;

                    }
                }
            }
        }

    }
}

div.form-header {
    position: relative;
    height: 4vh;
    margin-top: -1vh;
    text-align: center;
    font-size: calc(0.9vw + 0.8vh);
    color: #0539a8;
    font-weight: 800;
}
</style>