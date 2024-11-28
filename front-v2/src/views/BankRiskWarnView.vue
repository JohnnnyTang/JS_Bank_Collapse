<template>
    <div class="risk-warn-container">
        <div class="map-container" id="map" ref="mapContainer"></div>

        <div class="basic-info-container">
            <div class="basic-info-content">
                <div class="title-container">{{ bankBCInfo.name }}示范段</div>
                <div class="key-val-container">
                    <div class="key-text">预警级别：</div>
                    <div class="val-text">{{ bankBCInfo.riskLevel }}</div>
                </div>
                <div class="key-val-container right">
                    <div class="key-text">岸段长度：</div>
                    <div class="val-text">全长{{ bankBCInfo.monitorLength }}</div>
                </div>
            </div>
        </div>
        <!-- //////////////////////////////////////////////////////////////////////////////////////////////// -->
        <div class="risk-factor-container">
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
            </div>
        </div>
        <!-- //////////////////////////////////////////////////////////////////////////////////////////////// -->
        <div class="raster-control-block" v-if="showControls">
            <label class="switch">
                <input type="checkbox" :checked="showRaster" @click.prevent="RasterControlHandler()" />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">冲淤图展示</div>
            </div>
        </div>

        <div class="bankLine-control-block" v-if="showControls">
            <label class="switch">
                <input type="checkbox" :checked="showBankLine" @click.prevent="BankLineControlHandler()" />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">岸段展示</div>
            </div>
        </div>

        <div class="terrain-control-block" v-if="showControls">
            <label class="switch">
                <input type="checkbox" :checked="showTerrain" @click.prevent="TerrainControlHandler()" />
                <span class="slider"></span>
            </label>
            <div class="text-block">
                <div class="text">三维地形</div>
            </div>
        </div>

        <div class="risk-line-container">
            <div class="risk-line-title">风险等级图例：</div>
            <div class="risk-line"></div>

            <div class="risk-line-arrow" :class="styleMap[totalResult.desc]">
                <img src="/down_triangle.png" alt="图例标记" />
            </div>
            <div class="risk-line-mark low">低风险</div>
            <div class="risk-line-mark middle">中风险</div>
            <div class="risk-line-mark high">高风险</div>
        </div>

        <div class="warn-status-container">
            <div class="warn-status-title">风险评估结果</div>

            <div class="warn-status-content" :class="styleMap[totalResult.desc]">{{ totalResult.desc }}</div>
        </div>
        <div class="warn-detail-container" :class="styleMap[totalResult.desc]">
            <div class="warn-detail-profile">
                <div class="warn-detail-text">
                    <span class="warn-detail-span"> </span>
                    {{ totalResult.desc }}区域 :
                    <span class="warn-detail-span">{{
                        riskAreas.length === 0 ? '暂无' : riskAreas
                    }}</span>
                </div>
            </div>
        </div>

        <profileShapeVue v-if="showRiverBed" :now-d-e-ms="nowDEM" />


        <div v-if="showWaterPower" style="
                position: absolute;
                top: 16.25vh;
                left: 0.3vw;
                width: 26vw;
                height: 23.5vh;
                z-index: 10;
            ">
            <bedFlowChartVue />
        </div>

        <div v-if="showWaterPower">
            <flowspeedInfoVue :status="hydrodynamicCalcDone && !isRunningMan" :flowspeedChartLoad="flowspeedChartLoad"
                :time-step="timeStep" @handleDrawEvent="drawHandler" ref="flowspeedInfoRef" />
            <div class="flow-control-block">
                <label class="switch" style="transform: rotateZ(90deg)">
                    <input type="checkbox" :checked="showFlow" @click.prevent="flowControlHandler()" />
                    <span class="slider"></span>
                </label>
                <div class="text-block">
                    <div class="text">流场展示</div>
                </div>
            </div>
            <div class="time-shower-block">
                <flowTimeShower :type="'exp'" :time-step="timeStep" :total-count="25"></flowTimeShower>
            </div>
        </div>

        <waterProcessChartVue v-if="showWaterPower" :waterProcessChartLoad="flowspeedChartLoad" :timeStep="timeStep"
            ref="WaterProcessChartRef" />

        <geologyAndProjectVue v-if="showGeologyAndProject" />


        <div class="hide-dom-container" :class="{ translate: !conditionPannelShow }" @click="hideDomClickHandler()">
            <HideDomButtom :direction="conditionPannelShow ? 'right' : 'left'"></HideDomButtom>
        </div>
        <div class="condition-pannel flex-column" :class="{ translate: !conditionPannelShow }">
            <div class="title" style="text-align: center">综合研判条件配置</div>
            <div class="card flex-column">
                <div class="flex-row" style="justify-content: space-between; align-items: center;">
                    <div class="flex-row" style="margin-right: .5vw">
                        <span class="desc">流量:</span>
                        <el-input v-model="conditionConfigureData.flow" type="number" :step="1" class="no-arrow"
                            style="width: 3.5vw; height: 3.5vh" placeholder="请输入" />
                        <span style="
                                height: 3.5vh;
                                line-height: 3.5vh;
                                margin-left: 0.2vw;
                            ">m³/s</span>
                    </div>
                    <div class="flex-row">
                        <span class="desc">潮差:</span>
                        <el-input v-model="conditionConfigureData.tideDif" type="number" :step="0.1" class="no-arrow"
                            style="width: 2.1vw; height: 3.5vh" placeholder="请输入" />
                        <span style="
                                height: 3.5vh;
                                line-height: 3.5vh;
                                margin-left: 0.2vw;
                            ">m</span>
                    </div>
                    <el-button type="primary" style="
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
                                style="width: 7vw; height: 3.5vh" value-key="name">
                                <el-option v-for="(
                                  item, index
                              ) in demResources" :key="index" :value="item" :label="item.name + '地形'">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="flex-row">
                            <span class="desc">判别计算地形：</span>
                            <el-select v-model="conditionConfigureData.benchDEM" placeholder="请选择地形"
                                style="width: 7vw; height: 3.5vh" value-key="name">
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
import {
    onMounted, ref, reactive, watch, onUnmounted, defineAsyncComponent, computed, toRaw, nextTick
} from 'vue'
import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
import 'mapbox-gl/dist/mapbox-gl.css'
import flowTimeShower from '../components/bankRiskWarn/flowTimeShower.vue'
import { addBankLayer, initPureScratchMap, refreshMap } from '../utils/mapUtils'
import FlowFieldLayer from '../utils/WebGL/flowFieldLayer'
import TerrainLayer from '../utils/WebGL/terrainLayer'
import BankWarnLayer from '../components/dataVisual/js/bankWarnLayer'
import { useMapStore } from '../store/mapStore'
import { ElMessage, ElNotification, dayjs } from 'element-plus'
import axios from 'axios'
import { rasterMM } from '../components/bankRiskWarn/rasterMM'
import HideDomButtom from '../components/bankTwin/HideDomButtom.vue'
import {
    defaultWarnLayerDataInput,
    profileListInput,
} from '../components/bankRiskWarn/data'
import BankResourceHelper from '../components/modelStore/views/bankResourceHelper';
import { runRiskLevelForAll, riskWarnResultParse } from '../components/bankRiskWarn/runRiskLevelForAll'
import { getRealTimeFlowAndLevelData } from '../api/realtimeWaterCondition';
import { useBankNameStore } from '../store/bankNameStore'
import BackEndRequest from '../api/backend'
import ModelRunner from '../components/modelStore/modelRunner'
import flowspeedInfoVue from '../components/bankRiskWarn/flowspeedInfo.vue'
import profileShapeVue from '../components/bankRiskWarn/profileShapeCompare.vue'
import bedFlowChartVue from '../components/bankRiskWarn/BedFlowChart.vue'
import waterProcessChartVue from '../components/bankRiskWarn/WaterProcessChart.vue'
import geologyAndProjectVue from '../components/bankRiskWarn/GeologyAndProject.vue'

const tileServer = `http://${window.location.host}${import.meta.env.VITE_MAP_TILE_SERVER}`
const route = useRoute()

const loading_message = ref('自定义断面信息计算中...')
const mapContainer = ref()
const timeStep = ref(0)
const conditionPannelShow = ref(true)
const hideDomClickHandler = () => {
    conditionPannelShow.value = !conditionPannelShow.value
}

const showFlow = ref(false)
const showRaster = ref(false)
const showBankLine = ref(true)
const showTerrain = ref(false)

const flowspeedInfoRef = ref();
const WaterProcessChartRef = ref();
const tideLevelPointPos = ref([120.522864, 32.035502])

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return;
    mapIns.fitBounds(
        [
            [118.40770531586725, 31.015473926104463],
            [122.06874017956159, 32.73217294711945],
        ],
        { pitch: 0, duration: 3000 }
    );
};
const mapFlyToMzs = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.43987922676836, 32.03201616423072],
            [120.59089640208264, 32.052171362618625],
        ],
        {
            duration: 3000,
            // zoom: 11.5,
        },
    )
}

/////////////// 初始岸段资源获取
const nowDEM = computed(() => {
    return [
        conditionConfigureData.refDEM,
        conditionConfigureData.benchDEM,
    ]
})
const demResources = ref([])
const getDemResource = async (bankEnName) => {
    const _bankEnName = bankEnName
    const _demData = (await BankResourceHelper.getBankCalculateResourceList('DEM', _bankEnName)).data
    return BankResourceHelper.DEMResourcetoList(_demData)
}
const bankBCInfo = ref({
    name: '',
    riskLevel: '',
    monitorLength: '7km',
})

// totalResult
const styleMap = {
    '低风险': 'low',
    '中风险': 'middle',
    '高风险': 'high',
    '暂无': 'none',
}
const totalResult = reactive({
    desc: '暂无'
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

    try {
        const realTimeCond = await getRealTimeFlowAndLevelData()

        conditionConfigureData.flow = realTimeCond.flow
        conditionConfigureData.tideDif = realTimeCond.level
        ElNotification.success({
            'offset': 300,
            'position': 'top-right',
            'message': `获取实时水文条件,${dayjs().format('YYYY-MM-DD hh:mm')}`
        })

    } catch (e) {
        ElNotification.error({
            'offset': 300,
            'position': 'top-right',
            'message': `获取实时水文条件失败`
        })
    }



}



let bankWarnLayer = null
const isRunningMan = ref(false)
const RunningManSays = ref('')
const conditionConfigureDataResetHandler = async () => {
    console.log(window.location.pathname)


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
                offset: 260,
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

    const benchID = conditionConfigureData.refDEM.path
    const refID = conditionConfigureData.benchDEM.path
    if (benchID === refID) {
        ElMessage({
            type: "error",
            message: "冲淤起算地形与判别计算地形不能相同！",
            offset: 260
        })
        return;
    }


    isRunningMan.value = true
    RunningManSays.value = '模型正在运行，请稍候...'
    console.log('reset condition data!', conditionConfigureData)

    try {
        let result = await runHydrodynamicModel();
    } catch (error) {
        // isRunningMan.value = false;
        // RunningManSays.value = ''
        // return
    }

    ///////////////////////  Run  /////////////////////// 
    isRunningMan.value = true
    RunningManSays.value = '正在计算岸段风险，请稍候...'
    runRiskLevelForAll({
        waterQS: parseFloat(conditionConfigureData.flow),
        tidalLevel: parseFloat(conditionConfigureData.tideDif),
        refDEM: conditionConfigureData.refDEM,
        benchDEM: conditionConfigureData.benchDEM,
    }, {}, {
        bankEnName: useBankNameStore().globalBankName,
        setName: 'standard'
    }).then(async (result) => {
        if (result === null) {
            console.log('runRiskLevelForAll result is null')
            ElMessage({
                type: 'error',
                message: '模型运行失败',
                offset: 300
            })
            isRunningMan.value = false
            RunningManSays.value = ''
            return
        }


        ///////////////////// result ////////////////////////
        // 更新风险条带
        BankResourceHelper.getBankSectionGeometry(useBankNameStore().globalBankName, "short").then(res => {

            const shortSectionFeatures = res.data
            const { warnLayerData, riskAreassss, finalResult } = riskWarnResultParse(result, shortSectionFeatures)

            totalResult.desc = finalResult
            riskAreas.value = riskAreassss.join('; ')
            let map = useMapStore().getMap()
            if (bankWarnLayer && map) {
                bankWarnLayer.update(warnLayerData)
                map.setLayoutProperty('岸段预警', 'visibility', 'visible')
                map.triggerRepaint()
            }
            ElNotification({
                title: '模型计算成功',
                offset: 300,
                type: 'success',
            })

            tidePointVelocityCalc(tideLevelPointPos.value[0], tideLevelPointPos.value[1]);
        })




    }).catch((error) => {
        isRunningMan.value = false
        return
    })

}
















// 数据
let defaultWarnLayerData = defaultWarnLayerDataInput




const RasterControlHandler = () => {
    setTimeout(() => {
        if (showRaster.value) {
            mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')
        } else {
            mapInstance.setLayoutProperty('mapRaster', 'visibility', 'visible')
        }
        showRaster.value = !showRaster.value
    }, 1)

}

const BankLineControlHandler = () => {
    setTimeout(() => {
        if (showBankLine.value) {
            mapInstance.setLayoutProperty('岸段预警', 'visibility', 'none')
        } else {
            mapInstance.setLayoutProperty('岸段预警', 'visibility', 'visible')
        }
        showBankLine.value = !showBankLine.value
    }, 1);
}

const TerrainControlHandler = () => {
    setTimeout(() => {
        showTerrain.value
            ? mapInstance.setLayoutProperty('TerrainLayer', 'visibility', 'none')
            : mapInstance.setLayoutProperty('TerrainLayer', 'visibility', 'visible')
        showTerrain.value = !showTerrain.value
    }, 1);
}





const showControls = ref(false)

const showWaterPower = ref(false)
const showWaterPowerFunc = async () => {
    if (showRiverBed.value === true) {
        showRiverBedFunc()
    } else if (showGeologyAndProject.value === true) {
        showGeologyAndProjectFunc()
    }
    
    timeStep.value = 0
    // await flowControlHandler()
    mapInstance.getLayer('mapRaster') && mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')        //TODO:??

    showWaterPower.value = !showWaterPower.value
}

const showRiverBed = ref(false)
const showRiverBedFunc = () => {
    if (showWaterPower.value === true) {
        showWaterPowerFunc()
        conditionPannelShow.value = false
    } else if (showGeologyAndProject.value === true) {
        showGeologyAndProjectFunc()
    }

    showRiverBed.value = !showRiverBed.value
}

const showGeologyAndProject = ref(false)
const showGeologyAndProjectFunc = () => {
    if (showWaterPower.value === true) {
        showWaterPowerFunc()
        conditionPannelShow.value = false
    } else if (showRiverBed.value === true) {
        showRiverBedFunc()
    }
    mapInstance.setLayoutProperty('mapRaster', 'visibility', 'none')
    showGeologyAndProject.value = !showGeologyAndProject.value
}

const riskAreas = ref([])


const flowspeedChartLoad = ref(true)


// 断面绘制变量
let mapInstance


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


const runHydrodynamicModel = async () => {
    return new Promise(async (resolve, reject) => {
        let modelPostUrl = ''
        let modelParams = {}
        modelPostUrl = '/model/taskNode/start/numeric/hydrodynamic'
        modelParams = {
            "water-qs": parseFloat(conditionConfigureData.flow),
            "tidal-level": parseFloat(conditionConfigureData.tideDif),
            "segment": useBankNameStore().globalBankName,
            // segment: 'Mzs', // 后端流场纹理资源生产有问题，这里用Mzs的资源  2024-11-25
            "set": "standard",
            "year": "2023",
        }

        try {
            const TASK_ID = (await axios.post(modelPostUrl, modelParams)).data
            console.log('TASK_ID ', TASK_ID)

            if (TASK_ID === 'WRONG') {
                throw new Error()
            }

            let runningStatusInterval = (function loop() {
                return setTimeout(async () => {
                    let runningStatus = (await axios.get('/model/taskNode/status/id?taskId=' + TASK_ID)).data;

                    if (runningStatus === 'LOCK' || runningStatus === 'UNLOCK' || runningStatus === 'RUNNING') {
                        console.log('runningStatus ', runningStatus);
                    }
                    else if (runningStatus === 'ERROR') {
                        const url = `/model/taskNode/result/id?taskId=${TASK_ID}`;
                        axios.get(url).then(response => {
                            let errorLog = response.data['error-log'];
                            resolve(errorLog);
                        }).catch(error => {
                            console.warn(error);
                            reject(error);
                        });
                        const errorLog = (await axios.get(url)).data['error-log'];

                        // clearTimeout(runningStatusInterval);
                        reject(new Error(errorLog));
                    }
                    else if (runningStatus === 'COMPLETE') {
                        console.log('COMPLETE and Clear ');
                        // clearTimeout(runningStatusInterval);

                        let runningResult = (await axios.get('/model/taskNode/result/id?taskId=' + TASK_ID)).data;
                        hydrodynamicCaseID = runningResult['case-id'];
                        hydrodynamicRunningResult = runningResult;
                        hydrodynamicCalcDone.value = true;
                        console.log('水动力模型计算完成！', hydrodynamicRunningResult);

                        // 更新流场
                        showFlow.value = true;
                        flowControl(showFlow.value)
                        resolve(runningResult);
                        return;
                    }
                    loop(); // 如果任务未完成，再次调用loop函数，相当于继续循环等待下一次检查
                }, 500);
            })();

        } catch (error) {
            console.log(error)
            // ElNotification({
            // title: '水动力模型运行失败',
            // offset: 300,
            // type: 'error',
            // })
            reject(error)
        }
    })
}


///////////
/////////// 水动力计算部分
///////////
let hydrodynamicCaseID = ''
let hydrodynamicRunningResult = {}
let drawingStatus = false;
const hydrodynamicCalcDone = ref(false);

/////////////////// 潮位过程线获取
const tidePointVelocityCalc = async (lng, lat) => {
    // modelRunnningStatusDesc
    const pointVelocityModelUrl =
        '/model/taskNode/start/numeric/getFlowFieldVelocities'
    const params = {
        'case-id': hydrodynamicCaseID,
        // "case-id": '6c6496ca7c80adbbff129da890894990',
        'sample-points': [
            {
                lng: lng,
                lat: lat,
            },
        ],
    }
    isRunningMan.value = true
    RunningManSays.value = '正在提取潮位线...'
    const pointVelocityMR = new ModelRunner(pointVelocityModelUrl, params)
    await pointVelocityMR.modelStart()

    let runningInterval = (
        function loop() {
            return setTimeout(async () => {
                let runningStatus = await pointVelocityMR.getRunningStatus()
                switch (runningStatus) {
                    case 'RUNNING':
                        break
                    case 'ERROR':
                        console.log('error')
                        let errorLog = await pointVelocityMR.getErrorLog()
                        ElNotification({
                            title: '计算失败',
                            message: `错误原因:\n` + errorLog,
                            offset: 300,
                            type: 'error',
                        })
                        isRunningMan.value = false
                        RunningManSays.value = ''
                        drawingStatus = false
                        return;
                    case 'COMPLETE':
                        ElNotification({
                            title: '潮位线提取成功',
                            offset: 300,
                            type: 'success',
                        })
                        let runningResult = await pointVelocityMR.getModelResult();
                        flowspeedInfoRef.value.updateData(runningResult.result)
                        WaterProcessChartRef.value.updateData(runningResult.result)
                        drawingStatus = false
                        isRunningMan.value = false

                        return;
                }
                loop()
            }, 500)
        }
    )();
}

const drawHandler = () => {
    if (hydrodynamicCalcDone.value === false) {
        ElNotification({
            title: '警告',
            message: '模型计算完成后方可提取潮位过程线',
            type: 'warning',
            offset: 300,
        })
        return
    }
    if (isRunningMan.value === true) {
        ElNotification({
            title: '警告',
            message: '请等待当前任务完成，请稍后...',
            type: 'warning',
            offset: 300,
        })
        return
    }

    ElNotification({
        title: '提示',
        message: '进入绘制状态，点击地图以添加潮位点',
        type: 'info',
        offset: 300,
    })
    let map = useMapStore().getMap()
    let dom = map.getCanvasContainer()
    dom.style.cursor = 'crosshair'
    if (drawingStatus === false) {
        map.once('click', (e) => {
            // 防止运行模型的过程中添加测点
            if (isRunningMan.value === true) {
                ElNotification({
                    title: '警告',
                    message: '请等待当前任务完成，请稍后...',
                    type: 'warning',
                    offset: 300,
                })
                dom.style.cursor = 'grab'
                return
            }
            tideLevelPointPos.value = [e.lngLat.lng, e.lngLat.lat];
            if (!map.getSource('chaoWeiPoint')) {
                addTideLevelPoint()
            } else {
                map.getSource('chaoWeiPoint').setData({
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {
                                label: '潮位点',
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: tideLevelPointPos.value,
                            },
                        },
                    ],
                })
            }
            ElNotification({
                type: 'info',
                title: '设置潮位点',
                message: `经度：${e.lngLat.lng.toFixed(4)}，纬度：${e.lngLat.lat.toFixed(4)}`,
                offset: 300,
            })

            tidePointVelocityCalc(e.lngLat.lng, e.lngLat.lat).then(() => {
                console.log('潮位线提取完成')
            })

            dom.style.cursor = 'grab'
        })
        drawingStatus = true
    }
    else {
        return
    }
}

// 添加潮位点
const addTideLevelPoint = () => {
    let map = useMapStore().getMap()
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
                    coordinates: tideLevelPointPos.value,
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
}

/////////// 水动力模型中的流场控制部分
let floodWatcher = null
let floodFlow = null

const flowControl = (showOrHide) => {
    let map = useMapStore().getMap()
    if (showOrHide) {
        // 新加流场，先移除之前的流场
        if (map.getLayer('floodFlow')) {
            timeStep.value = 0
            map.removeLayer('floodFlow')
            if (floodWatcher) {
                floodWatcher()
                floodWatcher = null
            }

        }

        timeStep.value = 0

        let pngPrefix = `/model/data/bankResource/down/modelServer/resource/file/image?name=`
        let visualizationJsonUrl = `/model/data/bankResource/down/modelServer/resource/file/json?name=${hydrodynamicRunningResult['visualization-description-json']}`

        floodFlow = reactive(new FlowFieldLayer(
            'floodFlow',
            visualizationJsonUrl,
            pngPrefix,
            true,
            () => {
                ElNotification({
                    title: '警告',
                    message: '流场可视化数据正在生产中，请稍后尝试',
                    type: 'warning',
                    offset: 300,
                })
                showFlow.value = false
                flowControl(showFlow.value)
            }
        ))

        map.getLayer('chaoWeiPointLable') ? map.addLayer(floodFlow, 'chaoWeiPointLable') : map.addLayer(floodFlow)
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

    } else {
        if (map.getLayer('floodFlow')) {
            timeStep.value = 0
            map.removeLayer('floodFlow')
            if (floodWatcher) {
                floodWatcher()
                floodWatcher = null
            }
        }
    }
}

const flowControlHandler = async () => {
    if (hydrodynamicCaseID != '' && hydrodynamicRunningResult['visualization-description-json']) {
        setTimeout(() => {
            showFlow.value = !showFlow.value
            flowControl(showFlow.value)
        }, 1);
    } else {
        ElNotification({
            title: '警告',
            message: '尚未完成水动力模型计算，无法控制流场',
            type: 'warning',
            offset: 300,
        })
    }
}



















onBeforeRouteLeave((to, from, next) => {
    console.log('router leave')
    if (isRunningMan.value) {
        // 点击标题栏后，GlobalBankName会更改
        // 保持GlobalBankName稳定 
        useBankNameStore().globalBankName = from.params.id
        next(false)
        ElMessage.warning({
            message: '请等待当前任务完成，请稍后...',
            offset: 80,
        })
        return
    }
    next(true)
})


onBeforeRouteUpdate(async (to, from, next) => {
    console.log('router update')
    if (isRunningMan.value) {
        // 点击标题栏后，GlobalBankName会更改
        // 保持GlobalBankName稳定 
        useBankNameStore().globalBankName = from.params.id
        next(false)
        ElMessage.warning({
            message: '请等待当前任务完成，请稍后...',
            offset: 80,
        })
        return
    }
    //////////// 更新岸段时，信息重置
    showWaterPower.value = false
    showRiverBed.value = false
    showGeologyAndProject.value = false
    hydrodynamicCaseID = ''
    hydrodynamicRunningResult = {}
    hydrodynamicCalcDone.value = false;
    totalResult.desc = '暂无'
    riskAreas.value = []

    useBankNameStore().globalBankName = to.params.id
    let bank = to.params.id


    //////// 01 基本信息
    const bcInfo = (await BackEndRequest.getBankBasicInfo()).data
    bankBCInfo.value = bcInfo

    ////////// 02 地形资源
    demResources.value = await getDemResource(bank)


    /////////// 设置默认地形参数 //////////////
    if (bank === 'Mzs') {
        conditionConfigureData.refDEM = {
            "sets": "standard",
            "year": "2012",
            "name": "201210",
            "fileType": "tiff",
            "path": "tiff/Mzs/2012/standard/201210/201210.tif",
            "month": "10"
        }
        conditionConfigureData.benchDEM = {
            "sets": "standard",
            "year": "2023",
            "name": "202304",
            "fileType": "tiff",
            "path": "tiff/Mzs/2023/standard/202304/202304.tif",
            "month": "04"
        }

    } else {
        conditionConfigureData.refDEM = null
        conditionConfigureData.benchDEM = null
    }


    ////////// 03 地图初始化
    let map = useMapStore().getMap()
    mapInstance = map
    refreshMap(map)

    if (bank === 'Mzs') {
        // 其他岸段转民主沙
        mapFlyToMzs(map)

        addBankLayer(map, bank).then(() => {
            //////////////////// 添加，民主沙特有的栅格图层、地形图层，前两者不展示
            addRasterLayer(map, 23032209, 'mapRaster')
            map.setLayoutProperty('mapRaster', 'visibility', 'none')
            map.addLayer(new TerrainLayer(14))
            map.setLayoutProperty('TerrainLayer', 'visibility', 'none')
            addTideLevelPoint()

            //////////////////// 添加，断面风险条带图层，默认不展示, 模型有结果再展示
            map.getLayer('岸段预警') && map.removeLayer('岸段预警')
            bankWarnLayer = new BankWarnLayer(defaultWarnLayerData)
            map.addLayer(bankWarnLayer, 'chaoWeiPoint')
            map.setLayoutProperty('岸段预警', 'visibility', 'none')

            showFlow.value = false // 初始时关闭流场
            showWaterPowerFunc() // 打开水流动力面板
            conditionConfigureDataResetHandler() // 跑模型
        })

        /////// 展示特殊图层的控制按钮
        showControls.value = true

    } else {

        // 民主沙转至其他岸段

        // 删除特殊图层
        map.getLayer('floodFlow') && map.removeLayer('floodFlow')
        map.getLayer('TerrainLayer') && map.removeLayer('TerrainLayer')
        map.getLayer('岸段预警') && map.removeLayer('岸段预警')

        mapFlyToRiver(map)

        addBankLayer(map, bank).then(() => {
            //////////////////// 潮位点加上  20241128
            addTideLevelPoint()
            //////////////////// 添加，断面风险条带图层，默认不展示, 模型有结果再展示
            bankWarnLayer = new BankWarnLayer(defaultWarnLayerData)
            map.addLayer(bankWarnLayer)
            map.setLayoutProperty('岸段预警', 'visibility', 'none')

            showFlow.value = false // 初始时关闭流场
            showWaterPowerFunc() // 打开水流动力面板
        })
        /////// 隐藏特殊图层的控制按钮
        showControls.value = false


    }

    next(true)
})


onMounted(async () => {
    useBankNameStore().globalBankName = route.params.id
    let bk = route.params.id




    //////// 01 基本信息
    const bcInfo = (await BackEndRequest.getBankBasicInfo()).data
    bankBCInfo.value = bcInfo

    ////////// 02 地形资源
    demResources.value = await getDemResource(bk)

    /////////// 设置默认地形参数 //////////////
    if (bk === 'Mzs') {
        conditionConfigureData.refDEM = {
            "sets": "standard",
            "year": "2012",
            "name": "201210",
            "fileType": "tiff",
            "path": "tiff/Mzs/2012/standard/201210/201210.tif",
            "month": "10"
        }
        conditionConfigureData.benchDEM = {
            "sets": "standard",
            "year": "2023",
            "name": "202304",
            "fileType": "tiff",
            "path": "tiff/Mzs/2023/standard/202304/202304.tif",
            "month": "04"
        }

    } else {
        conditionConfigureData.refDEM = null
        conditionConfigureData.benchDEM = null
    }

    if (bk === 'Mzs') {
        ////////// 03 地图初始化
        initPureScratchMap(mapContainer.value).then(async (map) => {

            mapFlyToMzs(map)
            mapInstance = map
            refreshMap(map)

            addBankLayer(map, bk).then(() => {


                //////////////////// 添加，民主沙特有的栅格图层、地形图层、潮位点图层，前两者不展示
                addRasterLayer(map, 23032209, 'mapRaster')
                map.setLayoutProperty('mapRaster', 'visibility', 'none')
                map.addLayer(new TerrainLayer(14))
                map.setLayoutProperty('TerrainLayer', 'visibility', 'none')


                // const chaoWeiPoint = {
                //     type: 'FeatureCollection',
                //     features: [
                //         {
                //             type: 'Feature',
                //             properties: {
                //                 label: '潮位点',
                //             },
                //             geometry: {
                //                 type: 'Point',
                //                 coordinates: tideLevelPointPos.value,
                //             },
                //         },
                //     ],
                // }
                // map.addSource('chaoWeiPoint', {
                //     type: 'geojson',
                //     data: chaoWeiPoint,
                // })
                // map.addLayer({
                //     id: 'chaoWeiPoint',
                //     type: 'circle',
                //     source: 'chaoWeiPoint',
                //     paint: {
                //         'circle-radius': 7,
                //         'circle-color': 'rgb(255, 0,0)',
                //     },
                // })
                // map.addLayer(
                //     {
                //         id: 'chaoWeiPointLable',
                //         type: 'symbol',
                //         source: 'chaoWeiPoint',
                //         layout: {
                //             'text-field': ['get', 'label'],
                //             'text-font': [
                //                 'Open Sans Semibold',
                //                 'Arial Unicode MS Bold',
                //             ],
                //             'text-anchor': 'top',
                //             'text-offset': [0.0, 0.5],
                //             'text-size': 18,
                //             'text-allow-overlap': true,
                //         },
                //         paint: {
                //             'text-color': 'rgb(255,255,255)',
                //         },
                //     },
                //     'chaoWeiPoint',
                // )


                //////////////////// 潮位点加上  20241128
                addTideLevelPoint()
                //////////////////// 添加，断面风险条带图层，默认不展示, 模型有结果再展示
                bankWarnLayer = new BankWarnLayer(defaultWarnLayerData)
                map.addLayer(bankWarnLayer, 'chaoWeiPoint')
                map.setLayoutProperty('岸段预警', 'visibility', 'none')


                showFlow.value = false // 初始时关闭流场
                showWaterPowerFunc() // 打开水流动力面板
                conditionConfigureDataResetHandler() // 进页面跑一次
            })


            ///////// 存地图实例
            useMapStore().setMap(map)

            /////// 展示特殊图层的控制按钮
            showControls.value = true

        })
    } else {


        ////////// 03 地图初始化
        initPureScratchMap(mapContainer.value).then(async (map) => {
            mapInstance = map
            mapFlyToRiver(map)
            refreshMap(map)

            addBankLayer(map, bk).then(() => {
                //////////////////// 潮位点加上  20241128
                addTideLevelPoint()
                //////////////////// 添加，断面风险条带图层，默认不展示, 模型有结果再展示
                map.getLayer('岸段预警') && map.removeLayer('岸段预警')
                bankWarnLayer = new BankWarnLayer(defaultWarnLayerData)
                map.addLayer(bankWarnLayer)
                map.setLayoutProperty('岸段预警', 'visibility', 'none')

            })
            ///////// 存地图实例
            useMapStore().setMap(map)


            /////// 隐藏特殊图层的控制按钮
            showControls.value = false

            // risk level
            totalResult.desc = '暂无'
            riskAreas.value = []

            showFlow.value = false // 初始时关闭流场
            showWaterPowerFunc() // 打开水流动力面板
        })
    }




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
        top: 3vh;
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
        top: 3vh;
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

        :deep(.el-input__inner) {
            appearance: textfield;

            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button {
                -webkit-appearance: none;
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
        height: 7vh;

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

    div.risk-factor-container {
        position: absolute;
        z-index: 5;
        left: 0.3vw;
        top: 7.5vh;
        // width: 31.2vw;
        width: 26vw;
        height: 7vh;

        background-color: rgba(146, 190, 228, 0.5);
        backdrop-filter: blur(5px);
        border: #0a59ec 2px solid;
        border-radius: 6px;

        div.risk-item-title {
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

            &.none {
                background-color: rgb(116, 116, 116);
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

            &.none {
                left: 10.3vw;
            }

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
