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
    '重点岸段': ['预警岸段', '岸段-注记'],
    '长江沙洲': ['洲滩', '洲滩-注记'],
    '过江通道': ['过江通道', '过江通道-注记'],
    '骨干河道': ['骨干河道', '骨干河道-注记'],
    '重要水闸': ['水闸工程', '水闸工程-注记', '水闸工程-重点'],
    '重要泵站': ['泵站工程', '泵站工程-注记'],
    '长江堤防': ['长江干堤', '里程桩'],
    '其他': ['市级行政区', '市级行政区-注记', '重点行政区边界', '水文站点', '水文站点-注记', '水库大坝', '水库大坝-注记']

}
const Title2dict = {
    '一级预警岸段': ['一级预警岸段', '岸段-注记'],
    '二级预警岸段': ['二级预警岸段', '岸段-注记'],
    '三级预警岸段': ['三级预警岸段', '岸段-注记'],
    '已建通道': ['过江通道', '过江通道-注记'],
    '在建通道': ['过江通道', '过江通道-注记'],
    '规划通道': ['过江通道', '过江通道-注记'],
    '流域性骨干河道': ['骨干河道', '骨干河道-注记'],
    '区域性骨干河道': ['骨干河道', '骨干河道-注记'],
    '重要水闸':['水闸工程', '水闸工程-注记', '水闸工程-重点'],
    '重要泵站':['泵站工程', '泵站工程-注记'],
    '重要湖泊': ['大型湖泊', '大型湖泊-注记'],
    '行政区划': ['市级行政区', '市级行政区-注记', '重点行政区边界'],
    '水文站点': ['水文站点', '水文站点-注记'],
}

const tableFieldMap = {
    "combineProjectPoint": {
        "original": "枢纽工程",
        "fieldMap": {
            "id": "编号",
            "name": "名称"
        }
    },
    "dockArea": {
        "original": "长江码头工程",
        "fieldMap": {
            "new_id": "编号",
            "project_name": "项目名称",
            "dock_type": "码头类型",
            "area_type": "功能区类型",
        }
    },
    "embankmentLine": {
        "original": "堤防工程",
        "fieldMap": {
            "class": "堤防类型",
            "sp_name": "名称",
            "length": "长度",
            "bank": "岸别",
        }
    },
    "hydroStationPoint": {
        "original": "水文水位站",
        "fieldMap": {
            "sp_name": "名称",
            "begin": "设站日期",
            "place": "测站地点"
        }
    },
    "lakeArea": {
        "original": "国普湖泊",
        "fieldMap": {
            "name": "名称",
            "area": "水面面积",
            "height": "正常蓄水位",
        }
    },
    "pumpArea": {
        "original": "泵站工程",
        "fieldMap": {
            "sp_name": "名称",
            "river": "所在河流湖泊水库渠道",
            "level": "级别"
        }
    },
    "reservoirArea": {
        "original": "水库工程",
        "fieldMap": {
            "sp_name": "名称",
            "class": "水库类型",
            "area": "坝址控制流域面积",
            "flow": "坝址多年平均径流量",
        }
    },
    "riverArea": {
        "original": "国普河流",
        "fieldMap": {
            "name": "名称",
            "area": "水面面积",
            "basin": "流域",
            "water": "水系",
        }
    },
    "sluiceArea": {
        "original": "水闸工程",
        "fieldMap": {
            "sp_name": "名称",
            "river": "所在河流湖泊水库渠道",
            "class": "水闸类型",
            "volume": "过闸流量"
        }
    },
    "importantBank": {
        "original": "重点岸段",
        "fieldMap": {
            "bank_name": "名称",
            "river_name": "所属河段",
            "monitoring_length": '岸段长度',
            "warning_level": "预警等级",
        }
    },
    "cityBoundaryLine": {
        "original": "行政区划",
        "fieldMap": {
            'name': '名称',
        }
    },
    "riverPassageLine": {
        "original": "国普河流",
        "fieldMap": {
            'name': '名称',
        }
    },
    "riverPassagePolygon": {
        "original": "国普河流",
        "fieldMap": {

        }
    }
}







const DICT = {
    T1LayerDict: Title1dict,
    T2LayerDict: Title2dict,
    T2LayerFunction: t,
    LayerGroupTableDict: tableFieldMap
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
    for (let i = 0; i < bankData.length; i++) {
        let item = bankData[i]
        if (item['warning_level'] == 1) {
            warning1.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item })
        } else if (item['warning_level'] == 2) {
            warning2.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item })
        } else if (item['warning_level'] == 3) {
            warning3.children.push({ label: item['bank_name'], active: false, type: 'feature', property: item })
        }
    }
    let zt = []
    let features = sandbar.features
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
        let firstCoord = item.geometry.coordinates[0][0][0]
        item.properties.center_x = firstCoord[0]
        item.properties.center_y = firstCoord[1]
        mainZt.children.push({ label: item.properties.name, active: false, type: 'feature', property: item.properties })
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
        ]
    }
    let quyushuixi2 = {
        label: '骨干河道',
        icon: '/icons/流域水系.png',
        type: 'title1',
        active: true,
        filter: true,
        test: 2,
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
        ]
    }
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
        ]
    }
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
        ]
    }
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
        ]
    }

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
            active: false,
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
                    label: '重要湖泊',
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
    console.log(tree);
    return tree
}


export {
    hideLayers,
    showLayers,
    getSideBarTree,
    DICT
}