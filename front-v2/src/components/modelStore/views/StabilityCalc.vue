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
                                    <span style="
                                            font-size: medium;
                                            margin-left: 0.5vw;
                                            margin-right: 0.1vs;
                                        ">➤</span>
                                    已建工况
                                </div>
                                <el-scrollbar height="34vh">
                                    <div class="content" style="flex-grow: 0; height: 35vh" v-if="selectedBank.name">
                                        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
                                            default-expand-all :expand-on-click-node="false" ref="treeRef">
                                            <template #default="{ node, data }">
                                                <span class="custom-tree-node bank" v-if="data.type === 'bank'">
                                                    <span>{{
                                                        node.label
                                                    }}</span>
                                                </span>

                                                <span class="custom-tree-node year" v-if="data.type === 'year'">
                                                    <span>{{
                                                        node.label
                                                    }}</span>
                                                </span>

                                                <span class="custom-tree-node set" v-if="data.type === 'set'">
                                                    <span>{{
                                                        node.label
                                                    }}</span>
                                                    <span>
                                                        <div @click.stop="
                                                        createNewCaseClickHandler(data, node)
                                                            " class="button">
                                                            新建工况
                                                        </div>
                                                    </span>
                                                </span>

                                                <div class="custom-tree-node case" v-if="data.type === 'case'">
                                                    <span>{{ node.label }}</span>


                                                    <el-tag type="success" v-if="data.tag === '已计算'">{{ data.tag }}</el-tag>

                                                    <el-tooltip content="点击查看计算进度" placement="top" effect="light" v-else>
                                                        <el-tag type="info"
                                                            @click.stop="calcStatusClickHandler(data, node)">{{ data.tag
                                                            }}</el-tag>
                                                    </el-tooltip>

                                                    <el-tag type="error" v-if="data.tag === '错误'">{{ data.tag }}</el-tag>

                                                </div>
                                            </template>
                                        </el-tree>
                                    </div>
                                    <div class="content" style="flex-grow: 0; height: 35vh" v-else>
                                        <div class="card one-center">
                                            <div class="desc one-center">
                                                选择岸段以查看岸段资源信息
                                            </div>
                                        </div>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </div>
                        <div class="case-item-info flex-coloum">
                            <div class="card">
                                <div class="title">
                                    <span style="
                                            font-size: medium;
                                            margin-left: 0.5vw;
                                            margin-right: 0.1vs;
                                        ">➤</span>
                                    工况信息
                                </div>
                                <div class="content">
                                    <el-descriptions direction="horizontal" :column="3" size="default" border
                                        v-show="clickedNode.flow != 0">
                                        <el-descriptions-item label="流量" :span="1" width="1vw" align="center"
                                            class-name="item">{{
                                                clickedNode.flow
                                            }}</el-descriptions-item>
                                        <el-descriptions-item label="潮型" :span="1" width="1vw" align="center"
                                            class-name="item">{{
                                                typeMap[clickedNode.type]
                                            }}</el-descriptions-item>
                                        <el-descriptions-item label="是否加入研判" :span="1" align="center"><el-tag size="small"
                                                class-name="item">{{
                                                    tempMap[clickedNode.temp]
                                                }}</el-tag></el-descriptions-item>
                                        <el-descriptions-item label="备注" align="left" class-name="item">
                                            {{ clickedNode.desc }}
                                        </el-descriptions-item>
                                    </el-descriptions>
                                    <div class="card one-center" v-show="clickedNode.flow == 0">
                                        <div class="desc one-center">
                                            选择工况节点以查看工况信息
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="visulization-result flex-row">
                            <div class="card">
                                <div class="title">
                                    <span style="
                                            font-size: medium;
                                            margin-left: 0.5vw;
                                            margin-right: 0.1vw;
                                        ">➤</span>
                                    工况可视化
                                    <el-button style="
                                            margin-left: 3vw;
                                            background-color: rgb(197,232,252);
                                            color: rgb(0, 109, 155);
                                            font-weight: 700;
                                            border: 0;
                                            font-size: calc(0.65vw + 0.5vh);
                                            padding: 3px 10px;
                                            transition: .3s ease-in-out;
                                            cursor: pointer;
                                            :hover{
                                                background-color: #b6faff;
                                            }
                                        " type="info" plane @click="visulizationPrepare">加载可视化资源</el-button>
                                </div>
                                <div class="content">
                                    <div class="slide-control-block">
                                        <label class="switch" :class="{
                                            forbbidden:
                                                globleVariable.status ===
                                                false,
                                        }">
                                            <input type="checkbox" :checked="showFlow == 1" @click="showFlowClickHandler(1)"
                                                :disabled="globleVariable.status ===
                                                    false
                                                    " />
                                            <span class="slider"></span>
                                        </label>
                                        <div class="text-block">
                                            <div class="text">拉格朗日场</div>
                                        </div>
                                    </div>

                                    <div class="slide-control-block">
                                        <label class="switch" :class="{
                                            forbbidden:
                                                globleVariable.status ===
                                                false,
                                        }">
                                            <input type="checkbox" :checked="showFlow == 2" @click="showFlowClickHandler(2)"
                                                :disabled="globleVariable.status ===
                                                    false
                                                    " />
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

            <div class="math-model-calculation flex-coloum" style="align-items: center" v-show="mathModelCalcBlockShow"
                v-loading="modelStartLoading">
                <div class="main-title">
                    数学模型计算
                    <div class="minimize-btn" @click="mathModelCalcBlockShow = false"></div>
                </div>
                <div class="file-upload-container one-center">
                    <div class="card border" style="margin-top: 0; height: 25.7vh">
                        <div class="title">
                            <span style="font-size: medium; margin-left: 1vw">➤</span>
                            文件上传
                        </div>
                        <div class="content flex-coloum" style="
                                height: 20vh;
                                justify-content: space-evenly;
                                align-items: center;
                            ">
                            <el-upload v-model:file-list="fileLists[index]" action="#" :show-file-list="false" :limit="1"
                                ref="uploadRef" :http-request="handleUpload" v-for="(item, index) in filesNeedUpload
                            " style="height: 4vh">
                                <el-button type="primary" plain>
                                    {{ item }}
                                    <span>({{ exampleFileLists[index] }})</span>
                                </el-button>
                            </el-upload>
                        </div>
                    </div>
                </div>
                <div class="model-container one-center">
                    <div class="card border">
                        <div class="title">
                            <span style="font-size: medium; margin-left: 1vw">➤</span>
                            模型计算
                        </div>
                        <div class="content flex-coloum" style="
                                justify-content: flex-start;
                                align-items: center;
                            ">
                            <div class="setting-container">
                                <div class="judge-container flex-coloum" style="
                                        justify-content: center;
                                        align-items: center;
                                    ">
                                    <div class="judge-desc">
                                        是否作为参考动力条件加入崩岸风险研判 ?
                                    </div>

                                    <el-radio-group v-model="mathModelParams.addToRiskJudgeFlag
                                        ">
                                        <el-radio value="1" size="large">
                                            是
                                        </el-radio>
                                        <el-radio value="2" size="large">
                                            否
                                        </el-radio>
                                    </el-radio-group>

                                    <div class="after-judge one-center" v-show="mathModelParams.addToRiskJudgeFlag ==
                                        1
                                        ">
                                        <div class="flex-coloum">
                                            <div style="margin-bottom: 1vh">
                                                <span>流量：</span>
                                                <el-input v-model="mathModelParams.flow
                                                    " style="
                                                        width: 8vw;
                                                        height: 3.5vh;
                                                    " placeholder="请输入流量" />
                                            </div>
                                            <div>
                                                <span>潮型：</span>
                                                <el-select v-model="mathModelParams.tideType
                                                    " placeholder="请选择潮型" style="
                                                        width: 8vw;
                                                        height: 3.5vh;
                                                        
                                                    " @change="">
                                                    <el-option v-for="(
                                                            item, index
                                                        ) in tideTypeList" :key="index" :label="item"
                                                        :value="tideValue[index]">
                                                        <div style="
                                                                text-align: center;
                                                            ">
                                                            {{ item }}
                                                        </div>
                                                    </el-option>
                                                </el-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="after-judge one-center" v-show="mathModelParams.addToRiskJudgeFlag ==
                                        2
                                        ">
                                        <div class="flex-row">
                                            <span style="line-height: 3.5vh">自定义名称：</span>
                                            <el-input v-model="mathModelParams.customName
                                                " style="
                                                    width: 6vw;
                                                    height: 3.5vh;
                                                " placeholder="请输入名称" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="running-container">
                                <el-button type="primary" plain @click="runMathModel">确认并运行</el-button>
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
    <el-drawer v-model="progressDrawerShow" :with-header="false" direction="rtl">
        <div class="drawer-header">
            <div class="icon"></div>
            <span class="text">模型计算进度</span>
        </div>
        <div class="drawer-content">
            <div class="progress-card" v-for="(item, index) in Object.keys(calcCaseInfo)" :key="index">
                <div class="top-block">
                    <div class="flex-row">
                        <div class="k">工况：</div>
                        <div class="v">{{ item }}</div>
                    </div>
                    <el-tag type="info">运行中</el-tag>
                </div>
                <div class="bot-block">
                    <el-progress :percentage="calcCaseInfo[item]['progress'] || 0" :stroke-width="20"
                        :format="progressFormat" striped striped-flow :duration="25" />
                </div>
            </div>
        </div>


    </el-drawer>
</template>

<script setup>
import ModelTitleVue from '../ModelTitle.vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { initFineMap } from '../../../utils/mapUtils'
import { useMapStore } from '../../../store/mapStore'
import { useMathModelStore } from '../../../store/modelStore'
import { ElNotification, ElMessageBox } from 'element-plus'
import axios from 'axios'
import dayjs from 'dayjs'
import FlowFieldLayer from '../../../utils/WebGL/flowFieldLayer'
import { EulerFlowLayer } from '../../../utils/WebGL/eulerFlowLayer'
import * as dat from 'dat.gui'
import { useRouter } from 'vue-router'
import '../../../utils/WebGL/dat_gui_style.css'
import BankResourceHelper from './bankResourceHelper'

const mapStore = useMapStore()
const mapRef = ref(null)
const radio1 = ref(2)
const showFlow = ref(0)

const visulizationStatus = ref(false)
const mathModelCalcBlockShow = ref(false)
const ModelRunningShow = ref(false)
const ModelRunningMessage = ref('')
const router = useRouter()
const defaultProps = {
    children: 'children',
    label: 'label',
}

const typeMap = {
    dc: '大潮',
    zc: '中潮',
    xc: '小潮',
}
const tempMap = {
    false: '是',
    true: '否',
}

/////////////////// 岸段选择 /////////////////// 
const selectedBank = reactive({
    name: null,
    bankEnName: null
})
const treeData = ref([])
const treeRef = ref(null)
const confirmBankHandler = async (bank) => {
    selectedBank.name = bank.name
    selectedBank.bankEnName = bank.bankEnName
    console.log(selectedBank.bankEnName)
    updateTreeFromBack(selectedBank.bankEnName)
    mapFlyToRiver(mapStore.getMap(map), bank.name)

    ElNotification({
        type: 'success',
        title: '选择岸段',
        message: `已选择岸段——${selectedBank.name},模型计算将采用该岸段相关资源`,
        position: 'top-right',
        offset: 250,
    })
}
const updateTreeFromBack = async (bankEnName) => {
    console.log(bankEnName)
    const hydroData = (await BankResourceHelper.getBankCalculateResourceList('Hydrodynamic', bankEnName)).data
    const _treeData = await getTreeDataFromJson(hydroData, bankEnName)
    updateTreeData(_treeData)
}


/////////////////// 资源节点信息记录 /////////////////// 
const clickedNode = reactive({ flow: 0, type: '', temp: false, desc: '', info: {}, })
const handleNodeClick = (nodeData, nodeInfo) => {
    console.log('nodeData', nodeData)
    console.log('nodeInfo', nodeInfo)
    if (nodeData.type === 'case') {
        const { flow, type } = parseFlowAndType(nodeData.label)
        clickedNode.flow = flow
        clickedNode.type = type
        clickedNode.temp = nodeData.temp
        clickedNode.desc = nodeData.description
        clickedNode.info = nodeInfo
    }
}


//////////////////// 新建工况 + 数模计算 ////////////////////START
////////////// 新建工况
const clickedSet = reactive({
    data: {},
    node: {},
})
const createNewCaseClickHandler = (nodeData, nodeInfo) => {
    clickedSet.data = nodeData
    clickedSet.node = nodeInfo
    console.log('createNewCaseClickHandler', nodeData, nodeInfo)
    mathModelCalcBlockShow.value = true
}


////////////// 数模计算
const mathModelStore = useMathModelStore()
const modelStartLoading = ref(false)

const uploadRef = ref(null)
const filesNeedUpload = ['属性文件', '网格文件', '控制文件', '径流边界', '潮位边界']
const exampleFileLists = ['fort.13', 'fort.14', 'fort.15', 'fort.19', 'fort.20']
const fileLists = ref([[], [], [], [], []])
const mathModelParams = reactive({
    addToRiskJudgeFlag: null,
    flow: null,
    tideType: null,
    customName: null,
})
const tideTypeList = ['小潮', '中潮', '大潮']
const tideValue = ['xc', 'zc', 'dc']
const handleUpload = (file) => {
    console.log('user upload file -- ', file)
}
const getNodeFatherInfo = (node) => {
    const yearNode = node.parent
    return {
        year: yearNode.data.label,
        set: node.data.label
    }

}
const runMathModel = () => {
    // console.log('mathModelParams')
    // console.log(mathModelParams)
    // console.log('file lists')
    // console.log(fileLists.value)

    modelStartLoading.value = true
    const formData = new FormData()
    for (let i = 0; i < fileLists.value.length; i++) {
        const fileList = fileLists.value[i]
        const key = exampleFileLists[i]
        if (fileList.length > 0) {
            const file = fileList[0].raw
            formData.append(key, file)
        } else {
            ElNotification({
                type: 'warning',
                title: '警告',
                message: `文件未完全上传！`,
                offset: 250,
            })
            return
        }
    }
    const name = mathModelParams.addToRiskJudgeFlag == 1 ? '' + mathModelParams.flow + mathModelParams.tideType : mathModelParams.customName
    const { year, set } = getNodeFatherInfo(clickedSet.node)
    const mathModelInfo = {
        "segment": selectedBank.bankEnName,
        "year": year,
        "set": set,
        "name": name,
        "temp": mathModelParams.addToRiskJudgeFlag == 1,
        "boundary": "geojson/Mzs/2023/standard/boundary/boundary.geojson"
    }
    console.log(mathModelInfo)
    formData.append("info", JSON.stringify(mathModelInfo))


    const parentNode = treeRef.value.getNode(clickedSet.data)
    const newChild = {
        label: mathModelParams.addToRiskJudgeFlag === '1' ? `${mathModelParams.flow}${mathModelParams.tideType}` : `${mathModelParams.customName}`,
        type: 'case',
        tag: '计算中',
        temp: mathModelParams.addToRiskJudgeFlag === '1' ? false : true,
        description: '',
        segment: 'Mzs'
    }
    if (findBylabel(treeRef.value.data[0], newChild.label)) {
        ElNotification({
            type: 'warning',
            title: '警告',
            message: `工况【${newChild.label}】已存在，请勿重复计算`,
            offset: 250,
        })
        return
    }

    axios.post(import.meta.env.VITE_MAP_TILE_SERVER2 + '/taskNode/start/numeric/hydrodynamic/real', formData).then(res => {
        console.log('model start res::', res.data)
        ElNotification.success({
            message: '模型开始计算',
            offset: 130
        })
        modelStartLoading.value = false
        mathModelCalcBlockShow.value = false

        treeRef.value.append(newChild, parentNode)
        updateTreeData(treeRef.value.data)

        const taskId = res.data
        if (taskId === 'WRONG') throw new Error('模型计算失败')

        const newCalculatingCase = {
            'name': name,
            'taskId': taskId,
            'treeNode': newChild,
            'treeNodeFather': clickedSet.data,
            'progress': 0,
        }
        mathModelStore.addCalculatingCase(name, newCalculatingCase)

        const interval = setInterval(async () => {
            const status = (await axios.get(import.meta.env.VITE_MAP_TILE_SERVER2 + '/taskNode/status/id?taskId=' + taskId)).data
            console.log('status : ', status)
            if (status === 'ERROR' || status === 'UNLOCK' || status === "NOT FOUND") {
                await axios.get(import.meta.env.VITE_MAP_TILE_SERVER2 + '/taskNode/result/id?taskId=' + taskId) // clear case
                clearInterval(interval)
                timeout && clearTimeout(timeout)//提前结束
                throw new Error('模型计算失败')
            }
        }, 2000)
        const timeout = setTimeout(() => {
            // 轮询30S，保证模型开始运行，30s内失败则删除这个Case
            interval && clearInterval(interval)
        }, 1000 * 30)

    }).catch(err => {
        ElNotification.error({
            message: '数学模型计算失败--工况 ' + name,
            offset: 130
        })

        if (calcCaseInfo[name]) delete calcCaseInfo[name]
        console.error('数模计算失败', err)

        modelStartLoading.value = false
        // mathModelCalcBlockShow.value = false
    })
}
//////////////////// 新建工况 + 数模计算 ////////////////////END




//////// 进度查询
const calcCaseInfo = mathModelStore.calculatingCases
const progressDrawerShow = ref(false)
let progressInterval = null
let statusInterval = null
const progressFormat = (percentage) =>
    percentage >= 100 ? '100%' : `${percentage.toFixed(2)}%`
const calcStatusClickHandler = (data, node) => {
    if (data.tag !== '计算中') return
    progressDrawerShow.value = true
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
    console.log(clickedNode)
    const modelRunnning = async () => {
        let params = {
            flow: clickedNode.flow,
            tideType: clickedNode.type,
        }

        if (params.flow === 0 || params.tideType === '') {
            ElNotification({
                type: 'info',
                title: '请选择工况',
                offset: 250,
            })
            return
        }

        ElNotification({
            type: 'info',
            title: '加载可视化资源',
            message: `流量${params.flow}，潮型${params.tideType}`,
            offset: 250,
        })

        let modelPostUrl = ''
        let modelParams = {}

        modelPostUrl = import.meta.env.VITE_MAP_TILE_SERVER2 + '/taskNode/start/numeric/hydrodynamic'
        modelParams = {
            'water-qs': params.flow,
            'tidal-level': params.tideType,
            segment: 'Mzs', // 后端纹理资源生产有问题，这里用Mzs的资源  2024-11-25
            set: 'standard',
            year: '2023',
        }

        console.log('check1 ', modelPostUrl, modelParams)
        ModelRunningShow.value = true
        ModelRunningMessage.value = '正在加载可视化资源...'
        globleVariable.runningStatus = 'start'

        const response = await axios.post(modelPostUrl, modelParams).catch(() => {
            ModelRunningShow.value = false
            ModelRunningMessage.value = ''
            ElNotification({
                type: 'error',
                title: '断面形态计算模型启动失败',
                offset: 130
            })
        })
        const TASK_ID = response.data
        // const TASK_ID = '1'
        console.log('TASK_ID ', TASK_ID) // 66a23664bec8e12b68c9ce86
        globleVariable.taskID = TASK_ID
        console.log('===Interval')
        let runningStatusInterval = setInterval(async () => {
            console.log('runningStatusInterval')
            let runningStatus = (
                await axios.get(import.meta.env.VITE_MAP_TILE_SERVER2 + '/taskNode/status/id?taskId=' + TASK_ID)
            ).data
            ModelRunningMessage.value = '正在加载可视化资源...'
            let randomFactor = 3.0
            if (runningStatus === 'RUNNING') {
                globleVariable.runningStatus = 'RUNNING'
                globleVariable.status = false
            } else if (runningStatus === 'ERROR') {
                globleVariable.runningStatus = 'ERROR'

                const url = import.meta.env.VITE_MAP_TILE_SERVER2 + `/taskNode/result/id?taskId=${TASK_ID}`
                const errorLog = (await axios.get(url)).data['error-log']
                ElNotification({
                    title: '模型运行失败',
                    message: `错误原因:\n` + errorLog,
                    offset: 250,
                    type: 'error',
                })
                ModelRunningShow.value = false
                ModelRunningMessage.value = ''
                globleVariable.runningStatus = 'NONE'
                globleVariable.status = false
                clearInterval(runningStatusInterval)
            } else if (runningStatus === 'COMPLETE') {
                clearInterval(runningStatusInterval)
                let runningResult = (
                    await axios.get(
                        '/model/taskNode/result/id?taskId=' + TASK_ID,
                    )
                ).data
                console.log('runningResult ', runningResult)

                globleVariable.caseID = runningResult['case-id']
                globleVariable.pngPrefix = `/model/data/bankResource/down/modelServer/resource/file/image?name=`
                globleVariable.binPrefix = `/model/data/bankResource/down/modelServer/resource/file/bin?name=`
                globleVariable.stationBinUrl = runningResult['visualization-station-bin']
                globleVariable.uvBinUrls = runningResult['visualization-uv-bin']

                let visulizationDescUrl = `/model/data/bankResource/down/modelServer/resource/file/json?name=${runningResult['visualization-description-json']}`

                globleVariable.visualizationJsonUrl = visulizationDescUrl
                console.log('globle data info::', globleVariable)

                ModelRunningShow.value = false
                globleVariable.status = true
                visulizationStatus.value = true
                globleVariable.runningStatus = 'COMPLETE'

                ElNotification({
                    title: '可视化资源加载完毕',
                    offset: 250,
                    type: 'success',
                })
            }
        }, 1000)
    }

    try {
        if (clickedNode.info.data.tag === '计算中') {
            ElNotification({
                type: 'warning',
                title: '工况尚未计算完毕，无可视化资源',
                offset: 250,
            })
            return
        }
    } catch (error) {
        ElNotification({
            type: 'warning',
            title: '尚未选择工况节点，无可视化资源',
            offset: 250,
        })
        return
    }


    if (
        globleVariable.runningStatus === 'start' ||
        globleVariable.runningStatus === 'RUNNING'
    ) {
        ElNotification({
            type: 'warning',
            title: '请等待资源加载...',
            offset: 250,
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
        lagrange: {
            add: () => {
                console.log('add lagrenge')
                let flow = new FlowFieldLayer(
                    globleVariable.lagrangeLayer,
                    globleVariable.visualizationJsonUrl,
                    globleVariable.pngPrefix,
                )
                mapStore.getMap().addLayer(flow, 'mzsLabel')
            },
            remove: () => {
                console.log('rm lagrenge')
                map.getLayer(globleVariable.lagrangeLayer) &&
                    map.removeLayer(globleVariable.lagrangeLayer)
            },
        },
        euler: {
            add: () => {
                console.log('add euler')
                let flow = new EulerFlowLayer(
                    globleVariable.eulerLayer,
                    globleVariable.stationBinUrl,
                    globleVariable.uvBinUrls,
                    globleVariable.binPrefix,
                )

                mapStore.getMap().addLayer(flow, 'mzsLabel')
            },
            remove: () => {
                console.log('rm euler')
                map.getLayer(globleVariable.eulerLayer) &&
                    map.removeLayer(globleVariable.eulerLayer)
            },
        },
    }
    controlMap[type][show ? 'add' : 'remove']()
}
const showFlowClickHandler = async (id) => {
    console.log(globleVariable)
    if (!visulizationStatus.value) {
        ElNotification({
            type: 'warning',
            title: '请先加载可视化资源',
            offset: 250,
        })
        return
    } else {
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


///////////////////// router
const jump2Model = (value) => {
    console.log(value == '1')
    const routeMap = {
        1: '/modelStore/stabilityAnalysis',
        2: '/modelStore/stabilityCalc',
        3: '/modelStore/analysisCenter',
    }
    routeMap[value] && router.push(routeMap[value])
}
onMounted(async () => {
    let map = await initFineMap(mapRef.value)
    mapStore.setMap(map)


    progressInterval = setInterval(() => {
        // 持续给progress++，模拟进度条
        for (let key in calcCaseInfo) {
            if (calcCaseInfo[key]['progress'] < 99) {
                calcCaseInfo[key]['progress'] += Math.random() * 0.003
            }
        }
    }, 1000)

    // 10分钟轮询一次数学模型运行状态
    for (let key in calcCaseInfo) {
        let name = key
        let taskID = calcCaseInfo[name]['taskId']
        ////////// right now
        axios.get('/model/taskNode/status/id?taskId=' + taskID).then(res => {
            console.log(name, '  ', res.data)
            if (res.data === 'COMPLETE') {
                // 运行成功，结束状态轮询，更新进度条，更新树
                calcCaseInfo[name]['progress'] = 100
                updateTreeFromBack()
            } else if (res.data === 'ERROR' || res.data === 'UNLOCK' || res.data === "NOT FOUND") {
                // 运行失败，结束状态轮询，删除这个Case
                ElNotification.error({
                    message: '模型计算失败--工况 ' + name,
                    offset: 130
                })
                delete calcCaseInfo[name]
                updateTreeFromBack()
            }
        })
        ////////// interval
        let I = setInterval(() => {
            axios.get('/model/taskNode/status/id?taskId=' + taskID).then(res => {

                console.log(name, '  ', res.data)
                if (res.data === 'COMPLETE') {
                    // 运行成功，结束状态轮询，更新进度条，更新树
                    I && clearInterval(I)
                    calcCaseInfo[name]['progress'] = 100
                    updateTreeFromBack()
                } else if (res.data === 'ERROR' || res.data === 'UNLOCK' || res.data === "NOT FOUND") {
                    // 运行失败，结束状态轮询，删除这个Case
                    ElNotification.error({
                        message: '模型计算失败--工况 ' + name,
                        offset: 130
                    })
                    delete calcCaseInfo[name]
                    updateTreeFromBack()
                    I && clearInterval(I)
                }
            })
        }, 10 * 60 * 1000)
    }



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
        '民主沙右缘': [
            [120.45997922676836, 32.00001616423072],
            [120.60909640208264, 32.084171362618625],
        ],
    }
    if (boundsMap[bankName]) {
        mapIns.fitBounds(
            boundsMap[bankName],
            {
                duration: 1500,
            }
        );
    }
}

/////////////////// helper functions
const updateTreeData = (treedt) => {
    treeData.value = treedt
}
const findBylabel = (node, label) => {
    let result
    if (node.label === label) result = true
    else if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            result = findBylabel(node.children[i], label)
            if (result) break;
        }
    }
    return result
}

const parseFlowAndType = (name) => {
    let flow = parseInt(name.slice(0, -2))
    let type = name.slice(name.length - 2, name.length)
    console.log(flow, type)
    return { flow, type }
}

const getTreeDataFromJson = async (data, bankName) => {

    const result = [
        {
            label: bankName,
            type: 'bank',
            children: [],
        },
    ]
    let years = []
    for (let j = 0; j < data.length; j++) {
        let yearItem = {
            label: data[j]['year'],
            type: 'year',
            children: [],
        }
        let sets = []
        for (let k = 0; k < data[j]['sets'].length; k++) {
            let setItem = {
                label: data[j]['sets'][k]['name'],
                type: 'set',
                children: [],
            }
            let cases = []
            for (let p = 0; p < data[j]['sets'][k]['list'].length; p++) {
                let casesItem = {
                    label: data[j]['sets'][k]['list'][p]['name'],
                    type: 'case',
                    tag: '已计算',
                    temp: data[j]['sets'][k]['list'][p]['temp'],
                    description: data[j]['sets'][k]['list'][p]['description'],
                }
                cases.push(casesItem)
            }
            for (let key in mathModelStore.calculatingCases) {
                if (setItem.label === mathModelStore.calculatingCases[key]['treeNodeFather'].label) {
                    cases.push(mathModelStore.calculatingCases[key]['treeNode'])
                }
            }

            setItem.children = cases
            sets.push(setItem)
        }
        yearItem.children = sets
        years.push(yearItem)
    }
    result[0].children = years
    console.log(result)
    return result
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
        margin-top: 0.5vh;
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
                box-shadow:
                    0 0 4px 1px rgba(#0642b1, 0.55),
                    0 6px 12px 0 rgba(#0642b1, 0.55);
                padding: 0.6vh;
                border-radius: 0.6vw; // just a high number to create pill effect
                margin-right: auto;
                margin-left: 8px;

                :deep(.el-radio-group) {
                    // background-color: red;
                    width: 18.8vw;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-evenly;

                    .el-radio-button {
                        width: 6vw;

                        .el-radio-button__inner {
                            width: 6vw;
                            font-size: calc(0.6vw + 0.6vh);
                            font-weight: 800;
                            padding: 1vh 0vw;
                        }
                    }
                }
            }
        }

        div.model-pannel {
            position: absolute;
            z-index: 1;
            top: 8vh;
            left: 0.2vw;
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
                                padding: calc(0.3vw + 0.5vh);
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
                                    font-weight: 600;
                                }

                                &.case {
                                    height: 5vh;
                                    margin-top: 1vh;
                                    margin-bottom: 1vh;
                                    line-height: 3.5vh;
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
                            :deep(.el-descriptions__cell,
                                .el-descriptions__label,
                                .is-bordered-label,
                                .is-center) {
                                font-size: calc(0.5vw + 0.5vh);
                                font-family: 'Microsoft YaHei';
                                font-weight: 800;
                                padding: 1vh 0.5vw;
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
                                        content: '';
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
                                    font-family: 'Microsoft YaHei';
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
            border-radius: calc(0vw + 0.5vh);
            box-shadow:
                rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
                rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
                rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

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
                    right: 0.1vw;
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
                margin-bottom: 0.5vh;

                .card {
                    margin-bottom: 0.7vh;

                    .content {
                        .running-container {
                            margin-top: 0.5vh;
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

div.drawer-header {
    position: relative;
    width: 100%;
    height: 4.5vh;
    display: flex;
    flex-direction: row;
    border-bottom: #055279 solid 2px;

    .icon {
        position: relative;
        width: 4vh;
        height: 4vh;
        background-image: url('/progress.png');
        background-size: contain;
        background-repeat: no-repeat;
        transform: scale(0.8);
    }

    .text {
        position: relative;
        height: 4vh;
        line-height: 4vh;
        font-size: calc(0.9vw + 0.7vh);
        margin-left: .3vw;
        font-weight: bold;
        text-align: left;
        color: #366ec2;
    }
}

div.drawer-content {
    position: relative;
    width: 100%;
    // height: 100%;
    // background-color: #054bb3;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;


    .progress-card {

        position: relative;
        height: 8vh;
        width: 92%;
        background-color: #ffffff;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        margin: 1.4vh .5vw;
        border-radius: 5px;

        .top-block {
            position: relative;
            height: 4vh;
            width: 95%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-left: .5vw;

            .k {
                position: relative;
                width: 3vw;
                height: 3.7vh;
                line-height: 3.7vh;
                color: rgb(77, 126, 198);
                font-size: calc(0.6vw + 0.6vh);
                font-weight: 700;
                text-align: center;

            }

            .v {
                position: relative;
                width: 4vw;
                margin-top: 0.3vh;
                height: 3vh;
                line-height: 3vh;
                border-radius: 5px;
                background-color: #ffffff;
                border: rgba(36, 124, 255, 0.479) solid 1px;
                color: rgb(36, 123, 255);
                font-size: calc(0.5vw + 0.6vh);
                font-weight: 700;
                text-align: center;
            }

        }

        .bot-block {
            position: relative;
            height: 4vh;
            width: 90%;
            margin-top: .8vh;
            margin-left: .5vw;
        }


    }
}
</style>
