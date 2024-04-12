import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Scene } from '../components/dataVisual/Scene'
import SteadyFlowLayer from '../utils/m_demLayer/steadyFlowLayer'
import TerrainLayer from '../utils/m_demLayer/terrainLayer'

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

const useDataStore = defineStore('dataStore',()=>{
    const _terrainHeight = ref('')
    const terrainHeight = computed(()=>_terrainHeight.value)
    function setTerrainHeight(value){
        // console.log('setTerrainHeight',value);
        _terrainHeight.value = value;
    }
    return {
        terrainHeight,
        setTerrainHeight
    }
})

export { useMapStore, useSceneStore, useLayerStore,useDataStore }
