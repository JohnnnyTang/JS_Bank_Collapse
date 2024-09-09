import { ref } from 'vue'
export const defaultBankBasicInfo = [
    { key: '预警级别', val: '', type: ['half', 'left'] },
    {
        key: '中心坐标',
        val: '',
        type: ['half', 'two-row', 'right'],
        splitter: ' ',
    },
    {
        key: '基本情况',
        val: '',
        type: ['single', 'long-text'],
    },
    {
        key: '管理单位',
        val: '',
        type: ['half', 'left'],
    },
    {
        key: '管理单位联系方式',
        val: '',
        type: ['half', 'right'],
    },
]

export const defaultBankResource = {
    '模型资源管理': [
        {
            key: '岸段地形资源',
            resourceList: []
        },
        {
            key: '水动力模型资源',
            resourceList: []
        },
        {
            key: '岸段边界资源',
            resourceList: []
        },
        {
            key: '岸段配置资源',
            resourceList: []
        },
    ],
    '可视化资源管理': [
        {
            key: '栅格可视化资源',
            resourceList: []
        },
        {
            key: '矢量可视化资源',
            resourceList: []
        },
        {
            key: '其他',
            resourceList: []
        },
    ],
    '设备资源管理': [
        {
            key: 'GNSS设备',
            resourceList: []
        },
        {
            key: '孔隙水压力计设备',
            resourceList: []
        },
        {
            key: '应力桩设备',
            resourceList: []
        },
        {
            key: '测斜仪设备',
            resourceList: []
        },
    ]
}

export const defaultBankResouceList = [
    {
        key: '岸段地形资源',
        resourceList: []
    },
    {
        key: '水动力模型资源',
        resourceList: []
    },
    {
        key: '岸段边界资源',
        resourceList: []
    },
    {
        key: '岸段配置资源',
        resourceList: []
    },
]

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

export const typeDict = ['model', 'visual', 'device']

export const resourceTypeDict = {
    'model': ['DEM', 'Hydrodynamic', 'Boundary', 'Config'],
    'visual': ['DEM', 'Vector', 'Other'],
    'device': []
}