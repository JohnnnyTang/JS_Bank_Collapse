import axios from "axios";
import { initialTableDatas } from '../../bankManage/bankResource'
import { ElMessage } from "element-plus";

const axiosIns = axios.create({
    baseURL: "/model/data/bankResource",
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



const axiosIns4Device = axios.create({
    baseURL: "/model/data",
})
axiosIns4Device.interceptors.response.use((response) => {
    if (response.data.code === 500) {
        ElMessage.error({
            offset: 120,
            message: ' 500-服务器内部错误'
        })
        return null;
    }
    return response;
})

/**
 * @typedef {Object} DeviceInfo
 * @property {string} bank - 岸段名称。
 * @property {string} aspect - 方位角。
 * @property {string} deviceId - 设备ID。
 * @property {string} deviceName - 设备名字。
 * @property {string} type - 类型标识。
 * @property {number} longitude - 经度。
 * @property {number} latitude - 纬度。
 * @property {number} elevation - 海拔高度。
 */

export default class BankResourceHelper {

    ////////////////////////////////////BANK BASIC INFO
    static getBankNamesList() {
        return axiosIns.get("/bank")
    }

    static getOneBankBasicInfo(bankEnName) {
        return axiosIns.get("/bank/" + bankEnName)
    }

    static createNewBank(bankEnName, bankInfo) {
        /*
        {
            "bank":"Zys",
            "name":"自由沙",
            "riskLevel":"I级",
            "introduction":"民主沙右缘位于长江澄通河段，分属泰州市的靖江市和南通市的如皋市，是水利部长江委、省市县的Ⅰ级预警岸段。近年民主沙南侧的浏海沙水道深槽坐弯、深泓左偏，致来民主沙右缘持续冲退，影响局部河势稳定。同时民主沙为张皋过江通道拟建桥址所在地。",
            "management": {
                "department": "靖江市水利局/如皋市水利局",
                "contact": "xxxxxxxxxxx"
            },
            "center": [
                120.55,
                32.04
            ]
        }
        */
        return axiosIns.post(`/up/local/resource/bank/${bankEnName}`, bankInfo)
    }

    static updateBankBasicInfo(bankEnName, bankInfo) {
        return axiosIns.put(`/update/local/resource/bank/${bankEnName}`, bankInfo)
    }

    static deleteBank(bankEnName) {
        if (bankEnName === 'Mzs') {
            return new Promise((resolve, reject) => {
                reject('Mzs can not be deleted')
            })
        }
        return axiosIns.delete(`/delete/local/resource/bank/${bankEnName}`)
    }


    /////////////////////////////////BANK RESOURCE
    //////////////// MODEL RESOURCE ////////////////
    /**
     * 
     * @param {"Hydrodynamic" | "DEM" | "Boundary" | "Config | "Section"} dataType 
     * @param {*} bankEnName 
     */
    static getBankCalculateResourceList(dataType, bankEnName) {
        // const params = {
        //     dataType: dataType,
        //     bank: bankEnName
        // }
        // return axiosIns.get(`/bank/calculate/dataType`, { params: params })
        const params = {
            dataType: dataType,
            bank: bankEnName
        }
        return new Promise((resolve, reject) => {
            axiosIns.get(`/bank/calculate/dataType`, { params: params })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
    /**
     * 
     * @param {string} bankEnName 
     * @param {"short" | "long"} type 
     */
    static getBankSectionGeometry(bankEnName, type) {
        const m = {
            "short": 1,
            "long": 2
        }
        return axiosIns.get(`/down/section/resource/${bankEnName}/info/${m[type]}`)
    }



    /**
     * 
     * @param {FormData} formData 
     */
    static uploadBankCalculateResourceFile(formData) {
        return axiosIns.post(`/up/modelServer/resource/file`, formData)
    }
    /**
     * 
     * @param {FormData} formData 
     */
    static uploadBankSectionResourceFile(formData) {
        return axiosIns.post(`/up/section/resource/file`, formData)
    }



    static updateBankCalculateResourceFile(dataType, bankEnName, fileInput, fileInfo) {

    }
    /**
     * 
     * @param {"Hydrodynamic" | "DEM" | "Boundary" | "Config"} dataType 
     * @param {string} bankEnName 
     * @param {string} bankEnName 
     */
    static deleteBankCalculateResourceFile(dataType, bankEnName, fileName) {
        ///  data/bankResource/delete/calculate/resource/Mzsl/file/DEM/202104
        return axiosIns.delete(`/delete/calculate/resource/${bankEnName}/file/${dataType}/${fileName}`)
    }

    static deleteSectionResourceFile(bankEnName, fileName) {
        return axiosIns.delete(`/delete/section/resource/${bankEnName}/file/${fileName}`)
    }

    static onInput(prefix) {
        const formData = new FormData()
        formData.append('prefix', prefix)
        return axiosIns.post(`/down/bank/name`, formData)
    }

    static handleSelect(bankName) {
        const formData = new FormData()
        formData.append('name', bankName)
        return axiosIns.post(`/down/bank/info`, formData)
    }

    static handleModelParamsUpload(paramData, type, modelParamsInfoData) {
        const requestData = {
            params: paramData,
            type: type,
            info: modelParamsInfoData
        };
        return axiosIns.post(`/up/model/params`, requestData)
    }


    ////////////// VISUAL RESOURCE ////////////////
    /**
     * 
     * @param {"DEM" | "vector"} dataType 
     * @param {string} bankEnName 
     */
    static getBankVisualResourceList(dataType, bankEnName) {
        if (dataType === "DEM") {
            const params = {
                dataType: dataType,
                bank: bankEnName
            }
            return axiosIns.get(`/bank/visual/dataType`, { params: params })
        }
        else if (dataType === "vector") {
            const params = {
                bank: bankEnName
            }
            return axiosIns.get(`/bank/visual/vector`, { params: params })
        }
    }

    static uploadBankVisualResourceFile(formData, bankEnName) {
        // /api/v2/data/bankResource/up/local/resource/{bank}/file
        return axiosIns.post(`/up/local/resource/${bankEnName}/file`, formData)

    }

    static updateBankVisualResourceFile(dataType, bankEnName, fileInput, fileInfo) {

    }

    static deleteBankVisualResourceFile(vectorName, bankEnName) {
        // /api/v2/data/bankResource/delete/local/resource/{bank}/file/{name}
        return axiosIns.delete(`/delete/local/resource/${bankEnName}/file/${vectorName}`)
    }



    ////////////// DEVICE RESOURCE ////////////////
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
    static getBankDeviceResourceList(deviceType, bankEnName) {
        const params = {
            bank: bankEnName,
            typeCode: this.DeviceTypeMap[deviceType]
        }
        return axiosIns.get(`/bank/device/type`, { params })
    }

    /**
     * @param {DeviceInfo} deviceInfo 
     * @returns 
     */
    static uploadBankDevice(deviceInfo, bankEnName) {

        return axiosIns.post(`/up/local/resource/${bankEnName}/device`, deviceInfo)

    }
    /**
     * 
     * @param {string} deviceCode -  设备编码  "code": "MZS120.52557975_32.03825056_1", 
     * @returns 
     */
    static deleteBankDevice(deviceCode) {

        return axiosIns.delete(`/delete/local/resource/device/${deviceCode}`)
    }

    /**
      * @param {DeviceInfo} deviceInfo 
      * @returns 
      */
    static updateBankDevice(deviceInfo, bankEnName, deviceCode) {
        // /update/local/resource/{bank}/device/{code}
        return axiosIns.put(`/update/local/resource/${bankEnName}/device/${deviceCode}`, deviceInfo)
    }




    /**
     * 
     * @param {"Hydrodynamic" | "DEM" | "Boundary" | "Config"} dataType 
     * @param {*} bankEnName 
     * @param {*} fileInput 
     * @param {*} fileInfo 
     */
    static uploadBankResourceFile(dataType, bankEnName, fileInput, fileInfo) {
        // const formData = new FormData()
        // const file = new Blob([fileInput])

        // const fileTypeMap = {
        //     "hydrodynamic": "hydrodynamic",
        //     "DEM": "tiff",
        //     "Boundary": "boundary",
        //     "Config": "config"
        // }

        // formData.append("file", file)
        // formData.append('info', JSON.stringify({
        //     segment: bankEnName,
        //     year: '2020',
        //     set: fileInfo.set,
        //     fileType: 'tiff',
        //     category: 'DEM',
        //     name: '202004',
        //     description: 'test',
        //     boundary: '',
        //     temp: ''
        // }))
    }












    ////////////////////////////////////////////// Resoure refresh
    /**
     * 
     * @param {*} proxy  --- the proxy of ref : resourceInfo 
     * @param {*} bankEnName 
     * @param {*} category 
     * @param {*} type 
     */
    static refreshBankResource(proxy, bankEnName, category, type) {

        console.log('refresh resource!')
        const _proxyCategoryDICI = {
            'model': '模型资源管理',
            'visual': '可视化资源管理',
            'device': '设备资源管理'
        }


        const _listDataDict = {
            'model': {
                'DEM': async () => {
                    // const _ogDEM = (await BankResourceHelper.getBankCalculateResourceList('DEM', bankEnName)).data
                    // let result = this.DEMResourcetoList(_ogDEM)
                    // proxy[_proxyCategoryDICI['model']][0]['resourceList'] = result
                    const _ogDEM = (await BankResourceHelper.getBankCalculateResourceList('DEM', bankEnName)).data
                    const _demList = BankResourceHelper.DEMResourcetoList(_ogDEM)
                    const demList = BankResourceHelper.prepareData(_demList, 'DEM')
                    proxy[_proxyCategoryDICI['model']][0]['resourceList'] = demList

                    notEnoughDataNotice['DEM'](_ogDEM)
                },
                'Config': async () => {
                    // const _ogConfig = (await BankResourceHelper.getBankCalculateResourceList('Config', bankEnName)).data
                    // let result = this.ConfigResourcetoList(_ogConfig)
                    // proxy[_proxyCategoryDICI['model']][1]['resourceList'] = result

                    const _ogConfig = (await BankResourceHelper.getBankCalculateResourceList('Config', bankEnName)).data
                    const _ogBound = (await BankResourceHelper.getBankCalculateResourceList('Boundary', bankEnName)).data
                    const _configList = BankResourceHelper.ConfigResourcetoList(_ogConfig)
                    const _boundList = BankResourceHelper.BoundaryResourcetoList(_ogBound)
                    const _confList = _configList.concat(_boundList)
                    const confList = BankResourceHelper.prepareData(_confList, 'Config')
                    proxy[_proxyCategoryDICI['model']][1]['resourceList'] = confList

                    notEnoughDataNotice['Config'](confList)
                },
                'Section': async () => {
                    // const _ogSection = (await BankResourceHelper.getBankCalculateResourceList('Section', bankEnName)).data
                    // let result = this.SectionResourcetoList(_ogSection)
                    // proxy[_proxyCategoryDICI['model']][2]['resourceList'] = result

                    const _ogSection = (await BankResourceHelper.getBankCalculateResourceList('Section', bankEnName)).data
                    const _sectionList = BankResourceHelper.SectionResourcetoList(_ogSection)
                    const sectionList = BankResourceHelper.prepareData(_sectionList, 'Section')
                    proxy[_proxyCategoryDICI['model']][2]['resourceList'] = sectionList


                    notEnoughDataNotice['Section'](sectionList)
                },
                'Boundary': async () => {
                    // const _ogBound = (await BankResourceHelper.getBankCalculateResourceList('Boundary', bankEnName)).data
                    // let result = this.BoundaryResourcetoList(_ogBound)
                    // proxy[_proxyCategoryDICI['model']][4]['resourceList'] = result

                    console.log(' no this type in table anymore')

                },
                'Hydrodynamic': async () => {
                    // const _ogHydro = (await BankResourceHelper.getBankCalculateResourceList('Hydrodynamic', bankEnName)).data
                    // let result = this.HydrodynamicResourcetoList(_ogHydro)
                    // proxy[_proxyCategoryDICI['model']][3]['resourceList'] = result
                    const _ogHydro = (await BankResourceHelper.getBankCalculateResourceList('Hydrodynamic', bankEnName)).data
                    const _hydroList = BankResourceHelper.HydrodynamicResourcetoList(_ogHydro)
                    const hydroList = BankResourceHelper.prepareData(_hydroList, 'Hydrodynamic')
                    proxy[_proxyCategoryDICI['model']][3]['resourceList'] = hydroList

                    notEnoughDataNotice['Hydrodynamic'](_hydroList)
                },

            },
            'visual': {
                'DEM': async () => {
                    const demTileList = (await BankResourceHelper.getBankVisualResourceList('DEM', bankEnName)).data
                    demTileList.map(item => item.fileType = '地形切片')
                    let result = demTileList
                    proxy[_proxyCategoryDICI['visual']][0]['resourceList'] = result

                },
                'Vector': async () => {
                    const vectorTileList = (await BankResourceHelper.getBankVisualResourceList("vector", bankEnName)).data
                    vectorTileList.map(item => {
                        item.fileType = '矢量切片'
                        item.name = item.tileName
                    })
                    let result = vectorTileList
                    proxy[_proxyCategoryDICI['visual']][1]['resourceList'] = result
                }
            },
            'device': {
                'GNSS': async () => {
                    const _GNSS = (await BankResourceHelper.getBankDeviceResourceList("GNSS", bankEnName)).data
                    let result = _GNSS
                    proxy[_proxyCategoryDICI['device']][0]['resourceList'] = result

                },
                'MENOMETER': async () => {
                    const _Menometer = (await BankResourceHelper.getBankDeviceResourceList("MENOMETER", bankEnName)).data
                    let result = _Menometer
                    proxy[_proxyCategoryDICI['device']][1]['resourceList'] = result

                },
                'STRESS': async () => {
                    const _Stress = (await BankResourceHelper.getBankDeviceResourceList("STRESS", bankEnName)).data
                    let result = _Stress
                    proxy[_proxyCategoryDICI['device']][2]['resourceList'] = result

                },
                'INCLINE': async () => {
                    const _Incline = (await BankResourceHelper.getBankDeviceResourceList("INCLINE", bankEnName)).data
                    let result = _Incline
                    proxy[_proxyCategoryDICI['device']][3]['resourceList'] = result

                },
                'VEDIO': async () => {
                    const _Vedio = (await BankResourceHelper.getBankDeviceResourceList("VEDIO", bankEnName)).data
                    let result = _Incline
                    proxy[_proxyCategoryDICI['device']][4]['resourceList'] = result
                },
            }
        }

        _listDataDict[category][type]()

    }






    ///////////////////////////////////////////// DATA PROCESS

    static prepareData(ogList, type) {
        return preccessing[type](ogList)
    }


    static toList(originalData) {
        const _list = []
        for (let i = 0; i < originalData.length; i++) {
            const year = originalData[i]['year']
            const sets = originalData[i]['sets']
            for (let j = 0; j < sets.length; j++) {
                const set = sets[j]
                for (let k = 0; k < set['list'].length; k++) {
                    const item = set['list'][k]
                    const demResourceNode = {
                        sets: set['name'],
                        year: year,
                        name: item['name'],
                        fileType: item['fileType'],
                        path: item['path'],
                        month: item['month'],
                    }
                    _list.push(demResourceNode)
                }
            }
        }
        /* one element of list
        {
            "sets": "standard",
            "year": "2023",
            "name": "PQ",
            "fileType": "json",
            "path": "json/Mzs/2023/standard/PQ/PQ.json",
            "month": "NoData"
        }
         */
        return _list
    }

    static DEMResourcetoList(originalData) {
        return this.toList(originalData)
    }

    static HydrodynamicResourcetoList(originalData) {
        return this.toList(originalData)
    }

    static BoundaryResourcetoList(originalData) {
        return this.toList(originalData)
    }

    static ConfigResourcetoList(originalData) {
        return this.toList(originalData)
    }

    static SectionResourcetoList(originalData) {
        return this.toList(originalData)
    }

    static HydroResourceToTree(originalData, bankEnName) {
        const result = [
            {
                lable: bankEnName,
                type: 'bank',
                children: [],
            },
        ]
        let years = []
        for (let j = 0; j < originalData.length; j++) {
            let yearItem = {
                lable: originalData[j]['year'],
                type: 'year',
                children: [],
            }
            let sets = []
            for (let k = 0; k < originalData[j]['sets'].length; k++) {
                let setItem = {
                    lable: originalData[j]['sets'][k]['name'],
                    type: 'set',
                    children: [],
                }
                let cases = []
                for (let p = 0; p < originalData[j]['sets'][k]['list'].length; p++) {
                    let casesItem = {
                        lable: originalData[j]['sets'][k]['list'][p]['name'],
                        type: 'case',
                        tag: '已计算',
                        temp: originalData[j]['sets'][k]['list'][p]['temp'],
                        description: originalData[j]['sets'][k]['list'][p]['description'],
                    }
                    cases.push(casesItem)
                }
                setItem.children = cases
                sets.push(setItem)
            }
            yearItem.children = sets
            years.push(yearItem)
        }
        result[0].children = years
        return result
    }

    static notEnoughDataNotice(data, type) {
        notEnoughDataNotice[type](data)
    }

}



const actualName = {
    'PQ': "造床流量系数",
    'template': "权重阈值参数",
    "boundary": "岸段边界文件"
}
/**
 * 灰色的表格行引导处理函数
 */
const preccessing = {
    'DEM': (ogList) => {
        const _demList = ogList
        const demList = _demList.concat(initialTableDatas['模型资源管理']['岸段地形资源'])

        const placeHolderLength = initialTableDatas['模型资源管理']['岸段地形资源'].length
        demList.splice(_demList.length, _demList.length > placeHolderLength ? placeHolderLength : _demList.length)

        return demList
    },
    'Config': (ogList) => {
        const _confList = ogList

        // const confList = initialTableDatas['模型资源管理']['模型参数文件'].concat(_confList)
        const confList = _confList.concat(initialTableDatas['模型资源管理']['模型参数文件'])

        confList.findIndex(item => item.name == 'boundary') > -1 && confList.splice(confList.findIndex(item => item.name == "岸段边界文件"), 1)
        confList.findIndex(item => item.name == 'template') > -1 && confList.splice(confList.findIndex(item => item.name == "权重阈值参数"), 1)
        confList.findIndex(item => item.name == 'PQ') > -1 && confList.splice(confList.findIndex(item => item.name == "造床流量系数"), 1)

        confList.map(item => {
            if (item.name in Object.keys(actualName)) item.name = actualName[item.name]
        })

        return confList
    },
    'Section': (ogList) => {
        const _sectionList = ogList
        const sectionList = initialTableDatas['模型资源管理']['判别断面文件'].concat(_sectionList)
        sectionList.splice(0, _sectionList.length > 1 ? 1 : _sectionList.length)
        return sectionList
    },
    'Hydrodynamic': (ogList) => {
        const _hydroList = ogList
        const hydroList = _hydroList.concat(initialTableDatas['模型资源管理']['水动力预算工况'])


        const placeHolderLength = initialTableDatas['模型资源管理']['水动力预算工况'].length
        hydroList.splice(_hydroList.length, _hydroList.length > placeHolderLength ? placeHolderLength : _hydroList.length)

        return hydroList
    },
}


const notEnoughDataNotice = {
    'DEM': (demList) => {
        if (demList.length < 2) {
            ElMessage.warning({
                offset: 120,
                message: '请至少上传两年的地形文件以支撑综合研判！'
            })
        }
    },
    'Config': (data) => {
        if (data.length < 3) {
            ElMessage.warning({
                offset: 120,
                message: '请配置或上传三类模型参数文件以支撑综合研判！'
            })
        }
    },
    'Section': () => {

    },
    'Hydrodynamic': (data) => {
        if (data.length < 6) {
            ElMessage.warning({
                offset: 120,
                message: '请配置或上传两级流量的大中小潮条件下的预算工况以支撑综合研判！'
            })
        }
    }

}