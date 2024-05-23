import SteadyFlowLayer from '../../utils/m_demLayer/newFlow_mask'
import TerrainLayer from '../../utils/m_demLayer/terrainLayer'
import { useLayerStore } from '../../store/mapStore'
import BackEndRequest from '../../api/backend'
import { DataPioneer } from './Scene'
import axios from 'axios'
import { loadImage } from '../../utils/mapUtils'
import {
    i_gov_bounds, river_division_point, river_division_line,
    district_point, sandbar
} from './js/tempData.js'


const layers = [
    '地形瓦片',
    '河段划分',
    '河段注记',
    '沙洲',
    '全江注记',
    '深泓线',
    '已建通道',
    '在建通道',
    '规划通道',
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
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER

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
    沙洲: async (map) => {
        console.log('add shazhou');
        !map.getSource('riverLand') &&
            map.addSource('riverLand', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverLand/{x}/{y}/{z}'],
            })
        !map.getLayer('沙洲') &&
            map.addLayer({
                id: '沙洲',
                type: 'fill',
                source: 'riverLand',
                'source-layer': 'default',
                paint: {
                    'fill-color': 'rgba(255, 122, 120,0.7)',
                },
            })
    },
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
    近岸流场: async (map) => {
        if (map.getLayer('近岸流场')) {
            useLayerStore().flowLayer.show()
            let center = map.getCenter()
            map.flyTo({
                center: center,
            })
        } else {
            let flowSrc = []
            for (let i = 0; i < 26; i++) {
                flowSrc.push(`/scratchSomething/terrain_flow/json/uv_${i}.bin`)
            }

            let flow = new SteadyFlowLayer(
                '近岸流场',
                '/scratchSomething/terrain_flow/json/station.bin',
                flowSrc,
                (url) => url.match(/uv_(\d+)\.bin/)[1],
                '/scratchSomething/terrain_flow/json/ChangJiang.geojson',
            )
            flow.particleNum.n = 2800
            flow.speedFactor.n = 1.8

            map.addLayer(flow)
            useLayerStore().setFlowLayer(flow)
        }
    },
    三维地形: async (map) => {
        if (map.getLayer('三维地形')) useLayerStore().terrainLayer.show()
        else {
            let terrainLayer = new TerrainLayer(14)
            map.addLayer(terrainLayer)
            useLayerStore().setTerrainLayer(terrainLayer)
        }
    },

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
        await loadImage(map, '/icons/市界.png', '市界')
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
                },
            })
    },
    /////// 河道分段
    河道分段: async (map) => {
        let nameLists = ['南京河段', '镇扬河段', '澄通河段', '扬中河段', '河口段',]
        !map.getSource('river_division_line') &&
            map.addSource('river_division_line', {
                type: 'geojson',
                data: river_division_line
            })
        !map.getLayer('river_division_line') &&
            map.addLayer({
                id: 'river_division_line',
                type: 'line',
                source: 'river_division_line',
                paint: {
                    'line-color': 'rgb(110, 107, 106)',
                    'line-width': 2.0,
                    'line-blur': [
                        'case',
                        ["in", ["get", "name"], ["literal", nameLists]],
                        0.0,
                        1.0
                    ],
                    'line-opacity': [
                        // 'case',
                        // ["==", ["get", "name"], ["literal", 'assist']],
                        // 0.8,
                        // 1.0
                        "step",
                        ["zoom"],
                        1,// zoom 0-9 value 1
                        9,
                        0,// zoom 9-13 value 0
                        13,
                        0,// zoom >13 value 1
                    ],

                    "line-dasharray": [
                        'match',
                        ["get", "name"],
                        'assist',
                        [2, 4],
                        [1, 0],
                    ]
                }
            })
    },
    '河道分段-注记': async (map) => {
        !map.getSource('river_division_line') &&
            map.addSource('river_division_line', {
                type: 'geojson',
                data: river_division_line
            })
        !map.getLayer('河道分段-注记') &&
            map.addLayer({
                id: '河道分段-注记',
                type: 'symbol',
                source: 'river_division_line',
                maxzoom: 9,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'symbol-placement': "line-center",
                    'text-size': 15,
                    'text-offset': [0, 1.0],
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

    河道分段点: async (map) => {
        !map.getSource('river_division_point') &&
            map.addSource('river_division_point', {
                type: 'geojson',
                data: river_division_point
            })
        !map.getLayer('河道分段点') &&
            map.addLayer({
                id: '河道分段点',
                type: 'circle',
                source: 'river_division_point',
                minzoom: 7,
                maxzoom: 14,
                paint: {
                    'circle-color': 'rgb(35,46,71)',
                    'circle-radius': 5.0,
                }
            })
    },
    '河道分段点-注记': async (map) => {
        !map.getSource('river_division_point') &&
            map.addSource('river_division_point', {
                type: 'geojson',
                data: river_division_point
            })
        !map.getLayer('河道分段点-注记') &&
            map.addLayer({
                id: '河道分段点-注记',
                type: 'symbol',
                source: 'river_division_point',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'symbol-placement': 'point',
                    'text-size': 13,
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
    ////// 区域水系
    区域水系: async (map) => {
        !map.getSource('riverArea') &&
            map.addSource('riverArea', {
                type: 'vector',
                tiles: [tileServer + '/tile/vector/riverArea/{x}/{y}/{z}'],
            })
        const waterInZoom1 = [1, 2, 3, 4, 5]
        const waterInZoom2 = [1, 2, 3, 4, 5, 6]
        const waterInZoom3 = [1, 2, 3, 4, 5, 6, 7]
        const waterInZoom4 = [1, 2, 3, 4, 5, 6, 7, 8]
        !map.getLayer('区域水系') &&
            map.addLayer({
                id: '区域水系',
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
    '区域水系-注记': async (map) => {
        const waterInZoom1 = [1, 2, 3, 4, 5]
        const waterInZoom2 = [1, 2, 3, 4, 5, 6]
        const waterInZoom3 = [1, 2, 3, 4, 5, 6, 7]
        const waterInZoom4 = [1, 2, 3, 4, 5, 6, 7, 8]
        if (!map.getSource('riverArea-lable')) {
            map.addSource('riverArea-lable', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/riverArea/{x}/{y}/{z}',
                ],
            })
        }
        !map.getLayer('区域水系-注记') &&
            map.addLayer({
                id: '区域水系-注记',
                type: 'symbol',
                source: 'riverArea-lable',
                // source: 'riverArea',
                'source-layer': 'default',
                minzoom: 9,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-variable-anchor': ["center", "top", "bottom", "left", "right"],
                    'text-size': 12,
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
                    'text-size': 14,
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
                    'text-halo-width': 0.5,
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
        await loadImage(map, '/legend/水文站.png', '水文站')
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
                        1.4,                                  // 则图标大小为0.6
                        1.0                                   // 否则图标大小为0.4
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
                        10,
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
                    'text-halo-width': 5.0,
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
                minzoom: 11,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0.4, 0.8],
                    'text-anchor': 'top',
                    'text-variable-anchor': ["top", "bottom", "left", "right"],
                    'text-size': 15,
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
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
                        11,
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
        await loadImage(map, '/legend/堤防.png', '堤防')

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
        await loadImage(map, '/legend/已建通道.png', '已建')
        await loadImage(map, '/legend/在建通道.png', '在建')
        await loadImage(map, '/legend/规划通道.png', '规划')
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
                    'text-size': 12,
                    // 'text-writing-mode': ['vertical', 'horizontal'],
                },
                paint: {
                    'text-color': 'rgb(84, 78, 76)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    },
    // '已建通道': async (map) => {

    // },
    // '在建通道': async (map) => {

    // },
    // '规划通道': async (map) => {

    // },

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
                layout: {
                    'text-field': ['get', 'project_name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-offset': [0, 1.25],
                    'text-variable-anchor': ["bottom", "top", "left", "right"],
                    'text-size': 12,
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
        await loadImage(map, '/legend/水库.png', '水库')
        !map.getLayer('水库大坝') &&
            map.addLayer({
                id: '水库大坝',
                type: 'fill',
                minzoom: 10,
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
                    'text-size': 12,
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
                minzoom: 8,
                layout: {
                },
                paint: {
                    'fill-color': 'rgb(255,0,0)',
                    'fill-opacity': [
                        "step",
                        ["zoom"],
                        ["case", ["==", ["get", "if_important"], 1], 1, 0],
                        10,
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
    '水闸工程-重点': async (map) => {
        !map.getSource('sluiceArea-center') &&
            map.addSource('sluiceArea-center', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
                ],
            })
        loadImage(map, '/legend/水闸.png', '水闸')
        !map.getLayer('水闸工程-重点') &&
            map.addLayer({
                id: '水闸工程-重点',
                type: 'symbol',
                source: 'sluiceArea-center',
                'source-layer': 'default',
                minzoom: 8,
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
                source: 'sluiceArea-center',
                'source-layer': 'default',
                minzoom: 9,
                layout: {
                    'text-field': ['get', 'sp_name'],
                    'text-font': [
                        'Open Sans Semibold',
                    ],
                    // 'text-offset': [0.0, 3,0],
                    'text-anchor': 'top',
                    'text-size': [
                        "case",
                        ["==", ["get", "if_important"], 1], // 如果if_important字段为1
                        13,                    // 则文本颜色为rgb(86, 39, 242)
                        12                       // 否则文本颜色为rgb(26, 11, 74)
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
                        13,
                        1,
                    ],
                    // 'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    // 'text-halo-width': 2.0,
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
        await loadImage(map, '/legend/泵站.png', '泵站')
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
                minzoom: 13,
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
    枢纽工程: async (map) => {
        !map.getSource('combineProjectPoint') &&
            map.addSource('combineProjectPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/combineProjectPoint/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/枢纽.png', '枢纽')
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
        await loadImage(map, '/legend/堤防.png', '堤防')
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
    重点行政区边界: async (map) => {
        console.log('add 重点行政边界');
        !map.getSource('igov-bound') &&
            map.addSource('igov-bound', {
                type: 'geojson',
                data: i_gov_bounds
            })
        await loadImage(map, '/icons/市界.png', '市界')
        await loadImage(map, '/legend/省界.png', '省界')
        await loadImage(map, '/legend/海岸线.png', '海岸线')
        !map.getLayer('重点行政区边界') &&
            map.addLayer({
                id: '重点行政区边界',
                type: 'line',
                source: 'igov-bound',
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
                    // 'line-blur': 2,
                }
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
                    'circle-color': 'rgb(222,222,1)',
                    'circle-blur': 0.5,
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 0.5],
                        10,
                        ['literal', 2],
                        13,
                        ['literal', 3.5],
                    ],
                    'circle-opacity': 0.5
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
                'source-layer': 'default',
                minzoom: 10,
                layout: {
                    'text-field': ['get', 'bank_name'],
                    'symbol-placement': 'point',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-variable-anchor': ["center", "bottom", "top", "left", "right",],
                    'text-size': 20,
                    'text-padding': 0,
                    'text-ignore-placement': true,
                    'text-allow-overlap': true,

                },
                paint: {
                    'text-color': '#2e0201',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 3.0,
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
                },
                filter: ['==', 'warning_level', 1],
                paint: {
                    'line-color': '#ff3d2b',
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
                },
                filter: ['==', 'warning_level', 2],
                paint: {
                    // 'line-opacity': 1,
                    'line-color': 'rgb(27, 74, 245)',
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
                    // 'line-cap': 'round',
                    'line-join': 'round',
                },
                filter: ['==', 'warning_level', 3],
                paint: {
                    // 'line-opacity': 1,=
                    'line-color': 'rgb(127, 113, 143)',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['literal', 4],
                        10,
                        ['literal', 6],
                        13,
                        ['literal', 8],
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
        !map.getSource('sandBar') &&
            map.addSource('sandBar', {
                type: 'geojson',
                data: sandbar
            })
        !map.getLayer('洲滩') &&
            map.addLayer({
                id: '洲滩',
                type: 'fill',
                source: 'sandBar',
                layout: {
                },
                paint: {
                    'fill-color': 'rgb(240, 239, 209)',
                },
            })
    },
    '洲滩-注记': async (map) => {
        !map.getSource('sandBar') &&
            map.addSource('sandBar', {
                type: 'geojson',
                data: sandbar
            })
        !map.getLayer('洲滩-注记') &&
            map.addLayer({
                id: '洲滩-注记',
                type: 'symbol',
                source: 'sandBar',
                // 'source-layer': 'default',
                minzoom: 10,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    // 'text-variable-anchor': ["center", "bottom", "top", "left", "right",],
                    'text-size': 13,
                    'text-padding': 0,
                    'text-ignore-placement': true,
                    'text-allow-overlap': true,
                },
                paint: {
                    'text-color': 'rgb(111, 111, 111)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 1.0,
                },
            })
    },
    行政点: async (map) => {
        !map.getSource('DistrictPoint') &&
            map.addSource('DistrictPoint', {
                type: 'geojson',
                data: district_point
            })
        !map.getLayer('行政点') &&
            map.addLayer({
                id: '行政点',
                type: 'circle',
                source: 'DistrictPoint',
                minzoom: 7,
                maxzoom: 14,
                // 'source-layer': 'default',
                layout: {},
                paint: {
                    'circle-color': 'rgb(222,34,1)',
                    // 'circle-blur': 0.5,
                    'circle-radius': [
                        "case",
                        ["==", ["get", "Level"], 1], // 如果if_important字段为1
                        5.5,                    // 则文本颜色为rgb(86, 39, 242)
                        3.5                      // 否则文本颜色为rgb(26, 11, 74)
                    ],
                    'circle-opacity': 0.8
                },
            })
    },
    '行政点-注记': async (map) => {
        !map.getSource('DistrictPoint') &&
            map.addSource('DistrictPoint', {
                type: 'geojson',
                data: district_point
            })
        !map.getLayer('行政点-注记') &&
            map.addLayer({
                id: '行政点-注记',
                type: 'symbol',
                source: 'DistrictPoint',
                // 'source-layer': 'default',
                // minzoom: 10,
                layout: {
                    'text-field': ['get', 'City'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold',
                    ],
                    'text-offset': [0, 1.0],
                    // 'text-variable-anchor': ["center", "bottom", "top", "left", "right",],
                    'text-size': [
                        "case",
                        ["==", ["get", "Level"], 1],
                        14,
                        11
                    ],
                    'text-padding': 0,
                    'text-ignore-placement': true,
                    'text-allow-overlap': true,
                },
                paint: {
                    'text-color': 'rgb(135, 135, 135)',
                    'text-halo-color': "rgba(255, 255, 255, 1.0)",
                    'text-halo-width': 2.0,
                },
            })
    }
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
    // 面
    await layerAddFunction(map, '大型湖泊')
    await layerAddFunction(map, '区域水系')
    await layerAddFunction(map, '市级行政区')
    await layerAddFunction(map, '沿江码头')
    await layerInitFunction(map, '水闸工程')
    await layerAddFunction(map, '水库大坝')
    await layerAddFunction(map, '洲滩')

    // 线
    await layerAddFunction(map, '长江干堤')
    await layerAddFunction(map, '河道分段')
    await layerAddFunction(map, '一级预警岸段')
    await layerAddFunction(map, '二级预警岸段')
    await layerAddFunction(map, '三级预警岸段')
    await layerInitFunction(map, '过江通道-隧道/通道')
    // await layerInitFunction(map, '过江通道-桥墩')
    await layerInitFunction(map, '过江通道-桥')
    await layerAddFunction(map, '重点行政区边界')

    // 点
    await layerInitFunction(map, '水文站点')
    await layerInitFunction(map, '水闸工程-重点')
    await layerInitFunction(map, '泵站工程')
    await layerInitFunction(map, '枢纽工程')
    await layerAddFunction(map, '河道分段点')
    await layerAddFunction(map, '行政点')

    // 注记
    // await layerAddFunction(map, '市级行政区-注记')
    await layerAddFunction(map, '大型湖泊-注记')
    await layerAddFunction(map, '区域水系-注记')
    // await layerAddFunction(map, '沿江码头-注记')
    await layerAddFunction(map, '水库大坝-注记')
    await layerAddFunction(map, '洲滩-注记')
    await layerAddFunction(map, '行政点-注记')


    await layerAddFunction(map, '岸段-注记')
    await layerInitFunction(map, '过江通道-桥-注记')
    await layerInitFunction(map, '过江通道-隧道/通道-注记')
    await layerInitFunction(map, '水文站点-注记')
    await layerInitFunction(map, '水闸工程-注记')
    await layerInitFunction(map, '泵站工程-注记')
    await layerInitFunction(map, '枢纽工程-注记')

    await layerAddFunction(map, '河道分段-注记')
    await layerAddFunction(map, '河道分段点-注记')
}


export {
    layers,
    layerAddFunctionMap,
    layerShowFunction,
    layerHideFunction,
    layerInitFunction,
    layerRemoveFunction, // hide and remove
    layerAddFunction, // add and show
    initSortedLayer
}
