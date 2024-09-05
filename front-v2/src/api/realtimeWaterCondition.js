// This file is used to get real-time water condition data from the API.
import axios from "axios";
import { ElMessage } from "element-plus";


export const getRealTimeStationData = async () => {
    // let stationData = []
    // try {
    //     const response = await axios.get('/realtimeWaterCondition/stations');
    //     const data = response.data
    //     const parse = (dt) => {
    //         // 。。。
    //     }
    //     stationData = parse(data)
    // } catch (error) {
    //     ElMessage.error({
    //         message: '获取站点实时水文信息失败!',
    //         offset: 120
    //     });
    //     const defaultStationData = [
    //         {
    //             station: '大通站',
    //             flow: 'N/A',
    //             level: 'N/A',
    //         },
    //         {
    //             station: '南京站',
    //             flow: 'N/A',
    //             level: 'N/A',
    //         },
    //         {
    //             station: '镇江站',
    //             flow: 'N/A',
    //             level: 'N/A',
    //         },
    //         {
    //             station: '三江营站',
    //             flow: 'N/A',
    //             level: 'N/A',
    //         },
    //         {
    //             station: '江阴站',
    //             flow: 'N/A',
    //             level: 'N/A',
    //         },
    //         {
    //             station: '徐六泾站',
    //             flow: 'N/A',
    //             level: 'N/A',
    //         },
    //     ]
    //     stationData = defaultStationData
    // }
    return [
        {
            station: '大通站',
            flow: 'N/A',
            level: 'N/A',
        },
        {
            station: '南京站',
            flow: 'N/A',
            level: 'N/A',
        },
        {
            station: '镇江站',
            flow: 'N/A',
            level: 'N/A',
        },
        {
            station: '三江营站',
            flow: 'N/A',
            level: 'N/A',
        },
        {
            station: '江阴站',
            flow: 'N/A',
            level: 'N/A',
        },
        {
            station: '徐六泾站',
            flow: 'N/A',
            level: 'N/A',
        },
    ]
}

export const getRealTimeFlowAndLevelData = async () => {
    let flowAndLevelData = {
        flow: 35000,
        level: 2.1
    }
    // try {
    //     const response = await axios.get('/realtimeWaterCondition/flowAndLevel');
    //     const data = response.data
    //     const parse = (dt) => {
    //         // 。。。
    //     }
    //     flowAndLevelData = parse(data)
    // } catch (error) {
    //     ElMessage.error({
    //         message: '获取实时水文条件失败!',
    //         offset: 120
    //     });
    //     flowAndLevelData = {
    //         flow: 35000,
    //         level: 2.1
    //     }
    // }
    return flowAndLevelData
}



