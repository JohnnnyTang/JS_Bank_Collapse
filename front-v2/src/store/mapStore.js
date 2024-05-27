import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { Scene } from '../components/dataVisual/Scene'

const useMapStore = defineStore('mapStore', () => {
    const map = ref(null)

    function setMap(mapInstance) {
        map.value = mapInstance
    }
    function getMap() {
        return map.value
    }

    function destroyMap() {
        map.value = null
    }

    return { setMap, getMap, destroyMap }
})

const useSceneStore = defineStore('sceneStore', () => {
    const _selectedScene = ref(new Scene())
    const _selectedFeature = ref({})
    const selectedScene = computed(() => _selectedScene.value)
    const selectedFeature = computed(() => _selectedFeature.value)

    function setSelectedScene(sceneInstance) {
        _selectedScene.value = sceneInstance
    }

    function setSelectedFeature(feature) {
        _selectedFeature.value = feature
    }

    return {
        selectedScene,
        selectedFeature,
        setSelectedScene,
        setSelectedFeature,
    }
})

const useLayerStore = defineStore('layerStore', () => {
    const _flowLayer = ref()
    const _terrainLayer = ref()

    const flowLayer = computed(() => _flowLayer.value)
    const terrainLayer = computed(() => _terrainLayer.value)

    function setFlowLayer(flowlayer_instance) {
        _flowLayer.value = flowlayer_instance
    }
    function setTerrainLayer(terrainlayer_instance) {
        _terrainLayer.value = terrainlayer_instance
    }

    return {
        flowLayer,
        terrainLayer,
        setFlowLayer,
        setTerrainLayer,
    }
})



const useNewSceneStore = defineStore('newSceneStore', () => {
    const SCENEMAP = ref({})
    const LAYERGROUPMAP = ref({})
    const latestScene = ref('')
    const latestLayerGroup = ref('')
    return { SCENEMAP, LAYERGROUPMAP, latestScene, latestLayerGroup }
})

const totalLayer = [
    '省级行政区',
    '市级行政区',
    '市级行政区-注记',
    '河道分段',
    '河道分段-注记',
    '骨干河道',
    '骨干河道-注记',
    '大型湖泊',
    '大型湖泊-注记',
    '水文站点',
    '水文站点-注记',
    '其他堤防',
    '其他堤防-注记',
    '过江通道-桥墩',
    '过江通道-桥',
    '过江通道-隧道/通道',
    '过江通道-隧道/通道-注记',
    '过江通道-桥-注记',
    '沿江码头',
    '沿江码头-注记',
    '水库大坝',
    '水库大坝-注记',
    '水闸工程',
    '水闸工程-注记',
    '泵站工程',
    '泵站工程-注记',
    '枢纽工程',
    '枢纽工程-注记',
    '长江干堤',
    '里程桩',
    '一级预警岸段',
    '二级预警岸段',
    '三级预警岸段',
    '岸段-注记',
    '历史崩岸',
    '近岸地形',
    '沙洲',
    '全江注记'
];

const layerStates = {}
for (let i = 0; i < totalLayer.length; i++) {
    layerStates[totalLayer[i]] = {
        added: false,
        showing: false,
    }
}
const useMapLayerStore = defineStore('mapLayerStore', () => {

    const layerState = ref(layerStates)

    function layerAdded(id) {
        layerState.value[id].added = true
    }
    function layesrAdded(ids) {
        ids.forEach(id => {
            layerState.value[id].added = true
        })
    }
    function layerShowing(id) {
        layerState.value[id].showing = true
    }
    function layersShowing(ids) {
        ids.forEach(id => {
            layerState.value[id].showing = true
        })
    }
    function layerRemove(id) {
        layerState.value[id].added = false
    }

    function layersRemove(ids) {
        ids.forEach(id => {
            layerState.value[id].added = false
        })
    }
    function layerHide(id) {
        layerState.value[id].showing = false
    }
    function layersHide(ids) {
        ids.forEach(id => {
            layerState.value[id].showing = false
        })
    }
    return { layerAdded, layesrAdded, layerRemove, layerHide, layerShowing, layersHide, layersShowing, layersRemove, layerState }
})

const useWarnInfoStore = defineStore('WarnInfoStore', () => {
    const warnInfo = ref([])
    const warnInfo_history = ref([])
    const warnPopupMap = ref({})
    const warnWatchTimer = ref(0)
    const fake = ref(false)
    const curDealId = ref('')

    function removeInfoItem(removeItem) {
        warnInfo.value = warnInfo.value.filter(item => item.id !== removeItem.id)
    }
    function resetWarnInfo() {
        //clear warn infomation
        warnInfo.value.forEach((item) => {
            warnPopupMap.value["" + item.id].remove()
        })
        //stop watch
        clearInterval(warnWatchTimer.value)
        //reset value
        warnInfo.value = []
        warnPopupMap.value = {}
        warnWatchTimer.value = 0
    }

    return { fake, warnInfo, warnPopupMap, removeInfoItem, resetWarnInfo, warnWatchTimer, warnInfo_history, curDealId }
})

const useHighlightLayerStore = defineStore('highlightLayerStore', () => {
    const highlightLayers = ref([])
    return { highlightLayers }
})

const useDeviceNameStore = defineStore('deviceNameStore', () => {
    const deviceName = ref('')
    return { deviceName }
})

export { useDeviceNameStore, useWarnInfoStore, useMapStore, useSceneStore, useLayerStore, useMapLayerStore, useNewSceneStore, useHighlightLayerStore }
