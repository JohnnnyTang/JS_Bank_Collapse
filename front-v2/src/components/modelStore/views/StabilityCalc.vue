<template>
    <div class="stability-analysis">
        <ModelTitleVue :ModelName="'近岸动力分析模型'" />
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
                                    <div class="content" style="flex-grow: 0; height: 35vh;">
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
                                                    <span>{{ node.label }}</span>
                                                </span>
                                            </template>
                                        </el-tree>
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
                                        <div class="desc one-center">选择工况节点以查看信息</div>
                                    </div>
                                </div>

                            </div>

                        </div>


                        <div class="visulization-result flex-row">
                            <div class="card">
                                <div class="title">
                                    <span style="font-size: medium; margin-left: .5vw;margin-right: .1vw;">➤</span> 工况可视化
                                </div>
                                <div class="content">
                                    <div class="slide-control-block">
                                        <label class="switch">
                                            <input type="checkbox" :checked="showFlow == 1"
                                                @click="showFlowClickHandler(1)" />
                                            <span class="slider"></span>
                                        </label>
                                        <div class="text-block">
                                            <div class="text">拉格朗日场</div>
                                        </div>
                                    </div>

                                    <div class="slide-control-block">
                                        <label class="switch">
                                            <input type="checkbox" :checked="showFlow == 2"
                                                @click="showFlowClickHandler(2)" />
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
        </div>
    </div>

    <el-dialog v-model="createNewCaseDialogShow" title="新建工况" width="20vw" @opened="">
        <div class="main-content">
            <el-form :model="newCase" label-width="auto" style="max-width: 600px">
                <el-form-item label="流量">
                    <el-input v-model="newCase.flow" placeholeder="请输入流量" />
                </el-form-item>
                <el-form-item label="潮型">
                    <el-select v-model="newCase.type" placeholder="请选择潮型">
                        <el-option label="大潮" value="dc" />
                        <el-option label="中潮" value="zc" />
                        <el-option label="小潮" value="zc" />
                    </el-select>
                </el-form-item>
                <el-form-item label="加入研判">
                    <el-radio-group v-model="newCase.temp">
                        <el-radio value=false>是</el-radio>
                        <el-radio value=true>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="newCase.desc" type="textarea" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="createNewCaseDialogShow = false">取消</el-button>
                <el-button type="primary" @click="createNewCaseConfirmHandler">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>

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
const visulizationStatus = ref(false)
const createNewCaseDialogShow = ref(false)
const ModelRunningShow = ref(false)
const ModelRunningMessage = ref('模型正在运行中，请稍后...')
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
const newCase = reactive({
    flow: 0,
    type: '',
    temp: null,
    desc: ''
})

const typeMap = {
    'dc': '大潮',
    'zc': '中潮',
    'xc': '小潮'
}
const tempMap = {
    false: '是',
    true: '否'
}
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


// handler
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
const createNewCaseClickHandler = (nodeData, nodeInfo) => {
    clickedSet.data = nodeData
    clickedSet.node = nodeInfo
    console.log('createNewCaseClickHandler', nodeData, nodeInfo)
    createNewCaseDialogShow.value = true
}
const createNewCaseConfirmHandler = () => {
    newCase.temp = newCase.temp === 'true' ? true : false
    console.log('createNewCaseConfirmHandler', newCase)
    console.log(clickedSet)

    const parentNode = treeRef.value.getNode(clickedSet.data)
    const newChild = { lable: `${newCase.flow}${newCase.type}`, type: 'case', temp: newCase.temp, description: newCase.desc }


    treeRef.value.append(newChild, parentNode)
    console.log(treeRef.value.data)

    updateTreeData(treeRef.value.data)
    createNewCaseDialogShow.value = false
}


const showFlowClickHandler = async (id) => {
    console.log(globleVariable)
    if (!visulizationStatus.value) {

        const modelRunnning = async () => {

            let params = {
                flow: clickedNode.flow,
                tideType: clickedNode.type
            }
            let modelPostUrl = ''
            let modelParams = {}

            modelPostUrl = '/temp/taskNode/start/numeric/hydrodynamic'
            modelParams = {
                "water-qs": params.flow,
                "tidal-level": params.tideType,
            }

            console.log('check1 ', modelPostUrl, modelParams)

            const TASK_ID = (await axios.post(modelPostUrl, modelParams)).data
            // const TASK_ID = '1'
            console.log('TASK_ID ', TASK_ID)// 66a23664bec8e12b68c9ce86
            ModelRunningShow.value = true
            ModelRunningMessage.value = '模型正在运行中，请稍后...'
            globleVariable.taskID = TASK_ID
            console.log('===Interval')
            let runningStatusInterval = setInterval(async () => {
                console.log('runningStatusInterval')
                let runningStatus = (await axios.get('/temp/taskNode/status/id?taskId=' + TASK_ID)).data
                ModelRunningMessage.value = '模型正在运行中，请稍后...'
                let randomFactor = 3.0
                if (runningStatus === 'RUNNING') {
                    globleVariable.runningStatus = 'RUNNING'

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
                    globleVariable.runningStatus = 'NONE'
                    clearInterval(runningStatusInterval)
                }
                else if (runningStatus === 'COMPLETE') {
                    clearInterval(runningStatusInterval)
                    let runningResult = (await axios.get('/temp/taskNode/result/id?taskId=' + TASK_ID)).data
                    console.log('runningResult ', runningResult)

                    globleVariable.caseID = runningResult['case-id']
                    globleVariable.pngPrefix = `/temp/data/modelServer/file/image?caseId=${globleVariable.caseID}&name=`
                    globleVariable.binPrefix = `/temp/data/modelServer/file/bin?caseId=${globleVariable.caseID}&name=`
                    globleVariable.stationBinUrl = runningResult['visualization-station-bin']
                    globleVariable.uvBinUrls = runningResult['visualization-uv-bin']
                    let visulizationDescUrl = `/temp/data/modelServer/file/json?caseId=${runningResult['case-id']}&name=${runningResult['visualization-description-json']}`
                    globleVariable.visualizationJsonUrl = visulizationDescUrl
                    console.log('globle data info::', globleVariable)

                    ModelRunningShow.value = false
                    globleVariable.status = true
                    visulizationStatus.value = true
                    globleVariable.runningStatus = 'COMPLETE'

                    ElNotification({
                        title: '模型运行完毕',
                        offset: 120,
                        type: 'success',
                    })

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
                    // showFlowClickHandler(1)
                }
            }, 1000)
        }
        modelRunnning()
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
    mapFlyToRiver(map)
    // realtimeWaterConditionIntervalID = setInterval(() => {
    //     updateRealtimeWaterCondition()
    // }, 1000 * 60 * 5)

    // const data = (await axios.get('/hydrodynamicList')).data
    const data = testData
    const tree_Data = getTreeDataFromJson(data)
    console.log(tree_Data)
    updateTreeData(tree_Data)

})

onUnmounted(() => {
    if (useMapStore().getMap()) {
        flowLayerControl('lagrange', false)
        flowLayerControl('euler', false)
        useMapStore().getMap().remove()
        useMapStore().destroyMap()
    }
})

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return;
    mapIns.fitBounds(
        [
            [120.45997922676836, 32.00001616423072],
            [120.60909640208264, 32.084171362618625],
        ],
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

const testData = {
    "resource": [
        {
            "date": [
                {
                    "sets": [
                        {
                            "list": [
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "10000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "10000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "10000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "104000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "104000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "104000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "13000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "13000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "13000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "16500dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "16500xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "16500zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "20500dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "20500xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "20500zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "24500dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "24500xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "24500zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "28500dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "28500xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "28500zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "32500dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "32500xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "32500zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "35000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "35000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "35000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "40000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "40000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "40000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "45000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "45000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "45000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "51000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "51000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "51000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "57000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "57000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "57000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "62000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "62000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "62000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "74000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "74000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "74000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "84000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "84000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "84000zc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "92000dc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "92000xc",
                                    "temp": false
                                },
                                {
                                    "description": "民主沙示范岸段水动力模型",
                                    "name": "92000zc",
                                    "temp": false
                                }
                            ],
                            "name": "示范工况集"
                        }
                    ],
                    "year": "2024"
                }
            ],
            "name": "民主沙"
        }
    ]
}

const getTreeDataFromJson = (data) => {
    const resource = data.resource
    const result = []

    for (let i = 0; i < resource.length; i++) {
        let bankItem = {
            lable: resource[i]['name'],
            type: 'bank',
            children: []
        }
        let years = []
        for (let j = 0; j < resource[i]['date'].length; j++) {
            let yearItem = {
                lable: resource[i]['date'][j]['year'],
                type: 'year',
                children: [],
            }
            let sets = []
            for (let k = 0; k < resource[i]['date'][j]['sets'].length; k++) {
                let setItem = {
                    lable: resource[i]['date'][j]['sets'][k]['name'],
                    type: 'set',
                    children: []
                }
                let cases = []
                for (let p = 0; p < resource[i]['date'][j]['sets'][k]['list'].length; p++) {
                    let casesItem = {
                        lable: resource[i]['date'][j]['sets'][k]['list'][p]['name'],
                        type: 'case',
                        temp: resource[i]['date'][j]['sets'][k]['list'][p]['temp'],
                        description: resource[i]['date'][j]['sets'][k]['list'][p]['description']
                    }
                    cases.push(casesItem)
                }
                setItem.children = cases
                sets.push(setItem)
            }
            yearItem.children = sets
            years.push(yearItem)
        }
        bankItem.children = years
        result.push(bankItem)
    }
    return result
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
    border-radius: 8px;
    // background-color: rgb(226, 242, 255);
    display: flex;
    flex-direction: column;

    div.title {
        position: relative;
        width: 100%;
        // height: 20%;
        height: 3.5vh;
        font-size: calc(0.7vw + 0.7vh);
        font-weight: bold;
        text-align: left;
        color: #3d4197;
        border-bottom: #364f7ea1 solid 2px;
        background-color: rgb(226, 242, 255);

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
  