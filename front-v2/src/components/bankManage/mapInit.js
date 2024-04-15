import BackEndRequest from "../../api/backend"
import { DataPioneer } from "../dataVisual/Scene"
import { pulsing, loadImage } from "../../utils/mapUtils"
import mapboxgl from "mapbox-gl"
import MultiChart from "../dataVisual/monitorDevice/MultiChart.vue"
import { ref, createApp } from 'vue'


const propertyRef = ref({});

const mapInit = async (map) => {
    map.addSource('mzsPlaceLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsPlaceLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsPlaceLineSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsPlaceLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsBankLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankLineSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsBankLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsSectionLineSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsSectionLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsSectionLineLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsSectionLineLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankAreaWSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsBankAreaW/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankAreaSSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsBankAreaS/{x}/{y}/{z}',
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
            'fill-color': 'rgba(233, 23, 86, 0.6)',
        },
    })
    map.addLayer({
        id: 'mzsSectionArea2',
        type: 'fill',
        source: 'mzsBankAreaWSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(233, 233, 86, 0.6)',
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

    await loadImage(map, './geoStyle/gnss-dot.png', 'gnss-static')
    await loadImage(map, './geoStyle/incline-rect.png', 'incline-static')
    await loadImage(map, './geoStyle/manometer-dia.png', 'manometer-static')
    await loadImage(map, './geoStyle/stress-tri.png', 'stress-static')

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

    let deviceLayers = ['GNSS',
        '测斜仪',
        '孔隙水压力计',
        '应力桩',]


    map.on('click', deviceLayers, (e) => {
        console.log(e.features[0].properties);
        let p = e.features[0].properties
        const property = e.features[0].properties
        propertyRef.value = property
        const popUp = createPopUp(propertyRef)
        popUp.setOffset(0).setLngLat([p.longitude, p.latitude]).addTo(map)


    })
    map.on('mousemove', deviceLayers, (e) => {
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', deviceLayers, (e) => {
        map.getCanvas().style.cursor = ''
    })


    //"MZS120.529408_32.033683_1"  gnss
    //"MZS120.528701_32.034685_2" 测斜仪
    //"MZS120.530415_32.033657_4" 应力桩
    //"MZS120.531984_32.032682_3" 孔隙水压力计


    setTimeout(()=>{
        setWarningDeviceStyle(map, 'GNSS', "MZS120.529408_32.033683_1")

    },4000)

///////DEBUG////////
    // window.addEventListener('keydown', (e) => {
    //     if (e.key === '1') {
    //         setWarningDeviceStyle(map, '测斜仪', "MZS120.528701_32.034685_2")
    //     }
    //     if (e.key === '2') {
    //         setWarningDeviceStyle(map, 'GNSS', "MZS120.529408_32.033683_1")
    //     }
    //     if (e.key === '3') {
    //         setWarningDeviceStyle(map, '孔隙水压力计', "MZS120.531984_32.032682_3")
    //     }
    //     if (e.key === '4') {
    //         setWarningDeviceStyle(map, '应力桩', "MZS120.530415_32.033657_4")
    //     }
    //     if (e.key === '5') {
    //         removeWarningDeviceStyle(map, '测斜仪', "MZS120.528701_32.034685_2")
    //     }
    //     if (e.key === '6') {
    //         removeWarningDeviceStyle(map, 'GNSS', "MZS120.529408_32.033683_1")
    //     }
    //     if (e.key === '7') {
    //         removeWarningDeviceStyle(map, '孔隙水压力计', "MZS120.531984_32.032682_3")
    //     }
    //     if (e.key === '8') {
    //         removeWarningDeviceStyle(map, '应力桩', "MZS120.530415_32.033657_4")
    //     }
    // })


}

const setWarningDeviceStyle = (map, deviceLayer, deviceCode) => {

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
    const sourceMap = {
        'GNSS': 'gnss-source',
        '测斜仪': 'incline-source',
        '孔隙水压力计': 'manometer-source',
        '应力桩': 'stress-source',
    }

    !map.hasImage(pulsingMap[deviceLayer]) &&
        map.addImage(pulsingMap[deviceLayer], pulsing[pulsingCVSMap[deviceLayer]], {
            pixelRatio: 1,
        })
    !map.getLayer(`${deviceLayer}-${deviceCode}`) &&
        map.addLayer({
            id: `${deviceLayer}-${deviceCode}`,
            type: 'symbol',
            source: sourceMap[deviceLayer],
            layout: {
                'icon-image': pulsingMap[deviceLayer],
                'icon-size': 1,
                'icon-allow-overlap': true,
            },
            filter: ['==', 'code', deviceCode]
        })

    let property = findProptyFromJson(map.getSource(sourceMap[deviceLayer])['_data'], deviceCode)
    propertyRef.value = property
    const popUp = createPopUp(propertyRef)
    popUp.setLngLat([property.longitude, property.latitude]).addTo(map)

    
    map.flyTo({
        center: [property.longitude, property.latitude],
        pitch: 61.99999999999988,
        bearing: 0,
        zoom: 15.845427972376211,
        speed: 0.5,
        essential: true,
    })

    map.on('render', () => {
        map.triggerRepaint();
    })
}

const removeWarningDeviceStyle = (map, deviceLayer, deviceCode) => {
    map.getLayer(`${deviceLayer}-${deviceCode}`) && map.removeLayer(`${deviceLayer}-${deviceCode}`)
}

const createPopUp = (deviceProperty) => {
    const ap = createApp(MultiChart, { selectedFeature: deviceProperty })

    const container = document.createElement('div')
    const componentInstance = ap.mount(container)

    const domwithComp = container
    const popUp = new mapboxgl.Popup({
        maxWidth: '1000px',
        offset: 25,
    }).setDOMContent(domwithComp)
    // .setLngLat(popupCoord)
    // .addTo(map); undefined;
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



export { mapInit }
