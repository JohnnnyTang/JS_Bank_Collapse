import mapboxgl from 'mapbox-gl'
import { ref, h, createApp } from 'vue'
import {
    loadImage,
    pulsing,
    addMarkerToMap,
    getCenterCoord,
    createPopUp,
} from '../../utils/mapUtils.js'
import { useSceneStore, useMapLayerStore, useLayerStore } from '../../store/mapStore.js'
import { layers as ALL_LAYERS } from './layerUtil.js'
import { showLayersFunction, hideLayersFunction } from '../../utils/mapUtils.js'
import BackEndRequest from '../../api/backend.js'
import monitorDetailV2 from './featureDetails/monitorDetailV2.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// BackEndRequest.getDataNodeData()

let refHeight = ref('')
let sectionName = ref('')
const propertyRef = ref({})
const zoomRef = ref()
const deviceIdMap = {
    'MZS120.51749289_32.04059243_1': 'CL-01',
    'MZS120.51977143_32.04001152_1': 'CL-02',
    'MZS120.52557975_32.03825056_1': 'CL-03',
    'MZS120.52660704_32.03676583_1': 'CL-04',
    'MZS120.53334877_32.03227055_1': 'CL-05',
    'MZS120.54599538_32.02837993_1': 'CL-06',
    'MZS120.55327892_32.02707923_1': 'CL-07',
    'MZS120.55649757_32.02592404_1': 'CL-08',
    'MZS120.56334257_32.02298144_1': 'CL-09',
    'MZS120.56944728_32.02070961_1': 'CL-10',
    'MZS120.51494347_32.04269763_1': 'JZ-01',
    'MZS120.54184889_32.0309461_1': 'JZ-02',
    'MZS120.5592327_32.025761_1': 'JZ-03',
    'MZS120.51726088_32.04054582_3': 'KX-01',
    'MZS120.51738292_32.04054923_3': 'KX-02',
    'MZS120.51749021_32.04053105_3': 'KX-03',
    'MZS120.51957026_32.04008655_3': 'KX-04',
    'MZS120.51967889_32.04004108_3': 'KX-05',
    'MZS120.51986665_32.03998992_3': 'KX-06',
    'MZS120.52557975_32.03825056_3': 'KX-07',
    'MZS120.52565217_32.03813574_3': 'KX-08',
    'MZS120.52566826_32.03799363_3': 'KX-09',
    'MZS120.513203_32.042733_2': 'YL-01',
    'MZS120.515433_32.04231_2': 'YL-02',
    'MZS120.521221_32.040331_2': 'YL-03',
    'MZS120.529078_32.034385_2': 'YL-04',
    'MZS120.541648_32.030524_2': 'YL-05',
    'MZS120.548925_32.029361_2': 'YL-06',
    'MZS120.552209_32.028149_2': 'YL-07',
    'MZS120.51967889_32.04004108_4': 'CX-01',
    'MZS120.51986665_32.03998992_4': 'CX-02',
    'MZS120.52557975_32.03825056_4': 'CX-03',
    'MZS120.52565217_32.03813574_4': 'CX-04',
    'MZS120.52566826_32.03799363_4': 'CX-05',
    'MZS120.51726088_32.04054582_4': 'CX-06',
    'MZS120.51738292_32.04054923_4': 'CX-07',
    'MZS120.51749021_32.04053105_4': 'CX-08',
    'MZS120.51957026_32.04008655_4': 'CX-09',
    'MZS120.54224179_32.03077085_6': 'SP-03',
    'MZS120.5155315_32.04267723_6': 'SP-02',
    'MZS120.52240697_32.03941692_6': 'SP-01',
}

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
        let gnssJZ = []
        let incline = []
        let manometer = [] //压力计
        let stress = [] // 应力桩
        let camera = []
        // console.log('geojson...', features)
        features.forEach((feat) => {
            switch (feat['properties']['type']) {
                case '1':
                    if (feat['properties']['name'].includes('JZ')) {
                        gnssJZ.push(feat)
                    } else
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
                case '6':
                    camera.push(feat)
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
            camera: {
                type: 'FeatureCollection',
                features: camera,
            },
            gnssJZ:{
                type: 'FeatureCollection',
                features: gnssJZ,
            }
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

    static generateDeviceGeoJson(itemArr, getCoords, type) {
        const features = []
        itemArr.forEach((element) => {
            let coords = getCoords(element)
            // console.log(element)
            let feature = {
                type: 'Feature',
                properties: {...element, label: deviceIdMap[element.code]},
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

        case '全江概貌':
            let layers = [
                '地形瓦片',
                '河段划分',
                '河段注记',
                '沙洲',
                '全江注记',
                '深泓线',
                '已建通道',
                '在建通道',
                '规划通道',
            ]
            showLayersFunction(map, layers)

            let hideLayers = ALL_LAYERS.filter((item) => !layers.includes(item))
            hideLayersFunction(map, hideLayers)
            useMapLayerStore().layersHide(hideLayers)

            sceneInstance.allLayers = layers
            //sceneInstance.showLayers(map, layers)
            useMapLayerStore().layesrAdded(layers)
            useMapLayerStore().layersShowing(layers)

            let channel = new DataPioneer(
                '过江通道',
                (e) => e['llCoords'],
                'LineString',
            )
            await channel.requestData(BackEndRequest.getChannelData)
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

        case '典型崩岸':

            let layers2 = [
                '地形瓦片',
                '河段划分',
                '河段注记',
                '沙洲',
                '全江注记',
                '深泓线',
                '一级预警岸段',
                '二级预警岸段',
                '三级预警岸段',
            ]
            showLayersFunction(map, layers2)

            let hideLayers2 = ALL_LAYERS.filter((item) => !layers2.includes(item))
            hideLayersFunction(map, hideLayers2)
            useMapLayerStore().layersHide(hideLayers2)

            sceneInstance.allLayers = layers2
            //sceneInstance.showLayers(map, layers2)
            useMapLayerStore().layesrAdded(layers2)
            useMapLayerStore().layersShowing(layers2)

            let bankData = new DataPioneer(
                '典型崩岸',
                (e) => e['coord'],
                'LineString',
            )
            await bankData.requestData(BackEndRequest.getbankLineData)
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
                // '近岸流场',
                '三维地形'
            ]
            showLayersFunction(map, layers3)

            let hideLayers3 = ALL_LAYERS.filter((item) => !layers3.includes(item))
            hideLayersFunction(map, hideLayers3)
            useMapLayerStore().layersHide(hideLayers3)


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
            showLayersFunction(map, layers4)

            let hideLayers4 = ALL_LAYERS.filter((item) => !layers4.includes(item))
            hideLayersFunction(map, hideLayers4)
            useMapLayerStore().layersHide(hideLayers4)

            sceneInstance.allLayers = layers4
            // sceneInstance.showLayers(map, layers4)
            useMapLayerStore().layesrAdded(layers4)
            useMapLayerStore().layersShowing(layers4)

            let deviceLayers = ['GNSS', '测斜仪', '孔隙水压力计', '应力桩']

            map.on('click', deviceLayers, (e) => {
                if (e.features.length > 1)
                    open(e.features, map)
                else if (e.features.length === 1) {
                    let p = e.features[0].properties
                    const property = e.features[0].properties
                    useSceneStore().setSelectedFeature(property)

                    propertyRef.value = property
                    const popUp = createMonitorPopup(propertyRef, zoomRef)
                    popUp.setOffset(0).setLngLat([p.longitude, p.latitude]).addTo(map)
                }
            })

            map.on('mousemove', deviceLayers, (e) => {
                map.getCanvas().style.cursor = 'pointer'
            })
            map.on('mouseleave', deviceLayers, (e) => {
                map.getCanvas().style.cursor = ''
            })
            map.on('zoom', () => {
                zoomRef.value = map.getZoom()
            })

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
        hideLayersFunction(map, invisibleLayers)

        showLayersFunction(map, showArrays)
    }

    removeLayers(map) {

        globalpopup && globalpopup.remove()
        hideLayersFunction(map, this.allLayers)
        this.allLayers = []

        // source 是否需要删除？
        // this.layerSrc.forEach((sourceID) => {
        //     map.getSource(sourceID) && map.removeSource(sourceID)
        // })

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
            label: '沙洲',
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

        layersCollection[1].children.push({
            label: '近岸流场',
            children: []
        })
        layersCollection[1].children.push({
            label: '三维地形',
            children: []
        })
        return layersCollection


    }

    static getScnens() {
        let scene0 = new Scene()
        scene0.title = '全江概貌'
        scene0.desc = '展示全江概貌，助力有关规划决策.'
        scene0.iconSrc = '/river.png'
        scene0.type = '全江'
        let scene1 = new Scene()
        scene1.title = '典型岸段'
        scene1.desc = '展示典型岸段,助力有关规划决策.'
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
        scene3.iconSrc = '/icons/watching.png'
        scene3.type = '民主沙'

        return [scene0, scene1, scene2, scene3]
    }

}

const createMonitorPopup = (deviceProperty, zoom) => {
    const ap = createApp(monitorDetailV2, { deviceInfo: deviceProperty, zoom })

    const container = document.createElement('div')
    const componentInstance = ap.mount(container)

    const domwithComp = container
    const popUp = new mapboxgl.Popup({
        maxWidth: '1000px',
        offset: 25,
    }).setDOMContent(domwithComp)
    return popUp
}
const open = (features, map) => {
    console.log('trigger open');
    const items = features
    let selectedCode
    // const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']
    const DEVICETYPEMAP = ['GNSS', '应力桩', '压力计', '测斜仪']

    const radioGroupVNode = h('div', [
        h('div', { style: { marginBottom: '20px', fontWeight: 'bold', fontSize: '20px' } }, '该区域有多台设备，请选择'),
        items.map(item => {
            return h(
                'div',
                {
                    key: item.properties.machineId,
                    style: { marginBottom: '10px' }
                },
                [
                    h('label', {},
                        [
                            h('input', {
                                type: 'radio',
                                name: 'options',
                                value: item.properties.code,
                                onChange: event => {
                                    // 在这里处理选项变化事件
                                    selectedCode = event.target.value;
                                }
                            }),
                            h('span', {}, DEVICETYPEMAP[Number(item.properties.type) - 1] + '--' + item.properties.code)
                        ]
                    )
                ]
            );
        })
    ]);

    ElMessageBox.confirm(
        '该区域有多台设备，请选择目标设备',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            message: radioGroupVNode
        }
    )
        .then(() => {
            ElMessage({
                type: 'info',
                message: '加载设备详情',
            })
            let targetProperty
            for (let i = 0; i < items.length; i++) {
                if (items[i].properties.code === selectedCode) {
                    targetProperty = items[i].properties
                }
            }
            console.log(targetProperty);

            useSceneStore().setSelectedFeature(targetProperty)
            propertyRef.value = targetProperty
            const popUp = createMonitorPopup(propertyRef, zoomRef)
            popUp.setOffset(0).setLngLat([targetProperty.longitude, targetProperty.latitude]).addTo(map)


        })
        .catch((action) => {
            ElMessage({
                type: 'info',
                message: '取消'
            })
        })
}

export {
    Scene, initLayers, DataPioneer
}
