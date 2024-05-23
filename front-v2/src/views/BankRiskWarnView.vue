<template>
    <div class="risk-warn-container">
        <div class="map-container" id="map" ref="mapContainer"></div>
        <canvas id="GPUFrame"></canvas>
        <div class="selector-container">
            <div class="place-selector-container selector-item-container">
                <div class="place-title selector-title">岸段选择：</div>
                <!-- <div class="confirm-button" @click="confirmProfileTime">
                    <div class="confirm-button-text">确认选择</div>
                </div> -->
                <div class="place selector-content">
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
                                item.label
                            }}</span>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="scene-selector-container selector-item-container">
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
                <div class="risk-year-container">
                    <div class="risk-year-title">风险评估数据时效：</div>
                    <div class="risk-year-content">2023年汛后</div>
                </div>
            </div>
        </div>

        <div class="risk-item-container">
            <div class="risk-item" :class="{ active: showWaterPower }">
                <div
                    class="risk-main-index waterpower"
                    @click="showWaterPowerFunc"
                >
                    <div class="risk-item-text">水流动力因素</div>
                </div>
                <div class="risk-sub-index-container">
                    <div class="risk-sub-index waterpower">
                        <div class="risk-item-text">造床流量当量指标</div>
                    </div>
                    <div class="risk-sub-index waterpower">
                        <div class="risk-item-text">流速指标</div>
                    </div>
                    <div class="risk-sub-index waterpower">
                        <div class="risk-item-text">水位变幅指标</div>
                    </div>
                </div>
            </div>
            <div class="risk-item" :class="{ active: showRiverBed }">
                <div class="risk-main-index riverbed" @click="showRiverBedFunc">
                    <div class="risk-item-text">河床演变因子</div>
                </div>
                <div class="risk-sub-index-container">
                    <div class="risk-sub-index riverbed">
                        <div class="risk-item-text">岸坡最大坡比</div>
                    </div>
                    <div class="risk-sub-index riverbed">
                        <div class="risk-item-text">近岸冲刷速率</div>
                    </div>
                    <div class="risk-sub-index riverbed">
                        <div class="risk-item-text">滩槽高程</div>
                    </div>
                </div>
            </div>
            <div class="risk-item" :class="{ active: showGeologyAndProject }">
                <div
                    class="risk-main-index bankGeology"
                    @click="showGeologyAndProjectFunc"
                >
                    <div class="risk-item-text">岸坡地质因子</div>
                </div>
                <div class="risk-sub-index-container">
                    <div class="risk-sub-index bankGeology">
                        <div class="risk-item-text">河岸组成粒径</div>
                    </div>
                    <div class="risk-sub-index bankGeology">
                        <div class="risk-item-text">垂向分层结构</div>
                    </div>
                </div>
            </div>
            <div class="risk-item" :class="{ active: showGeologyAndProject }">
                <div
                    class="risk-main-index outproject"
                    @click="showGeologyAndProjectFunc"
                >
                    <div class="risk-item-text">外部工程因子</div>
                </div>
                <div class="risk-sub-index-container">
                    <div class="risk-sub-index outproject">
                        <div class="risk-item-text">护岸强度</div>
                    </div>
                    <div class="risk-sub-index outproject">
                        <div class="risk-item-text">局部突加荷载</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="raster-control-block">
            <label class="switch">
                <input
                    type="checkbox"
                    :checked="showRaster"
                    @click="RasterControlHandler()"
                />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">冲淤图展示</div>
            </div>
        </div>

        <div class="risk-line-container">
            <div class="risk-line-title">风险等级图例：</div>
            <div class="risk-line"></div>
            <div class="risk-line-mark low">低风险</div>
            <div class="risk-line-mark middle">中风险</div>
            <div class="risk-line-mark high">高风险</div>
        </div>

        <div class="warn-status-container" v-if="showRiskStatus">
            <div class="warn-status-title">民主沙右缘风险评估结果</div>
            <!-- <div class="warn-status-content" :class="riskDataAll[riskDataIndex-1].value">
                {{ riskDataAll[riskDataIndex-1].label }}
            </div> -->
            <div class="warn-status-content high">高风险</div>
        </div>
        <div v-if="showRiskStatus" class="warn-detail-container high">
            <div class="warn-detail-title">高风险区域集中在：</div>
            <div class="warn-detail-profile">
                {{ getRiskAreas('high') }}
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

        <profileInfoVue
            v-if="showProfileInfo"
            @profile-value-change="changeProfileValue"
            :profileData="profileData"
            :profileList="profileList"
            :shapeChartLoad="shapeChartLoad"
            :erosionChartLoad="erosionChartLoad"
        />

        <profileShapeYearlyVue
            v-if="showYearlyProfileShape"
            @profile-value-change="changeProfileValue"
            :profileData="profileData"
            :profileList="profileList"
            :shapeYearlyChartLoad="shapeYearlyChartLoad"
        />

        <profileShapeVue
            v-if="showProfileShape"
            @profile-value-change="changeProfileValue"
            :profileData="profileData"
            :profileDataCompare="profileDataCompare"
            :profileList="profileList"
            :shapeChartLoad="shapeChartLoad"
        />

        <!-- <div class="drag profileSlope" v-if="showProfileSlope" v-draggable="{ bounds: 'body', cancel: 'div.content' }"> -->
        <profileSlopeVue
            v-if="showProfileSlope"
            @profile-value-change="changeProfileValue"
            :profileData="profileData"
            :profileList="profileList"
            :slopeChartLoad="slopeChartLoad"
        />
        <!-- </div> -->

        <profileErosionVue
            v-if="showProfileErosion"
            @profile-value-change="changeProfileValue"
            :profileData="profileData"
            :profileList="profileList"
            :slopeChartLoad="erosionChartLoad"
        />

        <div
            v-if="showBedFlowChart"
            style="
                position: absolute;
                top: 1vh;
                right: 1vw;
                width: 30.2vw;
                height: 29vh;
                z-index: 10;
            "
        >
            <bedFlowChartVue />
        </div>

        <flowspeedInfoVue
            v-if="showFlowSpeed"
            :profileList="profileList"
            :waterCondition="waterCondition"
            :flowspeedChartLoad="flowspeedChartLoad"
        />
        <div v-if="showFlowSpeed" class="flow-control-block">
            <label class="switch">
                <input
                    type="checkbox"
                    :checked="showFlow"
                    @click="flowControlHandler()"
                />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">流场展示</div>
            </div>
        </div>
        <div v-if="showFlowSpeed" class="time-shower-block">
            <flowTimeShower
                :type="'exp'"
                :time-step="timeStep"
                :total-count="25"
            ></flowTimeShower>
        </div>

        <div
            v-if="showWaterProcessChart"
            style="
                position: absolute;
                top: 62vh;
                right: 1vw;
                width: 30.2vw;
                height: 29vh;
                z-index: 10;
            "
        >
            <waterProcessChartVue />
        </div>

        <geologyAndProjectVue v-if="showGeologyAndProject" />

        <!-- <riskResultBarVue
            :riskDataIndex="riskDataIndex"
            :showRiskResult="showRiskResult"
        /> -->

        <div
            class="drag riskResult"
            v-if="showRiskResult"
            v-draggable="{ bounds: 'body', cancel: 'div.content' }"
        >
            <riskResultVue :profileList="profileList" />
        </div>

        <div class="raster-legend-container" v-if="showRaster">
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

        <el-dialog
            v-model="sectionConfirmShow"
            title="绘制断面确认"
            width="40vh"
        >
            <span>确认使用此断面进行计算</span>
            <el-input
                v-model="tempProfileName"
                style="width: 240px; margin-bottom: 10px; margin-left: 2vw"
                placeholder="请输入断面名称"
                clearable
            />
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
    </div>
</template>

<script setup>
import {
    onMounted,
    ref,
    reactive,
    watch,
    onUnmounted,
    defineAsyncComponent,
} from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
import router from '../router/index'
import { BorderBox2 as DvBorderBox2 } from '@kjgl77/datav-vue3'
import { bankRiskWarn } from '../components/bankRiskWarn/api.js'
import flowTimeShower from '../components/bankRiskWarn/flowTimeShower.vue'
import { initScratchMap } from '../utils/mapUtils'
import SteadyFlowLayer from '../utils/m_demLayer/newFlow_mask'
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
import { connectionExists } from '@vue-flow/core'
import {
    defaultWarnLayerDataInput,
    profileListInput,
    sceneListInput,
    placeList,
    InfoTree,
    waterCondition,
} from '../components/bankRiskWarn/data'
// import riskResultVue from '../components/bankRiskWarn/riskResult.vue'
// import flowspeedInfoVue from '../components/bankRiskWarn/flowspeedInfo.vue'
// import profileInfo from '../components/bankRiskWarn/profileInfo.vue'

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
const showFlow = ref(false)
const showRaster = ref(false)
const infoTreeData = ref(InfoTree)

// let flowSrc = []
// for (let i = 0; i < 26; i++) {
//     flowSrc.push(`/scratchSomething/terrain_flow/json/uv_${i}.bin`)
// }
// let flow = reactive(
//     new SteadyFlowLayer(
//         '近岸流场',
//         '/scratchSomething/terrain_flow/json/station.bin',
//         flowSrc,
//         (url) => url.match(/uv_(\d+)\.bin/)[1],
//         '/scratchSomething/terrain_flow/json/ChangJiang.geojson',
//     ),
// )
let flow = null

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.46987922676836, 32.03201616423072],
            [120.61089640208264, 32.052171362618625],
        ],
        {
            duration: 1500,
            zoom: 11.5,
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
const sceneBeforeSelectChange = () => {}

const sceneNowSelectChange = () => {}

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
    sceneCompare = sceneList.value.find(
        (item) => item.value === sceneCompareValue.value,
    )
    // tempProfileBefore.value = sceneBefore.label
    // tempProfileNow.value = sceneNow.label
    // tempProfileAfter.value = sceneAfter.label
}

const getRiskAreas = (riskLevel) => {
    let resultString = ''
    profileList.value.map((item) => {
        if (item.risk === riskLevel) {
            resultString = resultString + item.nickname + '  '
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
    ProfileLoadingProcess(sceneBefore, sceneNow, sceneCompare)
}

const changeProfileValue = (value) => {
    mapInstance.setFilter(
        'mzsBankLineChoosen',
        profileList.value[value - 1].filter,
    )
}

// 加载断面数据和图层1
const ProfileLoadingProcess = async (sceneBefore, sceneNow, sceneCompare) => {
    const before = sceneBefore.date
    const now = sceneNow.date
    const compare = sceneCompare.date
    loading_message.value = '确认计算结果是否存在...'
    isRunning.value = true
    let exist
    let existCompare
    exist = await profileDataExist(before, now)
    existCompare = await profileDataExist(compare, before)
    if (exist && existCompare) {
        loading_message.value = '地形对比数据加载中...'
        profileData.value = await getProfileData(before, now)
        profileDataCompare.value = await getProfileData(compare, before)
    } else if (exist && !existCompare) {
        loading_message.value = '地形对比结果计算中...'
        await CalProfile(compare, before)
        loading_message.value = '地形对比数据加载中...'
        profileData.value = await getProfileData(before, now)
        profileDataCompare.value = await getProfileData(compare, before)
    } else {
        loading_message.value = '地形对比结果计算中...'
        await CalProfile(before, now)
        loading_message.value = '地形对比数据加载中...'
        profileData.value = await getProfileData(before, now)
        profileDataCompare.value = await getProfileData(compare, before)
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
    for (;;) {
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
        defaultWarnLayerData[index].warnValue = value.risk[2]
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
        } catch (error) {}
    })
    let map = useMapStore().getMap()
    if (map) {
        // console.log('12312321', defaultWarnLayerData)
        // map.removeLayer('岸段预警')
        // map.addLayer(new BankWarnLayer(defaultWarnLayerData))
    }
}
const CalProfileListForShow = (profileData) => {
    profileData.map((value, index) => {
        defaultWarnLayerData[index].warnValue = value.risk[2]
        if (profileList.value[index].risk === 'low') {
            profileList.value[index].color = 'rgb(31, 110, 209)'
        } else if (profileList.value[index].risk === 'middle') {
            profileList.value[index].color = 'rgb(220, 126, 37)'
        } else {
            profileList.value[index].color = 'rgb(250, 55, 36)'
        }
        try {
            profileList.value[index].flowspeed = value.deepestPoint[2]
        } catch (error) {}
    })
    let map = useMapStore().getMap()
    if (map) {
        // console.log('12312321', defaultWarnLayerData)
        // map.removeLayer('岸段预警')
        // map.addLayer(new BankWarnLayer(defaultWarnLayerData))
    }
}

const sceneSelectChange = () => {}

const onAddOption = () => {}

const onAddProfileOption = () => {}

const onAddProfile = () => {}

const flowControlHandler = async () => {
    console.log('!!!!flow  control')
    showFlow.value = !showFlow.value
    // console.log(showFlow.value);
    if (showFlow.value) {
        let map = useMapStore().getMap()
        if (map) {
            if (map.getLayer('近岸流场')) {
                flow.show()
                // mapFlyToRiver(map)
            } else {
                let flowSrc = []
                for (let i = 0; i < 26; i++) {
                    flowSrc.push(
                        `/scratchSomething/terrain_flow/json/uv_${i}.bin`,
                    )
                }
                flow = reactive(
                    new SteadyFlowLayer(
                        '近岸流场',
                        '/scratchSomething/terrain_flow/json/station.bin',
                        flowSrc,
                        (url) => url.match(/uv_(\d+)\.bin/)[1],
                        '/scratchSomething/terrain_flow/json/ChangJiang.geojson',
                    ),
                )
                flow.particleNum.n = 2800
                flow.speedFactor.n = 1.0
                map.addLayer(flow)
                watch(
                    () => flow.currentResourcePointer,
                    (v) => {
                        // console.log(flow.currentResourcePointer)
                        timeStep.value = flow.currentResourcePointer
                    },
                )
                // mapFlyToRiver(map)
            }
        } else {
            ElMessage({
                type: 'warning',
                message: '地图尚未加载，请等待',
            })
        }
    } else {
        flow.hide()
    }
}

// watch(
//     () => flow.currentResourcePointer,
//     (v) => {
//         // console.log(flow.currentResourcePointer)
//         timeStep.value = flow.currentResourcePointer
//     },
// )

const RasterControlHandler = () => {
    if (showRaster.value) {
        mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')
    } else {
        mapInstance.setLayoutProperty('mapRaster', 'visibility', 'visible')
    }
    showRaster.value = !showRaster.value
}

// 地形对比变量
const sceneBeforeValue = ref('2019before')
const sceneNowValue = ref('2023before1')
const sceneCompareValue = ref('2012after')
const preSceneBeforeValue = ref('2019before')
const preSceneNowValue = ref('2023before1')
const preSceneCompareValue = ref('2012after')
let sceneBefore
let sceneNow
let sceneCompare

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
    await flowControlHandler()
}

// 展示水动力因素指标，包括:
// 当前年份断面（探槽高差+坡比文字）+三年图+近岸冲刷速率值
const showWaterPower = ref(false)
const showWaterPowerFunc = async () => {
    console.log('213123213', curActiveIndex.value)

    if (showRiverBed.value === true) {
        showRiverBedFunc()
    } else if (showGeologyAndProject.value === true) {
        showGeologyAndProjectFunc()
    }
    showWaterPower.value = !showWaterPower.value
    showBedFlowChartFunc()
    showWaterProcessChartFunc()
    await showFlowSpeedFunc()
}

const showRiverBed = ref(false)
const showRiverBedFunc = () => {
    if (showWaterPower.value === true) {
        showWaterPowerFunc()
    } else if (showGeologyAndProject.value === true) {
        showGeologyAndProjectFunc()
    }

    showRiverBed.value = !showRiverBed.value
    if (
        (showRaster.value === false && showProfileShape.value === true) ||
        (showRaster.value === true && showProfileShape.value === false)
    ) {
        showProfileShapeFunc()
        showYearlyProfileShapeFunc()
        return
    }
    showProfileShapeFunc()
    showYearlyProfileShapeFunc()
    RasterControlHandler()
}

const showGeologyAndProject = ref(false)
const showGeologyAndProjectFunc = () => {
    if (showWaterPower.value === true) {
        showWaterPowerFunc()
    } else if (showRiverBed.value === true) {
        showRiverBedFunc()
    }

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
    for (;;) {
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
    map.addLayer({
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
            'line-color': [
                'match',
                ['get', 'name'],
                'JC01',
                `${profileList.value[0].color}`,
                'JC02',
                `${profileList.value[1].color}`,
                'JC03',
                `${profileList.value[2].color}`,
                'JC04',
                `${profileList.value[3].color}`,
                'JC05',
                `${profileList.value[4].color}`,
                'JC06',
                `${profileList.value[5].color}`,
                'JC07',
                `${profileList.value[6].color}`,
                'JC08',
                `${profileList.value[7].color}`,
                'JC09',
                `${profileList.value[8].color}`,
                'JC10',
                `${profileList.value[9].color}`,
                'JC11',
                `${profileList.value[10].color}`,
                'JC12',
                `${profileList.value[11].color}`,
                'rgb(255, 255, 255)',
            ],
            'line-width': 3,
        },
    })
}

onMounted(async () => {
    await initScratchMap(mapContainer.value).then((map) => {
        mapInstance = map
        map.on('draw.create', function (e) {
            sectionConfirmShow.value = true
            let lineFeature = e.features[0]
            sectionLineLabel.value =
                lineFeature.geometry.coordinates[0][0].toFixed(6) +
                ',' +
                lineFeature.geometry.coordinates[0][1].toFixed(6)
            sectionLineLabelSec.value =
                lineFeature.geometry.coordinates[1][0].toFixed(6) +
                ',' +
                lineFeature.geometry.coordinates[1][1].toFixed(6)
            let startWebMerCoord = convertToMercator(
                lineFeature.geometry.coordinates[0],
            )
            let endWebMerCoord = convertToMercator(
                lineFeature.geometry.coordinates[1],
            )
            StartPtX = startWebMerCoord[0]
            StartPtY = startWebMerCoord[1]
            EndPtX = endWebMerCoord[0]
            EndPtY = endWebMerCoord[1]
            return
        })

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
        addRasterLayer(map, 23032209, 'mapRaster')
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
        // map.addLayer({
        //     id: 'mzsLabel',
        //     type: 'symbol',
        //     source: 'mzsPlaceLabelSource',
        //     'source-layer': 'default',
        //     layout: {
        //         'text-field': ['get', 'label'],
        //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        //         // 'text-offset': [0, 1.25],
        //         'text-anchor': 'left',
        //     },
        //     paint: {
        //         'text-color': 'rgba(31, 14, 126, 0.75)',
        //     },
        // })
        map.addLayer({
            id: 'dockArea',
            type: 'fill',
            source: 'dockAreaSource',
            'source-layer': 'default',
            paint: {
                'fill-color': '#18b915',
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
        map.addLayer(new BankWarnLayer(defaultWarnLayerData))
        map.addLayer({
            id: 'mzsBankLine',
            type: 'line',
            source: 'mzsBankLineSource',
            'source-layer': 'default',
            filter: ['all'],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(31, 14, 223, 0.5)',
                'line-width': 4,
            },
        })
        map.on('click', ['mzsBankLine'], (e) => {
            console.log(e.features[0])
        })

        map.addSource('mzsSectionLabel', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/center/mzsBankLine/{x}/{y}/{z}'],
        })
        map.addLayer({
            id: '点2',
            type: 'symbol',
            source: 'mzsSectionLabel',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-font':['Open Sans Bold','Arial Unicode MS Bold'],
                'text-offset': [-1.0, 1.15],
                'text-anchor': 'top',
                'text-size': 16,
                'text-allow-overlap': true,
            },
            paint: {
                'text-color': 'rgb(0, 22, 145)',
            },
        })

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

        map.addLayer({
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
        })

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
    await ProfileLoadingProcess(sceneBefore, sceneNow, sceneCompare)
})

onUnmounted(() => {
    useMapStore().getMap().remove()
    useMapStore().destroyMap()
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

div.risk-warn-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    overflow: hidden;

    background: rgb(51, 51, 51);

    div.map-container {
        width: 100vw;
        height: 92vh;
        background-color: hsl(194, 69%, 91%);
    }

    canvas#GPUFrame {
        position: absolute;
        top: 0;
        width: 100vw;
        height: 92vh;
        z-index: 1;
        pointer-events: none;
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
        left: 36vw;
        top: 80vh;
        width: 10vw;
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
                background-color: rgb(17, 17, 255);
            }

            &.middle {
                background-color: rgb(220, 126, 37);
            }

            &.high {
                background-color: rgb(255, 9, 9);
            }
        }
    }

    div.warn-detail-container {
        position: absolute;
        left: 47vw;
        top: 80.3vh;
        width: 20vw;
        height: 9vh;
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

        div.warn-detail-title {
            position: absolute;
            left: 0.5vw;
            top: 0.5vh;
            font-size: calc(0.7vw + 0.4vh);
            font-weight: bold;
            text-shadow:
                #b9bec9 1px 1px,
                #d7d8dd 1px 1px,
                #161618 1px 1px;
        }

        div.warn-detail-profile {
            position: absolute;
            line-height: 2.2vh;
            top: 3.5vh;
            left: 0.5vw;
            color: rgba(43, 46, 49, 0.8);
            font-size: calc(0.5vw + 0.4vh);
            font-weight: bold;
        }
    }

    div.risk-line-container {
        position: absolute;
        left: 35vw;
        top: 2vh;
        width: 30vw;
        height: 5vh;
        backdrop-filter: blur(2px);
        z-index: 4;
        border: #1313d8 2px solid;
        border-radius: 6px;

        div.risk-line-title {
            position: absolute;
            top: 0.9vh;
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
            top: 1vh;
            left: 9vw;
            width: 20vw;
            height: 2vh;
            border-radius: 20px;
            // border:#0f1011 2px solid;
            z-index: 5;
            background-image: linear-gradient(
                to right,
                rgb(17, 17, 255),
                rgb(220, 126, 37),
                rgb(255, 9, 9)
            );
            box-shadow: 4px 6px 6px -4px rgb(0, 47, 117);
        }

        div.risk-line-mark {
            position: absolute;
            top: 3.2vh;
            width: 20vw;
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
        top: 39vh;
        right: 3vw;
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
                + .slider {
                    background-color: rgb(73, 90, 250);
                }

                + .slider:before {
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
                color: rgb(0, 80, 166);
                color-scheme: light;
                font-family: 'Microsoft YaHei';
                font-weight: 700;
                user-select: none;
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

    div.risk-item-container {
        position: absolute;
        top: 20vh;
        left: 1vw;
        height: 67vh;
        width: 23.9vw;
        background-color: rgba(197, 211, 228, 0.6);
        border: rgba(0, 119, 255, 0.6) 2px solid;
        border-radius: 6px;
        z-index: 3;
        display: flex;
        flex-direction: column;
        backdrop-filter: blur(8px);

        div.risk-item {
            flex: 1 1 0;
            position: relative;
            display: flex;

            div.risk-sub-index-container {
                flex: 1 1 0;
                display: flex;
                flex-direction: column;

                div.risk-sub-index {
                    flex: 1 1 0;
                    transition: transform 0.3s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &.waterpower {
                        background-color: rgba(33, 100, 182, 0.2);
                    }

                    &.waterpower:nth-child(2n + 1) {
                        background-color: rgba(33, 100, 182, 0.3);
                    }

                    &.riverbed {
                        background-color: rgba(45, 165, 99, 0.2);
                    }

                    &.riverbed:nth-child(2n + 1) {
                        background-color: rgba(45, 165, 99, 0.3);
                    }

                    &.bankGeology {
                        background-color: rgba(107, 24, 155, 0.2);
                    }

                    &.bankGeology:nth-child(2n + 1) {
                        background-color: rgba(107, 24, 155, 0.3);
                    }

                    &.outproject {
                        background-color: rgba(245, 155, 20, 0.2);
                    }

                    &.outproject:nth-child(2n + 1) {
                        background-color: rgba(245, 155, 20, 0.3);
                    }

                    div.risk-item-text {
                        position: relative;
                        text-align: center;
                        font-size: calc(0.6vw + 0.6vh);
                        color: white;
                        font-family: 'Microsoft YaHei';
                        font-weight: bolder;
                        text-shadow: #101113 2px 2px;
                        // #767779 2px 2px,
                        // #6493ff 3px 3px;
                    }
                }
            }

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

                div.risk-sub-index-container {
                    div.risk-sub-index {
                        &.waterpower {
                            background-color: rgb(15, 116, 199);
                        }

                        &.waterpower:nth-child(2n + 1) {
                            background-color: rgb(0, 85, 189);
                        }

                        &.riverbed {
                            background-color: rgb(22, 153, 81);
                        }
                        &.riverbed:nth-child(2n + 1) {
                            background-color: rgb(0, 177, 80);
                        }

                        &.bankGeology {
                            background-color: rgb(108, 1, 170);
                        }

                        &.bankGeology:nth-child(2n + 1) {
                            background-color: rgb(148, 42, 209);
                        }

                        &.outproject {
                            background-color: rgb(182, 117, 20);
                        }
                        &.outproject:nth-child(2n + 1) {
                            background-color: rgb(219, 132, 0);
                        }
                    }
                }
            }
        }

        div.risk-main-index {
            width: 8vw;
            cursor: pointer;
            position: relative;
            flex: 1 1 0;
            display: flex;
            align-items: center;
            justify-content: center;

            // &:hover {
            //     transform: scale(1.03);
            // }

            // background-position: 0% 50%;

            &.waterpower {
                // transition: all ease-in-out;
                background: linear-gradient(
                    90deg,
                    rgba(33, 100, 182, 0.4),
                    // rgba(33, 100, 182, 0.6),
                    // rgba(0, 34, 215, 1),
                    // rgba(0, 34, 215, 1),
                    rgba(0, 34, 215, 1),
                    rgba(0, 34, 215, 1)
                );
                background-size: 400% 100%;
                // background-color: rgba(28, 85, 156, 0.6);
            }

            &.riverbed {
                background: linear-gradient(
                    90deg,
                    rgba(39, 145, 87, 0.4),
                    // rgba(39, 145, 87, 0.6),
                    // rgb(0, 121, 16, 1),
                    // rgba(0, 121, 16, 1),
                    rgba(0, 121, 16, 1),
                    rgba(0, 121, 16, 1)
                );
                background-size: 400% 100%;
            }

            &.bankGeology {
                background: linear-gradient(
                    90deg,
                    rgba(95, 21, 138, 0.4),
                    // rgba(95, 21, 138, 0.6),
                    // rgb(63, 0, 121, 1),
                    // rgba(63, 0, 121, 1),
                    rgba(63, 0, 121, 1),
                    rgba(63, 0, 121, 1)
                );
                background-size: 400% 100%;
            }

            &.outproject {
                background: linear-gradient(
                    90deg,
                    rgba(228, 143, 16, 0.4),
                    // rgba(228, 143, 16, 0.6),
                    // rgba(121, 83, 0, 1),
                    // rgba(121, 83, 0, 1),
                    rgba(121, 83, 0, 1),
                    rgba(121, 83, 0, 1)
                );
                background-size: 400% 100%;
            }

            div.risk-item-text {
                text-align: center;
                font-size: calc(0.6vw + 1.2vh);
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
        top: 0vh;
        left: 26vw;
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
                + .slider {
                    background-color: rgb(73, 90, 250);
                }

                + .slider:before {
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

    div.time-shower-block {
        position: absolute;
        top: 49.5vh;
        right: 4.4vw;
    }

    div.raster-legend-container {
        position: absolute;
        top: 12vh;
        left: 27vw;
        width: 2.9vw;
        height: 32vh;

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
</style>
