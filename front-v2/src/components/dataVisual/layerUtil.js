import { useLayerStore } from '../../store/mapStore'
import BackEndRequest from '../../api/backend'
import { DataPioneer } from './Scene'
import axios from 'axios'
import { loadImage } from '../../utils/mapUtils'


///// const
const riverBridgeAssist = {
    "type": "FeatureCollection",
    "name": "过江通道辅助线",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "id": 43, "plan": 0, "name": "北沿江过江通道-虚线", "if_important": 1, "fid": null, "bridge_type": null, "construct_date": null }, "geometry": { "type": "MultiLineString", "coordinates": [[[121.495151599315932, 31.74474021579098, 0.0], [121.493928810374456, 31.742840513250599, 0.0], [121.492181847135569, 31.73979025997599, 0.0], [121.490268506445332, 31.736712277126131, 0.0], [121.487994681277257, 31.733190621072691, 0.0], [121.487329171471941, 31.732469652116922, 0.0], [121.48583177441003, 31.730473122700829, 0.0], [121.484417566073731, 31.72855978201039, 0.0], [121.483225194339269, 31.726979196222654, 0.0], [121.481866445153429, 31.725121314682667, 0.0], [121.480285859365864, 31.723013866965683, 0.0], [121.478594355277338, 31.720629123496447, 0.0], [121.476764203312811, 31.71802254342542, 0.0], [121.47515588795001, 31.715998284434139, 0.0], [121.473381195135815, 31.713447163513546, 0.0], [121.47202244594996, 31.71164474112399, 0.0], [121.470247753135865, 31.709315456805228, 0.0], [121.468694896923466, 31.707235738663464, 0.0], [121.46766890264027, 31.705766071176598, 0.0], [121.466670637932339, 31.704435051565866, 0.0], [121.465478266197863, 31.703048572804704, 0.0], [121.461152452463196, 31.700996584238272, 0.0], [121.452944498197425, 31.69711444370725, 0.0], [121.428542472001965, 31.685357103813217, 0.0], [121.40608151607195, 31.674542569476724, 0.0], [121.38140219412422, 31.662618852131359, 0.0], [121.37768643104441, 31.660733241016281, 0.0], [121.374968932672658, 31.659845894609219, 0.0], [121.372374711548176, 31.65878363561816, 0.0]]] } }
    ]
}
const layers = [
    '地形瓦片',
    '河段划分',
    '河段注记',
    // '沙洲',
    '全江注记',
    '深泓线',
    // '已建通道',
    // '在建通道',
    // '规划通道',
    '一级预警岸段',
    '二级预警岸段',
    '三级预警岸段',
    '民主沙地标',
    '民主沙区划线',
    '民主沙岸段线',
    '民主沙岸段注记',
    '守护工程断面',
    '守护工程断面注记',
    '稳定性分区',
    '预警级别分区',
    'GNSS',
    '测斜仪',
    '孔隙水压力计',
    '应力桩',
    '近岸流场',
    '三维地形',
]
const tileServer =`http://${window.location.host}${import.meta.env.VITE_MAP_TILE_SERVER}`
let screenResolutionType
if (window.screen.width === 1920 && window.screen.height === 1080) {
    screenResolutionType = '1920x1080'
}
else if (window.screen.width === 2560 && window.screen.height === 1440) {
    screenResolutionType = '2560x1440'
} else {
    screenResolutionType = 'default'
}
let TEXTSIZE = {
    '1920x1080': {
        'large': 22,
        'medium': 19,
        'small': 16,
    },
    '2560x1440': {
        'large': 25,
        'medium': 22,
        'small': 19,
    },
    'default': {
        'large': 22,
        'medium': 19,
        'small': 16,
    }
}
const zoomLevel0 = 9
const zoomLevel1 = 10
const zoomLevel2 = 11
const zoomLevel3 = 12
const zoomLevel4 = 13




const layerAddFunctionMap = {
    地形瓦片: async (map) => {
        !map.getSource('riverBg') &&
            map.addSource('riverBg', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverBg/{x}/{y}/{z}'],
            })
        !map.getLayer('地形瓦片') &&
            map.addLayer({
                id: '地形瓦片',
                type: 'fill',
                source: 'riverBg',
                'source-layer': 'default',
                paint: {
                    'fill-color': [
                        'match',
                        ['get', 'height'],
                        0,
                        '#57a3ea',
                        5,
                        '#3c8ee9',
                        10,
                        '#2177e9',
                        15,
                        '#1361dc',
                        20,
                        '#0e4dc5',
                        25,
                        '#0a3bad',
                        30,
                        '#072c95',
                        35,
                        '#041e7c',
                        40,
                        '#021363',
                        45,
                        '#010a49',
                        50,
                        '#00042e',
                        '#000000',
                    ],
                    // 'fill-color': '#3EFA13'
                },
            })
    },
    河段划分: async (map) => {
        !map.getSource('riverSection') &&
            map.addSource('riverSection', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverSection/{x}/{y}/{z}'],
            })
        !map.getLayer('河段划分') &&
            map.addLayer({
                id: '河段划分',
                type: 'line',
                source: 'riverSection',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': 'rgb(135, 89, 186)',
                    'line-width': 3,
                },
            })
    },
    河段注记: async (map) => {
        !map.getSource('riverName') &&
            map.addSource('riverName', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverName/{x}/{y}/{z}'],
            })
        !map.getLayer('河段注记') &&
            map.addLayer({
                id: '河段注记',
                type: 'symbol',
                source: 'riverName',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': '#383312',
                    'text-size': 20,
                },
            })
    },
    // 沙洲: async (map) => {
    //     console.log('add shazhou');
    //     !map.getSource('riverLand') &&
    //         map.addSource('riverLand', {
    //             type: 'vector',
    //             tiles: [tileServer + '/tile/vector/riverLand/{x}/{y}/{z}'],
    //         })
    //     !map.getLayer('沙洲') &&
    //         map.addLayer({
    //             id: '沙洲',
    //             type: 'fill',
    //             source: 'riverLand',
    //             'source-layer': 'default',
    //             paint: {
    //                 'fill-color': 'rgba(255, 122, 120,0.7)',
    //             },
    //         })
    // },
    全江注记: async (map) => {
        !map.getSource('placeLabel') &&
            map.addSource('placeLabel', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/placeLabel/{x}/{y}/{z}'],
            })
        !map.getLayer('全江注记') &&
            map.addLayer({
                id: '全江注记',
                type: 'symbol',
                source: 'placeLabel',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': 'rgb(19,95,173)',
                },
            })
    },
    深泓线: async (map) => {
        !map.getSource('depthLine') &&
            map.addSource('depthLine', {
                type: 'vector',
                tiles: [
                    // tileServer+'/tile/vector/depthLine/1999/{x}/{y}/{z}',
                    // tileServer+'/tile/vector/depthLine/2004/{x}/{y}/{z}',
                    // tileServer+'/tile/vector/depthLine/2006/{x}/{y}/{z}',
                    // tileServer+'/tile/vector/depthLine/2015/{x}/{y}/{z}',
                    tileServer + '/tile/vector/depthLine/2017/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('深泓线') &&
            map.addLayer({
                id: '深泓线',
                type: 'line',
                source: 'depthLine',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': 'rgba(12, 214, 211, 0.5)',
                    'line-width': 4,
                },
            })
    },
    民主沙地标: async (map) => {
        !map.getSource('mzsPlaceLabel') &&
            map.addSource('mzsPlaceLabel', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}'],
            })

        !map.getLayer('民主沙地标') &&
            map.addLayer({
                id: '民主沙地标',
                type: 'symbol',
                source: 'mzsPlaceLabel',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': 'rgb(44,78,196)',
                },
            })
    },
    民主沙区划线: async (map) => {
        !map.getSource('mzsPlaceLine') &&
            map.addSource('mzsPlaceLine', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}'],
            })
        !map.getLayer('民主沙区划线') &&
            map.addLayer({
                id: '民主沙区划线',
                type: 'line',
                source: 'mzsPlaceLine',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': 'rgba(26, 87, 138, 0.9)',
                    'line-width': 3,
                },
            })
    },
    民主沙岸段线: async (map) => {
        !map.getSource('mzsBankLine') &&
            map.addSource('mzsBankLine', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
            })
        !map.getLayer('民主沙岸段线') &&
            map.addLayer({
                id: '民主沙岸段线',
                type: 'symbol',
                source: 'mzsBankLine',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': 'rgba(231, 214, 126, 0.9)',
                },
            })
    },
    民主沙岸段注记: async (map) => {
        !map.getSource('mzsBankLabel') &&
            map.addSource('mzsBankLabel', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/mzsBankLabel/{x}/{y}/{z}'],
            })
        !map.getLayer('民主沙岸段注记') &&
            map.addLayer({
                id: '民主沙岸段注记',
                type: 'symbol',
                source: 'mzsBankLabel',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': 'rgb(28,13,106)',
                },
            })
    },
    守护工程断面: async (map) => {
        !map.getSource('mzsSectionLine') &&
            map.addSource('mzsSectionLine', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/mzsSectionLine/{x}/{y}/{z}'],
            })
        await loadImage(map, './geoStyle/warning2.png', 'warning2')
        !map.getLayer('守护工程断面') &&
            map.addLayer({
                id: '守护工程断面',
                type: 'line',
                source: 'mzsSectionLine',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': '#7F02F3',
                    'line-width': 7,
                    'line-pattern': 'warning2',
                },
            })
    },
    守护工程断面注记: async (map) => {
        !map.getSource('mzsSectionLineLabel') &&
            map.addSource('mzsSectionLineLabel', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsSectionLineLabel/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('守护工程断面注记') &&
            map.addLayer({
                id: '守护工程断面注记 ',
                type: 'symbol',
                source: 'mzsSectionLineLabel',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                    'text-size': 20,
                },
                paint: {
                    'text-color': '#040052',
                },
            })
    },
    稳定性分区: async (map) => {
        !map.getSource('mzsBankAreaS') &&
            map.addSource('mzsBankAreaS', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/mzsBankAreaS/{x}/{y}/{z}'],
            })

        !map.getLayer('稳定性分区') &&
            map.addLayer({
                id: '稳定性分区',
                type: 'fill',
                source: 'mzsBankAreaS',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'fill-color': 'rgba(233, 23, 86, 0.6)',
                },
            })
    },
    预警级别分区: async (map) => {
        !map.getSource('mzsBankAreaW') &&
            map.addSource('mzsBankAreaW', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/mzsBankAreaW/{x}/{y}/{z}'],
            })
        !map.getLayer('预警级别分区') &&
            map.addLayer({
                id: '预警级别分区',
                type: 'fill',
                source: 'mzsBankAreaW',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'fill-color': 'rgba(233, 233, 86, 0.6)',
                },
            })
    },
    GNSS: async (map) => {
        if (!map.getSource('gnss-source')) {
            let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
            let monitorDevice = DataPioneer.generateGeoJson(
                monitorInfo,
                (element) => {
                    return [element['longitude'], element['latitude']]
                },
                'Point',
            )
            // debugger
            const { gnss, manometer, stress, incline } =
                DataPioneer.getDifMonitorData(monitorDevice)
            !map.getSource('gnss-source') &&
                map.addSource('gnss-source', {
                    type: 'geojson',
                    data: gnss,
                })

            !map.getSource('incline-source') &&
                map.addSource('incline-source', {
                    type: 'geojson',
                    data: incline,
                })

            !map.getSource('manometer-source') &&
                map.addSource('manometer-source', {
                    type: 'geojson',
                    data: manometer,
                })

            !map.getSource('stress-source') &&
                map.addSource('stress-source', {
                    type: 'geojson',
                    data: stress,
                })
        }
        await loadImage(map, '/icons/GNSS.png', 'gnss-static')

        !map.getLayer('GNSS') &&
            map.addLayer({
                id: 'GNSS',
                type: 'symbol',
                source: 'gnss-source',
                layout: {
                    'icon-image': 'gnss-static',
                    'icon-size': 0.3,
                    'icon-allow-overlap': true,
                },
            })
    },
    测斜仪: async (map) => {
        if (!map.getSource('incline-source')) {
            let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
            let monitorDevice = DataPioneer.generateGeoJson(
                monitorInfo,
                (element) => {
                    return [element['longitude'], element['latitude']]
                },
                'Point',
            )
            const { gnss, manometer, stress, incline } =
                DataPioneer.getDifMonitorData(monitorDevice)
            !map.getSource('gnss-source') &&
                map.addSource('gnss-source', {
                    type: 'geojson',
                    data: gnss,
                })

            !map.getSource('incline-source') &&
                map.addSource('incline-source', {
                    type: 'geojson',
                    data: incline,
                })

            !map.getSource('manometer-source') &&
                map.addSource('manometer-source', {
                    type: 'geojson',
                    data: manometer,
                })

            !map.getSource('stress-source') &&
                map.addSource('stress-source', {
                    type: 'geojson',
                    data: stress,
                })
        }
        await loadImage(map, '/geoStyle/incline-rect.png', 'incline-static')

        !map.getLayer('测斜仪') &&
            map.addLayer({
                id: '测斜仪',
                type: 'symbol',
                source: 'incline-source',
                layout: {
                    'icon-image': 'incline-static',
                    'icon-size': 0.3,
                    'icon-allow-overlap': true,
                },
            })
    },
    孔隙水压力计: async (map) => {
        if (!map.getSource('manometer-source')) {
            let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
            let monitorDevice = DataPioneer.generateGeoJson(
                monitorInfo,
                (element) => {
                    return [element['longitude'], element['latitude']]
                },
                'Point',
            )
            const { gnss, manometer, stress, incline } =
                DataPioneer.getDifMonitorData(monitorDevice)
            !map.getSource('gnss-source') &&
                map.addSource('gnss-source', {
                    type: 'geojson',
                    data: gnss,
                })

            !map.getSource('incline-source') &&
                map.addSource('incline-source', {
                    type: 'geojson',
                    data: incline,
                })

            !map.getSource('manometer-source') &&
                map.addSource('manometer-source', {
                    type: 'geojson',
                    data: manometer,
                })

            !map.getSource('stress-source') &&
                map.addSource('stress-source', {
                    type: 'geojson',
                    data: stress,
                })
        }
        await loadImage(map, '/icons/孔隙水压力计.png', 'manometer-static')

        !map.getLayer('孔隙水压力计') &&
            map.addLayer({
                id: '孔隙水压力计',
                type: 'symbol',
                source: 'manometer-source',
                layout: {
                    'icon-image': 'manometer-static',
                    'icon-size': 0.3,
                    'icon-allow-overlap': true,
                },
            })
    },
    应力桩: async (map, stress) => {
        if (!map.getSource('stress-source')) {
            let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
            let monitorDevice = DataPioneer.generateGeoJson(
                monitorInfo,
                (element) => {
                    return [element['longitude'], element['latitude']]
                },
                'Point',
            )
            const { gnss, manometer, stress, incline } =
                DataPioneer.getDifMonitorData(monitorDevice)
            !map.getSource('gnss-source') &&
                map.addSource('gnss-source', {
                    type: 'geojson',
                    data: gnss,
                })

            !map.getSource('incline-source') &&
                map.addSource('incline-source', {
                    type: 'geojson',
                    data: incline,
                })

            !map.getSource('manometer-source') &&
                map.addSource('manometer-source', {
                    type: 'geojson',
                    data: manometer,
                })

            !map.getSource('stress-source') &&
                map.addSource('stress-source', {
                    type: 'geojson',
                    data: stress,
                })
        }
        await loadImage(map, '/icons/应力桩.png', 'stress-static')

        !map.getLayer('应力桩') &&
            map.addLayer({
                id: '应力桩',
                type: 'symbol',
                source: 'stress-source',
                layout: {
                    'icon-image': 'stress-static',
                    'icon-allow-overlap': true,
                    'icon-size': 0.3,
                },
            })
    },
    // 近岸流场: async (map) => {
    //     if (map.getLayer('近岸流场')) {
    //         useLayerStore().flowLayer.show()
    //         let center = map.getCenter()
    //         map.flyTo({
    //             center: center,
    //         })
    //     } else {
    //         let flowSrc = []
    //         for (let i = 0; i < 26; i++) {
    //             flowSrc.push(`/scratchSomething/terrain_flow/json/uv_${i}.bin`)
    //         }

    //         let flow = new SteadyFlowLayer(
    //             '近岸流场',
    //             '/scratchSomething/terrain_flow/json/station.bin',
    //             flowSrc,
    //             (url) => url.match(/uv_(\d+)\.bin/)[1],
    //             '/scratchSomething/terrain_flow/json/ChangJiang.geojson',
    //         )
    //         flow.particleNum.n = 2800
    //         flow.speedFactor.n = 1.8

    //         map.addLayer(flow)
    //         useLayerStore().setFlowLayer(flow)
    //     }
    // },
    // 三维地形: async (map) => {
    //     if (map.getLayer('三维地形')) useLayerStore().terrainLayer.show()
    //     else {
    //         let terrainLayer = new TerrainLayer(14)
    //         map.addLayer(terrainLayer)
    //         useLayerStore().setTerrainLayer(terrainLayer)
    //     }
    // },

    ///////////////全江概貌
    /////// 行政区划
    省级行政区: async (map) => {
        !map.getSource('cityBoundary') &&
            map.addSource('cityBoundary', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/cityBoundary/{x}/{y}/{z}'],
            })
        if (map.getLayer('省级行政区')) {
            map.setLayoutProperty('省级行政区', 'visibility', 'visible')
        } else {
            map.addLayer({
                id: '省级行政区',
                type: 'fill',
                source: 'cityBoundary',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'fill-color': [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important等于1
                        "rgb(245,244,238)",                // 使用这个颜色
                        "rgb(222, 242, 252)"                 // 否则使用这个颜色
                    ],
                    'fill-opacity': 1.0,
                },
            })
        }
    },
    市级行政区: async (map) => {
        !map.getSource('cityBoundaryLine') &&
            map.addSource('cityBoundaryLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/cityBoundaryLine/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/shijie.png', '市界')
        !map.getLayer('市级行政区') &&
            map.addLayer({
                id: '市级行政区',
                type: 'line',
                source: 'cityBoundaryLine',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'line-pattern': '市界',
                    // 'line-color': 'rgb(176,176,153)',
                    // 'line-width': 1.0,
                    'line-width': 1.0,
                    'line-opacity': [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                        // 0.5,
                        1.0,
                        0.0
                    ],
                    // 'line-dasharray': [10, 5, 2],
                },
            })
    },
    '市级行政区-注记': async (map) => {
        if (!map.getSource('District-point')) {
            map.addSource('District-point', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/cityBoundary/{x}/{y}/{z}',
                ],
            })
        }
        !map.getLayer('市级行政区-注记') &&
            map.addLayer({
                id: '市级行政区-注记',
                type: 'symbol',
                source: 'District-point',
                'source-layer': 'default',
                minzoom: 6,
                maxzoom: 10,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-anchor': 'bottom',
                    'text-offset': [
                        'match',
                        ['get', 'name'],
                        '无锡市',
                        [2, 0],
                        '常州市',
                        [1, 0],
                        [0, 0],
                    ],
                    'text-size': 14,
                    'text-allow-overlap': true,
                },
                paint: {
                    'text-color': 'rgb(82, 81, 84)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                    'text-letter-spacing': 0.5
                },
            })
    },
    /////// 河道分段
    河道分段: async (map) => {
        let nameLists = ['南京河段', '镇扬河段', '澄通河段', '扬中河段', '河口段',]
        let boldLineLists = ['assist2', ...nameLists]
        !map.getSource('river_division_line') &&
            map.addSource('river_division_line', {
                // type: 'geojson',
                // data: river_division_line
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverSplitLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('river_division_line') &&
            map.addLayer({
                id: 'river_division_line',
                type: 'line',
                minzoom: 8,
                maxzoom: 11,
                source: 'river_division_line',
                'source-layer': 'default',
                paint: {
                    'line-color': 'rgb(110, 107, 106)',
                    'line-width': [
                        'case',
                        ["in", ["get", "name"], ["literal", boldLineLists]],
                        4.0,
                        2.0
                    ],
                    'line-blur': [
                        'case',
                        ["in", ["get", "name"], ["literal", nameLists]],
                        0.0,
                        1.0
                    ],
                    "line-dasharray": [
                        'match',
                        ["get", "name"],
                        'assist',
                        [3, 1],
                        [1, 0],
                    ]
                }
            })
    },
    '河道分段-注记': async (map) => {
        !map.getSource('river_division_line') &&
            map.addSource('river_division_line', {
                // type: 'geojson',
                // data: river_division_line
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverSplitLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河道分段-注记') &&
            map.addLayer({
                id: '河道分段-注记',
                type: 'symbol',
                source: 'river_division_line',
                maxzoom: 11,
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'symbol-placement': "line-center",
                    'text-size': 29,
                    'text-offset': [0, 0.2],
                    'text-anchor': 'top',
                    'text-allow-overlap': true,
                },
                paint: {
                    'text-color': 'rgb(35, 46, 71)',
                    'text-opacity': [
                        'match',
                        ["get", "name"],
                        'assist',
                        0.0,
                        1.0
                    ],
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                }
            })
    },
    '河道分段-影像': async (map) => {
        let nameLists = ['南京河段', '镇扬河段', '澄通河段', '扬中河段', '河口段',]
        let boldLineLists = ['assist2', ...nameLists]
        !map.getSource('river_division_line') &&
            map.addSource('river_division_line', {
                // type: 'geojson',
                // data: river_division_line
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverSplitLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河道分段-影像') &&
            map.addLayer({
                id: '河道分段-影像',
                type: 'line',
                minzoom: 8,
                maxzoom: 11,
                source: 'river_division_line',
                'source-layer': 'default',
                paint: {
                    'line-color': 'rgb(220, 220, 220)',
                    'line-width': [
                        'case',
                        ["in", ["get", "name"], ["literal", boldLineLists]],
                        4.0,
                        2.0
                    ],
                    'line-blur': [
                        'case',
                        ["in", ["get", "name"], ["literal", nameLists]],
                        0.0,
                        1.0
                    ],
                    "line-dasharray": [
                        'match',
                        ["get", "name"],
                        'assist',
                        [3, 1],
                        [1, 0],
                    ]
                }
            })
    },

    河道分段点: async (map) => {
        !map.getSource('river_division_point') &&
            map.addSource('river_division_point', {
                // type: 'geojson',
                // data: river_division_point
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/riverSplitPoint/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河道分段点') &&
            map.addLayer({
                id: '河道分段点',
                type: 'circle',
                source: 'river_division_point',
                'source-layer': 'default',
                minzoom: 7,
                maxzoom: 14,
                paint: {
                    'circle-color': 'rgb(35,46,71)',
                    'circle-radius': 7.0,
                }
            })
    },
    '河道分段点-影像': async (map) => {
        !map.getSource('river_division_point') &&
            map.addSource('river_division_point', {
                // type: 'geojson',
                // data: river_division_point
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/riverSplitPoint/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河道分段点-影像') &&
            map.addLayer({
                id: '河道分段点',
                type: 'circle',
                source: 'river_division_point',
                'source-layer': 'default',
                minzoom: 7,
                maxzoom: 14,
                paint: {
                    'circle-color': 'rgb(35,46,71)',
                    'circle-radius': 7.0,
                }
            })
    },
    '河道分段点-注记': async (map) => {
        !map.getSource('river_division_point') &&
            map.addSource('river_division_point', {
                // type: 'geojson',
                // data: river_division_point
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/riverSplitPoint/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河道分段点-注记') &&
            map.addLayer({
                id: '河道分段点-注记',
                type: 'symbol',
                source: 'river_division_point',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'symbol-placement': 'point',
                    'text-size': 20,
                    'text-offset': [0.0, 0.2],
                    'text-anchor': 'top'
                },
                paint: {
                    'text-color': 'rgb(35,46,71)',
                    'text-opacity': [
                        'match',
                        ["get", "name"],
                        'assist',
                        0.0,
                        1.0
                    ],
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                }
            })
    },
    ////// 骨干河道
    骨干河道: async (map) => {
        !map.getSource('riverArea') &&
            map.addSource('riverArea', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverArea/{x}/{y}/{z}'],
            })
        const waterInZoom1 = [1, 2, 3, 4, 5]
        const waterInZoom2 = [1, 2, 3, 4, 5, 6]
        const waterInZoom3 = [1, 2, 3, 4, 5, 6, 7]
        const waterInZoom4 = [1, 2, 3, 4, 5, 6, 7, 8]
        !map.getLayer('骨干河道') &&
            map.addLayer({
                id: '骨干河道',
                type: 'fill',
                source: 'riverArea',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'fill-color': 'rgb(171,225,250)',
                    // 'fill-color': 'rgb(255,0,0)',
                    'fill-opacity': [
                        "step",
                        ["zoom"],
                        [
                            "case",
                            ["in", ["get", "level"], ['literal', waterInZoom1]],
                            1.0,
                            0.0
                        ],
                        9,
                        [
                            "case",
                            ["in", ["get", "level"], ['literal', waterInZoom2]],
                            1,
                            0,
                        ],
                        10,
                        [
                            "case",
                            ["in", ["get", "level"], ['literal', waterInZoom3]],
                            1,
                            0,
                        ],
                        11,
                        [
                            "case",
                            ["in", ["get", "level"], ['literal', waterInZoom4]],
                            1,
                            0,
                        ],
                        12,
                        1,// > 14
                    ],
                },
            })
    },
    '骨干河道-注记': async (map) => {
        const waterInZoom1 = [1, 2, 3, 4, 5]
        const waterInZoom2 = [1, 2, 3, 4, 5, 6]
        const waterInZoom3 = [1, 2, 3, 4, 5, 6, 7]
        const waterInZoom4 = [1, 2, 3, 4, 5, 6, 7, 8]
        if (!map.getSource('riverArea-lable')) {
            map.addSource('riverArea-lable', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/riverArea/{x}/{y}/{z}',
                    // tileServer + '/tile/vector/riverArea/{x}/{y}/{z}',
                ],
            })
        }
        !map.getLayer('骨干河道-注记') &&
            map.addLayer({
                id: '骨干河道-注记',
                type: 'symbol',
                source: 'riverArea-lable',
                // source: 'riverArea',
                'source-layer': 'default',
                minzoom: 10,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'symbol-placement': 'point',
                    'text-variable-anchor': ["center", "top", "bottom", "left", "right"],
                    'text-size': 14,
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': 'rgb(31,144,218)',
                    'text-opacity': [
                        "step",
                        ["zoom"],
                        [
                            "case",
                            ["in", ["get", "level"], ['literal', waterInZoom2]],
                            1.0,
                            0.0
                        ],
                        11,
                        1,
                    ],
                },
            })
    },

    区域性骨干河道: async (map) => {
        !map.getSource('riverArea') &&
            map.addSource('riverArea', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverArea/{x}/{y}/{z}'],
            })
        !map.getLayer('区域性骨干河道') &&
            map.addLayer({
                id: '区域性骨干河道',
                type: 'fill',
                source: 'riverArea',
                'source-layer': 'default',
                filter: ['==', "kind", "区域性骨干河道"],
                layout: {},
                paint: {
                    'fill-color': 'rgb(171,225,250)',
                },
            })
    },
    '区域性骨干河道-注记': async (map) => {
        if (!map.getSource('riverArea-lable')) {
            map.addSource('riverArea-lable', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/riverArea/{x}/{y}/{z}',
                ],
            })
        }
        !map.getLayer('区域性骨干河道-注记') &&
            map.addLayer({
                id: '区域性骨干河道-注记',
                type: 'symbol',
                source: 'riverArea-lable',
                'source-layer': 'default',
                filter: ['==', 'kind', '区域性骨干河道'],
                minzoom: 10,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'symbol-placement': 'point',
                    'text-variable-anchor': ["center", "top", "bottom", "left", "right"],
                    'text-size': 18,
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': 'rgb(31,144,218)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },
    流域性河道: async (map) => {
        !map.getSource('riverArea') &&
            map.addSource('riverArea', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverArea/{x}/{y}/{z}'],
            })
        !map.getLayer('流域性河道') &&
            map.addLayer({
                id: '流域性河道',
                type: 'fill',
                source: 'riverArea',
                'source-layer': 'default',

                filter: ['==', 'kind', '流域性河道'],
                layout: {},
                paint: {
                    'fill-color': 'rgb(171,225,250)',
                },
            })
    },
    '流域性河道-注记': async (map) => {
        if (!map.getSource('riverArea-lable')) {
            map.addSource('riverArea-lable', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/riverArea/{x}/{y}/{z}',
                ],
            })
        }
        !map.getLayer('流域性河道-注记') &&
            map.addLayer({
                id: '流域性河道-注记',
                type: 'symbol',
                source: 'riverArea-lable',
                'source-layer': 'default',
                filter: ['==', 'kind', '流域性河道'],
                minzoom: 10,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'symbol-placement': 'point',
                    'text-variable-anchor': ["center", "top", "bottom", "left", "right"],
                    'text-size': 18,
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': 'rgb(31,144,218)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },
    其他河道: async (map) => {
        !map.getSource('riverArea') &&
            map.addSource('riverArea', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverArea/{x}/{y}/{z}'],
            })
        !map.getLayer('其他河道') &&
            map.addLayer({
                id: '其他河道',
                type: 'fill',
                source: 'riverArea',
                minzoom: zoomLevel1,
                'source-layer': 'default',
                filter: ['==', 'kind', ''],
                layout: {},
                paint: {
                    'fill-color': 'rgb(171,225,250)',
                },
            })
    },
    '其他河道-注记': async (map) => {
        if (!map.getSource('riverArea-lable')) {
            map.addSource('riverArea-lable', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/riverArea/{x}/{y}/{z}',
                ],
            })
        }
        !map.getLayer('其他河道-注记') &&
            map.addLayer({
                id: '其他河道-注记',
                type: 'symbol',
                source: 'riverArea-lable',
                'source-layer': 'default',
                filter: ['==', 'kind', ''],
                minzoom: 11,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'symbol-placement': 'point',
                    'text-variable-anchor': ["center", "top", "bottom", "left", "right"],
                    'text-size': 16,
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': 'rgb(31,144,218)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },

    ////// 大型湖泊
    大型湖泊: async (map) => {
        !map.getSource('lakeArea') &&
            map.addSource('lakeArea', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/lakeArea/{x}/{y}/{z}'],
            })
        !map.getLayer('大型湖泊') &&
            map.addLayer({
                id: '大型湖泊',
                type: 'fill',
                source: 'lakeArea',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'fill-color': 'rgb(171,225,248)',
                },
            })
    },
    '大型湖泊-注记': async (map) => {
        if (!map.getSource('lakeArea-lable')) {
            map.addSource('lakeArea-lable', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/lakeArea/{x}/{y}/{z}',
                ],
            })
        }
        !map.getLayer('大型湖泊-注记') &&
            map.addLayer({
                id: '大型湖泊-注记',
                type: 'symbol',
                source: 'lakeArea-lable',
                'source-layer': 'default',
                minzoom: 7,
                // maxzoom: 10,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["center", "top", "bottom", "left", "right"],
                    'text-size': 17,
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': 'rgb(25,143,219)',
                    'text-opacity': [
                        "step",
                        ["zoom"],
                        ["case", ["==", ["get", "if_important"], 1], 1, 0],
                        9,
                        [
                            "case",
                            ["==", ["get", "if_important"], 1],
                            1,
                            ["==", ["get", "if_important"], 0],
                            1,
                            0,
                        ],
                        13,
                        1,
                    ],
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 1,
                },
            })
    },
    ////// 水文站点
    水文站点: async (map) => {
        !map.getSource('hydroStationPoint') &&
            map.addSource('hydroStationPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/hydroStationPoint/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/shuiwenzhan.png', '水文站')
        !map.getLayer('水文站点') &&
            map.addLayer({
                id: '水文站点',
                type: 'symbol',
                source: 'hydroStationPoint',
                'source-layer': 'default',
                layout: {
                    'icon-image': '水文站',
                    "icon-size": [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                        1.3,                                  // 则图标大小为0.6
                        1.1                                   // 否则图标大小为0.4
                    ],
                    'icon-anchor': 'center',
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                    'icon-keep-upright': true,
                },
                paint: {
                    'icon-opacity': [
                        "step",
                        ["zoom"],
                        ["case", ["==", ["get", "if_important"], 1], 1, 0],
                        9,
                        [
                            "case",
                            ["==", ["get", "if_important"], 1],
                            1,
                            ["==", ["get", "if_important"], 0],
                            1,
                            0,
                        ],
                        13,
                        1,
                    ],
                },
            })
    },
    '水文站点-注记': async (map) => {
        !map.getSource('hydroStationPoint') &&
            map.addSource('hydroStationPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/hydroStationPoint/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('水文站点-注记') &&
            map.addLayer({
                id: '水文站点-注记',
                type: 'symbol',
                source: 'hydroStationPoint',
                'source-layer': 'default',
                minzoom: 8,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0.2, 0.6],
                    'text-anchor': 'top',
                    'text-variable-anchor': ["top", "bottom", "left", "right"],
                    // 'text-variable-anchor': ["bottom", "bottom-left", "bottom-right", "right", "top-right", "top-left", "left", "top",],
                    'text-size': ["case", ["==", ["get", "if_important"], 1], 18, 16],
                    'text-allow-overlap': true,
                },
                paint: {
                    "text-color": [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                        "rgba(23,35,120, 1.0)",                    // 则文本颜色为rgb(86, 39, 242)
                        "rgba(23,35,120, 0.8)"                       // 否则文本颜色为rgb(26, 11, 74)
                    ],
                    'text-opacity': [
                        "step",
                        ["zoom"],
                        ["case", ["==", ["get", "if_important"], 1], 1, 0],
                        9,
                        [
                            "case",
                            ["==", ["get", "if_important"], 1],
                            1,
                            ["==", ["get", "if_important"], 0],
                            1,
                            0,
                        ],
                        13,
                        1,
                    ],
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },

    ////////////// 工程情况
    ////////其他堤防
    其他堤防: async (map) => {
        !map.getSource('embankmentLine') &&
            map.addSource('embankmentLine', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/embankmentLine/{x}/{y}/{z}'],
            })
        await loadImage(map, '/legend/difang.png', '堤防')

        !map.getLayer('其他堤防') &&
            map.addLayer({
                id: '其他堤防',
                type: 'line',
                source: 'embankmentLine',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'line-pattern': '堤防',

                    'line-width': 5,
                },
            })
    },
    '其他堤防-注记': async (map) => {
        !map.getSource('embankmentLine') &&
            map.addSource('embankmentLine', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/embankmentLine/{x}/{y}/{z}'],
            })
        map.addLayer({
            id: '其他堤防-注记',
            type: 'symbol',
            source: 'embankmentLine',
            minzoom: 11,
            maxzoom: 18,
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'sp_name'],
                'symbol-placement': 'line',
                // 'symbol-placement': 'point',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-variable-anchor': ["left", "right", "center", "top", "bottom",],
                'text-size': 23,
                'text-offset': [5, 0],
                'text-allow-overlap': false,
            },
            paint: {
                'text-color': 'rgb(105, 2, 89)',
                'text-opacity': [
                    "case",
                    ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                    1.0,                    // 则文本颜色为rgb(86, 39, 242)
                    0.7                       // 否则文本颜色为rgb(26, 11, 74)
                ]
            },
        })
    },
    ////////过江通道
    /*
    已建--plan==1  52, 0, 143
    在建--plan==0  196, 50, 6
    规划--plan==-1 179, 4, 74
    */

    '过江通道-隧道/通道': async (map) => {
        !map.getSource('riverPassageLine') &&
            map.addSource('riverPassageLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverPassageLine/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/test.png', 'test')
        await loadImage(map, '/legend/yijiantongdao1.png', '已建')
        await loadImage(map, '/legend/zaijiantongdao1.png', '在建')
        await loadImage(map, '/legend/guihuatongdao1.png', '规划')
        !map.getLayer('过江通道-隧道/通道') &&
            map.addLayer({
                id: '过江通道-隧道/通道',
                type: 'line',
                source: 'riverPassageLine',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    // 'line-pattern': 'test',
                    'line-pattern': [
                        'match',
                        ['get', 'plan'],
                        1,
                        '已建',
                        0,
                        '在建',
                        -1,
                        '规划',
                        'test', // 默认颜色为黑色
                    ],
                    // 'line-color': [
                    //     'match',
                    //     ['get', 'plan'],
                    //     1,
                    //     'rgb(8, 74, 1)',
                    //     0,
                    //     'rgb(16, 138, 3)',
                    //     -1,
                    //     'rgb(23, 209, 2)',
                    //     'rgb(0, 0, 0)', // 默认颜色为黑色
                    // ],
                    'line-width': 4.0,
                },
            })
    },
    '过江通道-桥墩': async (map) => {
        !map.getSource('riverPassagePier') &&
            map.addSource('riverPassagePier', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverPassagePier/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('过江通道-桥墩') &&
            map.addLayer({
                id: '过江通道-桥墩',
                type: 'fill-extrusion',
                source: 'riverPassagePier',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'fill-extrusion-color': [
                        'match',
                        ['get', 'plan'],
                        1,
                        'rgb(8, 74, 1)',
                        0,
                        'rgb(16, 138, 3)',
                        -1,
                        'rgb(23, 209, 2)',
                        // 如果plan属性不是1, 0, 或 -1，可以设置一个默认颜色
                        'rgb(0, 0, 0)', // 默认颜色为黑色
                    ],
                    'fill-extrusion-base': 0,
                    'fill-extrusion-height': 200,
                    'fill-extrusion-opacity': 1.0,
                },
            })
    },
    '过江通道-桥': async (map) => {
        !map.getSource('riverPassagePolygon') &&
            map.addSource('riverPassagePolygon', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverPassagePolygon/{x}/{y}/{z}',
                ],
            })
        // await loadImage(map, '/legend/test.png', 'test')

        !map.getLayer('过江通道-桥') &&
            // map.addLayer({
            //     id: '过江通道-桥',
            //     type: 'fill-extrusion',
            //     source: 'riverPassagePolygon',
            //     'source-layer': 'default',
            //     layout: {},
            //     paint: {
            //         'fill-extrusion-color': [
            //             'match',
            //             ['get', 'plan'],
            //             1,
            //             'rgb(8, 74, 1)',
            //             0,
            //             'rgb(16, 138, 3)',
            //             -1,
            //             'rgb(23, 209, 2)',
            //             'rgb(0, 0, 0)', // 默认颜色为黑色
            //         ],
            //         'fill-extrusion-base': 200,
            //         'fill-extrusion-height': 210,
            //         'fill-extrusion-opacity': 1.0,
            //     },
            // })
            map.addLayer({
                id: '过江通道-桥',
                type: 'fill',
                source: 'riverPassagePolygon',
                'source-layer': 'default',
                layout: {},
                paint: {
                    // 'fill-color': [
                    //     'match',
                    //     ['get', 'plan'],
                    //     1,
                    //     'rgb(8, 74, 1)',
                    //     0,
                    //     'rgb(16, 138, 3)',
                    //     -1,
                    //     'rgb(23, 209, 2)',
                    //     'rgb(0, 0, 0)', // 默认颜色为黑色
                    // ],
                    'fill-color': 'rgb(63,61,61)'
                    // 'fill-pattern': 'test',
                },
            })
    },
    '过江通道-桥-注记': async (map) => {
        !map.getSource('riverPassagePolygon') &&
            map.addSource('riverPassagePolygon', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverPassagePolygon/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('过江通道-桥-注记') &&
            map.addLayer({
                id: '过江通道-桥-注记',
                type: 'symbol',
                minzoom: 11,
                source: 'riverPassagePolygon',
                'source-layer': 'default',

                layout: {
                    // 'text-field': ['get', 'name'],
                    "text-field": [
                        "concat",
                        ["get", "name"], // 首先获取name字段的值
                        ["case",
                            ["==", ["get", "plan"], 1],
                            '   已建',
                            ["==", ["get", "plan"], 0],
                            '   在建',
                            ["==", ["get", "plan"], -1],
                            '   规划',
                            ""
                        ]
                    ],

                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-anchor': 'bottom',
                    'symbol-placement': 'line',
                    'text-size': 12,
                    'text-writing-mode': ['vertical', 'horizontal'],
                },
                paint: {
                    'text-color': 'rgb(84, 78, 76)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },
    '过江通道-隧道/通道-注记': async (map) => {
        !map.getSource('riverPassageLine') &&
            map.addSource('riverPassageLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverPassageLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('过江通道-隧道/通道-注记') &&
            map.addLayer({
                id: '过江通道-隧道/通道-注记',
                type: 'symbol',
                minzoom: 11,
                source: 'riverPassageLine',
                'source-layer': 'default',
                layout: {
                    // 'text-field': ['get', 'name'],
                    "text-field": [
                        "concat",
                        ["get", "name"], // 首先获取name字段的值
                        ["case",
                            ["==", ["get", "plan"], 1],
                            '  已建',
                            ["==", ["get", "plan"], 0],
                            '  在建',
                            ["==", ["get", "plan"], -1],
                            '  规划',
                            ""
                        ]
                        // '  已建'
                    ],
                    'symbol-placement': 'line',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 1],
                    'text-anchor': 'bottom',
                    'text-size': 15,
                    // 'text-writing-mode': ['vertical', 'horizontal'],
                },
                paint: {
                    'text-color': 'rgb(84, 78, 76)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },

    // '过江通道': async (map) => {
    //     !map.getSource('riverBridge') &&
    //         map.addSource('riverBridge', {
    //             type: 'geojson',
    //             data: channel_line
    //         })
    //     await loadImage(map, '/legend/已建通道1.png', '已建')
    //     await loadImage(map, '/legend/在建通道1.png', '在建')
    //     await loadImage(map, '/legend/规划通道1.png', '规划')
    //     !map.getLayer('过江通道') &&
    //         map.addLayer({
    //             id: '过江通道',
    //             type: 'line',
    //             source: 'riverBridge',
    //             // 'source-layer': 'default',
    //             layout: {
    //                 'line-cap': 'round',
    //                 'line-join': 'round',
    //             },
    //             paint: {
    //                 // 'line-opacity': 1,
    //                 // 'line-pattern': 'test',
    //                 'line-pattern': [
    //                     'match',
    //                     ['get', 'plan'],
    //                     '1',
    //                     '已建',
    //                     '0',
    //                     '在建',
    //                     '-1',
    //                     '规划',
    //                     'test', // 默认颜色为黑色
    //                 ],
    //                 'line-width': 6.0,
    //             },
    //         })
    // },
    '已建通道': async (map) => {

        !map.getSource('riverBridge') &&
            map.addSource('riverBridge', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBridge/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/yijiantongdao2.png', '已建')
        // await loadImage(map, '/legend/在建通道1.png', '在建')
        // await loadImage(map, '/legend/规划通道1.png', '规划')
        !map.getLayer('已建通道') &&
            map.addLayer({
                id: '已建通道',
                type: 'line',
                source: 'riverBridge',
                // filter: ['==', 'plan', '1'],
                filter: ['==', 'plan', 1],
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    // 'line-opacity': 1,
                    // 'line-pattern': 'test',
                    'line-pattern': '已建',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 1],
                        10,
                        ['literal', 6],
                        13,
                        ['literal', 10],
                    ],

                },
            })
    },
    '在建通道': async (map) => {

        !map.getSource('riverBridge') &&
            map.addSource('riverBridge', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBridge/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/zaijiantongdao1.png', '在建')
        !map.getLayer('在建通道') &&
            map.addLayer({
                id: '在建通道',
                type: 'line',
                source: 'riverBridge',
                'source-layer': 'default',
                // filter: ['==', 'plan', '0'],
                filter: ['==', 'plan', 0],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    // 'line-opacity': 1,
                    // 'line-pattern': 'test',
                    'line-pattern':
                        '在建',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 1],
                        10,
                        ['literal', 6],
                        13,
                        ['literal', 10],
                    ],

                },
            })
    },
    '规划通道': async (map) => {

        !map.getSource('riverBridge') &&
            map.addSource('riverBridge', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBridge/{x}/{y}/{z}',
                ],
            })
        // await loadImage(map, '/legend/规划通道2.png', '规划')
        !map.getLayer('规划通道') &&
            map.addLayer({
                id: '规划通道',
                type: 'line',
                source: 'riverBridge',
                'source-layer': 'default',
                // filter: ['==', 'plan', '-1'],
                filter: ['==', 'plan', -1],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    // 'line-opacity': 1,
                    // 'line-pattern': 'test',
                    // 'line-pattern':
                    //     '规划',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 1],
                        10,
                        ['literal', 6],
                        // 13,
                        // ['literal', 10],
                    ],
                    'line-dasharray': [
                        2, 3
                    ],
                    'line-opacity': 0.5,
                },
            })
    },
    '过江通道辅助线': async (map) => {
        !map.getSource('riverBridgeAssist') &&
            map.addSource('riverBridgeAssist', {
                type: 'geojson',
                data: riverBridgeAssist,
            })
        !map.getLayer('过江通道辅助线') &&
            map.addLayer({
                id: '过江通道辅助线',
                type: 'line',
                source: 'riverBridgeAssist',
                layout: {
                },
                paint: {
                    'line-color': '#ff0303',
                    'line-dasharray': [4, 10],
                }
            })
    },
    // '过江通道-注记': async (map) => {
    //     !map.getSource('riverBridge') &&
    //         map.addSource('riverBridge', {
    //             type: 'geojson',
    //             data: channel_line
    //         })
    //     !map.getLayer('过江通道-注记') &&
    //         map.addLayer({
    //             id: '过江通道-注记',
    //             type: 'symbol',
    //             minzoom: 11,
    //             source: 'riverBridge',
    //             // 'source-layer': 'default',
    //             layout: {
    //                 // 'text-field': ['get', 'name'],
    //                 "text-field": [
    //                     "concat",
    //                     ["get", "name"], // 首先获取name字段的值
    //                     ["case",
    //                         ["==", ["get", "plan"], `1`],
    //                         ' (已建)',
    //                         ["==", ["get", "plan"], `0`],
    //                         ' (在建)',
    //                         ["==", ["get", "plan"], `-1`],
    //                         ' (规划)',
    //                         ""
    //                     ]
    //                 ],
    //                 'symbol-placement': 'line',
    //                 'text-font': [
    //                     'Open Sans Semibold',
    //                     'Arial Unicode MS Bold',
    //                 ],
    //                 'text-offset': [0, 1],
    //                 'text-anchor': 'bottom',
    //                 'text-size': 13,
    //                 // 'text-writing-mode': ['vertical', 'horizontal'],
    //             },
    //             paint: {
    //                 'text-color': 'rgb(84, 78, 76)',
    //                 'text-halo-color': "rgba(255, 255, 255, 1.0)",
    //                 'text-halo-width': 2.0,
    //             }
    //         })
    // },
    '已建通道-注记': async (map) => {
        !map.getSource('riverBridge') &&
            map.addSource('riverBridge', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBridge/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('已建通道-注记') &&
            map.addLayer({
                id: '已建通道-注记',
                type: 'symbol',
                minzoom: 10,

                source: 'riverBridge',
                filter: ['==', 'plan', 1],
                'source-layer': 'default',
                layout: {
                    // 'text-field': ['get', 'name'],
                    "text-field": [
                        "concat",
                        ["get", "name"], // 首先获取name字段的值
                        ' (已建)',
                    ],
                    'symbol-placement': 'line-center',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["bottom", "top", "left", "right"],
                    // 'text-size': 18,
                    'text-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        12,
                        ['literal', 20],
                        14,
                        ['literal', 21],
                        16,
                        ['literal', 22],
                    ],
                    'text-allow-overlap': true,
                    // 'text-writing-mode': ['vertical', 'horizontal'],
                },
                paint: {
                    'text-color': 'rgb(84, 78, 76)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                }
            })
    },
    '在建通道-注记': async (map) => {
        !map.getSource('riverBridge') &&
            map.addSource('riverBridge', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBridge/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('在建通道-注记') &&
            map.addLayer({
                id: '在建通道-注记',
                type: 'symbol',
                minzoom: 10,

                source: 'riverBridge',
                // filter: ['==', 'plan', '0'],
                filter: ['==', 'plan', 0],
                'source-layer': 'default',
                layout: {
                    // 'text-field': ['get', 'name'],
                    "text-field": [
                        "concat",
                        ["get", "name"], // 首先获取name字段的值
                        ' (在建)',
                    ],
                    // 'symbol-placement': 'line',
                    'symbol-placement': 'line-center',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["bottom", "top", "left", "right"],
                    // 'text-anchor': 'bottom',
                    'text-size': 18,
                    'text-allow-overlap': true,

                    // 'text-writing-mode': ['vertical', 'horizontal'],
                },
                paint: {
                    'text-color': 'rgb(84, 78, 76)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                }
            })
    },
    '规划通道-注记': async (map) => {
        !map.getSource('riverBridge') &&
            map.addSource('riverBridge', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBridge/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('规划通道-注记') &&
            map.addLayer({
                id: '规划通道-注记',
                type: 'symbol',
                minzoom: 10,
                source: 'riverBridge',
                // filter: ['==', 'plan', '-1'],
                filter: ['==', 'plan', -1],
                'source-layer': 'default',
                layout: {
                    // 'text-field': ['get', 'name'],
                    "text-field": [
                        "concat",
                        ["get", "name"], // 首先获取name字段的值
                        ' (规划)',
                    ],
                    // 'symbol-placement': 'line',
                    'symbol-placement': 'line-center',
                    'text-allow-overlap': true,

                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["bottom", "top", "left", "right"],
                    // 'text-anchor': 'bottom',
                    'text-size': 17,

                    // 'text-writing-mode': ['vertical', 'horizontal'],
                },
                paint: {
                    'text-color': 'rgb(84, 78, 76)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                }
            })
    },
    ///////沿江码头
    沿江码头: async (map) => {
        !map.getSource('dockArea') &&
            map.addSource('dockArea', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/dockArea/{x}/{y}/{z}'],
            })
        !map.getLayer('沿江码头') &&
            map.addLayer({
                id: '沿江码头',
                type: 'fill',
                source: 'dockArea',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'fill-color': 'rgb(128, 128, 128)',
                },
            })
    },
    '沿江码头-注记': async (map) => {
        !map.getSource('dockArea-label') &&
            map.addSource('dockArea-label', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/dockArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('沿江码头-注记') &&
            map.addLayer({
                id: '沿江码头-注记',
                type: 'symbol',
                source: 'dockArea-label',
                'source-layer': 'default',
                minzoom: 12,
                layout: {
                    'text-field': ['get', 'project_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-offset': [0, 1.25],
                    'text-variable-anchor': ["bottom", "top", "left", "right"],
                    'text-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        12,
                        ['literal', 10],
                        14,
                        ['literal', 15],
                        16,
                        ['literal', 18],
                    ],
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': 'rgb(82, 82, 84)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 1.0,
                },
            })
    },

    水库大坝: async (map) => {
        !map.getSource('reservoirArea') &&
            map.addSource('reservoirArea', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/reservoirArea/{x}/{y}/{z}'],
            })
        await loadImage(map, '/legend/shuiku.png', '水库')
        !map.getLayer('水库大坝') &&
            map.addLayer({
                id: '水库大坝',
                type: 'fill',
                source: 'reservoirArea',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'fill-color': 'rgb(171,225,247)',
                },
            })
    },
    '水库大坝-注记': async (map) => {
        !map.getSource('reservoirArea-label') &&
            map.addSource('reservoirArea-label', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/center/reservoirArea/{x}/{y}/{z}'],
            })
        !map.getLayer('水库大坝-注记') &&
            map.addLayer({
                id: '水库大坝-注记',
                type: 'symbol',
                minzoom: 12,
                source: 'reservoirArea-label',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                    ],
                    'text-variable-anchor': ["center", "top", "bottom", "left", "right"],
                    'text-size': 16,
                    'text-allow-overlap': false,

                },
                paint: {
                    'text-color': 'rgb(31,144,218)',
                },
            })
    },
    水闸工程: async (map) => {
        !map.getSource('sluiceArea') &&
            map.addSource('sluiceArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/sluiceArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('水闸工程') &&
            map.addLayer({
                id: '水闸工程',
                type: 'fill',
                source: 'sluiceArea',
                'source-layer': 'default',
                minzoom: 11,
                maxzoom: 22,
                layout: {
                },
                paint: {
                    'fill-color': 'rgb(255,0,0)',
                },
            })
    },
    '水闸工程-重点': async (map) => {
        !map.getSource('sluiceArea-center') &&
            map.addSource('sluiceArea-center', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
                ],
            })
        loadImage(map, '/legend/shuizha.png', '水闸')
        !map.getLayer('水闸工程-重点') &&
            map.addLayer({
                id: '水闸工程-重点',
                type: 'symbol',
                source: 'sluiceArea-center',
                'source-layer': 'default',
                minzoom: 7,
                maxzoom: 12,
                filter: ['==', 'if_important', 1],
                layout: {
                    'icon-image': '水闸',
                    "icon-size": 0.2,
                    'icon-allow-overlap': true,
                },
                paint: {
                    'icon-opacity': 1.0,
                },
            })
    },
    '水闸工程-注记': async (map) => {
        !map.getSource('sluiceArea') &&
            map.addSource('sluiceArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('水闸工程-注记') &&
            map.addLayer({
                id: '水闸工程-注记',
                type: 'symbol',
                // source: 'sluiceArea-center',
                source: 'sluiceArea',
                'source-layer': 'default',
                minzoom: 9,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                    ],
                    'text-offset': [0.0, 0.5],
                    'text-anchor': 'center',
                    'text-size': [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                        16,                    // 则文本颜色为rgb(86, 39, 242)
                        15                       // 否则文本颜色为rgb(26, 11, 74)
                    ],
                    'text-allow-overlap': false,

                },
                paint: {
                    "text-color": [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                        "rgba(73, 83, 92,1.0)",                    // 则文本颜色为rgb(86, 39, 242)
                        "rgba(73, 83, 92,0.8)"                       // 否则文本颜色为rgb(26, 11, 74)
                    ],
                    'text-opacity': [
                        "step",
                        ["zoom"],
                        ["case", ["==", ["get", "if_important"], 1], 1, 0],
                        11,
                        [
                            "case",
                            ["==", ["get", "if_important"], 1],
                            1,
                            ["==", ["get", "if_important"], 0],
                            1,
                            0,
                        ],
                        12,
                        1,
                    ],
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },

    大中型水闸: async (map) => {
        !map.getSource('sluiceArea-center') &&
            map.addSource('sluiceArea-center', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
                ],
            })
        loadImage(map, '/legend/shuizha.png', '水闸')

        map.addLayer({
            id: '大中型水闸',
            type: 'symbol',
            'source-layer': 'default',
            source: 'sluiceArea-center',
            filter: ['==', 'if_important', 1],
            minzoom: 8,
            maxzoom: 14,
            layout: {
                'icon-image': '水闸',
                "icon-size": 0.2,
                'icon-allow-overlap': true,
                // 'icon-allow-overlap': false,
                'icon-rotate': ['get', 'rotation_angle']
            },
            paint: {
                'icon-opacity': 1.0,
            },
        })
    },
    '大中型水闸-注记': async (map) => {
        !map.getSource('sluiceArea') &&
            map.addSource('sluiceArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('大中型水闸-注记') &&
            map.addLayer({
                id: '大中型水闸-注记',
                type: 'symbol',
                source: 'sluiceArea',
                'source-layer': 'default',
                filter: ['==', 'if_important', 1],
                minzoom: 10,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["top", "top-left", "top-right", "bottom-left", "bottom-right", "left", "right"],
                    'text-offset': [0, 0.5],
                    'text-size': 21,
                    'text-allow-overlap': false,
                },
                paint: {
                    "text-color": "rgba(73, 83, 92,1.0)",
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },
    其他水闸: async (map) => {
        !map.getSource('sluiceArea') &&
            map.addSource('sluiceArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('其他水闸') &&
            map.addLayer({
                id: '其他水闸',
                type: 'symbol',
                'source-layer': 'default',
                source: 'sluiceArea-center',
                filter: ['==', 'if_important', 0],
                minzoom: 11,
                maxzoom: 14,
                layout: {
                    'icon-image': '水闸',
                    "icon-size": 0.18,
                    'icon-allow-overlap': true,
                    // 'icon-allow-overlap': false,
                    'icon-rotate': ['get', 'rotation_angle']
                },
                paint: {
                    'icon-opacity': 0.9,
                },
            })
    },
    '其他水闸-注记': async (map) => {
        !map.getSource('sluiceArea') &&
            map.addSource('sluiceArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('其他水闸-注记') &&
            map.addLayer({
                id: '其他水闸-注记',
                type: 'symbol',
                source: 'sluiceArea',
                filter: ['==', 'if_important', 0],
                'source-layer': 'default',
                minzoom: 11,
                maxzoom: 22,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["top", "top-left", "top-right", "bottom-left", "bottom-right", "left", "right"],
                    'text-offset': [0, 0.5],
                    'text-size': 18,
                    // 'text-allow-overlap': true,
                    'text-allow-overlap': false,
                },
                paint: {
                    "text-color": "rgba(73, 83, 92,0.8)",
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },

    '大中型水闸-面': async (map) => {
        !map.getSource('sluiceArea') &&
            map.addSource('sluiceArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/sluiceArea/{x}/{y}/{z}'
                ],
            })
        !map.getLayer('大中型水闸-面') &&
            map.addLayer({
                id: '大中型水闸-面',
                type: 'fill',
                filter: ['==', 'if_important', 1],
                source: 'sluiceArea',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-color': 'rgb(255,0,0)',
                },
            })
    },
    '其他水闸-面': async (map) => {
        !map.getSource('sluiceArea') &&
            map.addSource('sluiceArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/sluiceArea/{x}/{y}/{z}'
                ],
            })
        !map.getLayer('其他水闸-面') &&
            map.addLayer({
                id: '其他水闸-面',
                type: 'fill',
                filter: ['==', 'if_important', 0],
                source: 'sluiceArea',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-color': 'rgb(255,0,0)',
                },
            })
    },


    泵站工程: async (map) => {
        !map.getSource('pumpArea') &&
            map.addSource('pumpArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/bengzhan.png', '泵站')
        !map.getLayer('泵站工程') &&
            map.addLayer({
                id: '泵站工程',
                type: 'symbol',
                source: 'pumpArea',
                'source-layer': 'default',
                layout: {
                    'icon-image': '泵站',
                    'icon-size': 1.0,
                    'icon-allow-overlap': true,
                },
                paint: {
                    'icon-opacity': [
                        "step",
                        ["zoom"],
                        ["case", ["==", ["get", "if_important"], 1], 1, 0],
                        12,
                        [
                            "case",
                            ["==", ["get", "if_important"], 1],
                            1,
                            ["==", ["get", "if_important"], 0],
                            1,
                            0,
                        ],
                        13,
                        1,
                    ],
                },
            })
    },
    '泵站工程-注记': async (map) => {
        !map.getSource('pumpArea') &&
            map.addSource('pumpArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('泵站工程-注记') &&
            map.addLayer({
                id: '泵站工程-注记',
                type: 'symbol',
                source: 'pumpArea',
                'source-layer': 'default',
                minzoom: zoomLevel2,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-anchor': 'bottom',
                    'text-offset': [0, -1.0],
                    'text-allow-overlap': false,
                    'text-size': 12,
                },
                paint: {
                    'text-color': 'rgb(26, 50, 71)',
                    'text-opacity': [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                        1.0,                    // 则文本颜色为rgb(86, 39, 242)
                        0.85                    // 否则文本颜色为rgb(26, 11, 74)
                    ]
                },
            })
    },

    大中型泵站: async (map) => {
        !map.getSource('pumpArea') &&
            map.addSource('pumpArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/bengzhan.png', '泵站')
        !map.getLayer('大中型泵站') &&
            map.addLayer({
                id: '大中型泵站',
                type: 'symbol',
                source: 'pumpArea',
                filter: ["==", "if_important", '1'],
                'source-layer': 'default',
                minzoom: 8,
                maxzoom: 22,
                layout: {
                    'icon-image': '泵站',
                    'icon-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 1.0],
                        10,
                        ['literal', 1.2],
                        13,
                        ['literal', 1.8],
                    ],
                    'icon-allow-overlap': true,
                    // 'icon-allow-overlap': false,
                },
                paint: {
                },
            })
    },
    '大中型泵站-注记': async (map) => {
        !map.getSource('pumpArea') &&
            map.addSource('pumpArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('大中型泵站-注记') &&
            map.addLayer({
                id: '大中型泵站-注记',
                type: 'symbol',
                source: 'pumpArea',
                filter: ["==", "if_important", '1'],
                'source-layer': 'default',
                minzoom: 10,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["top", "top-left", "top-right", "bottom-left", "bottom-right", "left", "right"],
                    'text-offset': [0, -1.0],
                    // 'text-allow-overlap': true,
                    'text-allow-overlap': false,
                    'text-size': 21,
                },
                paint: {
                    'text-color': 'rgba(0,54,134,0.8)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })

    },
    其他泵站: async (map) => {
        !map.getSource('pumpArea') &&
            map.addSource('pumpArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/bengzhan.png', '泵站')
        !map.getLayer('其他泵站') &&
            map.addLayer({
                id: '其他泵站',
                filter: ["==", "if_important", '0'],
                type: 'symbol',
                source: 'pumpArea',
                'source-layer': 'default',
                minzoom: 12,
                layout: {
                    'icon-image': '泵站',
                    'icon-size': 1.3,
                    'icon-allow-overlap': true,
                    // 'icon-allow-overlap': false,
                },
                paint: {
                },
            })
    },
    '其他泵站-注记': async (map) => {
        !map.getSource('pumpArea') &&
            map.addSource('pumpArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('其他泵站-注记') &&
            map.addLayer({
                id: '其他泵站-注记',
                type: 'symbol',
                source: 'pumpArea',
                'source-layer': 'default',
                filter: ["==", "if_important", '0'],
                minzoom: 12,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-anchor': 'bottom',
                    'text-variable-anchor': ["top", "top-left", "top-right", "bottom-left", "bottom-right", "left", "right"],
                    'text-offset': [0, -1.0],
                    'text-allow-overlap': false,
                    'text-size': 16,
                },
                paint: {
                    'text-color': 'rgb(26, 50, 71)',
                    'text-opacity': 0.75,
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },


    枢纽工程: async (map) => {
        !map.getSource('combineProjectPoint') &&
            map.addSource('combineProjectPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/combineProjectPoint/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/shuniu.png', '枢纽')
        !map.getLayer('枢纽工程') &&
            map.addLayer({
                id: '枢纽工程',
                type: 'symbol',
                source: 'combineProjectPoint',
                'source-layer': 'default',
                layout: {
                    'icon-image': '枢纽',
                    'icon-size': 0.2,
                    'icon-allow-overlap': true,
                },
                paint: {},
            })
    },
    '枢纽工程-注记': async (map) => {
        !map.getSource('combineProjectPoint') &&
            map.addSource('combineProjectPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/combineProjectPoint/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('枢纽工程-注记') &&
            map.addLayer({
                id: '枢纽工程-注记',
                type: 'symbol',
                source: 'combineProjectPoint',
                minzoom: 12,
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, -1.0],
                    'text-anchor': 'bottom',
                    'text-allow-overlap': false,
                    'text-size': 12,
                },
                paint: {
                    'text-color': 'rgb(26, 50, 71)',
                    'text-opacity': [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                        1.0,                    // 则文本颜色为rgb(86, 39, 242)
                        0.7                      // 否则文本颜色为rgb(26, 11, 74)
                    ]
                },
            })
    },
    // 长江干堤
    长江干堤: async (map) => {
        map.addSource('riverBankLine', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/riverBankLine/{x}/{y}/{z}'],
        })
        await loadImage(map, '/legend/difang.png', '堤防')
        map.addLayer({
            id: '长江干堤',
            type: 'line',
            source: 'riverBankLine',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-pattern': '堤防',
                'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    ['literal', 1.0],
                    10,
                    ['literal', 3.0],
                    13,
                    ['literal', 6.0],
                ],
                'line-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    ['literal', 0.5],
                    10,
                    ['literal', 0.7],
                    13,
                    ['literal', 1.0],
                ],
            },
        })

    },
    '长江干堤-影像': async (map) => {
        !map.getSource('riverBankLine') &&
            map.addSource('riverBankLine', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverBankLine/{x}/{y}/{z}'],
            })
        await loadImage(map, '/legend/difang-yingxiang.png', '堤防2')
        !map.getLayer('长江干堤-影像') &&
            map.addLayer({
                id: '长江干堤-影像',
                type: 'line',
                source: 'riverBankLine',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-pattern': '堤防2',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 1.0],
                        10,
                        ['literal', 3.0],
                        13,
                        ['literal', 6.0],
                    ],
                    'line-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 0.5],
                        10,
                        ['literal', 0.7],
                        13,
                        ['literal', 1.0],
                    ],
                },
            })

    },
    重点行政区边界: async (map) => {
        !map.getSource('igov-bound') &&
            map.addSource('igov-bound', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverCityBoundary/{x}/{y}/{z}'],
            })
        await loadImage(map, '/legend/shijie.png', '市界')
        await loadImage(map, '/legend/shengjie.png', '省界')
        await loadImage(map, '/legend/haianxian.png', '海岸线')
        !map.getLayer('重点行政区边界') &&
            map.addLayer({
                id: '重点行政区边界',
                type: 'line',
                source: 'igov-bound',
                'source-layer': 'default',
                layout: {
                    'line-join': 'round',
                },
                paint: {
                    // 'line-color': 'rgb(159, 139, 163)',
                    'line-pattern': [
                        'match',
                        ['get', 'type'],
                        '省界',
                        '省界',
                        '市界',
                        '市界',
                        '海岸',
                        '海岸线',
                        '省界', // 默认颜色为黑色
                    ],
                    'line-width': 2.0,
                    'line-opacity': 0.8
                }
                // paint: {
                //     'line-color': 'rgb(255,0,0)',
                //     'line-width': 5.0,
                // }
            })




    },

    里程桩: async (map) => {

        !map.getSource('portEmbankmentPoint') &&
            map.addSource('portEmbankmentPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/portEmbankmentPoint/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('里程桩') &&
            map.addLayer({
                id: '里程桩',
                type: 'circle',
                source: 'portEmbankmentPoint',
                'source-layer': 'default',
                layout: {},
                paint: {
                    'circle-color': 'rgb(34,38,42)',
                    'circle-blur': 0.5,
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 1],
                        10,
                        ['literal', 3],
                        12,
                        ['literal', 5],
                    ],
                    'circle-opacity': 0.5
                },
            })
    },
    '里程桩-注记': async (map) => {
        !map.getSource('portEmbankmentPoint') &&
            map.addSource('portEmbankmentPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/portEmbankmentPoint/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('里程桩-注记') &&
            map.addLayer({
                id: '里程桩-注记',
                type: 'symbol',
                source: 'portEmbankmentPoint',
                'source-layer': 'default',
                minzoom: 12,
                filter: ['==', 'if_important', 1],
                layout: {
                    'text-field': ['get', 'name2'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["left", "right", "top", "bottom", "center"],
                    'text-allow-overlap': false,
                    'text-size': 15,
                    'text-offset': [0.3, 0]
                },
                paint: {
                    'text-color': 'rgb(88,88,88)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 0.5,
                },
            })
    },
    '里程桩-影像-注记': async (map) => {
        !map.getSource('portEmbankmentPoint') &&
            map.addSource('portEmbankmentPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/portEmbankmentPoint/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('里程桩-影像-注记') &&
            map.addLayer({
                id: '里程桩-影像-注记',
                type: 'symbol',
                source: 'portEmbankmentPoint',
                'source-layer': 'default',
                minzoom: 12,
                filter: ['==', 'if_important', 1],
                layout: {
                    'text-field': ['get', 'name2'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["left", "right", "top", "bottom", "center"],
                    'text-allow-overlap': false,
                    'text-size': 15,
                    'text-offset': [0.3, 0]
                },
                paint: {
                    'text-color': 'rgb(58,58,58)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 1,
                },
            })
    },


    ///////////// 重点岸段
    /// 岸段名录
    '岸段-注记': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('岸段-注记') &&
            map.addLayer({
                id: '岸段-注记',
                type: 'symbol',
                source: 'importantBank',
                minzoom: 12,
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'bank_name'],
                    'symbol-placement': 'line',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 0],
                    'text-anchor': 'bottom',
                    'text-size': 13,
                    'text-allow-overlap': false,

                },
                paint: {
                    'text-color': '#2e0201',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                },
            })

    },
    '一级岸段-注记': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('一级岸段-注记') &&
            map.addLayer({
                id: '一级岸段-注记',
                type: 'symbol',
                source: 'importantBank',
                minzoom: 13,
                'source-layer': 'default',
                filter: ['==', 'warning_level', 1],
                layout: {
                    'text-field': ['get', 'bank_name'],
                    'symbol-placement': 'line',
                    // 'symbol-placement': 'line-center',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 0],
                    'text-size': 23,

                    // 'text-size': 16,

                    'text-allow-overlap': true,
                    'text-ignore-placement': true,

                },
                paint: {
                    'text-color': '#2e0201',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                },
            })
    },
    '二级岸段-注记': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('二级岸段-注记') &&
            map.addLayer({
                id: '二级岸段-注记',
                type: 'symbol',
                source: 'importantBank',
                minzoom: 13,
                'source-layer': 'default',
                filter: ['==', 'warning_level', 2],
                layout: {
                    'text-field': ['get', 'bank_name'],
                    'symbol-placement': 'line',
                    // 'symbol-placement': 'line-center',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 0],
                    // 'text-size': [
                    //     'interpolate',
                    //     ['linear'],
                    //     ['zoom'],
                    //     11,
                    //     ['literal', 18],
                    //     13,
                    //     ['literal', 24],
                    // ],
                    // 'symbol-spacing': 100,
                    // 'text-max-angle': 90,
                    'text-size': 22,



                    'text-allow-overlap': true,
                    'text-ignore-placement': true,

                },
                paint: {
                    'text-color': '#2e0201',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                },
            })
    },
    '三级岸段-注记': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('三级岸段-注记') &&
            map.addLayer({
                id: '三级岸段-注记',
                type: 'symbol',
                source: 'importantBank',
                minzoom: 13,

                'source-layer': 'default',
                filter: ['==', 'warning_level', 3],
                layout: {
                    'text-field': ['get', 'bank_name'],
                    'symbol-placement': 'line',
                    // 'symbol-placement': 'line-center',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 0],
                    'text-size': 21,


                    'text-allow-overlap': true,
                    'text-ignore-placement': true,

                },
                paint: {
                    'text-color': '#2e0201',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                },
            })
    },
    '一级预警岸段-注记': async (map) => {
        // !map.getSource('importantBank') &&
        //     map.addSource('importantBank', {
        //         type: 'vector',
        //         tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
        //     })
        // !map.getSource('importantBankCenter') &&
        //     map.addSource('importantBankCenter', {
        //         type: 'vector',
        //         tiles: [tileServer + '/tile/vector/center/importantBank/{x}/{y}/{z}'],
        //     })
        !map.getSource('warn1text') &&
            map.addSource('warn1text', {
                type: 'geojson',
                data: warnText
            })
        !map.getLayer('一级预警岸段-注记') &&
            map.addLayer({
                id: '一级预警岸段-注记',
                type: 'symbol',
                // source: 'importantBank',
                // source: 'importantBankCenter',
                source: 'warn1text',
                minzoom: 8,
                maxzoom: 11,
                // 'source-layer': 'default',
                // filter: ['==', 'warning_level', 1],
                layout: {
                    'text-field': ['get', 'bank_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'symbol-placement': 'point',
                    // 'symbol-placement': 'line-center',
                    'text-offset': [0.0, 0.0],
                    // 'text-offset': [
                    //     'match',
                    //     ['get', 'id'],
                    //     '22',
                    //     [0.0, 10.0],
                    //     [0.0, 0.0]
                    // ],
                    // 'text-variable-anchor': ["left", "top-left", "top", "top-right", "right", "center", "bottom-left", "bottom-right", "bottom",],
                    'text-anchor': 'center',
                    'text-size': 18,
                    // 'text-padding': 0.0,
                    // 'text-writing-mode': ['vertical', 'horizontal'],
                    "text-allow-overlap": true,
                    'text-ignore-placement': false
                },
                paint: {
                    'text-color': '#333',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                },
            })
    },

    '一级岸段-点注记': async (map) => {
        !map.getSource('importantBankCenter') &&
            map.addSource('importantBankCenter', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/center/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('一级岸段-点注记') &&
            map.addLayer({
                id: '一级岸段-点注记',
                type: 'symbol',
                source: 'importantBankCenter',
                minzoom: 11,
                maxzoom: 13,
                'source-layer': 'default',
                filter: ['==', 'warning_level', 1],
                layout: {
                    'text-field': ['get', 'bank_name'],
                    'symbol-placement': 'point',
                    // 'symbol-placement': 'line-center',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 0],
                    'text-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        11,
                        ['literal', 18],
                        13,
                        ['literal', 24],
                    ],
                    // 'text-size': 16,

                    'text-allow-overlap': true,
                    'text-ignore-placement': true,

                },
                paint: {
                    'text-color': '#2e0201',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                },
            })
    },
    '二级岸段-点注记': async (map) => {
        !map.getSource('importantBankCenter') &&
            map.addSource('importantBankCenter', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/center/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('二级岸段-点注记') &&
            map.addLayer({
                id: '二级岸段-点注记',
                type: 'symbol',
                source: 'importantBankCenter',
                minzoom: 11,
                maxzoom: 13,
                'source-layer': 'default',
                filter: ['==', 'warning_level', 2],
                layout: {
                    'text-field': ['get', 'bank_name'],
                    // 'symbol-placement': 'line',
                    'symbol-placement': 'point',
                    // 'symbol-placement': 'line-center',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 0],
                    'text-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        11,
                        ['literal', 18],
                        13,
                        ['literal', 24],
                    ],



                    'text-allow-overlap': true,
                    'text-ignore-placement': true,

                },
                paint: {
                    'text-color': '#2e0201',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                },
            })
    },
    '三级岸段-点注记': async (map) => {
        !map.getSource('importantBankCenter') &&
            map.addSource('importantBankCenter', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/center/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('三级岸段-点注记') &&
            map.addLayer({
                id: '三级岸段-点注记',
                type: 'symbol',
                source: 'importantBankCenter',
                minzoom: 11,
                maxzoom: 13,
                'source-layer': 'default',
                filter: ['==', 'warning_level', 3],
                layout: {
                    'text-field': ['get', 'bank_name'],
                    // 'symbol-placement': 'line',
                    'symbol-placement': 'point',
                    // 'symbol-placement': 'line-center',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 0],
                    'text-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        11,
                        ['literal', 18],
                        13,
                        ['literal', 24],
                    ],

                    'text-allow-overlap': true,
                    'text-ignore-placement': true,

                },
                paint: {
                    'text-color': '#2e0201',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                },
            })
    },

    '预警岸段': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('预警岸段') &&
            map.addLayer({
                id: '预警岸段',
                type: 'line',
                source: 'importantBank',
                'source-layer': 'default',
                layout: {
                    'line-join': 'round',
                },
                paint: {
                    'line-color': [
                        'match',
                        ['get', 'warning_level'],
                        1,
                        '#ff3d2b',
                        2,
                        'rgb(27, 74, 245)',
                        3,
                        'rgb(127, 113, 143)',
                        'rgb(255, 0, 0)',
                    ],
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 2],
                        10,
                        ['literal', 5],
                        13,
                        ['literal', 7],
                    ],
                },
            })
    },

    一级预警岸段: async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('一级预警岸段') &&
            map.addLayer({
                id: '一级预警岸段',
                type: 'line',
                source: 'importantBank',
                'source-layer': 'default',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                filter: ['==', 'warning_level', 1],
                paint: {
                    'line-color': '#ff0303',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 2],
                        10,
                        ['literal', 5],
                        13,
                        ['literal', 7],
                    ],
                },
            })
    },
    二级预警岸段: async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('二级预警岸段') &&
            map.addLayer({
                id: '二级预警岸段',
                type: 'line',
                source: 'importantBank',
                'source-layer': 'default',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                filter: ['==', 'warning_level', 2],
                paint: {
                    // 'line-opacity': 1,
                    'line-color': 'rgb(255, 120, 3)',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 2],
                        10,
                        ['literal', 5],
                        13,
                        ['literal', 7],
                    ],
                },
            })
    },
    三级预警岸段: async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
            })
        !map.getLayer('三级预警岸段') &&
            map.addLayer({
                id: '三级预警岸段',
                type: 'line',
                source: 'importantBank',
                'source-layer': 'default',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                filter: ['==', 'warning_level', 3],
                paint: {
                    'line-color': 'rgb(245, 231, 32)',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 2],
                        10,
                        ['literal', 5],
                        13,
                        ['literal', 7],
                    ],
                },
            })
    },

    /// 历史崩岸
    历史崩岸: async (map) => { },
    /// 近岸地形
    近岸地形: async (map) => {
        !map.getSource('riverBg') &&
            map.addSource('riverBg', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverBg/{x}/{y}/{z}'],
            })
        !map.getLayer('近岸地形') &&
            map.addLayer({
                id: '近岸地形',
                type: 'fill',
                source: 'riverBg',
                'source-layer': 'default',
                paint: {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'height'],
                        0,
                        'rgb(0,153,51)', // 草绿色
                        2,
                        '#78B766', // R120 G183 B102
                        5,
                        '#27C731', // 春绿色
                        8,
                        '#99CC33', // 火星绿
                        10,
                        '#CCCC33', // 香蕉黄
                        11,
                        '#D9D97A', // R230 G230 B128
                        13,
                        '#FFFF99', // 粉笔色
                        13.5,
                        '#FFFFFF',
                        15,
                        '#99FFFF', // 冰蓝色
                        16,
                        '#0000FF', // 天蓝色
                        20,
                        '#6699FF', // 淡蓝色
                        30,
                        '#0096FF',
                        60,
                        '#0057DF',
                        Infinity,
                        '#000000',
                    ],
                },
            })
    },
    /// 近年冲淤
    近年冲淤: async (map) => { },

    洲滩: async (map) => {
        !map.getSource('riverBeach') &&
            map.addSource('riverBeach', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverBeach/{x}/{y}/{z}'],
            })
        !map.getLayer('洲滩') &&
            map.addLayer({
                id: '洲滩',
                type: 'fill',
                source: 'riverBeach',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-color': 'rgb(240, 239, 209)',
                },
            })
    },
    '洲滩-注记': async (map) => {
        !map.getSource('riverBeachCenter') &&
            map.addSource('riverBeachCenter', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/center/riverBeach/{x}/{y}/{z}'],
            })
        !map.getLayer('洲滩-注记') &&
            map.addLayer({
                id: '洲滩-注记',
                type: 'symbol',
                source: 'riverBeachCenter',
                'source-layer': 'default',
                minzoom: 10,
                layout: {
                    'text-field': [
                        "format",
                        ["get", "name"], { 'font-scale': 1.6, 'text-color': 'rgb(71, 71, 71)' },
                        ["case",
                            ["!=", ["get", "洲滩信息_人口"], `N/A`],
                            ["concat", "\n人口:", ["get", "洲滩信息_人口"]],
                            ""
                        ], {},
                        ["case",
                            ["!=", ["get", "洲滩信息_面积"], `N/A`],
                            ["concat", "\n面积:", ["get", "洲滩信息_面积"], 'km²'],
                            ""
                        ],
                        ["case",
                            ["!=", ["get", "river"], `N/A`],
                            ["concat", "\n【", ["get", "river"], '】'],
                            ""
                        ],
                        {},
                    ],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["center", "bottom", "top", "left", "right",],
                    'symbol-placement': "point",
                    // 'text-anchor': 'center',
                    'text-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10,
                        ['literal', 8],
                        13,
                        ['literal', 18],
                    ],

                    'text-padding': 0,
                    // 'text-offset': [
                    //     'match',
                    //     ["get", "id"],
                    //     '30',
                    //     [0.0, 20.0],
                    //     [0, 0.0],
                    // ],
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': 'rgb(111, 111, 111)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 1.0,
                },
            })
    },
    '洲滩-边界': async (map) => {
        !map.getSource('riverBeachLine') &&
            map.addSource('riverBeachLine', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverBeachLine/{x}/{y}/{z}'],
            })
        !map.getLayer('洲滩边界') &&
            map.addLayer({
                id: '洲滩边界',
                type: 'line',
                source: 'riverBeachLine',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'line-color': 'rgb(240, 0, 0)',
                    'line-width': 3.0,
                    'line-dasharray': [5, 3],
                },
            })
    },

    行政点: async (map) => {
        !map.getSource('DistrictPoint') &&
            map.addSource('DistrictPoint', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverCityPoint/{x}/{y}/{z}'],
            })
        !map.getLayer('行政点') &&
            map.addLayer({
                id: '行政点',
                type: 'circle',
                source: 'DistrictPoint',
                minzoom: 7,
                maxzoom: 14,
                'source-layer': 'default',
                layout: {},
                paint: {
                    'circle-color': 'rgb(222,34,1)',
                    // 'circle-blur': 0.5,
                    'circle-radius': [
                        "case",
                        ["==", ["get", "level"], 1],
                        7,
                        5,
                    ],
                    'circle-opacity': 0.8
                },
            })
    },
    '行政点-注记': async (map) => {
        !map.getSource('DistrictPoint') &&
            map.addSource('DistrictPoint', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverCityPoint/{x}/{y}/{z}'],
            })
        !map.getLayer('行政点-注记') &&
            map.addLayer({
                id: '行政点-注记',
                type: 'symbol',
                source: 'DistrictPoint',
                'source-layer': 'default',
                // minzoom: 10,
                layout: {
                    'text-field': ['get', 'city'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 1.0],
                    // 'text-variable-anchor': ["center", "bottom", "top", "left", "right",],
                    'text-size': [
                        "case",
                        ["==", ["get", "level"], 1],
                        24,
                        20
                    ],
                    'text-padding': 0,
                    'text-ignore-placement': true,
                    'text-allow-overlap': true,
                },
                paint: {
                    'text-color': 'rgb(110, 110, 110)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },
    '汊道': async (map) => {
        !map.getSource('riverSmallSection') &&
            map.addSource('riverSmallSection', {
                type: 'geojson',
                data: smallRiverTest
            })
        !map.getLayer('汊道') &&
            map.addLayer({
                id: '汊道',
                type: 'symbol',
                source: 'riverSmallSection',
                minzoom: 11.5,
                layout: {
                    'text-field': ['get', 'label'],
                    'text-rotate': ['get', 'rotateAngle'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-size': 20,
                },
                paint: {
                    'text-color': 'rgb(86,126,216)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
                }

            })
    },
}

const layerAddFunction = async (map, layerID) => {
    await layerAddFunctionMap[layerID](map)
}

const layerInitFunction = async (map, layerID) => {
    await layerAddFunctionMap[layerID](map)
    map.setLayoutProperty(layerID, 'visibility', 'none')
}

const layerShowFunction = async (map, layerID) => {
    if (map.getLayer(layerID)) {
        map.setLayoutProperty(layerID, 'visibility', 'visible')
    } else {
        await layerAddFunctionMap[layerID](map)
    }
}
const layerHideFunction = (map, layerID) => {
    if (map.getLayer(layerID)) {
        // if (layerID === '近岸流场') {
        //     useLayerStore().flowLayer.hide()
        // } else if (layerID === '三维地形') {
        //     useLayerStore().terrainLayer.hide()
        // } else {
        // 隐藏
        map.setLayoutProperty(layerID, 'visibility', 'none')
    }
}


const layerRemoveFunction = (map, layerID) => {
    if (map.getLayer(layerID)) {
        if (layerID === '近岸流场') {
            useLayerStore().flowLayer.hide()
        } else if (layerID === '三维地形') {
            useLayerStore().terrainLayer.hide()
        } else {
            // 隐藏
            map.setLayoutProperty(layerID, 'visibility', 'none')
            // 删除
            let layer = map.getLayer(layerID)
            // let sourceId = layer.source
            map.removeLayer(layerID)
            // map.removeSource(sourceId)
        }
    }
}

const initSortedLayer = async (map) => {
    await layerAddFunction(map, '大型湖泊')// 全程展示
    await layerAddFunction(map, '区域性骨干河道')// 全程展示
    await layerAddFunction(map, '流域性河道')// 全程展
    await layerAddFunction(map, '洲滩')// 全程展示
    await layerAddFunction(map, '其他河道')// 缩放展示  level2 
    await layerAddFunction(map, '市级行政区')// 全程展示
    await layerAddFunction(map, '沿江码头')// 全程展示
    await layerAddFunction(map, '水库大坝')// 全程展示
    await layerInitFunction(map, '大中型水闸-面')
    await layerInitFunction(map, '其他水闸-面')

    // 线
    await layerAddFunction(map, '长江干堤')// 全程
    await layerAddFunction(map, '河道分段')// max
    await layerAddFunction(map, '一级预警岸段')// 缩放
    await layerAddFunction(map, '二级预警岸段')// 缩放
    await layerAddFunction(map, '三级预警岸段')// 缩放

    await layerInitFunction(map, '已建通道')// 缩放
    await layerInitFunction(map, '在建通道')// 缩放
    await layerInitFunction(map, '过江通道辅助线')// 缩放
    await layerInitFunction(map, '规划通道')// 缩放
    await layerAddFunction(map, '重点行政区边界')// 全程

    // 点
    await layerAddFunction(map, '里程桩')
    await layerInitFunction(map, '水文站点')// 分类
    await layerInitFunction(map, '大中型水闸')// 全程展示
    await layerInitFunction(map, '其他水闸')// 缩放展示  level2 
    await layerInitFunction(map, '大中型泵站')
    await layerInitFunction(map, '其他泵站')
    await layerAddFunction(map, '河道分段点')
    await layerAddFunction(map, '行政点')

    // 注记
    await layerAddFunction(map, '里程桩-注记')
    await layerAddFunction(map, '大型湖泊-注记')
    await layerAddFunction(map, '区域性骨干河道-注记')
    await layerAddFunction(map, '流域性河道-注记')
    await layerAddFunction(map, '其他河道-注记')
    await layerInitFunction(map, '沿江码头-注记')
    await layerAddFunction(map, '水库大坝-注记')
    await layerAddFunction(map, '洲滩-注记')
    await layerAddFunction(map, '行政点-注记')


    await layerAddFunction(map, '汊道')
    await layerAddFunction(map, '一级岸段-注记')
    await layerAddFunction(map, '二级岸段-注记')
    await layerAddFunction(map, '三级岸段-注记')
    await layerAddFunction(map, '一级岸段-点注记')
    await layerAddFunction(map, '二级岸段-点注记')
    await layerAddFunction(map, '三级岸段-点注记')
    await layerInitFunction(map, '已建通道-注记')
    await layerInitFunction(map, '在建通道-注记')
    await layerInitFunction(map, '规划通道-注记')
    await layerInitFunction(map, '水文站点-注记')
    await layerInitFunction(map, '大中型水闸-注记')
    await layerInitFunction(map, '其他水闸-注记')
    await layerInitFunction(map, '大中型泵站-注记')
    await layerInitFunction(map, '其他泵站-注记')

    await layerAddFunction(map, '河道分段-注记')
    await layerAddFunction(map, '河道分段点-注记')

    await layerAddFunction(map, '一级预警岸段-注记')
}

const temp = async (map) => {

    await layerAddFunction(map, '流域性河道')// 全程展
    await layerAddFunction(map, '区域性骨干河道')// 全程展示



    await layerAddFunction(map, '水文站点')// 分类

    // 注记
    await layerAddFunction(map, '水文站点-注记')

}

const initTextLayer = async (map) => {

    // // 线
    // await layerAddFunction(map, '长江干堤')// 全程
    // await layerAddFunction(map, '河道分段')// max
    // await layerAddFunction(map, '一级预警岸段')// 缩放
    // await layerAddFunction(map, '二级预警岸段')// 缩放
    // await layerAddFunction(map, '三级预警岸段')// 缩放

    // await layerInitFunction(map, '已建通道')// 缩放
    // await layerInitFunction(map, '在建通道')// 缩放
    // await layerInitFunction(map, '规划通道')// 缩放
    // await layerAddFunction(map, '重点行政区边界')// 全程

    // // 点 
    // // await layerAddFunction(map, '里程桩')
    // await layerInitFunction(map, '水文站点')// 分类
    // await layerInitFunction(map, '大中型水闸')// 全程展示
    // await layerInitFunction(map, '其他水闸')// 缩放展示  level2 
    // await layerInitFunction(map, '大中型泵站')
    // await layerInitFunction(map, '其他泵站')
    // await layerAddFunction(map, '河道分段点')
    // await layerAddFunction(map, '行政点')

    // // 注记
    // // await layerAddFunction(map, '里程桩-注记')
    // await layerAddFunction(map, '大型湖泊-注记')
    // await layerAddFunction(map, '区域性骨干河道-注记')
    // await layerAddFunction(map, '流域性河道-注记')
    // await layerAddFunction(map, '其他河道-注记')
    // await layerAddFunction(map, '沿江码头-注记')
    // await layerAddFunction(map, '水库大坝-注记')
    // await layerAddFunction(map, '洲滩-注记')
    // await layerAddFunction(map, '行政点-注记')


    // await layerAddFunction(map, '一级岸段-注记')
    // await layerAddFunction(map, '二级岸段-注记')
    // await layerAddFunction(map, '三级岸段-注记')
    // await layerInitFunction(map, '已建通道-注记')
    // await layerInitFunction(map, '在建通道-注记')
    // await layerInitFunction(map, '规划通道-注记')
    // await layerInitFunction(map, '水文站点-注记')
    // await layerInitFunction(map, '大中型水闸-注记')
    // await layerInitFunction(map, '其他水闸-注记')
    // await layerInitFunction(map, '大中型泵站-注记')
    // await layerInitFunction(map, '其他泵站-注记')

    // await layerAddFunction(map, '河道分段-注记')
    // await layerAddFunction(map, '河道分段点-注记')

    // await layerInitFunction(map, '一级预警岸段-注记')

    // 面
    await layerAddFunction(map, '大中型水闸-面')

    // 线
    await layerAddFunction(map, '长江干堤-影像')// 全程
    await layerAddFunction(map, '河道分段-影像')// max
    await layerAddFunction(map, '一级预警岸段')// 缩放
    await layerAddFunction(map, '二级预警岸段')// 缩放
    await layerAddFunction(map, '三级预警岸段')// 缩放

    await layerInitFunction(map, '已建通道')// 缩放
    await layerInitFunction(map, '在建通道')// 缩放
    await layerInitFunction(map, '过江通道辅助线')// 缩放
    await layerInitFunction(map, '规划通道')// 缩放
    await layerAddFunction(map, '重点行政区边界')// 全程

    // // 点 
    await layerAddFunction(map, '里程桩')
    await layerInitFunction(map, '水文站点')// 分类
    await layerInitFunction(map, '大中型水闸')// 全程展示
    await layerInitFunction(map, '其他水闸')// 缩放展示  level2 
    await layerInitFunction(map, '大中型泵站')
    await layerInitFunction(map, '其他泵站')
    await layerAddFunction(map, '河道分段点-影像')
    await layerAddFunction(map, '行政点')

    // // 注记
    await layerAddFunction(map, '里程桩-影像-注记')
    await layerAddFunction(map, '大型湖泊-注记')
    await layerAddFunction(map, '区域性骨干河道-注记')
    await layerAddFunction(map, '流域性河道-注记')
    await layerAddFunction(map, '其他河道-注记')
    await layerAddFunction(map, '沿江码头-注记')
    await layerAddFunction(map, '水库大坝-注记')
    await layerAddFunction(map, '洲滩-注记')
    await layerAddFunction(map, '行政点-注记')


    await layerAddFunction(map, '汊道')
    await layerAddFunction(map, '一级岸段-注记')
    await layerAddFunction(map, '二级岸段-注记')
    await layerAddFunction(map, '三级岸段-注记')
    await layerAddFunction(map, '一级岸段-点注记')
    await layerAddFunction(map, '二级岸段-点注记')
    await layerAddFunction(map, '三级岸段-点注记')
    await layerInitFunction(map, '已建通道-注记')
    await layerInitFunction(map, '在建通道-注记')
    await layerInitFunction(map, '规划通道-注记')
    await layerInitFunction(map, '水文站点-注记')
    await layerInitFunction(map, '大中型水闸-注记')
    await layerInitFunction(map, '其他水闸-注记')
    await layerInitFunction(map, '大中型泵站-注记')
    await layerInitFunction(map, '其他泵站-注记')

    await layerAddFunction(map, '河道分段-注记')
    await layerAddFunction(map, '河道分段点-注记')

    await layerAddFunction(map, '一级预警岸段-注记')

}

const smallRiverTest = {
    "type": "FeatureCollection",
    "name": "汊道",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "label": "扬中河段", "rotateAngle": 10.0 }, "geometry": { "type": "Point", "coordinates": [120.062481080071635, 31.956970753818254] } },
        { "type": "Feature", "properties": { "label": "福姜沙河段", "rotateAngle": -24.0 }, "geometry": { "type": "Point", "coordinates": [120.330740341349212, 31.978740247639973] } },
        { "type": "Feature", "properties": { "label": "世业洲汊道段", "rotateAngle": 30.0 }, "geometry": { "type": "Point", "coordinates": [119.265741129459101, 32.202441586550535] } },
        { "type": "Feature", "properties": { "label": "白茆沙河段", "rotateAngle": 30.0 }, "geometry": { "type": "Point", "coordinates": [121.126911517266223, 31.74556429930384] } },
        { "type": "Feature", "properties": { "label": "通州沙河段", "rotateAngle": 60.0 }, "geometry": { "type": "Point", "coordinates": [120.830453573931351, 31.931231086376297] } },
        { "type": "Feature", "properties": { "label": "和畅洲汊道段", "rotateAngle": -19.0 }, "geometry": { "type": "Point", "coordinates": [119.639035107054426, 32.197306590178727] } },
        { "type": "Feature", "properties": { "label": "龙潭水道", "rotateAngle": -2.0 }, "geometry": { "type": "Point", "coordinates": [118.97086139111093, 32.180048919121447] } },
        { "type": "Feature", "properties": { "label": "八卦洲汊道段", "rotateAngle": -25.0 }, "geometry": { "type": "Point", "coordinates": [118.806354318771426, 32.154336578459521] } },
        { "type": "Feature", "properties": { "label": "新济洲汊道段", "rotateAngle": -40.0 }, "geometry": { "type": "Point", "coordinates": [118.603033031801772, 31.93807490118834] } },
        { "type": "Feature", "properties": { "label": "梅子洲汊道段", "rotateAngle": -65.0 }, "geometry": { "type": "Point", "coordinates": [118.68209552034952, 32.044123455644339] } },
        { "type": "Feature", "properties": { "label": "六圩弯道", "rotateAngle": -2.0 }, "geometry": { "type": "Point", "coordinates": [119.436207601399929, 32.263247326420078] } },
        { "type": "Feature", "properties": { "label": "如皋沙群段", "rotateAngle": 12.0 }, "geometry": { "type": "Point", "coordinates": [120.582445321434321, 32.00829051096477] } },
        { "type": "Feature", "properties": { "label": "仪征河段", "rotateAngle": 0.0 }, "geometry": { "type": "Point", "coordinates": [119.123144846834933, 32.247644717205432] } }
    ]
}

const warnText = {
    "type": "FeatureCollection",
    "name": "2",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "id": 4, "bank_name": "七坝", "warning_level": 1, "if_important": 0, "rotate": -20.0 }, "geometry": { "type": "Point", "coordinates": [118.539043007955726, 31.930389078485575] } },
        { "type": "Feature", "properties": { "id": 9, "bank_name": "下关", "warning_level": 1, "if_important": 0, "rotate": -20.0 }, "geometry": { "type": "Point", "coordinates": [118.743098171339227, 32.089774055223202] } },
        { "type": "Feature", "properties": { "id": 21, "bank_name": "和畅洲头及左右缘", "warning_level": 1, "if_important": 0, "rotate": 0.0 }, "geometry": { "type": "Point", "coordinates": [119.560031678826576, 32.21427862447802] } },
        { "type": "Feature", "properties": { "id": 22, "bank_name": "孟家港", "warning_level": 1, "if_important": 0, "rotate": 90.0 }, "geometry": { "type": "Point", "coordinates": [119.620459761959992, 32.241961034537233] } },
        { "type": "Feature", "properties": { "id": 24, "bank_name": "太平洲左缘（二墩港至胜利河）", "warning_level": 1, "if_important": 0, "rotate": 90.0 }, "geometry": { "type": "Point", "coordinates": [119.858238420174885, 32.198468608765843] } },
        { "type": "Feature", "properties": { "id": 34, "bank_name": "六圩弯道", "warning_level": 1, "if_important": 0, "rotate": 0.0 }, "geometry": { "type": "Point", "coordinates": [119.443299043465473, 32.283678662631409] } },
        { "type": "Feature", "properties": { "id": 36, "bank_name": "嘶马弯道", "warning_level": 1, "if_important": 0, "rotate": 0.0 }, "geometry": { "type": "Point", "coordinates": [119.759722975119772, 32.338082888072989] } },
        { "type": "Feature", "properties": { "id": 37, "bank_name": "杨湾至高港闸", "warning_level": 1, "if_important": 0, "rotate": 0.0 }, "geometry": { "type": "Point", "coordinates": [119.857165977942927, 32.301018139269736] } },
        { "type": "Feature", "properties": { "id": 42, "bank_name": "民主沙", "warning_level": 1, "if_important": 0, "rotate": 0.0 }, "geometry": { "type": "Point", "coordinates": [120.53109004069502, 32.04344092161385] } },
        { "type": "Feature", "properties": { "id": 48, "bank_name": "段山港至越洋码头", "warning_level": 1, "if_important": 0, "rotate": 0.0 }, "geometry": { "type": "Point", "coordinates": [120.585893278634913, 31.980141845084106] } },
        { "type": "Feature", "properties": { "id": 51, "bank_name": "新太海汽渡～七丫口", "warning_level": 1, "if_important": 0, "rotate": 45.0 }, "geometry": { "type": "Point", "coordinates": [121.128476871991722, 31.659050949236342] } }
    ]
}





export {
    layers,
    layerAddFunctionMap,
    layerShowFunction,
    layerHideFunction,
    layerInitFunction,
    layerRemoveFunction, // hide and remove
    layerAddFunction, // add and show
    initSortedLayer,
    initTextLayer,
    temp
}
