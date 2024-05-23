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
            "name": "名称",
            "code": "编号",
            "basin": "流域",
            "water": "水系",
            "area": "水面面积",
            "height": "正常蓄水位",
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
            "fix_project": '治理工程'
        }
    },
    'sandBar': {
        "original": "主要洲滩",
        "fieldMap": {
            "name": "名称",
            "river": "所属河段",
            // "sortId": '洲滩编号',
            "0m线内面积(km3)": '面积(km3)',
            "洲滩内人口": '人口',
            "2019年GDP\n（万元）": '2019年GDP(万元)',
            "岸线功能区名称": '岸线功能区',
            "预案": '防汛预案'
        }
    },
    'channel': {
        "original": "过江通道",
        "fieldMap": {
            "name": "名称",
            "planning":"类型",
            // "river": "所属河段",
            // "0m线内面积(km3)": '面积(km3)',
            // "洲滩内人口": '人口',
            // "2019年GDP\n（万元）": '2019年GDP(万元)',
            // "岸线功能区名称": '岸线功能区',
            // "预案": '防汛预案'
        }
    }
}
/*
{
    "name": "炮子洲",
    "id": 1,
    "region": "扬中市",
    "river": "扬中河段",
    "sortId": 18,
    "所属河道": "长江",
    "市（地）级行政区": "镇江",
    "县级行政区": "扬中市",
    "位置坐标": "492094.966,3545126.220",
    "是否圈围出水（全部/部分/无圈围）": "是",
    "主江防洪水位(85基面，m)": 6.03,
    "防洪设计水位": null,
    "0m线内面积(km3)": "0",
    "洲滩内人口": "16484（居民）",
    "洲滩内耕地面积(m2)": "5399142.8555100001",
    "洲滩内耕地占比": "0.3194759086100592",
    "2019年GDP\n（万元）": "236600",
    "岸线功能区名称": "保留区/控制利用区",
    "功能岸线长度(km)": "10.09/9.17",
    "预案": "沙家港站水位达8.05m，全部撤离",
    "center_x": 119.906304863248,
    "center_y": 32.05590864640032
}
*/


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
    "riverArea": 13,
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
    'importantBank': 12,
    'sandBar': 12,
    'channel': 13,
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
    "importantBank": 3,
    'sandBar': 2
}
const legendStyleMap = {
    '全江概貌': {
        '水文站点': [
            {
                style: {
                    'height': '80%',
                    'width': '50%',
                    'background-image': `url('/legend/水文站.png')`,
                    'transform': 'translateX(25%)',
                },
                text: '水文站点'
            }],
        '行政区划': [
            {
                style: {
                    'height': '80%',
                    'width': '50%',
                    'background-color': 'rgb(222, 246, 250)',
                    'border-color': 'rgb(51, 38, 71)',
                    'border-width': '1px',
                    'border-style': 'solid',
                },
                text: '行政区划'
            },
        ],
        // '河道分段': [],
        '流域水系': [
            {
                style: {
                    'height': '80%',
                    'width': '50%',
                    'background-image': `url('/legend/河流.png')`,
                    'background-size': 'cover',
                },
                text: '流域水系'
            },
        ],
        '湖泊河流': [
            {
                style: {
                    'height': '80%',
                    'width': '50%',
                    'background-image': `url('/legend/湖泊.png')`,
                    'background-size': 'cover',
                },
                text: '湖泊河流'
            },
        ],

    },
    '工程情况': {
        '水闸工程': [
            {
                style: {
                    'height': '80%',
                    'width': '50%',
                    'background-image': `url('/legend/水闸.png')`,
                    'transform': 'translateX(25%)',
                },
                text: '水闸工程'
            },
        ],
        '泵站工程': [{
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/泵站.png')`,
                'transform': 'translateX(25%)',
            },
            text: '泵站工程'
        },],
        '枢纽工程': [{
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/枢纽.png')`,
                'transform': 'translateX(25%)',
            },
            text: '枢纽工程'
        },],
        '过江通道': [{
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': 'rgb(52, 0, 143)',
            },
            text: '已建通道'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': 'rgb(196, 50, 6)',
            },
            text: '在建通道'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': 'rgb(179, 4, 74)',
            },
            text: '规划通道'
        },
            // {
            //     style: {
            //         'height': '80%',
            //         'width': '50%',
            //         'background-image': `url('/legend/过江大桥.png')`,
            //         'background-size': 'cover',
            //     },
            //     text: '过江大桥'
            // },
        ],
        '长江干堤': [{
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': '#958E54',
            },
            text: '长江干堤'
        },],
        '其他堤防': [{
            style: {
                'height': '100%',
                'width': '100%',
                'background-image': `url('/legend/堤防.png')`,
                'background-size': 'cover',
                'transform': 'scale(0.5)',
            },
            text: '其他堤防'
        },],
        '码头工程': [{
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/码头.png')`,
                'background-size': 'cover',
            },
            text: '码头工程'
        },],
        '水库大坝': [{
            style: {
                'height': '80%',
                'width': '50%',
                'background-image': `url('/legend/水库.png')`,
                'background-size': 'cover',
            },
            text: '水库工程'
        },],
    },
    '重点岸段': {
        '岸段名录': [
            {
                style: {
                    'height': '15%',
                    'width': '50%',
                    'background-color': 'rgb(247, 21, 0)',
                },
                text: '一级预警岸段'
            },
            {
                style: {
                    'height': '15%',
                    'width': '50%',
                    'background-color': 'rgb(222, 106, 4)',
                },
                text: '二级预警岸段'
            },
            {
                style: {
                    'height': '15%',
                    'width': '50%',
                    'background-color': 'rgb(173, 162, 5)',
                },
                text: '三级预警岸段'
            },
        ]
    }
}

const legendListt = [
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
            'background-image': `url('/legend/水闸.png')`,
            'transform': 'translateX(10%) scale(0.8)',
        },
        text: '水闸工程'
    },
    {
        style: {
            'height': '80%',
            'width': '50%',
            'background-image': `url('/legend/泵站.png')`,
            'transform': 'translateX(35%) scale(1.3)',
        },
        text: '泵站工程'
    },
    {
        style: {
            'height': '60%',
            'width': '50%',
            'background-image': `url('/legend/堤防.png')`,
            'transform': 'translateX(10%)',
        },
        text: '长江干堤'
    },
    {
        style: {
            'height': '15%',
            'width': '50%',
            'background-color': '#ff3d2b',
        },
        text: '一级预警岸段'
    },
    {
        style: {
            'height': '15%',
            'width': '50%',
            'background-color': 'rgb(27, 74, 245)',
        },
        text: '二级预警岸段'
    },
    {
        style: {
            'height': '15%',
            'width': '50%',
            'background-color': 'rgb(127, 113, 143)',
        },
        text: '三级预警岸段'
    },
    {
        style: {
            'height': '50%',
            'width': '50%',
            // 'background-color': 'rgb(52, 0, 143)',
            'background-image': `url('/legend/在建通道.png')`,
            'transform': 'scaleY(0.5) translateX(5%)'
        },
        text: '过江通道'
    },
    // {
    //     style: {
    //         'height': '15%',
    //         'width': '50%',
    //         'background-color': 'rgb(196, 50, 6)',
    //     },
    //     text: '在建通道'
    // },
    // {
    //     style: {
    //         'height': '15%',
    //         'width': '50%',
    //         'background-color': 'rgb(179, 4, 74)',
    //     },
    //     text: '规划通道'
    // },
    {//128,128,128
        style: {
            'height': '80%',
            'width': '50%',
            'background-color': `rgb(128,128,128)`,
            'background-size': 'cover',
        },
        text: '码头工程'
    },
    {
        style: {
            'height': '80%',
            'width': '50%',
            'background-color': `rgb(171,225,247)`,
            'background-size': 'cover',
        },
        text: '湖泊/河流/水库'
    },
    {
        style: {
            'height': '80%',
            'width': '50%',
            'background-color': `rgb(240,239,209)`,
            'background-size': 'cover',
        },
        text: '主要洲滩'
    },
]


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
                'background-color': 'rgb(222, 246, 250)',
                'border-color': 'rgb(51, 38, 71)',
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
                // 'background-image': `url('/legend/湖泊.png')`,
                'background-color': `rgb(141,187,225)`,
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
        /*
        已建--plan==1  #ff7875
        在建--plan==0  #ffd875
        规划--plan==-1 #b8ff75
        */
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': 'rgb(52, 0, 143)',
            },
            text: '已建通道'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': 'rgb(196, 50, 6)',
            },
            text: '在建通道'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': 'rgb(179, 4, 74)',
            },
            text: '规划通道'
        },
        {
            style: {
                'height': '100%',
                'width': '100%',
                'background-image': `url('/legend/堤防.png')`,
                'background-size': 'cover',
                'transform': 'scale(0.5)',
            },
            text: '其他堤防'
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
                'background-color': 'rgb(247, 21, 0)',
            },
            text: '一级预警岸段'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': 'rgb(222, 106, 4)',
            },
            text: '二级预警岸段'
        },
        {
            style: {
                'height': '15%',
                'width': '50%',
                'background-color': 'rgb(173, 162, 5)',
            },
            text: '三级预警岸段'
        },
        // {
        //     style: {
        //         'height': '80%',
        //         'width': '50%',
        //         'background-color': 'rgba(105, 67, 39,0.9)',
        //     },
        //     text: '沙洲/江心洲'
        // },
        // {
        //     style: {
        //         'margin-top': '22vh',
        //         'margin-left': '1vw',
        //         'height': '800%',
        //         'width': '75%',
        //         'background-image': `url(/legend/地形.png)`,
        //     },
        //     text: '水下地形'
        // }
    ]
}


const importantFeature = {
    '省级行政区': [],
    '市级行政区': ['南京市', '扬州市', '镇江市', '泰州市', '常州市', '无锡市', '苏州市', '南通市'],
    '市级行政区-注记': [],
    '河道分段': [],
    '河道分段-注记': [],
    '区域水系': ['滁河', '秦淮河', '内秦淮河', '秦淮新河', '石固河', '长江', '长江岔河', '长江世业洲北汊', '京杭运河白马湖-高宝湖长江区段'],
    '大型湖泊': ['石臼湖', '固成湖', '太湖'],
    '水文站点': ["南京", "镇江（二）", "三江营", "江阴", "天生港", "青龙港", "三条港(二)"],
    '其他堤防': ["长江堤防太平洲段", "长江港堤三和港西支堤", '长江港堤三和港东支堤', '栏杆圩区', '联丰圩', '联丰港左堤', '联丰港右堤', '长旺港右堤', '长旺港左堤'],
    '其他堤防-注记': [],
    '过江通道-桥墩': [],
    '过江通道-桥': [],
    '过江通道-隧道/通道': [],
    '过江通道-隧道/通道-注记': [],
    '过江通道-桥-注记': [],
    '沿江码头': [],
    '水库大坝': [],
    '水闸工程': ['三和港闸', '新坝镇栏杆桥闸', '联丰水闸', '九圩闸', '南通市九圩港闸', '下九圩闸', '望虞河常熟水利枢纽-水闸工程', '界牌闸站-引涵工程', '新沟闸', '上九圩港闸', '谏壁节制闸', '新坝镇联丰港闸', '焦港闸', '联丰8组水闸', '油坊镇长旺港闸', '同兴闸', '同兴中闸', '同兴西闸', '红山窑水利枢纽节制闸', '高港闸', '泰州引江河枢纽—高港节制闸', '泰州引江河枢纽—高港送水闸', '泰州引江河枢纽—高港调度闸'],
    '泵站工程': [],
    '枢纽工程': ["秦淮新河闸站组合工程", "望虞河常熟水利枢纽"],
    '长江干堤': [],
    '里程桩': [],
    '一级预警岸段': ['新太海汽渡～七丫口', '太平洲左缘（二墩港至胜利河', '嘶马弯道凹岸', '民主沙'],
    '二级预警岸段': [],
    '三级预警岸段': [],
    '岸段-注记': [],
    '历史崩岸': [],
    '近岸地形': [],
    '沙洲': [],
    '全江注记': []
}

const layerSourceMap = {
    '市级行政区': 'cityBoundaryLine',
    '市级行政区-注记': 'cityBoundaryLine',
    '区域水系': 'riverArea',
    '大型湖泊': 'lakeArea',
    '水文站点': 'hydroStationPoint',
    '其他堤防': 'embankmentLine',
    '一级预警岸段': 'importantBank',
    '二级预警岸段': 'importantBank',
    '三级预警岸段': 'importantBank',
    '岸段-注记': 'importantBank',
    '水闸工程': 'sluiceArea',
    '枢纽工程': 'combineProjectPoint',
    '主要洲滩': 'sandBar',
    '已建通道': 'channel',
    '在建通道': 'channel',
    '规划通道': 'channel'
}

const filterMap = {
    '省级行政区': [],
    '市级行政区': ['in', 'name', ...importantFeature['市级行政区']],
    '市级行政区-注记': ['in', 'name', ...importantFeature['市级行政区']],
    '河道分段': [],
    '河道分段-注记': [],
    '区域水系': ['in', 'name', ...importantFeature['区域水系']],
    '区域水系-注记': ['in', 'name', ...importantFeature['区域水系']],
    '大型湖泊': ['in', 'name', ...importantFeature['大型湖泊']],
    '大型湖泊-注记': ['in', 'name', ...importantFeature['大型湖泊']],
    '水文站点': ['in', 'sp_name', ...importantFeature['水文站点']],
    '水文站点-注记': ['in', 'sp_name', ...importantFeature['水文站点']],
    '其他堤防': ['in', 'sp_name', ...importantFeature['其他堤防']],
    '其他堤防-注记': ['in', 'sp_name', ...importantFeature['其他堤防']],
    '过江通道-桥墩': [],
    '过江通道-桥': [],
    '过江通道-隧道/通道': [],
    '过江通道-隧道/通道-注记': [],
    '过江通道-桥-注记': [],
    '沿江码头': [],
    '沿江码头-注记': [],
    '水库大坝': [],
    '水库大坝-注记': [],
    '水闸工程': ['in', 'sp_name', ...importantFeature['水闸工程']],
    '水闸工程-注记': ['in', 'sp_name', ...importantFeature['水闸工程']],
    '泵站工程': [],
    '泵站工程-注记': [],
    '枢纽工程': ['in', 'name', ...importantFeature['枢纽工程']],
    '枢纽工程-注记': ['in', 'name', ...importantFeature['枢纽工程']],
    '长江干堤': [],
    '里程桩': [],
    '一级预警岸段': [],
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
    legendStyleMap,
    filterMap,
    legendListt,
    layerSourceMap
}