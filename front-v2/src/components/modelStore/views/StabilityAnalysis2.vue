<template>
    <div class="all">
        <ModelTitleVue :ModelName="'岸坡稳定性分析模型'"  v-show="!showAnalysis"/>

        <div class="model-content-container"  v-show="!showAnalysis">
            <div class="model-item-container">
                <div class="model-choice" >
                    <div class="basemap-radio-container">
                        <input type="radio" id="radio-1" name="tabs" checked @click="radio1Click()" />
                        <label class="tab" for="radio-1">近岸动力分析</label>
                        <input type="radio" id="radio-2" name="tabs" @click="radio2Click()" />
                        <label class="tab" for="radio-2">近岸演变分析</label>
                        <span class="glider"></span>
                    </div>
                    <div :class="styleObj" class="title-icon" ref="iconref" @click="iconClick()"></div>
                </div>
                <div class="main-page" v-if="!showDetail">
                    <div class="user-react">
                        <div class="title">
                            <div class="title-icon uricon"></div>
                            <div class="title-text">{{ title1 }}</div>
                        </div>
                        <div class="buttons">
                            <div class="button" v-for="(item, index) in buttons" :key="index"
                                @click="handleClick(index)">
                                <div>{{ item }}</div>
                            </div>

                        </div>
                    </div>
                    <div class="data-panel">
                        <div class="title">
                            <div class="title-icon dpicon"></div>
                            <div class="title-text">数据面板</div>
                        </div>
                        <div class="dp-content">
                            <el-tree style="max-width: 600px" :data="data" :props="defaultProps"
                                @node-click="handleNodeClick" default-expand-all />
                        </div>

                    </div>
                    <div class="layer-panel">
                        <div class="title">
                            <div class="title-icon lpicon"></div>
                            <div class="title-text">图层面板</div>
                        </div>
                        <div class="lp-content">

                            <div class="checkBox">
                                <el-checkbox-group v-model="checkedlayers" @change="handleCheckedlayersChange">
                                    <el-checkbox v-for="city in layers" :key="city" :label="city" :value="city">{{ city
                                        }}</el-checkbox>
                                </el-checkbox-group>
                            </div>

                        </div>
                    </div>
                </div>

                <div v-if="showDetail" class="detail-page">
                    <ModelInfoVue :modelInfo="modelInfo" />
                </div>

            </div>
            <div class="main">
                <div class="map-container">
                    <div id="map" ref="mapContainerRef"></div>
                    <canvas id="GPUFrame"></canvas>
                </div>

                <HydrologicalCondition v-if="showHyCondition" v-on:close="showHyCondition = !showHyCondition"
                    v-on:condition="conditionHandler">
                </HydrologicalCondition>
                <UploadModel v-if="showUploadModel" v-on:close="showUploadModel = !showUploadModel"
                    v-on:files="fileHandler">
                </UploadModel>
                <SetParameter v-if="showStParams" v-on:close="showStParams = !showStParams" v-on:params="paramsHandler">
                </SetParameter>
            </div>
        </div>

        <div class="analysisCenter" v-show="showAnalysis">
            <div class="background"></div>
            <iframe id="inlineFrameExample" title="Inline Frame Example" width="100%" height="100%"
                src="http://172.21.212.165:8050/#/analysis/73c29959-16f0-4478-8526-0927d1aff6f7">

            </iframe>
        </div>

    </div>



</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import "mapbox-gl/dist/mapbox-gl.css"
import { initScratchMap } from '../../../utils/mapUtils.js'
import { infoItemList } from '../modelInfoList.js'
import ModelInfoVue from '../ModelInfo.vue';
import ModelTitleVue from '../ModelTitle.vue';
import HydrologicalCondition from '../stability-sub/HydrologicalCondition.vue';
import SetParameter from '../stability-sub/SetParameter.vue';
import UploadModel from '../stability-sub/UploadModel.vue';
import { ElMessage } from 'element-plus';
import SteadyFlowLayer from '../../../utils/m_demLayer/steadyFlowLayer';


const showHyCondition = ref(false)
const showStParams = ref(false)
const showUploadModel = ref(false)
const buttons = ref(['水文条件选择',
    '模型文件上传',
    '模型参数设置',
    '模型计算'])


const modelInfo = {
    application: infoItemList[2].application,
    usescene: infoItemList[2].usescene,
    input: infoItemList[2].input,
    output: infoItemList[2].output,
    processPicSrc: infoItemList[2].processPicSrc,
}

const title1 = ref('模型配置')
const showAnalysis = ref(false)
const radio1Click = () => {
    showAnalysis.value = false
}
const radio2Click = () => {
    showAnalysis.value = true
    data[0].children = [
        {
            'label': 'uvet流场数据',
            'children': []
        }
    ]
}

const mapContainerRef = ref();
const iconref = ref()
const showDetail = ref(false)
const styleObj = ref({
    'detailIcon': true, 'returnIcon': false
})
const iconClick = () => {
    styleObj.value = {
        'detailIcon': !styleObj.value.detailIcon, 'returnIcon': !styleObj.value.returnIcon
    }
    showDetail.value = !showDetail.value
}

//////////model//////////////
let condition = null;
const conditionHandler = (value) => {
    ElMessage({
        type: 'success',
        offset: 100,
        message: "水文条件：" + value
    })
    condition = value;
}

const handleClick = (index) => {
    switch (index) {
        case 0:
            showHyCondition.value = true
            break
        case 1:
            showUploadModel.value = true
            break
        case 2:
            showStParams.value = true
            break
        case 3:
            ElMessage({
                message: "模型计算中",
                offset: 100
            })
            setTimeout(() => {
                ElMessage({
                    type: "success",
                    offset: 100,
                    message: "模型计算完成"
                })
                data[1].children = [
                    {
                        'label': 'uvet流场数据',
                        'children': []
                    }
                ]
                layers.value.push('flowLayer')

            }, 2000)
            break
    }
}

const paramsHandler = (value) => {
    ElMessage({
        type: 'success',
        message: "模型参数设置成功",
        offset: 100
    })
    console.log(value);
}



const fileHandler = (value) => {
    let inputFileNode = []
    value.forEach(element => {
        inputFileNode.push({
            label: element,
            children: []
        })
    });
    data[0].children.push(...inputFileNode)
    ElMessage({
        type: "success",
        offset: 100,
        message: `上传${inputFileNode.length}条模型文件`,
    })
}


////////////tree///////////////
const handleNodeClick = (data) => {
    console.log(data)
}
const data = reactive([
    {
        label: '输入数据',
        children: [
            {
                label: 'fort.14',
                children: []
            },
            {
                label: 'fort.15',
                children: []
            },
        ],
    },
    {
        label: '输出数据',
        children: [],
    },
])
const defaultProps = {
    children: 'children',
    label: 'label',
}

////////////layer///////////////
const checkedlayers = ref([])
const layers = ref([])
const flow = new SteadyFlowLayer();

watch(checkedlayers, (value) => {
    console.log(value);

})


const handleCheckedlayersChange = (value) => {

    if (value.includes('flowLayer')) {
        flow.show();
    } else {
        flow.hide();
    }
}


onMounted(async () => {

    const map = await initScratchMap(mapContainerRef.value)
    map.addLayer(flow)
    flow.hide()
})




</script>

<style lang="scss" scoped>

div.all{
    width: 100vw;
    height: 92vh;
    position: relative;
}

div.model-content-container {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: calc(92vh - 6%);
    display: flex;
    flex-direction: row;

    div.model-item-container {
        width: 20vw;
        height: 87.4vh;
        position: relative;
        display: flex;
        flex-direction: column;

        div.model-choice {
            height: 8vh;
            width: 100%;
            background-color: rgba(240, 248, 255, 0);
            display: flex;
            justify-content: center;
            align-items: center;

            .title-icon {
                z-index: 0;
                width: 4.5vh;
                height: 4.5vh;
                background-size: contain;
            }


            .el-popper.is-customized {
                z-index: 3;
                padding: 6px 12px;
                background: linear-gradient(90deg, rgb(179, 255, 171), rgb(204, 229, 129));
            }

            .el-popper.is-customized .el-popper__arrow::before {
                background: linear-gradient(45deg, #b2e68d, #bce689);
                right: 0;
                z-index: 3;
            }

            .detailIcon {
                width: 4.5vh;
                height: 4.5vh;
                background-size: contain;
                margin-left: 2.5vw;
                background-image: url('/icons/searching.png');
                z-index: 0;

                &:hover {
                    cursor: pointer;
                    transform: scale(1.03);
                    transition: 500ms;
                }
            }

            .returnIcon {
                width: 4.5vh;
                height: 4.5vh;
                background-size: contain;
                margin-left: 2.5vw;
                background-image: url('/back.png');

                &:hover {
                    cursor: pointer;
                    transform: scale(1.03);
                    transition: 500ms;
                }
            }

            div.basemap-radio-container {
                z-index: 3;
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
                    z-index: 7;
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

        div.main-page {
            width: 20vw;
            height: calc(87.4vh - 8vh);
            display: flex;
            flex-direction: column;
            user-select: none;

            div.title-icon {
                height: 4vh;
                width: 4vh;
                line-height: 5vh;
                margin-right: 1vw;
                background-size: contain;
                z-index: 2;
            }

            div.title {
                height: 5vh;
                width: 100%;
                background: linear-gradient(90deg, rgb(187, 239, 248), rgb(29, 128, 214));
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                .title-text {
                    color: white;
                    text-shadow: 5px 5px 0 #4074b5, 2px -2px 0 #4074b5, -2px 2px 0 #4074b5, -2px -2px 0 #4074b5, 2px 0px 0 #4074b5, 0px 2px 0 #4074b5, -2px 0px 0 #4074b5, 0px -2px 0 #4074b5;
                }
            }


            div.user-react {
                height: 15vh;
                width: 100%;
                background-color: aliceblue;

                .title {

                    .uricon {
                        background-image: url('/data.png');
                    }

                    .title-text {
                        font-size: calc(1vw + 0.5vh);
                        font-weight: 600;
                        text-align: center;
                        line-height: 5vh;
                        letter-spacing: 0.1vw;
                    }
                }

                .buttons {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-evenly;

                    .button {
                        background-color: #4c97fa;
                        padding: .3vh;
                        border-radius: 0.5vh;
                        border-color: white;
                        border-width: 0.5vh;
                        height: 3vh;
                        width: 8vw;
                        color: white;
                        font-size: calc(0.8vw + 0.5vh);
                        font-weight: 600;
                        margin-left: 1vw;
                        margin: .7vh;
                        text-align: center;

                        &:hover {
                            cursor: pointer;
                            background-color: #0642b1;
                            transform: scale(1.01);
                            box-shadow: #00183d 0px 0px 5px 0px;
                            transition: .2s ease-in;
                        }
                    }
                }
            }

            div.data-panel {
                height: 35vh;
                width: 100%;

                .title {

                    .dpicon {
                        background-image: url('/data-collection2.png');
                    }

                    .title-text {
                        font-size: calc(1vw + 0.5vh);
                        font-weight: 600;
                        text-align: center;
                        line-height: 5vh;
                    }
                }


                .dp-content {
                    height: 30vh;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    padding: 1vh;

                    &::-webkit-scrollbar {
                        width: 8px;
                    }

                    &::-webkit-scrollbar-track {
                        background-color: rgba(6, 181, 197, 0.219);
                    }

                    &::-webkit-scrollbar-thumb {
                        background-color: #15a1e294;
                        border-radius: 5px;
                    }

                    &::-webkit-scrollbar-thumb:hover {
                        background-color: #3af0f781;
                    }
                }
            }

            div.layer-panel {
                height: 30%;
                width: 100%;

                .title {

                    .lpicon {
                        background-image: url('/icons/layers.png');
                    }

                    .title-text {
                        font-size: calc(1vw + 0.5vh);
                        font-weight: 600;
                        text-align: center;
                        line-height: 5vh;
                    }
                }

                .lp-content {
                    height: 25vh;


                    .checkBox {
                        height: 20vh;
                        margin-top: 3vh;
                        display: block;
                        overflow-x: hidden;
                        overflow-y: auto;

                        &::-webkit-scrollbar {
                            width: 8px;
                        }

                        &::-webkit-scrollbar-track {
                            background-color: rgba(6, 181, 197, 0.219);
                        }

                        &::-webkit-scrollbar-thumb {
                            background-color: #15a1e294;
                            border-radius: 5px;
                        }

                        &::-webkit-scrollbar-thumb:hover {
                            background-color: #3af0f781;
                        }

                        .el-checkbox-group {
                            // background-color: aliceblue;

                            .el-checkbox {
                                padding-left: 2vw;
                                margin: 0px;
                                display: block;
                                color: #000000;

                                :deep() .el-checkbox__input {
                                    transform: translateY(2px);
                                }

                                :deep().el-checkbox__label {
                                    text-shadow: 1px 1px 0 #dfdada;
                                    color: #00183d;

                                }
                            }
                        }
                    }
                }
            }
        }

        div.detail-page {
            width: 20vw;
            height: calc(87.4vh - 8vh);
            display: flex;
            scale: 0.95;
            translate: 0% -3.5%;

            // transform: translateY(-1%);
        }

    }


    div.map-container {
        position: relative;
        width: 80vw;
        height: 86vh;

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

.model-title-container {
    z-index: 5;
    background: linear-gradient(45deg, rgb(91, 219, 209), rgb(35, 119, 247));
}

.analysisCenter {
    width: calc(100vw);
    height: calc(100vh);
    top:0vh;
    position: fixed;
    z-index: 0;
    background-color: aliceblue;

    .background{
        // background-color: radial-gradient(circle, rgb(16, 2, 84) 0%, rgb(16, 31, 128) 40%, rgb(13, 80, 147) 80%, rgb(0, 134, 255) 100%);
        background-color: #0642b1;
        position: fixed;
        top: 0;
        height: 8.2vh;
        width: 100vw;
        z-index: 5;
    }
    iframe{
        position: relative;

        border-width: 0;
    }
}

.conditions,
.uploadModel,
.stParams {
    animation: fadenum .3s ease-in-out;
    box-shadow: rgb(184, 209, 255) 0px 5px 15px;
    border-radius: 1vh;

}

@keyframes fadenum {
    0% {
        opacity: 0;
        scale: 0;
    }

    100% {
        opacity: 1;
        scale: 1;
    }
}

:deep(.el-tree-node__label) {
    font-size: calc(0.6vw + 0.5vh);
    font-weight: 800;
}

:deep(.el-tree .el-tree-node__expand-icon.expanded) {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
}

:deep(.el-checkbox__label) {
    font-size: calc(0.6vw + 0.5vh);
}
</style>