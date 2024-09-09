// This file is used to get real-time water condition data from the API.
import axios from "axios";
import { ElMessage } from "element-plus";


export const getRealTimeStationData = async () => {
    // let stationData = []
    const stationData = (await axios.get('/model/data/bankResource/down/local/resource/Mzs/waterCondition')).data
    console.log(stationData)

    let resultData = stationData.map(item => {
        return {
            station: item.station,
            flow: item['flow'],
            level: item['tide-level'],
        }
    })

    return resultData
}

export const getRealTimeFlowAndLevelData = async () => {

    const totalStationData = (await axios.get('/model/data/bankResource/down/local/resource/Mzs/waterCondition')).data
    let flow, level
    for (let i = 0; i < totalStationData.length; i++) {
        if (totalStationData[i].station == '大通站')
            flow = totalStationData[i]['flow']
        else if (totalStationData[i].station == '徐六泾站')
            level = totalStationData[i]['tide-level']
    }

    let flowAndLevelData = {
        flow,
        level,
    }
    return flowAndLevelData
}



