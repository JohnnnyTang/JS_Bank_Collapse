<template>
    <div class="main">
        <div class="map" ref="mapDom" id="map">
        </div>
        <!-- <div class="color-band">
            <div class="color-section">
                <div class="color-text">0m</div>
            </div>
            <div class="color-section">
                <div class="color-text">10</div>
            </div>
            <div class="color-section">
                <div class="color-text">13.5</div>
            </div>
            <div class="color-section">
                <div class="color-text">15</div>
            </div>
            <div class="color-section">
                <div class="color-text">20</div>
            </div>
            <div class="color-section">
                <div class="color-text">30</div>
            </div>
            <div class="color-section">
                <div class="color-text">60</div>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { initMap, loadImage } from '../../utils/mapUtils';
import { onMounted, watch, ref } from 'vue';
import axios from 'axios';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const mapDom = ref()

onMounted(async () => {


    const map = await initMap(mapDom.value)

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
                    0, '#0099FF',    // 草绿色
                    2, '#78B766',   // R120 G183 B102
                    5, '#27C731',   // 春绿色
                    8, '#99CC33',   // 火星绿
                    10, '#CCCC33',  // 香蕉黄
                    11, '#D9D97A',  // R230 G230 B128
                    13, '#FFFF99',  // 粉笔色
                    13.5, '#FFFFFF',
                    15, '#99FFFF',  // 冰蓝色
                    16, '#0000FF',  // 天蓝色
                    20, '#6699FF',  // 淡蓝色
                    30, '#0096FF',
                    60, '#0057DF',
                    Infinity, '#000000'
                ],
            },
        })

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
                'fill-color': '#CC8800',
            },
        })

    map.on('click',['沙岛'],(e)=>{
        console.log(e.features[0]);
    })

    // !map.getSource('importantBank') &&
    //     map.addSource('importantBank', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/importantBank/{x}/{y}/{z}',
    //         ],
    //     })

    // map.addLayer({
    //     id: '岸段-注记',
    //     type: 'symbol',
    //     source: 'importantBank',
    //     minzoom: 11,
    //     maxzoom: 18,
    //     'source-layer': 'default',
    //     layout: {
    //         'text-field': ['get', 'bank_name'],
    //         'symbol-placement': 'line',
    //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //         'text-anchor': 'top',
    //     },
    //     paint: {
    //         'text-color': '#232323',
    //     },
    // })


    // !map.getLayer('一级预警岸段') &&
    //     map.addLayer({
    //         id: '一级预警岸段',
    //         type: 'line',
    //         source: 'importantBank',
    //         'source-layer': 'default',
    //         layout: {
    //         },
    //         filter: ["==", "warning_level", 1],
    //         paint: {
    //             'line-color': '#B11717',
    //             'line-width': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0.5],
    //                 10, ["literal", 3.0],
    //                 13, ["literal", 7.0]
    //             ],
    //         },
    //     })
    // !map.getLayer('二级预警岸段') &&
    //     map.addLayer({
    //         id: '二级预警岸段',
    //         type: 'line',
    //         source: 'importantBank',
    //         'source-layer': 'default',
    //         layout: {
    //             // 'line-cap': 'round',
    //             // 'line-join': 'round',
    //         },
    //         filter: ["==", "warning_level", 2],
    //         paint: {
    //             // 'line-opacity': 1,
    //             'line-color': '#B14D17',
    //             'line-width': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0.5],
    //                 10, ["literal", 3.0],
    //                 13, ["literal", 7.0]
    //             ],

    //         },
    //     })
    // !map.getLayer('三级预警岸段') &&
    //     map.addLayer({
    //         id: '三级预警岸段',
    //         type: 'line',
    //         source: 'importantBank',
    //         'source-layer': 'default',
    //         layout: {
    //             // 'line-cap': 'round',
    //             // 'line-join': 'round',
    //         },
    //         filter: ["==", "warning_level", 3],
    //         paint: {
    //             // 'line-opacity': 1,
    //             'line-color': '#B18A17',
    //             'line-width': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0.5],
    //                 10, ["literal", 3.0],
    //                 13, ["literal", 7.0]
    //             ],
    //         },
    //     })


    // !map.getSource('riverBankLine') &&
    //     map.addSource('riverBankLine', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/riverBankLine/{x}/{y}/{z}',
    //         ],
    //     })
    // !map.getLayer('江堤港堤') &&
    //     map.addLayer({
    //         id: '江堤港堤',
    //         type: 'line',
    //         source: 'riverBankLine',
    //         'source-layer': 'default',
    //         layout: {
    //             'line-cap': 'round',
    //             'line-join': 'round',
    //         },
    //         paint: {
    //             'line-opacity': 1,
    //             'line-color': '#958E54',
    //             'line-width': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0.5],
    //                 10, ["literal", 1.0],
    //                 13, ["literal", 3.0]
    //             ],
    //         },
    //     })



    // !map.getSource('portEmbankmentPoint') &&
    //     map.addSource('portEmbankmentPoint', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/portEmbankmentPoint/{x}/{y}/{z}',
    //         ],
    //     })
    // !map.getLayer('里程桩') &&
    //     map.addLayer({
    //         id: '里程桩',
    //         type: 'circle',
    //         source: 'portEmbankmentPoint',
    //         'source-layer': 'default',
    //         layout: {
    //         },
    //         paint: {
    //             'circle-color': '#504C28',
    //             'circle-blur': 0.5,
    //             'circle-radius': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0.5],
    //                 10, ["literal", 2],
    //                 13, ["literal", 4]
    //             ],
    //         },
    //     })



    // !map.getSource('combineProjectPoint') &&
    //     map.addSource('combineProjectPoint', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/combineProjectPoint/{x}/{y}/{z}',
    //         ],
    //     })
    // loadImage(map, '/legend/枢纽.png', '枢纽')
    // !map.getLayer('枢纽工程') &&
    //     map.addLayer({
    //         id: '枢纽工程',
    //         type: 'symbol',
    //         source: 'combineProjectPoint',
    //         'source-layer': 'default',
    //         layout: {
    //             'icon-image': '枢纽',
    //             'icon-size': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0],
    //                 11, ["literal", 0.4],
    //                 14, ["literal", 0.6]
    //             ],
    //         },
    //         paint: {
    //         },
    //     })

    // !map.getSource('riverPassageLine') &&
    //     map.addSource('riverPassageLine', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/riverPassageLine/{x}/{y}/{z}',
    //         ],
    //     })
    // !map.getLayer('过江通道-隧道/通道') &&
    //     map.addLayer({
    //         id: '过江通道-隧道/通道',
    //         type: 'line',
    //         source: 'riverPassageLine',
    //         'source-layer': 'default',
    //         layout: {
    //             'line-cap': 'round',
    //             'line-join': 'round',
    //         },
    //         paint: {
    //             'line-opacity': 1,
    //             'line-color': '#FF8400',
    //             'line-width': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0.5],
    //                 10, ["literal", 3.0],
    //                 13, ["literal", 7.0]
    //             ],
    //         },
    //     })

    // !map.getSource('riverPassageLine') &&
    //     map.addSource('riverPassageLine', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/riverPassageLine/{x}/{y}/{z}',
    //         ],
    //     })
    // !map.getLayer('过江通道-隧道/通道-注记') &&
    //     map.addLayer({
    //         id: '过江通道-隧道/通道-注记',
    //         type: 'symbol',
    //         source: 'riverPassageLine',
    //         'source-layer': 'default',
    //         layout: {
    //             'text-field': ['get', 'name'],
    //             'symbol-placement': 'line',
    //             'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //             // 'text-offset': [0, 1.25],
    //             'text-anchor': 'center',
    //         },
    //         paint: {
    //             'text-color': '#653400',
    //             'line-width': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0.5],
    //                 10, ["literal", 3.0],
    //                 13, ["literal", 7.0]
    //             ],
    //         },
    //     })


    // !map.getSource('riverPassagePier') &&
    //     map.addSource('riverPassagePier', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/riverPassagePier/{x}/{y}/{z}',
    //         ],
    //     })
    // !map.getLayer('过江通道-桥墩') &&
    //     map.addLayer({
    //         id: '过江通道-桥墩',
    //         type: 'fill-extrusion',
    //         source: 'riverPassagePier',
    //         'source-layer': 'default',
    //         layout: {
    //         },
    //         paint: {
    //             'fill-extrusion-color': '#E7AE6D',
    //             'fill-extrusion-base': 0,
    //             'fill-extrusion-height': 200,
    //             'fill-extrusion-opacity': 1.0
    //         },
    //     })

    // !map.getSource('riverPassagePolygon') &&
    //     map.addSource('riverPassagePolygon', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/riverPassagePolygon/{x}/{y}/{z}',
    //         ],
    //     })
    // !map.getLayer('过江通道-桥') &&
    //     map.addLayer({
    //         id: '过江通道-桥',
    //         type: 'fill-extrusion',
    //         source: 'riverPassagePolygon',
    //         'source-layer': 'default',
    //         layout: {
    //         },
    //         paint: {
    //             'fill-extrusion-color': '#FF9925',
    //             'fill-extrusion-base': 200,
    //             'fill-extrusion-height': 210,
    //             'fill-extrusion-opacity': 1.0
    //         },
    //     })

    // !map.getLayer('过江通道-桥-注记') &&
    //     map.addLayer({
    //         id: '过江通道-桥-注记',
    //         type: 'symbol',
    //         source: 'riverPassagePolygon',
    //         'source-layer': 'default',
    //         layout: {
    //             'text-field': ['get', 'name'],
    //             'symbol-placement': 'line',
    //             'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //             // 'text-offset': [0, 1.25],
    //             'text-anchor': 'top',
    //             'text-offset': [0, 0]
    //         },
    //         paint: {
    //             'text-color': '#653400',
    //         },
    //     })

    // !map.getSource('sluiceArea') &&
    //     map.addSource('sluiceArea', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
    //         ],
    //     })
    // loadImage(map, '/legend/水闸.png', '水闸')
    // !map.getLayer('水闸工程') &&
    //     map.addLayer({
    //         id: '水闸工程',
    //         type: 'symbol',
    //         source: 'sluiceArea',
    //         'source-layer': 'default',
    //         layout: {
    //             'icon-image': '水闸',
    //             'icon-size': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 10.9, ["literal", 0],
    //                 11, ["literal", 0.25],
    //                 14, ["literal", 0.5]
    //             ],
    //         },
    //         paint: {
    //         },
    //     })

    // !map.getSource('pumpArea') &&
    //     map.addSource('pumpArea', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
    //         ],
    //     })
    // loadImage(map, '/legend/泵站.png', '泵站')
    // !map.getLayer('泵站工程') &&
    //     map.addLayer({
    //         id: '泵站工程',
    //         type: 'symbol',
    //         source: 'pumpArea',
    //         'source-layer': 'default',
    //         layout: {
    //             'icon-image': '泵站',
    //             'icon-size': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 8, ["literal", 0],
    //                 11, ["literal", 0.25],
    //                 14, ["literal", 0.5]
    //             ],
    //         },
    //         paint: {
    //         },
    //     })


    // !map.getSource('embankmentLine') &&
    //     map.addSource('embankmentLine', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/embankmentLine/{x}/{y}/{z}',
    //         ],
    //     })
    // await loadImage(map, '/legend/堤防.png', '堤防')

    // !map.getLayer('长江堤防') &&
    //     map.addLayer({
    //         id: '长江堤防',
    //         type: 'line',
    //         source: 'embankmentLine',
    //         'source-layer': 'default',
    //         layout: {
    //         },
    //         paint: {
    //             'line-pattern': '堤防',
    //             'line-width': [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 7, ["literal", 0.0],
    //                 10, ["literal", 2],
    //                 13, ["literal", 5]
    //             ],
    //         },
    //     })





    // !map.getSource('riverArea') &&
    //     map.addSource('riverArea', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/riverArea/{x}/{y}/{z}',
    //         ],
    //     })
    // await loadImage(map, '/legend/河流.png', '河流')
    // !map.getLayer('流域水系') &&
    //     map.addLayer({
    //         id: '流域水系',
    //         type: 'fill',
    //         source: 'riverArea',
    //         'source-layer': 'default',
    //         layout: {
    //         },
    //         paint: {
    //             'fill-pattern':'河流',
    //         },
    //     })

    // !map.getSource('lakeArea') &&
    //     map.addSource('lakeArea', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/lakeArea/{x}/{y}/{z}',
    //         ],
    //     })
    // await loadImage(map, '/legend/湖泊.png', '湖泊')
    // !map.getLayer('湖泊河流') &&
    //     map.addLayer({
    //         id: '湖泊河流',
    //         type: 'fill',
    //         source: 'lakeArea',
    //         'source-layer': 'default',
    //         layout: {
    //         },
    //         paint: {
    //             'fill-pattern':'湖泊'
    //         },
    //     })

    // await loadImage(map, '/legend/水文站.png', '水文站')
    // map.addSource('hydroStationPoint', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/hydroStationPoint/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '水文站点',
    //     type: 'symbol',
    //     source: 'hydroStationPoint',
    //     'source-layer': 'default',
    //     layout: {
    //         'icon-image': '水文站',
    //         "icon-size": [
    //             "interpolate",
    //             ["linear"],
    //             ["zoom"],
    //             7, ["literal", 0.0],
    //             10, ["literal", 0.3],
    //             13, ["literal", 0.5]
    //         ],
    //         'icon-anchor':'center',
    //         'icon-allow-overlap': true,
    //         'icon-keep-upright': true
    //     },
    // })


    // map.addSource('importantBank', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/importantBank/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '一级预警岸段',
    //     type: 'line',
    //     source: 'importantBank',
    //     'source-layer': 'default',
    //     layout: {
    //         // 'line-cap': 'round',
    //         // 'line-join': 'round',
    //     },
    //     filter: ["==", "warning_level", 1],
    //     paint: {
    //         // 'line-opacity': 1,
    //         'line-color': '#FF00B0',
    //         'line-width': [
    //             "interpolate",
    //             ["linear"],
    //             ["zoom"],
    //             7, ["literal", 0.5],
    //             10, ["literal", 1.0],
    //             13, ["literal", 5.0]
    //         ],
    //     },
    // })
    // map.addLayer({
    //     id: '二级预警岸段',
    //     type: 'line',
    //     source: 'importantBank',
    //     'source-layer': 'default',
    //     layout: {
    //         // 'line-cap': 'round',
    //         // 'line-join': 'round',
    //     },
    //     filter: ["==", "warning_level", 2],
    //     paint: {
    //         // 'line-opacity': 1,
    //         'line-color': '#00FFB0',
    //         'line-width': [
    //             "interpolate",
    //             ["linear"],
    //             ["zoom"],
    //             7, ["literal", 0.5],
    //             10, ["literal", 1.0],
    //             13, ["literal", 5.0]
    //         ],

    //     },
    // })
    // map.addLayer({
    //     id: '三级预警岸段',
    //     type: 'line',
    //     source: 'importantBank',
    //     'source-layer': 'default',
    //     layout: {
    //         // 'line-cap': 'round',
    //         // 'line-join': 'round',
    //     },
    //     filter: ["==", "warning_level", 3],
    //     paint: {
    //         // 'line-opacity': 1,
    //         'line-color': '#0000FF',
    //         'line-width': [
    //             "interpolate",
    //             ["linear"],
    //             ["zoom"],
    //             7, ["literal", 0.5],
    //             10, ["literal", 1.0],
    //             13, ["literal", 5.0]
    //         ],
    //     },
    // })
})










</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;


    div.map {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .color-band {
        width: 200px;
        height: 50px;
        /* 色带的高度，可根据需要调整 */
        display: flex;
    }

    .color-section {
        height: 100%;
        flex: 1;
        /* 使每个色块平均分配宽度 */
    }

    /* 为每个颜色段添加相应的背景颜色 */
    .color-section:nth-child(1) {
        background-color: #008000;
    }

    .color-section:nth-child(2) {
        background-color: #e3cf01;
    }

    .color-section:nth-child(3) {
        background-color: #ffffff;
    }

    .color-section:nth-child(4) {
        background-color: #a9e9ff;
    }

    .color-section:nth-child(5) {
        background-color: #ade2e6;
    }

    .color-section:nth-child(6) {
        background-color: #009bff;
    }

    .color-section:nth-child(7) {
        background-color: #0064ff;
    }

}
</style>