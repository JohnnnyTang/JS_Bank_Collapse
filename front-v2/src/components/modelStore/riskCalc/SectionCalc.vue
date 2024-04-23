<template>
    <div
        class="section-choose-content model-item-content"
        ref="containerDom"
    >
        <div id="map" class="map-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'

const containerDom = ref()

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.47987922676836, 32.03001616423072],
            [120.59589640208264, 32.048171362618625],
        ],
        {
            pitch: 0,
            duration: 1500,
            // zoom: 8,
        },
    )
}

const resizeObserver = new ResizeObserver((entries) => {
    mapFlyToRiver(map)
})

let map = null

const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        line_string: true,
        trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    // defaultMode: '',
    styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
            id: 'gl-draw-line',
            type: 'line',
            filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['==', 'mode', 'draw_line_string'],
            ],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#D20C0C',
                'line-dasharray': [0.2, 2],
                'line-width': 2,
            },
        },
        // vertex point halos
        {
            id: 'gl-draw-polygon-and-line-vertex-halo-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['==', 'mode', 'draw_line_string'],
            ],
            paint: {
                'circle-radius': 5,
                'circle-color': '#FFF',
            },
        },
        // vertex points
        {
            id: 'gl-draw-polygon-and-line-vertex-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['==', 'mode', 'draw_line_string'],
            ],
            paint: {
                'circle-radius': 3,
                'circle-color': '#D20C0C',
            },
        },

        // INACTIVE (static, already drawn)
        // line stroke
        {
            id: 'gl-draw-line-static',
            type: 'line',
            filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'draw_line_string'],
            ],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#000',
                'line-width': 3,
            },
        },
    ],
})

onMounted(() => {
    map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.542, 32.036], // starting position [lng, lat]
        zoom: 7.8, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })

    map.on('load', () => {
        // console.log('map loaded!!!')
        mapFlyToRiver(map)

        resizeObserver.observe(containerDom.value)
        map.addSource('mzsOverWaterSource', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/mzsOverWaterBound/{x}/{y}/{z}',
            ],
        })
        map.addSource('mzsUnderWaterSource', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/mzsUnderWaterBound/{x}/{y}/{z}',
            ],
        })
        map.addLayer({
            id: 'mzsOverWaterBound',
            type: 'fill',
            source: 'mzsOverWaterSource',
            'source-layer': 'default',
            paint: {
                'fill-color': '#18b915',
                'fill-opacity': 0.5,
            },
        })
        // map.addLayer({
        //     id: 'mzsOverWaterBoundStroke',
        //     type: 'line',
        //     source: 'mzsOverWaterSource',
        //     'source-layer': 'default',
        //     paint: {
        //         'line-color': '#D20C0C',
        //         'line-opacity': 0.5,
        //     },
        // })
        map.addLayer({
            id: 'mzsUnderWaterBound',
            type: 'fill',
            source: 'mzsUnderWaterSource',
            'source-layer': 'default',
            paint: {
                'fill-color': '#df8105',
                'fill-opacity': 0.5,
            },
        })
        map.addControl(draw)

        // map.on('click', (e) => {
        //     console.log(e)
        // })

        map.on('draw.create', function (e) {
            console.log('aaa')
            console.log(e.features)
            // map.move(e.features.)
        })
    })
})
</script>

<style lang="scss" scoped>
div.model-item-content {
    height: 79vh;
    width: 75vw;

    background-color: #2a99c9;

    &.section-choose-content {
        div.map-container {
            width: 75vw;
            height: 79vh;
        }
    }
}
</style>
