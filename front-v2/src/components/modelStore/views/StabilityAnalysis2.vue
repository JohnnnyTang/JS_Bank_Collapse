<template>
    <div class="all">
        <ModelTitleVue :ModelName="'岸坡稳定性分析模型'" />

        <div class="model-content-container">
            <div class="model-item-container">
                <div class="model-choice">
                    <div class="basemap-radio-container">
                        <input type="radio" id="radio-1" name="tabs" :checked="checky1" @click="radio1Click()" />
                        <label class="tab" for="radio-1">近岸动力分析</label>
                        <input type="radio" id="radio-2" name="tabs" :checked="checky2" @click="radio2Click()" />
                        <label class="tab" for="radio-2">近岸演变分析</label>
                        <span class="glider"></span>
                    </div>
                </div>
                <div class="main-page" v-show="!showAnalysis">
                    <div class="user-react">
                        <div class="title">
                            <div class="title-icon uricon"></div>
                            <div class="title-text">{{ title1 }}</div>
                        </div>
                        <div class="buttons">
                            <div class="button" v-for="(item, index) in buttons" :key="index" @click="handleClick(index)">
                                <div>{{ item }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="data-panel">
                        <div class="title">
                            <div class="title-icon dpicon"></div>
                            <div class="title-text">数据面板</div>
                        </div>
                        <div class="dp-content">
                            <el-tree style="
                                    max-height: 28vh;
                                    overflow: auto;
                                " :data="data" :props="defaultProps" @node-contextmenu="handleNodeClick"
                                node-key="nodeID">
                                <template #default="{ node, data }">
                                    <div class="custom-tree-node" style="width: 100%">
                                        <el-dropdown @command="handleNodeCommand" trigger="contextmenu"
                                            placement="bottom-end" style="width: 100%">
                                            <div class="el-dropdown-link" style="width: 100%">
                                                {{ node.label }}
                                            </div>
                                            <template #dropdown v-if="data.nodeID">
                                                <el-dropdown-menu>
                                                    <el-dropdown-item command="add">添加至图层</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>
                                </template>
                            </el-tree>
                        </div>
                    </div>
                    <div class="layer-panel">
                        <div class="title">
                            <div class="title-icon lpicon"></div>
                            <div class="title-text">图层面板</div>
                        </div>
                        <div class="lp-content">
                            <div class="checkBox">
                                <el-checkbox-group v-model="checkedlayers" @change="handleCheckedlayersChange">
                                    <el-checkbox v-for="city in layers" :key="city" :label="city" :value="city">{{ city
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main-page" v-show="showAnalysis">
                    <div class="data-panel" style="height: 40vh">
                        <div class="title">
                            <div class="title-icon dpicon"></div>
                            <div class="title-text">数据面板</div>
                        </div>
                        <div class="dp-content" style="height: 32vh">
                            <el-tree style="max-width: 600px" :data="evolutionTreeData" :props="defaultProps"
                                @node-contextmenu="handleEvolutionTreeClick" node-key="nodeID">
                                <template #default="{ node, data }">
                                    <div class="evolution-tree-node" style="width: 100%">
                                        <el-dropdown @command="handleEvolutionTreeCommand
                                            " trigger="contextmenu" placement="bottom-end" style="width: 100%">
                                            <div class="el-dropdown-link" style="width: 100%">
                                                {{ node.label }}
                                            </div>
                                            <template #dropdown v-if="data.type === 'dem' ||
                                                data.type ===
                                                'section-geojson'
                                                ">
                                                <el-dropdown-menu>
                                                    <el-dropdown-item command="layer">添加至图层</el-dropdown-item>
                                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                            <template #dropdown v-if="data.type &&
                                                data.type !== 'dem' &&
                                                data.type !==
                                                'section-geojson'
                                                ">
                                                <el-dropdown-menu>
                                                    <el-dropdown-item command="visualize">可视化</el-dropdown-item>
                                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>
                                </template>
                            </el-tree>
                        </div>
                    </div>
                    <div class="layer-panel">
                        <div class="title">
                            <div class="title-icon lpicon"></div>
                            <div class="title-text">图层面板</div>
                        </div>
                        <div class="dp-content" style="height: 32vh">
                            <el-tree style="max-width: 600px" :data="evolutionLayerData" :props="defaultProps"
                                @node-contextmenu="handleEvolutionLayerClick" node-key="nodeID" show-checkbox
                                @check-change="handleEvolutionLayerCheckChange">
                                <template #default="{ node, data }">
                                    <div class="evolution-tree-node" style="width: 100%">
                                        <el-dropdown @command="handleEvolutionLayerCommand
                                            " trigger="contextmenu" placement="bottom-end" style="width: 100%">
                                            <div class="el-dropdown-link" style="width: 100%">
                                                {{ node.label }}
                                            </div>
                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-dropdown-item command="delete">删除图层</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>
                                </template>
                            </el-tree>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog v-model="sectionConfirmShow" title="绘制断面确认" width="40vh" :before-close="sectionConfirmClose">
                <el-input v-model="sectionConfirmInput" style="width: 240px" placeholder="请输入断面名称" />
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="cancelSection">取消</el-button>
                        <el-button type="primary" @click="confirmSection" :disabled="!sectionConfirmInput.length">
                            确认
                        </el-button>
                    </div>
                </template>
            </el-dialog>
            <div class="main">
                <div class="map-container">
                    <div id="map" ref="mapContainerRef"></div>
                    <canvas id="GPUFrame"></canvas>
                </div>
                <div class="model-tooltip-container">
                    <div class="showAnalysisButton" v-if="showAnalysis" @click="handleRunModelClick">
                        演变分析计算
                    </div>
                </div>
                <div class="model-container" v-if="isModelPanelShow">
                    <div style="font-size: large; padding-bottom: 16px">
                        近岸演变分析模型
                    </div>
                    <div class="model-list">
                        <el-card style="height: 300px; object-fit: cover">
                            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                                class="image" style="margin-left: 0; margin-right: 0" />
                            <div style="padding: 4px 0px">
                                <el-button @click="
                                    handleSelectModelClick('section-graph')
                                    ">断面形态</el-button>
                            </div>
                        </el-card>
                        <el-card style="height: 300px; object-fit: cover">
                            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                                class="image" style="margin-left: 0; margin-right: 0" />
                            <div style="padding: 4px 0px">
                                <el-button @click="handleSelectModelClick('rate')">断面坡比</el-button>
                            </div>
                        </el-card>
                        <el-card style="height: 300px; object-fit: cover">
                            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                                class="image" style="margin-left: 0; margin-right: 0" />
                            <div style="padding: 4px 0px">
                                <el-button @click="handleSelectModelClick('chongyu')">断面冲淤</el-button>
                            </div>
                        </el-card>
                    </div>
                </div>
                <div class="model-params-container" v-if="modelType">
                    <div style="font-size: large; padding-bottom: 16px">
                        模型参数设置
                    </div>
                    <el-form ref="paramsRef" :rules="rules" :model="paramsInfo" label-width="auto" style="width: 600px">
                        <el-form-item label="结果名称" prop="name">
                            <el-input v-model="paramsInfo.name" />
                        </el-form-item>
                        <el-form-item label="地形断面" prop="section">
                            <el-select v-model="paramsInfo.section">
                                <el-option v-for="item in sectionList" :key="item.label" :label="item.label"
                                    :value="item.nodeID" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="当前地形数据" prop="date">
                            <el-select v-model="paramsInfo.date">
                                <el-option v-for="item in demList" :key="item.label" :label="item.label"
                                    :value="item.nodeID" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对比地形数据" prop="beforeDate">
                            <el-select v-model="paramsInfo.beforeDate">
                                <el-option v-for="item in demList" :key="item.label" :label="item.label"
                                    :value="item.nodeID" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="runModel(paramsRef, modelType)">运行模型</el-button>
                            <el-button @click="handleCancelParams(paramsRef)">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="charts-container" v-show="isEchartShow">
                    <div class="close-icon" @click="handleCloseChart">关闭</div>
                    <div ref="echartRef" class="chart"></div>
                </div>

                <HydrologicalCondition v-if="showHyCondition" v-on:close="showHyCondition = !showHyCondition"
                    v-on:condition="conditionHandler">
                </HydrologicalCondition>
                <SetParameter v-if="showStParams" v-on:close="showStParams = !showStParams" v-on:params="paramsHandler">
                </SetParameter>
                <ModelStatus v-if="showModelStatus" v-on:close="showModelStatus = !showModelStatus"></ModelStatus>
            </div>
        </div>

        <div class="analysisCenter" v-show="showAnalysisCenter">
            <div class="background"></div>
            <div class="back"
                @click="showAnalysisCenter = !showAnalysisCenter; checky1 = true; checky2 = false"></div>
            <iframe id="inlineFrameExample" title="Inline Frame Example" width="100%" height="100%"
                src="http://172.21.212.165:8050/#/analysis/73c29959-16f0-4478-8526-0927d1aff6f7">

            </iframe>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { initScratchMap } from '../../../utils/mapUtils.js'
import ModelTitleVue from '../ModelTitle.vue'
import HydrologicalCondition from '../stability-sub/HydrologicalCondition.vue'
import SetParameter from '../stability-sub/SetParameter.vue'
import ModelStatus from '../stability-sub/ModelStatus.vue'
import { ElMessage } from 'element-plus'
import SteadyFlowLayer from '../../../utils/m_demLayer/newFlow'
import { useStabilityStore } from '../../../store/stabilityStore.js'
import {
    addLineToMap,
    convertToMercator,
    deleteLineFromMap,
    drawChongyuSectionGraph,
    hideLayer,
} from '../stability-sub/util.js'
import {
    demoJson,
    drawRateGraph,
    drawSectionGraph,
} from '../stability-sub/util.js'

const showHyCondition = ref(false)
const showStParams = ref(false)
const showModelStatus = ref(false)
const buttons = ref([
    '水文条件选择',
    '模型参数设置',
    '模型计算',
    '模型运行状态',
])
const selectedNode = ref(null)
const title1 = ref('模型配置')
const showAnalysis = ref(false)
const showAnalysisCenter = ref(false)
const checky1 = ref(true)
const checky2 = ref(false)

const radio1Click = () => {
    showAnalysis.value = false
    checky1.value = true
    checky2.value = false
    showAnalysisCenter.value = false
}
const radio2Click = () => {
    showAnalysis.value = true
    checky2.value = true
    checky1.value = false
    showModelStatus.value = false
    showAnalysisCenter.value = true
}

const mapContainerRef = ref()

//////////model//////////////
const modelStore = useStabilityStore()
modelStore.modelStatus = 'undefined'
let condition = null
const conditionHandler = (value) => {
    ElMessage({
        type: 'success',
        offset: 100,
        message: '水文条件：' + value,
    })
    condition = value
}

const handleClick = (index) => {
    switch (index) {
        case 0:
            showHyCondition.value = true
            break
        case 1:
            showStParams.value = true
            break
        case 2:
            ElMessage({
                message: '模型计算中',
                offset: 100,
            })
            modelStore.modelStartTime = Date.now()
            modelStore.modelProgress = 0
            modelStore.modelStatus = 'pending'
            const id = setInterval(() => {
                modelStore.modelProgress +=
                    ((Math.random() * 100) / 3600 / 0.5 / 24) * 3
                if (modelStore.modelProgress >= 100) {
                    modelStore.modelStatus = 'success'
                    ElMessage({
                        type: 'success',
                        offset: 100,
                        message: '模型计算完成',
                    })
                    clearInterval(id)
                }
            }, 3000)
            showModelStatus.value = true
            break
        case 3:
            showModelStatus.value = true
            break
    }
}

const paramsHandler = (value) => {
    ElMessage({
        type: 'success',
        message: '模型参数设置成功',
        offset: 100,
    })
    console.log(value)
}

////////////tree///////////////
const handleNodeClick = (_, treeNode) => {
    if (treeNode.nodeID) {
        selectedNode.value = treeNode.nodeID
    } else {
        selectedNode.value = null
    }
}
const handleNodeCommand = (command) => {
    if (selectedNode.value && command === 'add') {
        layers.value.push(selectedNode.value)
    }
}
const data = reactive([
    {
        label: '旱季',
        children: [
            {
                label: '输入数据',
                children: [
                    {
                        label: 'fort.13',
                        nodeID: 'dry-13',
                    },
                    {
                        label: 'fort.14',
                        nodeID: 'dry-14',
                    },
                    {
                        label: 'fort.15',
                        nodeID: 'dry-15',
                    },
                    {
                        label: 'fort.16',
                        nodeID: 'dry-16',
                    },
                    {
                        label: 'fort.19',
                        nodeID: 'dry-19',
                    },
                    {
                        label: 'fort.20',
                        nodeID: 'dry-20',
                    },
                ],
            },
            {
                label: '输出数据',
                children: [
                    {
                        label: 'flow',
                        nodeID: 'dry-flow',
                    },
                ],
            },
        ],
    },
    {
        label: '洪季',
        children: [
            {
                label: '输入数据',
                children: [
                    {
                        label: 'fort.13',
                        nodeID: 'flood-13',
                    },
                    {
                        label: 'fort.14',
                        nodeID: 'flood-14',
                    },
                    {
                        label: 'fort.15',
                        nodeID: 'flood-15',
                    },
                    {
                        label: 'fort.16',
                        nodeID: 'flood-16',
                    },
                    {
                        label: 'fort.19',
                        nodeID: 'flood-19',
                    },
                    {
                        label: 'fort.20',
                        nodeID: 'flood-20',
                    },
                ],
            },
            {
                label: '输出数据',
                children: [
                    {
                        label: 'flow',
                        nodeID: 'flood-flow',
                    },
                ],
            },
        ],
    },
    {
        label: '20年一遇',
        children: [
            {
                label: '输入数据',
                children: [
                    {
                        label: 'fort.13',
                        nodeID: '20-13',
                    },
                    {
                        label: 'fort.14',
                        nodeID: '20-14',
                    },
                    {
                        label: 'fort.15',
                        nodeID: '20-15',
                    },
                    {
                        label: 'fort.16',
                        nodeID: '20-16',
                    },
                    {
                        label: 'fort.19',
                        nodeID: '20-19',
                    },
                    {
                        label: 'fort.20',
                        nodeID: '20-20',
                    },
                ],
            },
            {
                label: '输出数据',
                children: [
                    {
                        label: 'flow',
                        nodeID: '20-flow',
                    },
                ],
            },
        ],
    },
])
const defaultProps = {
    children: 'children',
    label: 'label',
}

////////////layer///////////////
const checkedlayers = ref([])
const layers = ref([])
let globalMap = undefined

let flowSrc = []
for (let i = 0; i < 26; i++) {
    flowSrc.push(`/scratchSomething/terrain_flow/json/uv_${i}.bin`)
}
let flow = new SteadyFlowLayer(
    '近岸流场',
    '/scratchSomething/terrain_flow/json/station.bin',
    flowSrc,
    (url) => url.match(/uv_(\d+)\.bin/)[1],
    '/scratchSomething/terrain_flow/json/ChangJiang.geojson'
)

// watch(checkedlayers, (value) => {
// })

const handleCheckedlayersChange = (value) => {
    console.log('handle checked layer', value);
    for (let i = 0; i < value.length; i++) {
        if (value[i].includes('flow')) {
            flow.show()
            if (globalMap) {
                globalMap.flyTo({
                    center: [120.54070965313992, 32.042615280683805],
                    pitch: 31.99999999999988,
                    bearing: 0,
                    zoom: 10.245427972376211,
                    speed: 1.0,
                    essential: true,
                })
            }
            return
        }
    }
    flow.hide()


}

// evolution
// tree and layer
const selectedEvolutionNode = ref(null)
const evolutionLayerData = ref(null)
// KXH type 为 dem, section-geojson, section-graph, rate, chongyu, null
const evolutionTreeData = reactive([
    {
        label: '地形数据',
        type: null,
        children: [
            {
                label: '20200301-dem',
                nodeID: '20200301-dem-id',
                type: 'dem',
            },
            {
                label: '20200901-dem',
                nodeID: '20200901-dem-id',
                type: 'dem',
            },
        ],
    },
    {
        label: '断面数据',
        type: null,
        children: [],
    },
    {
        label: '示例断面形态',
        nodeID: '20200301-section-graph',
        type: 'section-graph',
    },
    {
        label: '示例断面坡比',
        nodeID: '20200301-rate',
        type: 'rate',
    },
    {
        label: '示例断面冲淤',
        nodeID: '20200301-chongyu',
        type: 'chongyu',
    },
])
const handleEvolutionTreeClick = (_, treeNode) => {
    console.log(treeNode)
    if (treeNode.nodeID) {
        selectedEvolutionNode.value = treeNode
    } else {
        selectedEvolutionNode.value = null
    }
}
const handleEvolutionTreeCommand = (command) => {
    // KXH 绘制从服务器获取断面数据 json 逻辑
    console.log(selectedEvolutionNode.value)
    if (selectedEvolutionNode.value && command === 'layer') {
        if (evolutionLayerData.value === null) {
            evolutionLayerData.value = [selectedEvolutionNode.value]
        } else {
            evolutionLayerData.value.push(selectedEvolutionNode.value)
        }
    } else if (selectedEvolutionNode.value && command === 'visualize') {
        const type = selectedEvolutionNode.value.type
        console.log(type)
        isEchartShow.value = true
        const json = demoJson
        chart.clear()
        if (type === 'section-graph') {
            setTimeout(() => {
                const beforeSectionPoints = json.beforeSection
                const sectionPoints = json.section
                drawSectionGraph(
                    chart,
                    sectionPoints.map((value) => value[2]),
                    beforeSectionPoints.map((value) => value[2]),
                )
                chart.resize()
            }, 1)
        } else if (type === 'rate') {
            setTimeout(() => {
                const beforeSectionPoints = json.beforeSection
                const sectionPoints = json.section
                drawRateGraph(
                    chart,
                    sectionPoints.map((value) => value[2]),
                    beforeSectionPoints.map((value) => value[2]),
                    json.SA[2],
                )
                chart.resize()
            }, 1)
        } else if (type === 'chongyu') {
            setTimeout(() => {
                const sectionPoints = json.section
                const beforeSectionPoints = json.beforeSection
                const length = Math.min(
                    sectionPoints.length,
                    beforeSectionPoints.length,
                )
                const result = []
                sectionPoints.some((value, index) => {
                    if (index >= length) {
                        return true
                    }
                    result.push(value[2] - beforeSectionPoints[index][2])
                })
                console.log(result)
                drawChongyuSectionGraph(chart, result)
                chart.resize()
            }, 1)
        }
    } else if (selectedEvolutionNode.value && command === 'delete') {
        // KXH 删除逻辑
    }
}
const handleEvolutionLayerClick = (_, treeNode) => {
    if (treeNode.nodeID) {
        selectedEvolutionNode.value = treeNode
    } else {
        selectedEvolutionNode.value = null
    }
}
const handleEvolutionLayerCommand = (command) => {
    console.log(command)
    if (
        selectedEvolutionNode.value &&
        evolutionLayerData.value &&
        command === 'delete'
    ) {
        evolutionLayerData.value = evolutionLayerData.value.filter(
            (value) => value.nodeID !== selectedEvolutionNode.value.nodeID,
        )
        if (selectedEvolutionNode.value.type === 'section-geojson') {
            hideLayer(map, selectedEvolutionNode.value.nodeID)
            deleteLineFromMap(map, selectedEvolutionNode.value.nodeID)
        }
    }
}
const handleEvolutionLayerCheckChange = (data, checked) => {
    // KXH 显示和隐藏图层的逻辑
    console.log(data, checked)
    if (checked) {
        if (data.type === 'section-geojson') {
            const coord = sectionInfo.value[data.nodeID]
            addLineToMap(map, coord[0], coord[1], data.nodeID)
            console.log(
                map.getLayoutProperty(`${data.nodeID}-layer`, 'visibility'),
            )
        }
    } else {
        if (data.type === 'section-geojson') {
            hideLayer(map, data.nodeID)
            console.log(
                map.getLayoutProperty(`${data.nodeID}-layer`, 'visibility'),
            )
        }
    }
}

// mapbox
let map
const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        line_string: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    // defaultMode: '',
    styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
            id: 'gl-draw-line',
            type: 'line',
            filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['==', 'mode', 'draw_line_string'],
            ],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#D20C0C',
                'line-dasharray': [0.2, 2],
                'line-width': 2,
            },
        },
        // vertex point halos
        {
            id: 'gl-draw-polygon-and-line-vertex-halo-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['==', 'mode', 'draw_line_string'],
            ],
            paint: {
                'circle-radius': 5,
                'circle-color': '#FFF',
            },
        },
        // vertex points
        {
            id: 'gl-draw-polygon-and-line-vertex-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['==', 'mode', 'draw_line_string'],
            ],
            paint: {
                'circle-radius': 3,
                'circle-color': '#D20C0C',
            },
        },
        // INACTIVE (static, already drawn)
        // line stroke
        {
            id: 'gl-draw-line-static',
            type: 'line',
            filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'draw_line_string'],
            ],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#000',
                'line-width': 3,
            },
        },
    ],
})

// section
const sectionInfo = ref({})
const currentSectionID = ref()
const sectionDrawShow = ref(false)
const sectionConfirmShow = ref(false)
const sectionConfirmInput = ref('')
const sectionConfirmClose = () => { }
const cancelSection = () => {
    sectionConfirmShow.value = false
    draw.deleteAll()
    sectionConfirmInput.value = ''
}
const confirmSection = () => {
    sectionConfirmShow.value = false
    sectionDrawShow.value = false
    draw.deleteAll()
    evolutionTreeData[1].children.push({
        label: sectionConfirmInput.value,
        nodeID: currentSectionID.value,
        type: 'section-geojson',
    })

    console.log(sectionInfo)
    // KXH 保存断面数据到服务器的逻辑

    sectionConfirmInput.value = ''
}

// model
const paramsRef = ref()
const paramsInfo = ref({
    name: '',
    date: '',
    beforeDate: '',
    section: '',
})
const rules = reactive({
    name: [
        {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur',
        },
    ],
    section: [
        {
            required: true,
            trigger: 'change',
        },
    ],
    date: [
        {
            required: true,
            trigger: 'change',
        },
    ],
    beforeDate: [
        {
            required: true,
            trigger: 'change',
        },
    ],
})
const isModelPanelShow = ref(false)
const modelType = ref(null)
const sectionList = computed(() => {
    let result = []
    evolutionTreeData.forEach((value) => {
        if (value.label === '断面数据') {
            result = value.children
        }
    })
    console.log(result)
    return result
})
const demList = computed(() => {
    let result = []
    evolutionTreeData.forEach((value) => {
        if (value.label === '地形数据') {
            result = value.children
        }
    })
    console.log(result)
    return result
})
const handleRunModelClick = () => {
    if (sectionList.value.length === 0) {
        ElMessage({
            message: '当前不存在任意断面, 请先确定断面',
            type: 'warning',
        })
        return
    }
    isModelPanelShow.value = true
}
const handleSelectModelClick = (type) => {
    modelType.value = type
    isModelPanelShow.value = false
}
const runModel = async (paramsRef, type) => {
    if (!paramsRef) return
    await paramsRef.validate((valid, fields) => {
        if (valid) {
            modelType.value = null
            ElMessage('模型开始计算')
            console.log(paramsInfo.value)
            // KXH 模型计算相关逻辑
            evolutionTreeData.push({
                label: paramsInfo.value.name,
                nodeID: '20200301-section-graph',
                type,
            })
            paramsRef.resetFields()
        } else {
            console.log('error submit!', fields)
        }
    })
}
const handleCancelParams = (formEl) => {
    formEl.resetFields()
    console.log(paramsInfo.value)
    modelType.value = null
}

// echarts
const echartRef = ref()
const isEchartShow = ref(false)
let chart = null
const handleCloseChart = () => {
    isEchartShow.value = false
}

onMounted(async () => {
    chart = echarts.init(echartRef.value)
    map = await initScratchMap(mapContainerRef.value)
    map.addControl(draw)

    map.on('draw.create', function (e) {
        console.log('aaa')
        console.log(e.features)
        currentSectionID.value = crypto.randomUUID()
        sectionConfirmShow.value = true
        let lineFeature = e.features[0]
        let startWebMerCoord = convertToMercator(
            lineFeature.geometry.coordinates[0],
        )
        let endWebMerCoord = convertToMercator(
            lineFeature.geometry.coordinates[1],
        )
        sectionInfo.value[currentSectionID.value] = [
            startWebMerCoord,
            endWebMerCoord,
        ]
    })
    globalMap = map
    map.addLayer(flow)
    flow.hide()
})
</script>

<style lang="scss" scoped>
div.all {
    width: 100vw;
    height: 92vh;
    position: relative;
    overflow: hidden;
}

div.model-content-container {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: calc(92vh - 6%);
    display: flex;
    flex-direction: row;

    div.model-item-container {
        width: 20vw;
        height: 87.4vh;
        position: relative;
        display: flex;
        flex-direction: column;

        div.model-choice {
            height: 8vh;
            width: 100%;
            background-color: rgba(240, 248, 255, 0);
            display: flex;
            justify-content: center;
            align-items: center;

            .title-icon {
                z-index: 0;
                width: 4.5vh;
                height: 4.5vh;
                background-size: contain;
            }

            .el-popper.is-customized {
                z-index: 3;
                padding: 6px 12px;
                background: linear-gradient(90deg,
                        rgb(179, 255, 171),
                        rgb(204, 229, 129));
            }

            .el-popper.is-customized .el-popper__arrow::before {
                background: linear-gradient(45deg, #b2e68d, #bce689);
                right: 0;
                z-index: 3;
            }

            .detailIcon {
                width: 4.5vh;
                height: 4.5vh;
                background-size: contain;
                margin-left: 2.5vw;
                background-image: url('/icons/searching.png');
                z-index: 0;

                &:hover {
                    cursor: pointer;
                    transform: scale(1.03);
                    transition: 500ms;
                }
            }

            .returnIcon {
                width: 4.5vh;
                height: 4.5vh;
                background-size: contain;
                margin-left: 2.5vw;
                background-image: url('/back.png');

                &:hover {
                    cursor: pointer;
                    transform: scale(1.03);
                    transition: 500ms;
                }
            }

            div.basemap-radio-container {
                z-index: 1;
                width: 14vw;
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

                * {
                    z-index: 7;
                }

                input[type='radio'] {
                    display: none;
                }

                .tab {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 4vh;
                    width: 7vw;
                    font-size: calc(0.8vw + 0.5vh);
                    font-weight: 600;
                    border-radius: 1.6rem; // just a high number to create pill effect
                    cursor: pointer;
                    transition: color 0.15s ease-in;
                }

                input[type='radio'] {
                    &:checked {
                        &+label {
                            color: #185ee0;
                        }
                    }
                }

                input[id='radio-1'] {
                    &:checked {
                        &~.glider {
                            transform: translateX(0);
                        }
                    }
                }

                input[id='radio-2'] {
                    &:checked {
                        &~.glider {
                            transform: translateX(100%);
                        }
                    }
                }

                input[id='radio-3'] {
                    &:checked {
                        &~.glider {
                            transform: translateX(200%);
                        }
                    }
                }

                .glider {
                    position: absolute;
                    display: flex;
                    height: 4vh;
                    width: 7vw;
                    background-color: #bcd8fc;
                    z-index: 5;
                    border-radius: 0.6vw; // just a high number to create pill effect
                    transition: 0.4s cubic-bezier(0.68, -0.25, 0.265, 1.25);
                }

                // @media (max-width: 700px) {
                //     .tabs {
                //         transform: scale(0.6);
                //     }
                // }
            }
        }

        div.main-page {
            width: 20vw;
            height: calc(87.4vh - 8vh);
            display: flex;
            flex-direction: column;
            user-select: none;

            div.title-icon {
                height: 4vh;
                width: 4vh;
                line-height: 5vh;
                margin-right: 1vw;
                background-size: contain;
                z-index: 1;
            }

            div.title {
                height: 5vh;
                width: 100%;
                background: linear-gradient(90deg,
                        rgb(187, 239, 248),
                        rgb(29, 128, 214));
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                .title-text {
                    color: white;
                    text-shadow:
                        5px 5px 0 #4074b5,
                        2px -2px 0 #4074b5,
                        -2px 2px 0 #4074b5,
                        -2px -2px 0 #4074b5,
                        2px 0px 0 #4074b5,
                        0px 2px 0 #4074b5,
                        -2px 0px 0 #4074b5,
                        0px -2px 0 #4074b5;
                }
            }

            div.user-react {
                height: 15vh;
                width: 100%;
                background-color: aliceblue;

                .title {
                    .uricon {
                        background-image: url('/data.png');
                    }

                    .title-text {
                        font-size: calc(1vw + 0.5vh);
                        font-weight: 600;
                        text-align: center;
                        line-height: 5vh;
                        letter-spacing: 0.1vw;
                    }
                }

                .buttons {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-evenly;

                    .button {
                        background-color: #4c97fa;
                        padding: 0.3vh;
                        border-radius: 0.5vh;
                        border-color: white;
                        border-width: 0.5vh;
                        height: 3vh;
                        width: 8vw;
                        color: white;
                        font-size: calc(0.8vw + 0.5vh);
                        font-weight: 600;
                        margin-left: 1vw;
                        margin: 0.7vh;
                        text-align: center;

                        &:hover {
                            cursor: pointer;
                            background-color: #0642b1;
                            transform: scale(1.01);
                            box-shadow: #00183d 0px 0px 5px 0px;
                            transition: 0.2s ease-in;
                        }
                    }
                }
            }

            div.data-panel {
                height: 35vh;
                width: 100%;

                .title {
                    .dpicon {
                        background-image: url('/data-collection2.png');
                    }

                    .title-text {
                        font-size: calc(1vw + 0.5vh);
                        font-weight: 600;
                        text-align: center;
                        line-height: 5vh;
                    }
                }

                .dp-content {
                    height: 30vh;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    padding: 1vh;

                    &::-webkit-scrollbar {
                        width: 8px;
                    }

                    &::-webkit-scrollbar-track {
                        background-color: rgba(6, 181, 197, 0.219);
                    }

                    &::-webkit-scrollbar-thumb {
                        background-color: #15a1e294;
                        border-radius: 5px;
                    }

                    &::-webkit-scrollbar-thumb:hover {
                        background-color: #3af0f781;
                    }
                }
            }

            div.layer-panel {
                height: 30%;
                width: 100%;

                .title {
                    .lpicon {
                        background-image: url('/icons/layers.png');
                    }

                    .title-text {
                        font-size: calc(1vw + 0.5vh);
                        font-weight: 600;
                        text-align: center;
                        line-height: 5vh;
                    }
                }

                .dp-content {
                    height: 30vh;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    padding: 1vh;

                    &::-webkit-scrollbar {
                        width: 8px;
                    }

                    &::-webkit-scrollbar-track {
                        background-color: rgba(6, 181, 197, 0.219);
                    }

                    &::-webkit-scrollbar-thumb {
                        background-color: #15a1e294;
                        border-radius: 5px;
                    }

                    &::-webkit-scrollbar-thumb:hover {
                        background-color: #3af0f781;
                    }
                }
            }
        }

        div.detail-page {
            width: 20vw;
            height: calc(87.4vh - 8vh);
            display: flex;
            scale: 0.95;
            translate: 0% -3.5%;

            // transform: translateY(-1%);
        }
    }

    div.main {
        position: relative;
    }

    div.map-container {
        position: relative;
        width: 80vw;
        height: 87vh;

        #map {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
            background-color: hsl(194, 69%, 91%);
        }

        #GPUFrame {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
        }
    }

    div.model-tooltip-container {
        top: 1vh;
        left: 1vw;
        z-index: 1;
        position: absolute;

        div.showAnalysisButton {
            width: 8vw;
            height: 4vh;
            line-height: 4vh;

            background-color: #0642b1;
            text-align: center;
            font-size: calc(0.6vw + 0.5vh);
            font-weight: bold;
            color: #d8f0f8;
            border-radius: 4px;
            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 2px 2px,
                rgba(0, 119, 255, 0.6) 3px 3px;
            transition: all 0.1s ease-in-out;

            &:hover {
                cursor: pointer;
                transform: translate3d(2px, 2px, 2px);
                font-weight: bold;
                box-shadow: rgba(0, 132, 255, 0.8) 1px 1px;
            }
        }
    }

    div.model-container {
        top: 10vh;
        left: 12vw;
        z-index: 10;
        position: absolute;
        background-color: #fafafa;
        padding: 16px;
        border-radius: 16px;
        height: 60vh;
        width: 50vw;
        box-shadow: 4px 4px 16px rgba(65, 65, 65, 0.2);
        border: 1px solid #a6daff;

        div.model-list {
            height: 85%;
            background-color: white;
            padding: 16px;
            border-radius: 16px;
            box-shadow: 4px 4px 16px rgba(65, 65, 65, 0.2);
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px 24px;
            overflow: auto;
        }
    }

    div.model-params-container {
        top: 16vh;
        left: 20vw;
        z-index: 10;
        position: absolute;
        background-color: white;
        padding: 16px;
        border-radius: 16px;
        height: 30vh;
    }

    div.charts-container {
        top: 10vh;
        left: 12vw;
        z-index: 10;
        position: absolute;
        background-color: #d8f0f8;
        padding: 16px;
        border-radius: 16px;
        height: 60vh;
        width: 50vw;
        box-shadow: 4px 4px 16px rgba(65, 65, 65, 0.2);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #a6daff;

        div.close-icon {
            position: absolute;
            top: 4px;
            right: 8px;
            padding: 4px;
            background-color: #dfdfdf;
        }
    }

    div.chart {
        height: 86%;
        width: 90%;
        padding: 16px 16px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 4px 4px 8px rgba(65, 65, 65, 0.2);
    }
}

.model-title-container {
    z-index: 5;
    background: linear-gradient(45deg, rgb(91, 219, 209), rgb(35, 119, 247));
}

.analysisCenter {
    width: calc(100vw);
    height: calc(100vh);
    top: 0vh;
    position: fixed;
    z-index: 1;
    background-color: aliceblue;

    .background {
        // background-color: radial-gradient(circle, rgb(16, 2, 84) 0%, rgb(16, 31, 128) 40%, rgb(13, 80, 147) 80%, rgb(0, 134, 255) 100%);
        background-color: rgb(22, 36, 127);
        position: fixed;
        top: 0;
        height: 8.2vh;
        width: 100vw;
        z-index: 4;
    }

    .back {
        position: fixed;
        top: 9.2vh;
        left: 1vw;
        width: 3vh;
        height: 3vh;
        background-size: contain;
        background-image: url('/back.png');
        z-index: 11;

        &:hover {
            cursor: pointer;
            transform: scale(1.03);
            transition: 500ms;
        }

    }

    iframe {
        position: relative;
        border-width: 0;
    }
}

.conditions,
.uploadModel,
.stParams {
    animation: fadenum 0.3s ease-in-out;
    box-shadow: rgb(184, 209, 255) 0px 5px 15px;
    border-radius: 1vh;
}

@keyframes fadenum {
    0% {
        opacity: 0;
        scale: 0;
    }

    100% {
        opacity: 1;
        scale: 1;
    }
}

:deep(.el-tree-node__label) {
    font-size: calc(0.6vw + 0.5vh);
    font-weight: 800;
}

:deep(.el-tree .el-tree-node__expand-icon.expanded) {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
}

:deep(.el-tree-node) {
    padding: 2px 0px;
}

:deep(.el-checkbox__label) {
    font-size: calc(0.6vw + 0.5vh);
}
</style>
