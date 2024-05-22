<template>
    <div class="main">
        <div class="map" ref="mapDom" id="map"></div>
        <canvas id="GPUFrame" class="GPU"></canvas>
        <canvas id="UnityCanvas" class="GPU" ref="unityCanvaDom"></canvas>
    </div>
</template>

<script setup>
import { initMap, initScratchMap, loadImage } from '../../utils/mapUtils'
import { onMounted, watch, ref } from 'vue'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import BankWarnLayer from './js/bankWarnLayer'
import SteadyFlowLayer from '../../utils/m_demLayer/newFlow_mask'
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
            zoom: 12.5,
        },
    )
}

onMounted(async () => {
    const map = await initScratchMap(mapDom.value)
    const jsonUrl = '/bankWarn/bankWarn.json'
    let bankWarnLayer = new BankWarnLayer(jsonUrl)
    map.addLayer(bankWarnLayer)
    mapFlyToRiver(map)
    
    /**
     * @type {customLayers.UnityLayer}
     */
    let unityLayer
    /**
     * @type {customLayers.MaskLayer}
     */
    let maskLayer

    window.addEventListener('keydown', (e) => {
        if (e.key == '1') {
            const script = document.createElement('script')
            script.src =
                '/scratchSomething/unity/collapseBank/build/output.loader.js'
            script.onload = async () => {
                console.log('load.js fine')
                unityLayer = new customLayers.UnityLayer(
                    [120.556596, 32.042607],
                    0,
                    unityCanvaDom.value,
                )
                maskLayer = new customLayers.MaskLayer()
                map.addLayer(unityLayer)
                map.addLayer(maskLayer)
            }
            document.head.appendChild(script)
        }
        if (e.key == '2') {
            // map.addLayer(new customLayers.UnityLayer([120.556596, 32.042607], 0, unityCanvaDom.value))
            console.log('222')
            unityLayer.remove()
            map.removeLayer('Mask-Layer')
            map.removeLayer('Unity-Layer')
        }
    })

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
