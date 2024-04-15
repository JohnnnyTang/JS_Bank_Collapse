<template>

    <div class="model-content-container">
        <div class="model-item-container">
            <div class="model-choice">
                <div class="basemap-radio-container">
                    <input type="radio" id="radio-1" name="tabs" checked />
                    <label class="tab" for="radio-1">近岸动力分析</label>
                    <input type="radio" id="radio-2" name="tabs" />
                    <label class="tab" for="radio-2">近岸演变分析</label>
                    <!-- <input type="radio" id="radio-3" name="tabs" />
            <label class="tab" for="radio-3">Completed</label> -->
                    <span class="glider"></span>
                </div>
                <el-tooltip :content="查看模型基本信息">
                    <div class="icon detailIcon"></div>

                </el-tooltip>
            </div>
            <div class="user-react">
                交互按钮
            </div>
            <div class="data-panel">
                数据面板
            </div>
            <div class="layer-panel">
                图层面板
            </div>
        </div>
        <div class="map-container">
            <div id="map" ref="mapContainerRef"></div>
            <canvas id="GPUFrame"></canvas>

        </div>

    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { initScratchMap, ScratchMap } from '../../utils/mapUtils'

import TerrainLayer from '../../utils/m_demLayer/terrainLayer.js'
import SteadyFlowLayer from '../../utils/m_demLayer/steadyFlowLayer.js'
import * as scr from '../../utils/scratch/scratch'

// dwg
// import Mx from 'mxdraw'


const mapContainerRef = ref();





onMounted(async () => {

    // Mx.MxFun.createMxObject({
    //     canvasId: "myCanvas",
    //     //cadFile: "http://localhost:8080/demo/buf/test.dwg.mxb1.wgh",
    //     // cadFile:"/dwg/民主沙近岸测量范围-20240226-整体-展示版本2/buf/民主沙近岸测量范围-20240226-整体-展示版本2.dwg",
    //     cadFile:"/dwg/守护工程断面图/7.dwg",
    //     callback(mxDrawObject, { canvas, canvasParent }) {
    //         canvasParent.className = "mxdiv";

    //         mxDrawObject.addEvent("loadComplete", () => {
    //             console.log("mx loadComplete");
    //         });
    //     },
    // });

    const map = initScratchMap(mapContainerRef.value)


})




</script>

<style lang="scss" scoped>
div.model-content-container {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 87.4vh;
    display: flex;
    flex-direction: row;

    div.model-item-container {
        width: 25vw;
        height: 87.4vh;
        position: relative;
        background-color: green;
        display: flex;
        flex-direction: column;
        // justify-content: ;

        div.model-choice {
            height: 10%;
            width: 100%;
            background-color: aliceblue;
            display: flex;
            justify-content: center;
            
            align-items: center;

            .detailIcon{
                width: 4.5vh;
                height: 4.5vh;
                background-size: contain;
                margin-left: 2.5vw;
                background-image: url('/icons/searching.png');
                &:hover {
                        cursor: pointer;
                }
            }

            div.basemap-radio-container {

                width: 14vw;
                height: 4vh;
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
                    height: 4vh;
                    width: 7vw;
                    font-size: calc(0.8vw + 0.5vh);
                    font-weight: 600;
                    border-radius: 1.6rem; // just a high number to create pill effect
                    cursor: pointer;
                    transition: color 0.15s ease-in;
                }

                input[type='radio'] {
                    &:checked {
                        &+label {
                            color: #185ee0;
                        }
                    }
                }

                input[id='radio-1'] {
                    &:checked {
                        &~.glider {
                            transform: translateX(0);
                        }
                    }
                }

                input[id='radio-2'] {
                    &:checked {
                        &~.glider {
                            transform: translateX(100%);
                        }
                    }
                }

                input[id='radio-3'] {
                    &:checked {
                        &~.glider {
                            transform: translateX(200%);
                        }
                    }
                }

                .glider {
                    position: absolute;
                    display: flex;
                    height: 4vh;
                    width: 7vw;
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

        div.user-react {
            height: 20%;
            width: 100%;
            background-color: rgb(16, 86, 146);

        }

        div.data-panel {
            height: 40%;
            width: 100%;
            background-color: rgb(150, 206, 255);

        }

        div.layer-panel {
            height: 30%;
            width: 100%;
            background-color: rgb(255, 255, 255);
            flex-grow: 1; //fill the space

        }

    }

    div.map-container {
        position: relative;
        width: 75vw;
        height: 87.4vh;

        #map {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
            background-color: hsl(194, 69%, 91%);
            ;

        }

        #GPUFrame {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
        }
    }



}
</style>