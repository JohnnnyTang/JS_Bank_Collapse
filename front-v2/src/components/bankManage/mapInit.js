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

import { ref, createApp, h } from 'vue'
import axios from 'axios'
import { useSceneStore } from '../../store/mapStore'
import { ElMessageBox, ElMessage } from 'element-plus'
// import ElementPlus from "element-plus";


const propertyRef = ref({})
const zoomRef = ref()



const mapInit = async (map, vis) => {

    const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
    map.addSource('mzsPlaceLabelSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsPlaceLineSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('dockAreaSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/dockArea/{x}/{y}/{z}',
        ],
    })
    map.addSource('fixProjectAreaSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/fixProjectArea/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsSectionLabel', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/center/mzsBankLine/{x}/{y}/{z}'],
    })
    // map.addSource('mzsBankLabelSource', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/mzsBankLabel/{x}/{y}/{z}',
    //     ],
    // })
    map.addSource('mzsBankLineSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}',
        ],
    })
    // map.addSource('mzsSectionLineSource', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/mzsSectionLine/{x}/{y}/{z}',
    //     ],
    // })
    map.addSource('mzsSectionLineLabelSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsSectionLineLabel/{x}/{y}/{z}',
        ],
    })
    // map.addSource('mzsBankAreaWSource', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/mzsBankAreaW/{x}/{y}/{z}',
    //     ],
    // })
    map.addSource('mzsBankAreaSSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsBankAreaS/{x}/{y}/{z}',
        ],
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
            'fill-color': 'rgba(201,217,238, 0.8)',
            'fill-outline-color': 'rgba(201,217,238, 0.8)'
        },
    })
    map.addLayer({
        id: 'fixProjectLayer',
        type: 'fill',
        source: 'fixProjectAreaSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(20,74,197, 0.8)',
            'fill-outline-color': 'rgba(20,74,197, 0.8)'
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
            'line-dasharray': [1, 1.5]
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
            'text-size': 16,
            'text-allow-overlap': true
        },
        paint: {
            'text-color': 'rgb(0, 22, 145)',
        },
    })
    // map.addLayer({
    //     id: 'mzsSectionLine',
    //     type: 'line',
    //     source: 'mzsSectionLineSource',
    //     'source-layer': 'default',
    //     layout: {
    //         'line-cap': 'round',
    //         'line-join': 'round',
    //     },
    //     paint: {
    //         'line-opacity': 1,
    //         'line-color': 'rgba(11, 214, 223, 0.75)',
    //         'line-width': 4,
    //     },
    // })
    // map.addLayer({
    //     id: 'mzsBankLabel',
    //     type: 'symbol',
    //     source: 'mzsBankLabelSource',
    //     'source-layer': 'default',
    //     layout: {
    //         'text-field': ['get', 'label'],
    //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //         // 'text-offset': [0, 1.25],
    //         'text-anchor': 'left',
    //     },
    //     paint: {
    //         'text-color': 'rgba(231, 214, 86, 0.9)',
    //     },
    // })
    // map.addLayer({
    //     id: 'mzsSectionLabel',
    //     type: 'symbol',
    //     source: 'mzsSectionLineLabelSource',
    //     'source-layer': 'default',
    //     layout: {
    //         'text-field': ['get', 'label'],
    //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //         // 'text-offset': [0, 1.25],
    //         'text-anchor': 'bottom',
    //     },
    //     paint: {
    //         'text-color': 'rgba(81, 154, 86, 0.9)',
    //     },
    // })
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
            'text-size': 12
        },
        paint: {
            'text-color': 'rgba(31, 14, 126, 0.8)',
        },
    })

    if (vis) {

        const pulsingCVSMap = {
            'GNSS': 'point',
            '测斜仪': 'rectangle',
            '孔隙水压力计': 'diamond',
            '应力桩': 'triangle',
        }
        const pulsingMap = {
            'GNSS': 'gnss-dot-pulsing',
            '测斜仪': 'incline-dot-pulsing',
            '孔隙水压力计': 'manometer-dot-pulsing',
            '应力桩': 'stress-dot-pulsing',
        }
        map.addImage(
            pulsingMap['GNSS'],
            pulsing[pulsingCVSMap['GNSS']],
            {
                pixelRatio: 1,
            },
        )
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
        let monitorDevice = DataPioneer.generateGeoJson(
            monitorInfo,
            (element) => {
                return [element['longitude'], element['latitude']]
            },
            'Point',
        )
        const { gnss, incline, stress, manometer, camera, gnssJZ } =
            DataPioneer.getDifMonitorData(monitorDevice)
        console.log('监测站！', gnssJZ);
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
            id: '监控摄像头',
            type: 'symbol',
            source: 'camera-source',
            layout: {
                'icon-image': 'camera-static',
                'icon-size': 0.2,
                'icon-allow-overlap': true,
            },
        })

        let deviceLayers = ['GNSS', '测斜仪', '孔隙水压力计', '应力桩']

        map.on('click', deviceLayers, (e) => {
            if (e.features.length > 1) {
                console.log('click features!', e.features);
                open(e.features, map)
            }
            else if (e.features.length === 1) {
                let p = e.features[0].properties
                const property = e.features[0].properties
                useSceneStore().setSelectedFeature(property)
                propertyRef.value = property
                console.log('click feature!', propertyRef.value);
                const popUp = createPopUp(propertyRef, zoomRef)
                popUp.setOffset(0).setLngLat([p.longitude, p.latitude]).addTo(map)
                console.log('singgle popUp added!');

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

        setTimeout(() => {
            warnInterval(map, 60)
        }, 500)
        setInterval(() => {
            warnInterval(map, 60)
        }, 60 * 1000 * 20);
        // request per 20minutes 

        ///////DEBUG////////
        window.addEventListener('keydown', async (e) => {
            if (e.key == 'Enter') {
                const minute = 720
                let allWarnData = (await axios.get(`/api/data/deviceWarn/minute/${minute}`)).data

                let lastPos
                allWarnData.forEach((item) => {
                    let id = item.deviceId
                    let type = 'GNSS'
                    lastPos = setWarningDeviceStyle(map, type, id, item)
                })
                if (allWarnData.length != 0)
                    useWarnInfoStore().warnInfo = allWarnData

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

                // setTimeout(() => {
                //     allWarnData.forEach((item) => {
                //         let id = item.deviceId
                //         let type = 'GNSS'
                //         removeWarningDeviceStyle(map, type, id)
                //     })
                // }, 2000)
            }
        })


    }
}

const setWarningDeviceStyle = (map, deviceLayer, deviceCode, warnData) => {

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

    const sourceMap = {
        GNSS: 'gnss-source',
        测斜仪: 'incline-source',
        孔隙水压力计: 'manometer-source',
        应力桩: 'stress-source',
    }
    if (!map.getLayer(`${deviceLayer}-${deviceCode}`)) {
        map.addLayer({
            id: `${deviceLayer}-${deviceCode}`,
            type: 'symbol',
            source: sourceMap[deviceLayer],
            layout: {
                'icon-image': pulsingMap[deviceLayer],
                'icon-size': 1,
                'icon-allow-overlap': true,
            },
            filter: ['==', 'code', deviceCode],
        })
    }
    let json = map.getSource(sourceMap[deviceLayer])['_data']

    let property = findProptyFromJson(
        json,
        deviceCode
    )
    propertyRef.value = property

    // warning
    const popup = createWarningPopup({ warningInfo: warnData })
    popup.setLngLat([property.longitude, property.latitude]).addTo(map)


    map.on('render', () => {
        map.triggerRepaint()
    })
    return [property.longitude, property.latitude]
}

const removeWarningDeviceStyle = (map, deviceLayer, deviceCode) => {
    map.getLayer(`${deviceLayer}-${deviceCode}`) &&
        map.removeLayer(`${deviceLayer}-${deviceCode}`)
}

const createPopUp = (deviceProperty, zoom) => {
    const ap = createApp(monitorDetailV2, { deviceInfo: deviceProperty, zoom })

    const container = document.createElement('div')
    container.id = 'monitorDetailV2-div'
    const componentInstance = ap.mount(container)
    console.log('VueComponent Mounted');



    const domwithComp = container
    const popUp = new mapboxgl.Popup({
        maxWidth: '1000px',
        offset: 25,
    }).setDOMContent(domwithComp)
    return popUp
}


const createWarningPopup = (info) => {
    // const ap = createApp(warningPop, { warningInfo: info })
    const ap = createApp(warningPopup)

    const container = document.createElement('div')
    const componentInstance = ap.mount(container)

    const domwithComp = container
    const popUp = new mapboxgl.Popup({
        maxWidth: '1000px',
        offset: 25,
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
        'GNSS': [],
        '测斜仪': [],
        '水压力计': [],
        '应力桩': [],
    }
    let deviceInfo = (await axios.get('/api/data/monitorInfo')).data
    deviceInfo.forEach((item) => {
        const type = Number(item["type"]) - 1

        if (type != 4 && type != 5) {
            // camera -- 5
            DeviceIDs[DEVICETYPEMAP[type]].push(item["code"])
        }
    })

    let allWarnData = (await axios.get(`/api/data/deviceWarn/minute/${minute}`)).data

    let lastPos
    allWarnData.forEach((item) => {
        let id = item.deviceId
        let type = 'GNSS'
        lastPos = setWarningDeviceStyle(map, type, id, item)
    })
    if (allWarnData.length != 0)
        useWarnInfoStore().warnInfo = allWarnData
    console.log('first-warnInterval!', allWarnData);


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

    const radioGroupVNode = h('div', { class: 'container' }, [
        h('div', { class: 'title' }, '选择设备'),
        items.map(item => {
            return h(
                'div',
                {
                    key: item.properties.machineId,
                    class: 'block',
                },
                [
                    h('label', { class: 'label' },
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
                            h('span', { class: 'text' }, DEVICETYPEMAP[Number(item.properties.type) - 1] + '（' + deviceNameMap[DEVICETYPEMAP[Number(item.properties.type) - 1]][item.properties.code] + '）')
                        ]
                    )
                ]
            );
        })
    ]);

    ElMessageBox.confirm(
        '',
        {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            message: radioGroupVNode,
            'customClass': 'choice-box'
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

            useSceneStore().setSelectedFeature(targetProperty)
            propertyRef.value = targetProperty
            const popUp = createPopUp(propertyRef, zoomRef)
            popUp.setOffset(0).setLngLat([targetProperty.longitude, targetProperty.latitude]).addTo(map)

            let dom = document.getElementById('popup')

        })
        .catch((action) => {
            ElMessage({
                type: 'info',
                message: '取消'
            })
        })
}

const deviceNameMap = {
    'GNSS': {
        'MZS120.51749289_32.04059243_1': 'CL-01',
        'MZS120.51977143_32.04001152_1': 'CL-02',
        'MZS120.52557975_32.03825056_1': 'CL-03',
        'MZS120.52660704_32.03676583_1': 'CL-04',
        'MZS120.53334877_32.03227055_1': 'CL-05',
        'MZS120.54599538_32.02837993_1': 'CL-06',
        'MZS120.55327892_32.02707923_1': 'CL-07',
        'MZS120.55649757_32.02592404_1': 'CL-08',
        'MZS120.56334257_32.02298144_1': 'CL-09',
        'MZS120.56944728_32.02070961_1': 'CL-10'
    },
    '水压力计': {
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
    '测斜仪': {
        'MZS120.51967889_32.04004108_4': 'CX-01',
        'MZS120.51986665_32.03998992_4': 'CX-02',
        'MZS120.52557975_32.03825056_4': 'CX-03',
        'MZS120.52565217_32.03813574_4': 'CX-04',
        'MZS120.52566826_32.03799363_4': 'CX-05',
        'MZS120.51726088_32.04054582_4': 'CX-06',
        'MZS120.51738292_32.04054923_4': 'CX-07',
        'MZS120.51749021_32.04053105_4': 'CX-08',
        'MZS120.51957026_32.04008655_4': 'CX-09'
    },
    '应力桩': {
        'MZS120.513203_32.042733_2': 'YL-01',
        'MZS120.515433_32.04231_2': 'YL-02',
        'MZS120.521221_32.040331_2': 'YL-03',
        'MZS120.529078_32.034385_2': 'YL-04',
        'MZS120.541648_32.030524_2': 'YL-05',
        'MZS120.548925_32.029361_2': 'YL-06',
        'MZS120.552209_32.028149_2': 'YL-07'
    },
}

export { mapInit }
