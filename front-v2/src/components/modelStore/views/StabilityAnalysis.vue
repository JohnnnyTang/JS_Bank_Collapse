<template>
    <div class="stability-analysis">
        <ModelTitleVue :ModelName="'近岸动力分析模型'" />
        <div class="main-content">

            <div class="side-bar">
                <div class="model-content">
                    <div class="condition-content hover-large">
                        <div class="steps">
                            <el-steps :style="elStepsStyle" :active="conditionStep" direction="horizontal"
                                finish-status="success">
                                <el-step title="新建算例" description="" />
                                <el-step title="计算条件配置" description="" />
                                <el-step title="模型计算" description="" />
                            </el-steps>
                        </div>
                        <div class="new-item-block" v-show="conditionStep == 0">

                            <el-input v-model="modelInstanceName" style="width: 50%; height: 100%; margin-right: 10%;"
                                placeholder="请输入算例名称" />

                            <!-- <el-button type="primary" plain> </el-button> -->
                            <div class="create-model-ins-button"> 新建算例</div>

                        </div>

                        <div class="condition-source-block" v-show="conditionStep == 0">
                            <div class="condition-card">
                                <div class="top">
                                    <div class="set-icon"></div>
                                </div>
                                <div class="center">
                                    内置计算条件
                                </div>
                                <div class="bot">
                                    使用预置的计算条件,避免模型运行产生预期之外的结果
                                </div>
                                <button class="condition-button" @click="conditionSourceIndex = 0"
                                    :class="{ 'active': conditionSourceIndex === 0 }">
                                    {{ conditionSourceIndex === 0 ? '已选择' : '未选择' }}
                                </button>
                            </div>

                            <div class="condition-card">
                                <div class="top">
                                    <div class="set-icon"></div>
                                </div>
                                <div class="center">
                                    上传计算条件
                                </div>
                                <div class="bot">
                                    使用自定义条件源，上传自定义计算条件以运行模型
                                </div>
                                <button class="condition-button" @click="conditionSourceIndex = 1"
                                    :class="{ 'active': conditionSourceIndex === 1 }">
                                    {{ conditionSourceIndex === 1 ? '已选择' : '未选择' }}
                                </button>

                            </div>

                        </div>

                        <div class="condition-set-block" v-show="conditionStep == 1">
                            <div class="description">您选择的是
                                <span style="font-weight: 700;">{{ conditionSourceIndex === 0 ? '默认计算条件源' : '自定义条件源'
                                }}</span>
                                ，请配置相应计算条件。
                            </div>

                            <div class="condition-set-upload" v-show="conditionSourceIndex === 1">
                                <el-upload class="upload-class" drag
                                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">
                                        拖拽文件或 <em>点击此处进行上传</em>
                                    </div>
                                </el-upload>
                            </div>

                            <div class="condition-set-default" v-show="conditionSourceIndex === 0">
                                <div class="condition-card">
                                    <div class="set-icon"></div>
                                    <div class="center">
                                        实时水文条件
                                    </div>
                                    <div class="realtime-water-condition">
                                        <div class="water-condition-item">
                                            <span class="water-condition-title">流量</span>
                                            ：
                                            <span class="water-condition-value">84000</span>
                                        </div>
                                        <div class="water-condition-item">
                                            <span class="water-condition-title">潮差</span>
                                            ：
                                            <span class="water-condition-value">2.1</span>
                                        </div>
                                    </div>
                                    <button class="condition-button" @click="conditionSetIndex = 0"
                                        :class="{ 'active': conditionSetIndex === 0 }">
                                        {{ conditionSetIndex === 0 ? '已选择' : '未选择' }}

                                    </button>

                                </div>

                                <div class="condition-card">
                                    <div class="set-icon"></div>
                                    <div class="center">
                                        特定水文条件
                                    </div>
                                    <div class="realtime-water-condition">
                                        <div class="water-condition-item">
                                            <span class="water-condition-title">流量</span>
                                            ：

                                            <el-input v-model="conditionSetInputFLOW" style="width: 65%; height: 70%;"
                                                placeholder="请输入流量" />

                                        </div>
                                        <div class="water-condition-item">
                                            <span class="water-condition-title">潮差</span>
                                            ：

                                            <el-input v-model="conditionSetInputTIDE" style="width: 65%; height: 70%;"
                                                placeholder="请输入潮差" />

                                        </div>
                                    </div>
                                    <button class="condition-button" @click="conditionSetIndex = 1"
                                        :class="{ 'active': conditionSetIndex === 1 }">
                                        {{ conditionSetIndex === 1 ? '已选择' : '未选择' }}
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div class="condition-run-block" v-show="conditionStep == 2 || conditionStep == 3">
                            <div class="model-ins-info">
                                <div class="model-ins-icon"></div>
                                <div class="model-int-block">
                                    <div class="model-ins-flow">名称：{{ modelInstanceName }} </div>
                                    <div class="model-ins-flow">流量：xxx </div>
                                    <div class="model-ins-tide">潮差：2.5 </div>
                                    <div class="model-ins-status">状态：运行中 </div>
                                </div>
                                <div class="model-ins-time">2021-08-01 12:00:00</div>
                            </div>


                            <div class="progress-bar">
                                <el-progress style="margin-top: 1.5vh;" :percentage="runningProgress" :stroke-width="15" striped />
                            </div>
                        </div>

                        <div class="condition-next-button" v-show="conditionStep < 2" @click="nextStepButtonClick">下一步</div>
                        <div class="condition-next-button" v-show="conditionStep >= 2" @click="nextStepButtonClick"
                            :class="{ 'active': modelRunning }">计算</div>

                        <div class="condition-last-button" v-show="conditionStep > 0 && conditionStep < 3"
                            @click="conditionStep = (conditionStep - 1) % 4">上一步</div>

                        <div class="condition-last-button" v-show="conditionStep == 3"
                            @click="conditionStep = 0; runningProgress = 0;">重置</div>



                    </div>
                    <div class="data-content hover-large">
                        <div class="input-content">
                            <div class="title">模型输入集</div>
                            <div class="tree">
                                <el-scrollbar height="100%">
                                    <el-tree :style="elTreeStyle" :data="inputDataSet" :props="defaultProps"
                                        @node-click="handleNodeClick" />
                                </el-scrollbar>

                            </div>
                        </div>
                        <div class="output-content">
                            <div class="title">模型输出集</div>
                            <div class="tree">
                                <el-scrollbar height="100%">
                                    <el-tree :style="elTreeStyle" :data="outputDataSet" :props="defaultProps"
                                        @node-click="handleNodeClick" hide-on-click>
                                        <template #default="{ node, data }">
                                            <div class="model-out-node" style="width: 100%">
                                                <el-dropdown @command="" placement="bottom-end" ref="dropDownRef"
                                                    trigger="click" style="width: 100%">
                                                    <div class="el-dropdown-link" style="width: 100%">
                                                        {{ node.label }}
                                                    </div>
                                                    <template #dropdown v-if="data.type === 'onlyDownload'">
                                                        <el-dropdown-menu>
                                                            <el-dropdown-item command="download">● 下载</el-dropdown-item>
                                                            <el-dropdown-item command="delete">● 删除</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </template>
                                                    <template #dropdown v-if="data.type === 'visualAndDownLoad'">
                                                        <el-dropdown-menu>
                                                            <el-dropdown-item command="visualize">● 可视化</el-dropdown-item>
                                                            <el-dropdown-item command="download">● 下载</el-dropdown-item>
                                                            <el-dropdown-item command="delete">● 删除</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </template>
                                                </el-dropdown>
                                            </div>
                                        </template>
                                    </el-tree>
                                </el-scrollbar>

                            </div>
                        </div>

                    </div>
                    <div class="layer-content hover-large">

                        <div class="layer-tree-content">
                            <el-tree :style="elTreeStyle" :data="layerTreeDataSet" node-key="id" accordion
                                :expand-on-click-node="false">
                                <template #default="{ node, data }">
                                    <span class="compute-exmple-node" v-if="data.children">
                                        <span class="normal-node-lable" style="font-weight: bold;">{{ node.label }}</span>
                                    </span>

                                    <span class="layer-node" v-else>
                                        <span class="normal-node-lable">{{ node.label }}</span>
                                        <span>
                                            <el-icon style="margin-right: 1vw;" @click="showLayer(node, data)"
                                                v-if="data.view === 'hide'">
                                                <View />
                                            </el-icon>
                                            <el-icon style="margin-right: 1vw;" @click="hideLayer(node, data)" v-else>
                                                <Hide />
                                            </el-icon>
                                            <el-icon @click="removeLayer(node, data)">
                                                <Close />
                                            </el-icon>
                                        </span>
                                    </span>
                                </template>
                            </el-tree>
                        </div>
                        <div class="layer-title">
                            图层控制
                        </div>
                    </div>
                </div>
            </div>
            <div class="map-content">
                <div id="map" ref="mapRef"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ModelTitleVue from '../ModelTitle.vue'
import { ref, onMounted } from 'vue'
import { initPureScratchMap } from '../../../utils/mapUtils';
import { useMapStore } from '../../../store/mapStore';


const elStepsStyle = {
    'width': '100%'
}
const elTreeStyle = {
    'width': '100%',
    'height': '100%',
    'background-color': 'transparent'
}
const conditionStep = ref(0)


const mapRef = ref(null)
const dropDownRef = ref(null)
const mapStore = useMapStore()
const conditionSourceIndex = ref(0)
const conditionSetIndex = ref(0)
const runningProgress = ref(0)
const modelRunning = ref(false)
const modelInstanceName = ref('')
const conditionSetInputFLOW = ref('')
const conditionSetInputTIDE = ref('')

const defaultProps = {
    children: 'children',
    label: 'label',
}
const inputDataSet = [
    {
        label: '算例1条件集',
        children: [
            {
                label: 'fort.13',
            },
            {
                label: 'fort.14',
            },
            {
                label: 'fort.15',
            },
            {
                label: 'fort.16',
            },
            {
                label: 'fort.19',
            },
            {
                label: 'fort.20',
            },
        ],
    },
    {
        label: '算例2条件集',
        children: [
            {
                label: 'fort.13',
            },
            {
                label: 'fort.14',
            },
            {
                label: 'fort.15',
            },
            {
                label: 'fort.16',
            },
            {
                label: 'fort.19',
            },
            {
                label: 'fort.20',
            },
        ],
    },

]
const outputDataSet = [
    {
        label: '算例1结果集',
        children: [
            {
                type: 'onlyDownload',
                label: 'fort.61',
            },
            {
                type: 'onlyDownload',

                label: 'fort.62',
            },
            {
                type: 'visualAndDownLoad',
                label: 'fort.63',
            },
            {
                type: 'visualAndDownLoad',
                label: 'fort.64',
            },
            {
                type: 'onlyDownload',
                label: 'fort.80',
            }
        ],
    },
    {
        label: '算例2结果集',
        children: [
            {
                type: 'onlyDownload',
                label: 'fort.61',
            },
            {
                type: 'onlyDownload',

                label: 'fort.62',
            },
            {
                type: 'visualAndDownLoad',
                label: 'fort.63',
            },
            {
                type: 'visualAndDownLoad',
                label: 'fort.64',
            },
            {
                type: 'onlyDownload',
                label: 'fort.80',
            }
        ],
    },

]
const fileList = ref([
    {
        name: 'fort.14',
        url: 'https://element-plus.org/images/element-plus-logo.svg',
    },
])

const findNode = (nodes, nodeId) => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
            return nodes[i];
        } else if (nodes[i].children && nodes[i].children.length) {
            const found = findNode(nodes[i].children, nodeId);
            if (found) return found;
        }
    }
    return null;
}

const removeNode = (nodes, nodeId) => {
    const node = findNode(nodes, nodeId);
    if (node) {
        const parent = node.parent;
        parent.children = parent.children.filter(item => item.id !== nodeId);
    }
}

const handleRemove = (file, uploadFiles) => {
    console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
    console.log(uploadFile)
}

const handleExceed = (files, uploadFiles) => {
    ElMessage.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
        } totally`
    )
}

const beforeRemove = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(
        `Cancel the transfer of ${uploadFile.name} ?`
    ).then(
        () => true,
        () => false
    )
}

const nextStepButtonClick = (e) => {
    if (modelRunning.value) return;

    if (conditionStep.value < 2) {
        conditionStep.value = (conditionStep.value + 1) % 3
    } else if (conditionStep.value >= 2) {

        let fake = 0;
        modelRunning.value = true;
        let interval = setInterval(() => {
            fake += 10;
            runningProgress.value = fake;
            if (fake >= 100) {
                clearInterval(interval)
                conditionStep.value = 3
                modelRunning.value = false;
            }
        }, 500)
    }
}

const layerTreeDataSet = ([
    {
        id: 1,
        label: '算例1',
        children: [
            {
                id: 4,
                label: '潮位场-1',
                view: 'hide'
            },
            {
                id: 4,
                label: '流场-1',
                view: 'hide'
            },
        ],
    },
    {
        id: 1,
        label: '算例2',
        children: [
            {
                id: 4,
                label: '潮位场-2',
                view: 'hide'

            },
            {
                id: 4,
                label: '流场-2',
                view: 'hide'

            },
        ],
    },
    {
        id: 1,
        label: '算例3',
        children: [
            {
                id: 4,
                label: '潮位场-3',
                view: 'hide'
            },
            {
                id: 4,
                label: '流场-3',
                view: 'hide'
            },
        ],
    },
])

const handleNodeClick = (data) => {
    // console.log(data)
}
const showLayer = (node, data) => {
    // console.log(data);
    console.log(node, data)
    node.data.view = 'show'
}

const hideLayer = (node, data) => {
    node.data.view = 'hide'

}
const removeLayer = (node, data) => {

    removeNode(layerTreeDataSet, data.id)

}


onMounted(async () => {
    let map = await initPureScratchMap(mapRef.value)
    mapStore.setMap(map)

})



</script>

<style lang="scss" scoped>
div.stability-analysis {
    margin: 0;
    padding: 0;
    display: absolute;
    top: 8vh;
    width: 100vw;
    height: 92vh;
    // background: linear-gradient(45deg, rgb(91, 219, 209), rgb(35, 119, 247));
    background-color: #dbf3ff;
    user-select: none;

    div.main-content {
        position: relative;
        height: 95%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;

        div.side-bar {
            position: relative;
            height: 97%;
            width: 28%;
            border-radius: 2%;
            border-color: rgb(0, 116, 170);
            border-width: calc(0.2vw + 0.1vh);
            border-style: solid;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;


            div.model-content {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                // 

                div.condition-content {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 96%;
                    height: 35%;

                    margin-top: 1%;
                    border-color: #1679AB;
                    border-width: calc(0.1vw + 0.2vh);
                    border-style: dashed;
                    background-color: rgb(255, 250, 250);
                    transition: .5s;

                    div.steps {
                        position: relative;
                        width: 90%;
                        height: 27%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    div.new-item-block {
                        width: 90%;
                        height: 10%;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        padding-bottom: 1vh;

                        border-bottom: #055279;
                        border-bottom-width: 2px;
                        border-bottom-style: solid;

                        .create-model-ins-button {
                            position: relative;
                            height: 3vh;
                            width: 5vw;
                            line-height: 3vh;
                            text-align: center;
                            border-radius: 3px;
                            font-weight: bold;
                            color: #055279;
                            font-size: calc(0.5vw + 0.6vh);
                            background-color: #e6f7ff;
                            box-shadow: rgba(0, 132, 255, 0.8) 1px 1px, rgba(0, 119, 255, 0.7) 2px 2px, rgba(0, 119, 255, 0.6) 3px 4px;
                            transition: .3s;

                            &:hover {
                                cursor: pointer;
                                background-color: rgba(81, 166, 247, 0.8);
                                color: #e6f7ff // box-shadow: #e6f7ff 1px 1px, #e6f7ff 2px 2px, #e6f7ff 3px 4px;

                            }
                        }
                    }

                    div.condition-source-block {
                        position: relative;
                        width: 100%;
                        height: 60%;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-evenly;

                        // background-color: rgb(221, 243, 253);
                        .condition-card {
                            position: relative;
                            margin-top: 2%;
                            width: 44%;
                            height: 70%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-evenly;
                            // align-items: center;

                            background-color: rgb(255, 255, 255);
                            border-radius: calc(0.4vw + 0.4vh);
                            box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
                            // margin-right: 2vw;
                            // margin-left: 2vw;

                            .top {
                                position: relative;
                                // height: 10%;
                                height: 0%;
                                width: 100%;

                                .set-icon {
                                    position: absolute;
                                    right: 0.2vw;
                                    top: 0.5vh;
                                    width: 4.5vh;
                                    height: 4.5vh;
                                    background-size: contain;
                                    background-repeat: no-repeat;
                                    background-image: url('/set.png');

                                }
                            }

                            .center {
                                position: relative;
                                height: 45%;
                                width: 100%;
                                color: #055279;
                                font-weight: 800;
                                font-size: calc(0.8vw + 0.7vh);
                                padding-left: 0.4vw;
                                padding-top: 1.2vh;
                            }

                            .bot {
                                position: relative;
                                height: 55%;
                                width: 80%;
                                padding-left: 0.5vw;
                                font-size: calc(0.45vw + 0.4vh);
                            }

                            button.condition-button {
                                position: absolute;
                                right: 0;
                                bottom: 0;
                                width: 3vw;
                                height: 3vh;
                                background: rgba(194, 193, 193, 0.493);
                                color: #055279;
                                font-family: inherit;
                                padding: 0.2em 0.4em;
                                font-weight: 900;
                                font-size: calc(0.3vw + 0.7vh);
                                border: 1px solid rgb(3, 107, 167);
                                border-radius: 0.4em;
                                box-shadow: 0.1em 0.1em;
                                cursor: pointer;
                            }

                            button.condition-button.active {
                                background: #0254bed0;
                                color: #fff;
                            }
                        }

                    }

                    div.condition-set-block {
                        position: relative;
                        width: 100%;
                        height: 80%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: start;

                        div.description {
                            position: relative;
                            width: 100%;
                            height: 12%;
                            padding-left: 1vw;
                            font-size: calc(0.5vw + 0.6vh);
                        }

                        div.condition-set-upload {
                            position: relative;
                            width: 100%;
                            height: 88%;
                            display: flex;
                            justify-content: center;
                            align-items: flex-start;

                            .upload-class {
                                position: relative;

                                :deep(.el-upload-dragger) {
                                    position: relative;
                                    height: 5vh;
                                    width: 20vw;
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: space-evenly;

                                    .el-icon.el-icon--upload {
                                        font-size: calc(1vw + 1vh);
                                        height: 0.5vh;
                                    }

                                    .el-upload__text {
                                        align-self: center;
                                    }
                                }
                            }

                        }

                        div.condition-set-default {
                            position: relative;
                            width: 100%;
                            height: 80%;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-evenly;

                            .condition-card {
                                position: relative;
                                width: 44%;
                                height: 80%;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-evenly;
                                // align-items: center;

                                background-color: rgb(255, 255, 255);
                                border-radius: calc(0.4vw + 0.4vh);
                                box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
                                // margin-right: 2vw;
                                // margin-left: 2vw;


                                .set-icon {
                                    position: absolute;
                                    right: 0.2vw;
                                    top: 0.5vh;
                                    width: 4.5vh;
                                    height: 4.5vh;
                                    background-size: contain;
                                    background-repeat: no-repeat;
                                    background-image: url('/set.png');

                                }

                                .center {
                                    position: relative;
                                    height: 40%;
                                    width: 100%;
                                    color: #055279;
                                    font-weight: 800;
                                    font-size: calc(0.8vw + 0.7vh);
                                    padding-left: 0.4vw;
                                    padding-top: 1.2vh;
                                }

                                .realtime-water-condition {
                                    position: relative;
                                    height: 60%;
                                    width: 80%;
                                    padding-left: 0.5vw;
                                    font-size: calc(0.45vw + 0.4vh);

                                    .water-condition-item {
                                        position: relative;
                                        width: 85%;
                                        height: 50%;
                                        // background-color: blue;

                                        .water-condition-title {
                                            font-weight: 800;
                                            font-size: calc(0.5vw + 0.6vh);
                                        }

                                        .water-condition-value {}

                                        input.water-condition-input {
                                            width: 50%;
                                        }
                                    }
                                }

                                button.condition-button {
                                    position: absolute;
                                    right: 0;
                                    bottom: 0;
                                    width: 3vw;
                                    height: 3vh;
                                    background: rgba(194, 193, 193, 0.493);
                                    color: #055279;
                                    font-family: inherit;
                                    padding: 0.2em 0.4em;
                                    font-weight: 900;
                                    font-size: calc(0.3vw + 0.7vh);
                                    border: 1px solid rgb(3, 107, 167);
                                    border-radius: 0.4em;
                                    box-shadow: 0.1em 0.1em;
                                    cursor: pointer;
                                }

                                button.condition-button.active {
                                    background: #0254bed0;
                                    color: #fff;
                                }
                            }
                        }

                    }

                    div.condition-run-block {
                        position: relative;
                        width: 100%;
                        height: 80%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-evenly;
                        align-items: center;
                        // background-color: red;

                        .model-ins-info {
                            position: relative;
                            width: 80%;
                            height: 50%;
                            box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;

                            .model-ins-icon {
                                position: absolute;
                                width: 6vh;
                                height: 6vh;
                                background-size: contain;
                                background-repeat: no-repeat;
                                background-image: url('/modelIns.png');
                                top: 50%;
                                transform: translateY(-50%);
                                left: 0.6vw;
                            }

                            .model-int-block {
                                position: absolute;
                                left: 20%;
                                top: 8%;
                                width: 78%;
                                height: 90%;

                            }

                            .model-ins-time {
                                position: absolute;
                                right: 2%;
                                top: 2%;

                                // width: 70%;
                                // height: 90%;
                            }

                        }

                        .progress-bar {
                            position: relative;
                            width: 90%;
                            height: 40%;
                        }

                    }

                    .condition-next-button {
                        position: absolute;
                        right: 1vw;
                        bottom: 1vh;
                        height: 3vh;
                        width: 4vw;
                        line-height: 3.3vh;
                        text-align: center;
                        border-radius: 6px;
                        font-weight: bold;
                        color: #055279;
                        font-size: calc(0.5vw + 0.6vh);
                        background-color: #e6f7ff;
                        box-shadow: rgba(0, 132, 255, 0.8) 1px 1px, rgba(0, 119, 255, 0.7) 2px 2px, rgba(0, 119, 255, 0.6) 3px 4px;
                        transition: .3s;

                        &:hover {
                            cursor: pointer;
                            background-color: rgba(81, 166, 247, 0.8);
                            color: #e6f7ff // box-shadow: #e6f7ff 1px 1px, #e6f7ff 2px 2px, #e6f7ff 3px 4px;

                        }
                    }

                    .condition-next-button.active {
                        background-color: rgba(81, 166, 247, 0.8);
                        color: #e6f7ff;
                        cursor: not-allowed;
                    }

                    .condition-last-button {
                        position: absolute;
                        left: 1vw;
                        bottom: 1vh;
                        height: 3vh;
                        width: 4vw;
                        line-height: 3.3vh;
                        text-align: center;
                        border-radius: 6px;
                        font-weight: bold;
                        color: #055279;
                        font-size: calc(0.5vw + 0.6vh);
                        background-color: #e6f7ff;
                        box-shadow: rgba(0, 132, 255, 0.8) 1px 1px, rgba(0, 119, 255, 0.7) 2px 2px, rgba(0, 119, 255, 0.6) 3px 4px;
                        transition: .3s;

                        &:hover {
                            cursor: pointer;
                            background-color: rgba(81, 166, 247, 0.8);
                            color: #e6f7ff // box-shadow: #e6f7ff 1px 1px, #e6f7ff 2px 2px, #e6f7ff 3px 4px;

                        }
                    }

                }

                div.data-content {
                    position: relative;
                    height: 30%;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-evenly;
                    align-items: center;
                    transition: .5s;


                    div.input-content {
                        position: relative;
                        width: 47.5%;
                        height: 100%;
                        //box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
                        background-color: rgb(255, 255, 255);
                        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
                        border-radius: calc(0.3vw + 0.3vh);
                        border-width: calc(0.1vw + 0.15vh);
                        border-color: #1679AB;
                        border-style: dashed;
                    }

                    div.output-content {
                        position: relative;
                        width: 47.5%;
                        height: 100%;
                        background-color: rgb(255, 255, 255);
                        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
                        border-radius: calc(0.3vw + 0.3vh);
                        border-width: calc(0.1vw + 0.15vh);
                        border-color: #1679AB;
                        border-style: dashed;

                    }


                    .title {
                        position: absolute;
                        top: 5%;
                        left: 30%;
                        transform: translateX(-50%) translateY(-50%);
                        height: 4vh;
                        line-height: 4vh;
                        text-align: center;
                        background-color: rgb(61, 116, 199);
                        color: rgb(255, 255, 255);
                        font-size: calc(0.6vw + 0.5vh);
                        font-weight: bold;
                        letter-spacing: 0.01rem;
                        padding-left: 0.8vw;
                        padding-right: 0.8vw;
                    }

                    .tree {
                        position: relative;
                        width: 85%;
                        height: 80%;
                        margin-top: 15%;
                        margin-left: 5%;

                    }

                }

                div.layer-content {
                    position: relative;
                    height: 30%;
                    width: 96%;
                    display: flex;
                    justify-content: center;
                    transition: .5s;
                    border-color: #1679AB;
                    border-width: calc(0.1vw + 0.2vh);
                    border-style: dashed;
                    background-color: rgb(255, 255, 255);

                    div.layer-tree-content {
                        position: relative;
                        margin-top: 5%;
                        width: 97%;
                        height: 85%;



                        .compute-exmple-node {
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;

                        }

                        .layer-node {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            // font-size: calc(0.5vw + 0.5vh);
                            padding-right: 1vw;
                        }


                        .normal-node-lable {
                            font-size: calc(0.5vw + 0.5vh);
                            color: rgb(40, 40, 48);
                            letter-spacing: 0.01rem;
                        }

                    }

                    div.layer-title {
                        position: absolute;
                        top: 3%;
                        left: 50%;
                        transform: translateX(-50%) translateY(-50%);
                        height: 4vh;
                        line-height: 4vh;
                        text-align: center;
                        background-color: rgb(61, 116, 199);
                        color: rgb(255, 255, 255);
                        font-size: calc(0.8vw + 0.5vh);
                        font-weight: bold;
                        letter-spacing: 0.01rem;
                        padding-left: 0.8vw;
                        padding-right: 0.8vw;
                    }

                }

                // .hover-large{
                //     transition: .5s;
                //     &:hover{
                //         scale: 1.01;
                //     }
                // }
            }

        }

        div.map-content {
            position: relative;
            flex-grow: 0;
            height: 97%;
            width: 70.5%;
            // border-radius: 2%;
            border-color: rgb(0, 116, 170);
            border-width: calc(0.2vw + 0.2vh);
            border-style: double;

            div#map {
                // position: absolute;
                // left: 50%;
                // top: 50%;
                // width: 99%;
                // height: 99%;
                // transform: translateX(-50%) translateY(-50%);
                position: relative;
                width: 100%;
                height: 100%;
                background-color: #fff;

            }
        }


    }
}
</style>