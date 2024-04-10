import { ElMessage } from 'element-plus'
import mapboxgl from 'mapbox-gl'
import BackEndRequest from '../../api/backend.js'
import {
    loadImage,
    pulsing,
    addMarkerToMap,
    getCenterCoord,
    createPopUp,
} from '../../utils/mapUtils.js'
import { useSceneStore } from '../../store/mapStore.js'
import { useLayerStore } from '../../store/mapStore.js'
import TerrainLayer from '../../utils/m_demLayer/terrainLayer.js'
import SteadyFlowLayer from '../../utils/m_demLayer/steadyFlowLayer.js'
// BackEndRequest.getDataNodeData()

let terrainLayer = new TerrainLayer(14)
let flow = new SteadyFlowLayer()

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
        this.data.forEach((element) => {
            let coords = this.getCoordFunc(element)
            let feature = {
                type: 'Feature',
                properties: element,
                geometry: {
                    coordinates: coords,
                    type: this.type,
                },
            }
            features.push(feature)
        })
        const geojson = {
            type: 'FeatureCollection',
            features: features,
        }
        return geojson
    }

    static getDifChannelData(geojson) {
        const features = geojson['features']
        let builtFeatures = []
        let buildingFeatures = []
        let planningFeatures = []
        features.forEach((feat) => {
            switch (feat['properties']['type']) {
                case '在建通道':
                    buildingFeatures.push(feat)
                    break
                case '已建通道':
                    builtFeatures.push(feat)
                    break
                case '规划通道':
                    planningFeatures.push(feat)
                    break
                default:
                    break
            }
        })
        return {
            built: {
                type: 'FeatureCollection',
                features: builtFeatures,
            },
            building: {
                type: 'FeatureCollection',
                features: buildingFeatures,
            },
            planning: {
                type: 'FeatureCollection',
                features: planningFeatures,
            },
        }
    }
    static getDifBankData(geojson) {
        const features = geojson['features']
        let level1 = []
        let level2 = []
        let level3 = []
        features.forEach((feat) => {
            switch (feat['properties']['warningLevel']) {
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
                type: 'FeatureCollection',
                features: level1,
            },
            level2: {
                type: 'FeatureCollection',
                features: level2,
            },
            level3: {
                type: 'FeatureCollection',
                features: level3,
            },
        }
    }
    static getDifMonitorData(geojson) {
        const features = geojson['features']
        let gnss = []
        let incline = []
        let manometer = [] //压力计
        let stress = [] // 应力桩
        features.forEach((feat) => {
            switch (feat['properties']['type']) {
                case '1':
                    gnss.push(feat)
                    break
                case '2':
                    incline.push(feat)
                    break
                case '3':
                    manometer.push(feat)
                    break
                case '4':
                    stress.push(feat)
                    break
                default:
                    break
            }
        })
        return {
            gnss: {
                type: 'FeatureCollection',
                features: gnss,
            },
            incline: {
                type: 'FeatureCollection',
                features: incline,
            },
            stress: {
                type: 'FeatureCollection',
                features: stress,
            },
            manometer: {
                type: 'FeatureCollection',
                features: manometer,
            },
        }
    }
}

const generateGeoJson = (itemArr, getCoords, type) => {
    const features = []
    itemArr.forEach((element) => {
        let coords = getCoords(element)
        let feature = {
            type: 'Feature',
            properties: element,
            geometry: {
                coordinates: coords,
                type: type,
            },
        }
        features.push(feature)
    })
    const geojson = {
        type: 'FeatureCollection',
        features: features,
    }
    return geojson
}

const initLayers = async (sceneInstance, map) => {
    let popUp = createPopUp()
    switch (sceneInstance.title) {
        /////Large Scene
        case '过江通道':
            let channel = new DataPioneer(
                '过江通道',
                (e) => e['llCoords'],
                'LineString',
            )
            await channel.requestData(BackEndRequest.getChannelData)
            const { built, building, planning } = DataPioneer.getDifChannelData(
                channel.origin2geojson(),
            )
            map.addSource('channel-built-source', {
                type: 'geojson',
                data: built,
            })
            map.addSource('channel-building-source', {
                type: 'geojson',
                data: building,
            })
            map.addSource('channel-planning-source', {
                type: 'geojson',
                data: planning,
            })
            sceneInstance.layerSrc.push(
                'channel-built-source',
                'channel-building-source',
                'channel-planning-source',
            )

            map.addLayer({
                id: '已建通道',
                type: 'line',
                source: 'channel-built-source',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': 'rgb(121, 164, 35)',
                    'line-opacity': 1,
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        5,
                        22,
                        20,
                    ],
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'line-round-limit': 2,
                },
            })
            map.addLayer({
                id: '在建通道',
                type: 'line',
                source: 'channel-building-source',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': 'rgb(204, 102, 0)',
                    'line-opacity': 1,
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        5,
                        22,
                        20,
                    ],
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'line-round-limit': 2,
                },
            })
            map.addLayer({
                id: '规划通道',
                type: 'line',
                source: 'channel-planning-source',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': 'rgb(51, 204, 153)',
                    'line-opacity': 1,
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        5,
                        22,
                        20,
                    ],
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'line-round-limit': 2,
                },
            })
            sceneInstance.allLayers.push('已建通道', '在建通道', '规划通道')

            popUp = createPopUp()
            channel.data.forEach((item) => {
                let centerCoord = getCenterCoord(item['llCoords'])
                if (item.type === '在建通道') {
                    addMarkerToMap(
                        map,
                        centerCoord,
                        'building-marker',
                        '/icons/building.png',
                        popUp,
                        item,
                    )
                } else if (item.type === '规划通道') {
                    addMarkerToMap(
                        map,
                        centerCoord,
                        'planning-marker',
                        '/icons/planing.png',
                        popUp,
                        item,
                    )
                }
            })

            break
        case '预警岸段':
            let bankData = new DataPioneer(
                '典型崩岸',
                (e) => e['coord'],
                'LineString',
            )
            await bankData.requestData(BackEndRequest.getbankLineData)

            const { level1, level2, level3 } = DataPioneer.getDifBankData(
                bankData.origin2geojson(),
            )
            map.addSource('bank-level1-source', {
                type: 'geojson',
                data: level1,
            })
            map.addSource('bank-level2-source', {
                type: 'geojson',
                data: level2,
            })
            map.addSource('bank-level3-source', {
                type: 'geojson',
                data: level3,
            })
            sceneInstance.layerSrc.push(
                'bank-level1-source',
                'bank-level2-source',
                'bank-level3-source',
            )

            await loadImage(map, './geoStyle/warning1.png', 'warning1')
            map.addLayer({
                id: '一级预警岸段',
                type: 'line',
                source: 'bank-level1-source',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': 'rgb(121, 164, 35)',
                    'line-opacity': 1,
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        5,
                        22,
                        20,
                    ],
                    'line-pattern': 'warning1',
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'line-round-limit': 2,
                },
            })

            await loadImage(map, './geoStyle/warning2.png', 'warning2')
            map.addLayer({
                id: '二级预警岸段',
                type: 'line',
                source: 'bank-level2-source',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': 'rgb(121, 164, 35)',
                    'line-opacity': 1,
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        5,
                        22,
                        20,
                    ],
                    'line-pattern': 'warning2',
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'line-round-limit': 2,
                },
            })

            await loadImage(map, './geoStyle/warning3.png', 'warning3')
            map.addLayer({
                id: '三级预警岸段',
                type: 'line',
                source: 'bank-level3-source',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': 'rgb(121, 164, 35)',
                    'line-opacity': 1,
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        5,
                        22,
                        20,
                    ],
                    'line-pattern': 'warning3',
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'line-round-limit': 2,
                },
            })
            sceneInstance.allLayers.push(
                '一级预警岸段',
                '二级预警岸段',
                '三级预警岸段',
            )

            // add marker here

            let count = 0
            bankData.data.forEach((item) => {
                let centerCoord = getCenterCoord(item['coord'])

                if (item.warningLevel === 1) {
                    addMarkerToMap(
                        map,
                        centerCoord,
                        'warning1-marker',
                        '/icons/warning3.png',
                        popUp,
                        item,
                    )
                    count++
                }
                // else if (item.warningLevel === 2) {
                //     addMarkerToMap(map, centerCoord, item['id'], '/icons/warning2.png', popUp, item)
                // }
                // else if (item.warningLevel === 3) {
                //     addMarkerToMap(map, centerCoord, item['id'], '/icons/warning1.png', popUp, item)
                // }
            })
            break

        case '全江地形':
            map.addSource('river-terrain-source', {
                type: 'vector',
                tiles: [
                    'http://127.0.0.1:8989/api/v1/tile/vector/riverBg/{x}/{y}/{z}',
                ],
            })
            map.addLayer({
                id: '全江地形',
                type: 'fill',
                source: 'river-terrain-source',
                'source-layer': 'default',
                paint: {
                    'fill-color': [
                        'match',
                        ['get', 'height'],
                        0,
                        '#3EFA13',
                        5,
                        '#51E212',
                        10,
                        '#65CA11',
                        15,
                        '#78B210',
                        20,
                        '#8B9A0F',
                        25,
                        '#9F820F',
                        30,
                        '#B26A0E',
                        35,
                        '#C5520D',
                        40,
                        '#C5520D',
                        45,
                        '#D83A0C',
                        50,
                        '#EC220B',
                        '#000000'
                    ],
                    // 'fill-color': '#3EFA13'
                },
            })


            map.addSource('riverSectionLabelSource', {
                type: 'vector',
                tiles: [
                    'http://127.0.0.1:8989/api/v1/tile/vector/riverSection/{x}/{y}/{z}',
                ],
            })
            map.addSource('riverLabelSource', {
                type: 'vector',
                tiles: [
                    'http://127.0.0.1:8989/api/v1/tile/vector/riverName/{x}/{y}/{z}',
                ],
            })

            map.addLayer({
                id: 'riverSectionLabel',
                type: 'line',
                source: 'riverSectionLabelSource',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': 'rgba(231, 214, 86, 0.9)',
                    'line-width': 4,
                },
            })
            map.addLayer({
                id: 'riverLabel',
                type: 'symbol',
                source: 'riverLabelSource',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': '#FC7C49',
                },
            })

            // map.addSource('riverLand', {
            //     type: 'vector',
            //     tiles: [
            //         'http://127.0.0.1:8989/api/v1/tile/vector/riverLand/{x}/{y}/{z}',
            //     ],
            // })
            // map.addLayer({
            //     id: 'land1',
            //     type: 'fill',
            //     source: 'riverLand',
            //     'source-layer': 'default',
            //     paint: {
            //         'fill-color': '#000000',
            //     },
            // })

            const el = document.createElement('div')
            el.style.width = '35px'
            el.style.height = '35px'
            const marker = new mapboxgl.Marker({
                element: el,
                rotationAlignment: 'horizon',
            })

            map.on('click', '全江地形', (e) => {
                map.getCanvas().style.cursor = 'pointer'
                const feature = e.features[0];
                el.textContent = feature["properties"]["height"]
                marker
                    .setLngLat(e.lngLat)
                    .addTo(map);
            })
            map.on('mousemove', '全江地形', (e) => {
                map.getCanvas().style.cursor = 'pointer'
            })
            map.on('mouseleave', '全江地形', (e) => {
                map.getCanvas().style.cursor = ''
            })

            // sceneInstance.allLayers.push('全江地形')

            break

        
        case '水利一张图':
            // map.addSource('wms', {
            //     'type':'raster',
            //     'tiles':[
            //         // "http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_L3_L17/MapServer/tile/{z}/{y}/{x}"
            //         // `/waterServer/arcgis/rest/services/jssl_vector_L3_L17/MapServer/tile/{z}/{y}/{x}`
            //         "/waterServer/arcgis/services/jssl_vector_L3_L17/MapServer/WMSServer?request=GetCapabilities&service=WMS&srs=EPSG:3857&format=image/png"
            //     ],
                
            // })
            // map.addLayer({
            //     id:'wms',
            //     'type':'raster',
            //     'source':'wms',
            //     'paint':{
            //         // 'raster-opacity':0.0
            //     }
            // })

            break;
            
        /////small Scene
        case '实时监测设备':
            let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
            let monitorDevice = generateGeoJson(
                monitorInfo,
                (element) => {
                    return [element['longitude'], element['latitude']]
                },
                'Point',
            )
            // debugger
            const { gnss, incline, stress, manometer } =
                DataPioneer.getDifMonitorData(monitorDevice)

            map.addSource('gnss-source', {
                type: 'geojson',
                data: gnss,
            })
            map.addSource('incline-source', {
                type: 'geojson',
                data: incline,
            })
            map.addSource('stress-source', {
                type: 'geojson',
                data: stress,
            })
            map.addSource('manometer-source', {
                type: 'geojson',
                data: manometer,
            })
            sceneInstance.layerSrc.push(
                'gnss-source',
                'incline-source',
                'stress-source',
                'manometer-source',
            )
            !map.hasImage('pulsing-dot-gnss') &&
                map.addImage('pulsing-dot-gnss', pulsing.point, {
                    pixelRatio: 1,
                })
            !map.hasImage('pulsing-rect-incline') &&
                map.addImage('pulsing-rect-incline', pulsing.rectangle, {
                    pixelRatio: 1,
                })
            !map.hasImage('pulsing-tri-stress') &&
                map.addImage('pulsing-tri-stress', pulsing.diamond, {
                    pixelRatio: 1,
                })
            !map.hasImage('pulsing-dia-manometer') &&
                map.addImage('pulsing-dia-manometer', pulsing.triangle, {
                    pixelRatio: 1,
                })
            map.addLayer({
                id: 'GNSS',
                type: 'symbol',
                source: 'gnss-source',
                layout: {
                    'icon-image': 'pulsing-dot-gnss',
                    'icon-allow-overlap': true,
                },
            })
            map.addLayer({
                id: '测斜仪',
                type: 'symbol',
                source: 'incline-source',
                layout: {
                    'icon-image': 'pulsing-rect-incline',
                    'icon-allow-overlap': true,
                },
            })
            map.addLayer({
                id: '孔隙水压力计',
                type: 'symbol',
                source: 'manometer-source',
                layout: {
                    'icon-image': 'pulsing-dia-manometer',
                    'icon-allow-overlap': true,
                },
            })
            map.addLayer({
                id: '应力桩',
                type: 'symbol',
                source: 'stress-source',
                layout: {
                    'icon-image': 'pulsing-tri-stress',
                    'icon-allow-overlap': true,
                },
            })

            sceneInstance.allLayers.push(
                'GNSS',
                '测斜仪',
                '孔隙水压力计',
                '应力桩',
            )
            break

        case '岸段聚合场景':
            // sceneInstance.terrainLayer = terrainLayer
            // sceneInstance.flowLayer = flow
            if (map.getLayer('TerrainLayer')) terrainLayer.show()
            else map.addLayer(terrainLayer)
            useLayerStore().setTerrainLayer(terrainLayer)

            if (map.getLayer('FlowLayer')) flow.show()
            else map.addLayer(flow)
            useLayerStore().setFlowLayer(flow)

            sceneInstance.allLayers.push('TerrainLayer', 'FlowLayer')
            map.triggerRepaint()
            break
        // case '水利一张图':
        //     // console.log('123213123')
        //     // map.addLayer(flow)
        //     // flow.show()
        //     // sceneInstance.allLayers.push('FlowLayer')
        //     break
        default:
            console.log('wait developing...')
            ElMessage('wait developing...')
            break
    }
    /*
  // Add a new vector tile source with ID 'mapillary'.
        map.addSource('mapillary', {
            'type': 'vector',
            'tiles': [
                'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|4142433049200173|72206abe5035850d6743b23a49c41333'
            ],
            'minzoom': 6,
            'maxzoom': 14
        });
        map.addLayer(
            {
                'id': 'mapillary', // Layer ID
                'type': 'line',
                'source': 'mapillary', // ID of the tile source created above
                // Source has several layers. We visualize the one with name 'sequence'.
                'source-layer': 'sequence',
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-opacity': 0.6,
                    'line-color': 'rgb(53, 175, 109)',
                    'line-width': 2
                }
            },
            'road-label-simple' // Arrange our new layer beneath labels and above roads
        );




    */

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
    const sceneStore = useSceneStore()
    sceneStore.setSelectedScene(sceneInstance)
}

// Scene
class Scene {
    constructor() {
        //规范
        this.title = ''
        this.desc = ''
        this.iconSrc = ''
        this.layerSrc = [] //only id
        this.allLayers = [] //only id
        this.markers = []
    }
    async initAllLayers(map) {
        // question！！！
        // prepare for layer source, add Layers and all visible
        // if (map.loaded()) {
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

        var invisibleLayers = this.allLayers.filter(
            (v) => !showArrays.includes(v),
        )
        invisibleLayers.forEach((layerID) => {
            map.setLayoutProperty(layerID, 'visibility', 'none')
        })

        showArrays.forEach((layerID) => {
            map.setLayoutProperty(layerID, 'visibility', 'visible')
        })
        // }
        // else {
        //     ElMessage('map not loaded!')
        // }
    }

    removeLayers(map) {
        // when scene checkout
        // if (map.loaded()) {
        //remove layer , remove source
        this.allLayers.forEach((layerID) => {
            if (layerID === 'TerrainLayer') {
                terrainLayer.hide()
            } else if (layerID === 'FlowLayer') {
                flow.hide()
            } else map.getLayer(layerID) && map.removeLayer(layerID)
        })
        this.allLayers = []

        // source 是否需要删除？
        this.layerSrc.forEach((sourceID) => {
            map.getSource(sourceID) && map.removeSource(sourceID)
        })
        this.layerSrc = []

        //hide marker
        let markersDoms = document.getElementsByClassName(
            'mapboxgl-marker mapboxgl-marker-anchor-center',
        )
        for (let i = markersDoms.length - 1; i >= 0; i--) {
            markersDoms[i].remove()
        }

        // }
        // else {
        //     ElMessage('map not loaded!')
        // }
    }
}
const getBigRangeScenes = () => {
    let bigRangeScenes = []
    let scene3 = new Scene()
    scene3.title = '过江通道'
    scene3.desc = '展示三类过江通道,助力有关规划决策.'
    scene3.iconSrc = './icons/gate.png'

    let scene4 = new Scene()
    scene4.title = '实时水情'
    scene4.desc = '反映当前水域的水位、流速等信息，用于水资源管理和调度.'
    scene4.iconSrc = './icons/water-drop.png'

    let scene1 = new Scene()
    scene1.title = '水利一张图'
    scene1.desc = '展示关键水利工程信息。'
    scene1.iconSrc = './icons/beach.png'

    let scene2 = new Scene()
    scene2.title = '河湖码头'
    scene2.desc = '展示河湖码头信息，助力水资源管理和调度。'
    scene2.iconSrc = './icons/pier.png'

    let typiclaCollapse = new Scene()
    typiclaCollapse.title = '预警岸段'
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
        ; (chongy.desc = '呈现整个江河岸段的冲淤情况'),
            (chongy.iconSrc = './icons/shore.png')

    bigRangeScenes.push(
        typiclaCollapse,
        scene3,
        terrain,
        scene1,
        scene4,
        scene2,
        warningArea,
        chongy,
    )
    return bigRangeScenes
}
const getSmallRangeScenes = () => {
    let smallRangeScenes = []

    let aggregationScene = new Scene()
    aggregationScene.title = '岸段聚合场景'
    aggregationScene.desc = '描绘典型崩岸地貌，用于分析地质特征和防范措施.'
    aggregationScene.iconSrc = './icons/collapse.png'

    let watching = new Scene()
    watching.title = '实时监测设备'
    watching.desc = '监测数据可视化,监测设备管理'
    watching.iconSrc = './icons/watching.png'

    smallRangeScenes.push(aggregationScene, watching)

    return smallRangeScenes
}

const mapboxAddLayer = (scene, source) => { }

export { Scene, getBigRangeScenes, getSmallRangeScenes, initLayers }
