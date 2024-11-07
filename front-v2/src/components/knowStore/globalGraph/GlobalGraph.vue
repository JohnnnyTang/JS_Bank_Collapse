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
            direction : 'H',
            getVGap: ()=> 30,
            getHGap: ()=> 70,
        },
    })

    graph.node(function (node) {
        return {
            label: node.label,
            size: Math.round(128 / Math.log(node.layer + 1)),
            labelCfg: {
                style: {
                    fill: '#333',
                    fontSize: 24 / Math.log(node.layer + 1),
                    fontWeight: 600 * Math.log(node.layer + 1),
                },
            },
            style: {
                stroke: nodeClassStrokeMap[node.class - 1],
                fill: nodeClassColorMap[node.class - 1],
            },
        }
    })

    graph.data(paramTree)
    graph.render()
    graph.fitView()

    if (typeof window !== 'undefined')
        window.onresize = () => {
            if (!graph || graph.get('destroyed')) return
            if (!container || !container.scrollWidth || !container.scrollHeight)
                return
            graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
})
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
