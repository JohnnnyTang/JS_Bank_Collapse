// import axios from 'axios'
import axios from 'axios'
import CommonUtils from '../utils/CommonUtils'
import { ElMessage } from 'element-plus';
import router from '../router/index'

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
})


///////////////////////////////////////////////////////
const bankName = [
    'Mzs',  //民主沙
    'Zys',  //自由沙
]
const newBackendInstance = axios.create({
    baseURL: '/model/'
})
///////////////////////////////////////////////////////


const login = import.meta.env.VITE_LOGIN
if (login === 'YSE') {
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
        return newBackendInstance.get(`/data/bank/Mzs/monitorInfo`)          //可更改
    }

    static getSpecMonitorInfo(type) {
        //设备概述信息！！！！
        switch (type) {
            case '1':
                return newBackendInstance.get('/data/bank/Mzs/monitorInfo/type/1')      //可更改
            case '2':
                return newBackendInstance.get('/data/bank/Mzs/monitorInfo/type/2')      //可更改
            case '3':
                return newBackendInstance.get('/data/bank/Mzs/monitorInfo/type/3')      //可更改
            case '4':
                return newBackendInstance.get('/data/bank/Mzs/monitorInfo/type/4')      //可更改
        }
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
        backendInstance.get(url,params)
    }
///////////////////////////////////////////////////////


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
            //分布式光纤
            // case '5': {
            //     // return backendInstance.get(`/data/fiberData/day/1/device/${code}`)
            //     return backendInstance.get(
            //         `/data/fiberData/hour/5/device/${code}`,
            //     )
            // }
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

    static getMonitorDataByTypeIdWithTime(typeStr, id, timeUnit, timeCount) {
        return backendInstance.get(
            `/data/${typeStr}Data/${timeUnit}/${timeCount}/device/${id}`,
        )
    }

    static getAllTypeMonitorNewestData() {
        return axios.all([
            backendInstance.get('/data/gnssData/newest'),
            backendInstance.get('/data/stressData/newest'),
            backendInstance.get('/data/manometerData/newest'),
            backendInstance.get('/data/inclinometerData/newest'),
            // backendInstance.get('/data/fiberData/newest'),
        ])
    }

    static getDeviceNewestData(deviceType, deviceId) {
        return backendInstance.get(
            `/data/${deviceType}Data/newest/device/${deviceId}`,
        )
    }

    static getVideoDeviceInfo() {
        return backendInstance.get('/data/monitorInfo/type/6')
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
