import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { MarkerType } from '@vue-flow/core'


const useSoilAnalysisStore = defineStore('soilAnalysisStore', () => {

    const nodes = ref([
        // an input node, specified by using `type: 'input'`
        {
            id: '1',
            type: 'flow', // <-- this is the custom node type name
            position: { x: 192, y: 68 },
            data: { label: '评估断面选择', status: 0, },
        },

        {
            id: '2',
            type: 'flow', // <-- this is the custom node type name
            position: { x: 22, y: 269 },
            data: { label: '岸段测点参数', status: 0, },
        },
        // An output node, specified by using `type: 'output'`
        {
            id: '3',
            type: 'flow', // <-- this is the custom node type name
            position: { x: 193, y: 269 },
            data: { label: '土壤分层参数', status: 0, },
        },
        {
            id: '4',
            type: 'flow', // <-- this is the custom node type name
            position: { x: 364, y: 269 },
            data: { label: '潮位参数', status: 0, },
        },
        {
            id: '5',
            type: 'flow', // <-- this is the custom node type name
            position: { x: 192, y: 501 },
            data: { label: '评估结果', status: 0, },
        }
    ])
    const edges = ref([
        {
            id: 'e1->2',
            source: '1',
            target: '2',
            animated: false,
            markerEnd: MarkerType.ArrowClosed,
        },
        {
            id: 'e1->3',
            source: '1',
            target: '3',
            animated: false,
            markerEnd: MarkerType.ArrowClosed,
        },
        {
            id: 'e1->4',
            source: '1',
            target: '4',
            animated: false,
            markerEnd: MarkerType.ArrowClosed,
        },
        {
            id: 'e2->5',
            source: '2',
            target: '5',
            animated: false,
            markerEnd: MarkerType.ArrowClosed,
        },
        {
            id: 'e3->5',
            source: '3',
            target: '5',
            animated: false,
            markerEnd: MarkerType.ArrowClosed,
        },
        {
            id: 'e4->5',
            source: '4',
            target: '5',
            animated: false,
            markerEnd: MarkerType.ArrowClosed,
        },
    ])

    function updateSectionStatus(status) {
        nodes.value[0].data.status = status
    }
    function updateBankDetailStatus(status) {
        nodes.value[1].data.status = status
    }
    function updateThicknessStatus(status) {
        nodes.value[2].data.status = status
    }
    function updateFlowsStatus(status) {
        nodes.value[3].data.status = status
    }
    function updateResultStatus(status) {
        nodes.value[4].data.status = status
    }
    return {
        nodes, edges,
        updateSectionStatus,
        updateBankDetailStatus,
        updateThicknessStatus,
        updateFlowsStatus,
        updateResultStatus
    }


})


const useHydrodynamicStore = defineStore('hydrodynamicStore', () => {
    // const markerInfos = ref({})
    const markerInfos = new Map()
    const calculatingMarkerDom = ref(null)
    const focusingMarkerDom = ref(null)

    const showingOption = ref({})

    const addMarkerInfo = (markerIns, markerDom, lng, lat) => {
        markerInfos.set(markerDom, {
            markerIns,
            markerDom,
            lng,
            lat
        })
    }
    const appendMarkerInfo = (markerDom, info) => {
        const nowInfo = markerInfos.get(markerDom)
        let totalInfo = { ...nowInfo, ...info }
        markerInfos.set(markerDom, totalInfo)
    }

    const getMarkerInfo = (markerDom) => {
        return markerInfos.get(markerDom)
    }

    const removeMarkerInfo = (markerDom) => {
        let markerInfo = markerInfos.get(markerDom)
        if (markerInfo) {
            markerInfo.markerIns.remove()
        }
        markerInfos.delete(markerDom)
    }

    return {
        focusingMarkerDom,showingOption,
        markerInfos, addMarkerInfo, appendMarkerInfo, getMarkerInfo, calculatingMarkerDom, removeMarkerInfo
    }
})

export {
    useSoilAnalysisStore, useHydrodynamicStore
}