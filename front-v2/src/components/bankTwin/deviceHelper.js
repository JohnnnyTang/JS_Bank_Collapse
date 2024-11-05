import axios from "axios";

const axiosIns = axios.create({
    baseURL: import.meta.env.VITE_MAP_TILE_SERVER2 + "/data/bankResource",
})
axiosIns.interceptors.response.use((response) => {
    if (response.data.code === 500) {
        ElMessage.error({
            offset: 120,
            message: ' 500-服务器内部错误'
        })
        return null;
    }
    return response;
})


export default class DeviceHelper {
    static DeviceTypeMap = {
        "GNSS": "1",
        "STRESS": "2",
        "MENOMETER": "3",
        "INCLINE": "4",
        "VEDIO": "6"
    }
    /**
     * 
     * @param {"GNSS" | "STRESS" | "MENOMETER" | "INCLINE" | "VEDIO"} deviceType 
     * @param {*} bankEnName 
     */
    static getTypeMonitorInfo(deviceType, bankEnName) {
        const params = {
            bank: bankEnName,
            typeCode: this.DeviceTypeMap[deviceType]
        }
        return axiosIns.get(`/bank/device/type`, { params })
    }

    static getMonitorInfo(bankEnName) {
        return new Promise((resolve) => {
            Promise.all([
                axiosIns.get(`/bank/device/type?bank=${bankEnName}&typeCode=1`),//GNSS
                axiosIns.get(`/bank/device/type?bank=${bankEnName}&typeCode=2`),//STRESS
                axiosIns.get(`/bank/device/type?bank=${bankEnName}&typeCode=3`),//MENOMETER
                axiosIns.get(`/bank/device/type?bank=${bankEnName}&typeCode=4`),//INCLINE
                axiosIns.get(`/bank/device/type?bank=${bankEnName}&typeCode=6`),//VEDIO
            ]).then(res => {
                const monitorInfo = []
                res.forEach(item => {
                    monitorInfo.push(...item.data)
                })
                resolve(monitorInfo)
            })
        })
    }

    static async getProcessedMonitorInfo(bankEnName) {



        const output = {
            'GNSS': {
                'NAME_CODE_Map': {},
                'DeviceList': []
            },
            'STRESS': {
                'NAME_CODE_Map': {},
                'DeviceList': []
            },
            'MENOMETER': {
                'NAME_CODE_Map': {},
                'DeviceList': []
            },
            'INCLINE': {
                'NAME_CODE_Map': {},
                'DeviceList': []
            },
            'VEDIO': {
                'NAME_CODE_Map': {},
                'DeviceList': []
            },
        }


        // single
        /**
         * @param {'GNSS' | 'STRESS' | 'MENOMETER' | 'INCLINE' | 'VEDIO'} deviceType 
         * @returns 
         */
        const getAndParseMonitorInfo = async (deviceType) => {
            let typeCode = this.DeviceTypeMap[deviceType]
            const monitorInfo = (await axiosIns.get(`/bank/device/type?bank=${bankEnName}&typeCode=${typeCode}`)).data
            let NAME_CODE_Map = {}
            let deviceList = []
            monitorInfo.forEach(item => {
                NAME_CODE_Map[item.name] = item.code
                deviceList.push(item.name)
            })
            output[deviceType]['NAME_CODE_Map'] = NAME_CODE_Map
            output[deviceType]['DeviceList'] = deviceList
        }


        for (let deviceType of Object.keys(this.DeviceTypeMap)) {
            await getAndParseMonitorInfo(deviceType)
        }

        return output;
    }
}