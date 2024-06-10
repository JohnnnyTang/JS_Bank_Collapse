<template>
    <div class="main">
        <div class="map" ref="mapDom" id="map"></div>
        <canvas id="GPUFrame" class="GPU"></canvas>
        <canvas id="UnityCanvas" class="GPU" ref="unityCanvaDom"></canvas>

        <div class="temp" style="display: block; position: absolute; left: 30vw; top: 30vh; background-color: rgb(182, 70, 18); 
        opacity: 0.9; width: 8vw; height: 4vh; z-index: 999; color: aliceblue;">
            <span style="font-weight: 600;">{{ realtimeZoom }}</span>
        </div>
    </div>
</template>

<script setup>
import { initMap, initScratchMap, loadImage, initPureScratchMap, initBaseMap } from '../../utils/mapUtils'
import { onMounted, watch, ref, reactive } from 'vue'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getStyleJson4base } from '../../utils/mapUtils'
import BankWarnLayer from './js/bankWarnLayer'
import FlowFieldLayer from '../../utils/WebGL/notSimpleLayer'
import { layerAddFunction, layerRemoveFunction } from './layerUtil'
import * as customLayers from '../../utils/WebGL/customLayers'


const mapDom = ref()
const unityCanvaDom = ref()
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const realtimeZoom = ref(0)
const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.46987922676836, 32.03201616423072],
            [120.61089640208264, 32.052171362618625],
        ],
        {
            duration: 500,
            zoom: 8,
        },
    )
}

onMounted(async () => {

    const map = await initMap(mapDom.value)

    mapFlyToRiver(map)
    // E:\WATER\BankCollapse\JS_Bank_Collapse\front-v2\public\scratchSomething\flowWebGL\json\flow_field_description.json

    map.on('zoom', () => {
        realtimeZoom.value = map.getZoom()
    });
    /////  影像底图
    map.addSource('mapRaster22', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/image/base/{x}/{y}/{z}',
        ],
        tileSize: 256,
        minzoom: 1,
        maxzoom: 14,
        bounds: [
            118.3372672298279582, 30.5615244886408277, 122.3900937696443378,
            32.835981186719593,
        ],
    })
    map.addLayer({
        id: 'ras',
        type: 'raster',
        source: 'mapRaster22',
    })

    // 线
    await layerAddFunction(map, '长江干堤-影像')// 全程
    await layerAddFunction(map, '河道分段-影像')// max
    await layerAddFunction(map, '一级预警岸段')// 缩放
    await layerAddFunction(map, '二级预警岸段')// 缩放
    await layerAddFunction(map, '三级预警岸段')// 缩放

    // await layerAddFunction(map, '已建通道')// 缩放
    // await layerAddFunction(map, '在建通道')// 缩放
    // await layerAddFunction(map, '规划通道')// 缩放
    await layerAddFunction(map, '重点行政区边界')// 全程

    // // 点 
    await layerAddFunction(map, '里程桩')
    // await layerAddFunction(map, '水文站点')// 分类
    // await layerAddFunction(map, '大中型水闸')// 全程展示
    // await layerAddFunction(map, '其他水闸')// 缩放展示  level2 
    // await layerAddFunction(map, '大中型泵站')
    // await layerAddFunction(map, '其他泵站')
    // await layerAddFunction(map, '河道分段点-影像')
    // await layerAddFunction(map, '行政点')

    // // 注记
    await layerAddFunction(map, '里程桩-影像-注记')
    // await layerAddFunction(map, '大型湖泊-注记')
    // await layerAddFunction(map, '区域性骨干河道-注记')
    // await layerAddFunction(map, '流域性河道-注记')
    // await layerAddFunction(map, '其他河道-注记')
    // await layerAddFunction(map, '沿江码头-注记')
    // await layerAddFunction(map, '水库大坝-注记')
    // await layerAddFunction(map, '洲滩-注记')
    // await layerAddFunction(map, '行政点-注记')


    // await layerAddFunction(map, '一级岸段-注记')
    // await layerAddFunction(map, '二级岸段-注记')
    // await layerAddFunction(map, '三级岸段-注记')
    // await layerAddFunction(map, '已建通道-注记')
    // await layerAddFunction(map, '在建通道-注记')
    // await layerAddFunction(map, '规划通道-注记')
    // await layerAddFunction(map, '水文站点-注记')
    // await layerAddFunction(map, '大中型水闸-注记')
    // await layerAddFunction(map, '其他水闸-注记')
    // await layerAddFunction(map, '大中型泵站-注记')
    // await layerAddFunction(map, '其他泵站-注记')

    await layerAddFunction(map, '河道分段-注记')
    // await layerAddFunction(map, '河道分段点-注记')

    // await layerAddFunction(map, '一级预警岸段-注记')








    // await layerAddFunction(map, '洲滩-边界')

    // console.log('tileserver', tileServer)


    ///////////  BANK TEST
    // map.addSource('bank-test', {
    //     type: 'geojson',
    //     data: banktest
    // })
    // map.addLayer({
    //     id: '一级预警岸段',
    //     type: 'line',
    //     source: 'bank-test',
    //     layout: {
    //         'line-join': 'round',
    //     },
    //     filter: ['==', 'warning_level', 1],
    //     paint: {
    //         'line-color': '#ff0303',
    //         'line-width': [
    //             'interpolate',
    //             ['linear'],
    //             ['zoom'],
    //             7,
    //             ['literal', 2],
    //             10,
    //             ['literal', 5],
    //             13,
    //             ['literal', 7],
    //         ],
    //     },
    // })
    // map.addLayer({
    //     id: '一级预警岸段-注记',
    //     type: 'symbol',
    //     source: 'bank-test',
    //     filter: ['==', 'warning_level', 1],
    //     layout: {
    //         'text-field': ['get', 'bank_name'],
    //         'text-font': [
    //             'Open Sans Semibold',
    //             'Arial Unicode MS Bold',
    //         ],
    //         // 'symbol-placement': 'point',
    //         'symbol-placement': 'line-center',
    //         // 'text-offset': [0.0, 1.0],
    //         'text-variable-anchor': ["top", "bottom", "center", "left", "right"],
    //         'text-size': 21,
    //         // 'text-padding': 0.0,
    //         // 'text-writing-mode': ['vertical', 'horizontal'],
    //         "text-allow-overlap": false,
    //         'text-ignore-placement': true
    //     },
    //     paint: {
    //         'text-color': '#2e0201',
    //         'text-halo-color': "rgba(255, 255, 255, 1.0)",
    //         'text-halo-width': 3.0,
    //     },
    // })



    // await layerAddFunction(map, '已建通道')
    // await layerAddFunction(map, '在建通道')
    // await layerAddFunction(map, '规划通道')
    // await layerAddFunction(map, '已建通道-注记')
    // await layerAddFunction(map, '在建通道-注记')
    // await layerAddFunction(map, '规划通道-注记')

    // await layerAddFunction(map, '过江通道辅助线')


    /////////// 水闸缩放
    // await layerAddFunction(map,'水闸工程-面')
    // await layerAddFunction(map, '大中型水闸')
    // await layerAddFunction(map, '大中型水闸-注记')
    // await layerAddFunction(map, '其他水闸')
    // await layerAddFunction(map, '其他水闸-注记')



    // console.log(tileServer + '/tile/vector/portEmbankmentPoint/')
    // const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
    // map.addSource('portEmbankmentPoint', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/portEmbankmentPoint/{x}/{y}/{z}',
    //     ],
    // })

    // map.addLayer({
    //     id: '里程桩',
    //     type: 'circle',
    //     source: 'portEmbankmentPoint',
    //     'source-layer': 'default',
    //     filter: ['==', 'if_important', 1],
    //     layout: {},
    //     paint: {
    //         'circle-color': 'rgb(222,1,1)',
    //         'circle-radius': [
    //             'interpolate',
    //             ['linear'],
    //             ['zoom'],
    //             7,
    //             ['literal', 1],
    //             10,
    //             ['literal', 3],
    //             12,
    //             ['literal', 5],
    //         ],
    //     },
    // })
    // map.addLayer({
    //     id: '里程桩-注记',
    //     type: 'symbol',
    //     source: 'portEmbankmentPoint',
    //     'source-layer': 'default',
    //     minzoom: 11,
    //     filter: ['==', 'if_important', 1],
    //     layout: {
    //         'text-field': ['get', 'name2'],
    //         'text-font': [
    //             'Open Sans Semibold',
    //             'Arial Unicode MS Bold',
    //         ],
    //         'text-variable-anchor': ["left", "right", "top", "bottom", "center"],
    //         'text-allow-overlap': false,
    //         'text-size': 15,
    //         'text-offset': [0.3, 0]
    //     },
    //     paint: {
    //         'text-color': 'rgb(88,88,88)',
    //         'text-halo-color': "rgba(255, 255, 255, 1.0)",
    //         'text-halo-width': 0.5,
    //     },
    // })



    // 岸段注记的显示问题！
    // map.addSource('test', {
    //     type: 'geojson',
    //     data: gj
    // })
    // // map.addSource('test', {
    // //     type: 'vector',
    // //     tiles: [tileServer + '/tile/vector/importantBank/{x}/{y}/{z}'],
    // // })
    // map.addLayer({
    //     id: '二级预警岸段',
    //     type: 'line',
    //     source: 'test',
    //     filter: ['==', 'bank_name', '江宁河'],
    //     // 'source-layer': 'default',
    //     layout: {
    //         // 'line-join': 'round',
    //     },
    //     paint: {
    //         // 'line-opacity': 1,
    //         'line-color': 'rgb(255, 120, 3)',
    //         'line-width': [
    //             'interpolate',
    //             ['linear'],
    //             ['zoom'],
    //             7,
    //             ['literal', 2],
    //             10,
    //             ['literal', 5],
    //             13,
    //             ['literal', 7],
    //         ],
    //     },
    // })

    // map.addLayer({
    //     id: '二级岸段-注记',
    //     type: 'symbol',
    //     source: 'test',
    //     filter: ['==', 'bank_name', '江宁河'],
    //     // 'source-layer': 'default',
    //     layout: {
    //         'text-field': ['get', 'bank_name'],
    //         // 'symbol-placement': 'line',
    //         'symbol-placement': 'line-center',
    //         'text-font': [
    //             'Open Sans Semibold',
    //             'Arial Unicode MS Bold',
    //         ],
    //         // 'text-offset': [0, 0],
    //         // 'text-anchor': 'bottom',
    //         // 'text-size': [
    //         //     'interpolate',
    //         //     ['linear'],
    //         //     ['zoom'],
    //         //     7,
    //         //     ['literal', 15],
    //         //     10,
    //         //     ['literal', 20],
    //         //     13,
    //         //     ['literal', 25],
    //         // ],

    //         // 'text-allow-overlap': true,

    //     },
    //     paint: {
    //         'text-color': '#2e0201',
    //         'text-halo-color': "rgba(255, 255, 255, 1.0)",
    //         'text-halo-width': 3.0,
    //     },
    // })

    // !map.getSource('sluiceArea-center') &&
    //     map.addSource('sluiceArea-center', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/center/sluiceArea/{x}/{y}/{z}',
    //         ],
    //     })
    // loadImage(map, '/legend/水闸.png', '水闸')

    // map.addLayer({
    //     id: '水闸工程-重点',
    //     type: 'symbol',
    //     'source-layer': 'default',
    //     source: 'sluiceArea-center',
    //     filter: ['==', 'if_important', 1],
    //     layout: {
    //         'icon-image': '水闸',
    //         "icon-size": 0.2,
    //         'icon-allow-overlap': true,
    //         'icon-rotate': ['get', 'rotation_angle']
    //     },
    //     paint: {
    //         'icon-opacity': 1.0,
    //     },
    // })

    // map.addLayer({
    //     id: '大中型水闸-注记',
    //     type: 'symbol',
    //     source: 'sluiceArea-center',
    //     'source-layer': 'default',
    //     filter: ['==', 'if_important', 1],
    //     minzoom: 8,
    //     layout: {
    //         'text-field': ['get', 'sp_name'],
    //         'text-font': [
    //             'Open Sans Semibold',
    //         ],
    //         // 'text-anchor': 'top',
    //         'text-variable-anchor': ["top", "top-left", "top-right", "bottom-left", "bottom-right", "left", "right"],
    //         'text-offset': [0, 0.5],
    //         'text-size': 17,
    //         'text-allow-overlap': false,
    //     },
    //     paint: {
    //         "text-color": "rgba(73, 83, 92,1.0)",
    //         'text-halo-color': "rgba(255, 255, 255, 1.0)",
    //         'text-halo-width': 2.0,
    //     },
    // })

    // !map.getSource('pumpArea') &&
    //     map.addSource('pumpArea', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
    //         ],
    //     })
    // !map.getSource('pumpArea') &&
    //     map.addSource('pumpArea', {
    //         type: 'vector',
    //         tiles: [
    //             tileServer + '/tile/vector/center/pumpArea/{x}/{y}/{z}',
    //         ],
    //     })
    // await loadImage(map, '/legend/泵站.png', '泵站')
    // !map.getLayer('大中型泵站') &&
    //     map.addLayer({
    //         id: '大中型泵站',
    //         type: 'symbol',
    //         source: 'pumpArea',
    //         filter: ["==", "if_important", '1'],
    //         'source-layer': 'default',
    //         minzoom: 8,

    //         maxzoom: 22,
    //         layout: {
    //             'icon-image': '泵站',
    //             'icon-size': 1.1,
    //             'icon-allow-overlap': true,
    //         },
    //         paint: {
    //         },
    //     })

    // !map.getLayer('大中型泵站-注记') &&
    //     map.addLayer({
    //         id: '大中型泵站-注记',
    //         type: 'symbol',
    //         source: 'pumpArea',
    //         filter: ["==", "if_important", '1'],
    //         'source-layer': 'default',
    //         minzoom: 8,

    //         layout: {
    //             'text-field': ['get', 'sp_name'],
    //             'text-font': [
    //                 'Open Sans Semibold',
    //                 'Arial Unicode MS Bold',
    //             ],
    //             'text-variable-anchor': ["top", "top-left", "top-right", "bottom-left", "bottom-right", "left", "right"],
    //             'text-offset': [0, -1.0],
    //             'text-allow-overlap': false,
    //             'text-size': 16,
    //         },
    //         paint: {
    //             'text-color': 'rgba(0,54,134,0.8)',
    //         },
    //     })



    // const jsonUrl1 = '/scratchSomething/flowWebGL/json2/flow_field_description.json'//洪季
    // const jsonUrl2 = '/scratchSomething/flowWebGL/json3/flow_field_description.json'//枯季
    // let flowFieldLayer1 = reactive(new FlowFieldLayer('洪季流场', jsonUrl1))
    // let flowFieldLayer2 = reactive(new FlowFieldLayer('枯季流场', jsonUrl2))
    // window.addEventListener('keydown', (e) => {
    //     if (e.key === '1') {
    //         map.addLayer(flowFieldLayer1)
    //     } else if (e.key === '2') {
    //         map.removeLayer('洪季流场')
    //     } else if (e.key === '3') {
    //         map.addLayer(flowFieldLayer2)
    //     } else if (e.key === '4') {
    //         map.removeLayer('枯季流场')
    //     }
    // })


    //////// this!

    // let backEndJsonUrl1 = '/api/data/flow/configJson/dry'
    // let imageSrcPrefix1 = '/api/data/flow/texture/dry/'
    // let flowLayer1 = reactive(new FlowFieldLayer('流场1', backEndJsonUrl1, imageSrcPrefix1))
    // let backEndJsonUrl2 = '/api/data/flow/configJson/flood'
    // let imageSrcPrefix2 = '/api/data/flow/texture/flood/'
    // let flowLayer2 = reactive(new FlowFieldLayer('流场2', backEndJsonUrl2, imageSrcPrefix2))
    // window.addEventListener('keydown', (e) => {
    //     if (e.key === '1') {
    //         map.addLayer(flowLayer1)
    //     } else if (e.key === '2') {
    //         map.removeLayer('流场1')
    //     } else if (e.key === '3') {
    //         map.addLayer(flowLayer2)
    //     } else if (e.key === '4') {
    //         map.removeLayer('流场2')
    //     }
    // })




    // watch(() => flowFieldLayer.currentResourcePointer, (v) => {
    //     console.log(v);
    // })


    // await layerAddFunction(map, '已建通道')
    // await layerAddFunction(map, '在建通道')
    // await layerAddFunction(map, '规划通道')
    // await layerAddFunction(map,'已建通道-注记')
    // await layerAddFunction(map,'在建通道-注记')
    // await layerAddFunction(map,'规划通道-注记')

    // await layerAddFunction(map, '洲滩')
    // await layerAddFunction(map, '洲滩-注记')

    // await layerAddFunction(map, '大中型泵站')
    // await layerAddFunction(map, '其他泵站')

    // await layerAddFunction(map, '大中型水闸')
    // await layerAddFunction(map, '水闸工程-重点')
    // await layerAddFunction(map, '其他水闸')

    // await layerAddFunction(map, '其他泵站-注记')
    // await layerAddFunction(map, '大中型泵站-注记')
    // await layerAddFunction(map, '大中型水闸-注记')
    // await layerAddFunction(map, '其他水闸-注记')

    // await layerAddFunction(map, '区域性骨干河道')
    // await layerAddFunction(map, '流域性河道')
    // await layerAddFunction(map, '其他河道')
    // await layerAddFunction(map, '区域性骨干河道-注记')
    // await layerAddFunction(map, '流域性河道-注记')
    // await layerAddFunction(map, '其他河道-注记')

    // await layerAddFunction(map, '水文站点')
    // await layerAddFunction(map, '水文站点-注记')
    // await layerAddFunction(map, '大型湖泊')
    // await layerAddFunction(map, '大型湖泊-注记')


    // map.on('click', ['区域性骨干河道'],(e) => {
    //     console.log(e.features[0]);
    // })

    window.addEventListener('keydown', (e) => {
        if (e.key == 'q') {
            console.log('qqqqqqq');

            map.setLayoutProperty('FlowLayer', 'visibility', 'none');
        } else if (e.key == 'w') {
            console.log('wwwwwww');
            map.setLayoutProperty('FlowLayer', 'visibility', 'visible');
        }
        else if (e.key == '1') {
            console.log(map.getZoom())
        }

    })


    // const scriptInteract = document.createElement('script')
    // scriptInteract.src = './src/utils/unityInteraction.js'
    // scriptInteract.onload = async () => {
    //     console.log('unityInteraction   文件执行完毕');
    // }
    // document.body.appendChild(scriptInteract)




    // const jsonUrl = '/bankWarn/bankWarn.json'
    // let bankWarnLayer = new BankWarnLayer(jsonUrl)
    // map.addLayer(bankWarnLayer)


    //     /**
    //      * @type {customLayers.UnityLayer}
    //      */
    //     let unityLayer
    //     /**
    //    * @type {customLayers.MaskLayer}
    //    */
    //     let maskLayer

    //     window.addEventListener('keydown', (e) => {
    //         if (e.key == '1') {
    //             const script = document.createElement('script');
    //             script.src = '/scratchSomething/unity/collapseBank/build/output.loader.js';
    //             script.onload = async () => {
    //                 console.log('load.js fine');
    //                 unityLayer = new customLayers.UnityLayer([120.556596, 32.042607], 0, unityCanvaDom.value)
    //                 maskLayer = new customLayers.MaskLayer()
    //                 map.addLayer(unityLayer)
    //                 map.addLayer(maskLayer)
    //             };
    //             document.head.appendChild(script);
    //         }
    //         if (e.key == '2') {
    //             // map.addLayer(new customLayers.UnityLayer([120.556596, 32.042607], 0, unityCanvaDom.value))
    //             console.log('222');
    //             unityLayer.remove()
    //             map.removeLayer('Mask-Layer')
    //             map.removeLayer('Unity-Layer')
    //         }
    //     })

    // const script = document.createElement('script');
    // script.src = '/scratchSomething/unity/collapseBank/build/output.loader.js';
    // script.onload = async () => {
    //     // loader.js加载完成后的回调
    //     const map = await initScratchMap(mapDom.value)
    //     map.addLayer(new customLayers.UnityLayer([120.556596, 32.042607], 0, unityCanvaDom.value))
    //     map.addLayer(new customLayers.MaskLayer())
    // };
    // document.head.appendChild(script);

    // const jsonUrl = '/bankWarn/bankWarn.json'
    // let flowSrc = []
    // for (let i = 0; i < 26; i++) {
    //     flowSrc.push(`/scratchSomething/terrain_flow/json/uv_${i}.bin`)
    // }

    // let flow = new SteadyFlowLayer(
    //     '近岸流场',
    //     '/scratchSomething/terrain_flow/json/station.bin',
    //     flowSrc,
    //     (url) => url.match(/uv_(\d+)\.bin/)[1],
    //     '/scratchSomething/terrain_flow/json/ChangJiang.geojson'
    // )
    // map.addLayer(flow)
    // let bankWarnLayer = new BankWarnLayer(jsonUrl)
    // map.addLayer(bankWarnLayer)
    // mapFlyToRiver(map)

    // await layerAddFunction(map, '市级行政区')
    // await layerAddFunction(map, '市级行政区-注记')
    // map.setFilter('市级行政区', filterMap['市级行政区'])
    // map.setFilter('市级行政区-注记', filterMap['市级行政区-注记'])

    // window.addEventListener('keydown', (e) => {
    //     if (e.key == '1') {
    //         console.log('11');
    //         map.setFilter('市级行政区', null)
    //         map.setFilter('市级行政区-注记', null)
    //     } else if (e.key == '2') {
    //         map.setFilter('市级行政区', filterMap['市级行政区'])
    //         map.setFilter('市级行政区-注记', filterMap['市级行政区-注记'])
    //     }
    // })
})

const gj = {
    "type": "FeatureCollection",
    "name": "1",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "id": 5, "city_name": "南京市", "river_name": "南京河段", "bank_name": "江宁河", "warning_level": 2, "monitoring_length": 3.7, "memo": null, "description": "江宁河岸段属Ⅱ级崩岸预警段，监测长度3.7km，沿江岸线分布着汪海集团码头、三山码头、华江船厂、梅山钢铁公司取水口等1个取水口、4个码头及2个船厂。", "state": "active", "create_time": "2024-01-25T14:05:12", "update_time": "2024-01-25T14:05:12", "if_important": 0, "fix_project": "2015年实施长江南京新济洲河段河道整治工程新潜洲右汊右岸护岸工程（江宁河口岸段），长度3.31km，水下抛石30.18万m3。" }, "geometry": { "type": "LineString", "coordinates": [[118.579409292162637, 31.898463281200133], [118.583546918781565, 31.90235235781017], [118.583634642314138, 31.902176910745062], [118.585272148255186, 31.903916760807448], [118.586120142403232, 31.90458930789038], [118.586397933589666, 31.905071787319443], [118.587128963027624, 31.905861299112455], [118.589219707220238, 31.907264875633366], [118.595594283919425, 31.91527695827358], [118.595418836854293, 31.915715575936357], [118.595828213339544, 31.918259558380512], [118.59695399867401, 31.919092931939801], [118.59708558397287, 31.920087131975457], [118.597597304579452, 31.920364923161888], [118.598094404597262, 31.921066711422341], [118.600068184079788, 31.923215937969999], [118.600726110573959, 31.923800761520365], [118.600594525275127, 31.924049311529281], [118.600726110573959, 31.924180896828116], [118.60126707235807, 31.923903105641685], [118.601749551787151, 31.923771520342846], [118.601749551787151, 31.92403469094052], [118.601471760600717, 31.924400205659513], [118.601515622366989, 31.924809582144775], [118.601939619440998, 31.925292061573835], [118.602685269467742, 31.925628335115309]] } }
    ]
}


const featureHighLight = (featureLayerid, map, featureName, property) => {

    let layerId
    let featureId
    let featureLayer
    let sourceid

    if (featureLayerid.includes('通道')) {
        // layerId = '过江通道-'
        sourceid = property.source
        layerId = (sourceid === 'riverPassagePolygon' ? '过江通道-桥' : '过江通道-隧道/通道')
        featureId = featureName
        featureLayer = map.getLayer(layerId)

    } else {
        layerId = featureLayerid
        featureId = featureName
        featureLayer = map.getLayer(layerId)
        sourceid = featureLayer.source
    }


    emit('featureInfo', {
        ogData: property,
        sourceId: sourceid,
        column: sourceColumnMap[sourceid]
    })

    let paintMap = {
        'line': {
            'line-color': '#FF5D06',
            'line-width': 5,
        },
        'fill': {
            'fill-color': '#FF5D06',
            'fill-opacity': 0.8
        },
        'circle': {
            'circle-color': '#FF5D06',
            'circle-radius': 8,
        },
        'symbol': {

        },
        'fill-extrusion': {
            'fill-extrusion-color': '#FF5D06',
            'fill-extrusion-base': 200,
            'fill-extrusion-height': 210,
            'fill-extrusion-opacity': 1.0
        }
    }

    // 1  add highlight layer
    map.addLayer({
        id: `${layerId}-highlight-${featureId}`,//自定义
        type: featureLayer.type,
        source: featureLayer.source,
        'source-layer': featureLayer.sourceLayer,
        filter: ['==', ['get', sourceNameMap[sourceid]], featureName],//自定义
        layout: {
        },
        paint: paintMap[featureLayer.type],
    })

    // 2  use expression  但不适用于现在的Map 还是用加图层的办法
    // map.setPaintProperty(layerId, 'fill-color', [
    //     'match',
    //     ['get', sourceNameMap[sourceid]], // 获取要素的'name'属性
    //     'featureName', ['literal', 'rgba(255, 0, 0, 1)'], // 如果'name'是'123'，则使用红色高亮
    //     ['literal', map.getPaintProperty(layerId, 'fill-color')] // 否则保持原有样式
    // ]);


    let lng = property.center_x
    let lat = property.center_y
    map.flyTo({
        center: [lng, lat],
        zoom: sourceZoomMap[featureLayer.source] ? sourceZoomMap[featureLayer.source] : 10,
        duration: 3500
    });

    highlightLayer.value.push(`${layerId}-highlight-${featureId}`)
    useHighlightLayerStore().highlightLayers = highlightLayer.value;
    // setTimeout(() => {
    //     if (map.getLayer(`${layerId}-highlight-${featureId}`))
    //         map.removeLayer(`${layerId}-highlight-${featureId}`)
    // }, 3000)
}



// const baseImageStyle = {
//     // local img
//     'version': 8,
//     'sources': {
//         'raster-tiles': {
//             'type': 'raster',
//             'tiles': [tileServer + '/tile/raster/image/base/{x}/{y}/{z}'],
//             'tileSize': 256,
//         }
//     },
//     'layers': [
//         {
//             'id': 'simple-tiles',
//             'type': 'raster',
//             'source': 'raster-tiles',
//             'minzoom': 1,
//             'maxzoom': 14
//         }
//     ]
// }


const banktest = {
    "type": "FeatureCollection",
    "name": "单条岸段平滑测试",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "id": 48, "city_name": "苏州市", "river_name": "澄通河段", "bank_name": "段山港至越洋码头", "warning_level": 1, "monitoring_length": 16.0, "memo": "长防办12", "description": "段山港至越洋码头段属Ⅰ级崩岸预警段，监测长度约16km，沿江分布着海螺水泥码头、海力0~9号码头、沙洲电厂一期工程重件码头等29个码头，张家港互益染整有限公司取水口、江苏新芳纺织集团取水口、浦项取水口、张江港市给排水总公司取水口、江苏沙钢集团有限公司取水口、张家港沙洲电力有限公司取水口6个取水口。该段江岸自1924年至解放初，已有七个集镇坍入江中，最大崩坍达4.8km。", "state": "active", "create_time": "2024-01-25T14:05:12", "update_time": "2024-01-25T14:05:12", "if_important": 0, "fix_project": "自七十年代初起，至八十年代初，治理区域位于一干河以上段，以丁坝为主，共建丁坝11条（其中12号丁坝已于1972年5月16日塌失），护岸长度约计5.8km。八十年代后，随着上游河势的变化，老海坝段顶冲点也下移至九龙港以下，治理区域位于一干河至二干河，除了对已建丁坝工程不断维修加固外，新建护岸工程全部改成平顺抛石护岸，至八十年代中，完成平顺抛石护岸2.23km。自1991～1997年累计抛石21.63万t，1988年～1997年累计抛石40.70万t。1998年大水后完成了九龙港至十一圩抛石护岸工程，新建护岸长2km，1999～2013年沙钢集团沿江码头前沿对护岸区域进行加固维护，累计抛石约114万m3。为稳定浏海沙右岸顶冲点、水下岸坡，使水上的堤防工程与水下的防护工程形成完整的防洪体系，保障防洪安全，老海坝节点综合整治工程2014年开工建设，对沙钢海力9号至0号码头范围7.25km的近岸河床进行抛石加固，抛护宽宽165～255m不等，抛石量240万方，目前已全部完工。" }, "geometry": { "type": "LineString", "coordinates": [[120.535135296341295, 32.005954184474653], [120.547606348126905, 31.999653113460344], [120.562131147053137, 31.995886453810993], [120.5912157023037, 31.992582979686979], [120.608624486576247, 31.987785076792594], [120.614977993687759, 31.98858035760021], [120.617792064237847, 31.990275791409896], [120.628454070669861, 31.988624054347891], [120.650311183855464, 31.989594122146197], [120.660588658907969, 31.988842538086249], [120.663778521488027, 31.992207187656994], [120.688012737746988, 31.992679112531864], [120.701576208224452, 31.994400764390164]] } }
    ]
}



</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;

    div.map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }

    canvas.GPU {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-color: transparent;
    }

    canvas#GPUFrame {
        z-index: 3;
    }

    canvas#UnityCanvas {
        z-index: 1;
    }

    .value {
        position: absolute;
        left: 8vw;
        top: 10px;
        font-size: 12px;
        color: #000000;
        z-index: 1;

        .value-item {
            margin-bottom: 0.2px;
        }
    }
}
</style>
