import { ElMessage } from "element-plus"
import mapboxgl from "mapbox-gl"
import BackEndRequest from '../../api/backend.js'

// BackEndRequest.getDataNodeData()

// Data Prepare
class DataPioneer {

    constructor(name, getCoordFunc, geometryType) {
        this.name = name
        this.getCoordFunc = getCoordFunc
        this.geometryType = geometryType
        this.type = geometryType
    }

    async requestData(requestFunc) {
        this.data = (await requestFunc()).data
    }

    origin2geojson() {
        // only point,line,polygon
        if (!this.data) return
        const features = []
        this.data.forEach(element => {
            let coords = this.getCoordFunc(element);
            let feature = {
                'type': 'Feature',
                'properties': element,
                'geometry': {
                    'coordinates': coords,
                    'type': this.type
                }
            }
            features.push(feature)
        });
        const geojson = {
            'type': 'FeatureCollection',
            'features': features
        }
        return geojson
    }
}

const getDifChannelData = (geojson) => {
    const features = geojson['features']
    let builtFeatures = []
    let buildingFeatures = []
    let planningFeatures = []
    features.forEach((feat) => {
        switch (feat["properties"]["type"]) {
            case "在建通道":
                buildingFeatures.push(feat)
                break
            case "已建通道":
                builtFeatures.push(feat)
                break
            case "规划通道":
                planningFeatures.push(feat)
                break
            default:
                break
        }
    })
    return {
        built: {
            'type': 'FeatureCollection',
            'features': builtFeatures
        },
        building: {
            'type': 'FeatureCollection',
            'features': buildingFeatures
        },
        planning: {
            'type': 'FeatureCollection',
            'features': planningFeatures
        }
    }
}
const getDifBankData = (geojson) => {
    const features = geojson['features']
    let level1 = []
    let level2 = []
    let level3 = []
    features.forEach((feat) => {
        switch (feat["properties"]["warningLevel"]) {
            case 1:
                level1.push(feat)
                break
            case 2:
                level2.push(feat)
                break
            case 3:
                level3.push(feat)
                break
            default:
                break
        }
    })
    return {
        level1: {
            'type': 'FeatureCollection',
            'features': level1
        },
        level2: {
            'type': 'FeatureCollection',
            'features': level2
        },
        level3: {
            'type': 'FeatureCollection',
            'features': level3
        }
    }
}


const initLayers = async (sceneInstance, map) => {
    switch (sceneInstance.title) {
        case '过江通道':
            let channel = new DataPioneer('过江通道', e => e['llCoords'], 'LineString')
            await channel.requestData(BackEndRequest.getChannelData)
            const { built, building, planning } = getDifChannelData(channel.origin2geojson())
            sceneInstance.layerSrc.push('channel-built-source', 'channel-building-source', 'channel-planning-source')
            map.addSource('channel-built-source', {
                'type': 'geojson',
                'data': built
            });
            map.addSource('channel-building-source', {
                'type': 'geojson',
                'data': building
            });
            map.addSource('channel-planning-source', {
                'type': 'geojson',
                'data': planning
            });
            sceneInstance.allLayers.push('已建通道', '在建通道', '规划通道')
            map.addLayer({
                'id': '已建通道',
                'type': 'line',
                'source': 'channel-built-source',
                'layout': { 'line-join': 'round', 'line-cap': 'round', },
                "paint": {
                    "line-color": "rgb(121, 164, 35)",
                    "line-opacity": 1,
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 5, 22, 20
                    ]
                },
                "layout": {
                    "line-cap": "round",
                    "line-join": "round",
                    "line-round-limit": 2
                }
            })
            map.addLayer({
                'id': '在建通道',
                'type': 'line',
                'source': 'channel-building-source',
                'layout': { 'line-join': 'round', 'line-cap': 'round', },
                "paint": {
                    "line-color": "rgb(204, 102, 0)",
                    "line-opacity": 1,
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 5, 22, 20
                    ]
                },
                "layout": {
                    "line-cap": "round",
                    "line-join": "round",
                    "line-round-limit": 2
                }
            })
            map.addLayer({
                'id': '规划通道',
                'type': 'line',
                'source': 'channel-planning-source',
                'layout': { 'line-join': 'round', 'line-cap': 'round', },
                "paint": {
                    "line-color": "rgb(51, 204, 153)",
                    "line-opacity": 1,
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 5, 22, 20
                    ]
                },
                "layout": {
                    "line-cap": "round",
                    "line-join": "round",
                    "line-round-limit": 2
                }
            })


            break;
        case '预警岸段':

            let bankData = new DataPioneer('典型崩岸', e => e['coord'], 'LineString')
            await bankData.requestData(BackEndRequest.getbankLineData)
            const { level1, level2, level3 } = getDifBankData(bankData.origin2geojson())
            sceneInstance.layerSrc.push('bank-level1-source', 'bank-level2-source', 'bank-level3-source')
            map.addSource('bank-level1-source', {
                'type': 'geojson',
                'data': level1
            });
            map.addSource('bank-level2-source', {
                'type': 'geojson',
                'data': level2
            });
            map.addSource('bank-level3-source', {
                'type': 'geojson',
                'data': level3
            });
            sceneInstance.allLayers.push('一级预警岸段', '二级预警岸段', '三级预警岸段')

            map.loadImage('./geoStyle/test.png', (error, image) => {
                if (error) throw error;
                !map.hasImage('warning1')&&map.addImage('warning1', image);
                map.addLayer({
                    'id': '一级预警岸段',
                    'type': 'line',
                    'source': 'bank-level1-source',
                    'layout': { 'line-join': 'round', 'line-cap': 'round', },
                    "paint": {
                        "line-color": "rgb(121, 164, 35)",
                        "line-opacity": 1,
                        "line-width": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7, 5, 22, 20
                        ],
                        "line-pattern": "warning1"
                    },
                    "layout": {
                        "line-cap": "round",
                        "line-join": "round",
                        "line-round-limit": 2
                    }
                })


            });
            map.loadImage('./geoStyle/warning2.png', (error, image) => {
                if (error) throw error;
                !map.hasImage('warning2')&&map.addImage('warning2', image);
                map.addLayer({
                    'id': '二级预警岸段',
                    'type': 'line',
                    'source': 'bank-level2-source',
                    'layout': { 'line-join': 'round', 'line-cap': 'round', },
                    "paint": {
                        "line-color": "rgb(121, 164, 35)",
                        "line-opacity": 1,
                        "line-width": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7, 5, 22, 20
                        ],
                        "line-pattern": "warning2"
                    },
                    "layout": {
                        "line-cap": "round",
                        "line-join": "round",
                        "line-round-limit": 2
                    }
                })


            });
            map.loadImage('./geoStyle/warning3.png', (error, image) => {
                if (error) throw error;
                !map.hasImage('warning3')&&map.addImage('warning3', image);
                map.addLayer({
                    'id': '三级预警岸段',
                    'type': 'line',
                    'source': 'bank-level3-source',
                    'layout': { 'line-join': 'round', 'line-cap': 'round', },
                    "paint": {
                        "line-color": "rgb(121, 164, 35)",
                        "line-opacity": 1,
                        "line-width": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7, 5, 22, 20
                        ],
                        "line-pattern": "warning3"
                    },
                    "layout": {
                        "line-cap": "round",
                        "line-join": "round",
                        "line-round-limit": 2
                    }
                })
            });



            break;
        default:
            ElMessage('wait developing...')
            break;
    }

    // console.log('111');
    // map.addSource('wms-test-source', {
    //     'type': 'raster',
    //     'tiles': [
    //         // 'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'
    //         'http://support.supermap.com:8090/iserver/services/map-china400/wms111/China'
    //     ],
    //     'tileSize': 256
    // });
    // map.addLayer(
    //     {
    //         'id': 'wms-test-layer',
    //         'type': 'raster',
    //         'source': 'wms-test-source',
    //         'paint': {}
    //     },
    //     'building' // Place layer under labels, roads and buildings.
    // );



}




// Scene
class Scene {
    constructor() {
        //规范
        this.title = ''
        this.desc = ''
        this.iconSrc = ''
        this.layerSrc = []
        this.allLayers = []


    }
    async initAllLayers(map) {

        // question！！！
        // prepare for layer source, add Layers and all visible
        // console.log(111);
        // if (map.loaded()) {
        //     console.log(1111);
        //     await initLayers(this, map)
        // }
        // else {
        //     console.log(1112,map.loaded());
        //     map.on('load', async () => {
        //         console.log('11122');
        //         await initLayers(this, map)

        //     })
        // }
        await initLayers(this, map)
    }



    showLayers(map, showArrays) {
        // show layers based showArrys
        // if (map.loaded()) {

        var invisibleLayers = this.allLayers.filter(v => !showArrays.includes(v))
        invisibleLayers.forEach(layerID => {
            map.setLayoutProperty(layerID, 'visibility', 'none')
        })

        showArrays.forEach(layerID => {
            map.setLayoutProperty(layerID, 'visibility', 'visible')
        });
        // }
        // else {
        //     ElMessage('map not loaded!')
        // }
    }

    removeLayers(map) {
        // when scene checkout
        // if (map.loaded()) {
        //remove layer , remove source
        this.allLayers.forEach(layerID => {
            map.getLayer(layerID) && map.removeLayer(layerID);
        })
        this.allLayers = []

        this.layerSrc.forEach(sourceID => {
            map.getSource(sourceID) && map.removeSource(sourceID);
        })
        this.layerSrc = []
        // }
        // else {
        //     ElMessage('map not loaded!')
        // }
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
    typiclaCollapse.title = '预警岸段';
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


const mapboxAddLayer = (scene, source) => {

}











export {
    Scene,
    getBigRangeScenes,
    getSmallRangeScenes,
    initLayers
}