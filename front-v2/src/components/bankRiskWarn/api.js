import axios from 'axios'

const bankRiskWarnInstance = axios.create({
    baseURL: '/api'
})

export class bankRiskWarn {
    static runProfileModelTest = (profileId) => {
        const url = `/taskNode/start/multi/default/section/${profileId-1}`;
        return bankRiskWarnInstance.post(url)
    }

    static getProfileDataTest = (profileId) => {
        const url = profileId < 10 ? `/fileData/json/jsonStr/name/multiWholeRes-JC0${profileId}/newest` : `/fileData/json/jsonStr/name/multiWholeRes-JC${profileId}/newest`;
        return bankRiskWarnInstance.get(url)
    }

    static runProfileModel = (before, now, profileId) => {
        const url = `/taskNode/start/multi/default/section/${profileId-1}/beg/${before}/end/${now}`;
        return bankRiskWarnInstance.post(url)
    }

    static getProfileData = (before, now, profileId) => {
        const url = profileId < 10 ? 
        `/fileData/json/jsonStr/name/multiWholeRes-JC0${profileId}_beg${before}_end${now}/newest` : 
        `/fileData/json/jsonStr/name/multiWholeRes-JC${profileId}_beg${before}_end${now}/newest`;
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