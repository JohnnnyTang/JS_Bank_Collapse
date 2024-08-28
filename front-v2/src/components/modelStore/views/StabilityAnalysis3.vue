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
      <div class="model-pannel">
        <dv-border-box12 :dur="5" :color="['rgb(28, 75, 187)', 'rgb(140, 255, 255)']">
          <div class="real-content">
            <div class="condition-configure flex-row">
              <div class="title">
                <div class="title-div">水文条件配置</div>
                <div class="arrow-up"></div>
              </div>
              <div class="content">

                <div class="condition-card">
                  <div class="set-icon"></div>
                  <div class="center">
                    实时评估
                  </div>
                  <div class="realtime-water-condition">
                    <div class="water-condition-item">
                      <span class="water-condition-title">流量：</span>
                      <el-input v-model="customParams.flow" style="width: 7vw; height: 3vh;" placeholder="请输入流量" />
                    </div>
                    <div class="water-condition-item">
                      <span class="water-condition-title">潮差：</span>
                      <el-input v-model="customParams.diffTide" style="width: 7vw; height: 3vh;" placeholder="请输入潮差" />
                    </div>
                    <!-- <div class="water-condition-item">
                      <span class="water-condition-title">小潮潮位：</span>
                      <el-input v-model="customParams.minTide" style="width: 50%; height: 70%;" placeholder="请输入潮位" />
                    </div> -->
                  </div>

                  <button class="realtime-button" @click="updateRealtimeWaterCondition()">
                    实时水文条件
                  </button>

                  <button class="condition-button" @click="conditionClickHandler('custom')" :class="{ 'active': true }">
                    确定
                  </button>
                </div>

                <!-- <el-tabs type="border-card" class="tab-pages" v-model="activeTab">
                  <el-tab-pane>
                    <template #label>
                      <span class="custom-tabs-label">
                        <el-icon>
                          <Histogram />
                        </el-icon>
                        <span>匹配工况</span>
                      </span>
                    </template>
                    <div class="condition-card">
                      <div class="set-icon"></div>
                      <div class="center">
                        匹配工况
                      </div>

                      <div class="section-selectior-item">
                        <el-select v-model="flowSelected" placeholder="选择流量" style="width: 10vw; height: 3.5vh">
                          <el-option v-for="item in selectableFlowList" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="section-selectior-item">
                        <el-select v-model="tideSelected" placeholder="选择潮型" style="width: 10vw; height: 3.5vh">
                          <el-option v-for="item in selectableTideList" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                      </div>
                      <button class="condition-button" @click="conditionClickHandler('match')"
                        :class="{ 'active': true }">
                        确定
                      </button>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane>
                    <template #label>
                      <span class="custom-tabs-label">
                        <el-icon>
                          <Tools />
                        </el-icon>
                        <span>实时评估</span>
                      </span>
                    </template>
                    <div class="condition-card">
                      <div class="set-icon"></div>
                      <div class="center">
                        实时评估
                      </div>
                      <div class="realtime-water-condition">
                        <div class="water-condition-item">
                          <span class="water-condition-title">流量：</span>

                          <el-input v-model="customParams.flow" style="width: 65%; height: 70%;" placeholder="请输入流量" />

                        </div>
                        <div class="water-condition-item">
                          <span class="water-condition-title">大潮潮位：</span>
                          <el-input v-model="customParams.maxTide" style="width: 50%; height: 70%;" placeholder="请输入潮位" />
                        </div>
                        <div class="water-condition-item">
                          <span class="water-condition-title">小潮潮位：</span>
                          <el-input v-model="customParams.minTide" style="width: 50%; height: 70%;" placeholder="请输入潮位" />
                        </div>
                      </div>

                      <button class="realtime-button" @click="updateRealtimeWaterCondition()">
                        实时水文条件
                      </button>

                      <button class="condition-button" @click="conditionClickHandler('custom')"
                        :class="{ 'active': true }">
                        确定
                      </button>
                    </div>
                  </el-tab-pane>

                </el-tabs> -->
              </div>
            </div>

            <div class="model-running flex-row">
              <div class="title">
                <div class="title-div">模型计算</div>
                <div class="arrow-up"></div>

              </div>
              <div class="content">
                <div class="content-box">
                  <el-row>
                    <el-col :span="10">
                      <div class="running-status grid-content">
                        状态：<span :style="statusStyle">{{ modelRunnningStatusDesc }}</span>
                      </div>
                    </el-col>

                    <el-col :span="6">
                    </el-col>
                    <el-col :span="8">
                      <div class="running-control grid-content">
                        <div class="run-button" @click="runModelClickHandler">运行
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="grid-content">
                        <div class="progress-container">
                          <el-progress :percentage="modelRunnningProgress" :stroke-width="15" striped />

                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="visulization-result flex-row">
              <div class="title">
                <div class="title-div">结果可视化 </div>
              </div>

              <div class="content">
                <div class="slide-control-block">
                  <label class="switch" :class="{ 'forbbidden': globleVariable.status === false }">
                    <input type="checkbox" :checked="showFlow == 1" :disabled="globleVariable.status === false"
                      @click="showFlowClickHandler(1)" />
                    <span class="slider"></span>
                  </label>
                  <div class="text-block">
                    <div class="text">拉格朗日场</div>
                  </div>
                </div>

                <div class="slide-control-block">
                  <label class="switch" :class="{ 'forbbidden': globleVariable.status === false }">
                    <input type="checkbox" :checked="showFlow == 2" :disabled="globleVariable.status === false"
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
        </dv-border-box12>
      </div>

      <div class="model-pannel2">
        <dv-border-box12 :dur="5" :color="['rgb(28, 75, 187)', 'rgb(140, 255, 255)']">
          <div class="model-content flex-center">
            <div class="flex-coloum" style="width: 18.7vw; height: 23vh;">
              <div class="title">● 潮位过程线提取
                <div class="button" @click="drawButtonClickHandler"
                  :class="{ 'forbbidden': globleVariable.status === false }">测点绘制</div>
                <!-- <div class="button" @click="drawButtonClickHandler">测点绘制</div> -->
              </div>
              <div class="content flex-center" ref="tideLineChartDom" v-show="globleVariable.status">
              </div>
              <div class="content flex-center" v-show="globleVariable.status === false">
                <span v-if="true" style="z-index: 10;">请在计算模型后绘制潮位点以提取潮位线</span>
              </div>
            </div>

          </div>
        </dv-border-box12>
      </div>
    </div>
  </div>

  <!-- <el-dialog v-model="pointConfirmShow" title="潮位点绘制确认" width="25vh">
    <span>确认使用此点位计算潮位</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="pointConfirmShow = false">取消</el-button>
        <el-button type="primary" @click="tidePointVelocityCalc">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog> -->

  <div class="loading-container" v-show="showRunning">
    <dv-loading class="loading-icon">
      <div class="loading-message">{{ runningMsg }}</div>
    </dv-loading>
  </div>
</template>

<script setup>
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import ModelTitleVue from '../ModelTitle.vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import { ref, reactive, onMounted, onUnmounted, computed, watch, createApp } from 'vue'
import { initFineMap } from '../../../utils/mapUtils';
import { useMapStore } from '../../../store/mapStore';
import { useHydrodynamicStore } from '../../../store/modelStore'
import { ElNotification, ElMessageBox, ElPopconfirm } from 'element-plus'
import ElementPlus from 'element-plus'
import popover from './popover.vue'
import axios from 'axios';
import dayjs from 'dayjs';
import * as echarts from 'echarts'
import FlowFieldLayer from '../../../utils/WebGL/flowFieldLayer'
import { EulerFlowLayer } from '../../../utils/WebGL/eulerFlowLayer'
import * as dat from 'dat.gui'
import { useRouter } from "vue-router";
import ModelRunner from '../modelRunner'
import '../../../utils/WebGL/dat_gui_style.css'
import mapboxGl from 'mapbox-gl'


let globleVariable = reactive({
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
const selectedBank = ref('')
const mapRef = ref(null)
const tideLineChartDom = ref(null)
const mapStore = useMapStore()
const hydrodynamicStore = useHydrodynamicStore()
const updateTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const showFlow = ref(0)
const modelRunnningStatusDesc = ref('未运行')
const modelRunnningProgress = ref(0)
const runningMsg = ref('')
const showRunning = ref(false)
const activeTab = ref('0')
const params = ref({
  flow: null,
  maxTide: null,
  minTide: null,
  tideType: null,
})
// const tidePointFeature = ref(null)
// const pointConfirmShow = ref(false)
const router = useRouter();
const radio1 = ref(1)

let chartIns = null


const jump2Model = (value) => {
  console.log(value == '1')
  const routeMap = {
    '1': "/modelStore/stabilityAnalysis",
    '2': "/modelStore/stabilityCalc",
    '3': "/modelStore/analysisCenter"
  }
  routeMap[value] && router.push(routeMap[value])
}

const customParams = ref({
  flow: null,
  // maxTide: null,
  // minTide: null,
  diffTide: null,
});
const tableData = ref([
  {
    flow: 98000,
    // maxTide: 5.2,
    // minTide: 2.7,
    diffTide: 2.4,
  },
]);
const statusStyle = computed(() => {
  switch (modelRunnningStatusDesc.value) {
    case '未运行':
      return { color: 'rgb(255, 2, 2)' }
    case '运行中':
      return { color: 'rgb(255, 165, 0)' }
    case '运行完毕':
      return { color: 'rgb(0, 180, 0)' }
    default:
      return { color: 'rgb(255, 255, 255)' }
  }
})
// const flowSelected = ref(null)
// const tideSelected = ref(null)
// const selectableFlowList = [10000, 13000, 16500, 205000, 35000, 45000, 62000, 84000, 10400, 92000].sort((a, b) => a - b)
// const selectableTideList = ['大潮', '中潮', '小潮']

///////////////////// 岸段选择
const confirmBankHandler = async (bankName) => {
  console.log('confirmBankHandler', bankName)
  const bankNameMap = {
    民主沙: "Mzs",
    民主沙右缘: "Mzs",
  };
  mapFlyToRiver(mapStore.getMap(map), bankName)

  selectedBank.value = bankName

  ElNotification({
    type: 'success',
    title: '选择岸段',
    message: `已选择岸段——${bankName},模型计算将默认采用${bankName}相关资源`,
    offset: 180
  })
}

////////////////// hydrodynamic计算
const check = (p) => {
  if (activeTab.value === '0') {
    if (p.flow === null || p.flow < 5000 || p.flow > 500000) return false
    if (p.tideType === null) return false
  } else if (activeTab.value === '1') {
    if (p.flow === null || p.flow < 5000 || p.flow > 500000) return false
    if (p.maxTide === null || p.maxTide < 0 || p.maxTide > 100) return false
    if (p.minTide === null || p.minTide < 0 || p.minTide > 100) return false
  }
  return true
}
const conditionClickHandler = (type) => {
  console.log('conditionClickHandler', type)
  // if (type === 'realtime') {
  //     params.value = tableData.value[0]
  // } 
  showFlow.value = 0
  flowLayerControl('lagrange', false)
  flowLayerControl('euler', false)

  if (type === 'match') {
    // params.value = {
    //   flow: flowSelected.value,
    //   tideType: tideSelected.value,
    // }
  } else if (type === 'custom') {
    params.value = {
      flow: Number(customParams.value.flow),
      // maxTide: Number(customParams.value.maxTide),
      // minTide: Number(customParams.value.minTide),
      diffTide: Number(customParams.value.diffTide),
    }
  }
  if (check(params.value))
    ElNotification({
      title: '水文条件配置成功',
      // message: `流量：${params.value.flow}，大潮潮位：${params.value.maxTide}，小潮潮位：${params.value.minTide}`,
      // message: `流量：${params.value.flow}，潮型：${params.value.tideType}`,
      offset: 120,
      type: 'success',
    })
  else
    ElNotification({
      title: '水文条件配置失败',
      message: `请检查输入是否合法`,
      offset: 120,
      type: 'error',
    })
  modelRunnningProgress.value = 0
  modelRunnningStatusDesc.value = '未运行'
  globleVariable.status = false
}
const runModelClickHandler = async () => {
  if (!check(params.value)) {
    ElNotification({
      title: '运行失败',
      message: `请检查输入是否合法`,
      offset: 120,
      type: 'error',
    })
    return
  }
  // ElMessageBox.confirm(
  //   '模型正在运行，请稍后...',
  //   {
  //     showConfirmButton: false,
  //     showCancelButton: true,
  //     // confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // )
  // ElNotification({
  //   title: '模型正在运行，请稍后...',
  //   type: 'info',
  //   offset: 120,
  // })
  if (runningMsg.value === '模型正在运行，请稍后...') {
    ElNotification({
      type: 'info',
      title: '模型正在运行',
      message: '请勿重复提交',
      offset: 120,
    })
    return
  }



  const Confirm = {
    'NONE': () => {
      runningMsg.value = '模型正在运行，请稍后...'
      showRunning.value = true
      modelRunnning("1")
      // modelRunnning()
    },
    'RUNNING': () => {
      ElMessageBox.confirm(
        '模型正在运行，请勿重复提交',
        '警告',
        {
          showConfirmButton: false,
          showCancelButton: true,
          // confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      globleVariable.status = false
    },
    'COMPLETE': () => {
      ElMessageBox.confirm(
        '已有运行结果，是否采用新工况重新运行？',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          console.log('run with new condition')
          showFlow.value = 0
          flowLayerControl('lagrange', false)
          flowLayerControl('euler', false)
          chartIns.clear()
          globleVariable.status = false
          runningMsg.value = '模型正在运行，请稍后...'
          showRunning.value = true
          modelRunnning("1")
        })
        .catch(() => {
          console.log('do nothing')
        })
    },
    'ERROR': () => {

    }
  }
  Confirm[globleVariable.runningStatus]()
}
const modelRunnning = async (type) => {
  modelRunnningStatusDesc.value = '运行中'
  modelRunnningProgress.value = 0
  let modelPostUrl = ''
  let modelParams = {}
  const mmap = {
    '大潮': 'dc',
    '中潮': 'zc',
    '小潮': 'xc'
  }
  // console.log('check0 ', type)
  if (type === '0') {
    modelPostUrl = '/temp/taskNode/start/numeric/hydrodynamic'
    modelParams = {
      "water-qs": params.value.flow,
      "tidal-level": mmap[params.value.tideType],
      "segment": "Mzs",
      "set": "standard",
      "year": "2023",
    }
  } else if (type === '1') {
    modelPostUrl = '/temp/taskNode/start/numeric/hydrodynamic'
    modelParams = {
      "water-qs": params.value.flow,
      "tidal-level": params.value.diffTide,
      "segment": "Mzs",
      "set": "standard",
      "year": "2023",
    }
  }
  // console.log('check1 ', modelPostUrl, modelParams)
  // try {

  const TASK_ID = (await axios.post(modelPostUrl, modelParams)).data
  // ElNotification({
  //   title: '开始运行水动力模型',
  //   offset: 120,
  //   type: 'info',
  // })
  // const TASK_ID = '1'
  console.log('TASK_ID ', TASK_ID)// 66a23664bec8e12b68c9ce86
  modelRunnningStatusDesc.value = '运行中'
  modelRunnningProgress.value = 0
  globleVariable.taskID = TASK_ID
  console.log('===Interval')
  let runningStatusInterval = setInterval(async () => {
    console.log('runningStatusInterval')
    let runningStatus = (await axios.get('/temp/taskNode/status/id?taskId=' + TASK_ID)).data
    // let runningStatus = 'RUNNING'
    modelRunnningStatusDesc.value = '运行中'
    let randomFactor = 3.0
    if (runningStatus === 'RUNNING') {
      globleVariable.runningStatus = 'RUNNING'
      if (modelRunnningProgress.value < 88) randomFactor = 1.0
      if (modelRunnningProgress.value > 88) randomFactor = 0.5
      if (modelRunnningProgress.value > 95) randomFactor = 0.1

      let nextProgress = Math.round((modelRunnningProgress.value + Math.random() * randomFactor) * 100) / 100
      nextProgress = nextProgress > 95 ? 95 : nextProgress
      modelRunnningProgress.value = nextProgress
    }
    else if (runningStatus === 'ERROR') {
      globleVariable.runningStatus = 'ERROR'
      runningMsg.value = ''
      showRunning.value = false
      const url = `/temp/taskNode/result/id?taskId=${TASK_ID}`
      axios.get(url).then(response => {
        let errorLog = response.data['error-log']
        resolve(errorLog)
      }).catch(error => {
        console.warn(error)
        reject(error)
      })
      const errorLog = (await axios.get(url)).data['error-log']

      ElNotification({
        title: '模型运行失败',
        message: `错误原因:\n` + errorLog,
        offset: 120,
        type: 'error',
      })
      modelRunnningStatusDesc.value = '运行失败'
      globleVariable.runningStatus = 'NONE'
      clearInterval(runningStatusInterval)

    }
    else if (runningStatus === 'COMPLETE') {
      runningMsg.value = ''
      showRunning.value = false
      clearInterval(runningStatusInterval)
      let runningResult = (await axios.get('/temp/taskNode/result/id?taskId=' + TASK_ID)).data
      console.log('runningResult ', runningResult)

      globleVariable.caseID = runningResult['case-id']

      globleVariable.pngPrefix = `/temp/data/modelServer/down/resource/file/image?name=`
      globleVariable.binPrefix = `/temp/data/modelServer/down/resource/file/bin?name=`
      globleVariable.stationBinUrl = runningResult['visualization-station-bin']
      globleVariable.uvBinUrls = runningResult['visualization-uv-bin']

      ///temp/data/modelServer/down/resource/file/json?name=hydrodynamic/MZS/2024/test/104000xc/renderResource/flow_field_description.json
      let visulizationDescUrl = `/temp/data/modelServer/down/resource/file/json?name=${runningResult['visualization-description-json']}`

      globleVariable.visualizationJsonUrl = visulizationDescUrl
      console.log('globle data info::', globleVariable)

      // const visualizationJson = (await axios.get(visulizationDescUrl)).data
      // console.log('visualizationJson ', visualizationJson)
      globleVariable.status = true
      globleVariable.runningStatus = 'COMPLETE'
      modelRunnningStatusDesc.value = '运行完毕'
      modelRunnningProgress.value = 100

      // showFlowClickHandler(1)
    }
  }, 500)
  // } catch (error) {
  //   console.log('error', error)
  //   ElNotification({
  //     title: '模型运行失败',
  //     message: `错误原因:\n` + error.message,
  //     offset: 120,
  //     type: 'error',
  //   })
  // }
}

//////////////////// 流场控制
const flowLayerControl = (type, show) => {
  let map = mapStore.getMap()
  const controlMap = {
    'lagrange': {
      add: () => {
        console.log('add lagrenge');

        let backEndJsonUrl2 = "/api/data/flow/configJson/flood";
        let imageSrcPrefix2 = "/api/data/flow/texture/flood/";
        // let floodFlow = reactive(
        //   new FlowFieldLayer("floodFlow", backEndJsonUrl2, imageSrcPrefix2)
        // );
        let flow = new FlowFieldLayer(globleVariable.lagrangeLayer, globleVariable.visualizationJsonUrl, globleVariable.pngPrefix)
        // let flow = new FlowFieldLayer(globleVariable.lagrangeLayer, backEndJsonUrl2, imageSrcPrefix2)
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
        // '/bin/')

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

const showFlowClickHandler = (id) => {
  console.log(globleVariable)
  if (!globleVariable.status) {
    ElNotification({
      title: '错误',
      message: '模型尚未运行或运行未结束，缺乏可视化依赖数据',
      offset: 120,
      type: 'error',
    })
    showFlow.value = 0
    return
  }
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




/////////////////// 潮位点绘制
window.addEventListener('keydown', (event) => {
  if (event.key === 'v') {
    console.log(hydrodynamicStore.markerInfos)
  }
})

// popover vue
const createDom = () => {
  const div = document.createElement('div')
  const app = createApp(popover).use(ElementPlus)
  app.mount(div)
  return div
}
let drawingStatus = false

const drawButtonClickHandler = () => {

  if (!globleVariable.status) {
    ElNotification({
      title: '警告',
      message: '水动力模型计算完成后方可提取潮位过程线',
      type: 'warning',
      offset: 120,
    })
    return
  }
  if (runningMsg.value === '正在提取潮位线...') {
    ElNotification({
      title: '警告',
      message: '请等待当前任务完成，请稍后...',
      type: 'warning',
      offset: 120,
    })
    return
  }

  ElNotification({
    title: '提示',
    message: '进入绘制状态，点击地图以添加潮位点',
    type: 'info',
    offset: 120,
  })
  let map = mapStore.getMap()
  let dom = map.getCanvasContainer()
  dom.style.cursor = 'crosshair'
  if (drawingStatus === false) {
    map.once('click', (e) => {
      console.log(e.lngLat)
      // add marker

      const popoverDom = createDom()
      const popup = new mapboxGl.Popup().setDOMContent(popoverDom)

      const marker = new mapboxGl.Marker({
        color: '#ff6804ff',
      })
        .setLngLat(e.lngLat)
        .setPopup(popup)
        .addTo(map)

      // marker click callback
      const markerDom = marker.getElement()
      hydrodynamicStore.addMarkerInfo(marker, markerDom, e.lngLat.lng, e.lngLat.lat)

      markerDom.addEventListener('click', function (e) {
        console.log('click marker!!', this)
        const _markerDom = this
        hydrodynamicStore.focusingMarkerDom = _markerDom
      })

      ElNotification({
        type: 'info',
        title: '新添潮位点',
        message: `经度：${e.lngLat.lng.toFixed(4)}，纬度：${e.lngLat.lat.toFixed(4)}`,
        offset: 120,
      })

      // run model
      hydrodynamicStore.calculatingMarkerDom = markerDom
      tidePointVelocityCalc(e.lngLat.lng, e.lngLat.lat)
      dom.style.cursor = 'grab'
    })
    drawingStatus = true
  }
  else {
    return
  }

}


/////////////////// 潮位过程线获取
const tidePointVelocityCalc = async (lng, lat) => {
  // pointConfirmShow.value = false
  // console.log('pointFeature::', tidePointFeature.value)
  console.log('getVelocity caseId::', globleVariable.caseID)
  // modelRunnningStatusDesc
  const pointVelocityModelUrl = '/temp/taskNode/start/numeric/getFlowFieldVelocities'
  const params = {
    "case-id": globleVariable.caseID,
    // "case-id": '6c6496ca7c80adbbff129da890894990',
    "sample-points": [
      {
        "lng": lng,
        "lat": lat,
      }
    ]
  }
  showRunning.value = true
  runningMsg.value = '正在提取潮位线...'
  const pointVelocityMR = new ModelRunner(pointVelocityModelUrl, params)
  const hereTaskId = await pointVelocityMR.modelStart()
  console.log('hereTaskId', hereTaskId)


  console.log('===Interval')
  let runningInterval = setInterval(async () => {
    let runningStatus = await pointVelocityMR.getRunningStatus()
    switch (runningStatus) {
      case 'RUNNING':
        break;
      case 'ERROR':
        console.log('error')
        clearInterval(runningInterval)
        let errorLog = await pointVelocityMR.getErrorLog()
        ElNotification({
          title: '计算失败',
          message: `错误原因:\n` + errorLog,
          offset: 120,
          type: 'error',
        })
        showRunning.value = false
        runningMsg.value = ''
        drawingStatus = false
        break;
      case 'COMPLETE':
        console.log('complete')
        clearInterval(runningInterval)
        ElNotification({
          title: '计算成功',
          offset: 120,
          type: 'success',
        })
        let runningResult = await pointVelocityMR.getModelResult()

        let testOption = getTideLineDataOption(runningResult)

        hydrodynamicStore.showingOption = testOption
        // chartIns.setOption(testOption)

        // 在store中补充result
        let newInfo = {
          option: testOption
        }
        hydrodynamicStore.appendMarkerInfo(hydrodynamicStore.calculatingMarkerDom, newInfo)

        hydrodynamicStore.calculatingMarkerDom = null

        console.log('runningResult ', runningResult)
        showRunning.value = false
        runningMsg.value = ''
        drawingStatus = false
        break;
    }

  }, 1000)

}

const getTideLineDataOption = (data) => {
  const usData = data.result[0].us
  const vsData = data.result[0].vs
  const timeData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

  const tideLineOption = {
    grid: {
      left: '1%',
      right: '3%',
      bottom: '12%',
      top: '17%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: timeData,
      name: '时间步',
      nameLocation: 'middle',
      nameGap: 23,
      nameTextStyle: {
        fontWeight: 'bold',
      },
    },
    yAxis: {
      type: 'value',
      name: '速度(m/s)',
      nameTextStyle: {
        fontWeight: 'bold',
      },
    },
    series: [
      {
        name: '东西向流速',
        data: usData,
        type: 'line',
        symbol: 'none',
      },
      {
        name: '南北向流速',
        data: vsData,
        type: 'line',
        symbol: 'none',
      }
    ]
  }
  return tideLineOption
}




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

  mapIns.fitBounds(
    boundsMap[bankName],
    {
      duration: 1500,
    }
  );
}


const updateRealtimeWaterCondition = async () => {
  // async request
  const response = {
    flow: 85000,
    // maxTide: 5.2,
    // minTide: 3.9,
    diffTide: 3.9
  }
  // update
  tableData.value = [
    response
  ]
  updateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')

  customParams.value = response
  ElNotification({
    title: '已更新实时水文条件',
    message: `更新时间：${updateTime.value}`,
    offset: 120,
    type: 'success',
  })
}



onMounted(async () => {
  let map = await initFineMap(mapRef.value)
  mapStore.setMap(map)
  chartIns = echarts.init(tideLineChartDom.value)

  watch(() => hydrodynamicStore.showingOption, (newVal) => {
    console.log('newVal', newVal)
    chartIns.setOption(newVal)
  })
})



onUnmounted(() => {
  if (useMapStore().getMap()) {
    flowLayerControl('lagrange', false)
    flowLayerControl('euler', false)
    useMapStore().getMap().remove()
    useMapStore().destroyMap()
  }
})


</script>

<style lang="scss" scoped>
div.my-popover {

  position: absolute;
  z-index: 5;
  width: auto;
  height: auto;
  top: 0vh;
  left: 0vw;
  background-color: #faf8f8;
  padding: 1vh 1vw;
  border-radius: 10px;
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;

  .view-button {
    position: relative;

  }

  .delete-button {
    position: relative;
  }

  // .arrow-down {
  //   position: absolute;
  //   left: 50%;
  //   top: 50%;
  //   transform: translateX(-50%) translateY(200%);
  //   border-left: 10px solid transparent;
  //   border-right: 10px solid transparent;
  //   border-top: 10px solid #000;
  //   /* 你可以根据需要更改颜色 */
  // }

}



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

div.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}



div.loading-container {
  position: absolute;
  top: 14vh;
  right: 44vw;
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
      left: 0.5vw;
      width: 20vw;
      height: 47vh;
      background-color: rgb(248, 248, 248);
      // backdrop-filter: blur(20px);
      border-radius: calc(0.1vw + 1vh);

      :deep(.dv-border-box-12) {
        // background-color: rgb(214,216,219);
        border-radius: calc(0.5vw + 1vh);

        // backdrop-filter: blur(8px);
        // border-radius: 6px;
        div.border-box-content {
          display: flex;
        }
      }

      div.real-content {
        position: relative;
        width: 18.8vw;
        height: 45.5vh;
        transform: translateX(2.5%) translateY(2%);
        z-index: 1;
        display: flex;
        flex-direction: column;

        div.title {
          width: fit-content;
          padding: 0 0.3vw;
          position: relative;
          writing-mode: vertical-lr;
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background-color: rgb(255, 255, 255);

          div.title-div {
            height: fit-content;
            padding-left: 0.4vw;
            padding-right: 0.4vw;
            padding-bottom: 1vh;
            border-radius: calc(0.2vw + 0.2vh);
            color: rgb(25, 71, 134);
            font-weight: 700;
            font-size: calc(0.6vw + 0.6vh);
            letter-spacing: 0.3vh;
          }
        }

        div.content {
          position: relative;
          width: 15vw;
          flex-grow: 1;
        }

        div.condition-configure {
          position: relative;
          width: 100%;
          height: 42%;
          flex: 1;

          div.content {

            .condition-card {
              position: relative;
              width: 100%;
              height: 16vh;
              margin-top: .5vh;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              // align-items: center;
              border-radius: calc(0.1vh);
              background-color: #fff;
              // box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
              // margin-right: 2vw;
              // margin-left: 2vw;
              border: 1px solid rgba(150, 150, 150, 0.308);

              .set-icon {
                position: absolute;
                right: 0.2vw;
                top: 0.5vh;
                width: 4.5vh;
                height: 4.5vh;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url("/set.png");
              }

              .center {
                position: relative;
                height: 35%;
                // background-color: red;
                width: 100%;
                color: #055279;
                font-weight: 800;
                font-size: calc(0.8vw + 0.7vh);
                padding-left: 0.4vw;
                padding-top: 0.5vh;
              }

              .realtime-water-condition {
                position: relative;
                height: 100%;
                width: 80%;
                padding-left: 0.5vw;
                font-size: calc(0.45vw + 0.4vh);

                .water-condition-item {
                  position: relative;
                  width: 85%;
                  height: 3.2vh;
                  margin-bottom: 1vh;
                  margin-top: 1vh;

                  .water-condition-title {
                    line-height: 3.2vh;
                    font-weight: 800;
                    font-size: calc(0.6vw + 0.6vh);

                  }

                  .water-condition-value {
                    margin-right: 1vw;
                    font-size: calc(0.5vw + 0.4vh);
                  }

                  input.water-condition-input {
                    width: 50%;
                  }
                }
              }

              .last-update-time {
                position: relative;
                height: 40%;
                width: 100%;
                padding-left: 0.5vw;

                .water-condition-item {
                  position: relative;
                  width: 85%;
                  height: 3.5vh;

                  .water-condition-title {
                    line-height: 3.5vh;
                    font-weight: 800;
                    font-size: calc(0.5vw + 0.6vh);
                  }

                  .water-condition-value {
                    margin-right: 1vw;
                    font-size: calc(0.4vw + 0.4vh);
                  }
                }
              }

              button.realtime-button {
                position: absolute;
                right: 3.5vw;
                top: 0.5vh;
                width: 4。2vw;
                height: 3vh;
                background: #6aa8f8d0;
                color: #fff;
                font-family: inherit;
                font-weight: 900;
                font-size: calc(0.4vw + 0.3vh);
                border: 1px solid rgb(3, 107, 167);
                border-radius: 0.4em;
                box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
                cursor: pointer;
                transition: 0.3s linear;

                &:active {
                  background: #348cffd0;
                }

                &:hover {
                  background: #348cffd0;
                }
              }

              button.condition-button {
                position: absolute;
                right: 1.3vw;
                bottom: 0.5vh;
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
          }
        }

        div.model-running {
          position: relative;
          width: 100%;
          height: 25%;
          flex: 1;

          div.content {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            // border: 1px solid #dcdfe6;
            // background-color: #ffffff;

            .content-box {
              position: relative;
              width: 100%;
              height: fit-content;
              border: 1px solid #dcdfe6;
              background-color: #ffffff;

              .running-status {
                line-height: 3.2vh;
                font-weight: 800;
                font-size: calc(0.5vw + 0.6vh);
                color: #055279;
              }

              .run-button {
                position: relative;
                text-align: center;
                line-height: 3vh;
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
                transition: 0.1s linear;

                &:active {}

                &:hover {
                  background: #348cffd0;
                }
              }

              .progress-container {
                position: relative;
                display: block;
                height: 100%;
                width: 90%;
              }

              .grid-content {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                margin-bottom: 2vh;
              }

              .el-row {
                margin-left: 0vw;
                margin-top: 1vh;
              }
            }
          }
        }

        div.visulization-result {
          position: relative;
          width: 100%;
          flex: 1;
          height: 30%;

          div.content {
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;

            position: relative;
            width: 100%;
            height: fit-content;
            border: 1px solid #dcdfe6;
            background-color: #ffffff;

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

        div.flex-row {
          display: flex;
          flex-direction: row;
        }
      }
    }

    div.model-pannel2 {
      position: absolute;
      z-index: 1;
      top: 56vh;
      left: 0.5vw;
      width: 20vw;
      height: 26.8vh;
      background-color: rgb(248, 248, 248);
      // backdrop-filter: blur(20px);
      border-radius: calc(0.1vw + 1vh);

      :deep(.dv-border-box-12) {
        // background-color: rgb(214,216,219);
        border-radius: calc(0.5vw + 1vh);

        div.border-box-content {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      div.model-content {
        position: relative;

        div.title {
          position: relative;
          height: 3vh;
          width: 19vw;
          margin-top: -1vh;
          color: #055279;
          font-weight: 800;
          font-size: calc(0.8vw + 0.7vh);
          padding-left: 0.4vw;
          padding-top: 0.5vh;

          div.button {
            position: absolute;
            right: 0.8vw;
            top: .8vh;
            width: 3vw;
            height: 3vh;
            text-align: center;
            line-height: 3vh;
            background: #0254bed0;
            color: #fff;
            font-family: inherit;
            font-weight: 900;
            font-size: calc(0.4vw + 0.7vh);
            border: 1px solid rgb(3, 107, 167);
            border-radius: 0.4em;
            box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
            cursor: pointer;
            transition: 0.3s linear;

            &:hover {
              background: #348cffd0;
            }

            &.forbbidden {
              cursor: not-allowed;
            }
          }
        }

        div.content {
          position: relative;
          margin-top: 1vh;
          height: 22vh;
          width: 18.7vw;
          box-shadow: rgba(0, 0, 0, 0.281) 0px 1px 3px 0px, rgba(0, 0, 0, 0.144) 0px 1px 2px 0px;
          border-radius: 5px;
          // background-color: #000357;
        }
      }

    }
  }
}

.arrow-up {
  display: inline-block;
  position: relative;
  width: 10px;
  /* 可以根据需求调整箭头的宽度 */
  height: 10px;
  /* 可以根据需求调整箭头的高度 */
  transform: translateX(-1px);
}

.arrow-up::before,
.arrow-up::after {
  content: "";
  position: absolute;
  width: 2px;
  /* 调整箭头线条的宽度 */
  height: 12px;
  /* 调整箭头线条的高度 */
  background-color: black;
  /* 箭头颜色 */
}

.arrow-up::before {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) rotate(-45deg);
  transform-origin: bottom center;
}

.arrow-up::after {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  transform-origin: bottom center;
}

:deep(.el-tabs--border-card > .el-tabs__content) {
  padding: 8px;
}

:deep(.el-table .el-table__cell) {
  padding: 0;
  text-align: center;
}

:deep(.el-table .cell) {
  padding: 0;
  line-height: 2.5vh;
  font-size: small;
}

:deep(.mapboxgl-ctrl-group button) {
  width: 38px;
  height: 38px;
  margin: 8px;
}

:deep(.mapbox-gl-draw_point) {
  background-size: contain;
}

:deep(.mapbox-gl-draw_trash) {
  background-size: contain
}
</style>
