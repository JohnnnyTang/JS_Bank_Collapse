import BackEndRequest from '../../api/backend'
import { DataPioneer } from '../dataVisual/Scene'
import { pulsing, loadImage } from '../../utils/mapUtils'
import mapboxgl from 'mapbox-gl'
// import MultiChart from '../dataVisual/monitorDevice/MultiChart.vue'
import monitorDetailV2 from '../dataVisual/featureDetails/monitorDetailV2.vue'
import warningPop from '../bankTwin/warningPop.vue'
import { ref, createApp, h } from 'vue'
import axios from 'axios'
import { useSceneStore } from '../../store/mapStore'
import { ElMessageBox, ElMessage } from 'element-plus'

const propertyRef = ref({})
const zoomRef = ref()



const mapInit = async (map, vis) => {

    const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
    console.log(tileServer);

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
    map.addSource('mzsBankLabelSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsBankLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankLineSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsSectionLineSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsSectionLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsSectionLineLabelSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsSectionLineLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankAreaWSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsBankAreaW/{x}/{y}/{z}',
        ],
    })
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
        },
        paint: {
            'text-color': 'rgba(31, 14, 126, 0.75)',
        },
    })
    map.addLayer({
        id: 'mzsSectionArea1',
        type: 'fill',
        source: 'mzsBankAreaSSource',
        'source-layer': 'default',
        paint: {
            'fill-color': [
                'match',
                ['get', 'stability'],
                '稳定',
                '#18b915',
                '较稳定',
                '#06bef1',
                '较不稳定',
                '#df8105',
                '不稳定',
                '#ee3603',
                '#18b915',
            ],
        },
    })
    map.addLayer({
        id: 'mzsSectionArea2',
        type: 'fill',
        source: 'mzsBankAreaWSource',
        'source-layer': 'default',
        paint: {
            'fill-color': [
                'match',
                ['get', 'warn'],
                '正常',
                '#18b915',
                '关注',
                'rgba(131, 14, 223, 0.5)',
                '预警',
                'rgba(221, 224, 23, 0.5)',
                '警告',
                'rgba(221, 24, 23, 0.5)',
                '#18b915',
            ],
        },
    })
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
        },
    })
    map.addLayer({
        id: 'mzsSectionLine',
        type: 'line',
        source: 'mzsSectionLineSource',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(11, 214, 223, 0.75)',
            'line-width': 4,
        },
    })
    map.addLayer({
        id: 'mzsBankLabel',
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
            'text-color': 'rgba(231, 214, 86, 0.9)',
        },
    })
    map.addLayer({
        id: 'mzsSectionLabel',
        type: 'symbol',
        source: 'mzsSectionLineLabelSource',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'bottom',
        },
        paint: {
            'text-color': 'rgba(81, 154, 86, 0.9)',
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
        map.addImage(
            pulsingMap['测斜仪'],
            pulsing[pulsingCVSMap['测斜仪']],
            {
                pixelRatio: 1,
            },
        )
        map.addImage(
            pulsingMap['孔隙水压力计'],
            pulsing[pulsingCVSMap['孔隙水压力计']],
            {
                pixelRatio: 1,
            },
        )
        map.addImage(
            pulsingMap['应力桩'],
            pulsing[pulsingCVSMap['应力桩']],
            {
                pixelRatio: 1,
            },
        )


        //////////////monitor device////////////
        let monitorInfo = (await BackEndRequest.getMonitorInfo()).data
        let monitorDevice = DataPioneer.generateGeoJson(
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

        // image source

        await loadImage(map, '/geoStyle/gnss-dot.png', 'gnss-static')
        await loadImage(map, '/geoStyle/incline-rect.png', 'incline-static')
        await loadImage(map, '/geoStyle/manometer-dia.png', 'manometer-static')
        await loadImage(map, '/geoStyle/stress-tri.png', 'stress-static')

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
        map.addLayer({
            id: '应力桩',
            type: 'symbol',
            source: 'stress-source',
            layout: {
                'icon-image': 'stress-static',
                'icon-size': 0.3,
                'icon-allow-overlap': true,
            },
        })

        let deviceLayers = ['GNSS', '测斜仪', '孔隙水压力计', '应力桩']

        map.on('click', deviceLayers, (e) => {
            console.log(e.features);
            if (e.features.length > 1)
                open(e.features, map)
            else if (e.features.length === 1) {
                let p = e.features[0].properties
                const property = e.features[0].properties
                useSceneStore().setSelectedFeature(property)

                propertyRef.value = property
                console.log(propertyRef.value);
                const popUp = createPopUp(propertyRef, zoomRef)
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


        warnInterval(map, 20)
        setInterval(() => {
            warnInterval(map, 60)
        }, 60 * 1000 * 20);
        // request per 20minutes 


        ///////DEBUG////////
        window.addEventListener('keydown', (e) => {
            if (e.key === '3') {
                setWarningDeviceStyle(map, '测斜仪', "MZS120.51749021_32.04053105_4")
            }
            if (e.key === '1') {
                setWarningDeviceStyle(map, 'GNSS', "MZS120.51977143_32.04001152_1")
            }
            if (e.key === '2') {
                setWarningDeviceStyle(map, '孔隙水压力计', "MZS120.51957026_32.04008655_3")
            }
            if (e.key === '4') {
                removeWarningDeviceStyle(map, '测斜仪', "MZS120.51749021_32.04053105_4")
            }
            if (e.key === '5') {
                removeWarningDeviceStyle(map, 'GNSS', "MZS120.51977143_32.04001152_1")
            }
            if (e.key === '6') {
                removeWarningDeviceStyle(map, '孔隙水压力计', "MZS120.52566826_32.03799363_3")
            }

            if (e.key == '7') {
                const popup = createWarningPopup({ a: 'a' })
                popup.setLngLat([115, 35]).addTo(map)

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

    // chart
    // const popUp = createPopUp(propertyRef)
    // popUp.setLngLat([property.longitude, property.latitude]).addTo(map)

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
    const componentInstance = ap.mount(container)

    const domwithComp = container
    const popUp = new mapboxgl.Popup({
        maxWidth: '1000px',
        offset: 25,
    }).setDOMContent(domwithComp)
    return popUp
}


const createWarningPopup = (info) => {
    const ap = createApp(warningPop, { warningInfo: info })

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
        if (type != 4) {
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


    if (lastPos) {
        map.flyTo({
            center: lastPos,
            pitch: 61.99999999999988,
            bearing: 0,
            zoom: 15.845427972376211,
            speed: 0.5,
            essential: true,
        })
    }
}


const open = (features, map) => {
    const items = features
    const selectedDevice = ref({})
    let selectedCode


    const radioGroupVNode = h('div', items.map(item => {
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
                                selectedCode = event.target.value
                            }
                        }),
                        h('span', {}, item.properties.name + '-' + item.properties.code)
                    ]
                )
            ]
        );
    }));

    ElMessageBox.confirm(
        '该区域有多台设备，请选择目标设备',
        {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            message: radioGroupVNode
        }
    )
        .then(() => {
            console.log(selectedCode)
            ElMessage({
                type: 'info',
                message: '加载设备详情',
            })
            debugger
            let targetProperty
            for (let i = 0; i < items.length; i++) {
                if (items[i].properties.code === selectedCode) {
                    targetProperty = items[i].properties
                }
            }
            console.log(targetProperty);

            useSceneStore().setSelectedFeature(targetProperty)
            propertyRef.value = targetProperty
            const popUp = createPopUp(propertyRef, zoomRef)
            popUp.setOffset(0).setLngLat([targetProperty.longitude, targetProperty.latitude]).addTo(map)

        })
        .catch((action) => {
            ElMessage({
                type: 'info',
                message: '取消'
            })
        })
}



export { mapInit }
