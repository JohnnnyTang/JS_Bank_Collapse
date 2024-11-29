import axios from "axios"
import { ElMessage } from "element-plus"
import BankResourceHelper from '../modelStore/views/bankResourceHelper';
// const Geojson = {
//     "type": "FeatureCollection",
//     "name": "LONG",
//     "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
//     "features": [
//         { "type": "Feature", "properties": { "id": 0, "label": "MZ01围堤" }, "geometry": { "type": "LineString", "coordinates": [[120.499037491387242, 32.043888634852784], [120.495386818476987, 32.016345733684624]] } },
//         { "type": "Feature", "properties": { "id": 1, "label": "MZ02顺堤" }, "geometry": { "type": "LineString", "coordinates": [[120.511016791328572, 32.0421121711504], [120.502507953164653, 32.014472289227854]] } },
//         { "type": "Feature", "properties": { "id": 2, "label": "MZ03顺堤尾" }, "geometry": { "type": "LineString", "coordinates": [[120.51497334565515, 32.04147536696879], [120.507618796148137, 32.011670944640997]] } },
//         { "type": "Feature", "properties": { "id": 3, "label": "MZ04江滩办" }, "geometry": { "type": "LineString", "coordinates": [[120.520952827727356, 32.04067285402283], [120.492929028780495, 32.016853906102398]] } },
//         { "type": "Feature", "properties": { "id": 4, "label": "MZ05小港池" }, "geometry": { "type": "LineString", "coordinates": [[120.522663527622683, 32.039382572607657], [120.498190343725369, 32.015999859750252]] } },
//         { "type": "Feature", "properties": { "id": 5, "label": "MZ06张靖皋桥位" }, "geometry": { "type": "LineString", "coordinates": [[120.528933322533319, 32.034887662867135], [120.508206216047697, 32.009202647369193]] } },
//         { "type": "Feature", "properties": { "id": 6, "label": "MZ07桥位下游" }, "geometry": { "type": "LineString", "coordinates": [[120.534898891689224, 32.032831166759358], [120.526603987180678, 32.006693539375036]] } },
//         { "type": "Feature", "properties": { "id": 7, "label": "MZ08海事码头" }, "geometry": { "type": "LineString", "coordinates": [[120.541607142803116, 32.03073986301149], [120.529324527677801, 31.999868738955477]] } },
//         { "type": "Feature", "properties": { "id": 8, "label": "MZ09码头下游" }, "geometry": { "type": "LineString", "coordinates": [[120.547771840177361, 32.029782508968673], [120.535656683505337, 32.004816277542382]] } },
//         { "type": "Feature", "properties": { "id": 9, "label": "MZ10雷达站" }, "geometry": { "type": "LineString", "coordinates": [[120.551486015216156, 32.02854009653813], [120.539593025125029, 32.002765927493471]] } },
//         { "type": "Feature", "properties": { "id": 10, "label": "MZ11主路" }, "geometry": { "type": "LineString", "coordinates": [[120.559178439991072, 32.025937575963837], [120.551696080313349, 31.998923882343327]] } },
//         { "type": "Feature", "properties": { "id": 11, "label": "MZ12沙尾" }, "geometry": { "type": "LineString", "coordinates": [[120.564634835598596, 32.024005776133073], [120.556805942576688, 31.997794491370112]] } }
//     ]
// }
const BSTEMModelUrl = '/model/taskNode/start/erosionModel/calculateBSTEM'
const RiskLevelModelUrl = '/model/taskNode/start/multipleIndicators/calculateRiskLevel'
const modelStatusUrlPrefix = '/model/taskNode/status/id?taskId='
const modelResultUrlPrefix = '/model/taskNode/result/id?taskId='

const ModelInfoMap = new Map()

function notice(message, type) {
    ElMessage({
        type: type,
        message: message,
        offset: 260
    })
}



// /**
//  * 
//  * @param {{
//  *  "waterQS":number,
//  *  "tidalLevel":number,
//  *  "benchDEM":Object,
//  *  "refDEM":Object,
//  * }} data 
//  */

// const buildRequestBodies = async (data, bankEnName, setName) => {

//     const waterQS = data.waterQS
//     const tidalLevel = data.tidalLevel
//     const comparisonTimepoint = data.refDEM.year + '-' + data.refDEM.month + '-' + '01'
//     const currentTimepoint = data.benchDEM.year + '-' + data.benchDEM.month + '-' + '01'
//     const benchID = data.benchDEM.path
//     const refID = data.refDEM.path

//     const requestBodies = []
//     const sectionGeometry = (await BankResourceHelper.getBankSectionGeometry(bankEnName, "long")).data
//     console.log(sectionGeometry)
//     let sectionNum = Geojson['features'].length
//     for (let i = 0; i < sectionNum; i++) {
//         requestBodies.push({
//             "segment": bankEnName,
//             "set": setName,
//             "current-timepoint": currentTimepoint,
//             "comparison-timepoint": comparisonTimepoint,
//             "hs": 42,
//             "hc": 13.5,
//             "protection-level": "low",
//             "control-level": "low",
//             "section-geometry": Geojson['features'].at(i),
//             "bench-id": benchID,
//             "ref-id": refID,
//             "water-qs": waterQS,
//             "tidal-level": tidalLevel,
//             "wRE": "NONE",
//             "wNM": "NONE",
//             "wGE": "NONE",
//             "wRL": "NONE",
//             "risk-thresholds": "NONE"
//         })
//     }
//     return requestBodies

// }



const buildRequestBodies2 = async (data, bankEnName, setName) => {
    try {
        const waterQS = data.waterQS
        const tidalLevel = data.tidalLevel
        const comparisonTimepoint = data.refDEM.year + '-' + data.refDEM.month + '-' + '01'
        const currentTimepoint = data.benchDEM.year + '-' + data.benchDEM.month + '-' + '01'
        const benchID = data.benchDEM.path
        const refID = data.refDEM.path
        
        const requestBodies = []
        const longSectionFeatures = (await BankResourceHelper.getBankSectionGeometry(bankEnName, "long")).data
        let sectionNum = longSectionFeatures.length
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
                "section-geometry": longSectionFeatures[i],
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
        return {
            requestBodies,
            longSectionFeatures
        }

    } catch (e) {
        if (e.message === 'nosection') {
            throw new Error("冲淤起算地形与判别计算地形不能相同！")
        } else {
            throw new Error("断面数据获取失败")
        }
    }

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

const runRiskLevelForAll = async (data, refs, info) => {



    const startModelPromises = []
    return new Promise(async (resolve, reject) => {

        /////// 0000 build request bodies ///////
        // const requestBodies = await buildRequestBodies(data, info.bankEnName, info.setName)
        try {
            const { requestBodies, longSectionFeatures } = (await buildRequestBodies2(data, info.bankEnName, info.setName))
            console.log('////////requestBodies/////////', requestBodies)

            /////// 001 start Model , get task ID list ///////
            for (let i = 0; i < requestBodies.length; i++) {
                const requestBody = requestBodies[i]
                startModelPromises.push(axios.post(RiskLevelModelUrl, requestBody))
            }
            Promise.all(startModelPromises).then(async (res) => {

                if (res.some(item => item.data === 'WRONG')) {
                    console.warn("TaskID为WRONG")
                    throw new Error('TaskID为WRONG')
                }

                const taskIdList = res.map(item => item.data)
                console.log('/////////taskIdList//////////')
                console.log(taskIdList) // task ID list


                let statusInterval = setInterval(() => {

                    /////// 002 query Status , get task Status ///////
                    const taskStatusPromises = []
                    taskIdList.forEach(taskId => {
                        let url = modelStatusUrlPrefix + taskId
                        taskStatusPromises.push(axios.get(url))
                    })

                    Promise.all(taskStatusPromises).then(async (res) => {

                        const statusList = res.map(item => item.data)
                        console.log('/////////statusList//////////')
                        console.log(statusList)

                        if (statusList.every(item => item === 'COMPLETE')) {
                            clearInterval(statusInterval)

                            /////// 003 query Result , get Model Result ///////
                            const resultPromises = []
                            taskIdList.forEach(taskId => {
                                let resultUrl = modelResultUrlPrefix + taskId
                                resultPromises.push(axios.get(resultUrl))
                            })

                            Promise.all(resultPromises).then(async (res) => {

                                const resultList = res.map(item => item.data)

                                console.log(resultList)

                                /////result no BSTEM////
                                let result = {}
                                // const keys = ['JC01', 'JC02', 'JC03', 'JC04', 'JC05', 'JC06', 'JC07', 'JC08', 'JC09', 'JC10', 'JC11', 'JC12']
                                const keys = longSectionFeatures.map(item => item.label)
                                resultList.forEach((item, index) => {
                                    result[keys[index]] = item
                                })

                                console.log('/////////result no BSTEM//////////')
                                console.log('全部结果高风险，无需运行土体变形分析')
                                console.log(result)
                                resolve(result)


                                /////// 004 check Result , run BSTEM if low risk ///////

                                ////////////// 0041 start BSTEM Model //////////////
                                // const BSTEMPromises = []
                                // const lowLevelIndexes = []
                                // let flag = 1
                                // resultList.forEach(async (item, index) => {
                                //     if (item["result"] < 0.25) {
                                //         flag = 0
                                //         const demID = requestBodies[index]['bench-id']
                                //         const sectionGeometry = requestBodies[index]['section-geometry']
                                //         const flowElevation = requestBodies[index]['tidal-level']
                                //         const reqBody = {
                                //             "dem-id": 'NONE',
                                //             "section-geometry": sectionGeometry,
                                //             "x-values": null,
                                //             "z-values": null,
                                //             "index-toe": null,
                                //             "flow-elevation": flowElevation,
                                //             "bank-layer-thickness": [1.93, -4.07, -11.57, -26.57, -36.57]
                                //         }
                                //         BSTEMPromises.push(axios.post(BSTEMModelUrl, reqBody))
                                //         lowLevelIndexes.push(index)
                                //     }
                                // })
                                // if (flag) {
                                //     console.log('全部结果高风险，无需运行土体变形分析')
                                //     resolve(result)
                                //     return
                                // }

                                // Promise.all(BSTEMPromises).then(async (res) => {
                                //     const BSTEMtaskIDList = res.map(item => item.data)
                                //     // console.log('/////////BSTEMtaskIDList//////////')
                                //     console.log('BSTEMtaskIDList', BSTEMtaskIDList)


                                //     let BSTEMstatusInterval = setInterval(() => {
                                //         const BSTEMStatusPromises = []
                                //         for (let i = 0; i < res.length; i++) {
                                //             let taskId = res[i].data
                                //             BSTEMStatusPromises.push(axios.get(modelStatusUrlPrefix + taskId))
                                //         }

                                //         Promise.all(BSTEMStatusPromises).then(async (res) => {
                                //             const BSTEMstatusList = res.map(item => item.data)
                                //             console.log('BSTEMstatusList', BSTEMstatusList)
                                //             if (BSTEMstatusList.every(item => item === 'COMPLETE')) {
                                //                 // stop loop , get result
                                //                 BSTEMstatusInterval && clearInterval(BSTEMstatusInterval)
                                //                 const BSTEMresultPromises = []
                                //                 BSTEMtaskIDList.forEach(taskId => {
                                //                     let resultUrl = modelResultUrlPrefix + taskId
                                //                     BSTEMresultPromises.push(axios.get(resultUrl))
                                //                 })

                                //                 Promise.all(BSTEMresultPromises).then(async (res) => {
                                //                     // const BSTEMresultList = res.map(item => item.data)
                                //                     for (let i = 0; i < res.length; i++) {
                                //                         let thisResult = res[i].data
                                //                         result[keys[lowLevelIndexes[i]]] = thisResult
                                //                     }

                                //                     console.log('/////////result with BSTEM//////////')
                                //                     console.log(result)
                                //                     resolve(result)
                                //                 })
                                //             }
                                //             else if (BSTEMstatusList.every(item => item === 'ERROR' || item === 'NOT FOUND' || item === 'NONE' || item === 'COMPLETE')) {
                                //                 // stop loop , delete result
                                //                 clearInterval(BSTEMstatusInterval)
                                //                 const BSTEMdeletePromises = []
                                //                 statusList.forEach((item, index) => {
                                //                     if (item === 'ERROR' || item === 'NOT FOUND' || item === 'NONE') {
                                //                         let resultUrl = modelResultUrlPrefix + BSTEMtaskIDList[index]
                                //                         BSTEMdeletePromises.push(axios.get(resultUrl))
                                //                     }
                                //                 })
                                //                 Promise.all(BSTEMdeletePromises).then(async (res) => {
                                //                     console.log('/////////BSTEM清除结果//////////')
                                //                     console.log(res.data)
                                //                     resolve(null)
                                //                 }).catch(_ => {
                                //                     throw new Error('清除结果失败')
                                //                 })
                                //             }

                                //         }).catch(_ => {

                                //         })
                                //     }, 1000)



                                // }).catch(_ => {
                                //     throw new Error('土体变形分析校核计算失败')
                                // })


                            }).catch(_ => {
                                console.warn('获取模型结果失败')
                                throw new Error('获取模型结果失败')
                            })
                        }
                        else if (statusList.every(item => item === 'ERROR' || item === 'NOT FOUND' || item === 'NONE' || item === 'COMPLETE')) {
                            clearInterval(statusInterval)
                            const deletePromises = []
                            statusList.forEach((item, index) => {
                                if (item === 'ERROR' || item === 'NOT FOUND' || item === 'NONE') {
                                    let resultUrl = modelResultUrlPrefix + taskIdList[index]
                                    deletePromises.push(axios.get(resultUrl))
                                }
                            })
                            Promise.all(deletePromises).then(async (res) => {
                                console.log('/////////清除结果//////////')
                                console.log(res.data)
                                resolve(null)
                            }).catch(_ => {
                                console.warn('清除ErrorCase失败')
                                throw new Error('清除ErrorCase失败')
                            })
                        }
                    }).catch(_ => {
                        console.warn('查询运行状态失败')
                        throw new Error('查询运行状态失败')
                    })

                }, 3000)
            }

            ).catch(_ => {
                throw new Error('启动失败')
            })
        } catch (e) {

            reject(e)
        }

    }).catch(err => {
        notice(`模型运行失败：${err.message}`, 'error')
        reject(false)
    })


}

const riskWarnResultParse = (resultDict, shortSectionFeatures) => {
    // 函数实现
    let warnLayerData = getWarnLayerData(resultDict, shortSectionFeatures)
    let finalResult = getFinalRiskLevel(resultDict)
    let riskAreassss = getRiskSections(resultDict, finalResult)
    return {
        warnLayerData,
        riskAreassss,
        finalResult
    }
}




export {
    runRiskLevelForAll,
    riskWarnResultParse
}







///////////////////////// helper
const getWarnLayerData = (result, shortSectionFeatures) => {

    let res = []

    shortSectionFeatures.forEach((item, index) => {

        res.push({
            name: shortSectionFeatures[index].label,
            coords: shortSectionFeatures[index].geometry.coordinates,
            warnValue: result[shortSectionFeatures[index].label]["result"]
        })


    })

    return res

    // return [
    //     {
    //         name: 'JC01',
    //         coords: [
    //             [120.49989610501109, 32.044845778820694],
    //             [120.49965852902085, 32.043054010465546],
    //         ],
    //         warnValue: result['JC01']["result"],
    //     },
    //     {
    //         name: 'JC02',
    //         coords: [
    //             [120.51211644811006, 32.04310480824947],
    //             [120.51157809855385, 32.04135665004222],
    //         ],
    //         warnValue: result['JC02']["result"],
    //     },
    //     {
    //         name: 'JC03',
    //         coords: [
    //             [120.51598399026375, 32.04244111945512],
    //             [120.51554162835052, 32.04064910386879],
    //         ],
    //         warnValue: result['JC03']["result"],
    //     },
    //     {
    //         name: 'JC04',
    //         coords: [
    //             [120.52163733002358, 32.040317481106044],
    //             [120.52010747944439, 32.03901766791365],
    //         ],
    //         warnValue: result['JC04']["result"],
    //     },
    //     {
    //         name: 'JC05',
    //         coords: [
    //             [120.52344753736321, 32.03912224359854],
    //             [120.52202732882418, 32.037765786589944],
    //         ],
    //         warnValue: result['JC05']["result"],
    //     },
    //     {
    //         name: 'JC06',
    //         coords: [
    //             [120.5300568728269, 32.035076196597906],
    //             [120.52886185568613, 32.03359585101801],
    //         ],
    //         warnValue: result['JC06']["result"],
    //     },
    //     {
    //         name: 'JC07',
    //         coords: [
    //             [120.53577029390934, 32.03306474923213],
    //             [120.53521759568126, 32.03132371065091],
    //         ],
    //         warnValue: result['JC07']["result"],
    //     },
    //     {
    //         name: 'JC08',
    //         coords: [
    //             [120.54259039936055, 32.03113531223312],
    //             [120.54191211481913, 32.0294311450221],
    //         ],
    //         warnValue: result['JC08']["result"],
    //     },
    //     {
    //         name: 'JC09',
    //         coords: [
    //             [120.54845619793755, 32.02942703528161],
    //             [120.547645906125, 32.027757714058616],
    //         ],
    //         warnValue: result['JC09']["result"],
    //     },
    //     {
    //         name: 'JC10',
    //         coords: [
    //             [120.55217332294447, 32.02819103999115],
    //             [120.55139957273384, 32.02651468780271],
    //         ],
    //         warnValue: result['JC10']["result"],
    //     },
    //     {
    //         name: 'JC11',
    //         coords: [
    //             [120.55987007042168, 32.0256085153387],
    //             [120.55938372124096, 32.02385317986381],
    //         ],
    //         warnValue: result['JC11']["result"],
    //     },
    //     {
    //         name: 'JC12',
    //         coords: [
    //             [120.56542283954619, 32.023997421425335],
    //             [120.56490201809913, 32.022254233310434],
    //         ],
    //         warnValue: result['JC12']["result"],
    //     },
    // ]
}
const getRiskSections = (result, type) => {



    let _highRiskSections = []
    let _middleRiskSections = []
    let _lowRiskSections = []



    let sections = ["MZ01围堤", "MZ02顺堤", "MZ03顺堤尾", "MZ04江滩办", "MZ05小港池", "MZ06张靖皋桥位", "MZ07桥位下游", "MZ08海事码头", "MZ09码头下游", "MZ10雷达站", "MZ11主路", "MZ12沙尾"]
    let keys = Object.keys(result)
    keys.forEach((key, index) => {
        // let sectionName = sections[index]
        let sectionName = key
        let riskLevelValue = result[key]["result"]
        if (riskLevelValue < 0.25) {
            _lowRiskSections.push(sectionName)
        } else if (riskLevelValue < 0.5) {
            _middleRiskSections.push(sectionName)
        } else {
            _highRiskSections.push(sectionName)
        }
    })

    if (type === '高风险') {
        return _highRiskSections
    } else if (type === '中风险') {
        return _middleRiskSections
    } else {
        return _lowRiskSections
    }
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
    let lowNum = 0
    let middleNum = 0
    let highNum = 0
    let finalRiskLevel = null
    for (let key in result) {
        let item = result[key]
        let resultValue = item["result"]
        if (resultValue < 0.25) {
            lowNum++
        } else if (resultValue < 0.5) {
            middleNum++
        } else {
            highNum++
        }
        if (highNum > 0) {
            finalRiskLevel = '高风险'
            break
        } else if (middleNum > 0) {
            finalRiskLevel = '中风险'
            break
        } else {
            finalRiskLevel = '低风险'
            break
        }
    }
    return finalRiskLevel
}