import axios from "axios";
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

    async getModelResultFile(fileName, fileType = 'common') {
        return new Promise((resolve, reject) => {
            const MAP = {
                'common': `/temp/data/modelServer/file/common?caseId=${this.caseId}&name=${fileName}`,
                'bin': `/temp/data/modelServer/file/bin?caseId=${this.caseId}&name=${fileName}`,
                'image': `/temp/data/modelServer/file/image?caseId=${this.caseId}&name=${fileName}`,
                'json': `/temp/data/modelServer/file/json?caseId=${this.caseId}&name=${fileName}`
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

async function asyncTemplate(url) {
    return new Promise((resolve, reject) => {
        const MAP = {
            'common': `/temp/data/modelServer/file/common?caseId=${this.caseId}&name=${fileName}`,
            'bin': `/temp/data/modelServer/file/bin?caseId=${this.caseId}&name=${fileName}`,
            'image': `/temp/data/modelServer/file/image?caseId=${this.caseId}&name=${fileName}`
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