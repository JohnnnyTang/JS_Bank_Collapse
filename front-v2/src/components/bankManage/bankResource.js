import { ref } from 'vue'

/////////////////////////// BANK BASIC INFO STYLE OBJECT
export const defaultBankBasic_Style_Info = [
    {
        key: '预警级别',
        val: '',
        type: ['half', 'left'],
        necessary: false
    },
    // {
    //     key: '中心坐标',
    //     val: '',
    //     type: ['half', 'two-row', 'right'],
    //     splitter: ' ', necessary: false
    // },
    {
        key: '监测长度',
        val: '',
        type: ['half', 'left'],
        necessary: false
    },
    {
        key: '监测起始时间',
        val: '',
        type: ['half', 'left'],
        necessary: false
    },
    {
        key: '基本情况',
        val: '',
        type: ['single', 'long-text'], necessary: false
    },
    {
        key: '管理单位',
        val: '',
        type: ['half', 'left'], necessary: false
    },
    {
        key: '管理单位联系方式',
        val: '',
        type: ['half', 'right'], necessary: false
    }
]

export const getBankBasic_Style_Info = (basicInfo) => {
    return [
        {
            key: '预警级别',
            val: basicInfo["riskLevel"],
            type: ['unique'],
            necessary: false
        },
        // {
        //     key: '中心坐标',
        //     val: basicInfo["center"],
        //     type: ['half', 'right'],
        //     splitter: ' ', necessary: false
        // },
        {
            key: '监测长度',
            val: basicInfo["monitorLength"],
            type: ['half', 'left'],
            necessary: false
        },
        {
            key: '监测起始时间',
            val: basicInfo["monitorStartTime"],
            type: ['half', 'right'],
            necessary: false
        },
        {
            key: '基本情况',
            val: basicInfo["introduction"],
            type: ['single', 'long-text'], necessary: false
        },
        {
            key: '管理单位',
            val: basicInfo["management"]["department"],
            type: ['half', 'left', 'medium-text'], necessary: false
        },
        {
            key: '管理单位联系方式',
            val: basicInfo["management"]["contact"],
            type: ['half', 'right', 'medium-text'], necessary: false
        }
    ]
}


////////////////////////// BANK RESOURCE TABLE COLUMN
export const tableColumns = {
    '模型资源管理': {
        '岸段地形资源': [
            {
                prop: "name",
                label: "名称",
                "min-width": "20%",
                asTag: false
            },
            {
                prop: "sets",
                label: "工况集",
                "min-width": "20%",
                asTag: false
            },
            {
                prop: "year",
                label: "年份",
                "min-width": "20%",
                asTag: false
            },
            {
                prop: "fileType",
                label: "文件类型",
                "min-width": "20%",
                asTag: true
            },
        ],
        '模型参数文件': [
            {
                prop: "name",
                label: "名称",
                "min-width": "20%",
                asTag: false
            },
            {
                prop: "fileType",
                label: "文件类型",
                "min-width": "20%",
                asTag: true
            },
        ],
        '判别断面文件': [
            {
                prop: "name",
                label: "名称",
                "min-width": "20%",
                asTag: false
            },
            {
                prop: "fileType",
                label: "文件类型",
                "min-width": "20%",
                asTag: true
            },
        ],
        '水动力预算工况': [
            {
                prop: "name",
                label: "名称",
                "min-width": "20%",
                asTag: false
            },
            {
                prop: "sets",
                label: "工况集",
                "min-width": "20%",
                asTag: false
            },
            {
                prop: "year",
                label: "年份",
                "min-width": "20%",
                asTag: false
            },
            {
                prop: "fileType",
                label: "文件类型",
                "min-width": "20%",
                asTag: true
            },
        ]
    },
    '可视化资源管理': {
        '栅格可视化资源': [
            {
                prop: "name",
                label: "名称",
                "min-width": "40%",
                asTag: false
            },
            {
                prop: "type",
                label: "类型",
                "min-width": "40%",
                asTag: true
            },
        ],
        '其他可视化资源': [
            {
                prop: "name",
                label: "名称",
                "min-width": "40%",
                asTag: false
            },
            {
                prop: "type",
                label: "类型",
                "min-width": "40%",
                asTag: true
            },
        ]
    },
    '设备资源管理': {
        'GNSS设备': [{
            prop: "name",
            label: "设备名",
            "min-width": "24%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "经度",
            "min-width": "23%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "纬度",
            "min-width": "23%",
            asTag: false
        }],
        '孔隙水压力计设备': [{
            prop: "name",
            label: "设备名",
            "min-width": "24%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "经度",
            "min-width": "23%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "纬度",
            "min-width": "23%",
            asTag: false
        }],
        '应力桩设备': [{
            prop: "name",
            label: "设备名",
            "min-width": "24%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "经度",
            "min-width": "23%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "纬度",
            "min-width": "23%",
            asTag: false
        }],
        "测斜仪设备": [{
            prop: "name",
            label: "设备名",
            "min-width": "24%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "经度",
            "min-width": "23%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "纬度",
            "min-width": "23%",
            asTag: false
        }],
        "监控摄像设备": [{
            prop: "name",
            label: "设备名",
            "min-width": "24%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "经度",
            "min-width": "23%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "纬度",
            "min-width": "23%",
            asTag: false
        }],
        "其他设备": [{
            prop: "name",
            label: "设备名",
            "min-width": "24%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "经度",
            "min-width": "23%",
            asTag: false
        },
        {
            prop: "latitude",
            label: "纬度",
            "min-width": "23%",
            asTag: false
        }]
    }
}

export const initialTableDatas = {
    '模型资源管理': {
        '岸段地形资源': [
            {
                name: '起始地形',
                sets: 'xxxx',
                year: '20xx',
                fileType: 'xxx',
                placeHolder: true,
                upload: true,
            },
            {
                name: '计算地形',
                sets: 'xxxx',
                year: '20xx',
                fileType: 'xxx',
                placeHolder: true,
                upload: true,
            },
        ],
        '模型参数文件': [
            {
                name: '造床流量系数',
                fileType: 'xxx',
                setting: true,
                upload: true,
                placeHolder: true
            },
            {
                name: '权重阈值参数',
                fileType: 'xxx',
                setting: true,
                upload: true,
                placeHolder: true
            },
            {
                name: '岸段边界文件',
                fileType: 'xxx',
                upload: true,
                placeHolder: true
            }
        ],
        '判别断面文件': [
            {
                name: '风险研判断面',
                fileType: 'xxx',
                placeHolder: true,
                upload: true
            },
        ],
        '水动力预算工况': [
            {
                name: '一级流量小潮工况',
                sets: 'xxxx',
                year: '20xx',
                fileType: 'xxx',
                placeHolder: true,
                upload: true,
            },
            {
                name: '一级流量中潮工况',
                sets: 'xxxx',
                year: '20xx',
                fileType: 'xxx',
                placeHolder: true,
                upload: true,
            },
            {
                name: '一级流量大潮工况',
                sets: 'xxxx',
                year: '20xx',
                fileType: 'xxx',
                placeHolder: true,
                upload: true,
            },
            {
                name: '二级流量小潮工况',
                sets: 'xxxx',
                year: '20xx',
                fileType: 'xxx',
                placeHolder: true,
                upload: true,
            },
            {
                name: '二级流量中潮工况',
                sets: 'xxxx',
                year: '20xx',
                fileType: 'xxx',
                placeHolder: true,
                upload: true,
            },
            {
                name: '二级流量大潮工况',
                sets: 'xxxx',
                year: '20xx',
                fileType: 'xxx',
                placeHolder: true,
                upload: true,
            },
        ]
    },
}




///////////////////////// BANK RESOURCE DICTS
export const typeDict = ['model', 'visual', 'device']

export const categoryNameDict = ['模型资源管理', '可视化资源管理', '设备资源管理']

export const resourceTypeDict = {
    // 'model': ['DEM', 'Hydrodynamic', 'Boundary', 'Config'],
    'model': ['DEM', 'Config', 'Section', 'Hydrodynamic', 'Boundary'],
    'visual': ['DEM', 'Vector'],
    'device': ['GNSS', 'MENOMETER', "STRESS", "INCLINE", "VEDIO", "OTHER"]
}

//////////////////////// RESOURCE UPLOAD NEEDED
export const resourceUploadNeeded = {
    'model': {
        'DEM': [
            // {
            //     label: '文件名',
            //     enName: 'name',
            //     value: '',
            //     type: 'input',
            // },
            {
                label: '年份',
                enName: 'year',
                value: '2023',
                type: 'input',
                required: true
            },
            {
                label: '月份',
                enName: 'month',
                value: '04',
                type: 'input',
                required: true
            },
            {
                label: '工况集',
                enName: 'set',
                value: 'standard',
                type: 'input',
                required: true
            },
            {
                label: '备注',
                enName: 'description',
                value: '',
                type: 'input',
                required: false
            },
            {
                label: '地形文件',
                enName: 'file',
                value: null,
                type: 'file',
                required: true
            }
        ],
        'Config': [
            {
                label: '文件名',
                enName: 'name',
                value: '',
                required: true,
                type: 'input',
            },
            {
                label: '参数类型',
                enName: 'type',
                value: '',
                type: 'radios',
                radioLabelArray: ['造床流量系数', '权重阈值参数', '岸段边界文件'],
                required: true,
                radioValueArray: ['PQ', 'template', 'boundary']
            },
            {
                label: '模型配置文件',
                enName: 'file',
                value: null,
                type: 'file',
                required: true
            }
        ],
        'Section': [
            {
                label: '年份',
                enName: 'year',
                value: '2023',
                type: 'input',
                required: true
            },
            {
                label: '月份',
                enName: 'month',
                value: '04',
                type: 'input',
                required: true
            },
            {
                label: '工况集',
                enName: 'set',
                value: 'standard',
                type: 'input',
                required: true
            },
            {
                label: '备注',
                enName: 'description',
                value: '',
                type: 'input',
                required: false
            },
            {
                label: '断面文件',
                enName: 'file',
                value: null,
                type: 'file',
                required: true
            }
        ],
        'Hydrodynamic': [
            // {
            //     label: '文件名',
            //     enName: 'name',
            //     value: '',
            //     type: 'input',
            // },
            {
                label: '年份',
                enName: 'year',
                value: '2023',
                type: 'input',
                required: true
            },
            {
                label: '月份',
                enName: 'month',
                value: '04',
                type: 'input',
                required: true
            },
            {
                label: '工况集',
                enName: 'set',
                value: 'standard',
                type: 'input',
                required: true
            },
            {
                label: '备注',
                enName: 'description',
                value: '',
                type: 'input',
                required: false
            },
            {
                label: '水动力工况文件',
                enName: 'file',
                value: null,
                type: 'file',
                required: true
            }
        ],
        'Boundary': [
            // {
            //     label: '文件名',
            //     enName: 'name',
            //     value: '',
            //     type: 'input',
            // },
            {
                label: '年份',
                enName: 'year',
                value: '2023',
                type: 'input',
                required: true
            },
            {
                label: '月份',
                enName: 'month',
                value: '04',
                type: 'input',
                required: true
            },
            {
                label: '工况集',
                enName: 'set',
                value: 'standard',
                type: 'input',
                required: true
            },
            {
                label: '备注',
                enName: 'description',
                value: '',
                type: 'input',
                required: false
            },
            {
                label: '边界矢量文件',
                enName: 'file',
                value: null,
                type: 'file',
                required: true
            }
        ],
    },
    'visual': {
        'DEM': [

        ],
        'Vector': [
            {
                label: '名称',
                enName: 'name',
                value: '',
                type: 'input',
                required: true
            },
            {
                label: '几何类型',
                enName: 'type',
                value: '',
                type: 'radios',
                radioLabelArray: ['点', '线', '面', '注记'],
                required: true,
                radioValueArray: ['point', 'line', 'polygon', 'symbol']
            },
            {
                label: '字段',
                value: '',
                enName: 'fields',
                type: 'input',
                required: false
            },
            // {
            //     label: '配置文件(Json)',
            //     enName: 'config',
            //     value: '',
            //     type: 'file',
            // },
            {
                label: '矢量文件(Shapfile)',
                enName: 'file',
                value: '',
                type: 'file',
                required: true
            }
        ]
    },
    'device': {
        'GNSS': [
            {
                label: '设备配置文件',
                enName: 'file',
                value: '',
                type: 'file',
                required: true
            },
        ],
        'MENOMETER': [
            {
                label: '设备配置文件',
                enName: 'file',
                value: '',
                type: 'file',
                required: true
            },
        ],
        'STRESS': [
            {
                label: '设备配置文件',
                enName: 'file',
                value: '',
                type: 'file',
                required: true
            },
        ],
        'INCLINE': [
            {
                label: '设备配置文件',
                enName: 'file',
                value: '',
                type: 'file',
                required: true
            },
        ],
        'VEDIO': [
            {
                label: '设备配置文件',
                enName: 'file',
                value: '',
                type: 'file',
                required: true
            },
        ],
        'OTHER': [
            {
                label: '设备配置文件',
                enName: 'file',
                value: '',
                type: 'file',
                required: true
            },
        ],
    }
}

export const resourceUploadTitle = {
    'model': {
        'DEM': '地形数据',
        'Config': '模型参数',
        'Section': '断面数据',
        'Hydrodynamic': '预算工况数据',
        'Boundary': '岸段边界数据',
    },
    'visual': {
        'DEM': '栅格数据',
        'Vector': '矢量数据'
    },
    'device': {
        'GNSS': 'GNSS设备',
        'MENOMETER': '水压力计设备',
        'STRESS': '应力桩设备',
        'INCLINE': '测斜仪设备',
        'VEDIO': '监控设备',
        'OTHER': '其他设备'
    }
}

export const fileTypeDict = {
    'model': {
        'DEM': 'tiff',
        // 'DEM': 'txt',
        'Config': 'json',
        'Section': 'shapefile',
        'Hydrodynamic': 'hydrodynamic',
        'Boundary': 'geojson',
    }
}

export const uploadDescriptionMap = {
    'model': {
        'DEM': '请上传打包为ZIP的<em>TIFF地形文件</em>，文件应<em>以年份月份命名</em>，如：202304.zip',
        'Config': [
            '请上传打包为ZIP的<em>JSON模型参数文件</em>，文件应<em>与配置文件同名</em>，如：pq.zip, template.zip',
            '请上传打包为ZIP的<em>ESRI Shapefile</em>或<em>GeoJSON文件</em>，文件内容应至少包含shp，dbf，shx等文件'
        ],
        'Section': '请上传打包为ZIP的<em>ESRI Shapefile文件</em>，文件内容应至少包含shp，dbf，shx等文件',
        'Hydrodynamic': '请上传打包为ZIP的<em>预算水动力工况文件</em>，文件内容应包含fort.14, fort.63, fort.64等文件',
        'Boundary': '请上传打包为ZIP的<em>ESRI Shapefile</em>或<em>GeoJSON文件</em>，文件内容应至少包含shp，dbf，shx等文件',
    },
    'visual': {
        'DEM': '',
        'Vector': '请上传打包为ZIP的<em>ESRI Shapefile文件</em>，文件内容应至少包含shp，dbf，shx等文件'
    },
    'device': {
        'GNSS': '请上传<em>设备配置JSON文件</em>，包含bank,aspect,deviceId,deviceName,type,longitude,latitude,elevation字段',
        'MENOMETER': '请上传<em>设备配置JSON文件</em>，包含bank,aspect,deviceId,deviceName,type,longitude,latitude,elevation字段',
        'STRESS': '请上传<em>设备配置JSON文件</em>，包含bank,aspect,deviceId,deviceName,type,longitude,latitude,elevation字段',
        'INCLINE': '请上传<em>设备配置JSON文件</em>，包含bank,aspect,deviceId,deviceName,type,longitude,latitude,elevation字段',
        'VEDIO': '请上传<em>设备配置JSON文件</em>，包含bank,aspect,deviceId,deviceName,type,longitude,latitude,elevation字段',
        'OTHER': '请上传<em>设备配置JSON文件</em>，包含bank,aspect,deviceId,deviceName,type,longitude,latitude,elevation字段'
    }
}

export const deviceCategoryUploadInfo = {
    // "bank": {
    //     label: '所属银行',
    //     value: '',
    //     mappedMonitorInfoField: 'bankId',
    // },
    // "aspect": {
    //     label: '设备类型',
    //     value: '',
    // },
    "deviceId": {
        label: '设备ID',
        value: '',
        mappedMonitorInfoField: 'machineId',
        type: 'input'
    },
    "deviceName": {
        label: '设备名称',
        value: '',
        mappedMonitorInfoField: 'name',
        type: 'input'
    },
    "type": {
        label: '设备类型',
        value: '',
        mappedMonitorInfoField: 'type',
        type: 'radios',
        radioLabelArray: ['GNSS', '孔隙水压力计', "应力桩", "测斜仪", "监控视频"],
        radioValueArray: ['1', '3', "2", "4", "6"]
    },
    "longitude": {
        label: '经度(°)',
        value: 120.55,
        type: 'input',
        mappedMonitorInfoField: 'longitude',
    },
    "latitude": {
        label: '纬度(°)',
        value: 32.04,
        type: 'input',
        mappedMonitorInfoField: 'latitude',
    },
    "elevation": {
        label: '安装高程(m)',
        value: 10.2,
        type: 'input',
        mappedMonitorInfoField: 'elevation',
    }
}