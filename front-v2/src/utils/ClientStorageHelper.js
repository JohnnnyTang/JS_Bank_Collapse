import CryptoJS from "crypto-js"
/*
模型参数和计算结果信息 :: 参数作Key 结果作Value --- SessionStorage
模型计算结果信息 :: (路由)作key 参数作Value --- SessionStorage
*/


class ClientStorageHelper {
    constructor() { }

    static generateKey(obj) {
        const jsonStr = JSON.stringify(obj)
        const md5Str = CryptoJS.MD5(jsonStr).toString()
        return md5Str
    }

    static save(key, value) {
        sessionStorage.setItem(key, value)
    }

    static get(key) {
        return sessionStorage.getItem(key)
    }

    // static clean() {
    //     sessionStorage.clear()
    // }
}






export default ClientStorageHelper