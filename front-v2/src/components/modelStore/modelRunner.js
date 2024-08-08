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
                    message: '错误原因：\n'+error.message,
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
            const url = `/temp/taskNode/status/id?taskId=${this.taskId}`
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
            const url = `/temp/taskNode/result/id?taskId=${this.taskId}`
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
            const url = `/temp/taskNode/result/id?taskId=${this.taskId}`
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
                // 'common': `/temp/data/modelServer/file/common?caseId=${this.caseId}&name=${fileName}`,
                'bin': `/temp/data/modelServer/down/resource/file/bin?name=&name=${fileName}`,
                'image': `/temp/data/modelServer/down/resource/file/image?name=${fileName}`,
                'json': `/temp/data/modelServer/down/resource/file/json?name=${fileName}`
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
