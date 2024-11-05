// This file is used to get real-time water condition data from the API.
import axios from "axios";
import { ElMessage } from "element-plus";
import dayjs from 'dayjs';


export const getRealTimeStationData = async () => {
    // let stationData = []
    const stationData = (await axios.get(import.meta.env.VITE_MAP_TILE_SERVER2 + '/data/bankResource/down/local/resource/waterCondition')).data

    let resultData = stationData.map(item => {
        return {
            station: item.station,
            flow: item['flow'],
            level: item['tide-level'],
            time: dayjs().format('HH:mm:ss')
        }
    })

    return resultData
}

export const getRealTimeFlowAndLevelData = async () => {

    const totalStationData = (await axios.get(import.meta.env.VITE_MAP_TILE_SERVER2 + '/data/bankResource/down/local/resource/waterCondition')).data
    const totalTidalRange = (await axios.get(import.meta.env.VITE_MAP_TILE_SERVER2 + '/data/bankResource/down/local/resource/tidalRange')).data
    let flow, level
    for (let i = 0; i < totalStationData.length; i++) {
        if (totalStationData[i].station == '大通站')
            flow = totalStationData[i]['flow']
    }

    for (let i = 0; i < totalTidalRange.length; i++) {
        if (totalTidalRange[i].station == '天生港站')
            level = totalTidalRange[i]['tidalRange']
    }

    let flowAndLevelData = {
        flow,
        level,
    }
    return flowAndLevelData
}



