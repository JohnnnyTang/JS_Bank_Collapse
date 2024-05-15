<template>
    <div class="main">
        <div class="map" ref="mapDom" id="map">
        </div>
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
const geojson = {
    "type": "FeatureCollection",
    "name": "point",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "label": "在建围堤" }, "geometry": { "type": "Point", "coordinates": [120.498666444291274, 32.049985245363033] } },
        { "type": "Feature", "properties": { "label": "通信" }, "geometry": { "type": "Point", "coordinates": [120.537936534373657, 32.043194991802885] } },
        { "type": "Feature", "properties": { "label": "牲" }, "geometry": { "type": "Point", "coordinates": [120.529661105709394, 32.045504501552998] } },
        { "type": "Feature", "properties": { "label": "油" }, "geometry": { "type": "Point", "coordinates": [120.531043188529353, 32.046411147911222] } },
        { "type": "Feature", "properties": { "label": "江心沙养殖场" }, "geometry": { "type": "Point", "coordinates": [120.531280722916648, 32.044484179965011] } },
        { "type": "Feature", "properties": { "label": "江心洲重要湿地" }, "geometry": { "type": "Point", "coordinates": [120.513997001291273, 32.050901634735254] } },
        { "type": "Feature", "properties": { "label": "抽" }, "geometry": { "type": "Point", "coordinates": [120.521983576048214, 32.044691050836185] } },
        { "type": "Feature", "properties": { "label": "苗" }, "geometry": { "type": "Point", "coordinates": [120.525999268288103, 32.045176890656563] } },
        { "type": "Feature", "properties": { "label": "苗" }, "geometry": { "type": "Point", "coordinates": [120.522662183364602, 32.043381662080698] } },
        { "type": "Feature", "properties": { "label": "苗" }, "geometry": { "type": "Point", "coordinates": [120.52256663570391, 32.045082766347853] } },
        { "type": "Feature", "properties": { "label": "南1(黄)" }, "geometry": { "type": "Point", "coordinates": [120.508643292642518, 32.042304064286789] } },
        { "type": "Feature", "properties": { "label": "在建围堤" }, "geometry": { "type": "Point", "coordinates": [120.51161633291396, 32.053574416550582] } },
        { "type": "Feature", "properties": { "label": "在建围堤" }, "geometry": { "type": "Point", "coordinates": [120.50797944268966, 32.049733979950545] } },
        { "type": "Feature", "properties": { "label": "在建围堤" }, "geometry": { "type": "Point", "coordinates": [120.509035392576536, 32.045158077638085] } },
        { "type": "Feature", "properties": { "label": "潜堤" }, "geometry": { "type": "Point", "coordinates": [120.50287743831727, 32.043218063514281] } },
        { "type": "Feature", "properties": { "label": "吹填区" }, "geometry": { "type": "Point", "coordinates": [120.511255850880858, 32.048521530695844] } },
        { "type": "Feature", "properties": { "label": "在建围堤" }, "geometry": { "type": "Point", "coordinates": [120.504027722147512, 32.054663363805844] } },
        { "type": "Feature", "properties": { "label": "在建围堤" }, "geometry": { "type": "Point", "coordinates": [120.501248778702546, 32.044508878309522] } },
        { "type": "Feature", "properties": { "label": "吹填区" }, "geometry": { "type": "Point", "coordinates": [120.502943154245727, 32.049620961677] } },
        { "type": "Feature", "properties": { "label": "江滩办事处" }, "geometry": { "type": "Point", "coordinates": [120.525223501758049, 32.040733018179566] } },
        { "type": "Feature", "properties": { "label": "通信" }, "geometry": { "type": "Point", "coordinates": [120.5531101511326, 32.029094449353146] } },
        { "type": "Feature", "properties": { "label": "抽" }, "geometry": { "type": "Point", "coordinates": [120.552969454547465, 32.029619820841951] } },
        { "type": "Feature", "properties": { "label": "靖江市人民政府" }, "geometry": { "type": "Point", "coordinates": [120.524922894314713, 32.040941963403704] } },
        { "type": "Feature", "properties": { "label": "苗" }, "geometry": { "type": "Point", "coordinates": [120.5256615905096, 32.040484412634882] } },
        { "type": "Feature", "properties": { "label": "人渡" }, "geometry": { "type": "Point", "coordinates": [120.5621358294608, 32.040791455129011] } }
    ]
}


onMounted(async () => {

    const map = await initMap(mapDom.value)
    !map.getSource('sluiceArea') &&
        map.addSource('sluiceArea', {
            type: 'vector',
            tiles: [
                tileServer + '/tile/vector/center/mzsBankLine/{x}/{y}/{z}',
            ],
        })
    !map.getLayer('水闸工程') &&
        map.addLayer({
            id: '水闸工程',
            type: 'circle',
            source: 'sluiceArea',
            'source-layer': 'default',
            layout: {
            },
            paint: {
                'circle-color': '#529b2e',
                'circle-radius': 6,
            },
        })




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


}
</style>