<template>
    <!-- <div id="map" ref="mapContainerRef"></div> -->
    <!-- <canvas id="GPUFrame"></canvas>
    <div id="map" ref="mapContainerRef"></div> -->

    <!-- <div class="drag-parent">
        <div class="drag-comp" v-draggable="{ 'bounds': 'parent' }">
            <div class="drag-comp-content">
                <h1>title</h1>
                <p>desc</p>
                <button>clickme</button>
            </div>
        </div>
    </div> -->
    <!-- <monitorDetail v-draggable="{'bounds': 'parent'}"></monitorDetail> -->
    <!-- <bankLineDetail></bankLineDetail>
    <channelDetail></channelDetail> -->
    <!-- <pureChart v-draggable="{'bounds': 'parent'}"></pureChart> -->
    <!-- <bankLineRelate v-draggable="{'bounds': 'parent'}"></bankLineRelate> -->
    <!-- <channelRelate v-draggable="{'bounds': 'parent'}"></channelRelate> -->
    <!-- <monitorDeviceRelate v-draggable="{'bounds': 'parent'}"></monitorDeviceRelate> -->
    <div id="mxdiv">
        <canvas id="myCanvas"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
// import { main } from '../../utils/m_demLayer/main'
import { initScratchMap, initMap, ScratchMap } from '../../utils/mapUtils'
import monitorDetail from './featureDetails/monitorDetail.vue'
import bankLineDetail from './featureDetails/bankLineDetail.vue';
import channelDetail from './featureDetails/channelDetail.vue';
import pureChart from './monitorDevice/pureChart.vue';
import bankLineRelate from './scenesRelate/bankLineRelate.vue';
import channelRelate from './scenesRelate/channelRelate.vue';
import monitorDeviceRelate from './scenesRelate/monitorDeviceRelate.vue';
import BackEndRequest from '../../api/backend';

// src\utils\m_demLayer\terrainLayer.js
import TerrainLayer from '../../utils/m_demLayer/terrainLayer.js'
import SteadyFlowLayer from '../../utils/m_demLayer/steadyFlowLayer.js'
import * as scr from '../../utils/scratch/scratch'

// dwg
import Mx from 'mxdraw'


const mapContainerRef = ref();

async function clearCanvas() {
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
        fail('need a browser that supports WebGPU');
        return;
    }

    // Get a WebGPU context from the canvas and configure it
    const canvas = document.querySelector('#GPUFrame');
    const context = canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied'
    });

    const module = device.createShaderModule({
        label: 'our hardcoded red triangle shaders',
        code: `
      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> @builtin(position) vec4f {
        let pos = array(
          vec2f( 0.0,  0.5),  // top center
          vec2f(-0.5, -0.5),  // bottom left
          vec2f( 0.5, -0.5)   // bottom right
        );

        return vec4f(pos[vertexIndex], 0.0, 1.0);
      }

      @fragment fn fs() -> @location(0) vec4f {
        return vec4f(0, 0, 0, 0);
      }
    `,
    });

    const pipeline = device.createRenderPipeline({
        label: 'our hardcoded red triangle pipeline',
        layout: 'auto',
        vertex: {
            module,
            entryPoint: 'vs',
        },
        fragment: {
            module,
            entryPoint: 'fs',
            targets: [{ format: presentationFormat }],
        },
    });

    const renderPassDescriptor = {
        label: 'our basic canvas renderPass',
        colorAttachments: [
            {
                // view: <- to be filled out when we render
                clearValue: [0.0, 0.0, 0.0, 0],
                loadOp: 'clear',
                storeOp: 'store',
            },
        ],
    };

    function render() {
        // Get the current texture from the canvas context and
        // set it as the texture to render to.
        renderPassDescriptor.colorAttachments[0].view =
            context.getCurrentTexture().createView();

        // make a command encoder to start encoding commands
        const encoder = device.createCommandEncoder({ label: 'our encoder' });

        // make a render pass encoder to encode render specific commands
        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(pipeline);
        pass.draw(3);  // call our vertex shader 3 times.
        pass.end();

        const commandBuffer = encoder.finish();
        device.queue.submit([commandBuffer]);
    }

    render();
}



const main = async () => {
    // DOM Configuration //////////////////////////////////////////////////////////////////////////////////////////////////////
    const GPUFrame = document.getElementById('GPUFrame')
    GPUFrame.style.pointerEvents = 'none'
    GPUFrame.style.zIndex = '1'

    // const mapDiv = document.createElement('div')
    // mapDiv.style.height = '100%'
    // mapDiv.style.width = '100%'
    // mapDiv.style.zIndex = '0'
    // mapDiv.id = 'map'
    // document.body.appendChild(mapDiv)

    // StartDash //////////////////////////////////////////////////////////////////////////////////////////////////////

    const terrain = new TerrainLayer(14)
    const flow = new SteadyFlowLayer()
    // let mapp
    let mapp = await initScratchMap(mapContainerRef.value)

    // scr.StartDash().then(() => {
    //     const map = new ScratchMap({
    //         accessToken:
    //             'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
    //         style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
    //         center: [120.980697, 31.684162],
    //         projection: 'mercator',
    //         GPUFrame: GPUFrame,
    //         container: 'map',
    //         antialias: true,
    //         maxZoom: 18,
    //         zoom: 9,
    //     }).on('load', () => {
    //         mapp = map
    //         // map.addLayer(terrain)
    //         // map.addLayer(flow)
    //     })
    // })

    window.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            // flow.hide()
            if (mapp.getLayer('TerrainLayer')) terrain.show()
            else mapp.addLayer(terrain)

            mapp.triggerRepaint()
        }
        if (e.key === '2') {
            if (mapp.getLayer('TerrainLayer')) {
                terrain.hide()
                mapp.removeLayer('TerrainLayer')
            }

            mapp.triggerRepaint()
        }
        if (e.key === '3') {
            if (mapp.getLayer('FlowLayer')) flow.show()
            else mapp.addLayer(flow)

            mapp.triggerRepaint()
        }
        if (e.key === '4') {
            if (mapp.getLayer('FlowLayer')) {
                flow.hide()
                // mapp.removeLayer('FlowLayer')
            }
            mapp.triggerRepaint()
        }
    })
}

function fail(msg) {
    // eslint-disable-next-line no-alert
    alert(msg);
}




onMounted(async () => {
/*
cadFile......
"/dwg/守护工程断面图/守护工程断面图-20240322.dwg"
"/dwg/守护工程断面图/1.dwg"
"/dwg/守护工程断面图/10.dwg"
"/dwg/民主沙近岸测量范围-20240226-整体-展示版本2/buf/民主沙近岸测量范围-20240226-整体-展示版本2.dwg"
*/

    Mx.MxFun.createMxObject({
        canvasId: "myCanvas",
        //cadFile: "http://localhost:8080/demo/buf/test.dwg.mxb1.wgh",
        // cadFile:"/dwg/民主沙近岸测量范围-20240226-整体-展示版本2/buf/民主沙近岸测量范围-20240226-整体-展示版本2.dwg",
        cadFile:"/dwg/守护工程断面图/7.dwg",
        callback(mxDrawObject, { canvas, canvasParent }) {
            canvasParent.className = "mxdiv";

            mxDrawObject.addEvent("loadComplete", () => {
                console.log("mx loadComplete");
            });
        },
    });



})




</script>

<style lang="scss" scoped>
#GPUFrame {
    position: absolute;
    width: 100vw;
    height: 92vh;
    z-index: 1;
    pointer-events: none;
}

.mxdiv {
    position: absolute;
    width: 100vw;
    height: 92vh;
}

#myCanvas {
    position: absolute;
    width: 100vw;
    height: 92vh;
}

.drag-parent {
    position: absolute;
    width: 90vw;
    left: 10vw;
    height: 90vh;
    top: 4vh;
    pointer-events: none;


    .drag-comp {

        cursor: move;
        pointer-events: all;

        width: 200px;
        height: 200px;
        background-color: bisque;

        .drag-comp-content {
            color: brown;
            font-weight: 700;
            text-align: center;
        }
    }
}

#map {
    position: absolute;
    width: 100vw;
    height: 92vh;
    z-index: 0;
}
</style>