<template>
    <div class="main">
        <div class="map" ref="mapDom" id="map"></div>
        <canvas id="GPUFrame" class="GPU"></canvas>
        <canvas id="UnityCanvas" class="GPU" ref="unityCanvaDom"></canvas>
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
import SteadyFlowLayer from '../../utils/m_demLayer/newFlow_mask'
import FlowFieldLayer from '../../utils/WebGL/notSimpleLayer'
import { layerAddFunction, layerRemoveFunction } from './layerUtil'
import * as customLayers from '../../utils/WebGL/customLayers'


const mapDom = ref()
const unityCanvaDom = ref()
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER

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

    let backEndJsonUrl1 = '/api/data/flow/configJson/dry'
    let imageSrcPrefix1 = '/api/data/flow/texture/dry/'
    let flowLayer1 = reactive(new FlowFieldLayer('流场1', backEndJsonUrl1, imageSrcPrefix1))
    let backEndJsonUrl2 = '/api/data/flow/configJson/flood'
    let imageSrcPrefix2 = '/api/data/flow/texture/flood/'
    let flowLayer2 = reactive(new FlowFieldLayer('流场2', backEndJsonUrl2, imageSrcPrefix2))
    window.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            map.addLayer(flowLayer1)
        } else if (e.key === '2') {
            map.removeLayer('流场1')
        } else if (e.key === '3') {
            map.addLayer(flowLayer2)
        } else if (e.key === '4') {
            map.removeLayer('流场2')
        }
    })




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


const baseImageStyle = {
    // local img
    'version': 8,
    'sources': {
        'raster-tiles': {
            'type': 'raster',
            'tiles': [tileServer + '/tile/raster/image/base/{x}/{y}/{z}'],
            'tileSize': 256,
        }
    },
    'layers': [
        {
            'id': 'simple-tiles',
            'type': 'raster',
            'source': 'raster-tiles',
            'minzoom': 1,
            'maxzoom': 14
        }
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
