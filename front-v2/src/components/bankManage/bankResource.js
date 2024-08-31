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

export const mzsBankBasicInfo = [
    { key: '预警级别', val: 'Ⅰ级', type: ['half', 'left'] },
    {
        key: '中心坐标',
        val: '120.54064,32.04179',
        type: ['half', 'two-row', 'right'],
        splitter: ' ',
    },
    {
        key: '情况介绍',
        val: '民主沙右缘位于长江澄通河段，分属泰州市的靖江市和南通市的如皋市，是水利部长江委、省市县的Ⅰ级预警岸段。近年民主沙南侧的浏海沙水道深槽坐弯、深泓左偏，致来民主沙右缘持续冲退，影响局部河势稳定。同时民主沙为张皋过江通道拟建桥址所在地。',
        type: ['single', 'long-text'],
    },
    {
        key: '管理单位',
        val: '靖江市水利局/如皋市水利局',
        type: ['half', 'left'],
    },
    {
        key: '管理单位联系方式',
        val: 'xxxxxxxxxxx',
        type: ['half', 'right'],
    },
]








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