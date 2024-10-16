import { ref } from 'vue'

/////////////////////////// BANK BASIC INFO STYLE OBJECT
export const defaultBankBasic_Style_Info = [
    {
        key: '预警级别',
        val: '',
        type: ['half', 'left'],
        necessary: false
    },
    {
        key: '中心坐标',
        val: '',
        type: ['half', 'two-row', 'right'],
        splitter: ' ', necessary: false
    },
    {
        key: '监测长度',
        val: '',
        type: ['half', 'left'],
        necessary: false
    },
    {
        key: '监测起始时间',
        val: '',
        type: ['half', 'right'],
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
            type: ['half', 'left'],
            necessary: false
        },
        {
            key: '中心坐标',
            val: basicInfo["center"],
            type: ['half', 'right'],
            splitter: ' ', necessary: false
        },
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
            type: ['half', 'left'], necessary: false
        },
        {
            key: '管理单位联系方式',
            val: basicInfo["management"]["contact"],
            type: ['half', 'right'], necessary: false
        }
    ]
}


////////////////////////// BANK RESOURCE TABLE COLUMN
export const defaultTableColumns = {
    '模型资源管理': [
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
    '可视化资源管理': [
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
    '设备资源管理': [
        {
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
        },
    ]
}

///////////////////////// BANK RESOURCE DICTS
export const typeDict = ['model', 'visual', 'device']

export const categoryNameDict = ['模型资源管理', '可视化资源管理', '设备资源管理']

export const resourceTypeDict = {
    // 'model': ['DEM', 'Hydrodynamic', 'Boundary', 'Config'],
    'model': ['DEM', 'Config', 'Boundary', 'Hydrodynamic'],
    'visual': ['DEM', 'Vector'],
    'device': ['GNSS', 'MENOMETER', "STRESS", "INCLINE", "VEDIO"]
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
            },
            {
                label: '模型配置文件',
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
    }
}

export const resourceUploadTitle = {
    'model': {
        'DEM': '地形数据',
        'Config': '配置数据',
        'Boundary': '岸段边界数据',
        'Hydrodynamic': '预算工况数据',
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
        'VEDIO': '监控设备'
    }
}

export const fileTypeDict = {
    'model': {
        'DEM': 'tiff',
        // 'DEM': 'txt',
        'Config': 'json',
        'Boundary': 'geojson',
        'Hydrodynamic': 'hydrodynamic',
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