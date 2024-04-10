<template>
    <div>
        <div id="map" ref="mapref"></div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { initScratchMap, initMap, ScratchMap } from '../../utils/mapUtils'
import { onMounted, ref } from 'vue';
const mapref = ref()


const createEmptyMap = () => {
    const blankMapStyle = {
        "version": 8,
        "sources": {},
        "layers": []
    }
    const map = new mapboxgl.Map({
        container: mapref.value, // container ID
        accessToken:
            'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        // style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        style: blankMapStyle,
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 3, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })
    return map;
}

const createOfflineMap = () => {
    const offlineMapStyle = {
        "version": 8,
        "sources": {
            "offline-tiles": {
                type: 'vector',
                tiles: [
                    'http://127.0.0.1:9000/2020-10-planet-14.mbtiles/{z}/{x}/{y}.pbf'
                ]
            }
        },
        "layers": [
            {
                'id': 'base',
                'type': 'fill',
                'source': 'offline-tiles',
                'source-layer': 'water',
                'layout': {},
                'paint': {
                    'fill-color': '#00A2FF',
                    'fill-opacity': 0.9
                }
            }
        ]
    }
    const map = new mapboxgl.Map({
        container: mapref.value, // container ID
        accessToken:
            'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        // style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        style: offlineMapStyle,
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 3, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })
    return map;
}

const addBackEndMVT = (map) => {
    map.addSource('river-terrain-source', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/riverBg/{x}/{y}/{z}',
        ],
    })
    map.addLayer({
        id: '全江地形',
        type: 'fill',
        source: 'river-terrain-source',
        'source-layer': 'default',
        paint: {
            'fill-color': [
                'match',
                ['get', 'height'],
                0,
                '#3EFA13',
                5,
                '#51E212',
                10,
                '#65CA11',
                15,
                '#78B210',
                20,
                '#8B9A0F',
                25,
                '#9F820F',
                30,
                '#B26A0E',
                35,
                '#C5520D',
                40,
                '#C5520D',
                45,
                '#D83A0C',
                50,
                '#EC220B',
                '#000000'
            ],
            // 'fill-color': '#3EFA13'
        },
    })
    map.addSource('riverSectionLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/riverSection/{x}/{y}/{z}',
        ],
    })
    map.addSource('riverLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/riverName/{x}/{y}/{z}',
        ],
    })
    map.addLayer({
        id: 'riverSectionLabel',
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
    map.addLayer({
        id: 'riverLabel',
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
}

const addOfflineBase = (map) => {

    map.addSource('offlineBase', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:9000/2020-10-planet-14.mbtiles/{z}/{x}/{y}.pbf'
        ]
    })
    map.addLayer({
        'id': 'base',
        'type': 'fill',
        'source': 'offlineBase',
        'source-layer': 'water',
        'layout': {},
        'paint': {
            'fill-color': '#0000ff',
            'fill-opacity': 0.6
        }
    })
}

onMounted(() => {
    console.log('onMounted');
    // const map = createEmptyMap()
    // map.on('load', () => {
    //     console.log('map loaded');
    //     addOfflineBase(map)
    //     addBackEndMVT(map)
    // })

    const map = createOfflineMap()
    map.on('load', () => {
        console.log('map loaded');
        // addBackEndMVT(map)
    })


})

</script>

<style lang="scss" scoped>
#map {
    position: absolute;
    height: 92vh;
    width: 100vw;
}
</style>