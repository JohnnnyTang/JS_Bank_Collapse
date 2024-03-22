import { defineStore } from "pinia";
import { ref } from "vue";

const useMapStore = defineStore('mapStore',()=>{
    const map = ref(null)

    function setMap(mapInstance){
        map.value = mapInstance
    }
    function getMap(){
        return map.value
    }

    return {setMap,getMap}
})

export{
    useMapStore
}