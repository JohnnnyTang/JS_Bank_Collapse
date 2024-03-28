import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Scene } from "../components/dataVisual/Scene";

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

    return { selectedScene, selectedFeature, setSelectedScene, setSelectedFeature }
})

export {
    useMapStore,
    useSceneStore
}