<template>

    <!-- <warningPop></warningPop> -->
    <div class="main">
        <div class="map" ref="mapDom"></div>
    </div>

</template>

<script setup>
import { onMounted, reactive, ref, watch, createApp } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios';
import monitorDetailV2 from './featureDetails/monitorDetailV2.vue';

import warningPop from '../bankTwin/warningPop.vue';

import { initLoadedMap, pulsing, loadImage } from '../../utils/mapUtils';
import { DataPioneer } from './Scene';
import { useSceneStore } from '../../store/mapStore';




const mapDom = ref()
const propertyRef = ref({})
const zoomRef = ref()

onMounted(async () => {
    const map = await initLoadedMap(mapDom)

    map.fitBounds([
        [120.46987922676836, 32.03201616423072],
        [120.61089640208264, 32.052171362618625],],
        {
            pitch: 52.45,
            duration: 1500,
        },
    )

    await initMonitoreDeviceData(map)
    addLayersAlogic(map)

})


const initMonitoreDeviceData = async (map) => {
    /////////////load source and img
    let monitorInfo = (await axios.get('/api/data/monitorInfo')).data
    console.log(monitorInfo);
    let monitorDevice = DataPioneer.generateGeoJson(
        monitorInfo,
        (element) => {
            return [element['longitude'], element['latitude']]
        },
        'Point',
    )
    const { gnss, incline, stress, manometer } = DataPioneer.getDifMonitorData(monitorDevice)
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
    await loadImage(map, '/geoStyle/gnss-dot.png', 'gnss-static')
    await loadImage(map, '/geoStyle/incline-rect.png', 'incline-static')
    await loadImage(map, '/geoStyle/manometer-dia.png', 'manometer-static')
    await loadImage(map, '/geoStyle/stress-tri.png', 'stress-static')
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
}

const addLayersAlogic = (map) => {
    //////// add layer
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


    ////////add interaction
    let deviceLayers = ['GNSS', '测斜仪', '孔隙水压力计', '应力桩']
    map.on('click', deviceLayers, (e) => {
    
        // clickPopup

        let p = e.features[0].properties
        const property = e.features[0].properties
        useSceneStore().setSelectedFeature(property)

        propertyRef.value = property
        console.log(propertyRef.value);
        const popUp = createPopUp(propertyRef, zoomRef)
        popUp.setOffset(0).setLngLat([p.longitude, p.latitude]).addTo(map)
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

    //warning popup
    warnInterval(map)
    setTimeout(() => {
        warnInterval(map)
    }, 50000);
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

const warnInterval = async (map) => {
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
    const requestTime = 20;

    let allWarnData = (await axios.get(`/api/data/deviceWarn/minute/${requestTime}`)).data

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

</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;




}



.map {
    position: relative;
    width: 100vw;
    height: 92vh;
}

:deep(.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip) {
    display: none;
}

:deep(.mapboxgl-popup-tip) {
    border: none;
}

:deep(.mapboxgl-popup-content) {
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
}

:deep(.mapboxgl-popup-close-button) {
    right: 5px;
    top: 5px;
    border: none;
}

:deep(.mapboxgl-popup-close-button){
    display: none;
}
</style>