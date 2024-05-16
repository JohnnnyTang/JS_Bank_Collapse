const sourceFieldMap = {
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
            "id": "id",
            "new_id": "编号",
            "city": "所在市",
            "county": "所在区",
            "project_type": "项目类型",
            "project_name": "项目名称",
            "dock_type": "码头类型",
            "is_production": "是否为生产",
            "start_time": "开工时间",
            "area_type": "功能区类型",
            "shoreline_type": "三生岸线"
        }
    },
    "embankmentLine": {
        "original": "堤防工程",
        "fieldMap": {
            "id": "id",
            "district": "起点位置地区",
            "county": "起点位置县",
            "class": "堤防类型",
            "class_sub": "堤防型式",
            "sp_name": "名称",
            "length": "长度",
            "height": "堤顶起点高程",
            "bank": "岸别",
            "level": "级别"
        }
    },
    "hydroStationPoint": {
        "original": "水文水位站",
        "fieldMap": {
            "id": "编号",
            "sp_name": "名称",
            "begin": "设站日期",
            "place": "测站地点"
        }
    },
    "lakeArea": {
        "original": "国普湖泊",
        "fieldMap": {
            "id": "id",
            "code": "编号",
            "basin": "流域",
            "water": "水系",
            "area": "水面面积",
            "height": "正常蓄水位",
            "name": "名称"
        }
    },
    "pumpArea": {
        "original": "泵站工程",
        "fieldMap": {
            "id": "编号",
            "sp_name": "名称",
            "river": "所在河流湖泊水库渠道",
            "level": "级别"
        }
    },
    "reservoirArea": {
        "original": "水库工程",
        "fieldMap": {
            "id": "id",
            "sp_name": "名称",
            "river": "所在河流湖泊水库渠道",
            "class": "水库类型",
            "area": "坝址控制流域面积",
            "flow": "坝址多年平均径流量",
            "level": "工程级别",
            "length": "坝长",
            "height": "坝高"
        }
    },
    "riverArea": {
        "original": "国普河流",
        "fieldMap": {
            "id": "id",
            "code": "编号",
            "basin": "流域",
            "water": "水系",
            "area": "水面面积",
            "height": "正常蓄水位",
            "name": "名称"
        }
    },
    "sluiceArea": {
        "original": "水闸工程",
        "fieldMap": {
            "id": "id",
            "sp_name": "名称",
            "river": "所在河流湖泊水库渠道",
            "class": "水闸类型",
            "level": "工程等别",
            "volume": "过闸流量"
        }
    },
    "importantBank": {
        "original": "重点岸段",
        "fieldMap": {
            "bank_name": "名称",
            "city_name": "所属城市",
            "river_name": "所属河段",
            "monitoring_length": '岸段长度',
            "warning_level": "预警等级",
            "description": '简介',
        }
    },
}

const sourceNameMap = {
    "cityBoundaryLine": "name",
    "riverSection": "label",
    "riverArea": "name",
    "lakeArea": "name",
    "hydroStationPoint": "sp_name",
    "combineProjectPoint": "name",
    "dockArea": "project_name",
    "embankmentLine": "sp_name",
    "pumpArea": "sp_name",
    "reservoirArea": "sp_name",
    "sluiceArea": "sp_name",
    "riverPassageLine": 'name',
    "riverPassagePolygon": 'name',
    "importantBank": 'bank_name',
}

const sourceZoomMap = {
    "cityBoundaryLine": 8.5,
    "riverSection": 9,
    "riverArea": 11.5,
    "lakeArea": 12,
    "hydroStationPoint": 11,
    "combineProjectPoint": 13,
    "dockArea": 13.5,
    "embankmentLine": 13,
    "pumpArea": 15.5,
    "reservoirArea": 14,
    "sluiceArea": 15,
    "riverPassageLine": 13,
    "riverPassagePolygon": 13,
    'importantBank': 12
}

const sourceColumnMap = {
    "riverArea": 2,
    "lakeArea": 2,
    "hydroStationPoint": 3,
    "combineProjectPoint": 10,
    "dockArea": 2,
    "embankmentLine": 2,
    "pumpArea": 2,
    "reservoirArea": 2,
    "sluiceArea": 2,
    "importantBank": 4,
}

const legendMap = {
    // 按点线面
    '全江概貌': [
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/水文站.png')`,
                'transform': 'translateX(25%)',
            },
            text: '水文站点'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-color': 'rgb(206,239,249)',
                'border-color': 'rgb(79,105,146)',
                'border-width': '1px',
                'border-style': 'solid',
            },
            text: '行政区划'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/河流.png')`,
                'background-size': 'cover',
            },
            text: '国普河流'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/湖泊.png')`,
                'background-size': 'cover',
            },
            text: '国普湖泊'
        },

    ],
    '工程情况': [
        {
            style: {
                'height': '30%',
                'width': '10%',
                'border-radius': '50%',
                'background-color': '#504C28',
            },
            text: '江堤里程桩'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/水闸.png')`,
                'transform': 'translateX(25%)',
            },
            text: '水闸工程'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/泵站.png')`,
                'transform': 'translateX(25%)',
            },
            text: '泵站工程'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/枢纽.png')`,
                'transform': 'translateX(25%)',
            },
            text: '枢纽工程'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': '#958E54',
            },
            text: '长江干堤'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': '#E6A23C',
            },
            text: '过江隧道/通道'
        },
        {
            style: {
                'height': '100%',
                'width': '100%',
                'background-image': `url('/legend/堤防.png')`,
                'background-size': 'cover',
                'transform': 'scale(0.5)',
            },
            text: '堤防工程'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/过江大桥.png')`,
                'background-size': 'cover',
            },
            text: '过江大桥'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/码头.png')`,
                'background-size': 'cover',
            },
            text: '码头工程'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/水库.png')`,
                'background-size': 'cover',
            },
            text: '水库工程'
        },
    ],
    '重点岸段': [
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': '#FF00B0',
            },
            text: '一级预警岸段'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': '#00FFB0',
            },
            text: '二级预警岸段'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': '#0000FF',
            },
            text: '三级预警岸段'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-color': '#C4632E',
            },
            text: '沙洲/江心洲'
        },
        {
            style: {
                'margin-top': '22vh',
                'margin-left': '1vw',
                'height': '800%',
                'width': '75%',
                'background-image': `url(/legend/地形.png)`,
            },
            text: '水下地形'
        }
    ]
}


const importantFeature = {
    '省级行政区': [],
    '市级行政区': ['南京市', '扬州市', '镇江市', '泰州市', '常州市', '无锡市', '苏州市', '南通市'],
    '市级行政区-注记': [],
    '河道分段': [],
    '河道分段-注记': [],
    '流域水系': ['滁河', '秦淮河', '内秦淮河', '石固河', '长江', '长江岔河'],
    '湖泊河流': ['石臼湖', '固成湖'],
    '水文站点': ["南京", "镇江（二）", "三江营", "江阴", "天生港", "青龙港", "三条港(二)"],
    '其他堤防': ["新太海汽渡～七丫口岸段", "嘶马弯道凹岸", "太平洲左缘（二墩港至胜利河）岸段", "民主沙岸段", "塘芦港新闸", "三和港闸", "栏杆桥闸", "联丰港闸", "长旺港闸", "同兴闸"],
    '其他堤防-注记': [],
    '过江通道-桥墩': [],
    '过江通道-桥': [],
    '过江通道-隧道/通道': [],
    '过江通道-隧道/通道-注记': [],
    '过江通道-桥-注记': [],
    '沿江码头': [],
    '水库大坝': [],
    '水闸工程': ['三和港闸','新坝镇栏杆桥闸','联丰水闸','新坝镇联丰港闸','联丰8组水闸','油坊镇长旺港闸','同兴闸','同兴中闸','同兴西闸'],
    '泵站工程': [],
    '枢纽工程': ["秦淮新河闸站组合工程","望虞河常熟水利枢纽"],
    '长江干堤': [],
    '里程桩': [],
    '一级预警岸段': ['新太海汽渡～七丫口','太平洲左缘（二墩港至胜利河','嘶马弯道凹岸','民主沙'],
    '二级预警岸段': [],
    '三级预警岸段': [],
    '岸段-注记': [],
    '历史崩岸': [],
    '近岸地形': [],
    '沙洲': [],
    '全江注记': []


}





export {
    sourceNameMap,
    sourceFieldMap,
    sourceZoomMap,
    sourceColumnMap,
    legendMap,
    importantFeature
}