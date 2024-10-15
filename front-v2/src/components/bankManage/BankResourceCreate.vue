<template>
    <div class="bank-resouce-create-container">
        <div class="main-title">新建岸段 </div>
        <div class="content">
            <div class="desc-box-container">
                <div class="title-container">岸段基本信息
                    <div class="upload-btn" @click="createNewBankClickHandler">新建</div>
                </div>
                <el-scrollbar height="77vh">

                    <div class="detail-content-container">

                        <div class="bank-name">
                            <div class="bankName-key">岸段名称</div>
                            <div class="bankName-val">
                                <el-input v-model="bank.name" class="necessary no-number" style="
                                width: 50%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            " placeholder="请输入岸段名称" :type="'text'" :autosize="{ minRows: 4, maxRows: 6 }" />
                                <el-input v-model="bank.bankEnName" class="necessary no-number" style="
                                width: 50%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            " placeholder="请输入名称编码" :type="'text'" :autosize="{ minRows: 4, maxRows: 6 }" />
                            </div>
                        </div>

                        <!-- <div class="detail-box-item" v-for="(item, index) in bankBasicInfo" :key="index" :class="item.type"> -->
                        <div class="detail-box-item" v-for="(item, index) in bankBasicInfo" :key="index" :class="item.type">

                            <div class="detail-key">{{ item.key }}</div>

                            <div class="detail-val">

                                <el-select v-if="item.key === '预警级别'" v-model="item.val" placeholder="请选择预警级别"
                                    style="width: 100%;height: 100%; font-size: calc(0.6vw + 0.6vh);">
                                    <el-option v-for="(item, index) in warnLevelList" :key="index" :value="item">
                                        <span style="width: 100%;text-align: center;">{{ item }}</span>
                                    </el-option>
                                </el-select>

                                <el-date-picker v-else-if="item.key === '监测起始时间'" v-model="item.val" type="date"
                                    placeholder="请选择监测起始时间" format="YYYY-MM-DD" date-format="MMM DD, YYYY" />


                                <div v-else-if="item.key === '中心坐标'" class="full">
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
                                </div>

                                <el-input v-else v-model="item.val" style="
                                width: 100%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            " :placeholder="'请输入' + item.key" :type="item.type.includes('long-text')
                                ? 'textarea'
                                : 'text'
                                " :autosize="{ minRows: 4, maxRows: 6 }" />

                            </div>

                        </div>

                        <div style="margin-top: 20vh;"></div>
                    </div>
                </el-scrollbar>

            </div>
        </div>


        <!-- <div class="resource-box-container">
            <div class="title-container">岸段资源上传</div>
            <div class="resource-content-container">
                <el-scrollbar height="75vh">
                    <div class="resource-box-item" v-for="(item, resourceTypeIndex) in resourceInfo"
                        :key="resourceTypeIndex">
                        <div class="resource-title">
                            {{ resourceTypeIndex + 1 + ' ' + item.key }}
                            <div class="resource-upload-btn" @click="resourceUploadClickHandler(resourceTypeIndex)">上传</div>
                        </div>
                        <div class="resource-content">

                            <el-table :data="item.resourceList" style="width: 100%" max-height="25vh">
                                <el-table-column v-for="(column, index) in tableColumnInfo" :key="index" :prop="column.prop"
                                    :label="column.label" :min-width="column['min-width']" align="center">
                                    <template #default="scope" v-if="column.asTag">
                                        <div style="display: flex; align-items: center;justify-content: center;">
                                            <el-tag>{{ scope.row.fileType }}</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div> -->
    </div>

    <!-- <el-dialog v-model="dialogFormVisible" width="20vw" :show-close="false">
        <template #header="{ titleId, titleClass }">
            <div class="form-header" style="">
                {{ '● ' + dialogFormTitle }}
            </div>
        </template>
        <el-form :model="dialogInfo">
            <el-form-item v-for="(item, index) in dialogInfo" :key="index" :label="item.label">
                <el-input v-model="item.value" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog> -->
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { defaultBankBasic_Style_Info } from './bankResource'
import BankResourceHelper from '../modelStore/views/bankResourceHelper';
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus';
import { number } from 'echarts';


const emit = defineEmits(['refresh-bank-list'])

//////////////////////////// bank basic info

const warnLevelList = ["I 级预警岸段", "Ⅱ 级预警岸段", "Ⅲ 级预警岸段"]

const bank = reactive({
    name: '',
    bankEnName: ''
})
const lnglat = reactive({
    lng: '',
    lat: ''
})

const bankBasicInfo = ref(defaultBankBasic_Style_Info)

////////////////// DEBUG ////////////////
// window.addEventListener('keydown', e => {
//     if (e.key === 'e') {
//         const parseLonLat = (inputStr) => {
//             const coordinates = inputStr.slice(1, -1).split(',');
//             const longitude = parseFloat(coordinates[0]);
//             const latitude = parseFloat(coordinates[1]);
//             return [longitude, latitude]
//         }
//         let nowBasicInfo = bankBasicInfo.value
//         let ReqBody = {
//             "bank": bank.bankEnName,
//             "name": bank.name,
//             "riskLevel": nowBasicInfo[0].val,
//             "center": parseLonLat(nowBasicInfo[1].val),
//             "monitorLength": nowBasicInfo[2].val,
//             "monitorStartTime": nowBasicInfo[3].val.toISOString(),
//             "introduction": nowBasicInfo[4].val,
//             "management": {
//                 "department": nowBasicInfo[5].val,
//                 "contact": nowBasicInfo[6].val,
//             }
//         }
//         console.log(ReqBody)
//     }
// })

const createNewBankClickHandler = async () => {
    const haveNULL = Object.values(bank).some(item => item === '' || item === null || item === undefined)
    if (haveNULL) {
        ElMessage({
            type: 'error',
            message: '请填写完整的岸段信息',
            offset: 120
        })
        return
    }


    ElMessageBox.confirm(
        '确认创建新的岸段？',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(async () => {
        console.log(bankBasicInfo.value)
        let nowBasicInfo = bankBasicInfo.value
        let center = [parseFloat(lnglat.lng), parseFloat(lnglat.lat)]
        let ReqBody = {
            "bank": bank.bankEnName,
            "name": bank.name,
            "riskLevel": nowBasicInfo[0].val,
            "center": center,
            "monitorLength": nowBasicInfo[2].val,
            "monitorStartTime": nowBasicInfo[3].val ? nowBasicInfo[3].val.toISOString() : (new Date()).toISOString(),
            "introduction": nowBasicInfo[4].val,
            "management": {
                "department": nowBasicInfo[5].val,
                "contact": nowBasicInfo[6].val,
            }
        }
        const createMsg = (await BankResourceHelper.createNewBank(bank.bankEnName, ReqBody)).data
        ElNotification.success({
            'title': createMsg,
            'offset': 120
        })
        emit('refresh-bank-list', true)

    }).catch((e) => {
        console.log('取消创建岸段', e);
    })
}









/////////////////////////// bank resource info
// const resourceInfo = defaultBankResouceList
// const tableColumnInfo = [
//     {
//         prop: "name",
//         label: "名称",
//         "min-width": "25%",
//         asTag: false
//     },
//     {
//         prop: "sets",
//         label: "工况集",
//         "min-width": "25%",
//         asTag: false
//     },
//     {
//         prop: "year",
//         label: "年份",
//         "min-width": "25%",
//         asTag: false
//     },
//     {
//         prop: "fileType",
//         label: "文件类型",
//         "min-width": "25%",
//         asTag: true
//     },
// ]

// ///////////// bank resource upload
// const dialogFormVisible = ref(false)
// const dialogFormTitle = ref('资源上传')
// const dialogInfo = ref([
//     {
//         label: '岸段',
//         enName: 'segment',
//         value: bank.name
//     },
//     {
//         label: '年份',
//         enName: 'year',
//         value: '2023'
//     },
//     {
//         label: '工况集',
//         enName: 'set',
//         value: 'standard'
//     },
//     // {
//     //     label: '文件类型',
//     //     enName: 'category',
//     //     value: 'DEM'    (DEM|Hydrodynamic|Boundary|Config)
//     // }
//     {
//         label: '备注',
//         enName: 'description',
//         value: ''
//     },
//     {
//         label: '边界',
//         enName: '',
//         value: ''
//     },
//     // {
//     //     label: '其他',
//     //     enName: 'temp',
//     //     value: ''
//     // },

// ])


// const resourceUploadClickHandler = (resourceTypeIndex) => {
//     const type = ['地形', '水动力', '边界', '配置']
//     dialogFormTitle.value = `${type[resourceTypeIndex]}资源上传`
//     dialogFormVisible.value = true
// }









onMounted(() => {
})


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
    // overflow: hidden;

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

        // border-bottom: 4px solid #0040a0;
    }

    div.content {
        position: absolute;
        width: 100%;
        height: 84.5vh;
        top: 6vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #0040a037;

        div.desc-box-container {
            position: relative;
            // position: absolute;
            // top: 6vh;

            width: 43vw;
            height: 84.5vh;

            margin-top: 1vh;
            margin-bottom: 1vh;
            margin-left: 0.5vw;
            margin-right: 0.5vw;

            background-color: aliceblue;
            border-right: 5px solid #6399ff;
            border-left: 5px solid #6399ff;

            // border: 2px solid #7aa8ff;

            // border-radius: 12px;

            // box-shadow: 10px 12px 20px -10px rgba(0, 0, 0, 0.8);

            // overflow: hidden;

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

                .upload-btn {
                    position: absolute;
                    right: 1vw;
                    top: .5vh;
                    width: 5vw;
                    height: 5vh;
                    line-height: 5vh;
                    text-align: center;
                    font-size: calc(0.9vw + 0.7vh);
                    font-weight: bold;
                    background-color: rgb(184, 235, 255);
                    color: #002d70;
                    border-radius: 5px;
                    transition: .3s ease-in-out;

                    &:hover {
                        cursor: pointer;
                        background-color: rgb(133, 220, 255);
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
                    position: relative;
                    width: 8vw;
                    height: 4vh;
                    top: 2vh;
                    left: 30vw;

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

        // overflow: hidden;

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
                        transition: .3s ease-in-out;

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
    color: #0a56fa;
    font-weight: 800;
    background-color: #b1e0ff;
    width: 108%;
    margin-left: -4%;
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
        font-weight: 500;
    }

    .el-select__wrapper {
        height: inherit;
        line-height: inherit;
    }

    .el-select__selected-item {
        font-size: calc(0.6vh + 0.6vw);
        font-weight: 500;
    }
}

div.full {
    position: relative;
    width: 100%;
    height: 100%;
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
</style>