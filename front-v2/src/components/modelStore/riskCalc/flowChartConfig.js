import { MarkerType } from '@vue-flow/core'

export const initialNodes = [
    // an input node, specified by using `type: 'input'`
    {
        id: '1',
        type: 'flow',
        label: '评估断面选择',
        position: { x: 150, y: 5 },
        data: { name: '评估断面选择', status: 0, result: '' },
    },

    // default node, you can omit `type: 'default'` as it's the fallback type
    {
        id: '2',
        label: '动力指标计算',
        position: { x: 50, y: 200 },
        data: { name: '动力指标计算', status: -1, result: '' },
        type: 'flow',
    },

    // An output node, specified by using `type: 'output'`
    {
        id: '3',
        label: '演变分析指标计算',
        position: { x: 250, y: 200 },
        data: { name: '演变分析指标计算', status: -1, result: '' },
        type: 'flow',
    },

    {
        id: '4',
        type: 'output',
        label: '风险矩阵配置计算',
        type: 'flow',
        position: { x: 150, y: 400 },
        data: { name: '风险矩阵配置计算', status: -2, result: '' },
    },
]

export const initialEdges = [
    // an animated edge, specified by using `animated: true`
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: '#333', strokeWidth: 3 },
        type: 'flow',
    },
    {
        id: 'e1-3',
        source: '1',
        target: '3',
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: '#333', strokeWidth: 3 },
        type: 'flow',
    },

    {
        id: 'e2-4',
        source: '2',
        target: '4',
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: '#333', strokeWidth: 3 },
        type: 'flow',
    },
    {
        id: 'e3-4',
        source: '3',
        target: '4',
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: '#333', strokeWidth: 3 },
        type: 'flow',
    },
]
