<template>
    <div class="container">
        <div class="zoom-button-container">
            <el-button type="primary" @click="treeZoomIn">Zoom In</el-button>
            <el-button type="primary" @click="treeZoomOut">Zoom Out</el-button>
            <el-button type="primary" @click="treeZoomInit">Init</el-button>
        </div>
        <vue-tree style="width: 98vw; height: 98vh; border: 1px solid gray;" :dataset="sampleData" :config="treeConfig"
            @mousewheel="treeMouseWheel" ref="nodeTree">
            <template v-slot:node="{ node, collapsed }">
                <!-- <span class="tree-node" :style="{ border: collapsed ? '2px solid grey' : '' }">{{ node.value }}</span> -->
                <div class="tree-node-container">
                    <div :class="mapNodeStyle(node)">
                        <div class="node-title-text">{{ CommonUtils.humpToHyphen(node.node.name, ' ') }}</div>
                    </div>
                    <el-dropdown :trigger="['contextmenu']" ref="dropdownRef" class="node-drop-down">
                        {{ CommonUtils.humpToHyphen(node.node.name, ' ') }}
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="getNodeInfo(node.node)">
                                    <el-icon>
                                        <InfoFilled />
                                    </el-icon>Info
                                </el-dropdown-item>
                                <el-dropdown-item @click="getNodeData(node.node)">
                                    <el-icon>
                                        <Coin />
                                    </el-icon>Data
                                </el-dropdown-item>
                                <el-dropdown-item v-if="checkIfCanAddNode(node)">
                                    <el-icon>
                                        <Coin />
                                    </el-icon>Add Child
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <!-- <div class="manage-container">
                        <div class="node-info">Info</div>
                        <div class="node-data">Data</div>
                    </div> -->
                </div>
            </template>
        </vue-tree>
        <el-drawer v-model="nodeDrawerShow" direction="rtl" size="24%" @closed="drawerClosed" ref="drawerRef">
            <template #header style="margin-bottom: 0;">
                <h4 style="font-size: larger;">{{ drawerName }}</h4>
            </template>
            <template #default>
                <el-radio-group v-if="typeRadioShow" @change="typeRadioChange" v-model="dataTypeRadio">
                    <el-radio label="Raw" size="large">Raw</el-radio>
                    <el-radio label="GeoJSON" size="large">GeoJSON</el-radio>
                </el-radio-group>
                <div class="data-container">
                    <el-form label-position="top" :model="infoFormInput" style="max-width: 460px"
                        v-if="drawerInfoTypeEnum == 1">
                        <el-form-item label="Name">
                            <el-input v-model="infoFormInput.name" />
                        </el-form-item>
                        <el-form-item label="Database Origin">
                            <el-input v-model="infoFormInput.database" />
                        </el-form-item>
                        <el-form-item label="Targeted bank">
                            <el-input v-model="infoFormInput.bank" />
                        </el-form-item>
                        <el-form-item label="Category">
                            <el-input v-model="infoFormInput.category" />
                        </el-form-item>
                        <el-form-item label="Authority">
                            <el-input v-model="infoFormInput.authority" />
                        </el-form-item>
                    </el-form>
                    <div class="single-data-container node-data-container" v-else-if="drawerInfoTypeEnum == 2">
                        <el-scrollbar height="80vh">
                            <!-- <div v-for="nodeData of nodeDataList" class="single-data-kv">
                                <div v-for="(value, key, index) in nodeData" class="a-data-column">
                                    <div class="data-item-key">{{ key }}</div>
                                    <div class="data-item-value">{{ value }}</div>
                                </div>
                                <el-divider border-style="double" />
                            </div> -->
                            <el-descriptions :column="2" border v-for="nodeData of nodeDataList"
                                style="margin-bottom: 20px;" v-if="dataTypeRadio == 'Raw'">
                                <el-descriptions-item v-for="(value, key, index) in nodeData" :label="key"
                                    label-align="right" align="center" label-class-name="data-desc-key"
                                    class-name="data-desc-value">{{ value }}</el-descriptions-item>
                            </el-descriptions>
                            <JsonViewer v-else :value="geojsonData" copyable boxed :expanded="jsonExpanded" :expand-depth=5 />
                        </el-scrollbar>
                    </div>
                    <div class="multiple-data-container node-data-container" v-else>
                        <el-scrollbar height="80vh">
                            <!-- <div v-for="nodeData of nodeDataList" class="single-data-kv">
                                <div v-for="(value, key, index) in nodeData">
                                    <div>{{ key }}</div>
                                    <div>{{ value }}</div>
                                </div>
                            </div> -->
                            <el-table :data="nodeDataList" height="80vh" style="width: 100%" stripe="true" border="true" highlight-current-row="true">
                                <el-table-column v-for="(value, key, index) in nodeDataList[0]"  :prop="key" :label="key" width="160"/>
                                <!-- <el-table-column prop="date" label="Date" width="180" />
                                <el-table-column prop="name" label="Name" width="180" />
                                <el-table-column prop="address" label="Address" /> -->
                            </el-table>
                        </el-scrollbar>
                    </div>
                </div>
            </template>
            <template #footer>
                <div style="flex: auto" v-show="footerShow">
                    <el-button @click="cancelClick">cancel</el-button>
                    <el-button type="primary" @click="confirmClick">confirm</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import VueTree from '@ssthouse/vue3-tree-chart';
import TreeChartCore, {
    // DEFAULT_NODE_WIDTH,
    // DEFAULT_NODE_HEIGHT,
    // DEFAULT_LEVEL_HEIGHT,
    TreeLinkStyle,
    Direction,
} from "@ssthouse/tree-chart-core";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";
import { onMounted, ref, reactive } from 'vue';
import BackEndRequest from '../api/backendIns.js';
import CommonUtils from '../utils/CommonUtils.js';
import { InfoFilled, Coin } from '@element-plus/icons-vue';

const MATCH_SCALE_REGEX = /scale\((\S*)\)/i;
const MATCH_TRANSLATE_REGEX = /translate\((-?\d+)px, ?(-?\d+)px\)/i;
const MATCH_TRANSFORMORIGIN_REGEX = /(-?\d+)px ?(-?\d+)px/i;


const nodeTree = ref(null);

let curNodeInfo = null;

const drawerRef = ref();
const nodeDrawerShow = ref(false);
const drawerName = ref("Node Name Here")
const dataTypeRadio = ref("Raw")
const typeRadioShow = ref(true);
const footerShow = ref(true);
const geojsonData = ref({});

const jsonExpanded = ref(true);
// const dataContent = ref("");

// 1: info 2: item data 3: rows of data
const drawerInfoTypeEnum = ref(1);
const nodeDataList = ref([{}])

let treeChartCore = null;

let sampleData = ref({
    name: 'Data Node',
    "node": {
        "apiPrefix": "",
        "auth": "all",
        "bank": "all",
        "category": "DataNode",
        "id": "659bee3062838e7ac7ee21a1",
        "linkCode": "",
        "name": "dataNode",
        "path": "",
        "usage": {}
    },
    children: []
})

const infoFormInput = reactive({
    name: '',
    database: '',
    bank: '',
    category: '',
    authority: '',
})

function typeRadioChange(curLabel) {
    console.log(curLabel);
    if(curLabel == "GeoJSON") {
        geojsonData.value = CommonUtils.staticInfoData2GeoJson(nodeDataList.value);
    }
}


let getTranslate = () => {
    let string = treeChartCore.svgElement.style.transform;
    let match = string.match(MATCH_TRANSLATE_REGEX);
    if (match === null) {
        return [null, null];
    }
    let x = parseInt(match[1]);
    let y = parseInt(match[2]);
    return [x, y];
}

let setScale = (scaleNum) => {
    if (typeof scaleNum !== "number") return;
    let pos = getTranslate();
    let translateString = `translate(${pos[0]}px, ${pos[1]}px)`;
    treeChartCore.svgElement.style.transform = `scale(${scaleNum}) ` + translateString;
    treeChartCore.domElement.style.transform = `scale(${scaleNum}) ` + translateString;
    treeChartCore.currentScale = scaleNum;
}

let treeMouseWheel = (e) => {
    // console.log("wheel", e);
    // treeChartCore.zoomIn();8
    const originTransformStr = treeChartCore.domElement.style.transform;
    // console.log("origin:", originTransformStr)
    // 如果已有scale属性, 在原基础上修改
    let targetScale = 1 * 1.2;
    const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX);
    // console.log("origin scale:", scaleMatchResult[1]);
    let originScale = 1;

    if (scaleMatchResult && scaleMatchResult.length > 0) {
        originScale = parseFloat(scaleMatchResult[1]);
        if (e.wheelDelta > 0) targetScale *= originScale;
        else targetScale = originScale / 1.2;
    }
    else {
        console.log("Scale match error!");
        return;
    }
    // console.log("target scale:", targetScale)
    if (typeof targetScale !== "number") return;
    let translatePos = getTranslate();
    // console.log("translatePos:", translatePos);
    // console.log("ratio", targetScale, originScale)
    // TODO: 是保持这个点相对位置不变 不是移动到中心
    // let diffRatio = 0.2 / 1.2;
    // let pos = [
    //     // TODO: 中心是要动的所以是针对自己的位置计算
    //     translatePos[0] + Math.floor((treeChartCore.initTransformX - e.clientX)*diffRatio),
    //     translatePos[1] + Math.floor(-(e.clientY - treeChartCore.domElement.offsetHeight / 2.0 + treeChartCore.initTransformY)*diffRatio)
    // ]
    let originString = treeChartCore.svgElement.style.transformOrigin;
    let originMatch = originString.match(MATCH_TRANSFORMORIGIN_REGEX);
    console.log(originMatch);
    let translateString = `translate(${translatePos[0]}px, ${translatePos[1]}px)`;
    // let translateString = `translate(${translatePos[0]}px, ${translatePos[1]}px)`;
    if (originMatch != null) {

    }
    console.log(translateString);
    console.log(`${translatePos[0]}px ${translatePos[1]}px`)
    treeChartCore.svgElement.style.transformOrigin = `${e.clientX}px ${e.clientY}px`;
    treeChartCore.domElement.style.transformOrigin = `${e.clientX}px ${e.clientY}px`;
    treeChartCore.svgElement.style.transform = `scale(${targetScale}) ` + translateString;
    treeChartCore.domElement.style.transform = `scale(${targetScale}) ` + translateString;
    treeChartCore.currentScale = targetScale;
}

let treeZoomIn = () => {
    treeChartCore.zoomIn();
}

let treeZoomOut = () => {
    treeChartCore.zoomOut();
}

let treeZoomInit = () => {
    const origin = treeChartCore.getInitialTransformStyle();
    treeChartCore.svgElement.style.transform = origin.transform;
    treeChartCore.domElement.style.transform = origin.transform;
    treeChartCore.svgElement.style.transformOrigin = `center center`;
    treeChartCore.domElement.style.transformOrigin = `center center`;
}

const cancelClick = () => {
    drawerRef.value.close();
}

const confirmClick = () => {
    let ifUpdated = false;
    console.log(curNodeInfo)
    if(curNodeInfo.name != infoFormInput.name) {
        curNodeInfo.name = infoFormInput.name
    }
    if(curNodeInfo.auth != infoFormInput.authority) {
        curNodeInfo.auth = infoFormInput.authority
    }
    if(curNodeInfo.bank != infoFormInput.bank) {
        curNodeInfo.bank = infoFormInput.bank
    }
    if(curNodeInfo.category != infoFormInput.category) {
        curNodeInfo.category = infoFormInput.category
    }
    if(curNodeInfo.apiPrefix != infoFormInput.database) {
        curNodeInfo.apiPrefix = infoFormInput.database
    }
    if(ifUpdated) {
        BackEndRequest.updateNodeInfo(curNodeInfo);
    }
    drawerRef.value.close();
}

const getNodeInfo = (node) => {
    // console.log(node.node);
    curNodeInfo = node;
    drawerInfoTypeEnum.value = 1;
    footerShow.value = true;
    typeRadioShow.value = false;
    drawerName.value = CommonUtils.humpToHyphen(node.name, ' ');
    infoFormInput.name = node.name;
    infoFormInput.authority = node.auth;
    infoFormInput.bank = node.bank;
    infoFormInput.category = node.category;
    infoFormInput.database = node.apiPrefix;
    nodeDrawerShow.value = true;
}

const getNodeData = async (node) => {
    let nodeReqData = await BackEndRequest.getDataNodeData(node);
    drawerName.value = CommonUtils.humpToHyphen(node.name, ' ');
    footerShow.value = false;
    console.log(nodeReqData);
    if (Array.isArray(nodeReqData.data)) {
        nodeDataList.value = nodeReqData.data
        if (nodeDataList.value.length > 2) {
            drawerInfoTypeEnum.value = 3;
            typeRadioShow.value = false;
        }
        else {
            drawerInfoTypeEnum.value = 2;
            typeRadioShow.value = true;
        }
    }
    else {
        nodeDataList.value[0] = nodeReqData.data;
        drawerInfoTypeEnum.value = 2;
        typeRadioShow.value = true;
    }
    if(typeRadioShow.value && dataTypeRadio.value == "GeoJSON") {
        geojsonData.value = CommonUtils.staticInfoData2GeoJson(nodeDataList.value);
    }
    nodeDrawerShow.value = true;
}

const drawerClosed = () => {
    // console.log("closed");
    nodeDataList.value = [{}];
}

const treeConfig = { nodeWidth: 200, nodeHeight: 120, levelHeight: 240 };

let mapNodeStyle = (node) => {
    // console.log("node", node);
    // TODO: add data node style mapper
    let classProp = ["tree-node-title"];

    if (node.children == null || node.children.length == 0) {
        classProp.push("leaf");
    }
    let parentNodeList = ["dataNode", "modelNode", "paramNode", "taskNode"];
    if (parentNodeList.indexOf(node.parentName) != -1) {
        classProp.push("sec-root");
    }
    if (node.parentName == "") {
        classProp.push("root");
    }
    // console.log("name", node["node"]["name"])
    // console.log("category", node["node"]["category"])
    if (node["node"].category.endsWith("Item")) {
        classProp.push("node-item");
    } else if (node.node.category.endsWith("Group")) {
        classProp.push("node-group");
    }

    return classProp.join(" ");
}

let checkIfCanAddNode = (node) => {
    if (node.parentName == "" || node["node"].category.endsWith("Item")) {
        return false;
    }
    else return true;
}

onMounted(async () => {
    const tree = await BackEndRequest.getDataNodeTree();
    console.log(tree.data);
    sampleData.value = tree.data;
    console.log(nodeTree.value.$refs);

    treeChartCore = new TreeChartCore({
        svgElement: nodeTree.value.$refs.svg,
        domElement: nodeTree.value.$refs.domContainer,
        treeContainer: nodeTree.value.$refs.container,
        dataset: sampleData.value,
        direction: Direction.VERTICAL,
        treeConfig: treeConfig,
        collapseEnabled: true,
        linkStyle: TreeLinkStyle.CURVE
    })
    treeChartCore.init();
})

</script>

<style lang="scss" scoped>
div.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    div.el-drawer__header {
        margin-bottom: 0px;
    }

    div.zoom-button-container {
        position: absolute;
        left: 2vw;
        top: 3vh;
        z-index: 10;
        width: 240px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }

    div.tree-node-container {
        // width: 160px;
        width: fit-content;
        // height: 120px;
        height: fit-content;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;

        background-color: transparent;

        div.tree-node-title {
            height: 60px;
            // width: 180px;
            max-width: 180px;
            width: fit-content;
            padding-left: 4%;
            padding-right: 4%;
            background-color: rgb(226, 255, 210);
            flex-grow: 1;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            // font-weight: bold;

            div.node-title-text {
                height: 100%;
                width: 100%;
                line-height: 30px;
                text-align: center;
                border-radius: 4px;
            }

            &.root {
                width: 180px;
                background-color: rgb(10, 103, 243);
                border-width: 2px;
                border-style: solid;
                border-color: rgb(186, 241, 255);

                div.node-title-text {
                    color: rgb(240, 253, 255);
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 60px;
                }
            }

            &.sec-root {
                border-width: 2px;
                border-style: solid;

                div.node-title-text {
                    font-weight: 600;
                }
            }

            &.node-group {
                background-color: rgb(180, 218, 252);
            }

            &.node-item {
                background-color: rgb(227, 238, 255);

                div.node-title-text {
                    font-weight: 600;
                    font-size: 14px;
                    color: rgb(38, 96, 172);
                }
            }

        }

        div.node-drop-down {
            width: fit-content;
            height: 60px;
            margin-top: 30px;
            position: absolute;
            top: 0px;
            display: grid;
            flex-grow: 10;
            color: transparent;

            span.el-only-child__content {
                width: 180px;
            }
        }

        div.manage-container {
            width: 100%;
            height: fit-content;
            display: flex;
            flex-flow: row nowrap;
            text-align: center;


            div.node-info {
                width: 50%;
                height: fit-content;
                color: aliceblue;
                background-color: rgb(14, 67, 165);
                border-top: 1px solid black;
            }

            div.node-data {
                width: 50%;
                height: fit-content;
                background-color: rgb(170, 217, 255);
                border-top: 1px solid black;
            }
        }

        // div.data-container {
        //     div.single-data-container {
        //         div.data-item-key {
        //             font-weight: 600;
        //         }
        //     }
        // }


        div.tree-node-content {
            height: 30px;
            width: 160px;
            background-color: transparent;
            flex-grow: 1;

            display: flex;
            flex-flow: row wrap;

            div.node-content-cell {
                width: 80px;
                height: 30px;
                font-size: 14px;
                line-height: 30px;
                text-align: center;
                background-color: rgba(212, 228, 255, 0.796);
            }
        }
    }
}

div.el-scrollbar {
    :deep(.data-desc-key) {
        color: rgb(220, 229, 236);
        background-color: rgb(48, 76, 116);
    }

    :deep(.data-desc-value) {
        color: rgb(0, 13, 22);
        font-weight: bold;
        background-color: rgb(196, 221, 255);
    }
}

:deep(header.el-drawer__header) {
    margin-bottom: 0;
}
</style>