import axios from "axios";
import CommonUtils from '../utils/CommonUtils';

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
})

export default class BackEndRequest {
    static getDataNodeTree() {
        // return instance.get(Vue.prototype.reqURL + "/user/hello")
        return backendInstance.get("/dataNode/tree");
    }

    static getDataNodeData(dataNode) {
        let url = '/data/';
        let apiInfo = CommonUtils.getApiInfoFromCategory(dataNode.category);
        // console.log(apiInfo);
        url += (apiInfo[1].toLowerCase() + apiInfo[2]);
        console.log(url)

        if (apiInfo[apiInfo.length - 1] != 'Item') {
            return backendInstance.get(url);
        }
        else {
            return backendInstance.get(url + '/id/' + dataNode.linkCode);
        }
    }

    static getChannelData() {
        return backendInstance.get("/data/channel")
    }

    static getbankLineData() {
        return backendInstance.get("/data/bankLine")
    }

    static getHistoryInfo() {
        return backendInstance.get("/data/historyInfo")
    }

    static getMonitorInfo() {
        return backendInstance.get("/data/monitorInfo")
    }

    static getSpecMonitorInfo(type){
        //设备概述信息！！！！
        switch(type){
            case '1':
                return backendInstance.get("/data/monitorInfo/type/1")
            case '2':
                return backendInstance.get("/data/monitorInfo/type/2");
            case '3':
                return backendInstance.get("/data/monitorInfo/type/3");
            case '4':
                return backendInstance.get("/data/monitorInfo/type/4");
        }   
    }

    static getMonitorDetailByType_Code(code, type) {
        //data
        switch (type) {
            case '1': {
                return backendInstance.get(`/data/gnssData/id/${code}`)
            }
            case '2': {
                return backendInstance.get(`/data/inclinometerData/id/${code}`)

            }
            case '3': {
                return backendInstance.get(`/data/manometerData/id/${code}`)

            }
            case '4': {
                return backendInstance.get(`/data/stressData/id/${code}`)
            }
        }
    }


    static getMonitorInfoByType_Code(code,type){
        //desc
        switch (type) {
            case '1': {
                return new Promise((resolve)=>{resolve({data:{pointNum:0}})})
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

}


// export default {
//     getDataNodeTree() {
//         // return instance.get(Vue.prototype.reqURL + "/user/hello")
//         return backendInstance.get("/dataNode/tree");
//     },
// }
