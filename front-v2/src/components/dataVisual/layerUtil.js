
import SteadyFlowLayer from "../../utils/m_demLayer/steadyFlowLayer"
import TerrainLayer from "../../utils/m_demLayer/terrainLayer"
import { useLayerStore } from "../../store/mapStore"
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

const layerSrcMap = {
    '地形瓦片': (map) => {
        !map.getSource('river-terrain-source') &&
            map.addSource('river-terrain-source', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverBg/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('地形瓦片') &&
            map.addLayer({
                id: '地形瓦片',
                type: 'fill',
                source: 'river-terrain-source',
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
    '河段划分': (map) => {
        !map.getSource('riverSectionLabelSource') &&
            map.addSource('riverSectionLabelSource', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverSection/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河段划分') &&
            map.addLayer({
                id: '河段划分',
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
    },
    '河段注记': (map) => {
        !map.getSource('riverLabelSource') &&
            map.addSource('riverLabelSource', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/riverName/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('河段注记') &&
            map.addLayer({
                id: '河段注记',
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
    },
    '沙岛': (map) => {
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
    '全江注记': (map) => {
        !map.getSource('river-terrain-source') &&
            map.addSource('ptVector', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/placeLabel/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('全江注记') &&
            map.addLayer({
                id: '全江注记',
                type: 'symbol',
                source: 'ptVector',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-anchor': 'left',
                    'visibility': 'none',
                },
                paint: {
                    'text-color': '#1FAEB3',
                },
            })
    },
    '深泓线': (map) => {

        !map.getSource('depthLineSource') &&
            map.addSource('depthLineSource', {
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
                source: 'depthLineSource',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'visibility': 'none',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': 'rgba(12, 214, 211, 0.5)',
                    'line-width': 4,
                },
            })
    },
    '已建通道': (map, built) => {
        !map.getSource('channel-built-source') &&
            map.addSource('channel-built-source', {
                type: 'geojson',
                data: built,
            })
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
    '在建通道': (map, building) => {
        !map.getSource('channel-building-source') &&
            map.addSource('channel-building-source', {
                type: 'geojson',
                data: building,
            })
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
    '规划通道': (map, planning) => {
        !map.getSource('channel-planning-source') &&
            map.addSource('channel-planning-source', {
                type: 'geojson',
                data: planning,
            })
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
    '一级预警岸段': async (map, level1) => {
        await loadImage(map, '/geoStyle/warning1.png', 'warning1')
        !map.getSource('bank-level1-source') &&
            map.addSource('bank-level1-source', {
                type: 'geojson',
                data: level1,
            })
        !map.getLayer('一级预警岸段') &&
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

    },
    '二级预警岸段': async (map, level2) => {

        !map.getSource('bank-level2-source') &&
            map.addSource('bank-level2-source', {
                type: 'geojson',
                data: level2,
            })
        await loadImage(map, '/geoStyle/warning2.png', 'warning2')
        !map.getLayer('二级预警岸段') &&
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
    },
    '三级预警岸段': async (map, level3) => {

        !map.getSource('bank-level3-source') &&
            map.addSource('bank-level3-source', {
                type: 'geojson',
                data: level3,
            })

        await loadImage(map, '/geoStyle/warning3.png', 'warning3')
        !map.getLayer('三级预警岸段') &&
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
    },
    '民主沙地标': (map) => {
        !map.getSource('mzsPlaceLabelSource') &&
            map.addSource('mzsPlaceLabelSource', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}',
                ],
            })

        !map.getLayer('民主沙地标') &&
            map.addLayer({
                id: '民主沙地标',
                type: 'symbol',
                source: 'mzsPlaceLabelSource',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                    'visibility': 'none',
                },
                paint: {
                    'text-color': 'rgba(231, 214, 86, 0.9)',
                },
            })
    },
    '民主沙区划线': (map) => {
        !map.getSource('mzsPlaceLineSource') &&
            map.addSource('mzsPlaceLineSource', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('民主沙区划线') &&
            map.addLayer({
                id: '民主沙区划线',
                type: 'line',
                source: 'mzsPlaceLineSource',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    'visibility': 'none',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': 'rgba(26, 87, 138, 0.9)',
                    'line-width': 3,
                },
            })
    },
    '民主沙岸段线': (map) => {
        !map.getSource('mzsBankLineSource') &&
            map.addSource('mzsBankLineSource', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('民主沙岸段线') &&
            map.addLayer({
                id: '民主沙岸段线',
                type: 'symbol',
                source: 'mzsBankLineSource',
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
    '民主沙岸段注记': (map) => {
        !map.getSource('mzsBankLabelSource') &&
            map.addSource('mzsBankLabelSource', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsBankLabel/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('民主沙岸段注记') &&
            map.addLayer({
                id: '民主沙岸段注记',
                type: 'symbol',
                source: 'mzsBankLabelSource',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    // 'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                },
                paint: {
                    'text-color': 'rgba(121, 214, 126, 0.9)',
                },
            })

    },
    '守护工程断面': (map) => {
        !map.getSource('mzsSectionLineSource') &&
            map.addSource('mzsSectionLineSource', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsSectionLine/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('守护工程断面') &&
            map.addLayer({
                id: '守护工程断面',
                type: 'line',
                source: 'mzsSectionLineSource',
                'source-layer': 'default',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': 1,
                    'line-color': '#7F02F3',
                    'line-width': 7,
                    'line-pattern': 'section'
                },
            })
    },
    '守护工程断面注记': (map) => {
        !map.getSource('mzsSectionLineLabelSource') &&
            map.addSource('mzsSectionLineLabelSource', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsSectionLineLabel/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('守护工程断面注记') &&
            map.addLayer({
                id: '守护工程断面注记 ',
                type: 'symbol',
                source: 'mzsSectionLineLabelSource',
                'source-layer': 'default',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 1.25],
                    'text-anchor': 'left',
                    'text-size': 20,
                    'visibility': 'none',
                },
                paint: {
                    'text-color': '#040052',
                },
            })
    },
    '稳定性分区': (map) => {
        !map.getSource('mzsBankAreaStableSrc') &&
            map.addSource('mzsBankAreaStableSrc', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsBankAreaS/{x}/{y}/{z}',
                ],
            })

        !map.getLayer('稳定性分区') &&
            map.addLayer({
                id: '稳定性分区',
                type: 'fill',
                source: 'mzsBankAreaStableSrc',
                'source-layer': 'default',
                layout: {
                    'visibility': 'none',
                },
                paint: {
                    'fill-color': 'rgba(233, 23, 86, 0.6)',
                },
            })
    },
    '预警级别分区': (map) => {
        !map.getSource('mzsBankAreaWarnSrc') &&
            map.addSource('mzsBankAreaWarnSrc', {
                type: 'vector',
                tiles: [
                    tileServer + '/tile/vector/mzsBankAreaW/{x}/{y}/{z}',
                ],
            })
        !map.getLayer('预警级别分区') &&
            map.addLayer({
                id: '预警级别分区',
                type: 'fill',
                source: 'mzsBankAreaWarnSrc',
                'source-layer': 'default',
                layout: {
                    'visibility': 'none',
                },
                paint: {
                    'fill-color': 'rgba(233, 233, 86, 0.6)',
                },
            })
    },
    'GNSS': (map, gnss) => {
        !map.getSource('gnss-source') &&
            map.addSource('gnss-source', {
                type: 'geojson',
                data: gnss,
            })
        !map.getLayer('GNSS') &&
            map.addLayer({
                id: 'GNSS',
                type: 'symbol',
                source: 'gnss-source',
                layout: {
                    'icon-image': 'pulsing-dot-gnss',
                    'icon-allow-overlap': true,
                    'visibility': 'none',
                },
            })
    },
    '测斜仪': (map, incline) => {
        !map.getSource('incline-source') &&
            map.addSource('incline-source', {
                type: 'geojson',
                data: incline,
            })
        !map.getLayer('测斜仪') &&
            map.addLayer({
                id: '测斜仪',
                type: 'symbol',
                source: 'incline-source',
                layout: {
                    'icon-image': 'pulsing-rect-incline',
                    'icon-allow-overlap': true,
                    'visibility': 'none',
                },
            })
    },
    '孔隙水压力计': (map, manometer) => {
        !map.getSource('manometer-source') &&
            map.addSource('manometer-source', {
                type: 'geojson',
                data: manometer,
            })
        !map.getLayer('孔隙水压力计') &&
            map.addLayer({
                id: '孔隙水压力计',
                type: 'symbol',
                source: 'manometer-source',
                layout: {
                    'icon-image': 'pulsing-dia-manometer',
                    'icon-allow-overlap': true,
                    'visibility': 'none',
                },
            })
    },
    '应力桩': (map, stress) => {
        !map.getSource('stress-source') &&
            map.addSource('stress-source', {
                type: 'geojson',
                data: stress,
            })
        !map.getLayer('应力桩') &&
            map.addLayer({
                id: '应力桩',
                type: 'symbol',
                source: 'stress-source',
                layout: {
                    'icon-image': 'pulsing-tri-stress',
                    'icon-allow-overlap': true,
                    'visibility': 'none',
                },
            })
    },
    '近岸流场': (map) => {
        if (map.getLayer('近岸流场')) useLayerStore().flowLayer.show()
        else {
            let flow = new SteadyFlowLayer()
            map.addLayer(flow)
            useLayerStore().setFlowLayer(flow)
        }
    },
    '三维地形': (map) => {
        if (map.getLayer('近岸流场')) useLayerStore().terrainLayer.show()
        else {
            let terrainLayer = new TerrainLayer(14)
            map.addLayer(terrainLayer)
            useLayerStore().setTerrainLayer(terrainLayer)
        }
    },
}