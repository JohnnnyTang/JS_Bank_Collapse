import {
    i_gov_bounds,
    river_division_point,
    river_division_line,
    sandbar,
    district_point,
    channel_line
} from './tempData'
import axios from 'axios'


////////////////  GLOBAL CONST
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER

////////////////  DICT
const Title1dict = {
    '重点岸段': ['一级预警岸段', '二级预警岸段', '三级预警岸段', '一级岸段-注记', '二级岸段-注记', '三级岸段-注记', '一级预警岸段-注记'],
    '长江沙洲': ['洲滩', '洲滩-注记'],
    '过江通道': ['已建通道', '在建通道', '规划通道', '已建通道-注记', '在建通道-注记', '规划通道-注记'],
    '骨干河道': ['区域性骨干河道', '流域性河道', '其他河道', '区域性骨干河道-注记', '流域性河道-注记', '其他河道-注记'],
    '重要水闸': ['大中型水闸', '其他水闸', '大中型水闸-注记', '其他水闸-注记', '水闸工程-重点'],
    '重要泵站': ['大中型泵站', '其他泵站', '大中型泵站-注记', '其他泵站-注记'],
    '长江堤防': ['长江干堤', '里程桩'],
    '其他': ['市级行政区', '市级行政区-注记', '重点行政区边界', '水文站点', '水文站点-注记', '水库大坝', '水库大坝-注记', '大型湖泊', '大型湖泊-注记']
}
const Title2dict = {
    '一级预警岸段': ['一级预警岸段', '一级岸段-注记'],
    '二级预警岸段': ['二级预警岸段', '二级岸段-注记'],
    '三级预警岸段': ['三级预警岸段', '三级岸段-注记'],
    '已建通道': ['已建通道', '已建通道-注记'],
    '在建通道': ['在建通道', '在建通道-注记'],
    '规划通道': ['规划通道', '规划通道-注记'],
    '区域性骨干河道': ['区域性骨干河道', '区域性骨干河道-注记'],
    '流域性骨干河道': ['流域性河道', '流域性河道-注记'],
    '大中型水闸': ['大中型水闸', '大中型水闸-注记', '水闸工程-重点'],
    '其他水闸': ['其他水闸', '其他水闸-注记'],
    '大中型泵站': ['大中型泵站', '大中型泵站-注记'],
    '其他泵站': ['其他泵站', '其他泵站-注记'],
    '湖泊水库': ['水库大坝', '水库大坝-注记', '大型湖泊', '大型湖泊-注记'],
    '行政区划': ['市级行政区', '市级行政区-注记', '重点行政区边界'],
    '水文站点': ['水文站点', '水文站点-注记'],
}

const LGIDSourceMap = {
    // '重点岸段':'',
    // '长江沙洲':'',
    '过江通道': 'channel',
    '骨干河道': 'riverArea',
    '重要水闸': 'sluiceArea',
    '重要泵站': 'pumpArea',
    // '长江堤防':'',
    // '其他':''
}

const sourceColumnMap = {
    "riverArea": 2,
    "pumpArea": 2,
    "sluiceArea": 2,
    "importantBank": 4,
    'sandBar': 2,
    'channel': 1,
}
const sourceZoomMap = {

    "riverArea": 13,
    "pumpArea": 15.5,
    "sluiceArea": 15,
    'channel': 13,
}






const DICT = {
    T1LayerDict: Title1dict,
    T2LayerDict: Title2dict,
    // T2LayerFunction: t,
    sourceColumnMap,
    LGIDSourceMap,
}


///////////////  FUNCTION
const hideLayers = (map, layersArr) => {
    if (map) {
        for (let i = 0; i < layersArr.length; i++) {
            let layerID = layersArr[i]
            if (map.getLayer(layerID)) {
                // 隐藏
                map.setLayoutProperty(layerID, 'visibility', 'none')
            }
        }
    } else {
        console.log('WARNING:: NOT VALID MAP');
    }
}
const showLayers = (map, layersArr) => {
    if (map) {
        for (let i = 0; i < layersArr.length; i++) {
            let layerID = layersArr[i]
            if (map.getLayer(layerID)) {
                map.setLayoutProperty(layerID, 'visibility', 'visible')
            }
        }
    } else {
        console.log('WARNING:: NOT VALID MAP');
    }
}

var bank1Sort = [
    "七坝",
    "下关",
    "和畅洲头及左右缘",
    "孟家港",
    "太平洲左缘（二墩港至胜利河）",
    "六圩弯道",
    '嘶马弯道',
    "杨湾至高港闸",
    "民主沙",
    "段山港至越洋码头",
    "新太海汽渡～七丫口"
];

const bank2Sort = [
    "铜井",
    "江宁河",
    "大胜关",
    "梅子洲头",
    "浦口",
    "八卦洲洲头及左右缘",
    "天河口",
    "燕子矶",
    "94679部队",
    "八卦洲左汊凹岸",
    "西坝",
    "栖龙岸段",
    "龙门口",
    "世业洲尾段",
    "沙头河口以下",
    "丰乐桥",
    "炮子洲左缘",
    "夹江兴隆弯道",
    "泗源沟~扬子船厂",
    "世业洲头及左右缘",
    "大寨河",
    "六助港至长江农场",
    "录安洲头及左右缘",
    "福姜沙右汊凹岸",
    "双山沙左侧",
    "铁黄沙整治工程下段",
    "徐六泾",
    "又来沙",
    "长青沙西南缘",
    "通吕运河至龙爪岩",
    "东方红农场",
    "青龙港至大新港",
    "北支右岸庙港～新村沙头部"
];

var bank3Sort = [
    "新济州左缘",
    "新济州右缘",
    "夹江大路弯道",
    "夹江姚桥弯道",
    "夹江长旺弯道",
    "夹江九曲弯道",
    "夹江六圩港弯道",
    "四圩头",
    "永安洲",
    "西界河",
    "下三圩下四圩",
    "炮台圩",
    "桃花港"
]


const getSideBarTree = async () => {
    let bankData = (await axios.get(tileServer + `/tile/vector/importantBank/info`)).data
    let warning1 = {
        label: '一级预警岸段',
        active: true,
        icon: '/icons/warn1.png',
        type: 'title2',
        children: []
    }
    let warning2 = {
        label: '二级预警岸段',
        icon: '/icons/warn2.png',
        type: 'title2',
        active: true,
        children: []
    }
    let warning3 = {
        label: '三级预警岸段',
        icon: '/icons/warn3.png',
        type: 'title2',
        active: true,
        children: []
    }
    let w1 = []
    let w2 = []
    let w3 = []

    for (let i = 0; i < bankData.length; i++) {
        let item = bankData[i]
        if (item['warning_level'] == 1) {
            // warning1.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item, 'lgId': '一级预警岸段' })
            w1.push({ label: item['bank_name'], active: false, type: 'feature', property: item, 'lgId': '一级预警岸段' })
        } else if (item['warning_level'] == 2) {
            // warning2.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item, 'lgId': '二级预警岸段' })
            w2.push({ label: item['bank_name'], active: false, type: 'feature', property: item, 'lgId': '一级预警岸段' })
        } else if (item['warning_level'] == 3) {
            // warning3.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item, 'lgId': '三级预警岸段' })
            w3.push({ label: item['bank_name'], active: false, type: 'feature', property: item, 'lgId': '三级预警岸段' })
        }
    }
    // debugger
    w1.sort((a, b) => {
        return bank1Sort.indexOf(a.label) - bank1Sort.indexOf(b.label);
    })
    w2.sort((a, b) => {
        return bank2Sort.indexOf(a.label) - bank2Sort.indexOf(b.label);
    })
    w3.sort((a, b) => {
        return bank3Sort.indexOf(a.label) - bank3Sort.indexOf(b.label);
    })
    warning1.children = w1
    warning2.children = w2
    warning3.children = w3




    let zt = []
    let features = (await axios.get(tileServer + `/tile/vector/riverBeach/info`)).data
    for (let i = 0; i < features.length; i++) {
        zt.push(features[i])
    }
    let mainZt = {
        label: '长江沙洲',
        active: true,
        // icon: '/icons/洲滩.png',
        type: 'title1',
        children: []
    }
    zt.forEach((item) => {
        mainZt.children.push({ label: item.name, active: false, type: 'feature', property: item, 'lgId': '长江沙洲' })
    })
    // let quyushuixi = []

    let quyushuixi = {
        label: '骨干河道',
        icon: '/icons/流域水系.png',
        type: 'title1',
        active: true,
        filter: true,
        test: 1,
        children: [
            {
                label: '流域性骨干河道',
                icon: '/icons/流域水系.png',
                type: 'title2',
                active: true,
                filter: true,
            }, {
                label: '区域性骨干河道',
                icon: '/icons/流域水系.png',
                type: 'title2',
                active: true,
                filter: true,
            }
        ],
        data: []
    }
    let dt = (await axios.get(tileServer + `/tile/vector/riverArea/info`)).data
    dt.forEach((item) => {
        quyushuixi.data.push(item)
    })
    let sluice = {
        label: '重要水闸',
        icon: '/icons/水闸工程.png',
        type: 'title1',
        active: false,
        filter: true,
        children: [
            {
                label: '大中型水闸',
                type: 'title2',
                active: false,
                filter: true,
                children: []
            }, {
                label: '其他水闸',
                type: 'title2',
                active: false,
                filter: true,
                children: []
            }
        ],
        data: []
    }
    dt = (await axios.get(tileServer + `/tile/vector/sluiceArea/info`)).data
    dt.forEach((item) => {
        sluice.data.push(item)
    })
    let pump = {
        label: '重要泵站',
        icon: '/icons/泵站工程.png',
        type: 'title1',
        active: false,
        filter: true,
        children: [
            {
                label: '大中型泵站',
                type: 'title2',
                active: false,
                filter: true,
                children: []
            },
            {
                label: '其他泵站',
                type: 'title2',
                active: false,
                filter: true,
                children: []
            }
        ],
        data: []
    }
    dt = (await axios.get(tileServer + `/tile/vector/pumpArea/info`)).data
    dt.forEach((item) => {
        pump.data.push(item)
    })
    let treeNode1 = {
        label: '已建通道',
        type: 'title2',
        active: false,
        children: []
    }
    let treeNode2 = {
        label: '在建通道',
        type: 'title2',
        active: false,
        children: []
    }
    let treeNode3 = {
        label: '规划通道',
        type: 'title2',
        active: false,
        children: []
    }
    let riverPassageLine = {
        label: '过江通道',
        type: 'title1',
        active: false,
        filter: true,
        children: [
            treeNode1,
            treeNode2,
            treeNode3
        ],
        data: []
    }
    zt = (await axios.get(tileServer + `/tile/vector/riverBridge/info`)).data
    zt.forEach((item) => {
        riverPassageLine.data.push(item)
    })


    let tree = [
        {
            label: '重点岸段',
            active: true,
            type: 'title1',
            children: [
                warning1,
                warning2,
                warning3
            ]
        },
        mainZt,
        riverPassageLine,
        quyushuixi,
        sluice,
        pump,
        {
            label: '长江堤防',
            icon: '/icons/江堤港堤.png',
            type: 'title1',
            active: true,
            filter: true
        },
        {
            label: '其他',
            active: true,
            type: 'title1',
            children: [
                {
                    label: '行政区划',
                    icon: '/icons/行政区划.png',
                    type: 'title2',
                    active: true,
                    filter: true
                },
                {
                    label: '湖泊水库',
                    icon: '/icons/湖泊河流.png',
                    type: 'title2',
                    active: true,
                    filter: true
                },
                {
                    label: '水文站点',
                    icon: '/icons/水文站点.png',
                    type: 'title2',
                    active: false,
                    filter: true
                }
            ]
        }
    ]
    return tree
}


export {
    hideLayers,
    showLayers,
    getSideBarTree,
    DICT
}