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
                    title: '模型运行失败',
                    message: '错误原因：\n' + error.message,
                    type: 'error',
                    duration: 0
                })
                console.warn(error)
                reject(error)
            })
        })

    }

    getRunningStatus() {
        return new Promise((resolve, reject) => {
            const url = `/model/taskNode/status/id?taskId=${this.taskId}`
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
            const url = `/model/taskNode/result/id?taskId=${this.taskId}`
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
            const url = `/model/taskNode/result/id?taskId=${this.taskId}`
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
                // 'bin': `/model/data/modelServer/down/resource/file/bin?name=&name=${fileName}`,
                // /model/data/modelServer/down/result/file/json?caseId=dcfa6865c911e10c44d86ef45788b5c2&name=section.json
                'image': `/model/data/bankResource/down/modelServer/result/file/image?caseId=${this.caseId}&name=${fileName}`,

                'json': `/model/data/bankResource/down/modelServer/result/file/json?caseId=${this.caseId}&name=${fileName}`
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
