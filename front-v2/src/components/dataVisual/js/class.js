import { layerAddFunction, layerRemoveFunction } from "../layerUtil"

class LayerGroup {
    constructor(title, layerIDs, map = undefined) {
        this.map = map
        this.title = title
        this.active = false
        this.layerIDs = layerIDs
    }

    setMap(mapInstance) {
        this.map = mapInstance
    }

    async showLayer() {
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                await layerAddFunction(this.map, this.layerIDs[i])
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }

    async hideLayer() {
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                layerRemoveFunction(this.map, this.layerIDs[i])
            }
            this.active = false
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }
}

class LayerScene {
    constructor(title, LayerGroups, map = undefined) {
        this.map = map
        this.title = title
        this.LayerGroups = LayerGroups
        this.active = false
    }

    setMap(mapInstance) {
        this.map = mapInstance
    }

    async showScene() {
        if (this.map) {
            for (let i = 0; i < this.LayerGroups.length; i++) {
                await this.LayerGroups[i].showLayer()
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }

    }

    async hideScene() {
        if (this.map) {
            for (let i = 0; i < this.LayerGroups.length; i++) {
                this.LayerGroups[i].hideLayer()
            }
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }
}

const layerGroupMap = {
    '行政区划': [],
    '河道分段': [],
    '流域水系': [],
    '湖泊河流': [],
    '水文站点': [],
    '长江堤防': [],
    '过江通道': [],
    '沿江码头': [],
    '大型枢纽': [],
    '水库大坝': [],
    '水闸工程': [],
    '泵站工程': [],
    '组合工程': [],
    '岸段名录': [],
    '历史崩岸': [],
    '近岸地形': [],
    '近年冲淤': [],
}