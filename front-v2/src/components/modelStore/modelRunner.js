import axios from "axios";
import { ElNotification } from "element-plus";
export default class ModelRunner {


    constructor(modelUrl, paramsObject) {
        this.modelUrl = modelUrl;
        this.paramsObject = paramsObject;
    }

    async modelStart() {
        return new Promise((resolve, reject) => {
            axios.post(this.modelUrl, this.paramsObject).then(response => {
                console.log('model response! ', response)
                this.taskId = response.data
                resolve(this.taskId)
            }).catch(error => {
                ElNotification({
                    title: '模型启动失败',
                    message: '错误原因：\n' + error.message,
                    type: 'error',
                    position: 'top-left',
                    offset: 130,
                })
                console.warn(error)
                reject(error)
            })
        })

    }

    getRunningStatus() {
        return new Promise((resolve, reject) => {
            const url = `${import.meta.env.VITE_MAP_TILE_SERVER2}/taskNode/status/id?taskId=${this.taskId}`
            axios.get(url).then(response => {
                console.log('running status response! ', response)
                this.runningStatus = response.data
                resolve(this.runningStatus)
            }).catch(error => {
                console.warn(error)
                reject(error)
            })
        })
    }

    getModelResult() {
        return new Promise((resolve, reject) => {
            const url = `${import.meta.env.VITE_MAP_TILE_SERVER2}/taskNode/result/id?taskId=${this.taskId}`
            axios.get(url).then(response => {
                console.log('running model result! ', response.data)
                this.runningResult = response.data
                this.caseId = response.data['case-id']
                resolve(this.runningResult)
            }).catch(error => {
                console.warn(error)
                reject(error)
            })
        })
    }

    getErrorLog() {
        return new Promise((resolve, reject) => {
            const url = `${import.meta.env.VITE_MAP_TILE_SERVER2}/taskNode/result/id?taskId=${this.taskId}`
            axios.get(url).then(response => {
                let errorLog = response.data['error-log']
                resolve(errorLog)
            }).catch(error => {
                console.warn(error)
                reject(error)
            })
        })
    }

    async getModelResultFile(fileName, fileType = 'json') {
        return new Promise((resolve, reject) => {
            const MAP = {
                'image': `${import.meta.env.VITE_MAP_TILE_SERVER2}/data/bankResource/down/modelServer/result/file/image?caseId=${this.caseId}&name=${fileName}`,

                'json': `${import.meta.env.VITE_MAP_TILE_SERVER2}/data/bankResource/down/modelServer/result/file/json?caseId=${this.caseId}&name=${fileName}`
            }
            let url = MAP[fileType]
            axios.get(url).then(response => {
                console.log('running model result file! ', response.data)
                resolve(response.data)
            }).catch(error => {
                console.warn(error)
                reject(error)
            })
        })
    }
}
