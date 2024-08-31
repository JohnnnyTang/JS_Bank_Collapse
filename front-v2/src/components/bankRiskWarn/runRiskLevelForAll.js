import axios from "axios"
import { ElMessage } from "element-plus"
const Geojson = {
    "type": "FeatureCollection",
    "name": "LONG",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "id": 0, "label": "MZ01围堤" }, "geometry": { "type": "LineString", "coordinates": [[120.499037491387242, 32.043888634852784], [120.495386818476987, 32.016345733684624]] } },
        { "type": "Feature", "properties": { "id": 1, "label": "MZ02顺堤" }, "geometry": { "type": "LineString", "coordinates": [[120.511016791328572, 32.0421121711504], [120.502507953164653, 32.014472289227854]] } },
        { "type": "Feature", "properties": { "id": 2, "label": "MZ03顺堤尾" }, "geometry": { "type": "LineString", "coordinates": [[120.51497334565515, 32.04147536696879], [120.507618796148137, 32.011670944640997]] } },
        { "type": "Feature", "properties": { "id": 3, "label": "MZ04江滩办" }, "geometry": { "type": "LineString", "coordinates": [[120.520952827727356, 32.04067285402283], [120.492929028780495, 32.016853906102398]] } },
        { "type": "Feature", "properties": { "id": 4, "label": "MZ05小港池" }, "geometry": { "type": "LineString", "coordinates": [[120.522663527622683, 32.039382572607657], [120.498190343725369, 32.015999859750252]] } },
        { "type": "Feature", "properties": { "id": 5, "label": "MZ06张靖皋桥位" }, "geometry": { "type": "LineString", "coordinates": [[120.528933322533319, 32.034887662867135], [120.508206216047697, 32.009202647369193]] } },
        { "type": "Feature", "properties": { "id": 6, "label": "MZ07桥位下游" }, "geometry": { "type": "LineString", "coordinates": [[120.534898891689224, 32.032831166759358], [120.526603987180678, 32.006693539375036]] } },
        { "type": "Feature", "properties": { "id": 7, "label": "MZ08海事码头" }, "geometry": { "type": "LineString", "coordinates": [[120.541607142803116, 32.03073986301149], [120.529324527677801, 31.999868738955477]] } },
        { "type": "Feature", "properties": { "id": 8, "label": "MZ09码头下游" }, "geometry": { "type": "LineString", "coordinates": [[120.547771840177361, 32.029782508968673], [120.535656683505337, 32.004816277542382]] } },
        { "type": "Feature", "properties": { "id": 9, "label": "MZ10雷达站" }, "geometry": { "type": "LineString", "coordinates": [[120.551486015216156, 32.02854009653813], [120.539593025125029, 32.002765927493471]] } },
        { "type": "Feature", "properties": { "id": 10, "label": "MZ11主路" }, "geometry": { "type": "LineString", "coordinates": [[120.559178439991072, 32.025937575963837], [120.551696080313349, 31.998923882343327]] } },
        { "type": "Feature", "properties": { "id": 11, "label": "MZ12沙尾" }, "geometry": { "type": "LineString", "coordinates": [[120.564634835598596, 32.024005776133073], [120.556805942576688, 31.997794491370112]] } }
    ]
}
const RiskLevelModelUrl = '/model/taskNode/start/multipleIndicators/calculateRiskLevel'
const RiskLevelStatusUrlPrefix = '/model/taskNode/status/id?taskId='
const RiskLevelResultUrlPrefix = '/model/taskNode/result/id?taskId='

const ModelInfoMap = new Map()

function notice(message, type) {
    ElMessage({
        type: type,
        message: message,
        offset: 120
    })
}



/**
 * 
 * @param {{
 *  "waterQS":number,
 *  "tidalLevel":number,
 *  "benchDEM":Object,
 *  "refDEM":Object,
 * }} data 
 */

const buildRequestBodies = (data, bankEnName, setName) => {

    const waterQS = data.waterQS
    const tidalLevel = data.tidalLevel
    const comparisonTimepoint = data.refDEM.year + '-' + data.refDEM.month + '-' + '01'
    const currentTimepoint = data.benchDEM.year + '-' + data.benchDEM.month + '-' + '01'
    const benchID = data.benchDEM.path
    const refID = data.refDEM.path

    const requestBodies = []
    let sectionNum = Geojson['features'].length
    for (let i = 0; i < sectionNum; i++) {
        requestBodies.push({
            "segment": bankEnName,
            "set": setName,
            "current-timepoint": currentTimepoint,
            "comparison-timepoint": comparisonTimepoint,
            "hs": 42,
            "hc": 13.5,
            "protection-level": "low",
            "control-level": "low",
            "section-geometry": Geojson['features'].at(i),
            "bench-id": benchID,
            "ref-id": refID,
            "water-qs": waterQS,
            "tidal-level": tidalLevel,
            "wRE": "NONE",
            "wNM": "NONE",
            "wGE": "NONE",
            "wRL": "NONE",
            "risk-thresholds": "NONE"
        })
    }
    return requestBodies

}






/**
 * 
 * @param {{
 *  "waterQS":number,
 *  "tidalLevel":number,
 *  "benchDEM":Object,
 *  "refDEM":Object,
 * }} data 
 * @param {Object} refs
 * @param {{
 *  "bankEnName":string,
 *  "setName":string
 * }}
 */

const runRiskLevelForAll = (data, refs, info) => {

    const requestBodies = buildRequestBodies(data, info.bankEnName, info.setName)
    console.log('////////requestBodies/////////', requestBodies)

    const startModelPromises = []
    return new Promise((resolve, reject) => {

        /////// start Model , get task ID list ///////
        for (let i = 0; i < requestBodies.length; i++) {
            const requestBody = requestBodies[i]
            startModelPromises.push(axios.post(RiskLevelModelUrl, requestBody))
        }
        Promise.all(startModelPromises).then(async (res) => {

            if (res.some(item => item.data === 'WRONG')) {
                // reject('获取模型状态失败')
                // notice('模型运行失败', 'error')
                // console.warn('taskId获取失败::', err)
                throw new Error('TaskID is WRONG')
            }

            const taskIdList = res.map(item => item.data)
            console.log('/////////taskIdList//////////')
            console.log(taskIdList) // task ID list


            let statusInterval = setInterval(() => {

                /////// query Status , get task Status ///////
                const taskStatusPromises = []
                taskIdList.forEach(taskId => {
                    let url = RiskLevelStatusUrlPrefix + taskId
                    taskStatusPromises.push(axios.get(url))
                })

                Promise.all(taskStatusPromises).then(async (res) => {

                    const statusList = res.map(item => item.data)
                    console.log('/////////statusList//////////')
                    console.log(statusList)

                    if (statusList.every(item => item === 'COMPLETE')) {
                        clearInterval(statusInterval)
                        notice('模型运行成功', 'success')
                        console.log('模型运行成功!')

                        /////// query Result , get Model Result ///////
                        const resultPromises = []
                        taskIdList.forEach(taskId => {
                            let resultUrl = RiskLevelResultUrlPrefix + taskId
                            resultPromises.push(axios.get(resultUrl))
                        })

                        Promise.all(resultPromises).then(async (res) => {
                            notice('获取模型结果成功', 'success')
                            const resultList = res.map(item => item.data)

                            let keys = ['JC01', 'JC02', 'JC03', 'JC04', 'JC05', 'JC06', 'JC07', 'JC08', 'JC09', 'JC10', 'JC11', 'JC12']
                            let result = {}
                            resultList.forEach((item, index) => {
                                // result[Geojson.features[index].properties.label] = item
                                result[keys[index]] = item
                            })

                            console.log('/////////result//////////')
                            console.log(result)
                            resolve(result)
                        }).catch(err => {
                            // reject('获取模型结果失败')
                            // notice('模型运行失败', 'error')
                            // console.warn('获取模型结果失败::', err)
                            // throw '获取模型结果失败'
                            throw new Error('获取模型结果失败')
                        })
                    } else if (statusList.some(item => item === 'NOT FOUND' || item === 'ERROR')) {
                        clearInterval(statusInterval)
                        // throw new Error('模型状态异常')


                        const resultPromises = []
                        statusList.forEach((item, index) => {
                            if (item === 'ERROR') {
                                let resultUrl = RiskLevelResultUrlPrefix + taskIdList[index]
                                resultPromises.push(axios.get(resultUrl))
                            }
                        })

                        Promise.all(resultPromises).then(async (res) => {

                            console.log('/////////清楚结果//////////')
                            console.log(res)
                            // resolve(result)
                        }).catch(err => {
                            // reject('获取模型结果失败')
                            // notice('模型运行失败', 'error')
                            // console.warn('获取模型结果失败::', err)
                            // throw '获取模型结果失败'
                            // throw new Error('获取模型结果失败')
                        })


                    }
                    else if (statusList.some(item => item === 'ERROR')) {

                        // reject('模型运行失败')
                        clearInterval(statusInterval)
                        // notice('模型运行失败', 'error')
                        // console.warn('模型运行失败::', item)
                        // throw new Error('模型状态异常')

                        const resultPromises = []
                        taskIdList.forEach(taskId => {
                            let resultUrl = RiskLevelResultUrlPrefix + taskId
                            resultPromises.push(axios.get(resultUrl))
                        })

                        Promise.all(resultPromises).then(async (res) => {
                            // notice('清楚结果', 'success')

                            console.log('/////////清楚结果//////////')
                            console.log(res)
                            // resolve(result)
                        }).catch(err => {
                            // reject('获取模型结果失败')
                            // notice('模型运行失败', 'error')
                            // console.warn('获取模型结果失败::', err)
                            // throw '获取模型结果失败'
                            // throw new Error('获取模型结果失败')
                        })


                    }

                }).catch(err => {
                    // reject('获取模型状态失败')
                    // notice('模型运行失败', 'error')
                    console.warn(err.message)
                    // throw new Error('模型启动失败')
                })

            }, 3000)
        }

        ).catch(err => {
            console.warn(err.message)

            // reject('模型运行失败')
            notice('模型运行失败', err.message)
        })
    })


}

/*
{
    "JC01": {
        "result": "0.4736",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "9080752b82e2fdc646b088d1f857a292",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "270d7fadf91cda0f778a44e0cdf7625d",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "7177cf62fd618e8c47829ccb700e1440",
            "Zb": "9e22ceb416fc1380cc0b2e7f6ebb77dc",
            "Zd": "0867d76ba59acf5df1f2cbdc21850cab"
        },
        "case-id": "aac3406d0b6667cde85ab5d1641e2106",
        "model": "Risk Level"
    },
    "JC02": {
        "result": "0.6799999999999999",
        "risk-level": [
            0,
            0,
            1,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "81d19f1791826408f2bcee4998b9b90f",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "1c6917a9398d0b0b5b859d745060149c",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "d370043e8eb1e5836dd2fc0014a0381f",
            "Zb": "96d04d586a6b6f0b504f815ad5cbe1ff",
            "Zd": "32adca4dc982f005610b85a08f364cfd"
        },
        "case-id": "715b67da9ff0b853bda215fccf0d93bd",
        "model": "Risk Level"
    },
    "JC03": {
        "result": "0.4736",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "f7a72e5bd77638ffdd64a3252bb6645a",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "37cee24478ba50c21e4ebd59d6d8b039",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "3fd6ae4f6c03e667190762beb416c4a0",
            "Zb": "13245f46d85f2bd04a60468de52cb802",
            "Zd": "bc9216ec9ec76acb653894e335f3247d"
        },
        "case-id": "6d8b06e999d9c2653d92bad3e97982d7",
        "model": "Risk Level"
    },
    "JC04": {
        "result": "0.4736",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "d061ea0ca125596d2b9539b5db8d8ac1",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "68942c5115e4cc0e330d0625e6b13f39",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "b65052ec9ab25f1f749fa9e7ba9d5dd1",
            "Zb": "0b5aeb29ec6ddc370a7e2d585a318dcc",
            "Zd": "4d87fd609b6ebe7de83e392f2b090877"
        },
        "case-id": "a68473d1f675b29a09dbcbc416603031",
        "model": "Risk Level"
    },
    "JC05": {
        "result": "0.4736",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "903113055f070932f624b99e3ab25269",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "0540c2a08e6f007c5f381659ac4d9044",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "cecd983655c5a7d839056b4c2c8144c2",
            "Zb": "58d166c9cbed9174781d1a862d721a1e",
            "Zd": "0c297ce8ead27ac417402e7d087e6e9b"
        },
        "case-id": "00b3c4ccc67065eb40b79b7bc25b4184",
        "model": "Risk Level"
    },
    "JC06": {
        "result": "0.6799999999999999",
        "risk-level": [
            0,
            0,
            1,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "1fb8cb141c09392aaf01e102cbe6141d",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "57358de9d392bfe21049b2986f69bcbf",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "4184d45916a86cf3fa27b004c7f6b30a",
            "Zb": "6050f06fc2e16b9c92357f7a310b9951",
            "Zd": "70499b2dfe5779c857d7f36d872f7533"
        },
        "case-id": "43b9578846b6874f42dda9f829989e26",
        "model": "Risk Level"
    },
    "JC07": {
        "result": "0.4736",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "fb17e0d16eeefe01e8f809e42e31634f",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "d5c335f52cc35ca4ed2a6f9305f9f491",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "81023baf7e646724de584579d936a74a",
            "Zb": "8088796aa5b133ae8956533cf574e165",
            "Zd": "9e273aa871796a34701b61e02cdb8c34"
        },
        "case-id": "3b392fe9ab07ee634a9308a60ae5f478",
        "model": "Risk Level"
    },
    "JC08": {
        "result": "0.3188",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "e9399da3621a0fef0be5688f5528f44b",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "450e820d8253d94b032b6b575ccc2f79",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "fc8b2e1469453a0177698044606ab269",
            "Zb": "8c546c3e19b85624db86605231eced66",
            "Zd": "85afcb1affd1513da7b06ae197cebd42"
        },
        "case-id": "21e2dc35f72c512a73fde224c3a05fff",
        "model": "Risk Level"
    },
    "JC09": {
        "result": "0.3188",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "0d99b4d360536640b6a628c9806133ad",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "081a45cb04b8ff686c6a3a56210951db",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "3dd7db1595cc6dbc36640b5a28ef6218",
            "Zb": "dd9d9126ae33073494218e9b957127d3",
            "Zd": "68f562239f0f426fc830e0d9ed41239a"
        },
        "case-id": "f279a2737acb79bab70f41ec9913eb55",
        "model": "Risk Level"
    },
    "JC10": {
        "result": "0.3188",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "40490ef22b595b323ec8f2051835f982",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "d0c99589a2d5ac628b10b8f99f4ba97e",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "2045edd7109f3d314be14effa148acd6",
            "Zb": "474ae75d405c2d54b88a638cee830f55",
            "Zd": "6ebe89a03ceed607082364ec0f0b124e"
        },
        "case-id": "03f43b28d41d3c7be7289b3f68f72273",
        "model": "Risk Level"
    },
    "JC11": {
        "result": "0.25",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "57a2f1599967505198c18eff795afb55",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "1a9a3aeb5b2a6a766495b4692c965a5c",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "066c274141125721739f7e267274b5ea",
            "Zb": "4b1aadc0dd4c951337795de729f41489",
            "Zd": "7c72923e09db9ef293281a0639e8087b"
        },
        "case-id": "7a56e80de71e80a0568383f9d9acfe89",
        "model": "Risk Level"
    },
    "JC12": {
        "result": "0.25",
        "risk-level": [
            0,
            1,
            0,
            0
        ],
        "multi-indicator-ids": {
            "Dsed": "93d61767dd0eb7607d2f4f09f619b062",
            "Ky": "8bc6db35a1f698468e7afa464bba063e",
            "LC": "02d63773b0cfbd11284a52cc5b0d45ab",
            "Ln": "c084f06ac1adb65e99fac16b5da24ed0",
            "PL": "d3715a2bd5d4337f1665533a9d00851e",
            "PQ": "60faa002df2d512c8ad951c33ae63f29",
            "Sa": "6160bd6e725ada1318d7810735bdce43",
            "Zb": "b4d35bc0f3334987496e200c5621bbb3",
            "Zd": "a45c29adfce0913f2c40e839a94b3832"
        },
        "case-id": "c9e1687a886e44e73c58e3f4f7bfe730",
        "model": "Risk Level"
    }
}


*/

/* element of resultList
{
    "case-id": "{ case-id }",
        "model": "{ model-name }",
    "multi-indicator-ids": {
      "Dsed": "{ case-id }",
      "PL": "{ case-id }",
      "LC": "{ case-id }",
      "Zb": "{ case-id }",
      "Sa": "{ case-id }",
      "Ln": "{ case-id }",
      "PQ": "{ case-id }",
      "Ky": "{ case-id }",
      "Zd": "{ case-id }"
    },
    "result": "{ number }",
    "risk-level": "{ vec4 }" || "NONE"
}
*/
const riskWarnResultParse = (resultDict) => {
    // 函数实现
    let warnLayerData = getWarnLayerData(resultDict)
    let highRiskSections = getHighRiskSections(resultDict)
    let finalResult = getFinalRiskLevel(resultDict)
    return {
        warnLayerData,
        highRiskSections,
        finalResult
    }
}




export {
    runRiskLevelForAll,
    riskWarnResultParse
}







///////////////////////// helper
const getWarnLayerData = (result) => {
    return [
        {
            name: 'JC01',
            coords: [
                [120.49989610501109, 32.044845778820694],
                [120.49965852902085, 32.043054010465546],
            ],
            warnValue: result['JC01']["result"],
        },
        {
            name: 'JC02',
            coords: [
                [120.51211644811006, 32.04310480824947],
                [120.51157809855385, 32.04135665004222],
            ],
            warnValue: result['JC02']["result"],
        },
        {
            name: 'JC03',
            coords: [
                [120.51598399026375, 32.04244111945512],
                [120.51554162835052, 32.04064910386879],
            ],
            warnValue: result['JC03']["result"],
        },
        {
            name: 'JC04',
            coords: [
                [120.52163733002358, 32.040317481106044],
                [120.52010747944439, 32.03901766791365],
            ],
            warnValue: result['JC04']["result"],
        },
        {
            name: 'JC05',
            coords: [
                [120.52344753736321, 32.03912224359854],
                [120.52202732882418, 32.037765786589944],
            ],
            warnValue: result['JC05']["result"],
        },
        {
            name: 'JC06',
            coords: [
                [120.5300568728269, 32.035076196597906],
                [120.52886185568613, 32.03359585101801],
            ],
            warnValue: result['JC06']["result"],
        },
        {
            name: 'JC07',
            coords: [
                [120.53577029390934, 32.03306474923213],
                [120.53521759568126, 32.03132371065091],
            ],
            warnValue: result['JC07']["result"],
        },
        {
            name: 'JC08',
            coords: [
                [120.54259039936055, 32.03113531223312],
                [120.54191211481913, 32.0294311450221],
            ],
            warnValue: result['JC08']["result"],
        },
        {
            name: 'JC09',
            coords: [
                [120.54845619793755, 32.02942703528161],
                [120.547645906125, 32.027757714058616],
            ],
            warnValue: result['JC09']["result"],
        },
        {
            name: 'JC10',
            coords: [
                [120.55217332294447, 32.02819103999115],
                [120.55139957273384, 32.02651468780271],
            ],
            warnValue: result['JC10']["result"],
        },
        {
            name: 'JC11',
            coords: [
                [120.55987007042168, 32.0256085153387],
                [120.55938372124096, 32.02385317986381],
            ],
            warnValue: result['JC11']["result"],
        },
        {
            name: 'JC12',
            coords: [
                [120.56542283954619, 32.023997421425335],
                [120.56490201809913, 32.022254233310434],
            ],
            warnValue: result['JC12']["result"],
        },
    ]
}
const getHighRiskSections = (result) => {
    let _highRiskSections = []

    let sections = ["MZ01围堤", "MZ02顺堤", "MZ03顺堤尾", "MZ04江滩办", "MZ05小港池", "MZ06张靖皋桥位", "MZ07桥位下游", "MZ08海事码头", "MZ09码头下游", "MZ10雷达站", "MZ11主路", "MZ12沙尾"]
    let keys = Object.keys(result)
    keys.forEach((key, index) => {
        let sectionName = sections[index]
        let riskLevel = riskVec4Parse(result[key]["risk-level"])
        if (riskLevel === "高风险") {
            _highRiskSections.push(sectionName)
        }
    })
    return _highRiskSections
}
const riskVec4Parse = (vec4) => {
    let riskLevelIndex
    for (let i = 0; i < vec4.length; i++)
        if (vec4[i] === 1) {
            riskLevelIndex = i
            break
        }
    const dict = ['低风险', '较低风险', '较高风险', '高风险']
    return dict[riskLevelIndex]
}
const getFinalRiskLevel = (result) => {



    return "中风险"
}