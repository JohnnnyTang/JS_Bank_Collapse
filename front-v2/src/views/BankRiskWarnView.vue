<template>
    <div class="risk-warn-container">
        <div class="map-container" id="map" ref="mapContainer"></div>
        <!-- <div class="selector-container">
            <div class="place-selector-container selector-item-container">
                <div class="place-title selector-title">岸段选择：</div> -->
        <!-- <div class="confirm-button" @click="confirmProfileTime">
                    <div class="confirm-button-text">确认选择</div>
                </div> -->
        <!-- <div class="place selector-content">
                    <el-select
                        class="side"
                        v-model="placeValue"
                        placeholder="选择岸段"
                        style="width: 10vw; height: 3.5vh"
                        @change="sceneSelectChange"
                        popper-class="risk-popper"
                    >
                        <el-option
                            v-for="item in placeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled"
                        >
                            <span class="section-name-text">{{
                            -    item.label
                            }}</span>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="scene-selector-container selector-item-container"> -->
        <!-- 11<div class="scene-title selector-title">评估情景：</div> -->
        <!-- <div class="before-scene-title selector-title">对比地形:</div>
                <div class="before-scene selector-content">
                    <el-select
                        class="before"
                        v-model="sceneBeforeValue"
                        placeholder="选择专题"
                        style="width: 10vw; height: 3.5vh"
                        @change="sceneBeforeSelectChange"
                        popper-class="risk-popper"
                    >
                        <el-option
                            v-for="item in sceneList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                            <span
                                style="float: left"
                                class="section-name-text"
                                >{{ item.year }}</span
                            >
                            <span
                                style="float: right"
                                class="section-class-text"
                                >{{ item.time }}</span
                            >
                        </el-option> -->
        <!-- 11<template #footer>
                            <div class="add-select-button">新增评估情景</div>
                        </template> -->
        <!-- </el-select>
                </div>
                <div class="now-scene-title selector-title">当前地形:</div>
                <div class="now-scene selector-content">
                    <el-select
                        class="now"
                        v-model="sceneNowValue"
                        placeholder="选择专题"
                        style="width: 10vw; height: 3.5vh"
                        @change="sceneNowSelectChange(sceneNowValue)"
                        popper-class="risk-popper"
                    >
                        <el-option
                            v-for="item in sceneList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                            <span
                                style="float: left"
                                class="section-name-text"
                                >{{ item.year }}</span
                            >
                            <span
                                style="float: right"
                                class="section-class-text"
                                >{{ item.time }}</span
                            >
                        </el-option> -->
        <!-- 11<template #footer>
                            <div class="add-select-button">新增评估情景</div>
                        </template> -->
        <!-- </el-select>
                </div> -->
        <!-- <div class="risk-year-container">
                    <div class="risk-year-title">风险评估数据时效：</div>
                    <div class="risk-year-content">2023年汛后</div>
                </div>
            </div>
        </div> -->

        <!-- <div class="test" style="
      position: absolute;
      top: 2vh;
      left: 2vh;
      background-color: red;
      width: 10vw;
      height: 20vh;
    ">
      123123123
    </div> -->
        <div class="basic-info-container">
            <div class="basic-info-content">
                <div class="title-container">民主沙右缘示范段</div>
                <div class="key-val-container">
                    <div class="key-text">预警级别：</div>
                    <div class="val-text">Ⅰ级</div>
                </div>
                <div class="key-val-container right">
                    <div class="key-text">岸段长度：</div>
                    <div class="val-text">全长7公里</div>
                </div>
            </div>
        </div>
        <div class="risk-item-title">崩岸风险因素分析</div>

        <div class="risk-item-container">
            <div class="risk-item" :class="{ active: showWaterPower }">
                <div class="risk-main-index waterpower" @click="showWaterPowerFunc">
                    <dv-border-box-12 v-if="showWaterPower"></dv-border-box-12>
                    <div class="risk-item-text">水流动力</div>
                </div>
            </div>
            <div class="risk-item" :class="{ active: showRiverBed }">
                <div class="risk-main-index riverbed" @click="showRiverBedFunc">
                    <dv-border-box-12 :color="['rgb(73, 164, 101)', '#9cf3e0']" v-if="showRiverBed"></dv-border-box-12>
                    <div class="risk-item-text">河床演变</div>
                </div>
            </div>
            <div class="risk-item" :class="{ active: showGeologyAndProject }">
                <div class="risk-main-index bankGeology" @click="showGeologyAndProjectFunc">
                    <dv-border-box-12 :color="['rgb(153, 143, 199)', 'rgb(231, 161, 240)']"
                        v-if="showGeologyAndProject"></dv-border-box-12>
                    <div class="risk-item-text">地质与工程治理</div>
                </div>
            </div>
            <!-- <div class="risk-item" :class="{ active: showGeologyAndProject }">
                <div class="risk-main-index outproject" @click="showGeologyAndProjectFunc">
                    <dv-border-box-12 :color="['rgb(165, 142, 78)', '#e5ee98']"
                        v-if="showGeologyAndProject"></dv-border-box-12>
                    <div class="risk-item-text">外部因素</div>
                </div>
            </div> -->
        </div>

        <div class="raster-control-block" v-if="showRasterControl">
            <label class="switch">
                <input type="checkbox" :checked="showRaster" @click="RasterControlHandler()" />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">冲淤图展示</div>
            </div>
        </div>

        <div class="bankLine-control-block">
            <label class="switch">
                <input type="checkbox" :checked="showBankLine" @click="BankLineControlHandler()" />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">岸段展示</div>
            </div>
        </div>

        <div class="terrain-control-block">
            <label class="switch">
                <input type="checkbox" :checked="showTerrain" @click="TerrainControlHandler()" />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">三维地形</div>
            </div>
        </div>

        <div class="risk-line-container">
            <div class="risk-line-title">风险等级图例：</div>
            <div class="risk-line"></div>
            <!-- <div class="risk-line-arrow" :class="riskDataAll[riskDataIndex-1].value">
                <img src="/up_triangle.png" alt="图例标记">
            </div> -->
            <div class="risk-line-arrow" :class="styleMap[totalResult.desc]">
                <img src="/down_triangle.png" alt="图例标记" />
            </div>
            <div class="risk-line-mark low">低风险</div>
            <div class="risk-line-mark middle">中风险</div>
            <div class="risk-line-mark high">高风险</div>
        </div>

        <div class="warn-status-container" v-if="showRiskStatus">
            <div class="warn-status-title">民主沙右缘风险评估结果</div>
            <!-- <div class="warn-status-content" :class="riskDataAll[riskDataIndex-1].value">
                {{ riskDataAll[riskDataIndex-1].label }}
            </div> -->
            <div class="warn-status-content" :class="styleMap[totalResult.desc]">{{ totalResult.desc }}</div>
        </div>
        <div v-if="showRiskStatus" class="warn-detail-container" :class="styleMap[totalResult.desc]">
            <div class="warn-detail-profile">
                <div class="warn-detail-text">
                    <span class="warn-detail-span"> </span>
                    {{ totalResult.desc }}区域 :
                    <span class="warn-detail-span">{{
                        riskAreas
                    }}</span>
                </div>
            </div>
        </div>

        <!-- <div class="button-container">
            <button @click="showYearlyProfileShapeFunc">单一断面形态</button>
            <button @click="showProfileShapeFunc">断面形态</button>
            <button @click="showProfileSlopeFunc">岸坡最大坡比</button>
            <button @click="showProfileErosionFunc">近岸冲刷速率</button>
            <button @click="showBedFlowChartFunc">造床流量当量指标</button>
            <button @click="showFlowSpeedFunc">流速指标</button>
            <button @click="showWaterProcessChartFunc">水位变幅指标</button>
            <button @click="showGeologyAndProjectFunc">地质条件</button>
        </div> -->

        <profileInfoVue v-if="showProfileInfo" @profile-value-change="changeProfileValue" :profileData="profileData"
            :profileList="profileList" :shapeChartLoad="shapeChartLoad" :erosionChartLoad="erosionChartLoad" />

        <profileShapeYearlyVue v-if="false" @profile-value-change="changeProfileValue" :profileData="profileData"
            :profileList="profileList" :shapeYearlyChartLoad="shapeYearlyChartLoad" />

        <profileShapeVue v-if="showProfileShape" @profile-value-change="changeProfileValue" :profileData="profileData"
            :profileDataCompare="profileDataCompare" :profileList="profileList" :shapeChartLoad="shapeChartLoad" />

        <!-- <div class="drag profileSlope" v-if="showProfileSlope" v-draggable="{ bounds: 'body', cancel: 'div.content' }"> -->
        <profileSlopeVue v-if="showProfileSlope" @profile-value-change="changeProfileValue" :profileData="profileData"
            :profileList="profileList" :slopeChartLoad="slopeChartLoad" />
        <!-- </div> -->

        <profileErosionVue v-if="showProfileErosion" @profile-value-change="changeProfileValue" :profileData="profileData"
            :profileList="profileList" :slopeChartLoad="erosionChartLoad" />

        <div v-if="showBedFlowChart" style="
                position: absolute;
                top: 16.25vh;
                left: 0.3vw;
                width: 26vw;
                height: 23.5vh;
                z-index: 10;
            ">
            <bedFlowChartVue />
        </div>

        <flowspeedInfoVue v-if="showFlowSpeed" :profileList="profileList" :flowspeedChartLoad="flowspeedChartLoad"
            :type="nowWaterConditionType" @condition-change="conditionChangeHandler" />
        <div v-if="showFlowSpeed" class="flow-control-block">
            <label class="switch" style="transform: rotateZ(90deg)">
                <input type="checkbox" :checked="showFlow" @click="flowControlHandler()" />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">流场展示</div>
            </div>
        </div>
        <div v-if="showFlowSpeed" class="time-shower-block">
            <flowTimeShower :type="'exp'" :time-step="timeStep" :total-count="25"></flowTimeShower>
        </div>

        <div v-if="showWaterProcessChart" style="
                position: absolute;
                top: 66vh;
                left: 0.3vw;
                width: 26vw;
                height: 25vh;
                z-index: 10;
            ">
            <waterProcessChartVue :timeStep="timeStep" :type="nowWaterConditionType" />
        </div>

        <geologyAndProjectVue v-if="showGeologyAndProject" />

        <!-- <riskResultBarVue
            :riskDataIndex="riskDataIndex"
            :showRiskResult="showRiskResult"
        /> -->

        <div class="drag riskResult" v-if="showRiskResult" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <riskResultVue :profileList="profileList" />
        </div>

        <div class="raster-legend-container" v-if="showRaster && showRasterControl">
            <img src="/rasterLegend1.png" alt="比例尺" />
        </div>

        <!-- <div class="profile-draw-content">
            <div class="profile-draw-title">自定义断面：</div>
            <div class="current-param-container">
                <div class="current-param-title">当前绘制断面</div>
                <div
                    class="current-param-content"
                    :class="{ 'two-line': sectionLineLabel != '' }"
                >
                    {{
                        sectionLineLabel == ''
                            ? '暂未绘制'
                            : '起点：' + sectionLineLabel
                    }}
                </div>
                <div
                    class="current-param-content two-line"
                    v-if="sectionLineLabel != ''"
                >
                    {{ '终点：' + sectionLineLabelSec }}
                </div>
            </div>
            <div class="profile-info-container">
                <div class="profile-info-item title">断面信息：</div>
                <div
                    class="profile-info-item name"
                    v-if="tempProfileName != ''"
                >
                    断面名称: {{ tempProfileName }}
                </div>
                <div
                    class="profile-info-item risk"
                    v-if="tempProfileRisk != ''"
                >
                    风险等级:
                    {{
                        tempProfileRisk == 'low'
                            ? '低风险'
                            : tempProfileRisk == 'middle'
                              ? '中风险'
                              : '高风险'
                    }}
                </div>
                <div class="profile-info-item now" v-if="tempProfileRisk != ''">
                    当前地形: {{ tempProfileBefore }}
                </div>
                <div
                    class="profile-info-item before"
                    v-if="tempProfileRisk != ''"
                >
                    对比地形: {{ tempProfileNow }}
                </div>

                <div class="null-text" v-if="tempProfileName == ''">
                    暂无断面信息
                </div>
            </div>
        </div> -->

        <el-dialog v-model="sectionConfirmShow" title="绘制断面确认" width="40vh">
            <span>确认使用此断面进行计算</span>
            <el-input v-model="tempProfileName" style="width: 240px; margin-bottom: 10px; margin-left: 2vw"
                placeholder="请输入断面名称" clearable />
            <template #footer>
                <div class="dialog-footer">
                    <div style="text-align: right">
                        <el-button @click="cancelSectionRese">取消</el-button>
                        <el-button type="primary" @click="sureSectionRese">
                            确认
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="sceneConfirmShow" title="切换场景确认" width="40vh">
            <span>确认使用以下年份地形数据进行计算：</span>
            <div style="position: absolute; top: 6.5vh; font-weight: bold">
                {{ sceneBefore.name }}
            </div>
            <div style="position: absolute; top: 8.5vh; font-weight: bold">
                {{ sceneNow.name }}
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <div style="text-align: right">
                        <el-button @click="cancelSceneRese">取消</el-button>
                        <el-button type="primary" @click="sureSceneRese">
                            确认
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
        <div class="loading-container" v-show="isRunning">
            <dv-loading class="loading-icon">
                <div class="loading-message">{{ loading_message }}</div>
            </dv-loading>
        </div>

        <!-- <div class="hydro-pannel">
            <div class="title">
                实时水文信息
                <el-icon @click="showHydroPannel = !showHydroPannel" style="margin-left: 50%" class="iconn">
                    <More />
                </el-icon>
            </div>

            <el-table :data="waterTableData" border style="width: 15vw" v-show="showHydroPannel">
                <el-table-column prop="station" label="站点" />
                <el-table-column prop="flow" label="流量" />
                <el-table-column prop="level" label="水位" />
            </el-table>
        </div> -->

        <div class="hide-dom-container" :class="{ translate: !conditionPannelShow }" @click="hideDomClickHandler()">
            <HideDomButtom :direction="conditionPannelShow ? 'right' : 'left'"></HideDomButtom>
        </div>
        <div class="condition-pannel flex-column" :class="{ translate: !conditionPannelShow }">
            <div class="title" style="text-align: center">综合研判条件配置</div>
            <div class="card flex-column">
                <div class="flex-row" style="justify-content: space-between; align-items: center;">
                    <div class="flex-row" style="margin-right: .5vw">
                        <span class="desc">流量:</span>
                        <el-input v-model="conditionConfigureData.flow" style="width: 3.5vw; height: 3.5vh"
                            placeholder="请输入" />
                        <span style="
                                height: 3.5vh;
                                line-height: 3.5vh;
                                margin-left: 0.2vw;
                            ">m³/s</span>
                    </div>
                    <div class="flex-row">
                        <span class="desc">潮差:</span>
                        <el-input v-model="conditionConfigureData.tideDif" style="width: 2.1vw; height: 3.5vh"
                            placeholder="请输入" />
                        <span style="
                                height: 3.5vh;
                                line-height: 3.5vh;
                                margin-left: 0.2vw;
                            ">m</span>
                    </div>
                    <el-button type="primary" style="
                            /* margin-left: 1.1vw;
                            margin-top: -.5vh; */
                            width:3vw;
                            height: 4.5vh;
                            font-size: medium;
                        " @click="realtimeConditionHandler">
                        <span style="line-height: 2.25vh;">实时<br>条件</span>
                    </el-button>
                </div>
                <div class="flex-row" style="justify-content: space-between; align-items: center;">
                    <div class="flex-column">
                        <div class="flex-row" style="margin-bottom: 0.8vh; margin-top: .5vh">
                            <span class="desc">冲淤起算地形：</span>
                            <el-select v-model="conditionConfigureData.refDEM" placeholder="请选择地形"
                                style="width: 7vw; height: 3.5vh" @change="" value-key="name">
                                <el-option v-for="(
                                  item, index
                              ) in demResources" :key="index" :value="item" :label="item.name + '地形'">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="flex-row">
                            <span class="desc">判别计算地形：</span>
                            <el-select v-model="conditionConfigureData.benchDEM" placeholder="请选择地形"
                                style="width: 7vw; height: 3.5vh" @change="" value-key="name">
                                <el-option v-for="(
                                    item, index
                                ) in demResources" :key="index" :value="item" :label="item.name + '地形'">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <el-button type="primary" style="
                            width:3vw;
                            height: 6vh;
                            font-size: medium;
                        " @click="conditionConfigureDataResetHandler">确定</el-button>

                </div>

            </div>
        </div>
    </div>

    <div class="loading-container2" v-show="isRunningMan">
        <dv-loading class="loading-icon">
            <div class="loading-message2">{{ RunningManSays }}</div>
        </dv-loading>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, onUnmounted, defineAsyncComponent, computed, toRaw,
} from 'vue'
import { EBorderBox3 } from 'e-datav-vue3'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
import router from '../router/index'
import { BorderBox2 as DvBorderBox2 } from '@kjgl77/datav-vue3'
import { bankRiskWarn } from '../components/bankRiskWarn/api.js'
import flowTimeShower from '../components/bankRiskWarn/flowTimeShower.vue'
import { initPureScratchMap } from '../utils/mapUtils'
// import SteadyFlowLayer from '../utils/m_demLayer/newFlow_mask'
import FlowFieldLayer from '../utils/WebGL/notSimpleLayer'
import TerrainLayer from '../utils/WebGL/terrainLayer'
// import BankWarnLayer from '../utils/m_demLayer/bankWarnLayer';
import BankWarnLayer from '../components/dataVisual/js/bankWarnLayer'
import { useMapStore } from '../store/mapStore'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { filterFields } from 'element-plus/es/components/form/src/utils'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { convertToMercator } from '../components/bankRiskWarn/coordConvert.js'
import { rasterMM } from '../components/bankRiskWarn/rasterMM'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import HideDomButtom from '../components/bankTwin/HideDomButtom.vue'
import { connectionExists } from '@vue-flow/core'
import {
    defaultWarnLayerDataInput,
    defaultWarnLayerDataInput2,
    profileListInput,
    sceneListInput,
    placeList,
    InfoTree,
    waterCondition,
} from '../components/bankRiskWarn/data'
import { loadImage } from '../utils/mapUtils'
import BankResourceHelper from '../components/modelStore/views/bankResourceHelper';
import { runRiskLevelForAll, riskWarnResultParse } from '../components/bankRiskWarn/runRiskLevelForAll'
// import riskResultVue from '../components/bankRiskWarn/riskResult.vue'
// import flowspeedInfoVue from '../components/bankRiskWarn/flowspeedInfo.vue'
// import profileInfo from '../components/bankRiskWarn/profileInfo.vue'
import ClientStorageHelper from '../utils/ClientStorageHelper';
import { getRealTimeFlowAndLevelData } from '../api/realtimeWaterCondition';

const curActiveIndex = ref(-1)

const riskResultBarVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/riskResultBar.vue'),
)
const riskResultVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/riskResult.vue'),
)
const flowspeedInfoVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/flowspeedInfo.vue'),
)
const profileInfoVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/profileInfo.vue'),
)
const profileShapeYearlyVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/profileShapeYearly.vue'),
)
const profileShapeVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/profileShapeCompare.vue'),
)
const profileSlopeVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/profileSlope.vue'),
)
const profileErosionVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/profileErosion.vue'),
)
const bedFlowChartVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/BedFlowChart.vue'),
)
const waterProcessChartVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/WaterProcessChart.vue'),
)
const geologyAndProjectVue = defineAsyncComponent(
    () => import('../components/bankRiskWarn/GeologyAndProject.vue'),
)

// const activeStatus = ref([true, false, false])
// 地图与基本信息展示
const loading_message = ref('自定义断面信息计算中...')
const mapContainer = ref()
const timeStep = ref(0)
const showHydroPannel = ref(false)
const conditionPannelShow = ref(true)
const hideDomClickHandler = () => {
    conditionPannelShow.value = !conditionPannelShow.value
}
const timeStepFloat = ref(0)
// const timeStepFloat = computed(()=>{
//     return timeStep.value
// })
const showFlow = ref(false)
const showRaster = ref(false)
const showBankLine = ref(true)
const showTerrain = ref(false)
const infoTreeData = ref(InfoTree)


const nowWaterConditionType = ref('洪季')
let DryflowLayer
let FloodflowLayer
let dryflow = {
    layer: null,
    layerId: null,
    currentResourcePointer: 0,
    watcher: null,
}
let floodflow = {
    layer: null,
    layerId: null,
    currentResourcePointer: 0,
    watcher: null,
}
const waterTableData = [
    {
        station: '大通站',
        flow: 'N/A',
        level: 'N/A',
    },
    {
        station: '南京站',
        flow: 'N/A',
        level: 'N/A',
    },
    {
        station: '镇江站',
        flow: 'N/A',
        level: 'N/A',
    },
    {
        station: '三江营站',
        flow: 'N/A',
        level: 'N/A',
    },
    {
        station: '江阴站',
        flow: 'N/A',
        level: 'N/A',
    },
    {
        station: '徐六泾站',
        flow: 'N/A',
        level: 'N/A',
    },
]

const conditionChangeHandler = (lable) => {
    nowWaterConditionType.value = lable
    console.log(nowWaterConditionType.value)
    showFlow.value = false
    timeStep.value = 0
    // timeStepFloat.value = 0
    // remove layer
    let map = useMapStore().getMap()
    if (map.getLayer('floodFlow')) {
        map.removeLayer('floodFlow')
        if (floodWatcher) {
            floodWatcher()
            floodWatcher = null
        }
    }

    if (map.getLayer('dryFlow')) {
        map.removeLayer('dryFlow')
        if (dryWatcher) {
            dryWatcher()
            dryWatcher = null
        }
    }
}

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.43987922676836, 32.03201616423072],
            [120.59089640208264, 32.052171362618625],
        ],
        {
            duration: 1500,
            // zoom: 11.5,
        },
    )
}
const mapJumpToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.jumpTo({
        center: [120.529, 32.032],
        zoom: 11.5,
    })
    // mapIns.fitBounds(
    //     [
    //         [120.46987922676836, 32.03201616423072],
    //         [120.61089640208264, 32.052171362618625],
    //     ],
    //     {
    //         duration: 500,
    //         zoom: 11.5,
    //     },
    // )
}

/////////////// 初始岸段资源获取
const demResources = ref([])
const getDemResource = async () => {
    const _bankEnName = 'Mzs'
    const _demData = (await BankResourceHelper.getBankCalculateResourceList('DEM', _bankEnName)).data
    console.log('getDemResource', _demData)
    return BankResourceHelper.DEMResourcetoList(_demData)
    // return [{ name: '1' }, { name: '2' }]
}


// totalResult
const styleMap = {
    '低风险': 'low',
    '中风险': 'middle',
    '高风险': 'high'
}
const totalResult = reactive({
    desc: '高风险'
})
////////////// 重置水文条件，12个断面执行多指标模型
const conditionConfigureData = reactive({
    flow: 57500,
    tideDif: 3.1,
    refDEM: {
        "sets": "standard",
        "year": "2012",
        "name": "201210",
        "fileType": "tiff",
        "path": "tiff/Mzs/2012/standard/201210/201210.tif",
        "month": "10"
    },
    benchDEM: {
        "sets": "standard",
        "year": "2023",
        "name": "202304",
        "fileType": "tiff",
        "path": "tiff/Mzs/2023/standard/202304/202304.tif",
        "month": "04"
    },
})
const realtimeConditionHandler = async () => {

    const realTimeCond = await getRealTimeFlowAndLevelData()

    conditionConfigureData.flow = realTimeCond.flow
    conditionConfigureData.tideDif = realTimeCond.level
}


let bankWarnLayer = null
const isRunningMan = ref(false)
const RunningManSays = ref('')
const conditionConfigureDataResetHandler = async () => {
    console.log(window.location.pathname)
    //// debug ////

    // 模型参数
    // const kkey = ClientStorageHelper.generateKey(window.location.pathname)
    // if(ClientStorageHelper.get(kkey)){
    //     let paramsValue = ClientStorageHelper.get(kkey)
    // }

    // const paramsValue = toRaw(conditionConfigureData)
    // ClientStorageHelper.save(kkey, paramsValue)

    // // 模型结果
    // const key = ClientStorageHelper.generateKey(paramsValue)

    // if (ClientStorageHelper.get(key)) {
    //     let result = ClientStorageHelper.get(key)
    //     console.log('get result from client storage and show', result)
    //     return
    // }
    // else {
    //     console.log('run model and show result')
    //     const result = 'result'
    //     ClientStorageHelper.save(key, result)
    //     return
    // }


    // return


    ///////////////////////  check  /////////////////////// 

    const nullCheck = (val) => {
        if (val === null || val === undefined || val === 'null' || val === 'undefined' || val === 'NaN' || val === '')
            return false
        return true
    }
    for (let key in conditionConfigureData) {
        if (!nullCheck(conditionConfigureData[key])) {
            ElMessage({
                type: 'error',
                offset: 120,
                message: '请正确配置条件！'
            })
            return
        }
    }
    if (isRunningMan.value) {
        ElMessage({
            type: 'info',
            offset: 120,
            message: '模型正在运行，请等待！'
        })
        return
    }
    isRunningMan.value = true
    RunningManSays.value = '模型正在运行，请稍候...'
    console.log('reset condition data!', conditionConfigureData)



    ///////////////////////  Run  /////////////////////// 
    runRiskLevelForAll({
        waterQS: parseFloat(conditionConfigureData.flow),
        tidalLevel: parseFloat(conditionConfigureData.tideDif),
        refDEM: conditionConfigureData.refDEM,
        benchDEM: conditionConfigureData.benchDEM,
    }, {}, {
        bankEnName: 'Mzs',
        setName: 'standard'
    }).then((result) => {
        console.log('runRiskLevelForAll result:', result)

        if (result === null) {
            ElMessage({
                type: 'error',
                message: '模型运行失败',
                offset: 260
            })
            isRunningMan.value = false
            RunningManSays.value = ''
            return
        }

        isRunningMan.value = false
        RunningManSays.value = ''
        ///////////////////// result ////////////////////////

        const { warnLayerData, riskAreassss, finalResult } = riskWarnResultParse(result)
        console.log('riskAreassss:', riskAreassss)

        totalResult.desc = finalResult
        riskAreas.value = riskAreassss.join('; ')
        let map = useMapStore().getMap()
        if (bankWarnLayer && map) {
            bankWarnLayer.update(warnLayerData)
            map.triggerRepaint()
        }

    }).catch((error) => {
        isRunningMan.value = false
        return
    })


}
















// 数据
const profileList = ref(profileListInput)
const sceneList = ref(sceneListInput)
let defaultWarnLayerData = defaultWarnLayerDataInput
const riskDataAll = ref([
    {
        value: 'low',
        label: '低风险',
    },
    {
        value: 'middle',
        label: '中风险',
    },
    {
        value: 'high',
        label: '高风险',
    },
])
const placeValue = ref('mzs')

// 场景与地形选择
const sceneBeforeSelectChange = () => { }

const sceneNowSelectChange = () => { }

const confirmProfileTime = () => {
    sceneConfirmShow.value = true
}

// 获取当前场景内容
const getProfileTime = () => {
    sceneBefore = sceneList.value.find(
        (item) => item.value === sceneBeforeValue.value,
    )
    sceneNow = sceneList.value.find(
        (item) => item.value === sceneNowValue.value,
    )
    sceneCompareBefore = sceneList.value.find(
        (item) => item.value === sceneCompareBeforeValue.value,
    )
    sceneCompareNow = sceneList.value.find(
        (item) => item.value === sceneCompareNowValue.value,
    )
    // tempProfileBefore.value = sceneBefore.label
    // tempProfileNow.value = sceneNow.label
    // tempProfileAfter.value = sceneAfter.label
}

const getRiskAreas = (riskLevel) => {
    let resultString = ''
    profileList.value.map((item) => {
        if (item.risk === riskLevel) {
            resultString = resultString + item.name + '; '
        }
    })
    return resultString
}

const getRiskAreasAll = () => {
    let resultString = ''
    profileList.value.map((item) => {
        resultString + item.nickname + ' '
    })
    return resultString
}

// 场景选择
const cancelSceneRese = () => {
    sceneConfirmShow.value = false
}
const sureSceneRese = async () => {
    getProfileTime()
    sceneConfirmShow.value = false
    if (sceneNow.dateShort <= sceneBefore.dateShort) {
        ElMessage.error('当前地形时间不能早于或等于对比地形时间！')
        return
    }
    if (
        preSceneBeforeValue.value === sceneBeforeValue.value &&
        preSceneNowValue.value === sceneNowValue.value
    ) {
        ElMessage.error('当前地形时间与对比地形时间未发生变化！')
        return
    }
    // 添加栅格图层
    loading_message.value = '冲淤图层加载中...'
    isRunning.value = true
    shapeChartLoad.value = true
    erosionChartLoad.value = true
    flowspeedChartLoad.value = true
    const time = sceneNow.dateShort + sceneBefore.dateShort
    if (!showRaster.value) {
        showRaster.value = true
    }
    mapInstance.removeLayer('mapRaster')
    mapInstance.removeSource('mapRaster')
    addRasterLayer(mapInstance, time, 'mapRaster')
    mapInstance.moveLayer('mapRaster', 'mzsLine')
    // 计算各个断面数据
    ProfileLoadingProcess(
        sceneBefore,
        sceneNow,
        sceneCompareBefore,
        sceneCompareNow,
    )
}

const changeProfileValue = (value) => {
    mapInstance.setFilter(
        'mzsBankLineChoosen',
        profileList.value[value - 1].filter,
    )
}

// 加载断面数据和图层1
const ProfileLoadingProcess = async (
    sceneBefore,
    sceneNow,
    sceneCompareBefore,
    sceneCompareNow,
) => {
    const before = sceneBefore.date
    const now = sceneNow.date
    const compareBefore = sceneCompareBefore.date
    const compareNow = sceneCompareNow.date
    loading_message.value = '确认计算结果是否存在...'
    isRunning.value = true
    let exist
    let existCompare
    exist = await profileDataExist(before, now)
    existCompare = await profileDataExist(compareBefore, compareNow)
    if (exist && existCompare) {
        loading_message.value = '地形对比数据加载中...'
        profileData.value = await getProfileData(before, now)
        profileDataCompare.value = await getProfileData(
            compareBefore,
            compareNow,
        )
    } else if (exist && !existCompare) {
        loading_message.value = '地形对比数据加载中...'
        await CalProfile(compareBefore, compareNow)
        loading_message.value = '地形对比数据加载中...'
        profileData.value = await getProfileData(before, now)
        profileDataCompare.value = await getProfileData(
            compareBefore,
            compareNow,
        )
    } else if (!exist && existCompare) {
        loading_message.value = '地形对比数据加载中...'
        await CalProfile(before, now)
        loading_message.value = '地形对比数据加载中...'
        profileData.value = await getProfileData(before, now)
        profileDataCompare.value = await getProfileData(
            compareBefore,
            compareNow,
        )
    } else {
        loading_message.value = '地形对比数据加载中...'
        await CalProfile(compareBefore, compareNow)
        await CalProfile(before, now)
        loading_message.value = '地形对比数据加载中...'
        profileData.value = await getProfileData(before, now)
        profileDataCompare.value = await getProfileData(
            compareBefore,
            compareNow,
        )
    }
    // loading_message.value = "地形对比结果计算中..."
    // await CalProfile(before, now)
    // loading_message.value = "地形对比数据加载中..."
    // profileData = await getProfileData(before, now)
    isRunning.value = false
    shapeChartLoad.value = false
    slopeChartLoad.value = false
    erosionChartLoad.value = false
    flowspeedChartLoad.value = false
    // changeProfileData(profileData.value)
    changeProfileListForShow() //展示高风险
    CalProfileListForShow(profileData.value)
    // CalProfileList(profileData.value)
    if (mapInstance.getLayer('mzsBankLineLowRisk') !== undefined) {
        mapInstance.removeLayer('mzsBankLineLowRisk')
        addBankLineRiskLayer(mapInstance, profileList)
    } else {
        addBankLineRiskLayer(mapInstance, profileList)
    }
    showRiskStatus.value = true
    preSceneBeforeValue.value = sceneBeforeValue.value
    preSceneNowValue.value = sceneNowValue.value
}

// 判断断面数据是否存在1-1
const profileDataExist = async (before, now) => {
    const promises = []
    let result = true
    try {
        for (let i = 0; i < 12; i++) {
            promises.push(bankRiskWarn.getProfileData(before, now, i + 1))
        }
        const allResponses = await Promise.all(promises)
        allResponses.forEach((response) => {
            if (!response || !response.data || response.data.length === 0) {
                result = false
            } else {
                // console.log(response);
            }
        })
    } catch (error) {
        result = false
    }
    return result
}

// 获取断面数据1-2(1)
const getProfileData = async (before, now) => {
    const promises = []
    const result = []
    for (let i = 0; i < 12; i++) {
        promises.push(bankRiskWarn.getProfileData(before, now, i + 1))
    }
    const allResponses = await Promise.all(promises)

    // 确保每个响应都有 data 属性
    allResponses.forEach((response) => {
        if (response && response.data) {
            result.push(response.data)
        } else {
            // console.log(response);
        }
    })
    return result
}

// 计算断面详细信息1-2(2)
const CalProfile = async (before, now) => {
    const promises = []
    for (let i = 0; i < profileList.value.length; i++) {
        promises.push(CalProfileById(before, now, i))
    }
    await Promise.all(promises)
}
const CalProfileById = async (before, now, id) => {
    const taskId = await bankRiskWarn.runProfileModel_long(before, now, id + 1)
    let RunStatus
    for (; ;) {
        try {
            RunStatus = await bankRiskWarn.getRunStatus(taskId.data)
        } catch (error) {
            // console.log(error)
        }
        if (RunStatus.data == 2) {
            break
        } else if (RunStatus.data == -1) {
            // alert("模型运行结果失败")
            return
        } else if (RunStatus.data == -2) {
            // alert("模型运行生成json失败")
            return
        } else if (RunStatus.data == 1) {
            // alert("模型运行中")
        }
        await wait(100)
    }
}

// 获取断面风险和流速信息1-2(2)
const CalProfileList = (profileData) => {
    let lowNum = 0,
        middleNum = 0,
        highNum = 0
    profileData.map((value, index) => {
        const riskLevel = value.risk[2]
        // defaultWarnLayerData[index].warnValue = value.risk[2]
        if (riskLevel < 0.25) {
            profileList.value[index].risk = 'low'
            profileList.value[index].color = 'rgb(31, 110, 209)'
            lowNum++
        } else if (riskLevel < 0.5) {
            profileList.value[index].risk = 'middle'
            profileList.value[index].color = 'rgb(220, 126, 37)'
            middleNum++
        } else {
            profileList.value[index].risk = 'high'
            profileList.value[index].color = 'rgb(250, 55, 36)'
            highNum++
        }
        if (highNum > 0) {
            riskDataIndex.value = 2
        } else if (middleNum > 0) {
            riskDataIndex.value = 1
        } else {
            riskDataIndex.value = 0
        }
        try {
            profileList.value[index].flowspeed = value.deepestPoint[2]
        } catch (error) { }
    })
    // let map = useMapStore().getMap()
    // if (map) {
    //     // console.log('12312321', defaultWarnLayerData)
    //     // map.removeLayer('岸段预警')
    //     // map.addLayer(new BankWarnLayer(defaultWarnLayerData))
    // }
}
const CalProfileListForShow = (profileData) => {
    profileData.map((value, index) => {
        // defaultWarnLayerData[index].warnValue = value.risk[2]
        if (profileList.value[index].risk === 'low') {
            profileList.value[index].color = 'rgb(31, 110, 209)'
        } else if (profileList.value[index].risk === 'middle') {
            profileList.value[index].color = 'rgb(220, 126, 37)'
        } else {
            profileList.value[index].color = 'rgb(250, 55, 36)'
        }
        try {
            profileList.value[index].flowspeed = value.deepestPoint[2]
        } catch (error) { }
    })
    let map = useMapStore().getMap()
    if (map) {
        // console.log('12312321', defaultWarnLayerData)
        // map.removeLayer('岸段预警')
        // map.addLayer(new BankWarnLayer(defaultWarnLayerData))
    }
}

const sceneSelectChange = () => { }

const onAddOption = () => { }

const onAddProfileOption = () => { }

const onAddProfile = () => { }

let floodWatcher = null
let dryWatcher = null
const flowControlHandler = async () => {
    showFlow.value = !showFlow.value
    let map = useMapStore().getMap()
    // console.log(showFlow.value);
    timeStep.value = 0
    // timeStepFloat.value = 0
    if (showFlow.value) {
        if (nowWaterConditionType.value == '洪季') {
            let backEndJsonUrl2 = '/api/data/flow/configJson/flood'
            let imageSrcPrefix2 = '/api/data/flow/texture/flood/'
            let floodFlow = reactive(
                new FlowFieldLayer(
                    'floodFlow',
                    backEndJsonUrl2,
                    imageSrcPrefix2,
                ),
            )
            map.addLayer(floodFlow, 'chaoWeiPointLable')

            // floodWatcher = watch(
            //     () => floodFlow.currentResourcePointer,
            //     (v) => {
            //         timeStep.value = floodFlow.currentResourcePointer
            //         // timeStepFloat.value = floodFlow.currentResourcePointer + floodFlow.progressRate
            //     },
            // )
            floodWatcher = watch(
                () => floodFlow._progressRate,
                (v) => {
                    let val = parseFloat(
                        (floodFlow.timeCount / floodFlow.timePerFrame).toFixed(
                            1,
                        ),
                    )
                    timeStep.value = val
                },
            )

            console.log('add 洪季')
        } else if (nowWaterConditionType.value == '枯季') {
            let backEndJsonUrl1 = '/api/data/flow/configJson/dry'
            let imageSrcPrefix1 = '/api/data/flow/texture/dry/'
            let dryFlow = reactive(
                new FlowFieldLayer('dryFlow', backEndJsonUrl1, imageSrcPrefix1),
            )
            map.addLayer(dryFlow, 'chaoWeiPointLable')

            // dryWatcher = watch(
            //     () => dryFlow.currentResourcePointer,
            //     (v) => {
            //         timeStep.value = dryFlow.currentResourcePointer
            //     },
            // )
            dryWatcher = watch(
                () => dryFlow._progressRate,
                (v) => {
                    let val = parseFloat(
                        (dryFlow.timeCount / dryFlow.timePerFrame).toFixed(1),
                    )
                    timeStep.value = val
                },
            )
            console.log('add 枯季')
        }
    } else {
        if (nowWaterConditionType.value == '洪季') {
            if (map.getLayer('floodFlow')) {
                map.removeLayer('floodFlow')
                floodWatcher()
                floodWatcher = null
            }
        } else if (nowWaterConditionType.value == '枯季') {
            if (map.getLayer('dryFlow')) {
                map.removeLayer('dryFlow')
                dryWatcher()
                dryWatcher = null
            }
        }
    }

    // if (showFlow.value) {
    //     if (map) {
    //         if (map.getLayer('FlowLayer')) {
    //             // flow.show()
    //             map.setLayoutProperty('FlowLayer', 'visibility', 'visible');
    //         } else {
    //             // flow = reactive(new FlowFieldLayer('/scratchSomething/flowWebGL/json/flow_field_description.json'))
    //             // flow = reactive(new )
    //             map.addLayer(flow)
    //             watch(
    //                 () => flow.currentResourcePointer,
    //                 (v) => {
    //                     // console.log(flow.currentResourcePointer)
    //                     timeStep.value = flow.currentResourcePointer
    //                 },
    //             )
    //         }
    //     } else {
    //         ElMessage({
    //             type: 'warning',
    //             message: '地图尚未加载，请等待',
    //         })
    //     }
    // } else {
    //     // flow.hide()
    //     map.setLayoutProperty('FlowLayer', 'visibility', 'none');
    // }
}

// watch(
//     () => flow.currentResourcePointer,
//     (v) => {
//         // console.log(flow.currentResourcePointer)
//         timeStep.value = flow.currentResourcePointer
//     },
// )

const RasterControlHandler = () => {
    if (showRaster.value && showRasterControl.value) {
        mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')
        showRaster.value = !showRaster.value
    } else if (!showRaster.value && showRasterControl.value) {
        mapInstance.setLayoutProperty('mapRaster', 'visibility', 'visible')
        showRaster.value = !showRaster.value
    } else if (showRaster.value && !showRasterControl.value) {
        mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')
        showRaster.value = !showRaster.value
    } else {
        mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')
    }
}

const BankLineControlHandler = () => {
    if (showBankLine.value) {
        mapInstance.setLayoutProperty('岸段预警', 'visibility', 'none')
    } else {
        mapInstance.setLayoutProperty('岸段预警', 'visibility', 'visible')
    }
    showBankLine.value = !showBankLine.value
}

const TerrainControlHandler = () => {
    showTerrain.value
        ? mapInstance.setLayoutProperty('TerrainLayer', 'visibility', 'none')
        : mapInstance.setLayoutProperty('TerrainLayer', 'visibility', 'visible')
    showTerrain.value = !showTerrain.value
}

// 地形对比变量
const sceneBeforeValue = ref('2019before')
const sceneNowValue = ref('2023before1')
const sceneCompareBeforeValue = ref('1999before')
const sceneCompareNowValue = ref('2012after')
const preSceneBeforeValue = ref('2019before')
const preSceneNowValue = ref('2023before1')
const preSceneCompareBeforeValue = ref('2012after')
const presceneCompareNowValue = ref('2012after')
let sceneBefore
let sceneNow
let sceneCompareBefore
let sceneCompareNow

// 窗口显示变量
const showRiskStatus = ref(false)
const showProfileInfo = ref(false)
const showYearlyProfileShape = ref(false)
const showYearlyProfileShapeFunc = () => {
    showYearlyProfileShape.value = !showYearlyProfileShape.value
}
const showProfileShape = ref(false)
const showProfileShapeFunc = () => {
    showProfileShape.value = !showProfileShape.value
}
const showProfileSlope = ref(false)
const showProfileSlopeFunc = () => {
    showProfileSlope.value = !showProfileSlope.value
}
const showProfileErosion = ref(false)
const showProfileErosionFunc = () => {
    showProfileErosion.value = !showProfileErosion.value
}
const showRiskResult = ref(false)
const showRiskResultFunc = () => {
    showRiskResult.value = !showRiskResult.value
}
const showBedFlowChart = ref(false)
const showBedFlowChartFunc = () => {
    showBedFlowChart.value = !showBedFlowChart.value
}
const showWaterProcessChart = ref(false)
const showWaterProcessChartFunc = () => {
    showWaterProcessChart.value = !showWaterProcessChart.value
}
const showFlowSpeed = ref(false)
const showFlowSpeedFunc = async () => {
    if (showFlow.value === false && showFlowSpeed.value === true) {
        showFlowSpeed.value = false
        return
    }
    showFlowSpeed.value = !showFlowSpeed.value
    timeStep.value = 0
    // timeStepFloat.value = 0
    await flowControlHandler()
}
const showRasterControl = ref(false)
const showRasterControlFunc = () => {
    RasterControlHandler()
    showRasterControl.value = !showRasterControl.value
}

// 展示水动力因素指标，包括:
// 当前年份断面（探槽高差+坡比文字）+三年图+近岸冲刷速率值
const showWaterPower = ref(false)
const showWaterPowerFunc = async () => {
    if (showRiverBed.value === true) {
        showRiverBedFunc()
    } else if (showGeologyAndProject.value === true) {
        showGeologyAndProjectFunc()
    }
    showBedFlowChartFunc()
    showWaterProcessChartFunc()
    await showFlowSpeedFunc()
    mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')
    showWaterPower.value = !showWaterPower.value
}

const showRiverBed = ref(false)
const showRiverBedFunc = () => {
    if (showWaterPower.value === true) {
        showWaterPowerFunc()
    } else if (showGeologyAndProject.value === true) {
        showGeologyAndProjectFunc()
    }

    if (
        (showRaster.value === false && showProfileShape.value === true) ||
        (showRaster.value === true && showProfileShape.value === false)
    ) {
        showProfileShapeFunc()
        showYearlyProfileShapeFunc()
        showRasterControlFunc()
        showRiverBed.value = !showRiverBed.value
        return
    }
    showProfileShapeFunc()
    showYearlyProfileShapeFunc()
    showRasterControlFunc()
    showRiverBed.value = !showRiverBed.value
    // RasterControlHandler()
}

const showGeologyAndProject = ref(false)
const showGeologyAndProjectFunc = () => {
    if (showWaterPower.value === true) {
        showWaterPowerFunc()
    } else if (showRiverBed.value === true) {
        showRiverBedFunc()
    }
    mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')
    showGeologyAndProject.value = !showGeologyAndProject.value
}

const profileData = ref([])
const profileDataCompare = ref([])
const riskDataIndex = ref(0)
const riskAreas = ref([])
const tempProfile = ref(null)
const tempProfileData = ref(null)

// 断面图表变量
const shapeYearlyChartLoad = ref(true)
const shapeChartLoad = ref(true)
const slopeChartLoad = ref(true)
const erosionChartLoad = ref(true)
const flowspeedChartLoad = ref(true)

const tempProfileName = ref('')
const tempProfileRisk = ref('')
const tempProfileBefore = ref('')
const tempProfileNow = ref('')

// 断面绘制变量
let mapInstance
const sectionConfirmShow = ref(false)
const sceneConfirmShow = ref(false)
const sectionLineLabel = ref('')
const sectionLineLabelSec = ref('')
const isRunning = ref(false)

let StartPtX
let StartPtY
let EndPtX
let EndPtY
const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        line_string: true,
        trash: true,
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
const cancelSectionRese = () => {
    sectionConfirmShow.value = false
}
// 两年版本
const sureSectionRese = async () => {
    if (tempProfileName.value === '') {
        ElMessage.error('断面名称不为空！')
        return
    } else if (
        profileList.value.find((item) => item.name === tempProfileName.value)
    ) {
        ElMessage.error('断面名称已存在！')
        return
    }
    isRunning.value = true
    shapeYearlyChartLoad.value = true
    shapeChartLoad.value = true
    slopeChartLoad.value = true
    erosionChartLoad.value = true
    loading_message.value = '自定义断面信息计算中...'
    sectionConfirmShow.value = false
    const before = sceneList.value.find(
        (item) => item.value == sceneBeforeValue.value,
    ).date
    const after = sceneList.value.find(
        (item) => item.value == sceneNowValue.value,
    ).date
    const taskId = await CalProfileByPoint(
        before,
        after,
        StartPtX,
        StartPtY,
        EndPtX,
        EndPtY,
    )
    let RunStatus = ''
    for (; ;) {
        try {
            RunStatus = await bankRiskWarn.getRunStatus(taskId.data)
        } catch (error) {
            // console.log(error)
        }
        if (RunStatus.data == 2) {
            break
        } else if (RunStatus.data == -1) {
            // alert("模型运行结果失败")
            return
        } else if (RunStatus.data == -2) {
            // alert("模型运行生成json失败")
            return
        } else if (RunStatus.data == 1) {
            // alert("模型运行中")
        }
        await wait(500)
    }
    const profileResult = await bankRiskWarn.getRunResult(taskId.data)
    putDataInList(profileResult.data)
    profileData.value.push(profileResult.data)
    isRunning.value = false
    shapeYearlyChartLoad.value = false
    shapeChartLoad.value = false
    slopeChartLoad.value = false
    erosionChartLoad.value = false
}

async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const CalProfileByPoint = async (
    before,
    now,
    StartPtX,
    StartPtY,
    EndPtX,
    EndPtY,
) => {
    const taskId = await bankRiskWarn.runProfileModelByLine(
        before,
        now,
        StartPtX,
        StartPtY,
        EndPtX,
        EndPtY,
    )
    return taskId
}

const putDataInList = (profileDataItem) => {
    let tempRisk
    if (profileDataItem.risk[2] < 0.25) {
        tempRisk = 'low'
    } else if (profileDataItem.risk[2] < 0.5) {
        tempRisk = 'middle'
    } else {
        tempRisk = 'high'
    }
    tempProfileRisk.value = tempRisk
    tempProfile.value = {
        value: profileList.value.length + 1,
        label: tempProfileName.value,
        name: tempProfileName.value,
        filter: ['==', '$type', `${tempProfileName.value}`],
        flowspeed: profileDataItem.deepestPoint[2],
        risk: tempRisk,
    }
    tempProfileData.value = profileDataItem
    profileList.value.push(tempProfile.value)
}

const changeSceneBefore = (value) => {
    sceneBeforeValue.value = value
}

const changeSceneNow = (value) => {
    sceneNowValue.value = value
}

const addRasterLayer = (map, time, name) => {
    map.addSource(name, {
        type: 'raster',
        tiles: [tileServer + `/tile/raster/mzs/flood/${time}/{x}/{y}/{z}`],
        tileSize: 256,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.109, 31.823, 120.855, 32.102],
    })
    let rasterMin = rasterMM[time].min
    let rasterMax = rasterMM[time].max
    map.addLayer({
        id: name,
        type: 'raster',
        source: name,
        paint: {
            'raster-color': [
                'interpolate',
                ['linear'],
                ['raster-value'],
                -10 - rasterMin,
                'rgba(0,0,255,1)',
                0 - rasterMin,
                'rgba(255, 255, 255, 1)',
                10 - rasterMin,
                'rgba(255, 0, 0, 1)',
            ],
            'raster-color-mix': [rasterMax - rasterMin, 0, 0, 0],
            'raster-opacity': 0.85,
            'raster-color-range': [-30, 30],
        },
    })
}

const changeProfileListForShow = () => {
    for (let i = 0; i < 12; i++) {
        if (defaultWarnLayerDataInput[i].warnValue < 0.25) {
            profileList.value[i].risk = 'low'
        } else if (defaultWarnLayerDataInput[i].warnValue < 0.5) {
            profileList.value[i].risk = 'middle'
        } else {
            profileList.value[i].risk = 'high'
        }
    }
}

const addBankLineRiskLayer = (map, profileList) => {
    map.addLayer(
        {
            id: 'mzsBankLineLowRisk',
            type: 'line',
            source: 'mzsBankLineSource',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                // 'line-color': [
                //     'match',
                //     ['get', 'name'],
                //     'JC01',
                //     `${profileList.value[0].color}`,
                //     'JC02',
                //     `${profileList.value[1].color}`,
                //     'JC03',
                //     `${profileList.value[2].color}`,
                //     'JC04',
                //     `${profileList.value[3].color}`,
                //     'JC05',
                //     `${profileList.value[4].color}`,
                //     'JC06',
                //     `${profileList.value[5].color}`,
                //     'JC07',
                //     `${profileList.value[6].color}`,
                //     'JC08',
                //     `${profileList.value[7].color}`,
                //     'JC09',
                //     `${profileList.value[8].color}`,
                //     'JC10',
                //     `${profileList.value[9].color}`,
                //     'JC11',
                //     `${profileList.value[10].color}`,
                //     'JC12',
                //     `${profileList.value[11].color}`,
                //     'rgb(255, 255, 255)',
                // ],
                'line-color': 'rgba(255, 0, 0, 1)',
                'line-width': 3,
            },
        },
        'mzsSectionLabelLayer',
    )
}

onMounted(async () => {
    demResources.value = await getDemResource()

    await initPureScratchMap(mapContainer.value).then(async (map) => {
        mapInstance = map
        // map.on('draw.create', function (e) {
        //     sectionConfirmShow.value = true
        //     let lineFeature = e.features[0]
        //     sectionLineLabel.value =
        //         lineFeature.geometry.coordinates[0][0].toFixed(6) +
        //         ',' +
        //         lineFeature.geometry.coordinates[0][1].toFixed(6)
        //     sectionLineLabelSec.value =
        //         lineFeature.geometry.coordinates[1][0].toFixed(6) +
        //         ',' +
        //         lineFeature.geometry.coordinates[1][1].toFixed(6)
        //     let startWebMerCoord = convertToMercator(
        //         lineFeature.geometry.coordinates[0],
        //     )
        //     let endWebMerCoord = convertToMercator(
        //         lineFeature.geometry.coordinates[1],
        //     )
        //     StartPtX = startWebMerCoord[0]
        //     StartPtY = startWebMerCoord[1]
        //     EndPtX = endWebMerCoord[0]
        //     EndPtY = endWebMerCoord[1]
        //     return
        // })

        // map.addControl(new mapboxgl.NavigationControl(), 'top-left')
        // mapJumpToRiver(map)
        mapFlyToRiver(map)
        // console.log('map loaded!!!')
        map.addSource('mzsPlaceLabelSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}'],
        })
        map.addSource('mzsPlaceLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankAreaSSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankAreaOne/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
        })
        map.addSource('dockAreaSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/dockArea/{x}/{y}/{z}'],
        })
        map.addSource('dockAreaLabelSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/center/dockArea/{x}/{y}/{z}'],
        })
        map.addSource('fixProjectAreaSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/fixProjectArea/{x}/{y}/{z}'],
        })
        map.addSource('fixProjectLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/fjsFixLine/{x}/{y}/{z}'],
        })
        map.addSource('fixProjectAreaLabelSource', {
            type: 'vector',
            tiles: [
                tileServer + '/tile/vector/center/fixProjectArea/{x}/{y}/{z}',
            ],
        })
        map.addSource('riverPlaceLabel', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/placeLabel/{x}/{y}/{z}'],
        })
        map.addSource('riverBeachSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/riverBeach/{x}/{y}/{z}'],
        })
        map.addSource('zjgLine', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/zjgBridgeLine/{x}/{y}/{z}'],
        })
        map.addLayer({
            id: 'riverBeachArea',
            type: 'fill',
            source: 'riverBeachSource',
            'source-layer': 'default',
            paint: {
                'fill-color': 'rgba(210,244,247, 1)',
            },
        })
        map.addLayer({
            id: 'zjgBridge',
            type: 'line',
            source: 'zjgLine',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 0.6,
                // 'line-pattern': 'test',
                'line-color': 'rgb(183, 189, 183)',
                'line-width': 2.0,
            },
        })

        addRasterLayer(map, 23032209, 'mapRaster')

        map.setLayoutProperty('mapRaster', 'visibility', 'none')
        // map.addLayer({
        //     id: 'riverBeachArea',
        //     type: 'fill',
        //     source: 'riverBeachSource',
        //     'source-layer': 'default',
        //     paint: {
        //         'fill-color': 'rgba(210,244,247, 1)',
        //     },
        // })

        map.addLayer(new TerrainLayer(14))
        map.setLayoutProperty('TerrainLayer', 'visibility', 'none')

        map.addLayer({
            id: 'mzsLine',
            type: 'line',
            source: 'mzsPlaceLineSource',
            'source-layer': 'default',
            // filter:['==', '$type', 'LineString'],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(26, 87, 138, 0.6)',
                'line-width': 2,
            },
        })
        map.addLayer({
            id: 'fjsFixLine',
            type: 'line',
            source: 'fixProjectLineSource',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(216, 217, 228, 0.5)',
                'line-width': 4,
            },
        })
        map.addLayer({
            id: 'fixProjectFillLayer',
            type: 'fill',
            source: 'fixProjectAreaSource',
            'source-layer': 'default',
            paint: {
                'fill-color': 'rgba(220,224,237, 0.8)',
                'fill-outline-color': 'rgba(220,224,237, 0.8)',
            },
        })
        map.addLayer({
            id: 'fixProjectAreaLabel',
            type: 'symbol',
            source: 'fixProjectAreaLabelSource',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'layer'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'right',
                'text-size': 12,
            },
            paint: {
                'text-color': 'rgba(31, 44, 126, 0.6)',
            },
        })
        map.addLayer({
            id: 'mzsLabel',
            type: 'symbol',
            source: 'mzsPlaceLabelSource',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'left',
            },
            paint: {
                'text-color': 'rgba(31, 14, 126, 0.75)',
            },
        })
        map.addLayer({
            id: 'dockArea',
            type: 'fill',
            source: 'dockAreaSource',
            'source-layer': 'default',
            paint: {
                'fill-color': 'rgb(172,214,239)',
            },
        })
        map.addLayer({
            id: 'dockAreaLabel',
            type: 'symbol',
            source: 'dockAreaLabelSource',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'project_name'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'bottom',
                'text-size': 12,
            },
            paint: {
                'text-color': 'rgba(31, 44, 126, 0.6)',
            },
        })
        map.addLayer({
            id: 'riverPlaceLabel',
            type: 'symbol',
            source: 'riverPlaceLabel',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'left',
                'text-size': 18,
            },
            paint: {
                'text-color': 'rgba(31, 44, 226, 1)',
            },
        })
        // map.addLayer({
        //     id: 'mzsSectionArea1',
        //     type: 'fill',
        //     source: 'mzsBankAreaSSource',
        //     'source-layer': 'default',
        //     paint: {
        //         'fill-color': [
        //             'match',
        //             ['get', 'stability'],
        //             '较稳定',
        //             '#18b915',
        //             '稳定',
        //             '#06bef1',
        //             '不稳定',
        //             '#df8105',
        //             '较不稳定',
        //             '#ee3603',
        //             '#18b915',
        //         ],
        //     },
        // })
        // const jsonUrl = '/bankWarn/bankWarn.json'
        // map.addLayer({
        //     id: 'mzsBankLine',
        //     type: 'line',
        //     source: 'mzsBankLineSource',
        //     'source-layer': 'default',
        //     filter: ['all'],
        //     layout: {
        //         'line-cap': 'round',
        //         'line-join': 'round',
        //     },
        //     paint: {
        //         'line-opacity': 1,
        //         'line-color': 'rgba(31, 14, 223, 0.5)',
        //         'line-width': 4,
        //     },
        // })

        map.addSource('mzsSectionLabel', {
            type: 'vector',
            tiles: [
                tileServer + '/tile/vector/geomCenter/mzsBankLine/{x}/{y}/{z}',
            ],
        })

        const chaoWeiPoint = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {
                        label: '潮位点',
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [120.522864, 32.035502],
                    },
                },
            ],
        }
        map.addSource('chaoWeiPoint', {
            type: 'geojson',
            data: chaoWeiPoint,
        })
        map.addLayer({
            id: 'chaoWeiPoint',
            type: 'circle',
            source: 'chaoWeiPoint',
            paint: {
                'circle-radius': 7,
                'circle-color': 'rgb(255, 0,0)',
            },
        })
        map.addLayer(
            {
                id: 'chaoWeiPointLable',
                type: 'symbol',
                source: 'chaoWeiPoint',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-anchor': 'top',
                    'text-offset': [0.0, 0.5],
                    'text-size': 18,
                    'text-allow-overlap': true,
                },
                paint: {
                    'text-color': 'rgb(255,255,255)',
                },
            },
            'chaoWeiPoint',
        )
        bankWarnLayer = new BankWarnLayer(defaultWarnLayerData)
        map.addLayer(bankWarnLayer, 'chaoWeiPoint')

        map.addLayer(
            {
                id: 'mzsBankLineChoosen',
                type: 'line',
                source: 'mzsBankLineSource',
                'source-layer': 'default',
                filter: profileList.value[1].filter,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': 'rgb(134, 245, 230)',
                    'line-width': 10,
                },
            },
            'chaoWeiPoint',
        )

        map.addLayer(
            {
                id: 'mzsSectionLabelLayer-important',
                type: 'symbol',
                source: 'mzsSectionLabel',
                'source-layer': 'default',
                maxzoom: 12,
                minzoom: 8,
                filter: ['==', 'label', 'MZ08海事码头'],
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [-1.0, 1.15],
                    'text-anchor': 'top',
                    'text-size': 18,
                    'text-allow-overlap': true,
                },
                paint: {
                    'text-color': 'rgb(100, 2, 125)',
                    // 'text-color': 'rgb(255, 0,0)',
                },
            },
            'chaoWeiPoint',
        )

        map.addLayer(
            {
                id: 'mzsSectionLabelLayer',
                type: 'symbol',
                source: 'mzsSectionLabel',
                'source-layer': 'default',
                maxzoom: 22,
                minzoom: 12,
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-font':['Open Sans Bold','Arial Unicode MS Bold'],
                    'text-offset': [-1.0, 1.15],
                    'text-anchor': 'top',
                    'text-size': 18,
                    'text-allow-overlap': true,
                },
                paint: {
                    'text-color': 'rgb(0, 22, 145)',
                },
            },
            'chaoWeiPoint',
        )

        // !map.getSource('mzsBankLabel') &&
        //     map.addSource('mzsBankLabel', {
        //         type: 'vector',
        //         tiles: [tileServer + '/tile/vector/mzsBankLabel/{x}/{y}/{z}'],
        //     })
        // !map.getLayer('民主沙岸段注记') &&
        //     map.addLayer({
        //         id: '民主沙岸段注记',
        //         type: 'symbol',
        //         source: 'mzsBankLabel',
        //         'source-layer': 'default',
        //         layout: {
        //             'text-field': ['get', 'label'],
        //             'text-font': [
        //                 'Open Sans Semibold',
        //                 'Arial Unicode MS Bold',
        //             ],
        //             'text-anchor': 'center',
        //             'text-size': 20
        //         },
        //         paint: {
        //             'text-color': 'rgb(28,13,106)',
        //         },
        //     })

        // map.addControl(draw)

        useMapStore().setMap(map)
    })

    getProfileTime()
    showRiskStatus.value = false
    showProfileInfo.value = false
    showProfileShape.value = false
    showProfileSlope.value = false
    showProfileErosion.value = false
    showRiskResult.value = false
    showFlowSpeed.value = false
    await ProfileLoadingProcess(
        sceneBefore,
        sceneNow,
        sceneCompareBefore,
        sceneCompareNow,
    )

    riskAreas.value = getRiskAreas('high')

    showWaterPowerFunc()
})

onUnmounted(() => {
    if (useMapStore().getMap()) {
        useMapStore().getMap().remove()
        useMapStore().destroyMap()
    }
})
</script>

<style lang="scss" scoped>
$waterOriColor: rgba(33, 100, 182, 0.6);
$waterEndColor: rgba(0, 65, 145, 0.8);

$bedOriColor: rgba(39, 145, 87, 0.6);
$bedEndColor: rgba(0, 116, 52, 0.8);

$geoOriColor: rgba(95, 21, 138, 0.6);
$geoEndColor: rgba(78, 0, 122, 0.8);

$proOriColor: rgba(228, 143, 16, 0.6);
$proEndColor: rgba(189, 114, 1, 0.6);

div.loading-container2 {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    width: 8vw;
    height: 12vh;
    background-color: rgba(255, 255, 255, 0.877);
    z-index: 5;

    :deep(.dv-loading.loading-icon) {
        position: absolute;
        top: 0vh;
        right: 0vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div.loading-message2 {
        text-align: center;
        width: 7vw;
        height: 6vh;
        font-size: calc(0.8vw + 0.4svh);
        font-weight: bold;
    }
}


div.flex-column {
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

div.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

div.risk-warn-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    overflow: hidden;

    background: rgb(51, 51, 51);

    div.hide-dom-container {
        position: absolute;
        right: 18vw;
        top: 5vh;
        width: 4vh;
        height: 4vh;
        background-color: #ffffff;
        border-radius: 50%;
        z-index: 3;
        transition: 0.5s ease-in-out;

        &.translate {
            right: 0vw;
        }

        &:hover {
            cursor: pointer;
            transform: scale(1.05);
            filter: drop-shadow(2px 2px 1px rgb(73, 182, 255));
        }
    }

    div.condition-pannel {
        position: absolute;
        right: 1vw;
        top: 5vh;
        width: 19vw;
        transition: 0.5s ease-in-out;

        &.translate {
            right: -20vw;
        }

        div.title {
            position: relative;
            width: calc(100% - 1vw);
            // height: 4vh;
            background-color: rgb(240, 248, 255);
            height: 4vh;
            line-height: 4vh;
            padding-left: 1vw;
            font-size: calc(0.7vw + 0.6vh);
            font-weight: bold;
            box-shadow: 0px 3px rgb(49, 121, 255);
            color: rgb(0, 138, 218);
            border-radius: 5px;
        }

        div.card {
            padding: 2vh 0.7vw;
            background-color: rgb(208, 236, 254);
            box-shadow:
                rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
                rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
            border-radius: 5px;
            overflow: hidden;

            span.desc {
                position: relative;
                height: 3.5vh;
                letter-spacing: 0.05vw;
                line-height: 3.5vh;
                font-family: 'Microsoft YaHei', 'sans-serif';
                font-size: calc(0.6vw + 0.5vh);
                font-weight: 700;
                color: #444;
            }
        }
    }

    div.map-container {
        width: 100vw;
        height: 92vh;
        background-color: hsl(194, 69%, 91%);
    }

    div.basic-info-container {
        position: absolute;
        z-index: 5;
        left: 0.3vw;
        top: 0.5vh;
        // width: 31.2vw;
        width: 26vw;
        height: 15vh;
        background-color: rgba(146, 190, 228, 0.5);
        backdrop-filter: blur(5px);
        border: #0a59ec 2px solid;
        border-radius: 6px;

        div.basic-info-content {
            width: 100%;
            height: 100%;
            border-radius: 16px;
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            justify-content: center;

            div.title-container {
                height: 3vh;
                line-height: 3vh;
                width: 100%;
                background-color: transparent;
                text-align: center;
                font-size: calc(0.8vw + 0.8vh);
                font-weight: bold;
                color: #003bfd;
                text-shadow:
                    #eef3ff 1px 1px,
                    #eef3ff 2px 2px,
                    #6493ff 3px 3px;
                letter-spacing: 0.4rem;
            }

            div.key-val-container {
                width: 48%;
                height: 4vh;
                display: flex;
                flex-flow: row wrap;
                // background-color: #0446a8;
                text-align: center;
                border-bottom: 2px solid rgb(0, 32, 175);

                &.right {
                    justify-content: flex-end;
                }

                div.key-text {
                    width: fit-content;
                    line-height: 3.5vh;
                    background-color: transparent;
                    font-size: calc(0.7vw + 0.6vh);
                    color: #0043fd;
                }

                div.val-text {
                    line-height: 3.5vh;
                    font-size: calc(0.7vw + 0.5vh);
                    font-weight: bold;
                    color: #1d00be;
                    // text-align: center;
                }
            }
        }
    }

    div.risk-item-title {
        position: absolute;
        top: 8vh;
        height: 2.6vh;
        line-height: 2.6vh;
        left: 0.4vw;
        z-index: 8;
        width: 26vw;
        font-weight: bold;
        font-size: calc(0.6vw + 0.8vh);
        text-shadow: #eef3ff 1px 1px;
        // box-shadow: 0px 2px rgb(0, 26, 255);
        color: #0011ff;
        text-align: center;
    }

    div.risk-item-container {
        position: absolute;
        top: 11.2vh;
        left: 0.4vw;
        height: 4.5vh;
        width: 26vw;
        // background-color: rgba(197, 211, 228, 0.6);
        // border: rgba(0, 119, 255, 0.6) 2px solid;
        border-radius: 6px;
        z-index: 20;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        // background-color: red;
        backdrop-filter: blur(8px);

        div.risk-item {
            flex: 1 1 0;
            position: relative;
            display: flex;
            margin-bottom: 0.5vh;
            margin-left: 0.5vw;
            margin-right: 0.5vw;

            @keyframes colorSlide {
                0% {
                    background-position: 0% 50%;
                }

                // 50% {
                //     background-position: 200% 50%;
                // }
                100% {
                    background-position: 300% 50%;
                }
            }

            &.active {
                div.risk-main-index {
                    &.waterpower {
                        animation: colorSlide ease-in-out 2s;
                        animation-fill-mode: forwards;
                    }

                    &.riverbed {
                        animation: colorSlide ease-in-out 2s;
                        animation-fill-mode: forwards;
                    }

                    &.bankGeology {
                        animation: colorSlide ease-in-out 2s;
                        animation-fill-mode: forwards;
                    }

                    &.outproject {
                        animation: colorSlide ease-in-out 2s;
                        animation-fill-mode: forwards;
                    }
                }
            }
        }

        div.risk-main-index {
            width: 6.8vw;
            cursor: pointer;
            position: relative;
            flex: 1 1 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            transition: 0.3s linear;

            &:hover {
                transform: scale(1.05);
                cursor: pointer;
            }

            :deep(.dv-border-box-12) {
                position: absolute;
                width: 7vw;
                height: 98%;
            }

            // background-position: 0% 50%;

            &.waterpower {
                // transition: all ease-in-out;
                background: linear-gradient(90deg,
                        rgba(33, 100, 182, 0.35),
                        // rgba(33, 100, 182, 1),
                        // rgba(0, 34, 215, 1),
                        // rgba(0, 34, 215, 1),
                        rgba(0, 34, 215, 1),
                        rgba(0, 34, 215, 1));
                background-size: 400% 100%;
                // background-color: rgba(28, 85, 156, 0.6);
            }

            &.riverbed {
                background: linear-gradient(90deg,
                        rgba(39, 145, 87, 0.35),
                        // rgba(39, 145, 87, 1),
                        // rgb(0, 121, 16, 1),
                        // rgba(0, 121, 16, 1),
                        rgba(0, 121, 16, 1),
                        rgba(0, 121, 16, 1));
                background-size: 400% 100%;
            }

            &.bankGeology {
                background: linear-gradient(90deg,
                        rgba(95, 21, 138, 0.35),
                        // rgba(95, 21, 138, 1),
                        // rgb(63, 0, 121, 1),
                        // rgba(63, 0, 121, 1),
                        rgba(63, 0, 121, 1),
                        rgba(63, 0, 121, 1));
                background-size: 400% 100%;
            }

            &.outproject {
                background: linear-gradient(90deg,
                        rgba(228, 143, 16, 0.35),
                        // rgba(228, 143, 16, 1),
                        // rgba(121, 83, 0, 1),
                        // rgba(121, 83, 0, 1),
                        rgba(121, 83, 0, 1),
                        rgba(121, 83, 0, 1));
                background-size: 400% 100%;
            }

            div.risk-item-text {
                text-align: center;
                font-size: calc(0.6vw + 0.4vh);
                color: white;
                font-family: 'Microsoft YaHei';
                font-weight: bolder;
                text-shadow:
                    #101113 2px 2px,
                    #767779 2px 2px,
                    #6493ff 3px 3px;
            }
        }
    }

    div.raster-control-block {
        position: absolute;
        top: 79vh;
        left: 52vw;
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
                background-color: rgb(165, 219, 253);
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
                    background-color: rgb(73, 90, 250);
                }

                +.slider:before {
                    transform: translateY(-1.5em);
                }
            }
        }

        .text-block {
            font-size: 20px;
            width: 3em;
            height: 5em;
            display: flex;
            justify-content: center;
            align-items: center;

            .text {
                writing-mode: vertical-lr;
                color: rgb(3, 45, 90);
                color-scheme: light;
                font-family: 'Microsoft YaHei';
                font-weight: 700;
                user-select: none;
            }
        }
    }

    div.bankLine-control-block {
        position: absolute;
        top: 79vh;
        left: 63vw;
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
                background-color: rgb(165, 219, 253);
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
                    background-color: rgb(73, 90, 250);
                }

                +.slider:before {
                    transform: translateY(-1.5em);
                }
            }
        }

        .text-block {
            font-size: 20px;
            width: 3em;
            height: 5em;
            display: flex;
            justify-content: center;
            align-items: center;

            .text {
                writing-mode: vertical-lr;
                color: rgb(3, 45, 90);
                color-scheme: light;
                font-family: 'Microsoft YaHei';
                font-weight: 700;
                user-select: none;
            }
        }
    }

    div.terrain-control-block {
        position: absolute;
        top: 79vh;
        left: 57.5vw;
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
                background-color: rgb(165, 219, 253);
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
                    background-color: rgb(73, 90, 250);
                }

                +.slider:before {
                    transform: translateY(-1.5em);
                }
            }
        }

        .text-block {
            font-size: 20px;
            width: 3em;
            height: 5em;
            display: flex;
            justify-content: center;
            align-items: center;

            .text {
                writing-mode: vertical-lr;
                color: rgb(3, 45, 90);
                color-scheme: light;
                font-family: 'Microsoft YaHei';
                font-weight: 700;
                user-select: none;
            }
        }
    }

    div.selector-container {
        position: absolute;
        top: 2vh;
        left: 1vw;
        height: 16vh;
        width: 24vw;
        border-radius: 8px;
        overflow: hidden;
        z-index: 2;

        background-color: rgba(164, 212, 255, 0.8);
        backdrop-filter: blur(8px);
        border: 1px solid #0049a8;

        div.selector-item-container {
            height: 8vh;
            width: 22vw;
            padding-left: 1vw;
            padding-right: 1vw;
            line-height: 8vh;

            font-size: calc(0.8vw + 0.4vh);
            font-weight: bold;
            display: flex;

            &.place-selector-container {
                border-bottom: 2px solid #116cf5;
            }

            &.scene-selector-container {
                padding-left: 1vw;
                padding-right: 0.5vw;
            }

            div.selector-title {
                letter-spacing: 0rem;
                width: 5, 5vw;

                &.before-scene-title {
                    margin-top: 1.4vh;
                    width: 3.5vw;
                    height: 8vh;
                    letter-spacing: 0rem;
                    line-height: 2.5vh;
                    font-size: calc(0.8vw + 0.4vh);
                }

                &.now-scene-title {
                    margin-top: 1.4vh;
                    margin-right: -1vw;
                    width: 3.5vw;
                    height: 8vh;
                    letter-spacing: 0rem;
                    line-height: 2.5vh;
                    font-size: calc(0.8vw + 0.4vh);
                }
            }

            div.confirm-button {
                position: absolute;
                height: 5vh;
                width: 2.6vw;
                left: 20.8vw;
                top: 1.82vh;
                background-color: rgb(73, 90, 250);
                z-index: 7;
                cursor: pointer;
                transition: transform 0.3s ease;

                &:hover {
                    transform: scale(1.03);
                }

                border: #82bae7 2px solid;
                border-radius: 6px;

                div.confirm-button-text {
                    position: absolute;
                    height: 5vh;
                    width: 2.4vw;
                    left: 0.07vw;
                    top: 0.5vh;
                    line-height: 2vh;
                    font-size: calc(0.6vw + 0.4vh);
                    font-weight: bold;
                    color: #fbfcfd;
                    text-align: center;
                }
            }

            div.selector-content {
                width: 10vw;
                height: 8vh;

                // background-color: #466ca7;
                :deep(.el-select) {
                    left: 1vw;
                    height: 5vh !important;
                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 2px 2px,
                        rgba(0, 119, 255, 0.6) 3px 3px;
                    border-radius: 6px;

                    &.side {
                        width: 14vw !important;

                        .el-select__wrapper {
                            height: 5vh;
                            line-height: 5vh;
                            border-radius: 6px;
                            font-family: 'Microsoft YaHei';
                            font-weight: bold;
                            font-size: calc(0.5vw + 0.8vh);
                            background-color: #e6f7ff;
                        }
                    }

                    &.before {
                        width: 7.8vw !important;

                        .el-select__wrapper {
                            height: 5vh;
                            line-height: 5vh;
                            border-radius: 6px;
                            font-family: 'Microsoft YaHei';
                            font-weight: bold;
                            font-size: calc(0.5vw + 0.4vh);
                            background-color: #e6f7ff;
                        }
                    }

                    &.now {
                        left: 1vw;
                        width: 8vw !important;

                        .el-select__wrapper {
                            height: 5vh;
                            line-height: 5vh;
                            border-radius: 6px;
                            font-family: 'Microsoft YaHei';
                            font-weight: bold;
                            font-size: calc(0.5vw + 0.4vh);
                            background-color: #e6f7ff;
                        }
                    }
                }

                :deep(.el-select__placeholder) {
                    color: #368dff;
                }

                :deep(.el-icon) {
                    width: 1vw;
                    height: 1vw;

                    svg {
                        width: 1vw;
                        height: 1vw;

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

            div.current-param-container {
                position: absolute;
                top: 8.6vh;
                left: 0.25vw;
                width: 7.5vw;
                height: 6.8vh;
                text-align: center;
                border-radius: 6px;
                overflow: hidden;
                font-weight: bold;
                border: 2px solid #1735ae;

                &.year2 {
                    left: 8.2vw;
                }

                &.year3 {
                    left: 16.2vw;
                }

                div.current-param-title {
                    height: 3vh;
                    line-height: 3vh;
                    background-color: #1753ae;
                    font-size: calc(0.6vw + 0.3vh);
                    color: #cefffd;
                }

                div.current-param-content {
                    height: 4.2vh;
                    line-height: 3.5vh;
                    background-color: #dcebf8;
                    color: #001cb8;
                    font-size: calc(0.6vw + 0.3vh);
                }
            }
        }
    }

    div.warn-status-container {
        position: absolute;
        left: 43vw;
        top: 6vh;
        width: 14vw;
        height: 10vh;

        background-color: #000cbbd5;
        backdrop-filter: blur(8px);
        z-index: 3;
        border-radius: 6px;
        text-align: center;
        overflow: hidden;

        box-shadow: 4px 6px 6px -4px rgb(0, 47, 117);

        div.warn-status-title {
            height: 4vh;
            line-height: 4vh;
            width: 14vw;
            font-size: calc(0.8vw + 0.3vh);
            font-weight: bold;
            color: #e3f9ff;
            box-shadow: 0px 2px rgb(0, 225, 255);
        }

        div.warn-status-content {
            height: 6vh;
            line-height: 6vh;
            width: 14vw;
            font-size: calc(1.1vw + 0.8vh);
            font-weight: bold;
            // background-color: #2688f8;
            color: #ebf8ff;
            text-align: cen;
            letter-spacing: 1rem;
            text-indent: 1rem;

            &.low {
                background-color: rgb(51, 33, 234);
            }

            &.low2 {
                background-color: rgb(113, 199, 0);
            }

            &.middle {
                background-color: rgb(211, 121, 60);
            }

            &.high {
                background-color: rgb(254, 15, 31);
            }
        }
    }

    div.warn-detail-container {
        position: absolute;
        left: 32.5vw;
        top: 1vh;
        width: 35vw;
        height: 3.8vh;
        border-radius: 6px;
        backdrop-filter: blur(5px);
        background-color: rgba(244, 246, 248, 0.8);
        z-index: 4;

        &.low {
            border: #0a59ec solid 3px;
        }

        &.middle {
            border: #ec820a solid 3px;
        }

        &.high {
            border: #ec250a solid 3px;
        }

        div.warn-detail-profile {
            position: absolute;
            background-color: rgba(226, 92, 30, 0.15);
            border-radius: 6px;
            width: 34.6vw;
            left: 0.2vw;
            top: 0.5vh;
            overflow: hidden;

            div.warn-detail-text {
                position: relative;
                // width: 100vw;
                width: fit-content;
                font-size: calc(0.8vw + 0.4vh);
                white-space: nowrap;
                overflow: hidden;
                font-weight: bold;
                text-shadow:
                    #b9bec9 1px 1px,
                    #d7d8dd 1px 1px,
                    #161618 1px 1px;
                animation-name: marquee;
                animation-duration: 30s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;

                span.warn-detail-span {
                    font-size: calc(0.7vw + 0.4vh);
                    text-shadow: null;
                    font-weight: 400;
                }
            }
        }

        // div.warn-detail-profile {
        //     position: absolute;
        //     line-height: 2.2vh;
        //     top: 3.5vh;
        //     left: 0.5vw;
        //     color: rgba(43, 46, 49, 0.8);
        //     font-size: calc(0.5vw + 0.4vh);
        //     font-weight: bold;
        // }
    }

    div.risk-line-container {
        position: absolute;
        left: 69vw;
        top: 82.5vh;
        width: 30vw;
        height: 6vh;
        backdrop-filter: blur(2px);
        z-index: 4;
        border: #1313d8 2px solid;
        border-radius: 6px;

        div.risk-line-title {
            position: absolute;
            top: 1vh;
            left: 0.8vw;
            font-size: calc(0.8vw + 0.6vh);
            font-weight: bold;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
        }

        div.risk-line {
            position: absolute;
            top: 1.5vh;
            left: 9vw;
            width: 20vw;
            height: 2vh;
            border-radius: 20px;
            // border:#0f1011 2px solid;
            z-index: 5;
            background-image: linear-gradient(to right,
                    rgb(17, 17, 255),
                    rgb(220, 126, 37),
                    rgb(255, 9, 9));
            box-shadow: 4px 6px 6px -4px rgb(0, 47, 117);
        }

        div.risk-line-arrow {
            position: absolute;
            top: 0.6vh;
            width: 1.4vw;
            height: 2vh;
            z-index: 11;

            &.low {
                left: 10.3vw;
            }

            &.middle {
                left: 18.3vw;
            }

            &.high {
                left: 26.5vw;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }

        div.risk-line-mark {
            position: absolute;
            top: 3.7vh;
            width: 4vw;
            height: 2vh;
            border-radius: 20px;
            z-index: 5;
            font-family: 'Microsoft YaHei';
            font-weight: bolder;
            font-size: calc(0.5vw + 0.3vh);
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #f0f1f3 1px 1px;

            &.low {
                left: 10vw;
            }

            &.middle {
                left: 18vw;
            }

            &.high {
                left: 26vw;
            }
        }
    }

    div.button-container {
        position: absolute;
        top: 88vh;
        left: 2vw;
        width: 20vw;
        height: 2vh;
        background-color: rgba(48, 49, 51, 0.6);
        backdrop-filter: blur(5px);
        border-radius: 10px;
        border: #167aec 1px solid;
        z-index: 2;
    }

    div.drag {
        position: absolute;
        cursor: grab;

        &.riskResult {
            right: 13vw;
            top: 6vh;
            width: 30vw;
            height: 33.5vh;
        }

        &.profileSlope {
            right: 13vw;
            top: 6vh;
            width: 30vw;
            height: 33.5vh;
        }
    }

    div.flow-control-block {
        position: absolute;
        top: 47vh;
        left: 20.5vw;
        height: 10vh;
        width: 5vw;
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
                background-color: rgb(165, 219, 253);
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
                    background-color: rgb(73, 90, 250);
                }

                +.slider:before {
                    transform: translateY(-1.5em);
                }
            }
        }

        .text-block {
            font-size: 20px;
            width: 1.5em;
            height: 5em;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 1vw;

            .text {
                // writing-mode: vertical-lr;
                color: rgb(0, 80, 166);
                color-scheme: light;
                font-family: 'Microsoft YaHei';
                font-weight: 700;
                user-select: none;
                border: solid calc(0.1vh + 0.1vw) rgb(82, 163, 235);
                border-radius: calc(0.1vh + 0.3vw);

                .title {
                    border-bottom: rgb(41, 40, 40) 1px solid;
                    font-weight: bold;
                    font-size: calc(0.7vw + 0.5vh);
                    line-height: 3vh;
                    width: 100%;

                    .iconn {
                        :hover {
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        div.risk-year-container {
            position: absolute;
            top: 8.5vh;
            left: 0.2vw;
            height: 6.8vh;
            width: 23.5vw;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border: rgba(0, 119, 255, 0.6) 2px solid;
            border-radius: 6px;
            z-index: 3;

            div.risk-year-title {
                position: absolute;
                top: -0.8vh;
                left: 2vw;
                color: rgb(159, 68, 187);
                text-shadow:
                    #eef3ff 1px 1px,
                    #eef3ff 2px 2px,
                    #6493ff 3px 3px;
                color-scheme: light;
                font-family: 'Microsoft YaHei';
                font-weight: bolder;
                font-size: calc(0.9vw + 0.6vh);
            }

            div.risk-year-content {
                position: absolute;
                top: -0.7vh;
                left: 14vw;
                color: rgb(24, 116, 170);
                color-scheme: light;
                font-family: 'Microsoft YaHei';
                font-weight: bolder;
                font-size: calc(1vw + 0.6vh);
            }
        }

        div.raster-legend-container {
            position: absolute;
            top: 12vh;
            left: 32.3vw;
            width: 2.9vw;
            height: 32vh;
            z-index: 2;

            img {
                width: 100%;
                height: 100%;
                margin-bottom: 10px;
                object-fit: contain;
            }
        }

        div.profile-draw-content {
            position: absolute;
            top: 2vh;
            right: 2vw;
            height: 15vh;
            width: 29vw;
            border-radius: 8px;
            background-color: rgba(164, 212, 255, 0.8);
            backdrop-filter: blur(8px);
            border: 2px solid rgb(169, 197, 226);
            z-index: 2;

            div.profile-draw-title {
                position: absolute;
                height: 4.5vh;
                width: 7vw;
                line-height: 4vh;
                border-radius: 6px;
                // background-color: rgba(235, 240, 247, 0.4);
                text-align: center;
                font-family: 'Microsoft YaHei';
                font-weight: bold;
                font-size: calc(0.7vw + 0.5vh);
                color: #0f1011;
                text-shadow:
                    #eef3ff 1px 1px,
                    #eef3ff 2px 2px,
                    #6493ff 3px 3px;
            }

            div.profile-info-container {
                position: absolute;
                top: 4vh;
                right: 0.5vw;
                width: 13vw;
                height: 10vh;
                border-radius: 6px;
                border: 2px solid #1735ae;
                z-index: 3;

                div.profile-info-item {
                    font-size: calc(0.5vw + 0.4vh);
                    color: #001cb8;
                    font-weight: bold;

                    &.title {
                        color: #0f1011;
                        font-size: calc(0.7vw + 0.5vh);
                        position: absolute;
                        left: 0.5vw;
                        top: 0.5vh;
                    }

                    &.name {
                        position: absolute;
                        left: 0.3vw;
                        top: 4vh;
                    }

                    &.risk {
                        position: absolute;
                        left: 0.3vw;
                        top: 7vh;
                    }

                    &.before {
                        color: #b3771d;
                        position: absolute;
                        left: 6.4vw;
                        top: 4vh;
                    }

                    &.now {
                        color: #b3771d;
                        position: absolute;
                        left: 6.4vw;
                        top: 7vh;
                    }
                }

                div.detail-info {
                    position: absolute;
                    left: 8.4vw;
                    top: 3vh;
                    width: 4vw;
                    height: 6vh;
                    border: 2px solid #1735ae;
                    border-radius: 6px;
                    background-color: #1753ae;
                    cursor: pointer;
                    transition: transform 0.2s ease;

                    &:hover {
                        transform: scale(1.03);
                    }

                    div.detail-info-text {
                        font-size: calc(0.7vw + 0.5vh);
                        font-weight: bold;
                        color: #cefffd;
                        position: absolute;
                        left: 0.5vw;
                        top: 0.5vh;
                    }
                }

                div.null-text {
                    font-size: calc(1vw + 0.7vh);
                    font-weight: bold;
                    position: absolute;
                    left: 2.3vw;
                    top: 4.6vh;
                    color: #001cb8;
                }
            }
        }

        div.loading-container {
            position: absolute;
            top: 9vh;
            left: 47.5vw;
            width: 6vw;
            height: 10vh;
            background-color: rgba(190, 222, 230, 0.5);
            z-index: 5;

            :deep(.dv-loading.loading-icon) {
                position: absolute;
                top: -2.5vh;
                right: 0vw;
            }

            div.loading-message {
                text-align: center;
                position: absolute;
                left: 0.5vw;
                width: 5vw;
                height: 6vh;
                top: 7.3vh;
                font-size: calc(0.6vw + 0.4svh);
                font-weight: bold;
            }
        }

        div.hydro-pannel {
            position: absolute;
            z-index: 2;
            right: 5vw;
            top: 0vh;
            width: 15vw;
            padding: calc(0.1vw + 0.1vh);
            background-color: aliceblue;
            user-select: none;
            border: solid calc(0.1vh + 0.1vw) rgb(82, 163, 235);
            border-radius: calc(0.1vh + 0.3vw);

            .title {
                border-bottom: rgb(41, 40, 40) 1px solid;
                font-weight: bold;
                font-size: calc(0.7vw + 0.5vh);
                line-height: 3vh;
                width: 100%;

                .iconn {
                    :hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }

    div.time-shower-block {
        position: absolute;
        top: 53.5vh;
        left: 18.5vw;
        z-index: 3;
        transform: scale(0.8);
    }

    @keyframes border-dance {
        0% {
            background-position:
                0 0,
                100% 100%,
                0 100%,
                100% 0;
        }

        100% {
            background-position:
                100% 0,
                0 100%,
                0 0,
                100% 100%;
        }
    }

    @keyframes marquee {
        0% {
            transform: translateX(0%);
        }

        100% {
            transform: translateX(-50%);
        }
    }

    :deep(.el-table__inner-wrapper::before) {
        background: hsl(210, 70%, 30%);
    }

    :deep(.el-table__border-left-patch) {
        background: transparent;
    }

    :deep(.el-table .el-table__cell) {
        border: 1px solid #c6e7f0;
    }

    :deep(.el-table thead th.el-table__cell) {
        color: #173eaa;
        background: rgba(238, 244, 255, 0.6);
        font-size: calc(0.6vw + 0.3vh);
        height: 2vh;

        div.cell {
            height: 2vh;
            line-height: 2vh;
        }
    }

    :deep(.el-table tbody tr) {
        transition: all 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.15);
        height: fit-content;

        div.cell {
            height: fit-content;
            line-height: 2vh;
            width: fit-content;
            font-size: calc(0.6vw + 0.2vh);
        }
    }

    :deep(.el-table tbody tr:nth-child(2n)) {
        &.even-state {
            color: hsl(209, 58%, 39%);
            background: rgb(235, 242, 255);
            font-weight: 600;
        }

        &.odd-state {
            color: rgba(230, 243, 255, 0.9);
            background: rgb(45, 87, 177);
            font-weight: 600;
        }
    }

    // :deep(.el-table__body tr:nth-child(2n):hover > td) {
    //     background: hsl(210, 70%, 32%);
    // }

    :deep(.el-table tbody tr:nth-child(2n + 1)) {
        &.even-state {
            color: rgba(230, 243, 255, 0.9);
            background: rgb(45, 87, 177);
            font-weight: 600;
        }

        &.odd-state {
            color: hsl(209, 58%, 39%);
            background: rgb(235, 242, 255);
            font-weight: 600;
        }
    }

    // :deep(.el-table__body tr:nth-child(2n + 1):hover > td) {
    //     background: hsl(210, 70%, 32%);
    // }

    :deep(.el-table tbody tr.highLight-row) {
        background: hsl(210, 70%, 16%);
        animation: shine 2.4s infinite;
    }

    :deep(.el-table tbody tr.highLight-row:hover > td) {
        cursor: pointer;
    }
}
</style>
