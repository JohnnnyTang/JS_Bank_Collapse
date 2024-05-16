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
    '流域水系',
    '湖泊河流',
    '水文站点',
    '长江堤防',
    '长江堤防-注记',
    '过江通道-桥墩',
    '过江通道-桥',
    '过江通道-隧道/通道',
    '过江通道-隧道/通道-注记',
    '过江通道-桥-注记',
    '沿江码头',
    '水库大坝',
    '水闸工程',
    '泵站工程',
    '枢纽工程',
    '江堤港堤',
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

    return { warnInfo }
})

const useHighlightLayerStore = defineStore('highlightLayerStore', () => {
    const highlightLayers = ref([])
    return { highlightLayers }
})

export { useWarnInfoStore, useMapStore, useSceneStore, useLayerStore, useMapLayerStore, useNewSceneStore, useHighlightLayerStore }
