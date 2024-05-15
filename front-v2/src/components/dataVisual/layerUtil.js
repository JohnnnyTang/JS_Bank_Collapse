
import SteadyFlowLayer from '../../utils/m_demLayer/newFlow_mask'
import TerrainLayer from "../../utils/m_demLayer/terrainLayer"
import { useLayerStore } from "../../store/mapStore"
import BackEndRequest from "../../api/backend"
import { DataPioneer } from "./Scene"
import axios from 'axios'
import { loadImage } from "../../utils/mapUtils"
const layers = [
    '地形瓦片',
    '河段划分',
    '河段注记',
    '沙岛',
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
    '三维地形'
]
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER

const layerAddFunctionMap = {
    '地形瓦片': async (map) => {
        !map.getSource('riverBg') &&
            map.addSource('riverBg', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBg/{x}/{y}/{z}',
                ],
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
                        '#000000'
                    ],
                    // 'fill-color': '#3EFA13'
                },
            })
    },
    '河段划分': async (map) => {
        !map.getSource('riverSection') &&
            map.addSource('riverSection', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverSection/{x}/{y}/{z}',
                ],
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
                    'line-color': 'rgba(231, 214, 86, 0.9)',
                    'line-width': 4,
                },
            })
    },
    '河段注记': async (map) => {
        !map.getSource('riverName') &&
            map.addSource('riverName', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverName/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河段注记') &&
            map.addLayer({
                id: '河段注记',
                type: 'symbol',
                source: 'riverName',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': '#383312',
                    'text-size': 20,
                },
            })
    },
    '沙岛': async (map) => {
        !map.getSource('riverLand') &&
            map.addSource('riverLand', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverLand/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('沙岛') &&
            map.addLayer({
                id: '沙岛',
                type: 'fill',
                source: 'riverLand',
                'source-layer': 'default',
                paint: {
                    'fill-color': 'rgba(183, 214, 86, 0.7)',
                },
            })
    },
    '全江注记': async (map) => {
        !map.getSource('placeLabel') &&
            map.addSource('placeLabel', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/placeLabel/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('全江注记') &&
            map.addLayer({
                id: '全江注记',
                type: 'symbol',
                source: 'placeLabel',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-anchor': 'left',

                },
                paint: {
                    'text-color': '#1FAEB3',
                },
            })
    },
    '深泓线': async (map) => {

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
    '已建通道': async (map) => {
        if (!map.getSource('channel-built-source')) {
            let channel = new DataPioneer(
                '过江通道',
                (e) => e['llCoords'],
                'LineString',
            )
            await channel.requestData(BackEndRequest.getChannelData)
            const { built, building, planning } = DataPioneer.getDifChannelData(
                channel.origin2geojson(),
            )
            !map.getSource('channel-built-source') &&
                map.addSource('channel-built-source', {
                    type: 'geojson',
                    data: built,
                })
            !map.getSource('channel-building-source') &&
                map.addSource('channel-building-source', {
                    type: 'geojson',
                    data: building,
                })

            !map.getSource('channel-planning-source') &&
                map.addSource('channel-planning-source', {
                    type: 'geojson',
                    data: planning,
                })
        }
        !map.getLayer('已建通道') &&
            map.addLayer({
                id: '已建通道',
                type: 'line',
                source: 'channel-built-source',
                layout: { 'line-join': 'round', 'line-cap': 'round', 'visibility': 'none' },
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
    },
    '在建通道': async (map) => {
        if (!map.getSource('channel-building-source')) {
            let channel = new DataPioneer(
                '过江通道',
                (e) => e['llCoords'],
                'LineString',
            )
            await channel.requestData(BackEndRequest.getChannelData)
            const { built, building, planning } = DataPioneer.getDifChannelData(
                channel.origin2geojson(),
            )
            !map.getSource('channel-built-source') &&
                map.addSource('channel-built-source', {
                    type: 'geojson',
                    data: built,
                })
            !map.getSource('channel-building-source') &&
                map.addSource('channel-building-source', {
                    type: 'geojson',
                    data: building,
                })

            !map.getSource('channel-planning-source') &&
                map.addSource('channel-planning-source', {
                    type: 'geojson',
                    data: planning,
                })
        }

        !map.getLayer('在建通道') &&
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
    },
    '规划通道': async (map) => {
        if (!map.getSource('channel-planning-source')) {
            let channel = new DataPioneer(
                '过江通道',
                (e) => e['llCoords'],
                'LineString',
            )
            await channel.requestData(BackEndRequest.getChannelData)
            const { built, building, planning } = DataPioneer.getDifChannelData(
                channel.origin2geojson(),
            )
            !map.getSource('channel-built-source') &&
                map.addSource('channel-built-source', {
                    type: 'geojson',
                    data: built,
                })
            !map.getSource('channel-building-source') &&
                map.addSource('channel-building-source', {
                    type: 'geojson',
                    data: building,
                })

            !map.getSource('channel-planning-source') &&
                map.addSource('channel-planning-source', {
                    type: 'geojson',
                    data: planning,
                })
        }

        !map.getLayer('规划通道') &&
            map.addLayer({
                id: '规划通道',
                type: 'line',
                source: 'channel-planning-source',
                layout: { 'line-join': 'round', 'line-cap': 'round', },
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
    },
    '民主沙地标': async (map) => {
        !map.getSource('mzsPlaceLabel') &&
            map.addSource('mzsPlaceLabel', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}',
                ],
            })

        !map.getLayer('民主沙地标') &&
            map.addLayer({
                id: '民主沙地标',
                type: 'symbol',
                source: 'mzsPlaceLabel',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',

                },
                paint: {
                    'text-color': 'rgb(44,78,196)',
                },
            })
    },
    '民主沙区划线': async (map) => {
        !map.getSource('mzsPlaceLine') &&
            map.addSource('mzsPlaceLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}',
                ],
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
    '民主沙岸段线': async (map) => {
        !map.getSource('mzsBankLine') &&
            map.addSource('mzsBankLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('民主沙岸段线') &&
            map.addLayer({
                id: '民主沙岸段线',
                type: 'symbol',
                source: 'mzsBankLine',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': 'rgba(231, 214, 126, 0.9)',
                },
            })
    },
    '民主沙岸段注记': async (map) => {
        !map.getSource('mzsBankLabel') &&
            map.addSource('mzsBankLabel', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsBankLabel/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('民主沙岸段注记') &&
            map.addLayer({
                id: '民主沙岸段注记',
                type: 'symbol',
                source: 'mzsBankLabel',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': 'rgb(28,13,106)',
                },
            })

    },
    '守护工程断面': async (map) => {
        !map.getSource('mzsSectionLine') &&
            map.addSource('mzsSectionLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsSectionLine/{x}/{y}/{z}',
                ],
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
                    'line-pattern': 'warning2'
                },
            })
    },
    '守护工程断面注记': async (map) => {
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
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                    'text-size': 20,

                },
                paint: {
                    'text-color': '#040052',
                },
            })
    },
    '稳定性分区': async (map) => {
        !map.getSource('mzsBankAreaS') &&
            map.addSource('mzsBankAreaS', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsBankAreaS/{x}/{y}/{z}',
                ],
            })

        !map.getLayer('稳定性分区') &&
            map.addLayer({
                id: '稳定性分区',
                type: 'fill',
                source: 'mzsBankAreaS',
                'source-layer': 'default',
                layout: {

                },
                paint: {
                    'fill-color': 'rgba(233, 23, 86, 0.6)',
                },
            })
    },
    '预警级别分区': async (map) => {
        !map.getSource('mzsBankAreaW') &&
            map.addSource('mzsBankAreaW', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsBankAreaW/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('预警级别分区') &&
            map.addLayer({
                id: '预警级别分区',
                type: 'fill',
                source: 'mzsBankAreaW',
                'source-layer': 'default',
                layout: {

                },
                paint: {
                    'fill-color': 'rgba(233, 233, 86, 0.6)',
                },
            })
    },
    'GNSS': async (map) => {
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
            const { gnss, manometer, stress, incline } = DataPioneer.getDifMonitorData(monitorDevice)
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
    '测斜仪': async (map) => {

        if (!map.getSource('incline-source')) {
            let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
            let monitorDevice = DataPioneer.generateGeoJson(
                monitorInfo,
                (element) => {
                    return [element['longitude'], element['latitude']]
                },
                'Point',
            )
            const { gnss, manometer, stress, incline } = DataPioneer.getDifMonitorData(monitorDevice)
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
    '孔隙水压力计': async (map) => {
        if (!map.getSource('manometer-source')) {
            let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
            let monitorDevice = DataPioneer.generateGeoJson(
                monitorInfo,
                (element) => {
                    return [element['longitude'], element['latitude']]
                },
                'Point',
            )
            const { gnss, manometer, stress, incline } = DataPioneer.getDifMonitorData(monitorDevice)
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
    '应力桩': async (map, stress) => {
        if (!map.getSource('stress-source')) {
            let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
            let monitorDevice = DataPioneer.generateGeoJson(
                monitorInfo,
                (element) => {
                    return [element['longitude'], element['latitude']]
                },
                'Point',
            )
            const { gnss, manometer, stress, incline } = DataPioneer.getDifMonitorData(monitorDevice)
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
    '近岸流场': async (map) => {
        if (map.getLayer('近岸流场')) {
            useLayerStore().flowLayer.show()
            let center = map.getCenter()
            map.flyTo({
                center: center
            })
        }
        else {
            let flowSrc = []
            for (let i = 0; i < 26; i++) {
                flowSrc.push(`/scratchSomething/terrain_flow/json/uv_${i}.bin`)
            }

            let flow = new SteadyFlowLayer(
                '近岸流场',
                '/scratchSomething/terrain_flow/json/station.bin',
                flowSrc,
                (url) => url.match(/uv_(\d+)\.bin/)[1],
                '/scratchSomething/terrain_flow/json/ChangJiang.geojson'
            )
            flow.particleNum.n = 2800;
            flow.speedFactor.n = 1.8;

            map.addLayer(flow)
            useLayerStore().setFlowLayer(flow)
        }
    },
    '三维地形': async (map) => {
        if (map.getLayer('三维地形')) useLayerStore().terrainLayer.show()
        else {
            let terrainLayer = new TerrainLayer(14)
            map.addLayer(terrainLayer)
            useLayerStore().setTerrainLayer(terrainLayer)
        }
    },


    ///////////////全江概貌
    /////// 行政区划
    '省级行政区': async (map) => {
        !map.getSource('cityBoundary') &&
            map.addSource('cityBoundary', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/cityBoundary/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('省级行政区') &&
            map.addLayer({
                id: '省级行政区',
                type: 'fill',
                source: 'cityBoundary',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-color': '#CEEFFA',
                    'fill-opacity': 1.0,
                },
            })
    },
    '市级行政区': async (map) => {
        !map.getSource('cityBoundaryLine') &&
            map.addSource('cityBoundaryLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/cityBoundaryLine/{x}/{y}/{z}',
                ],
            })

        !map.getLayer('市级行政区') &&
            map.addLayer({
                id: '市级行政区',
                type: 'line',
                source: 'cityBoundaryLine',
                'source-layer': 'default',
                layout: {

                },
                paint: {
                    'line-color': '#0A215C',
                    'line-width': 1.5,
                    'line-opacity': 0.5
                },
            })
    },
    '市级行政区-注记': async (map) => {
        if (!map.getSource('District-point')) {
            let data = (await axios.get(`http://localhost:5173/api/tile/vector/cityBoundary/info`)).data
            let pointgeoJson = convertToGeoJSON(data)

            map.addSource('District-point', {
                type: 'geojson',
                data: pointgeoJson
            })
        }
        !map.getLayer('市级行政区-注记') &&
            map.addLayer({
                id: '市级行政区-注记',
                type: 'symbol',
                source: 'District-point',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-anchor': 'center',
                    'text-offset': ['match', ['get', 'name'], '无锡市', [2, 0], '常州市', [1, 0], [0, 0]],
                },
                paint: {
                    'text-color': 'rgb(28,13,106)',
                },
            })
    },
    /////// 河道分段
    '河道分段': async (map) => {
        !map.getSource('riverSection') &&
            map.addSource('riverSection', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverSection/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河道分段') &&
            map.addLayer({
                id: '河道分段',
                type: 'line',
                source: 'riverSection',
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
    },
    '河道分段-注记': async (map) => {
        !map.getSource('riverName') &&
            map.addSource('riverName', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverName/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河道分段-注记') &&
            map.addLayer({
                id: '河道分段-注记',
                type: 'symbol',
                source: 'riverName',
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
    },

    ////// 流域水系
    '流域水系': async (map) => {
        !map.getSource('riverArea') &&
            map.addSource('riverArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverArea/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/河流.png', '河流')
        !map.getLayer('流域水系') &&
            map.addLayer({
                id: '流域水系',
                type: 'fill',
                source: 'riverArea',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-pattern': '河流',
                },
            })
    },
    ////// 湖泊河流
    '湖泊河流': async (map) => {
        !map.getSource('lakeArea') &&
            map.addSource('lakeArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/lakeArea/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/湖泊.png', '湖泊')
        !map.getLayer('湖泊河流') &&
            map.addLayer({
                id: '湖泊河流',
                type: 'fill',
                source: 'lakeArea',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-pattern': '湖泊'
                },
            })
    },
    ////// 水文站点
    '水文站点': async (map) => {
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
                // type: 'circle',
                type: 'symbol',
                source: 'hydroStationPoint',
                'source-layer': 'default',
                layout: {
                    'icon-image': '水文站',
                    "icon-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0.0],
                        10, ["literal", 0.3],
                        13, ["literal", 0.5]
                    ],
                    'icon-anchor': 'center',
                    'icon-allow-overlap': true,
                    'icon-keep-upright': true
                },
                paint: {
                    // 'circle-color': 'rgb(79,188,215)',
                    // 'circle-blur': 0.5,
                    // 'circle-radius': 6,
                },
            })
    },


    ////////////// 工程情况
    ////////长江堤防
    '长江堤防': async (map) => {

        !map.getSource('embankmentLine') &&
            map.addSource('embankmentLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/embankmentLine/{x}/{y}/{z}',
                ],
            })
        await loadImage(map, '/legend/堤防.png', '堤防')

        !map.getLayer('长江堤防') &&
            map.addLayer({
                id: '长江堤防',
                type: 'line',
                source: 'embankmentLine',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'line-pattern': '堤防',
                    'line-width': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0.0],
                        10, ["literal", 2],
                        13, ["literal", 5]
                    ],
                },
            })

    },
    ////////过江通道
    '过江通道-隧道/通道': async (map) => {
        !map.getSource('riverPassageLine') &&
            map.addSource('riverPassageLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverPassageLine/{x}/{y}/{z}',
                ],
            })
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
                    'line-color': '#E6A23C',
                    'line-width': 2.0,
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
                source: 'riverPassageLine',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'name'],
                    'symbol-placement': 'line',
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'center',
                },
                paint: {
                    'text-color': '#653400',
                    'line-width': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0.5],
                        10, ["literal", 3.0],
                        13, ["literal", 7.0]
                    ],
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
                layout: {
                },
                paint: {
                    'fill-extrusion-color': '#E7AE6D',
                    'fill-extrusion-base': 0,
                    'fill-extrusion-height': 200,
                    'fill-extrusion-opacity': 1.0
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
        !map.getLayer('过江通道-桥') &&
            map.addLayer({
                id: '过江通道-桥',
                type: 'fill-extrusion',
                source: 'riverPassagePolygon',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-extrusion-color': '#FF9925',
                    'fill-extrusion-base': 200,
                    'fill-extrusion-height': 210,
                    'fill-extrusion-opacity': 1.0
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
                source: 'riverPassagePolygon',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'name'],
                    'symbol-placement': 'line',
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'top',
                    'text-offset': [0, 0]
                },
                paint: {
                    'text-color': '#653400',
                },
            })
    },
    ///////沿江码头
    '沿江码头': async (map) => {
        !map.getSource('dockArea') &&
            map.addSource('dockArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/dockArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('沿江码头') &&
            map.addLayer({
                id: '沿江码头',
                type: 'fill',
                source: 'dockArea',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-color': '#2B2E76',
                },
            })
    },

    '水库大坝': async (map) => {
        !map.getSource('reservoirArea') &&
            map.addSource('reservoirArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/reservoirArea/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('水库大坝') &&
            map.addLayer({
                id: '水库大坝',
                type: 'fill',
                source: 'reservoirArea',
                'source-layer': 'default',
                layout: {
                },
                paint: {
                    'fill-color': '#337ecc',
                },
            })
    },
    '水闸工程': async (map) => {
        !map.getSource('sluiceArea') &&
            map.addSource('sluiceArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
                ],
            })
        loadImage(map, '/legend/水闸.png', '水闸')
        !map.getLayer('水闸工程') &&
            map.addLayer({
                id: '水闸工程',
                type: 'symbol',
                source: 'sluiceArea',
                'source-layer': 'default',
                layout: {
                    'icon-image': '水闸',
                    'icon-size': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0],
                        11, ["literal", 0.25],
                        14, ["literal", 0.5]
                    ],
                },
                paint: {
                },
            })
    },
    '泵站工程': async (map) => {
        !map.getSource('pumpArea') &&
            map.addSource('pumpArea', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
                ],
            })
        loadImage(map, '/legend/泵站.png', '泵站')
        !map.getLayer('泵站工程') &&
            map.addLayer({
                id: '泵站工程',
                type: 'symbol',
                source: 'pumpArea',
                'source-layer': 'default',
                layout: {
                    'icon-image': '泵站',
                    'icon-size': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0],
                        11, ["literal", 0.25],
                        14, ["literal", 0.5]
                    ],
                },
                paint: {
                },
            })
    },
    '枢纽工程': async (map) => {
        !map.getSource('combineProjectPoint') &&
            map.addSource('combineProjectPoint', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/combineProjectPoint/{x}/{y}/{z}',
                ],
            })
        loadImage(map, '/legend/枢纽.png', '枢纽')
        !map.getLayer('枢纽工程') &&
            map.addLayer({
                id: '枢纽工程',
                type: 'symbol',
                source: 'combineProjectPoint',
                'source-layer': 'default',
                layout: {
                    'icon-image': '枢纽',
                    'icon-size': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0],
                        11, ["literal", 0.4],
                        14, ["literal", 0.6]
                    ],
                },
                paint: {
                },
            })
    },
    // 江堤港堤
    '江堤港堤': async (map) => {
        !map.getSource('riverBankLine') &&
            map.addSource('riverBankLine', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBankLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('江堤港堤') &&
            map.addLayer({
                id: '江堤港堤',
                type: 'line',
                source: 'riverBankLine',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': '#958E54',
                    'line-width': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0.5],
                        10, ["literal", 1.0],
                        13, ["literal", 3.0]
                    ],
                },
            })

    },
    '里程桩': async (map) => {

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
                layout: {
                },
                paint: {
                    'circle-color': '#504C28',
                    'circle-blur': 0.5,
                    'circle-radius': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0.5],
                        10, ["literal", 2],
                        13, ["literal", 4]
                    ],
                },
            })
    },
    ///////////// 重点岸段
    /// 岸段名录
    '岸段-注记': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/importantBank/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('岸段-注记') &&
            map.addLayer({
                id: '岸段-注记',
                type: 'symbol',
                source: 'importantBank',
                minzoom: 11,
                maxzoom: 18,
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'bank_name'],
                    'symbol-placement': 'line',
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-anchor': 'top',
                },
                paint: {
                    'text-color': '#232323',
                },
            })
    },

    '一级预警岸段': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/importantBank/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('一级预警岸段') &&
            map.addLayer({
                id: '一级预警岸段',
                type: 'line',
                source: 'importantBank',
                'source-layer': 'default',
                layout: {
                },
                filter: ["==", "warning_level", 1],
                paint: {
                    'line-color': '#FF00B0',
                    'line-width': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0.5],
                        10, ["literal", 3.0],
                        13, ["literal", 7.0]
                    ],
                },
            })
    },
    '二级预警岸段': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/importantBank/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('二级预警岸段') &&
            map.addLayer({
                id: '二级预警岸段',
                type: 'line',
                source: 'importantBank',
                'source-layer': 'default',
                layout: {
                    // 'line-cap': 'round',
                    // 'line-join': 'round',
                },
                filter: ["==", "warning_level", 2],
                paint: {
                    // 'line-opacity': 1,
                    'line-color': '#00FFB0',
                    'line-width': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0.5],
                        10, ["literal", 3.0],
                        13, ["literal", 7.0]
                    ],

                },
            })
    },
    '三级预警岸段': async (map) => {
        !map.getSource('importantBank') &&
            map.addSource('importantBank', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/importantBank/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('三级预警岸段') &&
            map.addLayer({
                id: '三级预警岸段',
                type: 'line',
                source: 'importantBank',
                'source-layer': 'default',
                layout: {
                    // 'line-cap': 'round',
                    // 'line-join': 'round',
                },
                filter: ["==", "warning_level", 3],
                paint: {
                    // 'line-opacity': 1,
                    'line-color': '#0000FF',
                    'line-width': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, ["literal", 0.5],
                        10, ["literal", 3.0],
                        13, ["literal", 7.0]
                    ],
                },
            })
    },

    /// 历史崩岸
    '历史崩岸': async (map) => {

    },
    /// 近岸地形
    '近岸地形': async (map) => {

        !map.getSource('riverBg') &&
            map.addSource('riverBg', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBg/{x}/{y}/{z}',
                ],
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
                        0, '#00ff00', // 草绿色
                        10, '#78b766', // 香蕉黄
                        13.5, '#27c731',
                        15, '#a9e9ff', // 冰蓝色
                        20, '#ade2e6', // 淡蓝色
                        30, '#009bff',
                        60, '#0064ff',
                        Infinity, '#000000' // 默认颜色，如果height属性的值非常大
                    ],
                },
            })
    },
    /// 近年冲淤
    '近年冲淤': async (map) => {

    }




}

const layerAddFunction = async (map, layerID) => {
    await layerAddFunctionMap[layerID](map)
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
            let sourceId = layer.source
            map.removeLayer(layerID)
            map.removeSource(sourceId)
        }
    }
}
function convertToGeoJSON(data) {
    const features = data.map(item => {
        return {
            type: 'Feature',
            properties: {
                name: item.name
            },
            geometry: {
                type: 'Point',
                coordinates: [item.center_x, item.center_y]
            }
        };
    });

    return {
        type: 'FeatureCollection',
        features: features
    };
}

export {
    layers,
    layerAddFunctionMap,
    layerRemoveFunction, // hide and remove
    layerAddFunction,// add and show
}