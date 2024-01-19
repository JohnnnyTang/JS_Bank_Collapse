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
        url += (apiInfo[1].toLowerCase()+apiInfo[2]);
        console.log(url)

        if(apiInfo[apiInfo.length-1] != 'Item') {
            return backendInstance.get(url);
        }
        else {
            return backendInstance.get(url + '/id/' + dataNode.linkCode);
        }
    }

    static updateNodeInfo(nodeInfo) {
        
    }
}

// export default {
//     getDataNodeTree() {
//         // return instance.get(Vue.prototype.reqURL + "/user/hello")
//         return backendInstance.get("/dataNode/tree");
//     },
// }
