/**
 *
 * @param {string} url
 * @param {object} option
 * @param {number} timeout
 * @param {number} retry
 * @returns
 */
import axios from 'axios'
const ModelInstance = axios.create({
    baseURL: '/api',
})

export const extendFetch = async (url, option, timeout = 3000, retry = 3) => {
    let num = 0
    let response
    while (num < retry) {
        const abortController = new AbortController()
        const timeoutID = setTimeout(() => {
            abortController.abort()
        }, timeout)

        response = await fetch(url, {
            ...option,
            signal: abortController.signal,
            'token': localStorage.getItem('token'),
        })
            .then((res) => {
                return res
            })
            .catch(() => {
                return null
            })
        clearTimeout(timeoutID)
        if (response) return response
        else num++
    }
    throw Error(`fetch fail after ${retry} times`)
}

const powerBody = {
    modelNode: {
        id: '662a3c0e69037b3a4d26df1c',
    },
    paramNode: {
        modelId: '662a3c0e69037b3a4d26df1c',
        params: {
            jsonId: '662a3e4acff7845d51a7bb63',
            year: '', // 1990-2023
            condition: '', // 'dry' or 'flood'
        },
        name: 'multiIndexPowerItem-xxxx',
        auth: 'all',
        category: 'ModelParamItem',
        path: ',paramNode,multiIndexPowerParamGroup,',
    },
    dataNode: {},
    status: '0',
    result: {
        resultString: '',

        resJsonId: '',
    },
    ifAuto: false,
    name: 'waterIndexModelTaskItem-xxxx',
    auth: 'all',
    category: 'ModelTaskItem',
    path: ',taskNode,waterIndexModelTaskGroup,',
}

const evolutionBody = {
    modelNode: {
        id: '662a427276ff9b32ec9053e5',
    },
    paramNode: {
        modelId: '662a427276ff9b32ec9053e5',
        params: {
            jsonId: '662a3e4acff7845d51a7bb63',
            year: '', // 2020 - 2023
        },
        name: 'multiIndexEvolveItem-xxxx',
        auth: 'all',
        category: 'ModelParamItem',
        path: ',paramNode,multiIndexEvolveParamGroup,',
    },
    dataNode: {},
    status: '0',
    result: {
        resultString: '',
        resJsonId: '',
    },
    ifAuto: false,
    name: 'evolveIndexModelTaskItem-xxxx',
    auth: 'all',
    category: 'ModelTaskItem',
    path: ',taskNode,evolveIndexModelTaskGroup,',
}

/**
 *
 * @param {string} type
 * @param {string} jsonID
 * @param {string} condition
 * @param {number} year
 */
export const postTaskStartAPI = async (type, jsonID, condition, year) => {
    const body = type === 'power' ? powerBody : evolutionBody
    body.paramNode.params.jsonId = jsonID
    type === 'power' && (body.paramNode.params.condition = condition)
    body.paramNode.params.year = year.toString()

    const response = await extendFetch('/api/taskNode/start', {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token'),
        }),
        body: JSON.stringify(body),
    })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw Error()
            }
        })
        .then((value) => {
            return {
                status: 'success',
                data: value,
                message: '',
            }
        })
        .catch(() => {
            return {
                status: 'error',
                data: null,
                message: '',
            }
        })

    return response
}

/**
 *
 * @param {string} taskID
 * @returns
 */
export const getTaskStatusAPI = async (taskID) => {
    const response = await extendFetch(`/api/taskNode/${taskID}/status`)
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw Error()
            }
        })
        .then((value) => {
            return {
                status: 'success',
                data: value,
                message: '',
            }
        })
        .catch(() => {
            return {
                status: 'error',
                data: null,
                message: '',
            }
        })

    return response
}

/**
 *
 * @param {string} taskID
 * @returns
 */
export const getTaskJsonAPI = async (taskID) => {
    const response = await extendFetch(`/api/fileData/json/jsonStr/id/${taskID}`)
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw Error()
            }
        })
        .then((value) => {
            return {
                status: 'success',
                data: value,
                message: '',
            }
        })
        .catch(() => {
            return {
                status: 'error',
                data: null,
                message: '',
            }
        })

    return response
}

export class riskMatrixModel {
    static runModel = (json) => {
        return ModelInstance.post('/taskNode/start', json)
    }

    static getRunStatus = (taskNodeId) => {
        const url = '/taskNode/' + taskNodeId + '/status'
        return ModelInstance.get(url)
    }

    static getRunResult = (jsonId) => {
        const url = '/fileData/json/jsonStr/id/' + jsonId
        return ModelInstance.get(url)
    }
}
