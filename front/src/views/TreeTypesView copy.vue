<template>
    <div class="container">
        <vue-tree style="width: 98vw; height: 98vh; border: 1px solid gray;" :dataset="sampleData" :config="treeConfig">
            <template v-slot:node="{ node, collapsed }">
                <!-- <span class="tree-node" :style="{ border: collapsed ? '2px solid grey' : '' }">{{ node.value }}</span> -->
                <div class="tree-node-container">
                    <div class="tree-node-title">
                        <div class="node-title-text">{{ CommonUtils.humpToHyphen(node.name, ' ') }}</div>
                    </div>
                    <!-- <div class="tree-node-content">
                        <div v-for="attribute of node.attributes" class="node-content-cell" @click="console.log(node)">
                            ◉ {{ combineText(attribute) }}
                        </div>
                    </div> -->
                </div>
            </template>
        </vue-tree>
    </div>
</template>

<script setup>
import VueTree from '@ssthouse/vue3-tree-chart';
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";
import { onMounted, ref } from 'vue';
import BackEndRequest from '../api/backendIns.js';
import CommonUtils from '../utils/CommonUtils.js';

let sampleData = ref({
    name: 'Root Node',
    attributes: ['id', 'type', 'name', 'auth'],
    children: [
        {
            name: 'Data Node', 
            attributes: ['api', 'usage'], 
            children: [
                { name: 'Basic Geo Data', children: [{name: 'Vector Data'}, {name: 'Raster Data'}, {name: 'Map Tiles'}]}, 
                { name: 'Device Info', children: [{name: 'Device A'}, {name: 'Device B'}, {name: '...'}]},
                { name: 'Device Data', children: [{name: 'Device A'}, {name: 'Device B'}, {name: '...'}]},
            ] 
        },
        { 
            name: 'Model Node', 
            attributes: ['program', 'usage'], 
            children: [
                { name: '5' }, 
                { name: '6' }
            ]  
        },
        { 
            name: 'Param Node', 
            attributes: ['model', 'params'], 
            children: [
                { name: '5' }, 
                { name: '6' }
            ]  
        },
        { 
            name: 'Task Node', 
            attributes: ['model', 'param', 'data', 'status', 'result'], 
            children: [
                { name: '5' }, 
                { name: '6' }
            ]
        },
    ]
})

const combineText = (stringObj) => {
    let textRes = '';
    for(let key in stringObj) {
        if(key != '_key') {
            textRes += stringObj[key];
        }
    }
    return textRes;
}

const treeConfig = { nodeWidth: 200, nodeHeight: 120, levelHeight: 240 };

let mapNodeStyle = (node) => {
    // TODO: add data node style mapper
    
}

onMounted(async () => {
    const tree = await BackEndRequest.getDataNodeTree();
    console.log(tree.data);
    sampleData.value = tree.data;
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
            margin-left: 4%;
            margin-right: 4%;
            background-color: rgb(226, 255, 210);
            flex-grow: 1;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            font-weight: bold;

            div.node-title-text {
                height: 100%;
                width: 100%;
                line-height: 30px;
                text-align: center;
            }

        }

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
</style>