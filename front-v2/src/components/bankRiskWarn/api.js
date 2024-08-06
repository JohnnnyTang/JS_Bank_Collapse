import axios from 'axios'

export class bankRiskWarn {
    static runProfileModelTest = (profileId) => {
        const url = `/api/taskNode/start/multi/default/section/${profileId - 1}`;
        return axios.post(url)
    }

    static getProfileDataTest = (profileId) => {
        const url = profileId < 10 ? `/api/fileData/json/jsonStr/name/multiWholeRes-JC0${profileId}/newest` : `/fileData/json/jsonStr/name/multiWholeRes-JC${profileId}/newest`;
        return axios.get(url)
    }

    static runProfileModel_short = (before, now, profileId) => {
        const url = `/api/taskNode/start/multi/default/section/${profileId - 1}/beg/${before}/end/${now}`;
        return axios.post(url)
    }

    static runProfileModel_long = (before, now, profileId) => {
        const url = `/api/taskNode/start/multi/default/section/long/${profileId - 1}/beg/${before}/end/${now}`;
        return axios.post(url)
    }

    static getProfileData = (before, now, profileId) => {
        const url = profileId < 10 ?
            `/api/fileData/json/jsonStr/name/multiWholeRes-JC0${profileId}_beg${before}_end${now}/newest` :
            `/api/fileData/json/jsonStr/name/multiWholeRes-JC${profileId}_beg${before}_end${now}/newest`;
        return axios.get(url)
    }

    static runProfileModelByLine = (before, now, startPtX, startPtY, endPtX, endPtY) => {
        const url = `/api/taskNode/start/multi/default?begTime=${before}&endTime=${now}&startPt=${startPtX},${startPtY}&endPt=${endPtX},${endPtY}`
        return axios.post(url)
    }

    static getRunStatus = (taskNodeId) => {
        const url = '/api/taskNode/' + taskNodeId + '/status'
        return axios.get(url)
    }

    static getRunResult = (jsonId) => {
        const url = '/api/fileData/json/jsonStr/id/' + jsonId
        return axios.get(url)
    }
}