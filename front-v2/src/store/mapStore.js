import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Scene } from '../components/dataVisual/Scene'
import { NewScene } from '../components/dataVisual/js/scene'

const useMapStore = defineStore('mapStore', () => {
    const map = ref(null)

    function setMap(mapInstance) {
        map.value = mapInstance
    }
    function getMap() {
        return map.value
    }

    return { setMap, getMap }
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




const sMap = NewScene.getInitSceneMap()
const useNewSceneStore = defineStore('newSceneStore', () => {
    const sceneMap = ref(sMap)
    const nowScene = ref()
    return {sceneMap, nowScene}
})

const totalLayer = [
    '地形瓦片',
    '河段划分',
    '河段注记',
    '沙岛',
    '全江注记',
    '深泓线',
    '已建通道',
    '在建通道',
    '规划通道',
    '一级预警岸段',
    '二级预警岸段',
    '三级预警岸段',
    '民主沙地标',
    '民主沙区划线',
    '民主沙岸段线',
    '民主沙岸段注记',
    '守护工程断面',
    '守护工程断面注记',
    '稳定性分区',
    '预警级别分区',
    'GNSS',
    '测斜仪',
    '孔隙水压力计',
    '应力桩',
    '近岸流场',
    '三维地形'
]
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


export { useMapStore, useSceneStore, useLayerStore, useMapLayerStore, useNewSceneStore }
