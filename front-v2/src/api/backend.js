// import axios from 'axios'
import axios from 'axios'
import CommonUtils from '../utils/CommonUtils'
import { ElMessage } from 'element-plus';
import router from '../router/index'

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
})
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
        console.log('hello',response.data)
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
        return backendInstance.get('/data/channel')
    }

    static getbankLineData() {
        return backendInstance.get('/data/bankLine')
    }

    static getBankLineSimpleData() {
        return backendInstance.get('/data/bankLine/simple')
    }

    static getHistoryInfo() {
        return backendInstance.get('/data/historyInfo')
    }

    static getMonitorInfo() {
        return backendInstance.get('/data/monitorInfo')
    }

    static getSpecMonitorInfo(type) {
        //设备概述信息！！！！
        switch (type) {
            case '1':
                return backendInstance.get('/data/monitorInfo/type/1')
            case '2':
                return backendInstance.get('/data/monitorInfo/type/2')
            case '3':
                return backendInstance.get('/data/monitorInfo/type/3')
            case '4':
                return backendInstance.get('/data/monitorInfo/type/4')
        }
    }

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
                return new Promise((sresolve) => {
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
                appKey: 'd228a2fab09d4c879b4449c356bbd90d',
                appSecret: '0c46042ef59aed43c4eddbb80d637369',
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
