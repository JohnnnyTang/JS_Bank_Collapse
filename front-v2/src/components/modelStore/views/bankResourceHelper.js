import axios from "axios";

const axiosIns = axios.create({
    baseURL: "/model/data/bankResource",
    headers: {
        "token": localStorage.getItem("token")
    }
})

export default class BankResourceHelper {

    /////////////// bank
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

    static deleteBankBasicInfo(bankEnName) {
        return axiosIns.delete(`/update/local/resource/bank/${bankEnName}`)
    }


    /////////////// bank resource
    /**
     * 
     * @param {"Hydrodynamic" | "DEM" | "Boundary" | "Config"} dataType 
     * @param {*} bankEnName 
     */
    static getBankResourceList(dataType, bankEnName) {
        const params = {
            dataType: dataType,
            bank: bankEnName
        }
        //  todo 区分不同类别
        return axiosIns.get(`/bank/calculate/dataType`, { params: params })
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




    /////////////// data process
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

}