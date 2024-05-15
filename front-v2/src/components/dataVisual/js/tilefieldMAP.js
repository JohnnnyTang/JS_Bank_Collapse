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
    "riverPassagePolygon": 13
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
    '全江概貌': [
        {
            style: {
                'height': '10%',
                'background-color': 'rgb(27,116,193)',
            },
            text: '流域水系'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                // 'transform': 'translateX(50%)',
                'background-color': 'rgb(76,103,169)',
            },
            text: '湖泊河流'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/icons/shuiwenzhandian.png')`,
                'transform': 'translateX(20%)',
            },
            text: '水文站点'
        },
    ],
    '工程情况': [
        {
            style: {
                'height': '10%',
                'background-color': '#D3ABF5',
            },
            text: '堤防工程'
        },
        //45,47,116
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-color': 'rgb(45,47,116)',
            },
            text: '码头工程'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'background-color': '#337ecc',
            },
            text: '水库工程'
        },
        {
            style: {
                'height': '30%',
                'width': '20%',
                'background-color': 'rgb(45,47,116)',
            },
            text: '水闸工程'
        },
        {
            style: {
                'height': '30%',
                'width': '20%',
                'background-color': 'rgb(45,47,116)',
            },
            text: '泵站工程'
        },
        {
            style: {
                'height': '80%',
                'width': '50%',
                'transform': 'translateX(22%)',
                'background-image': `url('/icons/zuhegongcheng.png')`,
            },
            text: '枢纽工程'
        },
        {
            style: {
                'height': '15%',
                'background-color': 'rgb(215,132,50)',
            },
            text: '过江大桥'
        },
        {
            style: {
                'height': '15%',
                'background-color': '#E6A23C',
            },
            text: '过江隧道/通道'
        },
    ],
    '重点岸段': [
        {
            style: {
                'background-color': '#FF00B0',
            },
            text: '一级预警岸段'
        },
        {
            style: {
                'background-color': '#00FFB0',
            },
            text: '二级预警岸段'
        },
        {
            style: {
                'background-color': '#0000FF',
            },
            text: '三级预警岸段'
        },
    ]
}




export {
    sourceNameMap,
    sourceFieldMap,
    sourceZoomMap,
    sourceColumnMap,
    legendMap
}