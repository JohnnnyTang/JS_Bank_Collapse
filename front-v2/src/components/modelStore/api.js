import axios from "axios";

const DeviceInstance = axios.create({
    baseURL: '/device',
})

export default class DeviceRequest {

    // GNSS设备
    static getGNSSAllData() {
        return DeviceInstance.get('/gnss/record/getAll')
    }

    static getGNSSMachineNum() {
        return DeviceInstance.get('/machine/info/count?type=1')
    }

    static getGNSSRecordNum() {
        return DeviceInstance.get('/gnss/record/count')
    }

    static getGNSSRecordLatestTime() {
        return DeviceInstance.get('/gnss/record/latesttime')
    }

    // 孔隙水压力计设备
    static getManometerAllData() {
        return DeviceInstance.get('/manometer/record/getAll')
    }

    static getManometerMachineNum() {
        return DeviceInstance.get('/machine/info/count?type=3')
    }

    static getManometerRecordNum() {
        return DeviceInstance.get('/manometer/record/count')
    }

    static getManometerRecordLatestTime() {
        return DeviceInstance.get('/manometer/record/latesttime')
    }

    // 测斜孔设备
    static getInclinometerAllData() {
        return DeviceInstance.get('/inclinometer/record/getAll')
    }

    static getInclinometerMachineNum() {
        return DeviceInstance.get('/machine/info/count?type=4')
    }

    static getInclinometerRecordNum() {
        return DeviceInstance.get('/inclinometer/record/count')
    }

    static getInclinometerRecordLatestTime() {
        return DeviceInstance.get('/inclinometer/record/latesttime')
    }

    // 应力桩设备
    static getStresspileAllData() {
        return DeviceInstance.get('/stresspile/record/getAll')
    }

    static getStresspileMachineNum() {
        return DeviceInstance.get('/machine/info/count?type=2')
    }

    static getStresspileRecordNum() {
        return DeviceInstance.get('/stresspile/record/count')
    }

    static getStresspileRecordLatestTime() {
        return DeviceInstance.get('/stresspile/record/latesttime')
    }
} 