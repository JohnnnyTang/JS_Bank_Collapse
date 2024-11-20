<template>
    <div class="riskInfo-container">
        <div class="riskInfo-title">
            <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">岸坡断面形态变化</dv-border-box2>
            <button class="condition-button" @click="editClickHandler()" :class="{ 'active': true }">编辑</button>
        </div>
        <div class="riskInfo-item profileShape">
            <div class="item-title">{{ selectedSection.label }}</div>
            <div class="profile-selector-container">
                <el-select v-model="selectedSection" placeholder="选择断面" @change="sectionSelectHandler"
                    style="width: 8vw; height: 3.5vh;" value-key="label">
                    <el-option v-for="(
                                  item, index
                              ) in sectionList" :key="index" :value="item" :label="item.label">
                    </el-option>
                </el-select>
            </div>
            <div class="graph-container shape">
                <div ref="shapeGraphRef" class="shape graph"></div>
                <div v-if="calculating" v-loading="calculating" class="empty-graph"
                    element-loading-background="rgba(255, 255, 255, 0.243)">
                    <span style="margin-top: 6vh;">{{ emptyMessage }}</span>
                </div>
            </div>
        </div>




        <div class="edit-pannel-container" v-if="editPannelShow">
            <div class="title">编辑页面</div>
            <div class="part">
                <span>滩槽高程：</span>
                <el-input v-model="inputValues.gaocha" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
            </div>
            <div class="part">
                <span>岸坡坡比：</span>
                <el-input v-model="inputValues.pobi" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
            </div>
            <div class="part">
                <span>冲刷幅度：</span>
                <el-input v-model="inputValues.speed" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
            </div>
            <div class="submit">
                <button class="cancel-button" @click="cancelEditData" style="width: 3vw; height: 2.5vh; font-size: medium;">
                    取消
                </button>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <button class="submit-button" @click="editData" style="width: 3vw; height: 2.5vh; font-size: medium;">
                    修改
                </button>
            </div>
        </div>
        <div class="text-info-container">
            <div class="text-info-block">
                <div class="text-info-item">
                    2023年该断面滩槽高程为 <span style="color: rgb(226, 80, 80);">{{ gaocha }}</span> m
                </div>
            </div>
            <div class="text-info-block">
                <div class="text-info-item">
                    2023年断面最大岸坡坡比为<span style="color: rgb(226, 80, 80);">{{ pobi }}</span>
                </div>
            </div>
            <div class="text-info-block">
                <div class="text-info-item">
                    1999~2023年断面年最大冲刷幅度为 <span style="color: rgb(226, 80, 80);">{{ speed }}</span> m/年
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted, watch, defineEmits, reactive, computed } from 'vue'
import { ElPopover, ElButton, ElSelect, ElOption, ElInput, ElMessage } from 'element-plus';
import { drawShapeCompareGraph } from './util.js'
import { useBankNameStore } from '../../store/bankNameStore';
import BankResourceHelper from '../modelStore/views/bankResourceHelper';
import ModelRunner from '../modelStore/modelRunner';





let formDataTextUp = null
let formDataTableUpdate = null
let bank = useBankNameStore().globalBankName

const shapeGraphRef = ref(null)
const editPannelShow = ref(false)



const gaocha = ref('')
const pobi = ref('')
const speed = ref('')
const inputValues = ref({
    gaocha: '',
    pobi: '',
    speed: ''
});

const newBackendInstance = axios.create({
    baseURL: '/model/'
})

const emit = defineEmits(['profileValueChange'])

const props = defineProps({
    // profileData: {
    //     type: Object,
    // },
    // profileDataCompare: {
    //     type: Object,
    // },
    // profileList: {
    //     type: Object
    // },
    // shapeChartLoad: {
    //     type: Boolean
    // }
    nowDEMs: {
        type: Array,
        default: []
    }
})
watch(() => props.nowDEMs, (newVal) => {
    console.log("nowDEMs的值是:", newVal)
    // 换地形了，重新算
    sectionSelectHandler()
})



//////////////// 断面选择，调用模型，复用断面形态 /////////////////
let chartIns = null
const calculating = ref(false)
const emptyMessage = ref('正在提取断面形态，请稍后...')
const sectionList = ref([])
const selectedSection = ref({})
const sectionDataCache = new Map()

const selectedLabel = computed(() => {
    return selectedSection.value.label
})

const initSectionList = async () => {
    // 此处用于断面形态计算，用 long section
    const data = (await BankResourceHelper.getBankSectionGeometry(bank, "long")).data
    sectionList.value = data
    selectedSection.value = data[0]
}

const sectionSelectHandler = async () => {

    //更新下面的文本，这个快，不影响，不await了
    getSectionData()

    // 调用模型，获取两地形的断面形态
    const dem1 = props.nowDEMs[0]
    const dem2 = props.nowDEMs[1]
    const sectionGeojson = selectedSection.value

    calculating.value = true

    console.log(sectionGeojson)

    let data = null;
    if (sectionDataCache.get(selectedSection.value.label)) {
        data = sectionDataCache.get(selectedSection.value.label)
        console.log("cache hit:", data)

    } else {
        data = await calculatTwoSectionView(dem1, dem2, sectionGeojson)
        console.log("计算的结果是:", data)
        if (data)
            sectionDataCache.set(selectedSection.value.label, data)
    }




    calculating.value = false

    const option = genChartOption(data.sec1, data.sec2)
    chartIns.resize()
    chartIns.setOption(option)




}


















const cancelEditData = () => {
    editPannelShow.value = false;
}

const editData = async () => {
    // console.log(selectedLabel.value)
    console.log("输入的内容:", inputValues.value)
    try {
        //更新
        formDataTableUpdate = new FormData();
        const data = {
            text: inputValues.value
        }
        formDataTableUpdate.append('data', JSON.stringify(data))
        const responseUpdate = await newBackendInstance.put(`/data/bankResource/update/local/resource/text/${bank}/${selectedLabel.value}`, data, {
            headers: {
                'Content-Type': 'application/json', // 设置请求头为 application/json
            },
        });
        console.log("更新的内容是:", data)
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
    }
    getSectionData()
    editPannelShow.value = false;
};

const editClickHandler = async () => {
    // selectedLabel = profileValue.value ? profileValue.label : '';
    getSectionData()
    console.log("编辑的断面是:", selectedLabel.value)
    try {
        formDataTextUp = new FormData();
        const info = {
            name: selectedLabel.value,
            text: selectedLabel.value
        };
        formDataTextUp.append('info', JSON.stringify(info));
        const responseUp = await newBackendInstance.post(`/data/bankResource/up/local/resource/${bank}/text`, formDataTextUp, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('上传失败:', error);
        // ElMessage.error('上传失败');
    }
    // getSectionData()
    editPannelShow.value = !editPannelShow.value;
};

const getSectionData = async () => {
    try {
        const response = await newBackendInstance.get(`/data/bankResource/bank/text?bank=${bank}`);
        const data = response.data;
        console.log("获取断面数据的是:", selectedLabel.value)
        const textItem = data.find(item => item.name === selectedLabel.value);
        gaocha.value = textItem.text.gaocha;
        pobi.value = textItem.text.pobi;
        speed.value = textItem.text.speed;
        inputValues.value.gaocha = textItem.text.gaocha;
        inputValues.value.pobi = textItem.text.pobi;
        inputValues.value.speed = textItem.text.speed;
        console.log("获取的断面流速是:", inputValues.value.speed)
    } catch (error) {
        console.error('获取地质结构描述失败:', error);
        // ElMessage.error('获取地质结构描述失败');
    }
};

onMounted(async () => {


    // 获取断面列表, 设置初始断面
    await initSectionList()

    // 获取初始断面的下面几行文本
    await getSectionData()

    // 初始化图表
    chartIns = echarts.init(shapeGraphRef.value)

    // 首次调用模型并绘制
    await sectionSelectHandler()

})



////////////////////// HELPERS //////////
const calculatTwoSectionView = async (dem1, dem2, sectionGeojson) => {
    if (!(dem1 && dem2 && sectionGeojson)) return null

    return new Promise(async (resolve, reject) => {

        const result1 = await sectionViewModelRun(dem1.path, sectionGeojson).catch(reject)
        const result2 = await sectionViewModelRun(dem2.path, sectionGeojson).catch(reject)
        console.log(result1, result2)
        resolve({
            sec1: {
                demName: dem1.name + '地形',
                lineData: dataGenerate(result1)
            },
            sec2: {
                demName: dem2.name + '地形',
                lineData: dataGenerate(result2)
            }
        })

    })
}
const sectionViewModelRun = async (demid, sectionGeojson, successCallback, errorCallback) => {

    return new Promise(async (resolve, reject) => {
        let param = {
            'dem-id': demid,
            'section-geometry': sectionGeojson,
        }

        let sectionViewModelUrl = '/model/taskNode/start/riverbedEvolution/calculateSectionView'
        const sectionViewMR = new ModelRunner(sectionViewModelUrl, param)
        const taskId = await sectionViewMR.modelStart().catch(() => {
            ElNotification({
                position: 'top-left',
                type: 'error',
                title: '断面形态计算模型启动失败',
                offset: 130
            })
        })
        let statusInterval = setInterval(async () => {
            const status = await sectionViewMR.getRunningStatus()
            console.log('status', status)
            switch (status) {
                case 'RUNNING':
                case 'LOCK':
                case 'UNLOCK':
                    reject()
                    break
                case 'COMPLETE':
                    clearInterval(statusInterval)
                    const result = await sectionViewMR.getModelResult()
                    let sectionFileName = result['raw-json']
                    const sectionJson = await sectionViewMR.getModelResultFile(sectionFileName, 'json').catch((err) => {
                        ElNotification({
                            position: 'top-left',
                            offset: 130,
                            type: 'error',
                            title: '错误',
                            message: '断面形态计算完毕，但获取断面信息失败！',
                        })
                        reject()
                    })
                    successCallback && successCallback(sectionJson)
                    resolve(sectionJson)

                    break
                case 'ERROR':
                    clearInterval(statusInterval)
                    let errorLog = await sectionViewMR.getErrorLog()

                    errorCallback && errorCallback()
                    reject()
                    break
            }
        }, 1000)
    })

}


const dataGenerate = (origin) => {
    const lineData = []
    const lineDataStep = origin['step']
    for (let i = 0; i < origin['points'].length; i++) {
        let point = origin['points'][i]
        lineData.push([lineDataStep * i, point[2]])
    }
    return lineData
}


const genChartOption = (sec1, sec2) => {

    const option = {
        backgroundColor: "rgba(220, 250, 248, 0.3)",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            },
        },
        grid: [
            {
                top: '20%',
                height: '70%',
                width: '77%',
                show: true,
            },
        ],
        legend: {
            right: '12%',
            top: '2%',
            inactiveColor: 'rgb(86,88,93)',
            inactiveBorderColor: 'rgb(86,88,93)',
            inactiveBorderWidth: 2,
            lineStyle: {
                inactiveColor: 'rgb(86,88,93)',
                inactiveWidth: 1,
            },
        },
        xAxis: [
            {
                type: 'category',
                position: 'bottom',
                axisLine: {
                    lineStyle: {
                        color: 'black'
                    },
                    onZero: false,
                },
                axisTick: {
                    interval: 500
                },
                axisLabel: {
                    // 使用formatter函数格式化刻度标签，去掉小数位（这里其实就是整数，只是以防万一有计算导致出现小数情况）
                    formatter: function (value) {
                        return value.toString().split('.')[0];
                    }
                },
                name: '长度(m)',  // 添加这行代码，设置x轴标题
                nameLocation: 'end',  // 设置标题位置为居中，可根据喜好调整，还有'start'、'end'等选项
                nameTextStyle: {
                    fontSize: 14,  // 设置标题字体大小
                    fontWeight: 'bold'  // 设置标题字体加粗，可按需修改样式
                }
            },
        ],
        yAxis: [
            {
                type: 'value',
                splitLine: {
                    show: false,
                },
                scale: true,
                max: 8,
                min: -40,
                axisLine: {
                    lineStyle: {
                        color: 'black'
                    }
                },
                name: '长度(m)',  // 添加这行代码，设置x轴标题
                nameLocation: 'end',  // 设置标题位置为居中，可根据喜好调整，还有'start'、'end'等选项
                nameTextStyle: {
                    fontSize: 14,  // 设置标题字体大小
                    fontWeight: 'bold'  // 设置标题字体加粗，可按需修改样式
                }
            },
        ],
        series: [
            {
                name: sec1.demName,
                type: 'line',
                smooth: true,
                data: sec1.lineData,
                lineStyle: {
                    color: 'rgb(243,156,67)',
                },
                itemStyle: {
                    color: 'rgb(243,156,67)',
                },
            },
            {
                name: sec2.demName,
                type: 'line',
                smooth: true,
                data: sec2.lineData,
                lineStyle: {
                    color: 'rgb(16,16,255)',
                },
                itemStyle: {
                    color: 'rgb(16,16,255)',
                },
            }
        ],
        graphic: {
            elements: [
                {
                    type: 'text',
                    style: {
                        text: '民主沙右缘岸滩',
                        x: 70,
                        y: 70,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '浏海沙水道右岸',
                        x: 400,
                        y: 70,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
            ]
        },
    }

    return option
}

</script>

<style lang="scss" scoped>
div.riskInfo-container {
    position: absolute;
    // top: 54.25vh;
    top: 17vh;
    left: 0.3vw;
    height: 70vh;
    width: 26vw;
    border-radius: 8px;
    border: #167aec 1px solid;
    background-color: rgba(179, 201, 228, 0.6);
    backdrop-filter: blur(10px);
    z-index: 2;

    div.riskInfo-title {
        height: 2vh;
        width: 10vw;
        margin-left: 7.5vw;
        margin-top: 0.6vh;
        line-height: 4.3vh;
        border-radius: 6px;
        // background-color: rgba(235, 240, 247, 0.4);
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.7vw + 0.7vh);
        color: #0c60af;
        text-shadow:
            #f1f1ef 1px 1px,
            #eef3ff 2px 2px,
            #6493ff 3px 3px;

        :deep(.dv-border-box-2) {
            width: 10vw;
            height: 4.6vh;
        }

        button.condition-button {
            position: absolute;
            right: 1.3vw;
            top: 1.5vh;
            width: 3vw;
            height: 3vh;
            background: #0254bed0;
            color: #fff;
            font-family: inherit;
            font-weight: 900;
            font-size: calc(0.3vw + 0.7vh);
            border: 1px solid rgb(3, 107, 167);
            border-radius: 0.4em;
            box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
            cursor: pointer;
            transition: 0.3s linear;

            &:hover {
                background: #348cffd0;
            }
        }
    }

    div.riskInfo-item {
        position: absolute;
        width: 25vw;
        left: 0.5vw;
        border-radius: 6px;
        border: #3b85e7 2px solid;

        &.profileShape {
            top: 5.5vh;
            height: 45vh;
            // background-color: #c9cad4;
        }

        div.item-title {
            position: absolute;
            top: 1vh;
            left: 0.5vw;
            font-size: calc(0.6vh + 0.6vw);
            font-weight: 600;
            font-family: 'Microsoft YaHei';
            // color: #a231e4;
            // text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
        }

        .el-popover {
            .el-popover__is-light {
                background: red;
            }

        }

        div.profile-show-container {
            position: absolute;
            top: 6.2vh;
            width: 0.7vw;
            height: 1.5vh;
            left: 23vw;
            z-index: 5;
            background-color: rgba(67, 148, 240, 0.6);
            border: #56636b solid 2px;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s linear;

            &:hover {
                transform: scale(1.1);
                cursor: pointer;
            }
        }

        div.profile-selector-container {
            position: absolute;
            width: 10vw;
            height: 4vh;
            left: 12vw;
            top: 1vh;
            // background-color: #d1d2db;

            :deep(.el-select) {
                left: 4vw;
                top: 0.4vh;
                box-shadow:
                    rgba(0, 132, 255, 0.8) 1px 1px,
                    rgba(0, 119, 255, 0.7) 1px 1px,
                    rgba(0, 119, 255, 0.6) 2px 2px;
                border-radius: 6px;
            }

            :deep(.el-select__wrapper) {
                height: 3vh;
                line-height: 3vh;
                border-radius: 6px;
                font-family: 'Microsoft YaHei';
                font-weight: bold;
                font-size: calc(0.4vw + 0.5vh);
                background-color: rgba(230, 253, 255, 0.7);
            }

            :deep(.el-select__placeholder) {
                color: #1c68cc;
            }

            :deep(.el-icon) {
                width: 0.8vw;
                height: 0.8vw;

                svg {
                    width: 0.8vw;
                    height: 0.8vw;

                    path {
                        fill: #00098a;
                    }
                }
            }

            :deep(.el-select__tags-text) {
                color: #2b61f7;
                font-size: calc(0.4vw + 0.4vh);
            }
        }

        div.graph-container {
            position: absolute;
            width: 24vw;
            top: 5.6vh;
            left: 0.25vw;

            &.shape {
                height: 38vh;
                backdrop-filter: blur(5px);
                // background-color: rgba(220, 250, 248, 0.4);
            }

            &.erosion {
                height: 17vh;
                backdrop-filter: blur(5px);
                // background-color: #00098a;
            }

            div.graph {
                position: relative;
                width: 100%;
                height: 100%;

                &.shape {
                    // height: 35vh;
                    // background-color: rgba(220, 250, 248, 0.4);
                }

                &.erosion {
                    // height: 17vh;
                    // background-color: #00098a;
                }

                z-index: 99;
            }

            div.empty-graph {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #1c68cc;
                font-size: calc(0.8vw + 0.5vh);
                font-family: 'Microsoft YaHei';
                background-color: rgb(180, 211, 233);
                font-weight: bold;
                z-index: 999;
            }
        }
    }

    div.edit-pannel-container {
        position: absolute;
        left: 26.2vw;
        bottom: 0vh;
        display: flex;
        flex-direction: column;
        border: #167aec 1px solid;
        background-color: rgba(179, 201, 228, 0.6);
        backdrop-filter: blur(6px);
        border-radius: 5px;
        height: 26%;
        width: 40%;
        font-family: 'Microsoft YaHei', 'sans-serif';

        div.title {
            display: flex;
            width: 100%;
            height: 20%;
            color: #0c60af;
            letter-spacing: 0.1vw;
            font-weight: bold;

            font-size: calc(0.8vw + 0.6vh);
            line-height: 4vh;
            justify-content: center;
            align-items: center;
            text-shadow:
                #f1f1ef 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
        }

        div.part {
            display: flex;
            height: 20%;
            left: 4vw;
            font-size: calc(0.6vw + 0.5vh);
            font-weight: 700;
            color: #444;
            align-items: center;
            justify-content: center;
        }

        div.submit {
            height: 20%;
            display: flex;
            justify-content: center;
            align-items: center;

            .submit-button {
                background: #0254bed0;
                color: #fff;
                font-family: inherit;
                font-weight: 900;
                font-size: calc(0.3vw + 0.7vh);
                border: #167aec 1px solid;
                border-radius: 0.4em;
                box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
                cursor: pointer;
                z-index: 4;
                transition: 0.3s linear;

                &:hover {
                    background: #348cffd0;
                }
            }

            .cancel-button {
                background: #ffffff;
                color: #000000;
                font-family: 'Microsoft YaHei';
                font-weight: 900;
                font-size: calc(0.3vw + 0.7vh);
                border: #167aec 1px solid;
                border-radius: 0.4em;
                box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
                cursor: pointer;
                z-index: 4;
                transition: 0.3s linear;

                &:hover {
                    background: #348cffd0;
                }
            }
        }
    }

    div.text-info-container {
        position: absolute;
        top: 52vh;
        width: 25vw;
        height: 17vh;
        left: 0.5vw;
        // background-color: rgb(223, 255, 250, 0.719);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;

        div.text-info-block {

            width: 22vw;
            height: 4.5vh;
            background-color: #1f73c2;
            margin-top: 0.2vh;
            margin-bottom: 0.2vh;
            border-radius: 10px;

            div.text-info-item {
                text-align: center;
                line-height: 4.5vh;
                position: relative;
                color: #ffffff;
                font-size: calc(0.7vw + 0.5vh);
                font-family: 'Microsoft YaHei';
                font-weight: bold;
            }

        }

    }
}
</style>
    