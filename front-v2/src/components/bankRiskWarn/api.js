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
}