<template>
    <div class="total-controller">
        <div class="title">
            <Decoration7 style="width: 30vw; height: 5vh;" :color="['rgb(28,13,106)', 'rgb(88,146,255)']">
                <div class="title-back">
                    <span class="title-text">图层管理</span>
                </div>
            </Decoration7>
        </div>
        <hr>
        <div class="content">
            <div class="e-input">
                <span class="text">图层检索</span>
                <el-input v-model="filterText" style="width: 10vw" placeholder="请输入关键词" />
            </div>
            <div class="tree-container">
                <el-tree ref="treeRef" style="max-width: 600px" class="filter-tree" :data="data" :props="defaultProps"
                    default-expand-all :filter-node-method="filterNode" @node-click="selectedNodeHandler">

                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <span class="text">{{ node.label }}</span>

                            <span class="eyes" :style="eyesIcon(node)"></span>
                        </span>
                    </template>

                </el-tree>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { Decoration7 } from '@kjgl77/datav-vue3'
import { ElTree } from 'element-plus';
import { Scene } from '../Scene';
import { useLayerStore, useMapLayerStore } from '../../../store/mapStore';


const defaultProps = {
    children: 'children',
    label: 'label',
}
const filterText = ref('')
const treeRef = ref()
const selectedLayer = ref('')
const data = ref([])
const layerState = computed(() => useMapLayerStore().mapLayerState)


watch(filterText, (val) => {
    treeRef.value.filter(val)
})
watch(layerState, (val) => {
    console.log(val);
})




const eyesIcon = (node) => {
    if (node.isLeaf) {
        let showing = (useMapLayerStore().mapLayerState[node.data.label].showing)
        return showing ? { background: `url('/view.png')` } : { background: `url('/hide.png')` }
    }
    return {}

}

const filterNode = (value, data) => {
    if (!value) return true
    return data.label.includes(value)
}
const selectedNodeHandler = (nodeObj, nodeProp, Node, event) => {
    if (nodeProp.isLeaf) {
        selectedLayer.value = nodeProp.data.label
        console.log('node! ', nodeProp);
        console.log('tree Ref!', treeRef.value);
        useMapLayerStore().layerShowing(nodeProp.data.label)

    }
}

onMounted(() => {
    let treeData = Scene.getLayerTreeData()
    data.value = treeData
    console.log(layerState.value)

})

</script>

<style lang="scss" scoped>
div.total-controller {
    position: absolute;
    right: 1vw;
    top: 40vh;
    z-index: 3;
    pointer-events: all;

    width: 25vw;
    height: 50vh;
    background-color: rgb(226, 236, 255);
    border-radius: 1%;
    box-shadow: 0px 0px 10px 1px #b3b2b2ee;

    .title {
        position: relative;
        width: 25vw;
        height: 5vh;
        display: flex;
        justify-content: center;
        align-items: center;

        .title-back {
            // width: 8vw;
            padding-left: 1vw;
            padding-right: 1vw;

            // height: 5vh;
            .title-text {
                font-size: calc(0.8vh + 1vw);
                font-weight: 600;
                line-height: 5vh;
                color: rgb(75, 115, 181);
            }
        }


    }

    .content {
        position: relative;
        width: 25vw;
        height: 45vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .e-input {
            width: 21vw;
            height: 3vh;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(-50%);
            scale: 1.15;
        }

        .tree-container {
            position: relative;
            width: 22vw;
            height: 33vh;
            padding-left: 1vw;
            padding-bottom: 1.5vh;
            padding-top: 1.5vh;
            box-shadow: rgb(255, 255, 255) 0px 0px 25px 3px inset;
            border-radius: 5%;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 5px;
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

            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 8px;

                .text {
                    font-size: calc(0.6vw + 0.7vh);
                    color: rgb(19, 70, 147);
                    font-weight: 300;
                }

                .eyes {
                    display: block;
                    width: 2vh;
                    height: 2vh;
                    background-size: contain !important;
                    transform: scale(0.8);
                    // background:url('/data.png')
                }
            }

        }
    }

}


.text {
    font-family: 'Microsoft YaHei', Helvetica, sans-serif;
    font-size: calc(0.5vw + 0.7vh);
    padding-right: 1vw;
    font-weight: 600;
    color: rgb(75, 115, 181);
}

hr {
    margin: 0;
    border-top-width: 2px;
    border-color: rgb(75, 115, 181);
}
</style>