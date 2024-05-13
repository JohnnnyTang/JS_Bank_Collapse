const sourceFieldMap = {
    "combineProjectPoint": {
        "original": "组合工程",
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
    "bank-level1-source": {
        "original": "重点岸段",
        "fieldMap": {
            "bankName": "名称",
            "cityName": "所属城市",
            "riverName": "所属河段",
            "warningLevel": "预警等级",
            "description": '简介',
        }
    },
    "bank-level2-source": {
        "original": "重点岸段",
        "fieldMap": {
            "bankName": "名称",
            "cityName": "所属城市",
            "riverName": "所属河段",
            "warningLevel": "预警等级",
            "description": '简介',
        }
    },
    "bank-level3-source": {
        "original": "重点岸段",
        "fieldMap": {
            "bankName": "名称",
            "cityName": "所属城市",
            "riverName": "所属河段",
            "warningLevel": "预警等级",
            "description": '简介',
        }
    }
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
    "bank-level1-source": 'bankName',
    "bank-level2-source": 'bankName',
    "bank-level3-source": 'bankName',
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

// {
//     "bankName": "七坝",
//     "cityName": "南京市",
//     "createTime": "2024-01-25 22:05:12",
//     "description": "位于南京市浦口区桥林街道，板桥汽渡至骚狗山之间，全长约8.3公里，平均水深在-5米以下，属一级岸线，具有较好的发展空间和不可多得的资源优势",
//     "id": "65b1fa18591ce236a211196c",
//     "memo": "",
//     "monitoringLength": 11.7,
//     "number": 4,
//     "riverName": "南京河段",
//     "state": "active",
//     "updateTime": "2024-01-25 22:05:12",
//     "warningLevel": 1
// }

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
    "bank-level1-source": 2,
    "bank-level2-source": 1,
    "bank-level3-source": 1
}

export {
    sourceNameMap,
    sourceFieldMap,
    sourceZoomMap,
    sourceColumnMap
}