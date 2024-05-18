<template>
    <div class="risk-warn-container">
        <div class="map-container" id="map" ref="mapContainer"></div>
        <canvas id="GPUFrame"></canvas>
        <div class="selector-container">
            <div class="place-selector-container selector-item-container">
                <div class="place-title selector-title">岸段选择：</div>
                <button @click="test">111</button>
                <div class="place selector-content">
                    <el-select class="side" v-model="placeValue" placeholder="选择岸段" style="width: 10vw; height: 3.5vh"
                        @change="sceneSelectChange" popper-class="risk-popper">
                        <el-option v-for="item in placeList" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                            <span class="section-name-text">{{
                                item.label
                            }}</span>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="scene-selector-container selector-item-container">
                <!-- <div class="scene-title selector-title">评估情景：</div> -->
                <div class="before-scene-title selector-title">对比地形:</div>
                <div class="before-scene selector-content">
                    <el-select class="before" v-model="sceneBeforeValue" placeholder="选择专题" style="width: 10vw; height: 3.5vh"
                        @change="sceneBeforeSelectChange" popper-class="risk-popper">
                        <el-option v-for="item in sceneList" :key="item.value" :label="item.label" :value="item.value">
                            <span style="float: left" class="section-name-text">{{ item.year }}</span>
                            <span style="float: right" class="section-class-text">{{ item.time }}</span>
                        </el-option>
                        <!-- <template #footer>
                            <div class="add-select-button">新增评估情景</div>
                        </template> -->
                    </el-select>
                </div>
                <div class="now-scene-title selector-title">当前地形:</div>
                <div class="now-scene selector-content">  
                    <el-select class="now" v-model="sceneNowValue" placeholder="选择专题" style="width: 10vw; height: 3.5vh"
                        @change="sceneNowSelectChange(sceneNowValue)" popper-class="risk-popper">
                        <el-option v-for="item in sceneList" :key="item.value" :label="item.label" :value="item.value">
                            <span style="float: left" class="section-name-text">{{ item.year }}</span>
                            <span style="float: right" class="section-class-text">{{ item.time }}</span>
                        </el-option>
                        <!-- <template #footer>
                            <div class="add-select-button">新增评估情景</div>
                        </template> -->
                    </el-select>
                </div>  
            </div>
        </div>
        <div class="riskInfo-container">
            <div class="riskInfo-title">
                <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
                    断面信息展示
                </dv-border-box2>
            </div>
            <div class="riskInfo-item profileShape">
                <div class="item-title">断面形态对比：</div>
                <div class="profile-selector-container">
                    <el-select
                        v-model="profileValue"
                        placeholder="选择断面"
                        style="width: 10vw; height: 3.5vh"
                        @change="profileSelectChange"
                        popper-class="profile-popper"
                    >
                        <el-option
                            v-for="item in profileList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                            <span class="profile-name-text">
                                {{ item.label }}
                            </span>
                        </el-option>
                    </el-select>
                </div>
                <div
                    ref="shapeGraphRef"
                    class="shape graph"
                    element-loading-background="rgba(214, 235, 255,0.8)"
                ></div>
                <div class="graph-container shape">
                    <div
                        ref="shapeGraphRef"
                        class="shape graph"
                        v-loading="shapeChartLoad"
                        element-loading-background="rgba(255, 255, 255, 0.4)"
                    ></div>
                </div>
            </div>
            <div class="riskInfo-item profileErosion">
                <div class="item-title">
                    近岸冲淤：
                </div>
                <div ref="erosionGraphRef" class="erosion graph" element-loading-background="rgba(214, 235, 255,0.8)"></div>
                <div class="graph-container erosion">
                    <div
                        ref="erosionGraphRef"
                        class="erosion graph"
                        v-loading="erosionChartLoad"
                        element-loading-background="rgba(255, 255, 255, 0.4)"
                    ></div>
                </div>
            </div>
        </div>
        <riskResultVue
            v-if="showComponent"
            :profileList="profileList"
        />
        
        <flowspeedInfoVue
            v-if="showComponent"
            :profileList="profileList"
        />
        <div class="flow-control-block">
            <label class="switch">
                <input type="checkbox" :checked="showFlow" @click="flowControlHandler()" />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">流场展示</div>
            </div>
        </div>
        <div class="time-shower-block">
            <flowTimeShower :type="'exp'" :time-step="timeStep" :total-count="25"></flowTimeShower>
        </div>

        <div class="profile-draw-content">
            <div class="profile-draw-title">
                自定义断面：
            </div>
            <dv-loading class="loading-icon" v-show="isRunning">模型计算中...</dv-loading>
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
                <div class="profile-info-item title">
                    断面信息：
                </div>
                <div class="profile-info-item name"
                v-if="tempProfileName != ''">
                    断面名称：{{ tempProfileName }}
                </div>
                <div class="profile-info-item risk"
                v-if="tempProfileRisk != ''">
                    风险等级：{{ 
                        tempProfileRisk == 'low'
                            ? '低风险'
                            : tempProfileRisk == 'middle'
                                ? '中风险'
                                : '高风险'
                    }}
                </div>
                <div class="detail-info"
                v-if="tempProfileRisk != ''"
                @click="showTempProfileDetailInfo">
                    <div class="detail-info-text">
                        断面详细信息
                    </div>
                </div>
                <div class="null-text"
                v-if="tempProfileName == ''">
                    暂无断面信息
                </div>
            </div>
        </div>
        <div v-if="tempProfileDetailInfo">
            <profileInfoCard
                @close-temp-profile-detail-info="CloseTempProfileDetailInfo"
                :profileData = tempProfileData
            />
        </div>
        
        <!-- <profileInfoCard
            v-if="true"
            :profileData = tempProfileData
        /> -->
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
                    <div style="text-align: right;">
                        <el-button @click="cancelSectionRese">取消</el-button>
                        <el-button type="primary" @click="sureSectionRese">
                            确认
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
        <el-dialog
            v-model="sceneConfirmShow"
            title="切换场景确认"
            width="40vh"
        >
            <span>确认使用以下年份地形数据进行计算：</span>
            <div style="position:absolute;top:6.5vh;font-weight: bold;">
                {{ sceneBefore.name }}
            </div>
            <div style="position:absolute;top:8.5vh;font-weight: bold;">
                {{ sceneNow.name }}
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <div style="text-align: right;">
                        <el-button @click="cancelSceneRese">取消</el-button>
                        <el-button type="primary" @click="sureSceneRese">
                            确认
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
import router from '../router/index'
import { BorderBox2 as DvBorderBox2 } from '@kjgl77/datav-vue3'
import riskResultVue from '../components/bankRiskWarn/riskResult.vue'
import flowspeedInfoVue from '../components/bankRiskWarn/flowspeedInfo.vue'
import profileInfoCard from '../components/bankRiskWarn/profileInfoCard.vue'
import { drawShapeGraph, drawErosionGraph } from '../components/bankRiskWarn/util.js'
import { bankRiskWarn } from '../components/bankRiskWarn/api.js'
import flowTimeShower from '../components/bankRiskWarn/flowTimeShower.vue'
import { initScratchMap } from '../utils/mapUtils';
import SteadyFlowLayer from '../utils/m_demLayer/newFlow_mask';
// import BankWarnLayer from '../utils/m_demLayer/bankWarnLayer';
import BankWarnLayer from '../components/dataVisual/js/bankWarnLayer';
import { useMapStore } from '../store/mapStore';
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { filterFields } from 'element-plus/es/components/form/src/utils';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { convertToMercator } from '../components/bankRiskWarn/coordConvert.js'
import { rasterMM } from '../components/bankRiskWarn/rasterMM'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { connectionExists } from '@vue-flow/core';

let map = null
const mapContainer = ref()
const timeStep = ref(0)
const showFlow = ref(false)
let flowSrc = []
for (let i = 0; i < 26; i++) {
    flowSrc.push(`/scratchSomething/terrain_flow/json/uv_${i}.bin`)
}
let flow = reactive(new SteadyFlowLayer(
    '近岸流场',
    '/scratchSomething/terrain_flow/json/station.bin',
    flowSrc,
    (url) => url.match(/uv_(\d+)\.bin/)[1],
    '/scratchSomething/terrain_flow/json/ChangJiang.geojson'
))

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
const profileList = ref([
    {
        value: 1,
        label: '断面 JC01',
        name: 'JC01: 头部围堤',
        filter: ['==', 'name', 'JC01'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 2,
        label: '断面 JC02',
        name: 'JC02: 南顺堤',
        filter: ['==', 'name', 'JC02'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 3,
        label: '断面 JC03',
        name: 'JC03: 南顺堤尾部',
        filter: ['==', 'name', 'JC03'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 4,
        label: '断面 JC04',
        name: 'JC04: 江滩办事处',
        filter: ['==', 'name', 'JC04'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 5,
        label: '断面 JC05',
        name: 'JC05: 小港池',
        filter: ['==', 'name', 'JC05'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 6,
        label: '断面 JC06',
        name: 'JC06: 张靖皋桥位上游',
        filter: ['==', 'name', 'JC06'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 7,
        label: '断面 JC07',
        name: 'JC07: 张靖皋桥位下游',
        filter: ['==', 'name', 'JC07'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 8,
        label: '断面 JC08',
        name: 'JC08: 海事码头',
        filter: ['==', 'name', 'JC08'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 9,
        label: '断面 JC09',
        name: 'JC09: 海事码头下游',
        filter: ['==', 'name', 'JC09'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 10,
        label: '断面 JC10',
        name: 'JC10: 雷达站',
        filter: ['==', 'name', 'JC10'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 11,
        label: '断面 JC11',
        name: 'JC11: 民主沙尾部主路',
        filter: ['==', 'name', 'JC11'],
        flowspeed:null,
        risk: null,
    },
    {
        value: 12,
        label: '断面 JC12',
        name: 'JC12: 民主沙尾',
        filter: ['==', 'name', 'JC12'],
        flowspeed:null,
        risk: null,
    },
])
const sceneList = ref([
    {
        value: '2020before',
        name: '2020汛前地形数据',
        label: '2020汛前',
        year: '2020',
        time: '汛前',
        date: '2020-03-01',
        dateShort: '2003'
    },
    {
        value: '2020after',
        name: '2020汛后地形数据',
        label: '2020汛后',
        year: '2020',
        time: '汛后',
        date: '2020-09-01',
        dateShort: '2009'
    },
    {
        value: '2021before',
        name: '2021汛前地形数据',
        label: '2021汛前',
        year: '2021',
        time: '汛前',
        date: '2021-03-01',
        dateShort: '2103'
    },
    {
        value: '2021after',
        name: '2021汛后地形数据',
        label: '2021汛后',
        year: '2021',
        time: '汛后',
        date: '2021-09-01',
        dateShort: '2109'
    },
    {
        value: '2022before',
        name: '2022汛前地形数据',
        label: '2022汛前',
        year: '2022',
        time: '汛前',
        date: '2022-03-01',
        dateShort: '2203'
    },
    {
        value: '2022after',
        name: '2022汛后地形数据',
        label: '2022汛后',
        year: '2022',
        time: '汛后',
        date: '2022-09-01',
        dateShort: '2209'
    },
    {
        value: '2023before',
        name: '2023汛前地形数据',
        label: '2023汛前',
        year: '2023',
        time: '汛前',
        date: '2023-03-01',
        dateShort: '2303'
    },
    {
        value: '2023after',
        name: '2023汛后地形数据',
        label: '2023汛后',
        year: '2023',
        time: '汛后',
        date: '2023-09-01',
        dateShort: '2309'
    },
])

const placeValue = ref('mzs')
const placeList = [
    {value: 'mzs', label: '民主沙右缘示范段'},
    {value: 'tpz', label: '太平洲左缘示范段', disabled: true},
    {value: 'flq', label: '丰乐桥示范段', disabled: true}
]

const sceneBeforeSelectChange = () => { }

const sceneNowSelectChange = () => { }

const test = () => {
    sceneBefore = sceneList.value.find(item => item.value === sceneBeforeValue.value)
    sceneNow = sceneList.value.find(item => item.value === sceneNowValue.value)
    sceneConfirmShow.value = true
}

const cancelSceneRese = () => {
    sceneConfirmShow.value = false
}

const sureSceneRese = async() => {
    sceneConfirmShow.value = false
    if ( sceneNow.dateShort <= sceneBefore.dateShort ) {
        ElMessage.error('当前地形时间不能早于或等于对比地形时间！')
        return
    }
    if ( preSceneBeforeValue.value === sceneBeforeValue.value && preSceneNowValue.value === sceneNowValue.value ) {
        ElMessage.error('当前地形时间与对比地形时间未发生变化！')
        return
    }
    // 添加栅格图层
    const time = sceneNow.dateShort + sceneBefore.dateShort
    mapInstance.removeLayer('mapRaster')
    mapInstance.removeSource('mapRaster')
    addRasterLayer(mapInstance, time, 'mapRaster')
    mapInstance.moveLayer('mapRaster', 'mzsLine')
    // 计算各个断面数据
    const before = sceneBefore.date
    const now = sceneNow.date
    const exist = await profileDataExist(before, now)
    if (exist) {
        profileData = await getProfileData(before, now)
    } else {
        CalProfile(before, now)
        profileData = await getProfileData(before, now)
    }
    changeProfileData(profileData)
    preSceneBeforeValue.value = sceneBeforeValue.value
    preSceneNowValue.value = sceneNowValue.value
}

const CalProfile = async(before, now) => {
    const promises = [];
    for(let i = 0; i < profileList.length; i++) {
        promises.push(bankRiskWarn.runProfileModel(before, now, i))
    }
    await Promise.all(promises)
}

const profileDataExist = async(before, now) => {
    const testData = await bankRiskWarn.getProfileData(before, now, 1)
    if (testData.data.length === 0) {
        return false
    }
    return true
}

const getProfileData = async (before, now) => {
        const promises = [];
        const result = [];
        for (let i = 0; i < 12; i++) {
            promises.push(bankRiskWarn.getProfileData(before, now, i + 1));
        }
        const allResponses = await Promise.all(promises);

        // 确保每个响应都有 data 属性
        allResponses.forEach(response => {
            if (response && response.data) {
                result.push(response.data);
            } else {
                console.log(response);
            }
        });
        return result
    };

const sceneSelectChange = () => { }

const onAddOption = () => { }

const onAddProfileOption = () => { }

const onAddProfile = () => { }

const flowControlHandler = () => {
    showFlow.value = !showFlow.value
    // console.log(showFlow.value);
    if (showFlow.value) {
        let map = useMapStore().getMap()
        if (map) {
            flow.show()
            mapFlyToRiver(map)
        }
        else {
            ElMessage({
                'type': 'warning',
                'message': '地图尚未加载，请等待'
            })
        }
    } else flow.hide()

}

watch(
    () => flow.currentResourcePointer, (v) => {
    // console.log(flow.currentResourcePointer)
        timeStep.value = flow.currentResourcePointer
    }
)

// 地形对比变量
const sceneBeforeValue = ref('2022after')
const sceneNowValue = ref('2023before')
const preSceneBeforeValue = ref('2022after')
const preSceneNowValue = ref('2023before')
let sceneBefore
let sceneNow

// 断面数据变量
const showComponent = ref(false)
let profileData = []
const profileValue = ref(2)
const tempProfile = ref(null)
const tempProfileData = ref(null)
const tempProfileDetailInfo = ref(false)
const showTempProfileDetailInfo = () => {
    tempProfileDetailInfo.value = true
}
const CloseTempProfileDetailInfo = () => {
    tempProfileDetailInfo.value = false
}
// 断面图表变量
let shapeChart = null
let erosionChart = null
const shapeChartLoad = ref(true)
const erosionChartLoad = ref(true)
const shapeGraphRef = ref(null)
const erosionGraphRef = ref(null)
let section;
let beforesection;
let slopeRate;
let erosion;
const tempProfileName = ref('')
const tempProfileRisk = ref('')

const profileSelectChange = (inputValue) => {
    profileValue.value = inputValue
    changeProfileData(profileData)
    mapInstance.setFilter(
        'mzsBankLineChoosen',
        profileList.value[profileValue.value - 1].filter,
    )
}

const DrawGraph = (section, beforesection, slopeRate, erosion) => {
    shapeChart = echarts.init(shapeGraphRef.value)
    drawShapeGraph(shapeChart, section, beforesection, slopeRate)
    shapeChartLoad.value = false
    erosionChart = echarts.init(erosionGraphRef.value)
    drawErosionGraph(erosionChart, erosion)
    erosionChartLoad.value = false
}

const changeProfileData = (profileData) => {
    shapeChartLoad.value = true
    erosionChartLoad.value = true
    try {
        section = profileData[profileValue.value - 1].section.map((value) => {return value[2] < -999 ? null : value[2]}),
        beforesection = profileData[profileValue.value - 1].beforeSection.map((value) => {return value[2] < -999 ? null : value[2]})
        slopeRate = profileData[profileValue.value - 1].SA[2]
        erosion = section.map((value, index) => {
            if (value!==null && beforesection[index]!==null){
                return value-beforesection[index]
            } else { return null }})
    } catch (error) {
        DrawGraph([],[],[],[])
        return false
    }
    DrawGraph(section, beforesection, slopeRate, erosion)

    profileData.map((value, index) => {
        const riskLevel = value.risk[2]
        if (riskLevel < 0.25) {
            profileList.value[index].risk = 'low'
        } else if (riskLevel < 0.5) {
            profileList.value[index].risk = 'middle'
        } else {
            profileList.value[index].risk = 'high'
        }
        try {
            profileList.value[index].flowspeed = value.deepestPoint[2]
        } catch (error){

        }
    })
}

// 断面绘制变量
let mapInstance;
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

const sureSectionRese = async() => {
    if (tempProfileName.value === '') {
        ElMessage.error('断面名称不为空！')
        return
    } else if ( profileList.value.find(item => item.name === tempProfileName.value) ) {
        ElMessage.error('断面名称已存在！')
        return
    }
    isRunning.value = true
    sectionConfirmShow.value = false
    const before = sceneList.value.find(item => item.value == sceneBeforeValue.value).date
    const after = sceneList.value.find(item => item.value == sceneNowValue.value).date
    const taskId = await CalProfileByPoint(before, after, StartPtX, StartPtY, EndPtX, EndPtY)
    let RunStatus = ""
    for (;;) {
        try {
            RunStatus = await bankRiskWarn.getRunStatus(taskId.data)
        } catch (error) {
            console.log(error)
        }
        if (RunStatus.data == 2) {
            break;
        } else if (RunStatus.data == -1) {
            alert("模型运行结果失败")
            return
        } else if (RunStatus.data == -2) {
            alert("模型运行生成json失败")
            return
        } else if (RunStatus.data == 1) {
            // alert("模型运行中")
        }
        await wait(500);
    }
    const profileResult = await bankRiskWarn.getRunResult(taskId.data)
    putDataInList(profileResult.data)
    isRunning.value = false
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CalProfileByPoint = async(before, now, StartPtX, StartPtY, EndPtX, EndPtY) => {
    const taskId = await bankRiskWarn.runProfileModelByLine(before, now, StartPtX, StartPtY, EndPtX, EndPtY)
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
        label: tempProfileName.value,
        name: tempProfileName.value,
        filter: ['==', '$type', `${tempProfileName.value}`],
        flowspeed: profileDataItem.deepestPoint[2],
        risk: tempRisk,
    }
    tempProfileData.value = profileDataItem
}

const changeSceneBefore = (value) => {
    sceneBeforeValue.value = value
}

const changeSceneNow = (value) => {
    sceneNowValue.value = value
    
}

const addRasterLayer = (map, time, name) => {
    map.addSource( name, {
            type: 'raster',
            tiles: [
                tileServer + `/tile/raster/mzs/flood/${time}/{x}/{y}/{z}`,
            ],
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
        'paint': {
            'raster-color': [
                'interpolate', 
                ['linear'],
                ['raster-value'],
                -10-rasterMin, 'rgba(0,0,255,1)',
                0-rasterMin,'rgba(255, 255, 255, 1)',
                10-rasterMin,'rgba(255, 0, 0, 1)',
            ],
            'raster-color-mix': [(rasterMax-rasterMin), 0, 0, 0],
            'raster-opacity': 0.85,
            'raster-color-range': [-30, 30]
        }
    })
}

onMounted(async () => {
    
    initScratchMap(mapContainer.value).then((map) => {
        mapInstance = map

        map.on('draw.create', function (e) {
            console.log('aaa')
            console.log(e.features[0])
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
        mapJumpToRiver(map)
        // mapFlyToRiver(map)
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
        const jsonUrl = '/bankWarn/bankWarn.json'
        map.addLayer(new BankWarnLayer(jsonUrl))
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

        map.addLayer({
            id: 'mzsBankLineChoosen',
            type: 'line',
            source: 'mzsBankLineSource',
            'source-layer': 'default',
            filter: profileList.value[profileValue.value - 1].filter,
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgb(134, 245, 230)',
                'line-width': 6,
            },
        })
        map.addControl(draw)

        useMapStore().setMap(map)
        console.log('set map!')
        flow.particleNum.n = 2800
        flow.speedFactor.n = 1.0
        map.addLayer(flow)
        flow.hide()
    })

    profileData = await getProfileData()

    showComponent.value = true
    changeProfileData(profileData)
})

onUnmounted(() => {
    useMapStore().destroyMap()
})
</script>

<style lang="scss" scoped>
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
        background-color: antiquewhite;
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
                width: 7vw;

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

            div.selector-content {
                width: 10vw;
                height: 8vh;

                // background-color: #466ca7;
                :deep(.el-select) {  
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
        }
    }

    div.riskInfo-container {
        position: absolute;
        top: 20vh;
        left: 1vw;
        height: 70vh;
        width: 24vw;
        border-radius: 8px;
        border: #167aec 1px solid;
        background-color: rgba(179, 201, 228, 0.6);
        backdrop-filter: blur(10px);
        z-index: 2;

        div.riskInfo-title {
            height: 4.5vh;
            width: 10vw;
            margin-left: 6.5vw;
            margin-top: 0.6vh;
            line-height: 4.5vh;
            border-radius: 6px;
            // background-color: rgba(235, 240, 247, 0.4);
            text-align: center;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.8vw + 0.8vh);
            color: #0c60af;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;

            :deep(.dv-border-box-2) {
                width: 10vw;
                height: 5vh;
            }
        }

        div.riskInfo-item {
            position: absolute;
            width: 23vw;
            left: 0.5vw;
            border-radius: 6px;
            border: #3b85e7 2px solid;

            &.profileErosion {
                top: 47vh;
                height: 22vh;
                // background-color: #b6b9eb;
            }

            &.profileShape {
                top: 6.1vh;
                height: 40vh;
                // background-color: #c9cad4;
            }

            div.item-title {
                position: absolute;
                top: 0.5vh;
                left: 0.5vw;
                font-size: calc(0.8vh + 0.6vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                // color: #a231e4;
                // text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
            }

            div.profile-selector-container {
                position: absolute;
                width: 10vw;
                height: 4vh;
                left: 13vw;
                // background-color: #d1d2db;

                :deep(.el-select) {
                    left: 4vw;
                    top: 0.4vh;
                    width: 5.5vw !important;
                    height: 3vh !important;
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
                width: 22.5vw;
                top: 4vh;
                left: 0.25vw;

                &.shape {
                    height: 35vh;
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
                }
            }
        }
    }

    div.flow-control-block {
        position: absolute;
        top: 64vh;
        right: 1.5vw;
        height: 13vh;
        width: 6vw;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        z-index:3;

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
                color: rgb(0, 80, 166);
                color-scheme: light;
                font-family: 'Microsoft YaHei';
                font-weight: 700;
                user-select: none;
            }
        }
    }

    div.time-shower-block {
        position: absolute;
        top: 75vh;
        right: 3vw;
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
        z-index:2;

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

        div.current-param-container {
            position: absolute;
            top: 4vh;
            left: 0.5vw;
            width: 14vw;
            height: 10vh;
            text-align: center;
            border-radius: 6px;
            overflow: hidden;
            font-weight: bold;
            border: 2px solid #1735ae;
            
            div.current-param-title {
                height: 4vh;
                line-height: 4vh;
                background-color: #1753ae;
                font-size: calc(0.6vw + 0.6vh);
                color: #cefffd;
            }

            div.current-param-content {
                height: 6vh;
                line-height: 6vh;
                background-color: #dcebf8;
                color: #001cb8;
                font-size: calc(0.85vw + 0.6vh);

                &.two-line {
                    height: 3vh;
                    line-height: 3vh;
                    font-size: calc(0.65vw + 0.3vh);
                    // font-weight: 300;
                }
            }
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
                font-size: calc(0.6vw + 0.5vh);
                color: #0f1011;
                font-weight: bold;

                &.title {
                    font-size: calc(0.7vw + 0.5vh);
                    position: absolute;
                    left: 0.5vw;
                    top: 0.5vh
                }

                &.name {
                    color: #001cb8;
                    position: absolute;
                    left: 0.5vw;
                    top: 4vh;
                }

                &.risk {
                    color: #001cb8;
                    position: absolute;
                    left: 0.5vw;
                    top: 7vh;
                }
            }
            
            div.detail-info {
                position:absolute;
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
                font-size: calc(1.0vw + 0.7vh);
                font-weight: bold;
                position: absolute;
                left: 2.3vw;
                top: 4.6vh;
                color: #001cb8;
            }
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
:deep(.dv-loading.loading-icon) {
    position: absolute;
    top: 3.3vh;
    right: -12vw;
}
</style>
