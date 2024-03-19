import { ElMessage } from "element-plus"
import mapboxgl from "mapbox-gl"
import BackEndRequest from '../../api/backend.js'


class Scene {
    constructor() {
        //规范
        this.map = undefined
        this.title = ''
        this.desc = ''
        this.iconSrc = ''
        this.allLayers = []
        this.layerResourceMap = {}  // 'layerid':{ 'sourceURL':srcurl, 'sourceID':srcid, 'sourcetType':type }

    }
    /*
    async initAllLayers() {

        // prepare for layer source, add Layers and all visible
        if (this.map.loaded()) {

        }
        else {
            this.map.on('load', async () => {

            })
        }
    }
    */

    showLayers(map, showArrays) {
        console.log(this.title + ' showLayer!');
        // show layers based showArrys
        if (map.loaded()) {

            var invisibleLayers = this.allLayers.filter(v => !showArrays.includes(v))
            invisibleLayers.forEach(layerID => {
                map.setLayoutProperty(layerID, 'visibility', 'none')
            })

            showArrays.forEach(layerID => {
                map.setLayoutProperty(layerID, 'visibility', 'visible')
            });
        }
        else {
            ElMessage('map not loaded!')
        }
    }

    removeLayers(map) {
        console.log(this.title + ' remove!');
        // when scene checkout
        if (map.loaded()) {

            //remove layer , remove source
            this.allLayers.forEach(layerID => {
                map.getLayer(layerID) && map.removeLayer(layerID);
                let sourceID = this.layerResourceMap['layerID']['sourceID']
                map.getSource(sourceID) && this.map.removeSource(sourceID);
            })
        }
        else {
            ElMessage('map not loaded!')
        }
    }
}

const getBigRangeScenes = () => {
    let bigRangeScenes = []
    let scene3 = new Scene()
    scene3.title = '过江通道';
    scene3.desc = '展示三类过江通道,助力有关规划决策.'
    scene3.iconSrc = './icons/gate.png'


    let scene4 = new Scene()
    scene4.title = '实时水情';
    scene4.desc = '反映当前水域的水位、流速等信息，用于水资源管理和调度.'
    scene4.iconSrc = './icons/water-drop.png'


    let scene1 = new Scene()
    scene1.title = '水利一张图';
    scene1.desc = '展示关键水利工程信息。'
    scene1.iconSrc = './icons/beach.png'


    let scene2 = new Scene()
    scene2.title = '河湖码头';
    scene2.desc = '展示河湖码头信息，助力水资源管理和调度。'
    scene2.iconSrc = './icons/pier.png'

    let typiclaCollapse = new Scene()
    typiclaCollapse.title = '典型崩岸';
    typiclaCollapse.desc = '描绘典型崩岸地貌，用于分析地质特征和防范措施.'
    typiclaCollapse.iconSrc = './icons/collapse.png'


    let warningArea = new Scene()
    warningArea.title = '预警分区'
    warningArea.desc = '标示潜在灾害风险区域，帮助提前预警和应对应急情况.'
    warningArea.iconSrc = './icons/warning.png'

    let terrain = new Scene()
    terrain.title = '全江地形'
    terrain.desc = '呈现整个江河的地形高低变化，为水文分析提供基础数据.'
    terrain.iconSrc = './icons/terrain.png'

    let chongy = new Scene()
    chongy.title = '平面冲淤'
    chongy.desc = '呈现整个江河岸段的冲淤情况',
        chongy.iconSrc = './icons/shore.png'


    bigRangeScenes.push(typiclaCollapse, scene3, scene1, scene4, scene2, warningArea, terrain, chongy)
    return bigRangeScenes
}


const getSmallRangeScenes = () => {
    let smallRangeScenes = []

    let aggregationScene = new Scene()
    aggregationScene.title = '岸段聚合场景';
    aggregationScene.desc = '描绘典型崩岸地貌，用于分析地质特征和防范措施.'
    aggregationScene.iconSrc = './icons/collapse.png'

    let watching = new Scene()
    watching.title = '实时监测数据'
    watching.desc = '监测数据可视化,监测设备管理'
    watching.iconSrc = './icons/watching.png'

    smallRangeScenes.push(aggregationScene, watching)

    return smallRangeScenes
}


const initLayer = async (sceneInstance) => {
    console.log('init layer for ', sceneInstance.title)
    switch (sceneInstance.title){
        case '典型崩岸':

            break;
  
        default:
            ElMessage('wait developing...')
            break;
    }
}




export {
    Scene,
    getBigRangeScenes,
    getSmallRangeScenes,
    initLayer
}