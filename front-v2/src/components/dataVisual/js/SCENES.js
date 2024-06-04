import { layerAddFunction, layerRemoveFunction, layerShowFunction, layerHideFunction } from "../layerUtil"
import { useMapLayerStore } from "../../../store/mapStore"
import { filterMap } from "./tilefieldMAP"
import axios from "axios"


const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const mapLayerStore = useMapLayerStore()
class LayerGroup {
    constructor(title, layerIDs, map = undefined) {
        this.map = map
        this.title = title
        this.active = false
        this.layerIDs = []
        layerIDs.forEach(element => {
            this.layerIDs.push(element)
        });
    }

    setMap(mapInstance) {
        this.map = mapInstance
    }

    async showLayer() {
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                await layerShowFunction(this.map, this.layerIDs[i])
                // mapLayerStore.layerState[this.layerIDs[i]].showing = true
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }

    async hideLayer() {
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                layerHideFunction(this.map, this.layerIDs[i])
                // mapLayerStore.layerState[this.layerIDs[i]].showing = false
            }
            this.active = false
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }

    async showFilteredLayer() {
        //important features only
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                // console.log(this.layerIDs[i]);
                await layerAddFunction(this.map, this.layerIDs[i])
                // special
                // 长江干堤应该全重要⑧
                if (this.layerIDs[i].includes('长江干堤')) continue;
                if (this.layerIDs[i].includes('里程桩')) continue;
                if (this.layerIDs[i].includes('预警岸段')) continue
                // let filter = filterMap[this.layerIDs[i]]
                let filter = ['==', ['get', 'if_important'], 1]
                this.map.setFilter(this.layerIDs[i], filter)
                mapLayerStore.layerState[this.layerIDs[i]].showing = true
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }

    async showCompleteLayer() {
        //all features
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                await layerAddFunction(this.map, this.layerIDs[i])
                this.map.setFilter(this.layerIDs[i], null)
                mapLayerStore.layerState[this.layerIDs[i]].showing = true
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }

    async layerFilter() {
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                // special
                if (this.layerIDs[i].includes('预警岸段')) continue;
                // 长江干堤应该全重要⑧
                if (this.layerIDs[i].includes('长江干堤')) continue;
                if (this.layerIDs[i].includes('里程桩')) continue;



                // let filter = filterMap[this.layerIDs[i]]
                let filter = ['==', ['get', 'if_important'], 1]
                if (filter && filter.length != 0 && this.map.getLayer(this.layerIDs[i]))
                    this.map.setFilter(this.layerIDs[i], filter)
                mapLayerStore.layerState[this.layerIDs[i]].showing = true
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }
    async layerNoFilter() {
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                if (this.layerIDs[i].includes('预警岸段')) continue;
                if (this.map.getLayer(this.layerIDs[i]))
                    this.map.setFilter(this.layerIDs[i], null)
                mapLayerStore.layerState[this.layerIDs[i]].showing = true
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }


}

class LayerScene {
    constructor(title, LayerGroups, map = undefined) {
        this.map = map
        this.title = title
        this.LayerGroups = []
        LayerGroups.forEach(element => {
            this.LayerGroups.push(element)
        })
        this.active = false
    }

    setMap(mapInstance) {
        this.map = mapInstance
        for (let i = 0; i < this.LayerGroups.length; i++) {
            this.LayerGroups[i].setMap(this.map)
        }
    }

    async showScene() {
        if (this.map) {
            for (let i = 0; i < this.LayerGroups.length; i++) {
                await this.LayerGroups[i].showLayer()
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }

    }

    async hideScene() {
        if (this.map) {
            for (let i = 0; i < this.LayerGroups.length; i++) {
                this.LayerGroups[i].hideLayer()
            }
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }
}

const initLayerGroups = () => {
    const dict = {
        '行政区划': ['市级行政区', '市级行政区-注记', '重点行政区边界'],
        // '河道分段': ['河道分段', '河道分段-注记', '河道分段点', '河道分段点-注记'],
        '骨干河道': ['骨干河道', '骨干河道-注记'],
        '重要湖泊': ['大型湖泊', '大型湖泊-注记'],
        '水文站点': ['水文站点', '水文站点-注记'],
        // '过江通道': ['过江通道-桥墩', '过江通道-桥', '过江通道-隧道/通道', '过江通道-隧道/通道-注记', '过江通道-桥-注记'],
        '过江通道': ['过江通道-桥', '过江通道-隧道/通道', '过江通道-隧道/通道-注记', '过江通道-桥-注记'],
        // '沿江码头': ['沿江码头', '沿江码头-注记'],
        // '水库大坝': ['水库大坝', '水库大坝-注记'],
        '重要水闸': ['水闸工程', '水闸工程-注记', '水闸工程-重点'],
        '重要泵站': ['泵站工程', '泵站工程-注记'],
        // '枢纽工程': ['枢纽工程', '枢纽工程-注记'],
        '长江堤防': ['长江干堤'],
        // '岸段名录': ['一级预警岸段', '二级预警岸段', '三级预警岸段', '岸段-注记'],
        // '历史崩岸': [],
        // '近岸地形': ['近岸地形', '沙洲', '全江注记'],
        // '近年冲淤': [],
        '一级预警岸段': ['一级预警岸段'],
        '二级预警岸段': ['二级预警岸段'],
        '三级预警岸段': ['三级预警岸段'],
    }
    let map = new Map()
    for (let key in dict) {
        let LGins = new LayerGroup(key, dict[key])
        map.set(key, LGins)
    }
    return map
}

let layerGroupInstanceMap = initLayerGroups()

const initLayerScenes = () => {
    const dict = {
        // '全江概貌': ['行政区划', '骨干河道', '大型湖泊', '水文站点'],
        // '工程情况': ['过江通道', '沿江码头', '水库大坝', '水闸工程', '泵站工程', '枢纽工程', '长江干堤'],
        '重点岸段': ['一级预警岸段', '二级预警岸段', '三级预警岸段'],
        '长江沙洲': ['长江沙洲'],
        '骨干河道': ['骨干河道'],
    }
    let map = new Map()
    for (let key in dict) {
        let layerGroups = []
        for (let i = 0; i < dict[key].length; i++) {
            layerGroups.push(layerGroupInstanceMap.get(dict[key][i]))
        }
        let LSins = new LayerScene(key, layerGroups)
        map.set(key, LSins)
    }
    return map
}

const mapToObject = (mapObj) => {
    const obj = {}
    mapObj.forEach((value, key) => {
        obj[key] = value
    })
    return obj
}


const scenes = mapToObject(initLayerScenes())
const layerGroups = mapToObject(initLayerGroups())
const tree = [
    {
        label: '全江概貌',
        active: false,
        children: [
            {
                label: '行政区划',
                icon: '/icons/行政区划.png',
                active: false,
                filter: true
            },
            {
                label: '河道分段',
                icon: '/icons/河道分段.png',
                active: false,
                filter: true
            },
            {
                label: '骨干河道',
                icon: '/icons/流域水系.png',
                active: false,
                filter: true
            },
            {
                label: '大型湖泊',
                icon: '/icons/湖泊河流.png',
                active: false,
                filter: true
            },
            {
                label: '水文站点',
                icon: '/icons/水文站点.png',
                active: false,
                filter: true
            }
        ]
    },
    {
        label: '工程情况',
        active: false,
        filter: true,
        children: [
            {
                label: '长江干堤',
                icon: '/icons/江堤港堤.png',
                active: false,
                filter: true
            },
            {
                label: '其他堤防',
                icon: '/icons/长江堤防.png',
                active: false,
                filter: true
            },
            {
                label: '过江通道',
                icon: '/icons/过江通道.png',
                active: false,
                filter: true
            },
            {
                label: '沿江码头',
                icon: '/icons/沿江码头.png',
                active: false,
                filter: true
            },
            {
                label: '水库大坝',
                icon: '/icons/水库大坝.png',
                active: true,
                filter: true
            },
            {
                label: '水闸工程',
                icon: '/icons/水闸工程.png',
                active: false,
                filter: true
            },
            {
                label: '泵站工程',
                icon: '/icons/泵站工程.png',
                active: false,
                filter: true
            },
            {
                label: '枢纽工程',
                icon: '/icons/枢纽工程.png',
                active: false,
                filter: true
            },
        ]
    },
    {
        label: '重点岸段',
        active: false,
        filter: true,
        children: [
            {
                label: '岸段名录',
                icon: '/icons/岸段名录.png',
                active: false,
                filter: true
            },
        ]
    },
];

const totalLayer = [
    '省级行政区',
    '市级行政区',
    '市级行政区-注记',
    '河道分段',
    '河道分段-注记',
    '骨干河道',
    '骨干河道-注记',
    '大型湖泊',
    '大型湖泊-注记',
    '水文站点',
    '水文站点-注记',
    '其他堤防',
    '其他堤防-注记',
    '过江通道-桥墩',
    '过江通道-桥',
    '过江通道-隧道/通道',
    '过江通道-隧道/通道-注记',
    '过江通道-桥-注记',
    '沿江码头',
    '沿江码头-注记',
    '水库大坝',
    '水库大坝-注记',
    '水闸工程',
    '水闸工程-注记',
    '泵站工程',
    '泵站工程-注记',
    '枢纽工程',
    '枢纽工程-注记',
    '长江干堤',
    '里程桩',
    '一级预警岸段',
    '二级预警岸段',
    '三级预警岸段',
    '岸段-注记',
    '历史崩岸',
    '近岸地形',
    '沙洲',
    '全江注记'
];

const layerTree = [
    {
        label: '全江概貌',
        children: [
            {
                label: '行政区划',
                children: [
                    { label: '省级行政区' },
                    { label: '市级行政区' },
                    { label: '市级行政区-注记' }
                ]
            },
            {
                label: '河道分段',
                children: [
                    { label: '河道分段' },
                    { label: '河道分段-注记' }
                ]
            },
            {
                label: '骨干河道',
                children: [{ label: '骨干河道' }]
            },
            {
                label: '大型湖泊',
                children: [{ label: '大型湖泊' }]
            },
            {
                label: '水文站点',
                children: [{ label: '水文站点' }]
            }
        ]
    },
    {
        label: '工程情况',
        children: [
            {
                label: '长江干堤',
                children: [
                    { label: '长江干堤' },
                    { label: '里程桩' }
                ]
            },
            {
                label: '其他堤防',
                children: [
                    { label: '其他堤防' },
                    { label: '其他堤防-注记' }
                ]
            },
            {
                label: '过江通道',
                children: [
                    { label: '过江通道-桥墩' },
                    { label: '过江通道-桥' },
                    { label: '过江通道-隧道/通道' },
                    { label: '过江通道-隧道/通道-注记' },
                    { label: '过江通道-桥-注记' }
                ]
            },
            {
                label: '沿江码头',
                children: [{ label: '沿江码头' }]
            },
            {
                label: '水库大坝',
                children: [{ label: '水库大坝' }]
            },
            {
                label: '水闸工程',
                children: [{ label: '水闸工程' }]
            },
            {
                label: '泵站工程',
                children: [{ label: '泵站工程' }]
            },
            {
                label: '枢纽工程',
                children: [{ label: '枢纽工程' }]
            },

        ]
    },
    {
        label: '重点岸段',
        children: [
            {
                label: '岸段名录',
                children: [
                    { label: '一级预警岸段' },
                    { label: '二级预警岸段' },
                    { label: '三级预警岸段' },
                    { label: '岸段-注记' }
                ]
            },
            // {
            //     label: '近岸地形',
            //     children: [
            //         { label: '近岸地形' },
            //         { label: '沙洲' },
            //         { label: '全江注记' }
            //     ]
            // },
        ]
    }
];

// const getSideBarTree = async () => {
//     let bankData = (await axios.get(tileServer + `/tile/vector/importantBank/info`)).data
//     let warning1 = {
//         label: '一级预警岸段',
//         active: true,
//         icon: '/icons/warn1.png',
//         type: 'title2',
//         children: []
//     }
//     let warning2 = {
//         label: '二级预警岸段',
//         icon: '/icons/warn2.png',
//         type: 'title2',
//         active: true,
//         children: []
//     }
//     let warning3 = {
//         label: '三级预警岸段',
//         icon: '/icons/warn3.png',
//         type: 'title2',
//         active: true,
//         children: [],
//     }
//     for (let i = 0; i < bankData.length; i++) {
//         let item = bankData[i]
//         if (item['warning_level'] == 1) {
//             warning1.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item })
//         } else if (item['warning_level'] == 2) {
//             warning2.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item })
//         } else if (item['warning_level'] == 3) {
//             warning3.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item })
//         }
//     }
//     let zt = []
//     let features = sandbar.features
//     for (let i = 0; i < features.length; i++) {
//         zt.push(features[i])
//     }
//     let mainZt = {
//         label: '长江沙洲',
//         active: true,
//         // icon: '/icons/洲滩.png',
//         type: 'title1',
//         children: []
//     }
//     zt.forEach((item) => {
//         let firstCoord = item.geometry.coordinates[0][0][0]
//         item.properties.center_x = firstCoord[0]
//         item.properties.center_y = firstCoord[1]
//         mainZt.children.push({ label: item.properties.name, active: false, type: 'feature', property: item.properties })
//     })
//     console.log(mainZt)

//     let zt2 = (await axios.get(tileServer + `/tile/vector/riverBeach/info`)).data
//     let mainZt2 = {
//         label: '长江沙洲',
//         active: true,
//         // icon: '/icons/洲滩.png',
//         type: 'title1',
//         children: []
//     }
//     zt2.forEach((item) => {
//         let firstCoord = item.geometry.coordinates[0][0][0]
//         item.properties.center_x = firstCoord[0]
//         item.properties.center_y = firstCoord[1]
//         mainZt2.children.push({ label: item.properties.name, active: false, type: 'feature', property: item.properties })
//     })
//     console.log(mainZt2);

//     // let quyushuixi = []

//     let quyushuixi = {
//         label: '骨干河道',
//         icon: '/icons/流域水系.png',
//         type: 'title1',
//         active: true,
//         filter: true,
//         children: [
//             {
//                 label: '骨干河道',
//                 icon: '/icons/流域水系.png',
//                 type: 'title2',
//                 active: true,
//                 filter: true,
//                 children: [],
//             }, {
//                 label: '其他',
//                 icon: '/icons/流域水系.png',
//                 type: 'title2',
//                 active: true,
//                 filter: true,
//                 children: [],
//             }
//         ],
//         data: []
//     }
//     let dt = (await axios.get(tileServer + `/tile/vector/riverArea/info`)).data
//     dt.forEach((item) => {
//         quyushuixi.data.push({ label: item['name'], active: false, type: 'feature', property: item })
//     })

//     let sluice = {
//         label: '重要水闸',
//         icon: '/icons/水闸工程.png',
//         type: 'title1',
//         active: true,
//         filter: true,
//         children: [
//             {
//                 label: '大中型水闸',
//                 type: 'title2',
//                 active: true,
//                 filter: true,
//                 children: []
//             }, {
//                 label: '其他水闸',
//                 type: 'title2',
//                 active: true,
//                 filter: true,
//                 children: []
//             }
//         ],
//         data: []
//     }
//     dt = (await axios.get(tileServer + `/tile/vector/sluiceArea/info`)).data
//     dt.forEach((item) => {
//         sluice.data.push(item)
//     })

//     let pump = {
//         label: '重要泵站',
//         icon: '/icons/泵站工程.png',
//         type: 'title1',
//         active: false,
//         filter: true,
//         children: [
//             {
//                 label: '大中型泵站',
//                 type: 'title2',
//                 active: true,
//                 filter: true,
//                 children: []
//             },
//             {
//                 label: '骨干河道',
//                 type: 'title2',
//                 active: true,
//                 filter: true,
//                 children: []
//             }
//         ],
//         data: []
//     }
//     dt = (await axios.get(tileServer + `/tile/vector/pumpArea/info`)).data
//     dt.forEach((item) => {
//         pump.data.push(item)
//     })
//     let treeNode1 = {
//         label: '已建通道',
//         type: 'title2',
//         children: []
//     }
//     let treeNode2 = {
//         label: '在建通道',
//         type: 'title2',
//         children: []
//     }
//     let treeNode3 = {
//         label: '规划通道',
//         type: 'title2',
//         children: []
//     }
//     let res1 = (await axios.get(tileServer + `/tile/vector/riverPassageLine/info`)).data
//     let res2 = (await axios.get(tileServer + `/tile/vector/riverPassagePolygon/info`)).data
//     let res = [...res1, ...res2]
//     res.forEach(item => {
//         if (item.plan === 1) {
//             item.planning = '已建通道'
//             treeNode1.data.push(item)
//         } else if (item.plan === 0) {
//             item.planning = '在建通道'
//             treeNode2.data.push(
//                 item
//             )
//         } else if (item.plan === -1) {
//             item.planning = '规划通道'
//             treeNode3.data.push(
//                 item
//             )
//         }
//     })
//     console.log(treeNode1);
//     let riverPassageLine = {
//         label: '过江通道',
//         type: 'title1',
//         active: false,
//         filter: true,
//         children: [
//             treeNode1,
//             treeNode2,
//             treeNode3
//         ],
//         data: res
//     }

//     let tree = [
//         {
//             label: '重点岸段',
//             active: true,
//             type: 'title1',
//             children: [
//                 warning1,
//                 warning2,
//                 warning3
//             ]
//         },
//         mainZt,
//         quyushuixi,
//         sluice,
//         pump,
//         riverPassageLine,
//         {
//             label: '长江堤防',
//             icon: '/icons/江堤港堤.png',
//             type: 'title1',
//             active: true,
//             filter: true
//         },
//         {
//             label: '其他',
//             active: false,
//             type: 'title1',
//             children: [
//                 {
//                     label: '行政区划',
//                     icon: '/icons/行政区划.png',
//                     type: 'title2',
//                     active: true,
//                     filter: true
//                 },

//                 {
//                     label: '重要湖泊',
//                     icon: '/icons/湖泊河流.png',
//                     type: 'title2',
//                     active: true,
//                     filter: true
//                 },
//                 {
//                     label: '水文站点',
//                     icon: '/icons/水文站点.png',
//                     type: 'title2',
//                     active: false,
//                     filter: true
//                 }
//             ]
//         }
//     ]

//     return tree
// }

const lableLayerMap = {
    '一级预警岸段': ['一级预警岸段', '岸段-注记'],
    '二级预警岸段': ['二级预警岸段', '岸段-注记'],
    '三级预警岸段': ['三级预警岸段', '岸段-注记'],
    '长江沙洲': ['洲滩', '洲滩-注记'],
    '骨干河道': ['骨干河道', '骨干河道-注记'],
    '重要水闸': ['水闸工程-重点', '水闸工程-注记', '水闸工程'],
    '重要泵站': ['泵站工程-注记', '泵站工程'],
    '长江堤防': ['长江干堤'],
    '过江通道': ['过江通道-隧道/通道', '过江通道-桥', '过江通道-隧道/通道-注记', '过江通道-桥-注记'],
    '行政区划': ['行政点', '行政点-注记', '重点行政区边界'],
    '重要湖泊': ['大型湖泊', '大型湖泊-注记'],
    '水文站点': ['水文站点', '水文站点-注记'],
}

export {
    LayerGroup,
    scenes,
    layerGroups,
    initLayerScenes,
    initLayerGroups,
    tree,
    layerTree,
    // getSideBarTree,
    totalLayer,
    lableLayerMap,
}