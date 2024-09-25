// import axios from 'axios'
import axios from 'axios'
import CommonUtils from '../utils/CommonUtils'
import { ElMessage } from 'element-plus';
import router from '../router/index'
import { useBankNameStore } from '../store/bankNameStore';
import { useBankInfoStore } from '../store/bankInfoStore';

//v1前缀
const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
})
//v2前缀
const newBackendInstance = axios.create({
    baseURL: '/model/'      //v2版本api前缀
})

// const bankNameStore = useBankNameStore()

const login = import.meta.env.VITE_LOGIN
if (login === 'YES') {
    backendInstance.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            // const token = sessionStorage.getItem('token');
            if (token) {
                config.headers["token"] = token;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
    backendInstance.interceptors.response.use(
        response => {
            if (response.data["msg"] === "token过期") {
                ElMessage.error("用户认证过期，请重新登录");
                router.push('/login');
                return Promise.reject(response.data);
            }
            return response;
        },
        error => {
            return Promise.reject(error);
        }
    );
}

export default class BackEndRequest {
    static getDataNodeTree() {
        // return instance.get(Vue.prototype.reqURL + "/user/hello")
        return backendInstance.get('/dataNode/tree')
        // return newBackendInstance.get('dataNode/tree')      //  v2版本, status 500 internal server error
    }

    static getDataNodeData(dataNode) {
        let url = '/data/'
        let apiInfo = CommonUtils.getApiInfoFromCategory(dataNode.category)
        // console.log(apiInfo);
        url += apiInfo[1].toLowerCase() + apiInfo[2]
        console.log(url)

        if (apiInfo[apiInfo.length - 1] != 'Item') {
            return backendInstance.get(url)
        } else {
            return backendInstance.get(url + '/id/' + dataNode.linkCode)
        }
    }

    static getChannelData() {
        return backendInstance.get('/data/channel')     //暂不改
    }

    static getbankLineData() {
        return backendInstance.get('/data/bankLine')    //暂不改
    }

    static getBankLineSimpleData() {
        return backendInstance.get('/data/bankLine/simple')     //暂不改
    }

    static getHistoryInfo() {
        return backendInstance.get('/data/historyInfo')         //暂不改
    }

    static getMonitorInfo() {
        let bank = useBankNameStore().globalBankName
        return newBackendInstance.get(`/data/bank/${bank}/monitorInfo`)     //v2版本
        // return backendInstance.get('/data/monitorInfo')  //v1版本
    }

///////////////////////////////////////////////////////
    static test() {
        let url = '/api/v2/data/bank/Mzs/monitorData'
        const params = {
            bank: 'Mzs',
            timeUnit: 'hour',
            deviceCode: '123',
            dur: 3
        }
       return backendInstance.get(url,params)
    }
///////////////////////////////////////////////////////

//设备概述信息！！！！  v1版本
// static getSpecMonitorInfo(type) {
//     switch (type) {
//         case '1':
//             return backendInstance.get(`/data/monitorInfo/type/1`)  
//         case '2':
//             return backendInstance.get(`/data/monitorInfo/type/2`) 
//         case '3':
//             return backendInstance.get(`/data/monitorInfo/type/3`)  
//         case '4':
//             return backendInstance.get(`/data/monitorInfo/type/4`)  
//     }
// }

//设备概述信息！！！！  v2版本
static getSpecMonitorInfo(type) {
    let bank = useBankNameStore().globalBankName
    switch (type) {
        case '1':
            return newBackendInstance.get(`/data/bank/${bank}/monitorInfo/type/1`)      
        case '2':
            return newBackendInstance.get(`/data/bank/${bank}/monitorInfo/type/2`)      
        case '3':
            return newBackendInstance.get(`/data/bank/${bank}/monitorInfo/type/3`)      
        case '4':
            return newBackendInstance.get(`/data/bank/${bank}/monitorInfo/type/4`)      
    }
}

///////////////////////////////////////////////////////
    //v1版本    与ChartData.js耦合
    static getMonitorDetailByType_Code(code, type) {
        //data
        switch (type) {
            case '1': {
                // return backendInstance.get(`/data/gnssData/id/${code}`)
                // return backendInstance.get(`/data/gnssData/day/1/device/${code}`)
                return backendInstance.get(
                    `/data/gnssData/hour/5/device/${code}`,
                )
            }
            case '2': {
                // return backendInstance.get(`/data/stressData/id/${code}`)
                // return new Promise((resolve) => { resolve({ data: [] }) })
                return backendInstance.get(
                    `/data/stressData/hour/5/device/${code}`,
                )
            }
            case '3': {
                // return backendInstance.get(`/data/manometerData/id/${code}`)
                // return backendInstance.get(`/data/manometerData/day/1/device/${code}`)
                return backendInstance.get(
                    `/data/manometerData/hour/5/device/${code}`,
                )
            }
            case '4': {
                // return backendInstance.get(`/data/inclinometerData/day/1/device/${code}`)
                return backendInstance.get(
                    `/data/inclinometerData/hour/5/device/${code}`,
                )
            }
        }
    }

    static getMonitorInfoByType_Code(code, type) {
        //desc
        switch (type) {
            case '1': {
                return new Promise((resolve) => {
                    resolve({ data: { pointNum: 0 } })
                })
                // return backendInstance.get(`/data/gnssInfo/id/${code}`)
            }
            case '2': {
                return backendInstance.get(`/data/inclinometerInfo/id/${code}`)
            }
            case '3': {
                return backendInstance.get(`/data/manometerInfo/id/${code}`)
            }
            case '4': {
                return backendInstance.get(`/data/stressInfo/id/${code}`)
            }
        }
    }

    // //v2版本 
    static getMonitorDataByCode(deviceCode) {
        let bank = useBankNameStore().globalBankName
        return newBackendInstance.get(`/data/bank/${bank}/monitorData/hour/5/device/${deviceCode}/`)
    }

    static getMonitorInfoByCode(id) {
        let bank = useBankNameStore().globalBankName
        return newBackendInstance.get(`/data/bank/${bank}/monitorInfo/id/${id}`)
    }

///////////////////////////////////////////////////////

    //v1版本    与RealtimeStatus.vue耦合
    // static getMonitorDataByTypeIdWithTime(typeStr, id, timeUnit, timeCount) {
    //     return backendInstance.get(
    //         `/data/${typeStr}Data/${timeUnit}/${timeCount}/device/${id}`,
    //     )
    // }
    //v2版本
    static getMonitorDataByTypeIdWithTime(timeUnit, interval, deviceCode) {
        let bank = useBankNameStore().globalBankName
        return newBackendInstance.get(
            `/data/bank/${bank}/monitorData/${timeUnit}/${interval}/device/${deviceCode}`
        )
    }

    //v1版本    与RealtimeStatus.vue耦合————解决
    // static getAllTypeMonitorNewestData() {
    //     return axios.all([
    //         backendInstance.get('/data/gnssData/newest'),
    //         backendInstance.get('/data/stressData/newest'),
    //         backendInstance.get('/data/manometerData/newest'),
    //         backendInstance.get('/data/inclinometerData/newest'),
    //     ])
    // }
    //v2版本
    static getAllTypeMonitorNewestData() {
        let bank = useBankNameStore().globalBankName
        return axios.all([
            newBackendInstance.get(`/data/bank/${bank}/monitorData/newest/type/1`),
            newBackendInstance.get(`/data/bank/${bank}/monitorData/newest/type/2`),
            newBackendInstance.get(`/data/bank/${bank}/monitorData/newest/type/3`),
            newBackendInstance.get(`/data/bank/${bank}/monitorData/newest/type/4`)
        ])
    }

    //v1版本    与RealtimeStatus.vue耦合————解决
    // static getDeviceNewestData(deviceType, deviceId) {
    //     return backendInstance.get(`/data/${deviceType}Data/newest/device/${deviceId}`)
    // }
    // v2版本
    static getDeviceNewestData(deviceCode) {
        let bank = useBankNameStore().globalBankName
        return newBackendInstance.get(`/data/bank/${bank}/monitorData/newest/device/${deviceCode}`)
    }

    //v1版本    与BankVideo.vue耦合————解决
    // static getVideoDeviceInfo() {
    //     return backendInstance.get('/data/monitorInfo/type/6')
    // }
    //v2版本
    static getVideoDeviceInfo() {
        let bank = useBankNameStore().globalBankName
        return newBackendInstance.get(`/data/bank/${bank}/monitorInfo/type/6`)
    }

    static getMonitorWarningInfomation() {
        return new Promise((resolve) => {
            resolve({
                data: [
                    {
                        deviceCode: 'MZS120.55327892_32.02707923_1',
                        warningValue: '16.64m',
                        time: '123',
                    },
                    {
                        deviceCode: 'MZS120.55649757_32.02592404_1',
                        warningValue: '13.42m',
                        time: '123',
                    },
                ],
            })
        })
    }

    static getHistoryWarnInfo(timeUnit, timeCount) {
        return backendInstance.get(`/data/deviceWarn/${timeUnit}/${timeCount}`)
    }

    static updateWarnDealtStatus(dataId, dealt) {
        return backendInstance.put(
            `/data/deviceWarn/id/${dataId}/deal/${dealt}`,
        )
    }

    static getVideoToken() {
        return axios.post(`https://open.ys7.com/api/lapp/token/get`, null, {
            params: {
                appKey: '2f4ba8e320884836a7c7b0cb292b5f03',
                appSecret: '5c3a2c8bf600b6107fa2f6135cc0f1cd',
            },
        })
    }
}

// export default {
//     getDataNodeTree() {
//         // return instance.get(Vue.prototype.reqURL + "/user/hello")
//         return backendInstance.get("/dataNode/tree");
//     },
// }
