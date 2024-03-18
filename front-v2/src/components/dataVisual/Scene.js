import { ElMessage } from "element-plus"
import mapboxgl from "mapbox-gl"

class Scene {

    constructor() {
        //规范
        this.map = undefined
        this.title = ''
        this.desc = ''
        this.iconSrc = ''
        this.allLayers = []
        this.layerResourceMap = {}

    }

    async initAllLayers() {

        // prepare for layer source, add Layers and all visible
        if (this.map.loaded()) {

        }
        else {
            this.map.on('load', async () => {

            })
        }

    }

    showLayers(showArrays) {
        // show layers based showArrys
        if (this.map.loaded()) {

            var invisibleLayers = this.allLayers.filter(v => !showArrays.includes(v))
            invisibleLayers.forEach(layerID => {
                this.map.setLayoutProperty(layerID, 'visibility', 'none')
            })

            showArrays.forEach(layerID => {
                this.map.setLayoutProperty(layerID, 'visibility', 'visible')
            });
        }
        else {
            ElMessage('map not loaded!')
        }
    }


}