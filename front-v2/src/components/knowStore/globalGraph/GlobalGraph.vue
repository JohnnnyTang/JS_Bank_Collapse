<template>
    <div class="param-tree-container">
        <div class="param-tree-title">
            <div class="tree-title-icon"></div>
            <div class="tree-title-text">江苏省长江崩岸监测预警知识库</div>
        </div>
        <div class="param-tree-graph" id="param-tree"></div>


        <!-- <div class="right-menu" ref="menu">
            <div class="right-memu-item" @click="previewFileHandler">
                <span>预览文件</span>
            </div>
            <div class="right-memu-item" @click="downloadFileHandler">
                <span>下载文件</span>
            </div>
        </div> -->

        <!-- preview -->
        <FilePreviewer :fileInfo="previewFileInfo" v-model:show="showPreview"></FilePreviewer>

    </div>
</template>

<script setup>
import G6 from '@antv/g6'
import { onMounted, reactive, ref } from 'vue'
import { paramTree } from './tree.js'
import { graphData } from './demo.js'
import FilePreviewer from './FilePreviewer.vue';
import { ElMessage } from 'element-plus';


// onMounted(() => {
//     const container = document.getElementById('param-tree')
//     const width = container.scrollWidth
//     const height = container.scrollHeight || 500

//     const graph = new G6.Graph({
//         container,
//         width,
//         height,
//         layout: {
//             type: 'force',
//             preventOverlap: true,
//             linkDistance: d => {
//                 if (d.source.id === 'node0') {
//                     return 100;
//                 }
//                 return 30;
//             },
//             nodeStrength: d => {
//                 if (d.isLeaf) {
//                     return -50;
//                 }
//                 return -10;
//             },
//             edgeStrength: d => {
//                 if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
//                     return 0.7;
//                 }
//                 return 0.1;
//             }
//         },
//         defaultNode: {
//             color: '#5B8FF9',
//             style: {
//                 lineWidth: 2,
//                 fill: '#C6E5FF'
//             }
//         },
//         defaultEdge: {
//             size: 1,
//             color: '#e2e2e2'
//         }
//     });

//     const data = {
//         nodes: [
//             { id: 'node0', size: 50 },
//             { id: 'node1', size: 30 },
//             { id: 'node2', size: 30 },
//             { id: 'node3', size: 30 },
//             { id: 'node4', size: 30, isLeaf: true },
//             { id: 'node5', size: 30, isLeaf: true },
//             { id: 'node6', size: 15, isLeaf: true },
//             { id: 'node7', size: 15, isLeaf: true },
//             { id: 'node8', size: 15, isLeaf: true },
//             { id: 'node9', size: 15, isLeaf: true },
//             { id: 'node10', size: 15, isLeaf: true },
//             { id: 'node11', size: 15, isLeaf: true },
//             { id: 'node12', size: 15, isLeaf: true },
//             { id: 'node13', size: 15, isLeaf: true },
//             { id: 'node14', size: 15, isLeaf: true },
//             { id: 'node15', size: 15, isLeaf: true },
//             { id: 'node16', size: 15, isLeaf: true }

//         ],
//         edges: [
//             { source: 'node0', target: 'node1' },
//             { source: 'node0', target: 'node2' },
//             { source: 'node0', target: 'node3' },
//             { source: 'node0', target: 'node4' },
//             { source: 'node0', target: 'node5' },
//             { source: 'node1', target: 'node6' },
//             { source: 'node1', target: 'node7' },
//             { source: 'node2', target: 'node8' },
//             { source: 'node2', target: 'node9' },
//             { source: 'node2', target: 'node10' },
//             { source: 'node2', target: 'node11' },
//             { source: 'node2', target: 'node12' },
//             { source: 'node2', target: 'node13' },
//             { source: 'node3', target: 'node14' },
//             { source: 'node3', target: 'node15' },
//             { source: 'node3', target: 'node16' }
//         ]
//     };
//     const nodes = data.nodes;
//     graph.data({
//         nodes: data.nodes.map(function (node, i) {
//             node.size += 30 * (Math.random() * 0.5 + 0.5);
//             node.label = node.id;
//             return Object.assign({}, node);
//         }),
//         edges: data.edges.map(function (edge, i) {
//             edge.id = 'edge' + i;
//             return Object.assign({}, edge);
//         })
//     });
//     graph.render();

//     graph.on('node:dragstart', function (e) {
//         graph.layout();
//         refreshDragedNodePosition(e);
//     });
//     graph.on('node:drag', function (e) {
//         refreshDragedNodePosition(e);
//     });
//     graph.on('node:dragend', function (e) {
//         e.item.get('model').fx = null;
//         e.item.get('model').fy = null;
//     });

//     function refreshDragedNodePosition(e) {
//         const model = e.item.get('model');
//         model.fx = e.x;
//         model.fy = e.y;
//     }
// })







const defaultEdgeStyle = {
    stroke: '#eee',
    endArrow: {
        path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
        fill: '#ffff',
        d: -22,
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


///// right menu /////
// const menu = ref(null)

///////////////file operation ///////////////////
const rightClickedFileInfo = reactive({
    label: '',
    filePath: '',
})
const previewFileInfo = ref({
    label: '',
    filePath: '',
})
const showPreview = ref(false)
const previewFileHandler = () => {
    info('预览文件 ' + rightClickedFileInfo.label)
    previewFileInfo.value = {
        label: rightClickedFileInfo.label,
        filePath: rightClickedFileInfo.filePath,
    }
    showPreview.value = true
}
const downloadFileHandler = () => {
    const { fileInfo, node } = rightClickingFileNode
    info('下载文件 ' + fileInfo.label)
    const downloadUrl = ' http://localhost:5173/' + fileInfo.filePath
    downloadFile(downloadUrl, fileInfo.label)
}

onMounted(() => {
    const container = document.getElementById('param-tree')
    // console.log(data)
    const width = container.scrollWidth
    const height = container.scrollHeight || 500

    const contextMenu = new G6.Menu({
        getContent() {
            return `
          <ul>
            <li>指标详情</li>
            <li>计算日志</li>
          </ul>`
        },
        handleMenuClick: (target, item) => {
            console.log(target, item, target.innerHTML)
        },
        offsetX: 10,
        offsetY: -25,
        itemTypes: ['node'],
    })

    const graph = new G6.TreeGraph({
        container: 'param-tree',
        width,
        height,
        linkCenter: true,
        plugins: [contextMenu],
        modes: {
            default: [
                {
                    type: 'collapse-expand',
                    onChange: function onChange(item, collapsed) {
                        // collaped == true means now need to collapsed 
                        // collaped == false means now need to expanded
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
                        graph.fitView();
                        return true;
                    },
                },
                'drag-canvas',
                'zoom-canvas',
            ],
        },
        defaultEdge: {
            style: defaultEdgeStyle,
        },
        layout: {
            // type: 'dendrogram',
            // direction: 'LR',
            // nodeSep: 20,
            // rankSep: 120,
            // subTreeSep: 20,
            // radial: true,

            // type: 'mindmap',
            // direction: 'H',
            // getSubTreeSep: (node)=> {
            //     return 20;
            // }
            type: 'compactBox',
            direction: 'H',
            getVGap: () => 80,
            getHGap: () => 100,
        },
        maxZoom: 4,
        minZoom: 0.2,
    })

    graph.node(function (node) {
        return {
            _label: node.label,
            label: processString(node.label),
            
            // shape:'rect',
            // size: [40, 30],
            size: Math.round(200 / Math.log(node.layer + 1)),
            labelCfg: {
                style: {
                    fill: '#333',
                    fontSize: 40 / Math.log(node.layer + 1),
                    fontWeight: 600 * Math.log(node.layer + 1),
                },

                // position: node.children && node.children.length > 0 ? 'left' : 'right',
                offset: 5

            },
            style: {
                stroke: nodeClassStrokeMap[node.class - 1],
                fill: nodeClassColorMap[node.class - 1],
            }

        }
    })

    graph.data(paramTree)
    graph.render()

    // rerender
    G6.Util.traverseTree(paramTree, function (item) {
        if (item.depth > 0) {
            item.collapsed = true
        }
    })
    graph.data(paramTree)
    graph.render()
    graph.fitView()
    graph.fitCenter()


    // // callback
    // graph.on('node:click', (evt) => {
    //     const { item } = evt;
    //     rightClickedFileInfo.label = item.get('model').label

    //     const nodeData = item.get('model');
    //     if (nodeData.filePath) {
    //         menu.value.style.left = evt.clientX + 'px';
    //         menu.value.style.top = evt.clientY - 50 + 'px';
    //     }
    // });

    // ///// right click menu /////
    // graph.on('node:contextmenu', function (evt) {
    //     evt.preventDefault()
    //     const { item } = evt;
    //     rightClickedFileInfo.label = item.get('model').label
    //     rightClickedFileInfo.filePath = item.get('model').filePath
    //     const nodeId = item.get('id');
    //     const nodeData = item.get('model');

    //     if (nodeData.filePath) {
    //         menu.value.style.left = evt.clientX + 'px';
    //         menu.value.style.top = evt.clientY - 50 + 'px';
    //     }

    // });
    // graph.on('node:mouseleave', () => {
    //     menu.value.style.left = '-999px';
    // });
    // graph.on('drag', (e) => {
    //     if (menu.value.style.left != '-999px') {
    //         menu.value.style.left = e.clientX;
    //     }
    // })




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

const downloadFile = (url, name) => {
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const info = (msg) => {
    ElMessage.info({
        offset: 110,
        message: msg
    })
}
</script>

<style lang="scss" scoped>
div.param-tree-container {
    position: relative;
    width: 100vw;
    height: 92vh;

    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 8px 40px -10px rgba(0, 0, 0, 0.8);

    div.param-tree-title {
        position: relative;
        height: 6vh;
        line-height: 6vh;
        width: 40vw;
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
    }

    div.param-tree-graph {
        height: 86vh;
        width: 100vw;
        background-color: rgba(88, 158, 250, 0.315);
        backdrop-filter: blur(6px);

        &:hover {
            cursor: pointer;
        }

        // background-color: aqua;
    }

    .right-menu {
        z-index: 999;
        position: absolute;
        left: -999px;
        width: 100px;
        position: absolute;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: white;
        cursor: pointer;

        .right-memu-item {
            position: relative;
            width: 100px;
            height: 4vh;
            line-height: 4vh;
            transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            padding-left: 0.5vw;
            box-shadow: rgba(193, 233, 255, 0.8) 1px 1px, rgba(193, 233, 255, 0.7) 2px 2px, rgba(193, 233, 255, 0.6) 3px 3px;
            background-color: rgb(255, 255, 255);

            font-family: 'Microsoft YaHei';
            font-size: calc(0.8vw + 0.6vh);

            span {
                padding-left: 0.5vw;
            }

            &:hover {
                background-color: rgb(195, 224, 255);
            }
        }
    }
}
</style>
