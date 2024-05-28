import BackEndRequest from '../../api/backend'
import { DataPioneer } from '../dataVisual/Scene'
import { pulsing, loadImage } from '../../utils/mapUtils'
import mapboxgl from 'mapbox-gl'
// import MultiChart from '../dataVisual/monitorDevice/MultiChart.vue'
import monitorDetailV2 from '../dataVisual/featureDetails/monitorDetailV2.vue'
// import monitorDetailV22 from '../dataVisual/featureDetails/monitorDetailV22.vue'
// import warningPop from '../bankTwin/warningPop.vue'
import warningPopup from '../bankTwin/warningPopup.vue'
import { useWarnInfoStore } from '../../store/mapStore'
import { convertToMercator } from '../modelStore/riskCalc/coordConvert'
import proj4 from 'proj4'
import { ref, createApp, h } from 'vue'
import axios from 'axios'
import { useSceneStore } from '../../store/mapStore'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
// import ElementPlus from "element-plus";

const propertyRef = ref({})
const zoomRef = ref()
const deviceTypeList = ['GNSS', '应力桩', '水压力计', '', '测斜仪']
let typeList = ['GNSS', '应力桩', '孔隙水压力计', '测斜仪']

const filterWarnData = (warnDataList) => {
    let filterMap = {}

    warnDataList.map((item) => {
        if (!item.ifDealt) {
            //if not dealt with
            if (
                // new Item and warnTime smaller
                !(item.deviceId in filterMap) ||
                filterMap[item.deviceId].warnTime < item.warnTime
            ) {
                filterMap[item.deviceId] = item // strore it
            }
        }
    })
    console.log('filter!!', filterMap, Object.values(filterMap))
    return Object.values(filterMap)
}

const mapInit = async (map, vis) => {
    const tileServer = import.meta.env.VITE_MAP_TILE_SERVER

    map.addSource('mzsPlaceLabelSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}'],
    })
    map.addSource('mzsPlaceLineSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}'],
    })
    map.addSource('dockAreaSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/dockArea/{x}/{y}/{z}'],
    })
    map.addSource('dockAreaLabelSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/center/dockArea/{x}/{y}/{z}'],
    })
    map.addSource('fixProjectAreaSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/fixProjectArea/{x}/{y}/{z}'],
    })
    map.addSource('fixProjectLineSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/fjsFixLine/{x}/{y}/{z}'],
    })
    map.addSource('fixProjectAreaLabelSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/center/fixProjectArea/{x}/{y}/{z}'],
    })
    map.addSource('mzsSectionLabel', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/geomCenter/mzsBankLine/{x}/{y}/{z}'],
    })
    map.addSource('riverPlaceLabel', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/placeLabel/{x}/{y}/{z}'],
    })
    map.addSource('mzsBankLineSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
    })
    map.addSource('riverBeachSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/riverBeach/{x}/{y}/{z}'],
    })
    // map.addSource('mzsSectionLineSource', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/mzsSectionLine/{x}/{y}/{z}',
    //     ],
    // })
    // map.addSource('mzsSectionLineLabelSource', {
    //     type: 'vector',
    //     tiles: [tileServer + '/tile/vector/mzsSectionLineLabel/{x}/{y}/{z}'],
    // })
    // map.addSource('mzsBankAreaWSource', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/mzsBankAreaW/{x}/{y}/{z}',
    //     ],
    // })
    map.addSource('mzsBankAreaSSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/mzsBankAreaS/{x}/{y}/{z}'],
    })

    map.addLayer({
        id: 'riverBeachArea',
        type: 'fill',
        source: 'riverBeachSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(210,244,247, 1)',
        },
    })

    map.addLayer({
        id: 'mzsLine',
        type: 'line',
        source: 'mzsPlaceLineSource',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(26, 87, 138, 0.6)',
            'line-width': 2,
        },
    })

    map.addLayer({
        id: 'fjsFixLine',
        type: 'line',
        source: 'fixProjectLineSource',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(216, 217, 228, 0.5)',
            'line-width': 4,
        },
    })

    // map.addLayer({
    //     id: 'mzsLabel',
    //     type: 'symbol',
    //     source: 'mzsPlaceLabelSource',
    //     'source-layer': 'default',
    //     layout: {
    //         'text-field': ['get', 'label'],
    //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //         // 'text-offset': [0, 1.25],
    //         'text-anchor': 'left',
    //     },
    //     paint: {
    //         'text-color': 'rgba(31, 14, 126, 0.75)',
    //     },
    // })
    map.addLayer({
        id: 'mzsSectionArea1',
        type: 'fill',
        source: 'mzsBankAreaSSource',
        'source-layer': 'default',
        paint: {
            'fill-color': [
                'match',
                ['get', 'stability'],
                '较稳定',
                '#18b915',
                '稳定',
                '#06bef1',
                '不稳定',
                '#df8105',
                '较不稳定',
                'rgba(180,194,197, 0.8)',
                '#18b915',
            ],
        },
    })
    map.addLayer({
        id: 'dockAreaLayer',
        type: 'fill',
        source: 'dockAreaSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(161,207,238, 0.8)',
            'fill-outline-color': 'rgba(161,207,238, 0.8)',
        },
    })
    map.addLayer({
        id: 'fixProjectLayer',
        type: 'fill',
        source: 'fixProjectAreaSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(220,224,237, 0.8)',
            'fill-outline-color': 'rgba(220,224,237, 0.8)',
        },
    })
    // map.addLayer({
    //     id: 'mzsSectionArea2',
    //     type: 'fill',
    //     source: 'mzsBankAreaWSource',
    //     'source-layer': 'default',
    //     paint: {
    //         'fill-color': [
    //             'match',
    //             ['get', 'warn'],
    //             '正常',
    //             '#18b915',
    //             '关注',
    //             'rgba(131, 14, 223, 0.5)',
    //             '预警',
    //             'rgba(221, 224, 23, 0.5)',
    //             '警告',
    //             'rgba(221, 24, 23, 0.5)',
    //             '#18b915',
    //         ],
    //     },
    // })
    map.addLayer({
        id: 'mzsBankLine',
        type: 'line',
        source: 'mzsBankLineSource',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(31, 14, 223, 0.75)',
            'line-width': 4,
            'line-dasharray': [1, 1.5],
        },
    })
    map.addLayer({
        id: '点2',
        type: 'symbol',
        source: 'mzsSectionLabel',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-font':['Open Sans Bold','Arial Unicode MS Bold'],
            'text-offset': [-1.0, 1.15],
            'text-anchor': 'top',
            'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                2,
                ['literal', 6],
                10,
                ['literal', 10],
                18,
                ['literal', 24],
                22,
                ['literal', 32],
            ],
            'text-allow-overlap': true,
        },
        paint: {
            'text-color': 'rgb(0, 22, 145)',
        },
    })
    map.addLayer({
        id: 'mzsLabel',
        type: 'symbol',
        source: 'mzsPlaceLabelSource',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'left',
            'text-size': 12,
        },
        paint: {
            'text-color': 'rgba(31, 14, 126, 0.8)',
        },
    })
    map.addLayer({
        id: 'dockAreaLabel',
        type: 'symbol',
        source: 'dockAreaLabelSource',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'project_name'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'bottom',
            'text-size': 12,
        },
        paint: {
            'text-color': 'rgba(31, 44, 126, 0.6)',
        },
    })
    map.addLayer({
        id: 'riverPlaceLabel',
        type: 'symbol',
        source: 'riverPlaceLabel',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'left',
            'text-size': 18,
        },
        paint: {
            'text-color': 'rgba(31, 44, 226, 1)',
        },
    })
    map.addLayer({
        id: 'fixProjectAreaLabel',
        type: 'symbol',
        source: 'fixProjectAreaLabelSource',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'layer'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'right',
            'text-size': 12,
        },
        paint: {
            'text-color': 'rgba(31, 44, 126, 0.6)',
        },
    })

    if (vis) {
        const pulsingCVSMap = {
            GNSS: 'point',
            测斜仪: 'rectangle',
            孔隙水压力计: 'diamond',
            应力桩: 'triangle',
        }
        const pulsingMap = {
            GNSS: 'gnss-dot-pulsing',
            测斜仪: 'incline-dot-pulsing',
            孔隙水压力计: 'manometer-dot-pulsing',
            应力桩: 'stress-dot-pulsing',
        }
        map.addImage(pulsingMap['GNSS'], pulsing[pulsingCVSMap['GNSS']], {
            pixelRatio: 1,
        })
        // map.addImage(
        //     pulsingMap['测斜仪'],
        //     pulsing[pulsingCVSMap['测斜仪']],
        //     {
        //         pixelRatio: 1,
        //     },
        // )
        // map.addImage(
        //     pulsingMap['孔隙水压力计'],
        //     pulsing[pulsingCVSMap['孔隙水压力计']],
        //     {
        //         pixelRatio: 1,
        //     },
        // )
        // map.addImage(
        //     pulsingMap['应力桩'],
        //     pulsing[pulsingCVSMap['应力桩']],
        //     {
        //         pixelRatio: 1,
        //     },
        // )

        //////////////monitor device////////////
        let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
        let monitorDevice = DataPioneer.generateDeviceGeoJson(
            monitorInfo,
            (element) => {
                return [element['longitude'], element['latitude']]
            },
            'Point',
        )
        const { gnss, incline, stress, manometer, camera, gnssJZ } =
            DataPioneer.getDifMonitorData(monitorDevice)
        console.log('res geojson', gnss)
        // // cluster
        // map.addSource('monitor-source', {
        //     type: 'geojson',
        //     data: monitorDevice,
        //     cluster: true,
        //     clusterMaxZoom: 14,
        //     clusterRadius: 50,
        // })

        map.addSource('gnss-jz-source', {
            type: 'geojson',
            data: gnssJZ,
        })
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
        map.addSource('camera-source', {
            type: 'geojson',
            data: camera,
        })

        // image source

        await loadImage(map, '/icons/GNSS测量站.png', 'gnss-static')
        await loadImage(map, '/icons/GNSS基准站.png', 'gnss-jz-static')
        await loadImage(map, '/icons/测斜仪.png', 'incline-static')
        await loadImage(map, '/icons/孔隙水压力计.png', 'manometer-static')
        await loadImage(map, '/icons/应力桩.png', 'stress-static')
        await loadImage(map, '/icons/视频监控.png', 'camera-static')

        // map.addLayer({
        //     id: '聚合点',
        //     type: 'circle',
        //     source: 'monitor-source',
        //     filter: ['has', 'point_count'],
        //     paint: {
        //         'circle-color': [
        //             'step',
        //             ['get', 'point_count'],
        //             '#51bbd6',
        //             10,
        //             '#f1f075',
        //             30,
        //             '#f28cb1'
        //         ],
        //         'circle-radius': [
        //             'step',
        //             ['get', 'point_count'],
        //             20,
        //             10,
        //             30,
        //             30,
        //             40
        //         ]
        //     }
        // });
        // map.addLayer({
        //     id: 'cluster-count',
        //     type: 'symbol',
        //     source: 'monitor-source',
        //     filter: ['has', 'point_count'],
        //     layout: {
        //         'text-field': ['get', 'point_count_abbreviated'],
        //         'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        //         'text-size': 12
        //     }
        // });

        let minzoom = 16

        map.addLayer({
            id: 'GNSS基准站',
            type: 'symbol',
            source: 'gnss-jz-source',
            layout: {
                'icon-image': 'gnss-jz-static',
                'icon-size': 0.2,
                'icon-allow-overlap': true,
            },
        })
        map.addLayer({
            id: 'GNSS基准站-标注',
            type: 'symbol',
            source: 'gnss-jz-source',
            minzoom,
            layout: {
                'text-field': ['get', 'label'],
                'text-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    ['literal', 20],
                    18,
                    ['literal', 26],
                    20,
                    ['literal', 32],
                ],
                'text-allow-overlap': true,
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-variable-anchor': [
                    'top',
                    'bottom',
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                ],
                'text-radial-offset': 1,
            },
            paint: {
                'text-color': 'rgba(255,127, 0, 0.75)',
            },
        })
        map.addLayer({
            id: 'GNSS',
            type: 'symbol',
            source: 'gnss-source',
            layout: {
                'icon-image': 'gnss-static',
                'icon-size': 0.2,
                'icon-allow-overlap': true,
            },
        })
        map.addLayer({
            id: 'GNSS-标注',
            type: 'symbol',
            source: 'gnss-source',
            minzoom,
            layout: {
                'text-field': ['get', 'label'],
                'text-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    ['literal', 20],
                    18,
                    ['literal', 26],
                    20,
                    ['literal', 32],
                ],
                'text-allow-overlap': true,
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-variable-anchor': [
                    'top',
                    'bottom',
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                ],
                'text-radial-offset': 1,
            },
            paint: {
                'text-color': 'rgba(255,127, 0, 0.9)',
            },
        })
        map.addLayer({
            id: '测斜仪',
            type: 'symbol',
            source: 'incline-source',
            layout: {
                'icon-image': 'incline-static',
                'icon-size': 0.2,
                'icon-allow-overlap': true,
            },
        })

        map.addLayer({
            id: '测斜仪-标注',
            type: 'symbol',
            source: 'incline-source',
            minzoom,
            layout: {
                'text-field': ['get', 'label'],
                'text-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    ['literal', 20],
                    18,
                    ['literal', 26],
                    20,
                    ['literal', 32],
                ],
                'text-allow-overlap': true,
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-variable-anchor': [
                    'top',
                    'bottom',
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                ],
                'text-radial-offset': 1,
            },
            paint: {
                'text-color': 'rgba(127,0,255, 0.9)',
            },
        })
        map.addLayer({
            id: '孔隙水压力计',
            type: 'symbol',
            source: 'manometer-source',
            layout: {
                'icon-image': 'manometer-static',
                'icon-size': 0.2,
                'icon-allow-overlap': true,
            },
        })
        map.addLayer({
            id: '孔隙水压力计-标注',
            type: 'symbol',
            source: 'manometer-source',
            minzoom,
            layout: {
                'text-field': ['get', 'label'],
                'text-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    ['literal', 20],
                    18,
                    ['literal', 26],
                    20,
                    ['literal', 32],
                ],
                'text-allow-overlap': true,
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-variable-anchor': [
                    'top',
                    'bottom',
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                ],
                'text-radial-offset': 1,
            },
            paint: {
                'text-color': 'rgba(14,242,30, 0.9)',
            },
        })
        map.addLayer({
            id: '应力桩',
            type: 'symbol',
            source: 'stress-source',
            layout: {
                'icon-image': 'stress-static',
                'icon-size': 0.2,
                'icon-allow-overlap': true,
            },
        })
        map.addLayer({
            id: '应力桩-标注',
            type: 'symbol',
            source: 'stress-source',
            minzoom,
            layout: {
                'text-field': ['get', 'label'],
                'text-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    ['literal', 20],
                    18,
                    ['literal', 26],
                    20,
                    ['literal', 32],
                ],
                'text-allow-overlap': true,
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-variable-anchor': [
                    'top',
                    'bottom',
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                ],
                'text-radial-offset': 1,
            },
            paint: {
                'text-color': 'rgba(255,0,255, 0.9)',
            },
        })
        map.addLayer({
            id: '监控摄像头',
            type: 'symbol',
            source: 'camera-source',
            layout: {
                'icon-image': 'camera-static',
                'icon-size': 0.2,
                'icon-allow-overlap': true,
            },
        })
        map.addLayer({
            id: '监控摄像头-标注',
            type: 'symbol',
            source: 'camera-source',
            minzoom,
            layout: {
                'text-field': ['get', 'label'],
                'text-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    ['literal', 20],
                    18,
                    ['literal', 26],
                    20,
                    ['literal', 32],
                ],
                'text-allow-overlap': true,
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-variable-anchor': [
                    'top',
                    'bottom',
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                ],
                'text-radial-offset': 1,
            },
            paint: {
                'text-color': 'rgba(3,5,255, 0.9)',
            },
        })

        let deviceLayers = ['GNSS', '测斜仪', '孔隙水压力计', '应力桩']

        map.on('click', deviceLayers, (e) => {
            // if (e.features.length > 1) {
            //     console.log('click features!', e.features)
            //     open(e.features, map)
            // } else if (e.features.length === 1) {
            let p = e.features[0].properties
            const property = e.features[0].properties
            useSceneStore().setSelectedFeature(property)
            propertyRef.value = property
            const popUp = createPopUp(propertyRef, zoomRef)
            popUp.setOffset(0).setLngLat([p.longitude, p.latitude]).addTo(map)
            // }
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

        setTimeout(() => {
            warnInterval(map, 20)
        }, 500)
        useWarnInfoStore().warnWatchTimer = setInterval(
            () => {
                warnInterval(map, 20)
            },
            60 * 1000 * 20,
        )
        // request per 20minutes

        ///////DEBUG////////
        window.addEventListener('keydown', async (e) => {
            if (e.key == 'Enter') {
                const minute = 60 * 36
                let allWarnData = (
                    await axios.get(`/api/data/deviceWarn/minute/${minute}`)
                ).data
                let filteredData = filterWarnData(allWarnData)
                let lastPos
                filteredData.forEach((item, index) => {
                    let id = item.deviceId
                    let type = deviceTypeList[id.split('_').pop() - 1]
                    lastPos = setWarningDeviceStyle(
                        map,
                        type,
                        id,
                        item,
                        index + 1,
                    )
                })
                if (filteredData.length != 0) {
                    useWarnInfoStore().warnInfo = filteredData
                    useWarnInfoStore().warnInfo_history = [...allWarnData]
                }
            } else if (e.key == 'f') {
                // 11111  clear warnStore and warnLayer
                useWarnInfoStore().warnInfo.forEach((item) => {
                    removeWarningDeviceStyle2(map, item.deviceId)
                })
                useWarnInfoStore().resetWarnInfo()
                let allWarnData = JSON.parse(JSON.stringify(fakeWarnInfo))
                let filteredData = filterWarnData(allWarnData)
                filteredData.forEach((item, index) => {
                    let id = item.deviceId
                    let type = typeList[id.split('_').pop() - 1]
                    setWarningDeviceStyle(map, type, id, item, index + 1)
                })
                if (filteredData.length != 0)
                    useWarnInfoStore().warnInfo = filteredData
                // 22222 set fake data
                useWarnInfoStore().warnInfo_history = [...filteredData]
                useWarnInfoStore().fake = true
                useWarnInfoStore().videoActive = [0, 2]
            } else if (e.key == 'a') {
                useWarnInfoStore().warnInfo_history = []
            }
        })
    }
}

function generateCircleLineString(x, y, radius, numPoints = 24) {
    const points = []
    const angleStep = (2 * Math.PI) / numPoints

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep
        const pointX = x + radius * Math.cos(angle)
        const pointY = y + radius * Math.sin(angle)
        points.push(proj4('EPSG:3857', 'EPSG:4326', [pointX, pointY]))
    }

    // Close the circle by adding the first point at the end
    points.push(points[0])

    return points
}

function buildCircleWithMeters(x, y, radius, numPoints = 24) {
    const xy = convertToMercator([x, y])

    console.log('gen xy', xy)

    const circlePoints = generateCircleLineString(
        xy[0],
        xy[1],
        radius,
        numPoints,
    )
    console.log('circles back', circlePoints)

    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [circlePoints],
                },
            },
        ],
    }
}

const setWarningDeviceStyle = (
    map,
    deviceLayer,
    deviceCode,
    warnData,
    index,
) => {
    // const pulsingCVSMap = {
    //     GNSS: 'point',
    //     测斜仪: 'rectangle',
    //     孔隙水压力计: 'diamond',
    //     应力桩: 'triangle',
    // }
    // const pulsingMap = {
    //     GNSS: 'gnss-dot-pulsing',
    //     测斜仪: 'incline-dot-pulsing',
    //     孔隙水压力计: 'manometer-dot-pulsing',
    //     应力桩: 'stress-dot-pulsing',
    // }
    // const pulsingImageId = 'gnss-dot-pulsing' //only one style
    const sourceMap = {
        GNSS: 'gnss-source',
        测斜仪: 'incline-source',
        孔隙水压力计: 'manometer-source',
        应力桩: 'stress-source',
    }
    let json = map.getSource(sourceMap[deviceLayer])['_data']

    let property = findProptyFromJson(json, deviceCode)
    propertyRef.value = property

    if (!map.getLayer(`${deviceLayer}-${deviceCode}`)) {
        if (!map.getSource(`${deviceLayer}-${deviceCode}-source`)) {
            const circleJson = buildCircleWithMeters(
                property.longitude,
                property.latitude,
                220,
            )
            console.log('circle circle', circleJson)
            map.addSource(`${deviceLayer}-${deviceCode}-source`, {
                type: 'geojson',
                data: circleJson,
            })
        }
        map.addLayer(
            {
                id: `${deviceLayer}-${deviceCode}`,
                // type: 'symbol',
                type: 'fill',
                source: `${deviceLayer}-${deviceCode}-source`,
                layout: {
                    // 'icon-image': pulsingImageId,
                    // 'icon-size': 1,
                    // 'icon-allow-overlap': true,
                },
                paint: {
                    'fill-color': '#E05F2D',
                    'fill-opacity': 0.3,
                },
            },
            'mzsBankLine',
        )
        let i = 0
        let interval = [0.2, 0.3, 0.4, 0.5, 0.4, 0.3]
        let intv = setInterval(() => {
            i = (i + 1) % 6
            map.setPaintProperty(
                `${deviceLayer}-${deviceCode}`,
                'fill-opacity',
                0.3 + interval[i],
            )
        }, 200)
        useWarnInfoStore().areaBreatheInterval[warnData.id] = intv
    }
    // let json = map.getSource(sourceMap[deviceLayer])['_data']

    // let property = findProptyFromJson(json, deviceCode)
    // propertyRef.value = property

    // warning
    const popup = createWarningPopup({ warningInfo: warnData, index })
    popup.setLngLat([property.longitude, property.latitude]).addTo(map)
    useWarnInfoStore().warnPopupMap[warnData.id] = popup
    return [property.longitude, property.latitude]
}

const removeWarningDeviceStyle = (map, deviceLayer, deviceCode) => {
    map.getLayer(`${deviceLayer}-${deviceCode}`) &&
        map.removeLayer(`${deviceLayer}-${deviceCode}`)
}

const removeWarningDeviceStyle2 = (map, deviceCode) => {
    const daviceLayerMap = ['GNSS', '应力桩', '水压力计', '', '测斜仪']
    let deviceLayer = daviceLayerMap[deviceCode.split('_').pop() - 1]
    map.getLayer(`${deviceLayer}-${deviceCode}`) &&
        map.removeLayer(`${deviceLayer}-${deviceCode}`)
}

const createPopUp = (deviceProperty, zoom) => {
    const ap = createApp(monitorDetailV2, { deviceInfo: deviceProperty, zoom })

    const container = document.createElement('div')
    container.id = 'monitorDetailV2-div'
    const componentInstance = ap.mount(container)

    const domwithComp = container
    const popUp = new mapboxgl.Popup({
        maxWidth: '1500px',
        offset: 25,
    }).setDOMContent(domwithComp)
    return popUp
}

const createWarningPopup = (info) => {
    // const ap = createApp(warningPop, { warningInfo: info })
    const ap = createApp(warningPopup, info)

    const container = document.createElement('div')
    const componentInstance = ap.mount(container)

    const domwithComp = container
    const popUp = new mapboxgl.Popup({
        maxWidth: '1500px',
        offset: 25,
        closeOnClick: false,
        closeButton: true,
    }).setDOMContent(domwithComp)
    return popUp
}

const findProptyFromJson = (geoJson, code) => {
    const features = geoJson.features
    let prop
    features.forEach((item) => {
        if (item.properties.code === code) {
            prop = item.properties
        }
    })

    return prop
}

const warnInterval = async (map, minute) => {
    const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']
    const DeviceIDs = {
        GNSS: [],
        测斜仪: [],
        水压力计: [],
        应力桩: [],
    }

    let deviceInfo = (await axios.get('/api/data/monitorInfo')).data
    deviceInfo.forEach((item) => {
        const type = Number(item['type']) - 1

        if (type != 4 && type != 5) {
            // camera -- 5
            DeviceIDs[DEVICETYPEMAP[type]].push(item['code'])
        }
    })

    let allWarnData = (
        await axios.get(`/api/data/deviceWarn/danger/minute/${minute}`)
    ).data
    // let warnType = 'GNSS'
    let filteredData = filterWarnData(allWarnData)
    let lastPos
    filteredData.forEach((item, index) => {
        let id = item.deviceId
        let type = 'GNSS'
        lastPos = setWarningDeviceStyle(map, type, id, item, index + 1)
    })
    console.log('in interval, ', filteredData)
    // console.log('123213 store warn pop map', useWarnInfoStore().warnPopupMap)
    if (filteredData.length != 0) {
        useWarnInfoStore().warnInfo = filteredData
        useWarnInfoStore().warnInfo_history = [...allWarnData]
        console.log(
            'in interval history warn',
            useWarnInfoStore().warnInfo_history,
        )
    }
    // console.log('first-warnInterval!', filteredData)

    // if (lastPos) {
    //     map.flyTo({
    //         center: lastPos,
    //         pitch: 61.99999999999988,
    //         bearing: 0,
    //         zoom: 15.845427972376211,
    //         speed: 0.5,
    //         essential: true,
    //     })
    // }
}

const open = (features, map) => {
    const items = features
    const selectedDevice = ref({})
    let selectedCode
    // const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']
    const DEVICETYPEMAP = ['GNSS', '应力桩', '水压力计', '测斜仪']

    useSceneStore().setSelectedFeature(items[0].properties)
    propertyRef.value = items[0].properties
    const popUp = createPopUp(propertyRef, zoomRef)
    popUp
        .setOffset(0)
        .setLngLat([
            items[0].properties.longitude,
            items[0].properties.latitude,
        ])
        .addTo(map)

    // let dom = document.getElementById('popup')

    // const radioGroupVNode = h('div', { class: 'container' }, [
    //     h('div', { class: 'title' }, '选择设备'),
    //     items.map(item => {
    //         return h(
    //             'div',
    //             {
    //                 key: item.properties.machineId,
    //                 class: 'block',
    //             },
    //             [
    //                 h('label', { class: 'label' },
    //                     [
    //                         h('input', {
    //                             type: 'radio',
    //                             name: 'options',
    //                             value: item.properties.code,
    //                             onChange: event => {
    //                                 // 在这里处理选项变化事件
    //                                 selectedCode = event.target.value;
    //                             }
    //                         }),
    //                         h('span', { class: 'text' }, DEVICETYPEMAP[Number(item.properties.type) - 1] + '（' + deviceNameMap[DEVICETYPEMAP[Number(item.properties.type) - 1]][item.properties.code] + '）')
    //                     ]
    //                 )
    //             ]
    //         );
    //     })
    // ]);

    // ElMessageBox.confirm(
    //     '',
    //     {
    //         distinguishCancelAndClose: true,
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         center: true,
    //         message: radioGroupVNode,
    //         'customClass': 'choice-box'
    //     }
    // )
    //     .then(() => {
    //         ElMessage({
    //             type: 'info',
    //             message: '加载设备详情',
    //         })
    //         let targetProperty
    //         for (let i = 0; i < items.length; i++) {
    //             if (items[i].properties.code === selectedCode) {
    //                 targetProperty = items[i].properties
    //             }
    //         }

    //         useSceneStore().setSelectedFeature(targetProperty)
    //         propertyRef.value = targetProperty
    //         const popUp = createPopUp(propertyRef, zoomRef)
    //         popUp.setOffset(0).setLngLat([targetProperty.longitude, targetProperty.latitude]).addTo(map)

    //         let dom = document.getElementById('popup')

    //     })
    //     .catch((action) => {
    //         ElMessage({
    //             type: 'info',
    //             message: '取消'
    //         })
    //     })
}

const deviceNameMap = {
    GNSS: {
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
    },
    水压力计: {
        'MZS120.51726088_32.04054582_3': 'KX-01',
        'MZS120.51738292_32.04054923_3': 'KX-02',
        'MZS120.51749021_32.04053105_3': 'KX-03',
        'MZS120.51957026_32.04008655_3': 'KX-04',
        'MZS120.51967889_32.04004108_3': 'KX-05',
        'MZS120.51986665_32.03998992_3': 'KX-06',
        'MZS120.52557975_32.03825056_3': 'KX-07',
        'MZS120.52565217_32.03813574_3': 'KX-08',
        'MZS120.52566826_32.03799363_3': 'KX-09',
    },
    测斜仪: {
        'MZS120.51967889_32.04004108_4': 'CX-01',
        'MZS120.51986665_32.03998992_4': 'CX-02',
        'MZS120.52557975_32.03825056_4': 'CX-03',
        'MZS120.52565217_32.03813574_4': 'CX-04',
        'MZS120.52566826_32.03799363_4': 'CX-05',
        'MZS120.51726088_32.04054582_4': 'CX-06',
        'MZS120.51738292_32.04054923_4': 'CX-07',
        'MZS120.51749021_32.04053105_4': 'CX-08',
        'MZS120.51957026_32.04008655_4': 'CX-09',
    },
    应力桩: {
        'MZS120.513203_32.042733_2': 'YL-01',
        'MZS120.515433_32.04231_2': 'YL-02',
        'MZS120.521221_32.040331_2': 'YL-03',
        'MZS120.529078_32.034385_2': 'YL-04',
        'MZS120.541648_32.030524_2': 'YL-05',
        'MZS120.548925_32.029361_2': 'YL-06',
        'MZS120.552209_32.028149_2': 'YL-07',
    },
}
/*
//  'KX-01': 'MZS120.51726088_32.04054582_3',   
 'CX-01': 'MZS120.51967889_32.04004108_4',
 'CL-06': 'MZS120.54599538_32.02837993_1',
 'YL-05': 'MZS120.541648_32.030524_2',

 {
     "deviceCode": "DVI3010425438293",
     "deviceId": "MZS120.55327892_32.02707923_1",
     "id": "c6ae8d58-a506-4acc-ad86-998db55195a3",
     "ifDealt": null,
     "threeDiff": 31.4255215,
     "warnTime": "2024-05-22 20:53:22"
 }
 */

const fakeWarnInfo = [
    {
        deviceCode: 'DVI9432973031240',
        deviceId: 'MZS120.54599538_32.02837993_1',
        id: 'c6ae8d58-a506-4acc-ad86-998db55195a3',
        ifDealt: 0,
        threeDiff: 51.4255215,
        warnTime: dayjs().subtract(3, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    },
    // {
    //     deviceCode: 'DVI3010425438293',
    //     deviceId: 'MZS120.51967889_32.04004108_4',
    //     id: 'c6ae8d58-a506-4acc-ad86-998db55195a4',
    //     ifDealt: 0,
    //     threeDiff: 31.4255215,
    //     warnTime: dayjs().subtract(38, 'second').format('YYYY-MM-DD HH:mm:ss'),
    // },
    // {
    //     deviceCode: 'DVI3010425438293',
    //     deviceId: 'MZS120.541648_32.030524_2',
    //     id: 'c6ae8d58-a506-4acc-ad86-998db55195a5',
    //     ifDealt: 0,
    //     threeDiff: 31.4255215,
    //     warnTime: dayjs().subtract(1, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    // },
]

export { mapInit, removeWarningDeviceStyle, setWarningDeviceStyle, typeList }
