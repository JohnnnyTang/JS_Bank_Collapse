import { ElMessage } from 'element-plus'
import mapboxgl from 'mapbox-gl'
import { ref } from 'vue'
import {
    loadImage,
    pulsing,
    addMarkerToMap,
    getCenterCoord,
    createPopUp,
} from '../../utils/mapUtils.js'
import { useSceneStore, useMapLayerStore, useLayerStore } from '../../store/mapStore.js'
import TerrainLayer from '../../utils/m_demLayer/terrainLayer.js'
import SteadyFlowLayer from '../../utils/m_demLayer/steadyFlowLayer.js'
import { layers as ALL_LAYERS, layerAddFunctionMap as LAYER_FUNCTION_MAP } from './layerUtil.js'


// BackEndRequest.getDataNodeData()

let terrainLayer = new TerrainLayer(14)
let flow = new SteadyFlowLayer()
let refHeight = ref('')
let sectionName = ref('')


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
                case '4':
                    incline.push(feat)
                    break
                case '3':
                    manometer.push(feat)
                    break
                case '2':
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
    static generateGeoJson(itemArr, getCoords, type) {
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

}



let globalpopup = null
const initLayers = async (sceneInstance, map) => {

    let { popUp, componentInstance } = createPopUp(refHeight, sectionName)
    globalpopup = popUp

    switch (sceneInstance.title) {
        //#region old
        /////Large Scene
        // case '过江通道':
        //     let channel = new DataPioneer(
        //         '过江通道',
        //         (e) => e['llCoords'],
        //         'LineString',
        //     )
        //     await channel.requestData(BackEndRequest.getChannelData)
        //     const { built, building, planning } = DataPioneer.getDifChannelData(
        //         channel.origin2geojson(),
        //     )
        //     map.addSource('channel-built-source', {
        //         type: 'geojson',
        //         data: built,
        //     })
        //     map.addSource('channel-building-source', {
        //         type: 'geojson',
        //         data: building,
        //     })
        //     map.addSource('channel-planning-source', {
        //         type: 'geojson',
        //         data: planning,
        //     })
        //     sceneInstance.layerSrc.push(
        //         'channel-built-source',
        //         'channel-building-source',
        //         'channel-planning-source',
        //     )

        //     map.addLayer({
        //         id: '已建通道',
        //         type: 'line',
        //         source: 'channel-built-source',
        //         layout: { 'line-join': 'round', 'line-cap': 'round' },
        //         paint: {
        //             'line-color': 'rgb(121, 164, 35)',
        //             'line-opacity': 1,
        //             'line-width': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 5,
        //                 22,
        //                 20,
        //             ],
        //         },
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //             'line-round-limit': 2,
        //         },
        //     })
        //     map.addLayer({
        //         id: '在建通道',
        //         type: 'line',
        //         source: 'channel-building-source',
        //         layout: { 'line-join': 'round', 'line-cap': 'round' },
        //         paint: {
        //             'line-color': 'rgb(204, 102, 0)',
        //             'line-opacity': 1,
        //             'line-width': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 5,
        //                 22,
        //                 20,
        //             ],
        //         },
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //             'line-round-limit': 2,
        //         },
        //     })
        //     map.addLayer({
        //         id: '规划通道',
        //         type: 'line',
        //         source: 'channel-planning-source',
        //         layout: { 'line-join': 'round', 'line-cap': 'round' },
        //         paint: {
        //             'line-color': 'rgb(51, 204, 153)',
        //             'line-opacity': 1,
        //             'line-width': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 5,
        //                 22,
        //                 20,
        //             ],
        //         },
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //             'line-round-limit': 2,
        //         },
        //     })
        //     sceneInstance.allLayers.push('已建通道', '在建通道', '规划通道')

        //     channel.data.forEach((item) => {
        //         let centerCoord = getCenterCoord(item['llCoords'])
        //         if (item.type === '在建通道') {
        //             addMarkerToMap(
        //                 map,
        //                 centerCoord,
        //                 'building-marker',
        //                 '/icons/building.png',
        //                 popUp,
        //                 item,
        //             )
        //         } else if (item.type === '规划通道') {
        //             addMarkerToMap(
        //                 map,
        //                 centerCoord,
        //                 'planning-marker',
        //                 '/icons/planing.png',
        //                 popUp,
        //                 item,
        //             )
        //         }
        //     })

        //     break
        // case '预警岸段':
        //     let bankData = new DataPioneer(
        //         '典型崩岸',
        //         (e) => e['coord'],
        //         'LineString',
        //     )
        //     await bankData.requestData(BackEndRequest.getbankLineData)

        //     const { level1, level2, level3 } = DataPioneer.getDifBankData(
        //         bankData.origin2geojson(),
        //     )
        //     map.addSource('bank-level1-source', {
        //         type: 'geojson',
        //         data: level1,
        //     })
        //     map.addSource('bank-level2-source', {
        //         type: 'geojson',
        //         data: level2,
        //     })
        //     map.addSource('bank-level3-source', {
        //         type: 'geojson',
        //         data: level3,
        //     })
        //     sceneInstance.layerSrc.push(
        //         'bank-level1-source',
        //         'bank-level2-source',
        //         'bank-level3-source',
        //     )

        //     await loadImage(map, './geoStyle/warning1.png', 'warning1')
        //     map.addLayer({
        //         id: '一级预警岸段',
        //         type: 'line',
        //         source: 'bank-level1-source',
        //         layout: { 'line-join': 'round', 'line-cap': 'round' },
        //         paint: {
        //             'line-color': 'rgb(121, 164, 35)',
        //             'line-opacity': 1,
        //             'line-width': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 5,
        //                 22,
        //                 20,
        //             ],
        //             'line-pattern': 'warning1',
        //         },
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //             'line-round-limit': 2,
        //         },
        //     })

        //     await loadImage(map, './geoStyle/warning2.png', 'warning2')
        //     map.addLayer({
        //         id: '二级预警岸段',
        //         type: 'line',
        //         source: 'bank-level2-source',
        //         layout: { 'line-join': 'round', 'line-cap': 'round' },
        //         paint: {
        //             'line-color': 'rgb(121, 164, 35)',
        //             'line-opacity': 1,
        //             'line-width': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 5,
        //                 22,
        //                 20,
        //             ],
        //             'line-pattern': 'warning2',
        //         },
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //             'line-round-limit': 2,
        //         },
        //     })

        //     await loadImage(map, './geoStyle/warning3.png', 'warning3')
        //     map.addLayer({
        //         id: '三级预警岸段',
        //         type: 'line',
        //         source: 'bank-level3-source',
        //         layout: { 'line-join': 'round', 'line-cap': 'round' },
        //         paint: {
        //             'line-color': 'rgb(121, 164, 35)',
        //             'line-opacity': 1,
        //             'line-width': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 5,
        //                 22,
        //                 20,
        //             ],
        //             'line-pattern': 'warning3',
        //         },
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //             'line-round-limit': 2,
        //         },
        //     })
        //     sceneInstance.allLayers.push(
        //         '一级预警岸段',
        //         '二级预警岸段',
        //         '三级预警岸段',
        //     )

        //     // add marker here

        //     let count = 0
        //     bankData.data.forEach((item) => {
        //         let centerCoord = getCenterCoord(item['coord'])

        //         if (item.warningLevel === 1) {
        //             addMarkerToMap(
        //                 map,
        //                 centerCoord,
        //                 'warning1-marker',
        //                 '/icons/warning3.png',
        //                 popUp,
        //                 item,
        //             )
        //             count++
        //         }
        //         // else if (item.warningLevel === 2) {
        //         //     addMarkerToMap(map, centerCoord, item['id'], '/icons/warning2.png', popUp, item)
        //         // }
        //         // else if (item.warningLevel === 3) {
        //         //     addMarkerToMap(map, centerCoord, item['id'], '/icons/warning1.png', popUp, item)
        //         // }
        //     })
        //     break

        // case '全江地形':
        //     map.addSource('river-terrain-source', {
        //         type: 'vector',
        //         tiles: [
        //             tileServer + '/tile/vector/riverBg/{x}/{y}/{z}',
        //         ],
        //     })
        //     map.addLayer({
        //         id: '全江地形',
        //         type: 'fill',
        //         source: 'river-terrain-source',
        //         'source-layer': 'default',
        //         paint: {
        //             'fill-color': [
        //                 'match',
        //                 ['get', 'height'],
        //                 0,
        //                 '#57a3ea',
        //                 5,
        //                 '#3c8ee9',
        //                 10,
        //                 '#2177e9',
        //                 15,
        //                 '#1361dc',
        //                 20,
        //                 '#0e4dc5',
        //                 25,
        //                 '#0a3bad',
        //                 30,
        //                 '#072c95',
        //                 35,
        //                 '#041e7c',
        //                 40,
        //                 '#021363',
        //                 45,
        //                 '#010a49',
        //                 50,
        //                 '#00042e',
        //                 '#000000'
        //             ],
        //             // 'fill-color': '#3EFA13'
        //         },
        //     })


        //     map.addSource('riverSectionLabelSource', {
        //         type: 'vector',
        //         tiles: [
        //             tileServer + '/tile/vector/riverSection/{x}/{y}/{z}',
        //         ],
        //     })
        //     map.addSource('riverLabelSource', {
        //         type: 'vector',
        //         tiles: [
        //             tileServer + '/tile/vector/riverName/{x}/{y}/{z}',
        //         ],
        //     })

        //     map.addLayer({
        //         id: '河段划分',
        //         type: 'line',
        //         source: 'riverSectionLabelSource',
        //         'source-layer': 'default',
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //         },
        //         paint: {
        //             'line-opacity': 1,
        //             'line-color': 'rgba(231, 214, 86, 0.9)',
        //             'line-width': 4,
        //         },
        //     })
        //     map.addLayer({
        //         id: '河段描述',
        //         type: 'symbol',
        //         source: 'riverLabelSource',
        //         'source-layer': 'default',
        //         layout: {
        //             'text-field': ['get', 'label'],
        //             'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        //             // 'text-offset': [0, 1.25],
        //             'text-anchor': 'left',
        //         },
        //         paint: {
        //             'text-color': '#FC7C49',
        //         },
        //     })
        //     sceneInstance.allLayers.push(
        //         '全江地形',
        //         '河段描述',
        //         '河段划分',
        //     )
        //     sceneInstance.layerSrc.push(
        //         'river-terrain-source',
        //         'riverSectionLabelSource',
        //         'riverLabelSource',
        //     )
        //     // map.addSource('riverLand', {
        //     //     type: 'vector',
        //     //     tiles: [
        //     //         tileServer+'/tile/vector/riverLand/{x}/{y}/{z}',
        //     //     ],
        //     // })
        //     // map.addLayer({
        //     //     id: 'land1',
        //     //     type: 'fill',
        //     //     source: 'riverLand',
        //     //     'source-layer': 'default',
        //     //     paint: {
        //     //         'fill-color': '#000000',
        //     //     },
        //     // })

        //     // const el = document.createElement('div')
        //     // el.style.width = '35px'
        //     // el.style.height = '35px'
        //     // const marker = new mapboxgl.Marker({
        //     //     element: el,
        //     //     rotationAlignment: 'horizon',
        //     // })
        //     // map.on('click', '全江地形', (e) => {
        //     //     map.getCanvas().style.cursor = 'pointer'
        //     //     const feature = e.features[0];
        //     //     el.textContent = feature["properties"]["height"]
        //     //     marker
        //     //         .setLngLat(e.lngLat)
        //     //         .addTo(map);
        //     // })
        //     map.on('click', '全江地形', (e) => {
        //         const height = e.features[0]['properties']['height']
        //         refHeight.value = '-' + height + 'm';
        //         const popupCoord = e.lngLat
        //         popUp && popUp.remove()
        //         popUp.setOffset(0).setLngLat(popupCoord).addTo(map)
        //     })

        //     map.on('mousemove', '全江地形', (e) => {
        //         map.getCanvas().style.cursor = 'pointer'
        //     })
        //     map.on('mouseleave', '全江地形', (e) => {
        //         map.getCanvas().style.cursor = ''
        //     })

        //     // sceneInstance.allLayers.push('全江地形')

        //     break


        // // case '水利一张图':
        // //     break;


        // /////small Scene
        // case '实时监测设备':
        //     let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
        //     let monitorDevice = generateGeoJson(
        //         monitorInfo,
        //         (element) => {
        //             return [element['longitude'], element['latitude']]
        //         },
        //         'Point',
        //     )
        //     // debugger
        //     const { gnss, incline, stress, manometer } =
        //         DataPioneer.getDifMonitorData(monitorDevice)

        //     map.addSource('gnss-source', {
        //         type: 'geojson',
        //         data: gnss,
        //     })
        //     map.addSource('incline-source', {
        //         type: 'geojson',
        //         data: incline,
        //     })
        //     map.addSource('stress-source', {
        //         type: 'geojson',
        //         data: stress,
        //     })
        //     map.addSource('manometer-source', {
        //         type: 'geojson',
        //         data: manometer,
        //     })
        //     sceneInstance.layerSrc.push(
        //         'gnss-source',
        //         'incline-source',
        //         'stress-source',
        //         'manometer-source',
        //     )
        //     !map.hasImage('pulsing-dot-gnss') &&
        //         map.addImage('pulsing-dot-gnss', pulsing.point, {
        //             pixelRatio: 1,
        //         })
        //     !map.hasImage('pulsing-rect-incline') &&
        //         map.addImage('pulsing-rect-incline', pulsing.rectangle, {
        //             pixelRatio: 1,
        //         })
        //     !map.hasImage('pulsing-tri-stress') &&
        //         map.addImage('pulsing-tri-stress', pulsing.diamond, {
        //             pixelRatio: 1,
        //         })
        //     !map.hasImage('pulsing-dia-manometer') &&
        //         map.addImage('pulsing-dia-manometer', pulsing.triangle, {
        //             pixelRatio: 1,
        //         })
        //     map.addLayer({
        //         id: 'GNSS',
        //         type: 'symbol',
        //         source: 'gnss-source',
        //         layout: {
        //             'icon-image': 'pulsing-dot-gnss',
        //             'icon-allow-overlap': true,
        //         },
        //     })
        //     map.addLayer({
        //         id: '测斜仪',
        //         type: 'symbol',
        //         source: 'incline-source',
        //         layout: {
        //             'icon-image': 'pulsing-rect-incline',
        //             'icon-allow-overlap': true,
        //         },
        //     })
        //     map.addLayer({
        //         id: '孔隙水压力计',
        //         type: 'symbol',
        //         source: 'manometer-source',
        //         layout: {
        //             'icon-image': 'pulsing-dia-manometer',
        //             'icon-allow-overlap': true,
        //         },
        //     })
        //     map.addLayer({
        //         id: '应力桩',
        //         type: 'symbol',
        //         source: 'stress-source',
        //         layout: {
        //             'icon-image': 'pulsing-tri-stress',
        //             'icon-allow-overlap': true,
        //         },
        //     })

        //     sceneInstance.allLayers.push(
        //         'GNSS',
        //         '测斜仪',
        //         '孔隙水压力计',
        //         '应力桩',
        //     )


        //     map.on('click', sceneInstance.allLayers, (e) => {
        //         console.log(e.features[0].properties);
        //         useSceneStore().setSelectedFeature(e.features[0].properties)
        //         let popupCoord = e.lngLat
        //         // flytoFeature(map, popupCoord, 15)
        //         popUp && popUp.remove()
        //         popUp.setLngLat(popupCoord).addTo(map);
        //     })
        //     map.on('mousemove', sceneInstance.allLayers, (e) => {
        //         map.getCanvas().style.cursor = 'pointer'
        //     })
        //     map.on('mouseleave', sceneInstance.allLayers, (e) => {
        //         map.getCanvas().style.cursor = ''
        //     })

        //     break

        // case '近岸流场':
        //     if (map.getLayer('FlowLayer')) flow.show()
        //     else map.addLayer(flow)
        //     useLayerStore().setFlowLayer(flow)
        //     sceneInstance.allLayers.push('FlowLayer')
        //     map.triggerRepaint()
        //     break;

        // case '三维地形':
        //     if (map.getLayer('TerrainLayer')) terrainLayer.show()
        //     else map.addLayer(terrainLayer)
        //     useLayerStore().setTerrainLayer(terrainLayer)
        //     sceneInstance.allLayers.push('TerrainLayer')
        //     map.triggerRepaint()
        //     break

        // case '断面形态':
        //     await loadImage(map, './geoStyle/warning2.png', 'section')
        //     map.addSource('mzsSectionLineSource', {
        //         type: 'vector',
        //         tiles: [
        //             tileServer + '/tile/vector/mzsSectionLine/{x}/{y}/{z}',
        //         ],
        //     })
        //     map.addSource('mzsSectionLineLabelSource', {
        //         type: 'vector',
        //         tiles: [
        //             tileServer + '/tile/vector/mzsSectionLineLabel/{x}/{y}/{z}',
        //         ],
        //     })

        //     map.addLayer({
        //         id: '守护工程断面',
        //         type: 'line',
        //         source: 'mzsSectionLineSource',
        //         'source-layer': 'default',
        //         layout: {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //         },
        //         paint: {
        //             'line-opacity': 1,
        //             'line-color': '#7F02F3',
        //             'line-width': 7,
        //             'line-pattern': 'section'
        //         },
        //     })
        //     map.addLayer({
        //         id: '守护工程断面标注',
        //         type: 'symbol',
        //         source: 'mzsSectionLineLabelSource',
        //         'source-layer': 'default',
        //         layout: {
        //             'text-field': ['get', 'label'],
        //             'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        //             'text-offset': [0, 1.25],
        //             'text-anchor': 'left',
        //             'text-size': 20,
        //         },
        //         paint: {
        //             'text-color': '#040052',
        //         },
        //     })
        //     map.on('click', '守护工程断面', (e) => {

        //         const secName = e.features[0]['properties']['label']
        //         sectionName.value = secName
        //         const popupCoord = e.lngLat
        //         popUp && popUp.remove()
        //         popUp.setOffset(0).setLngLat(popupCoord).addTo(map)
        //     })
        //     map.on('mousemove', '守护工程断面', (e) => {
        //         map.getCanvas().style.cursor = 'pointer'
        //     })
        //     map.on('mouseleave', '守护工程断面', (e) => {
        //         map.getCanvas().style.cursor = ''
        //     })
        //     sceneInstance.allLayers.push(
        //         '守护工程断面',
        //         '守护工程断面标注',
        //     )
        //     sceneInstance.layerSrc.push(
        //         'mzsSectionLineSource',
        //         'mzsSectionLineLabelSource',
        //     )

        //     break;

        //#endregion


        case '全江概貌':
            let layers = [
                '地形瓦片',
                '河段划分',
                '河段注记',
                '沙岛',
                '全江注记',
                '深泓线',
                '已建通道',
                '在建通道',
                '规划通道',
            ]

            layers.forEach(async (id) => {
                await LAYER_FUNCTION_MAP[id](map)
            })

            sceneInstance.allLayers = layers
            //sceneInstance.showLayers(map, layers)
            useMapLayerStore().layesrAdded(layers)
            useMapLayerStore().layersShowing(layers)


            break

        case '典型崩岸':

            let layers2 = [
                '地形瓦片',
                '河段划分',
                '河段注记',
                '沙岛',
                '全江注记',
                '深泓线',
                '一级预警岸段',
                '二级预警岸段',
                '三级预警岸段',
            ]
            layers2.forEach(async (id) => {
                await LAYER_FUNCTION_MAP[id](map)
            })

            sceneInstance.allLayers = layers2
            //sceneInstance.showLayers(map, layers2)
            useMapLayerStore().layesrAdded(layers2)
            useMapLayerStore().layersShowing(layers2)


            break

        case '民主沙近岸':

            let layers3 = [
                '民主沙地标',
                '民主沙区划线',
                '民主沙岸段线',
                '民主沙岸段注记',
                '守护工程断面',
                '守护工程断面注记',
                '稳定性分区',
                '预警级别分区',
                '近岸流场',
                '三维地形'
            ]
            layers3.forEach(async (id) => {
                await LAYER_FUNCTION_MAP[id](map)
            })
            sceneInstance.allLayers = layers3
            //sceneInstance.showLayers(map, layers3)

            useMapLayerStore().layesrAdded(layers3)
            useMapLayerStore().layersShowing(layers3)



            break

        case '民主沙预警监测':

            let layers4 = [
                '民主沙地标',
                '民主沙区划线',
                '稳定性分区',
                '预警级别分区',
                'GNSS',
                '测斜仪',
                '孔隙水压力计',
                '应力桩',
            ]
            layers4.forEach(async (id) => {
                await LAYER_FUNCTION_MAP[id](map)
            })
            sceneInstance.allLayers = layers4
            // sceneInstance.showLayers(map, layers4)
            useMapLayerStore().layesrAdded(layers4)
            useMapLayerStore().layersShowing(layers4)

            break

        default:
            console.log('wait developing...')
            ElMessage('wait developing...')
            break
    }

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
        this.type = ''
        this.layerSrc = [] //only id
        this.allLayers = [] //only id
        this.markers = []
    }
    async initLayers(map) {
        await initLayers(this, map)
    }

    showLayers(map, showArrays) {

        var invisibleLayers = this.allLayers.filter(
            (v) => !showArrays.includes(v),
        )
        invisibleLayers.forEach((layerID) => {
            map.setLayoutProperty(layerID, 'visibility', 'none')
            useMapLayerStore().layerHide(layerID)
        })
        showArrays.forEach((layerID) => {
            map.setLayoutProperty(layerID, 'visibility', 'visible')
            useMapLayerStore().layerShowing(layerID)
        })
    }

    removeLayers(map) {
        // when scene checkout
        // if (map.loaded()) {
        //remove layer , remove source
        globalpopup && globalpopup.remove()

        this.allLayers.forEach((layerID) => {
            if (layerID === '三维地形') {
                terrainLayer.hide()
            } else if (layerID === '近岸流场') {
                flow.hide()
            } else map.getLayer(layerID) && map.removeLayer(layerID)

            useMapLayerStore().layerRemove(layerID)
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
    }


    static getLayerTreeData() {
        let layersCollection = [
            {
                label: '江苏段',
                children: []
            },
            {
                label: '民主沙段',
                children: []
            }
        ]
        let channel = {
            label: '过江通道',
            children: []
        }

        channel.children.push({
            label: '已建通道',
            children: [],
        })
        channel.children.push({
            label: '在建通道',
            children: [],
        })
        channel.children.push({
            label: '规划通道',
            children: [],
        })
        layersCollection[0].children.push(channel)

        let bank = {
            label: '典型岸段',
            children: []
        }

        bank.children.push({
            label: '一级预警岸段',
            children: [],
        })
        bank.children.push({
            label: '二级预警岸段',
            children: [],
        })
        bank.children.push({
            label: '三级预警岸段',
            children: [],
        })
        layersCollection[0].children.push(bank)

        layersCollection[0].children.push({
            label: '地形瓦片',
            children: [],
        })

        layersCollection[0].children.push({
            label: '沙岛',
            children: [],
        })

        layersCollection[0].children.push({
            label: '全江注记',
            children: [],
        })

        layersCollection[0].children.push({
            label: '河段',
            children: [
                {
                    label: '河段划分',
                    children: [],
                },
                {
                    label: '河段注记',
                    children: [],
                }
            ],
        })
        layersCollection[0].children.push({
            label: '深泓线',
            children: [],
        })
        layersCollection[0].children.push({
            label: '监测设备',
            children: [
                {
                    label: 'GNSS',
                    children: [],
                },
                {
                    label: '测斜仪',
                    children: [],
                },
                {
                    label: '孔隙水压力计',
                    children: [],
                },
                {
                    label: '应力桩',
                    children: [],
                },
            ],
        })
        layersCollection[0].children.push({
            label: '近岸流场',
            children: []
        })
        layersCollection[0].children.push({
            label: '三维地形',
            children: []
        })

        ///////////mzs
        layersCollection[1].children.push({
            label: '民主沙区划',
            children: [
                {
                    label: '民主沙地标',
                    children: []
                },
                {
                    label: '民主沙区划线',
                    children: []
                }
            ]
        })
        layersCollection[1].children.push({
            label: '断面与岸段',
            children: [
                {
                    label: '守护工程断面',
                    children: []
                },
                {
                    label: '守护工程断面注记',
                    children: []
                },
                {
                    label: '民主沙岸段线',
                    children: []
                },
                {
                    label: '民主沙岸段注记',
                    children: []
                }
            ]
        })
        layersCollection[1].children.push({
            label: '预警分区',
            children: [
                {
                    label: '稳定性分区',
                    children: []
                },
                {
                    label: '预警级别分区',
                    children: []
                }
            ]
        })
        return layersCollection


    }

    static getScnens(){
        let scene0 = new Scene()
        scene0.title = '全江概貌'
        scene0.desc = '展示全江概貌，助力有关规划决策.'
        scene0.iconSrc = '/icons/gate.png'
        scene0.type = '全江'
        let scene1 = new Scene()
        scene1.title = '典型崩岸'
        scene1.desc = '展示典型崩岸,助力有关规划决策.'
        scene1.type = '全江'
        scene1.iconSrc = '/icons/collapse.png'
    
        let scene2 = new Scene()
        scene2.title = '民主沙近岸'
        scene2.desc = '展示民主沙近岸场景,助力有关规划决策.'
        scene2.iconSrc = '/icons/terrain.png'
        scene2.type = '民主沙'
        let scene3 = new Scene()
        scene3.title = '民主沙预警监测'
        scene3.desc = '展示民主沙测点布设,助力有关规划决策.'
        scene3.iconSrc = './icons/gate.png'
        scene3.type = '民主沙'
    
        return [scene0, scene1, scene2, scene3]
    }



}

export {
    Scene, initLayers, DataPioneer
}
