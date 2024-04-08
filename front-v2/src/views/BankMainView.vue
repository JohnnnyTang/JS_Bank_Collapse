<template>
    <div class="bank-main-container" ref="containerDom">
        <div id="map" class="map-container"></div>
        <TickClockVue />
        <div class="basemap-radio-container">
            <input type="radio" id="radio-1" name="tabs" checked />
            <label class="tab" for="radio-1">天地图</label>
            <input type="radio" id="radio-2" name="tabs" />
            <label class="tab" for="radio-2">OSM</label>
            <!-- <input type="radio" id="radio-3" name="tabs" />
            <label class="tab" for="radio-3">Completed</label> -->
            <span class="glider"></span>
        </div>
        <BankTableVue />
        <WarnNoticeVue />
        <RealtimeRiskVue />
        <StableStatusVue />
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import StableStatusVue from '../components/bankMain/StableStatus.vue'
import TickClockVue from '../components/bankMain/TickClock.vue'
import RealtimeRiskVue from '../components/bankMain/RealtimeRisk.vue'
import BankTableVue from '../components/bankMain/BankTable.vue'
import WarnNoticeVue from '../components/bankMain/WarnNotice.vue'

mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'

const containerDom = ref(null)
let map = null

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [117.64643582916999, 30.990467310895838],
            [122.59492087941601, 32.80937651942584],
        ],
        {
            pitch: 49.45,
            duration: 800,
            // zoom: 8,
        },
    )
}

const resizeObserver = new ResizeObserver((entries) => {
    mapFlyToRiver(map)
})

onMounted(() => {
    map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 3, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })

    map.on('load', () => {
        // console.log('map loaded!!!')
        mapFlyToRiver(map)
        map.addSource('mapVector', {
            type: 'vector',
            tiles: [
                // 'http://127.0.0.1:8989/api/v1/tile/vector/contour/2021/before/{x}/{y}/{z}',
                // 'http://127.0.0.1:8989/api/v1/tile/vector/contour/2022/before/{x}/{y}/{z}',
                // 'http://127.0.0.1:8989/api/v1/tile/vector/contour/2023/before/{x}/{y}/{z}',
                // 'http://127.0.0.1:8989/api/v1/tile/vector/contour/2020/before/{x}/{y}/{z}',
                // 'http://127.0.0.1:8989/api/v1/tile/vector/contour/2020/after/{x}/{y}/{z}',
                // 'http://127.0.0.1:8989/api/v1/tile/vector/contour/2021/after/{x}/{y}/{z}',
                'http://127.0.0.1:8989/api/v1/tile/vector/contour/2022/after/{x}/{y}/{z}',
            ],
        })
        map.addSource('depthLineSource', {
            type: 'vector',
            tiles: [
                // 'http://127.0.0.1:8989/api/v1/tile/vector/depthLine/1999/{x}/{y}/{z}',
                // 'http://127.0.0.1:8989/api/v1/tile/vector/depthLine/2004/{x}/{y}/{z}',
                // 'http://127.0.0.1:8989/api/v1/tile/vector/depthLine/2006/{x}/{y}/{z}',
                // 'http://127.0.0.1:8989/api/v1/tile/vector/depthLine/2015/{x}/{y}/{z}',
                'http://127.0.0.1:8989/api/v1/tile/vector/depthLine/2017/{x}/{y}/{z}',
            ],
        })
        map.addSource('riverSectionLabelSource', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/riverSection/{x}/{y}/{z}',
            ],
        })
        map.addSource('riverBg', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/riverBg/{x}/{y}/{z}',
            ],
        })
        map.addSource('riverLand', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/riverLand/{x}/{y}/{z}',
            ],
        })
        map.addSource('ptVector', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/placeLabel/{x}/{y}/{z}',
            ],
        })
        map.addSource('riverLabelSource', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/riverName/{x}/{y}/{z}',
            ],
        })

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
            id: '线1',
            type: 'line',
            source: 'mapVector',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(255, 214, 211, 0.5)',
                'line-width': 4,
            },
        })
        
        map.addLayer({
            id: 'fill1',
            type: 'fill',
            source: 'riverBg',
            'source-layer': 'default',
            paint: {
                'fill-color': 'rgba(13, 22, 189, 0.5)',
            },
        })
        map.addLayer({
            id: 'land1',
            type: 'fill',
            source: 'riverLand',
            'source-layer': 'default',
            paint: {
                'fill-color': 'rgba(23, 214, 86, 0.5)',
            },
        })
        map.addLayer({
            id: '点1',
            type: 'symbol',
            source: 'ptVector',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'left',
            },
            paint: {
                'text-color': 'rgba(255, 214, 211, 0.75)',
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
                'text-color': 'rgba(13, 22, 189, 0.8)',
            },
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
        map.addSource('mapRaster', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.509, 32.023, 120.555, 32.0402],
        })
        map.addSource('mapRaster1', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2020/After/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.514, 32.0236, 120.555, 32.0391],
        })
        map.addSource('mapRaster2', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2021/Before/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.5116, 32.02316, 120.555, 32.0402],
        })
        map.addSource('mapRaster3', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2021/After/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.5097, 32.02409, 120.555, 32.0402],
        })
        map.addSource('mapRaster4', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2022/Before/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.51, 32.02, 120.552, 32.04046],
        })
        map.addSource('mapRaster5', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2022/After/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.50998, 32.02379, 120.5548, 32.04148],
        })
        map.addSource('mapRaster6', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2023/Before/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.50548, 32.0224, 120.55304, 32.0415],
        })
        map.addLayer({
            id: '深泓线',
            type: 'line',
            source: 'depthLineSource',
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

        // 0408
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
                'line-color': 'rgba(26, 87, 138, 0.9)',
                'line-width': 3,
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
                'text-color': 'rgba(231, 214, 86, 0.9)',
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
                'line-color': 'rgba(231, 214, 223, 0.9)',
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
                'line-color': 'rgba(11, 214, 223, 0.9)',
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
                'text-color': 'rgba(231, 214, 126, 0.9)',
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
                'text-anchor': 'left',
            },
            paint: {
                'text-color': 'rgba(121, 214, 126, 0.9)',
            },
        })
        // map.addLayer({
        //     id: 'ras',
        //     type: 'raster',
        //     source: 'mapRaster6',
        // })
        map.on('click', (e) => {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['land1', 'fill1'],
            })
            console.log(features)
        })
        resizeObserver.observe(containerDom.value)
    })
})

onUnmounted(() => {
    resizeObserver.disconnect()
    // resizeObserver.unobserve(containerDom.value)
    console.log('onUnmounted')
    map && map.remove()
    console.log('map.remove')
})
</script>

<style lang="scss" scoped>
$shadow: #6b94e0;

@keyframes flip-card {
    0% {
        transform: perspective(2500px) rotateY(0deg);
    }
    50% {
        transform: perspective(2500px) rotateY(90deg);
    }
    100% {
        transform: perspective(2500px) rotateY(0deg);
    }
}

div.bank-main-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    overflow: hidden;

    background-color: rgb(215, 231, 250);

    div.map-container {
        width: 100vw;
        height: 92vh;
    }

    div.basemap-radio-container {
        position: absolute;
        right: 1vw;
        top: 3vh;

        width: 10vw;
        height: 3vh;
        display: flex;
        flex-flow: row nowrap;
        background-color: #fff;
        box-shadow:
            0 0 4px 1px rgba(#0642b1, 0.55),
            0 6px 12px 0 rgba(#0642b1, 0.55);
        padding: 0.6vh;
        border-radius: 0.6vw; // just a high number to create pill effect
        * {
            z-index: 6;
        }

        input[type='radio'] {
            display: none;
        }

        .tab {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 3vh;
            width: 5vw;
            font-size: calc(0.7vw + 0.2vh);
            font-weight: 600;
            border-radius: 1.6rem; // just a high number to create pill effect
            cursor: pointer;
            transition: color 0.15s ease-in;
        }

        input[type='radio'] {
            &:checked {
                & + label {
                    color: #185ee0;
                }
            }
        }

        input[id='radio-1'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(0);
                }
            }
        }

        input[id='radio-2'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(100%);
                }
            }
        }

        input[id='radio-3'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(200%);
                }
            }
        }

        .glider {
            position: absolute;
            display: flex;
            height: 3vh;
            width: 5vw;
            background-color: #bcd8fc;
            z-index: 5;
            border-radius: 0.6vw; // just a high number to create pill effect
            transition: 0.4s cubic-bezier(0.68, -0.25, 0.265, 1.25);
        }

        // @media (max-width: 700px) {
        //     .tabs {
        //         transform: scale(0.6);
        //     }
        // }
    }
}
</style>
