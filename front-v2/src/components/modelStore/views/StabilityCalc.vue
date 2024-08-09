<template>
    <div class="stability-analysis">
        <ModelTitleVue :ModelName="'近岸动力分析模型'" v-on:confirm-bank="confirmBankHandler" />
        <div class="main-content">
            <div class="map" id="map" ref="mapRef"></div>
            <div class="model-choice">
                <div class="basemap-radio-container">
                    <el-radio-group v-model="radio1" @change="jump2Model(radio1)">
                        <el-radio-button label="近岸动力评估" value="1" />
                        <el-radio-button label="近岸动力计算" value="2" />
                        <el-radio-button label="近岸演变分析" value="3" />
                    </el-radio-group>
                </div>
            </div>
            <div class="model-pannel one-center">
                <dv-border-box12 :dur="5" :color="['rgb(28, 75, 187)', 'rgb(140, 255, 255)']">
                    <div class="real-content">
                        <div class="tree-container flex-coloum">
                            <div class="card">
                                <div class="title">
                                    <span style="font-size: medium; margin-left: .5vw;margin-right: .1vs;">➤</span> 已建工况
                                </div>
                                <el-scrollbar height="34vh">
                                    <div class="content" style="flex-grow: 0; height: 35vh;"
                                        v-show="selectedBank != null && selectedBank != ''">
                                        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
                                            default-expand-all :expand-on-click-node="false" ref="treeRef">

                                            <template #default="{ node, data }">
                                                <span class="custom-tree-node bank" v-if="data.type === 'bank'">
                                                    <span>{{ node.label }}</span>
                                                </span>

                                                <span class="custom-tree-node year" v-if="data.type === 'year'">
                                                    <span>{{ node.label }}</span>
                                                </span>

                                                <span class="custom-tree-node set" v-if="data.type === 'set'">
                                                    <span>{{ node.label }}</span>
                                                    <span>
                                                        <div @click.stop="createNewCaseClickHandler(data, node)"
                                                            class="button"> 新建工况 </div>
                                                    </span>
                                                </span>

                                                <span class="custom-tree-node case" v-if="data.type === 'case'">
                                                    <span :style="{ 'color': data.temp ? 'black' : '#0077ff' }">{{
                                                        node.label
                                                    }}</span>
                                                </span>
                                            </template>
                                        </el-tree>
                                    </div>
                                    <div class="content" style="flex-grow: 0; height: 35vh;"
                                        v-show="selectedBank == null || selectedBank == ''">
                                        <div class="card one-center">
                                            <div class="desc one-center">选择岸段以查看岸段资源信息</div>
                                        </div>
                                    </div>
                                </el-scrollbar>
                            </div>

                        </div>
                        <div class="case-item-info flex-coloum">
                            <div class="card">
                                <div class="title">
                                    <span style="font-size: medium; margin-left: .5vw;margin-right: .1vs;">➤</span> 工况信息
                                </div>
                                <div class="content">
                                    <el-descriptions direction="horizontal" :column="3" size="default" border
                                        v-show="clickedNode.flow != 0">
                                        <el-descriptions-item label="流量" :span="1" width="1vw" align='center'
                                            class-name="item">{{ clickedNode.flow }}</el-descriptions-item>
                                        <el-descriptions-item label="潮型" :span="1" width="1vw" align='center'
                                            class-name="item">{{ typeMap[clickedNode.type] }}</el-descriptions-item>
                                        <el-descriptions-item label="是否加入研判" :span="1" align='center'><el-tag size="small"
                                                class-name="item">{{ tempMap[clickedNode.temp]
                                                }}</el-tag></el-descriptions-item>
                                        <el-descriptions-item label="备注" align='left' class-name="item">
                                            {{ clickedNode.desc }}
                                        </el-descriptions-item>
                                    </el-descriptions>
                                    <div class="card one-center" v-show="clickedNode.flow == 0">
                                        <div class="desc one-center">选择工况节点以查看工况信息</div>
                                    </div>
                                </div>

                            </div>

                        </div>


                        <div class="visulization-result flex-row">
                            <div class="card">
                                <div class="title">
                                    <span style="font-size: medium; margin-left: .5vw;margin-right: .1vw;">➤</span> 工况可视化
                                    <el-button style="margin-left: 3vw; 
                                    background-color: rgb(197,232,252); 
                                    color: rgb(7,82,119);
                                    font-weight: 700;
                                    border: 0;
                                    font-size: calc(0.65vw + 0.5vh);
                                    padding: 3px 10px;
                                    " type="info" plane @click="visulizationPrepare">加载可视化资源</el-button>
                                </div>
                                <div class="content">
                                    <div class="slide-control-block">
                                        <label class="switch" :class="{ 'forbbidden': globleVariable.status === false }">
                                            <input type="checkbox" :checked="showFlow == 1" @click="showFlowClickHandler(1)"
                                                :disabled="globleVariable.status === false" />
                                            <span class="slider"></span>
                                        </label>
                                        <div class="text-block">
                                            <div class="text">拉格朗日场</div>
                                        </div>
                                    </div>

                                    <div class="slide-control-block">
                                        <label class="switch" :class="{ 'forbbidden': globleVariable.status === false }">
                                            <input type="checkbox" :checked="showFlow == 2" @click="showFlowClickHandler(2)"
                                                :disabled="globleVariable.status === false" />
                                            <span class="slider"></span>
                                        </label>
                                        <div class="text-block">
                                            <div class="text">欧拉场</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </dv-border-box12>
            </div>

            <div class="math-model-calculation flex-coloum" style="align-items: center;" v-show="mathModelCalcBlockShow">
                <div class="main-title">
                    数学模型计算
                    <div class="minimize-btn" @click="mathModelCalcBlockShow = false"></div>
                </div>
                <div class="file-upload-container one-center">
                    <div class="card border">
                        <div class="title">
                            <span style="font-size: medium; margin-left: 1vw; ">➤</span> 文件上传
                        </div>
                        <div class="content flex-coloum" style="justify-content: space-evenly; align-items: center;">
                            <el-button type="primary" plain @click="fileUpload">网格和地形文件</el-button>
                            <el-button type="primary" plain @click="fileUpload">边界条件</el-button>
                            <el-button type="primary" plain @click="fileUpload">初始条件</el-button>
                            <el-button type="primary" plain @click="fileUpload">参数文件</el-button>
                            <el-button type="primary" plain @click="fileUpload">控制文件</el-button>
                        </div>
                    </div>
                </div>
                <div class="model-container one-center">
                    <div class="card border">
                        <div class="title">
                            <span style="font-size: medium; margin-left: 1vw; ">➤</span> 模型计算
                        </div>
                        <div class="content flex-coloum" style="justify-content: flex-start; align-items: center;">
                            <div class="running-container">
                                <div class="flex-row"
                                    style="padding:1vh 0.5vw; width: 12vw;justify-content: space-between;">
                                    <div class="one-center">
                                        <span>状态：<span :style="statusStyle">{{ modelRunnningStatusDesc }}</span></span>
                                    </div>
                                    <div class="one-center">
                                        <el-button type="primary" plain @click="runMathModel">运行</el-button>
                                    </div>
                                </div>
                                <div style="width: 13vw;height: 3vh;margin-top: 1vh;margin-left: 1vw;">
                                    <el-progress :percentage="modelRunnningProgress" :stroke-width="15" striped />
                                </div>
                            </div>

                            <div class="setting-container">
                                <div class="judge-container flex-coloum"
                                    style="justify-content: center; align-items: center;">
                                    <div class="judge-desc">是否作为参考动力条件加入崩岸风险研判 ?</div>

                                    <el-radio-group v-model="mathModelParams.addToRiskJudgeFlag">
                                        <el-radio value="1" size="large"> 是 </el-radio>
                                        <el-radio value="2" size="large"> 否 </el-radio>
                                    </el-radio-group>

                                    <div class="after-judge one-center" v-show="mathModelParams.addToRiskJudgeFlag == 1">
                                        <div class="flex-coloum">
                                            <div style="margin-bottom: 1vh;">
                                                <span>流量：</span>
                                                <el-input v-model="mathModelParams.flow" style="width: 8vw; height: 3.5vh"
                                                    placeholder="请输入流量" />
                                            </div>
                                            <div>
                                                <span>潮型：</span>
                                                <el-select v-model="mathModelParams.tideType" placeholder="请选择潮型"
                                                    style="width: 8vw; height: 3.5vh" @change="">
                                                    <el-option v-for="(item, index ) in tideTypeList" :key="index"
                                                        :label="item" :value="item">
                                                        <div style="text-align: center;">{{ item }}</div>
                                                    </el-option>
                                                </el-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="after-judge one-center" v-show="mathModelParams.addToRiskJudgeFlag == 2">
                                        <div class="flex-row">
                                            <span style="line-height: 3.5vh;">自定义名称：</span>
                                            <el-input v-model="mathModelParams.customName" style="width: 6vw; height: 3.5vh"
                                                placeholder="请输入名称" />
                                        </div>
                                    </div>
                                    <div class="confirm-container one-center"
                                        v-show="mathModelParams.addToRiskJudgeFlag != null">
                                        <el-button style="width: 5vw; font-size: calc(0.7vw + 0.5vh);" type="primary" plain
                                            @click="createNewCaseConfirmHandler">确认</el-button>
                                    </div>

                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="loading-container" v-show="ModelRunningShow">
        <dv-loading class="loading-icon">
            <div class="loading-message">{{ ModelRunningMessage }}</div>
        </dv-loading>
    </div>
</template>
  
<script setup>
import ModelTitleVue from '../ModelTitle.vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { initFineMap } from '../../../utils/mapUtils';
import { useMapStore } from '../../../store/mapStore';
import { ElNotification, ElMessageBox } from 'element-plus'
import axios from 'axios';
import dayjs from 'dayjs';
import FlowFieldLayer from '../../../utils/WebGL/flowFieldLayer'
import { EulerFlowLayer } from '../../../utils/WebGL/eulerFlowLayer'
import * as dat from 'dat.gui'
import { useRouter } from "vue-router";
import '../../../utils/WebGL/dat_gui_style.css'

const mapStore = useMapStore()
const mapRef = ref(null)
const radio1 = ref(2)
const showFlow = ref(0)
const selectedBank = ref('')
const visulizationStatus = ref(false)
const mathModelCalcBlockShow = ref(false)
const ModelRunningShow = ref(false)
const modelRunnningProgress = ref(30)
const ModelRunningMessage = ref('')
const modelRunnningStatusDesc = ref('未运行')
const router = useRouter()
const defaultProps = {
    children: 'children',
    label: 'lable',
}
const treeData = ref([])
const treeRef = ref(null)
const clickedNode = reactive({
    flow: 0,
    type: '',
    temp: false,
    desc: '',
    info: {},
})
const clickedSet = reactive({
    data: {},
    node: {}
})
const tideTypeList = ['小潮', '中潮', '大潮']
const typeMap = {
    'dc': '大潮',
    'zc': '中潮',
    'xc': '小潮'
}
const tempMap = {
    false: '是',
    true: '否'
}



const statusStyle = computed(() => {
    switch (modelRunnningStatusDesc.value) {
        case '未运行':
            return { color: 'rgb(124, 124, 124)' }
        case '运行中':
            return { color: 'rgb(255, 165, 0)' }
        case '运行完毕':
            return { color: 'rgb(0, 180, 0)' }
        default:
            return { color: 'rgb(0, 0, 0)' }
    }
})



/////////////////// 岸段选择
const confirmBankHandler = async (bankName) => {
    console.log('confirmBankHandler', bankName)
    const bankNameMap = {
        '民主沙': 'Mzs'
    }
    mapFlyToRiver(mapStore.getMap(map), bankName)
    const data = (await axios.get(`/temp/dataNode/bank/dataType?dataType=Hydrodynamic&bank=${bankNameMap[bankName]}`)).data
    // const data = t
    const tree_Data = getTreeDataFromJson(data, '民主沙')
    console.log(tree_Data)
    updateTreeData(tree_Data)

    selectedBank.value = bankName

    ElNotification({
        type: 'success',
        title: '选择岸段',
        message: `已选择岸段——${bankName},模型计算将默认采用${bankName}相关资源`,
        offset: 180
    })
}





/////////////////// 资源节点信息记录
const handleNodeClick = (nodeData, nodeInfo) => {
    console.log('nodeData', nodeData)
    console.log('nodeInfo', nodeInfo)
    if (nodeData.type === 'case') {
        const { flow, type } = parseFlowAndType(nodeData.lable)
        clickedNode.flow = flow
        clickedNode.type = type
        clickedNode.temp = nodeData.temp
        clickedNode.desc = nodeData.description
        clickedNode.info = nodeInfo

    }
}




///////////////////////// 新建工况 + 数模计算
const mathModelParams = reactive({
    meshFile: null,
    boudaryFile: null,
    initialFile: null,
    parameterFile: null,
    controlFile: null,
    addToRiskJudgeFlag: null,
    flow: null,
    tideType: null,
    customName: null,
})

const createNewCaseClickHandler = (nodeData, nodeInfo) => {
    clickedSet.data = nodeData
    clickedSet.node = nodeInfo
    console.log('createNewCaseClickHandler', nodeData, nodeInfo)
    mathModelCalcBlockShow.value = true
}

const fileUpload = (type) => {
    ElNotification({
        type: 'info',
        title: '模块正在开发中....'
    })
}
const runMathModel = async () => {
    ElNotification({
        type: 'info',
        title: '模块正在开发中....'
    })
}
const createNewCaseConfirmHandler = () => {

    // console.log(mathModelParams)

    // const parentNode = treeRef.value.getNode(clickedSet.data)
    // const newChild = {
    //     lable: mathModelParams.addToRiskJudgeFlag === '1' ? `${mathModelParams.flow}${mathModelParams.type}` : `${mathModelParams.customName}`,
    //     type: 'case',
    //     temp: mathModelParams.addToRiskJudgeFlag === '1' ? false : true,
    //     description: ''
    // }

    // // console.log(parentNode, newChild)
    // treeRef.value.append(newChild, parentNode)
    // // console.log(treeRef.value.data)

    // updateTreeData(treeRef.value.data)
    // mathModelCalcBlockShow.value = false
    ElNotification({
        type: 'info',
        title: '模块正在开发中....'
    })
}





////////////////////////// 结果可视化
const globleVariable = reactive({
    taskID: null,
    caseID: null,
    pngPrefix: null,
    visualizationJsonUrl: null,
    stationBinUrl: null,
    uvBinUrls: null,
    status: false,
    runningStatus: 'NONE',
    lagrangeLayer: 'flowLayer1',
    eulerLayer: 'flowLayer2',
})

const visulizationPrepare = async () => {
    const modelRunnning = async () => {

        let params = {
            flow: clickedNode.flow,
            tideType: clickedNode.type
        }

        ElNotification({
            type: 'info',
            title: '加载可视化资源',
            message: `流量${params.flow}，潮型${params.tideType}`,
            offset: 120
        })


        let modelPostUrl = ''
        let modelParams = {}

        modelPostUrl = '/temp/taskNode/start/numeric/hydrodynamic'
        modelParams = {
            "water-qs": params.flow,
            "tidal-level": params.tideType,
            "segment": "Mzs",
            "set": "standard",
            "year": "2023",
        }

        console.log('check1 ', modelPostUrl, modelParams)
        ModelRunningShow.value = true
        ModelRunningMessage.value = '正在加载可视化资源...'
        globleVariable.runningStatus = 'start'

        const TASK_ID = (await axios.post(modelPostUrl, modelParams)).data
        // const TASK_ID = '1'
        console.log('TASK_ID ', TASK_ID)// 66a23664bec8e12b68c9ce86
        globleVariable.taskID = TASK_ID
        console.log('===Interval')
        let runningStatusInterval = setInterval(async () => {
            console.log('runningStatusInterval')
            let runningStatus = (await axios.get('/temp/taskNode/status/id?taskId=' + TASK_ID)).data
            ModelRunningMessage.value = '正在加载可视化资源...'
            let randomFactor = 3.0
            if (runningStatus === 'RUNNING') {
                globleVariable.runningStatus = 'RUNNING'
                globleVariable.status = false
            }
            else if (runningStatus === 'ERROR') {
                globleVariable.runningStatus = 'ERROR'

                const url = `/temp/taskNode/result/id?taskId=${TASK_ID}`
                const errorLog = (await axios.get(url)).data['error-log']
                ElNotification({
                    title: '模型运行失败',
                    message: `错误原因:\n` + errorLog,
                    offset: 120,
                    type: 'error',
                })
                ModelRunningShow.value = false
                ModelRunningMessage.value = ''
                globleVariable.runningStatus = 'NONE'
                globleVariable.status = false
                clearInterval(runningStatusInterval)
            }
            else if (runningStatus === 'COMPLETE') {
                clearInterval(runningStatusInterval)
                let runningResult = (await axios.get('/temp/taskNode/result/id?taskId=' + TASK_ID)).data
                console.log('runningResult ', runningResult)

                globleVariable.caseID = runningResult['case-id']
                globleVariable.pngPrefix = `/temp/data/modelServer/down/resource/file/image?name=`
                globleVariable.binPrefix = `/temp/data/modelServer/down/resource/file/bin?name=`
                globleVariable.stationBinUrl = runningResult['visualization-station-bin']
                globleVariable.uvBinUrls = runningResult['visualization-uv-bin']
                let visulizationDescUrl = `/temp/data/modelServer/down/resource/file/json?name=${runningResult['visualization-description-json']}`

                globleVariable.visualizationJsonUrl = visulizationDescUrl
                console.log('globle data info::', globleVariable)

                ModelRunningShow.value = false
                globleVariable.status = true
                visulizationStatus.value = true
                globleVariable.runningStatus = 'COMPLETE'

                ElNotification({
                    title: '可视化资源加载完毕',
                    offset: 120,
                    type: 'success',
                })
            }
        }, 1000)
    }

    if (globleVariable.runningStatus === 'start' || globleVariable.runningStatus === 'RUNNING') {
        ElNotification({
            type: 'warning',
            title: '请等待资源加载...',
            offset: 120
        })
        return
    } else {
        globleVariable.status = false
        showFlow.value = 0
        flowLayerControl('lagrange', false)
        flowLayerControl('euler', false)
        modelRunnning()
    }

}
const flowLayerControl = (type, show) => {
    let map = mapStore.getMap()
    const controlMap = {
        'lagrange': {
            add: () => {
                console.log('add lagrenge');
                let flow = new FlowFieldLayer(globleVariable.lagrangeLayer, globleVariable.visualizationJsonUrl, globleVariable.pngPrefix)
                mapStore.getMap().addLayer(flow, 'mzsLabel')
            },
            remove: () => {
                console.log('rm lagrenge');
                map.getLayer(globleVariable.lagrangeLayer) && map.removeLayer(globleVariable.lagrangeLayer)
            }
        },
        'euler': {
            add: () => {
                console.log('add euler');
                let flow = new EulerFlowLayer(globleVariable.eulerLayer, globleVariable.stationBinUrl, globleVariable.uvBinUrls, globleVariable.binPrefix)
                // let flow = new EulerFlowLayer(globleVariable.eulerLayer, 'station.bin', ['uv_0.bin','uv_1.bin','uv_2.bin'],
                // '/scratchSomething/temp/')

                mapStore.getMap().addLayer(flow, 'mzsLabel')
            },
            remove: () => {
                console.log('rm euler');
                map.getLayer(globleVariable.eulerLayer) && map.removeLayer(globleVariable.eulerLayer)
            }
        }
    }
    controlMap[type][show ? 'add' : 'remove']()
}
const showFlowClickHandler = async (id) => {
    console.log(globleVariable)
    if (!visulizationStatus.value) {
        ElNotification({
            type: 'warning',
            title: '请先加载可视化资源',
            offset: 120
        })
        return;
    }
    else {
        if (id === 1) {
            showFlow.value = showFlow.value === 1 ? 0 : 1
            flowLayerControl('euler', false)
            if (!showFlow.value) {
                flowLayerControl('lagrange', false)
                return
            }
            flowLayerControl('lagrange', true)
            return
        } else if (id === 2) {
            showFlow.value = showFlow.value === 2 ? 0 : 2
            flowLayerControl('lagrange', false)
            if (!showFlow.value) {
                flowLayerControl('euler', false)
                return
            }
            flowLayerControl('euler', true)
            return
        }
    }

}






const updateTreeData = (treedt) => {
    treeData.value = treedt
}

const jump2Model = (value) => {
    console.log(value == '1')
    const routeMap = {
        '1': "/modelStore/stabilityAnalysis",
        '2': "/modelStore/stabilityCalc",
        '3': "/modelStore/analysisCenter"
    }
    routeMap[value] && router.push(routeMap[value])
}



onMounted(async () => {
    let map = await initFineMap(mapRef.value)
    mapStore.setMap(map)

})

onUnmounted(() => {
    if (useMapStore().getMap()) {
        flowLayerControl('lagrange', false)
        flowLayerControl('euler', false)
        useMapStore().getMap().remove()
        useMapStore().destroyMap()
    }
})

const mapFlyToRiver = (mapIns, bankName) => {
    if (!mapIns) return;

    let boundsMap = {
        '民主沙': [
            [120.45997922676836, 32.00001616423072],
            [120.60909640208264, 32.084171362618625],
        ],
    }

    mapIns.fitBounds(
        boundsMap[bankName],
        {
            duration: 1500,
        }
    );
}


/// helper functions
const parseFlowAndType = (name) => {
    let flow = parseInt(name.slice(0, -2))
    let type = name.slice(name.length - 2, name.length)
    console.log(flow, type)
    return { flow, type }
}


const getTreeDataFromJson = (data, bankName) => {
    const result = [
        {
            lable: bankName,
            type: 'bank',
            children: []
        }
    ]
    let years = []
    for (let j = 0; j < data.length; j++) {
        let yearItem = {
            lable: data[j]['year'],
            type: 'year',
            children: [],
        }
        let sets = []
        for (let k = 0; k < data[j]['sets'].length; k++) {
            let setItem = {
                lable: data[j]['sets'][k]['name'],
                type: 'set',
                children: []
            }
            let cases = []
            for (let p = 0; p < data[j]['sets'][k]['list'].length; p++) {
                let casesItem = {
                    lable: data[j]['sets'][k]['list'][p]['name'],
                    type: 'case',
                    temp: data[j]['sets'][k]['list'][p]['temp'],
                    description: data[j]['sets'][k]['list'][p]['description']
                }
                cases.push(casesItem)
            }
            setItem.children = cases
            sets.push(setItem)
        }
        yearItem.children = sets
        years.push(yearItem)
    }
    result[0].children = years
    return result

}



const findNodesByLabel = (tree, label, accumulator = []) => {
    for (let node of tree) {
        if (node.lable === label) {
            accumulator.push(node);
        }
        if (node.children && node.children.length > 0) {
            findNodesByLabel(node.children, label, accumulator);
        }
    }
    return accumulator;
}
</script>
  
<style lang="scss" scoped>
div.flex-coloum {
    display: flex;
    flex-direction: column;
}

div.flex-row {
    display: flex;
    flex-direction: row;
}

div.one-center {
    position: relative;
    display: grid;
    place-items: center;
}

:deep(.el-scrollbar__thumb) {
    background-color: rgb(0, 85, 197);
}

div.card {
    position: relative;
    width: 99%;
    height: 97%;
    border-radius: 2px;
    // background-color: rgb(226, 242, 255);
    display: flex;
    flex-direction: column;

    &.border {
        width: 98%;
        border-top: #05527944 solid 1px;
        border-left: #05527950 solid 1px;
        border-right: #05527952 solid 2px;
        border-bottom: #05527952 solid 2px;
        margin-top: .5vh;
    }

    div.title {
        position: relative;
        width: 100%;
        // height: 20%;
        height: 4vh;
        line-height: 4vh;
        font-size: calc(0.7vw + 0.7vh);
        font-weight: bold;
        text-align: left;
        color: #366ec2;
        border-bottom: #364f7ea1 solid 2px;
        background-color: rgb(243, 243, 243);

    }

    div.content {
        position: relative;
        width: 100%;
        // height: 75%;
        flex-grow: 1;

        // background-color: antiquewhite;
    }

    div.desc {
        position: relative;
        width: 100%;
        height: 100%;
        font-size: calc(0.6vw + 0.8vh);
        font-weight: 600;
        background-color: #ffffffbb;
        backdrop-filter: blur(20px);
    }
}



div.stability-analysis {
    position: absolute;
    width: 100vw;
    height: 92vh;
    display: flex;
    flex-direction: column;
    color: #055279;

    div.main-content {
        position: relative;
        flex-grow: 1;

        div.map {
            position: relative;
            z-index: 0;
            width: 100%;
            height: 100%;
            background-color: hsl(194, 69%, 91%);
        }

        div.model-choice {
            position: absolute;
            top: 0vh;
            height: 8vh;
            width: 20vw;
            background-color: rgba(240, 248, 255, 0);
            color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1;

            div.basemap-radio-container {
                z-index: 1;
                width: 20vw;
                height: 4vh;
                display: flex;
                flex-flow: row nowrap;
                background-color: #fff;
                box-shadow: 0 0 4px 1px rgba(#0642b1, 0.55), 0 6px 12px 0 rgba(#0642b1, 0.55);
                padding: 0.6vh;
                border-radius: 0.6vw; // just a high number to create pill effect
                margin-right: auto;
                margin-left: 8px;

                :deep(.el-radio-group) {
                    // background-color: red;

                    :deep(div.el-radio-button, div.el-radio-button--large) {
                        color: red;
                    }

                }
            }
        }

        div.model-pannel {
            position: absolute;
            z-index: 1;
            top: 8vh;
            left: .2vw;
            width: 20vw;
            height: 76vh;
            background-color: rgb(248, 248, 248);
            // backdrop-filter: blur(20px);
            border-radius: calc(0.1vw + 1vh);

            :deep(.dv-border-box-12) {
                border-radius: calc(0.5vw + 1vh);

                div.border-box-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            div.real-content {
                position: relative;
                width: 18.7vw;
                height: 74vh;
                z-index: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;

                div.tree-container {
                    position: relative;
                    height: 40vh;
                    width: 18.8vw;

                    .card {
                        .content {

                            :deep(.el-tree) {
                                padding: calc(0.3vw + 0.5vh)
                            }

                            .custom-tree-node {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                font-size: 14px;
                                padding-right: 1vw;
                                // padding-top: 1vh;
                                font-size: calc(0.5vw + 0.5vh);


                                &.bank {
                                    font-size: calc(0.6vw + 0.6vh);
                                    font-weight: 800;
                                }

                                &.year {
                                    font-size: calc(0.6vw + 0.5vh);
                                    font-weight: 700;
                                }

                                &.set {
                                    font-weight: 600
                                }


                                .button {
                                    background-color: #47b2ffa6;
                                    color: #fff;
                                    border-radius: 5px;
                                    padding: 5px 6px;
                                    font-size: calc(0.4vw + 0.5vh);
                                    transition: all 0.2s ease-in-out;

                                    &:hover {
                                        background-color: #29a4fc;
                                    }
                                }
                            }
                        }
                    }
                }

                div.case-item-info {
                    position: relative;
                    height: 18lvh;
                    width: 18.8vw;

                    .card {

                        .content {

                            // all cell
                            :deep(.el-descriptions__cell, .el-descriptions__label, .is-bordered-label, .is-center) {
                                font-size: calc(0.5vw + 0.5vh);
                                font-family: 'Microsoft YaHei';
                                font-weight: 800;
                                padding: 1vh .5vw;
                                background-color: #ffffff;

                                &.item {
                                    font-weight: 400;
                                }
                            }

                        }
                    }
                }

                div.visulization-result {
                    position: relative;
                    // width: 100%;
                    width: 18.8vw;
                    flex-grow: 1;

                    div.content {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-evenly;
                        align-items: center;

                        position: relative;
                        width: 100%;
                        height: fit-content;
                        border: 1px solid #dcdfe6;
                        // background-color: #ffffff;

                        div.slide-control-block {
                            position: relative;
                            height: 13vh;
                            width: 6vw;
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            align-items: center;
                            z-index: 3;

                            .switch {
                                font-size: 20px;
                                position: relative;
                                display: inline-block;
                                width: 2em;
                                height: 3.5em;

                                input {
                                    display: none;
                                }

                                /* The slider */
                                .slider {
                                    position: absolute;
                                    cursor: pointer;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background-color: rgb(197, 232, 253);
                                    transition: 0.4s;
                                    border-radius: 10px;

                                    &:before {
                                        position: absolute;
                                        content: "";
                                        height: 1.4em;
                                        width: 1.4em;
                                        border-radius: 5px;
                                        left: 0.3em;
                                        bottom: 0.3em;
                                        background-color: white;
                                        transition: 0.4s;
                                    }
                                }

                                input:checked {
                                    +.slider {
                                        background-color: rgb(53, 101, 174);
                                    }

                                    +.slider:before {
                                        transform: translateY(-1.5em);
                                    }
                                }
                            }

                            .switch.forbbidden {
                                .slider {
                                    cursor: not-allowed;
                                    // pointer-events: none;
                                }
                            }

                            .text-block {
                                font-size: calc(0.6vw + 0.6vh);
                                width: 3em;
                                height: 5em;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                .text {
                                    writing-mode: vertical-lr;
                                    color: #055279;
                                    font-family: "Microsoft YaHei";
                                    font-weight: 700;
                                    user-select: none;
                                }
                            }
                        }
                    }
                }


            }
        }

        div.math-model-calculation {
            position: absolute;
            z-index: 1;
            top: 8vh;
            left: 20.3vw;
            width: 15vw;
            // height: 76vh;
            background-color: rgb(248, 248, 248);
            // backdrop-filter: blur(20px);
            border-radius: calc(0.0vw + 0.5vh);
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

            div.main-title {
                position: relative;
                width: 13vw;
                height: 5vh;
                font-size: calc(0.8vw + 0.7vh);
                font-weight: 800;
                font-family: 'Microsoft YaHei';
                text-align: center;
                line-height: 5vh;
                color: #054bb3;
                // border-bottom: #055279 solid 2px;

                div.minimize-btn {
                    position: absolute;
                    right: .1vw;
                    top: 1.5vh;
                    width: 2vh;
                    height: 2vh;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-image: url('/minimize.png');
                    z-index: 1;
                    cursor: pointer;
                }
            }

            div.file-upload-container {
                position: relative;
                width: 14.8vw;
                height: 26vh;

                :deep(.el-button, .el-button--primary, .is-plain) {
                    width: 8vw;
                    height: 3.7vh;
                    font-size: calc(0.5vw + 0.6vh);
                    font-family: 'Microsoft YaHei';
                    margin: 0;
                }
            }

            div.model-container {
                position: relative;
                width: 14.8vw;
                // height: 44.8vh;
                margin-bottom: .5vh;

                .card {
                    margin-bottom: .7vh;

                    .content {


                        .running-container {
                            margin-top: .5vh;
                            border: #0d6eff54 solid 1px;
                            border-radius: 5px;
                        }

                        .setting-container {
                            margin-top: 1vh;
                            border: #0d6eff54 solid 1px;
                            border-radius: 5px;

                            .judge-container {
                                position: relative;
                                width: 14vw;

                                .judge-desc {
                                    position: relative;
                                    margin-top: 1vh;
                                    margin-bottom: 1vh;
                                    width: 12.5vw;
                                    font-size: calc(0.6vw + 0.4vh);
                                    font-weight: 600;
                                }

                                .after-judge {
                                    position: relative;
                                    margin-top: 1vh;
                                    margin-bottom: 1vh;
                                    width: 12.5vw;
                                    font-size: calc(0.6vw + 0.4vh);
                                    font-weight: 600;
                                }

                                .confirm-container {
                                    position: relative;
                                    margin-top: 1vh;
                                    margin-bottom: 1vh;
                                    width: 12.5vw;
                                    font-size: calc(0.6vw + 0.4vh);
                                }

                            }

                        }

                    }
                }

            }


        }


        :deep(.el-dialog__footer) {
            margin-top: 0;
            padding-top: 0;
        }

    }
}

div.loading-container {
    position: absolute;
    top: 18vh;
    right: 45vw;
    width: 8vw;
    height: 12vh;
    background-color: rgba(255, 255, 255, 0.671);
    border-radius: 5px;
    backdrop-filter: blur(5px);
    z-index: 5;

    :deep(.dv-loading.loading-icon) {
        position: absolute;
    }

    div.loading-message {
        text-align: center;
        position: relative;
        margin-top: 1vh;
        width: 6vw;
        height: 6vh;
        color: #000357;
        // top: 7.3vh;
        font-size: calc(0.6vw + 0.8vh);
        font-weight: 800;
    }
}
</style>
  