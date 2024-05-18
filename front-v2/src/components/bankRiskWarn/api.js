import axios from 'axios'

const bankRiskWarnInstance = axios.create({
    baseURL: '/api'
})

export class bankRiskWarn {
    static runProfileModel = (profileId) => {
        const url = `/taskNode/start/multi/default/section/${profileId-1}`;
        return bankRiskWarnInstance.post(url)
    }

    static getProfileData = (profileId) => {
        const url = profileId < 10 ? `/fileData/json/jsonStr/name/multiWholeRes-JC0${profileId}/newest` : `/fileData/json/jsonStr/name/multiWholeRes-JC${profileId}/newest`;
        return bankRiskWarnInstance.get(url)
    }

    static runProfileModelByLine= (before, now, startPtX, startPtY, endPtX, endPtY) => {
        const url = `/taskNode/start/multi/default?begTime=${before}&endTime=${now}&startPt=${startPtX},${startPtY}&endPt=${endPtX},${endPtY}`
        return bankRiskWarnInstance.post(url)
    }

    static getRunStatus = (taskNodeId) => {
        const url = '/taskNode/' + taskNodeId + '/status'
        return bankRiskWarnInstance.get(url)
    }

    static getRunResult = (jsonId) => {
        const url = '/fileData/json/jsonStr/id/' + jsonId
        return bankRiskWarnInstance.get(url)
    }
}