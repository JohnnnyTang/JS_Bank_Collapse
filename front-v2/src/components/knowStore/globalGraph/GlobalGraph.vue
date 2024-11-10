<template>
    <div class="param-tree-container">
        <div class="param-tree-title">
            <div class="tree-title-icon"></div>
            <div class="tree-title-text">江苏省长江崩岸监测预警知识库</div>
        </div>
        <div class="param-tree-graph" id="param-tree"></div>
    </div>
</template>

<script setup>
import G6 from '@antv/g6'
import { onMounted } from 'vue'
import { paramTree } from './tree.js'
import { graphData } from './demo.js'


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

onMounted(() => {
    const container = document.getElementById('param-tree')
    // console.log(data)
    const width = container.scrollWidth
    const height = container.scrollHeight || 500
    const graph = new G6.TreeGraph({
        container: 'param-tree',
        width,
        height,
        linkCenter: true,
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
                        // graph.refreshPositions(true)
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
        defaultNode: {
            shape: 'rect',
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
        maxZoom: 2,
        minZoom: 0.5,
        fitView: true,
        fitViewPadding: 300,

    })

    graph.node(function (node) {
        return {
            label: processString(node.label),
            size: Math.round(256 / Math.log(node.layer + 1)),
            labelCfg: {
                style: {
                    fill: '#333',
                    fontSize: 48 / Math.log(node.layer + 1),
                    fontWeight: 600 * Math.log(node.layer + 1),
                },

                position: node.children && node.children.length > 0 ? 'left' : 'right',
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
    graph.fitView()

    G6.Util.traverseTree(paramTree, function (item) {
        if (item.depth > 0) {
            item.collapsed = true
        }
    })
    // 传入数据
    graph.data(paramTree)
    // 渲染
    graph.render()
    // 自适应
    graph.fitView()
    // 定位到画布中心
    graph.fitCenter()

    if (typeof window !== 'undefined')
        window.onresize = () => {
            if (!graph || graph.get('destroyed')) return
            if (!container || !container.scrollWidth || !container.scrollHeight)
                return
            graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
})


/////////// helper ////////////
function processString(str) {
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

const nodeDraw = (cfg, group) => {
    const type = cfg.type; // 获取节点的 type 属性
    const size = cfg.size ? cfg.size : 20; // 默认节点大小
    let shape;

    if (type === 0) {
        // 如果 type 为 0，绘制圆形节点
        shape = group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: size / 2, // 半径为节点大小的一半
                fill: '#5B8FF9', // 圆形填充颜色
                stroke: '#5B8FF9', // 圆形边框颜色
            },
            name: 'circle-shape',
        });
    } else {
        // 如果 type 为 1，绘制矩形节点
        shape = group.addShape('rect', {
            attrs: {
                x: -size / 2,
                y: -size / 2,
                width: size,
                height: size,
                fill: '#73C9E6', // 矩形填充颜色
                stroke: '#73C9E6', // 矩形边框颜色
            },
            name: 'rect-shape',
        });
    }

    return shape;
};

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
}
</style>
