<template>
    <div class="param-tree-container">
        <div class="param-tree-title">
            <div class="tree-title-icon"></div>
            <div class="tree-title-text">崩岸知识网络</div>
        </div>
        <div class="param-tree-graph" id="param-tree"></div>


        <div class="tool">
            <el-switch v-model="fitVue" size="large" active-text="自适应视图" />
        </div>


        <FilePreviewer :fileInfo="previewFileInfo" v-model:show="showPreview"></FilePreviewer>
    </div>
</template>

<script setup>
import G6 from '@antv/g6'
import { onMounted, reactive, ref, watch } from 'vue'
import KnowStoreHelper from './knowStoreHelper';
import FilePreviewer from './globalGraph/FilePreviewer.vue';

////////// graph ////////////
let graph = null
const TYPEMAP = {
    'root': 0,
    'folder': 1,
}
const defaultEdgeStyle = {
    stroke: '#eee',
    endArrow: {
        path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
        fill: '#ffff',
        d: -25,
    },
}
const nodeClassColorMap = ['#eee', '#A7EBBC', '#91d5ff', '#FFE56C', '#F29F05']
const nodeClassStrokeMap = [
    '#747F7F',
    'rgba(233,233,233,0.6)',
    'rgba(233,233,233,0.6)',
    'rgba(233,233,233,0.6)',
    'rgba(233,233,233,0.6)',
]
const customModeWithFitView = {
    type: 'collapse-expand',
    onChange: function onChange(item, collapsed) {

        const data = item.get('model');
        const setGrandChildrenCollapsed = (node) => {
            if (node.children) {
                node.children.forEach(child => {
                    child.collapsed = true;
                    setGrandChildrenCollapsed(child);
                });
            }
        };
        data.collapsed = collapsed;
        if (!collapsed) {
            setGrandChildrenCollapsed(data);
        }
        setTimeout(() => {
            graph.fitView();
        }, 500);
        return true;
    },
}
const customModeWithoutFitView = {
    type: 'collapse-expand',
    onChange: function onChange(item, collapsed) {

        const data = item.get('model');
        const setGrandChildrenCollapsed = (node) => {
            if (node.children) {
                node.children.forEach(child => {
                    child.collapsed = true;
                    setGrandChildrenCollapsed(child);
                });
            }
        };
        data.collapsed = collapsed;
        if (!collapsed) {
            setGrandChildrenCollapsed(data);
        }
        return true;
    },
}

const fitVue = ref(true)
watch(fitVue, (newVal) => {
    if(!!!graph) return
    if (newVal) {
        graph.removeBehaviors(['collapse-expand'])
        graph.addBehaviors([customModeWithFitView])
    }else{
        graph.removeBehaviors(['collapse-expand'])
        graph.addBehaviors([customModeWithoutFitView])
    }
})



////////// preview //////////
const previewFileInfo = reactive({
    label: '',
    filePath: '',// 注意这边是URL
    type: '',
})
const showPreview = ref(false)
const handleFileClick = (fileInfo) => {
    console.log('预览文件 ' + fileInfo.name)
    const fileURL = KnowStoreHelper.getOneFileUrl(fileInfo)
    previewFileInfo.label = fileInfo.name
    previewFileInfo.filePath = fileURL
    previewFileInfo.type = fileInfo.type
    showPreview.value = true
}


onMounted(async () => {

    ////////// G6 graph ////////////
    const container = document.getElementById('param-tree')
    const width = container.scrollWidth
    const height = container.scrollHeight || 500
    graph = new G6.TreeGraph({
        container: 'param-tree',
        width,
        height,
        linkCenter: true,
        modes: {
            default: [
                {
                    type: 'collapse-expand',
                    onChange: function onChange(item, collapsed) {

                        const data = item.get('model');
                        const setGrandChildrenCollapsed = (node) => {
                            if (node.children) {
                                node.children.forEach(child => {
                                    child.collapsed = true;
                                    setGrandChildrenCollapsed(child);
                                });
                            }
                        };
                        data.collapsed = collapsed;
                        if (!collapsed) {
                            setGrandChildrenCollapsed(data);
                        }
                        setTimeout(() => {
                            graph.fitView();
                        }, 500);
                        return true;
                    },
                },
                'drag-canvas',
                'zoom-canvas',
            ],
        },
        defaultNode: {
            size: 32,
        },
        defaultEdge: {
            style: defaultEdgeStyle,
        },
        layout: {
            type: 'dendrogram',
            direction: 'LR',
            nodeSep: 20,
            rankSep: 100,
            radial: true,
        },
        animate: true, // Boolean，切换布局时是否使用动画过度，默认为 false
        animateCfg: {
            duration: 480, // Number，一次动画的时长
            easing: 'linearEasing', // String，动画函数
        },
    })


    graph.node(function (node) {

        let type = TYPEMAP[node.type] || 2
        return {
            name: node.name,
            label: processString(node.label),
            size: node.id == "0" ? 64 : Math.round(64 / Math.log(node.layer + 2)),
            labelCfg: {
                style: {
                    fill: '#333',
                    fontSize: 10 / Math.log((node.layer * 1.5 + Math.E)),
                    fontWeight: 600 * Math.log(node.layer + 2),
                },
            },
            style: {
                stroke: nodeClassStrokeMap[node.layer],
                fill: nodeClassColorMap[node.layer],
            },
        }
    })

    const theData = await KnowStoreHelper.getGraphData()
    graph.data(theData)
    graph.render()

    // rerender
    G6.Util.traverseTree(theData, function (item) {
        if (item.depth > 0) {
            item.collapsed = true
        }
    })
    graph.data(theData)
    graph.render()
    graph.fitCenter();
    graph.fitView();



    graph.on('node:click', (evt) => {
        const { item } = evt;
        const nodeData = item.get('model');
        if (!!!TYPEMAP[nodeData.type]) {
            handleFileClick(nodeData)
        }
    });



    if (typeof window !== 'undefined')
        window.onresize = () => {
            if (!graph || graph.get('destroyed')) return
            if (!container || !container.scrollWidth || !container.scrollHeight)
                return
            graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
})



/////////// helper ////////////
function processString(string) {
    let str = string;
    if (str.includes('\n')) {
        return str;
    } else if (str.length > 13) {
        return str.slice(0, 10) + '...';
    }
    else if (str.length > 7) {
        return str.slice(0, 7) + '\n' + str.slice(7);
    } else {
        return str;
    }
}

</script>

<style lang="scss" scoped>
div.param-tree-container {
    position: relative;
    width: 80vw;
    height: 80vh;
    left: 12vw;
    top: 4vh;
    z-index: 8;

    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 8px 40px -10px rgba(0, 0, 0, 0.8);

    div.param-tree-title {
        position: relative;
        height: 6vh;
        line-height: 6vh;
        width: 80vw;
        left: 50%;
        transform: translateX(-50%);
        font-size: calc(1vw + 0.8vh);
        font-weight: 600;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        column-gap: 1vw;

        background-color: rgba(204, 233, 252, 0.9);
        backdrop-filter: blur(6px);

        border-bottom: 3px solid rgb(15, 83, 230);

        div.tree-title-icon {
            height: 4vh;
            width: 4vh;
            background-image: url('/binary-data.png');
            background-size: contain;
            background-repeat: no-repeat;
        }

        div.tree-title-text{
            letter-spacing: .1em;
        }
    }

    div.param-tree-graph {
        height: 74vh;
        width: 80vw;
        background-color: rgba(88, 158, 250, 0.6);
        backdrop-filter: blur(6px);

        &:hover {
            cursor: pointer;
        }

        // background-color: aqua;
    }

    div.tool {
        position: absolute;
        right: 5vw;
        top: 10vh;
        padding: 5px 10px;
        border-radius: 10px;
        background-color: rgba(204, 233, 252, 0.9);

    }
}
</style>
