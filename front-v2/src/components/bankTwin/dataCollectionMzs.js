///// JIA XING API

/////////////////////////////////BankBasicInfo/////////////////////////////////
const getBasicInfo = () => {
    return {
        title: '民主沙右缘示范段',
        预警级别: 'Ⅰ级',
        监测长度: '全长7公里',
        布设监测设备: '32台',
        持续监测时间: distanceOpenTime('2024-04-20')
    }
}
//获取持续监测时间
function distanceOpenTime(showTime) {
      const currentTime = new Date()
      const targetTime = new Date(showTime)
      // 计算时间差（以毫秒为单位）
      const timeDiff = currentTime.getTime() - targetTime.getTime()
      // 将时间差转换为小时、分钟和秒数
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      let ret = `${days} 天`
      return ret
    }
/////////////////////////////////BankWarnDetail/////////////////////////////////
const getDeviceIdMap = () => {
    return {
        'CL-01': 'MZS120.51749289_32.04059243_1',
        'CL-02': 'MZS120.51977143_32.04001152_1',
        'CL-03': 'MZS120.52557975_32.03825056_1',
        'CL-04': 'MZS120.52660704_32.03676583_1',
        'CL-05': 'MZS120.53334877_32.03227055_1',
        'CL-06': 'MZS120.54599538_32.02837993_1',
        'CL-07': 'MZS120.55327892_32.02707923_1',
        'CL-08': 'MZS120.55649757_32.02592404_1',
        'CL-09': 'MZS120.56334257_32.02298144_1',
        'CL-10': 'MZS120.56944728_32.02070961_1',
        'KX-01': 'MZS120.51726088_32.04054582_3',
        'KX-02': 'MZS120.51738292_32.04054923_3',
        'KX-03': 'MZS120.51749021_32.04053105_3',
        'KX-04': 'MZS120.51957026_32.04008655_3',
        'KX-05': 'MZS120.51967889_32.04004108_3',
        'KX-06': 'MZS120.51986665_32.03998992_3',
        'KX-07': 'MZS120.52557975_32.03825056_3',
        'KX-08': 'MZS120.52565217_32.03813574_3',
        'KX-09': 'MZS120.52566826_32.03799363_3',
        'YL-01': 'MZS120.513203_32.042733_2',
        'YL-02': 'MZS120.515433_32.04231_2',
        'YL-03': 'MZS120.521221_32.040331_2',
        'YL-04': 'MZS120.529078_32.034385_2',
        'YL-05': 'MZS120.541648_32.030524_2',
        'YL-06': 'MZS120.548925_32.029361_2',
        'YL-07': 'MZS120.552209_32.028149_2',
        'CX-01': 'MZS120.51967889_32.04004108_4',
        'CX-02': 'MZS120.51986665_32.03998992_4',
        'CX-03': 'MZS120.52557975_32.03825056_4',
        'CX-04': 'MZS120.52565217_32.03813574_4',
        'CX-05': 'MZS120.52566826_32.03799363_4',
        'CX-06': 'MZS120.51726088_32.04054582_4',
        'CX-07': 'MZS120.51738292_32.04054923_4',
        'CX-08': 'MZS120.51749021_32.04053105_4',
        'CX-09': 'MZS120.51957026_32.04008655_4',
        // 'GX-01': 'MZS120_32',  //分布式光纤
    }
}

const getDeviceIdPlaceMap = () => {
    return {
        '': '暂无',
        'MZS120.51749289_32.04059243_1': 'MZ02顺堤',
        'MZS120.51977143_32.04001152_1': 'MZ03顺堤尾',
        'MZS120.52557975_32.03825056_1': 'MZ04江滩办',
        'MZS120.52660704_32.03676583_1': 'MZ05小港池',
        'MZS120.53334877_32.03227055_1': 'MZ06张靖皋桥位',
        'MZS120.54599538_32.02837993_1': 'MZ08海事码头',
        'MZS120.55327892_32.02707923_1': 'MZ09码头下游',
        'MZS120.55649757_32.02592404_1': 'MZ10雷达站',
        'MZS120.56334257_32.02298144_1': 'MZ11主路',
        'MZS120.56944728_32.02070961_1': 'MZ12沙尾',
        'MZS120.51726088_32.04054582_3': 'MZ02顺堤',
        'MZS120.51738292_32.04054923_3': 'MZ02顺堤',
        'MZS120.51749021_32.04053105_3': 'MZ02顺堤',
        'MZS120.51957026_32.04008655_3': 'MZ03顺堤尾',
        'MZS120.51967889_32.04004108_3': 'MZ03顺堤尾',
        'MZS120.51986665_32.03998992_3': 'MZ03顺堤尾',
        'MZS120.52557975_32.03825056_3': 'MZ04江滩办',
        'MZS120.52565217_32.03813574_3': 'MZ04江滩办',
        'MZS120.52566826_32.03799363_3': 'MZ04江滩办',
        'MZS120.513203_32.042733_2': 'MZ02顺堤',
        'MZS120.515433_32.04231_2': 'MZ03顺堤尾',
        'MZS120.521221_32.040331_2': 'MZ04江滩办',
        'MZS120.529078_32.034385_2': 'MZ06张靖皋桥位',
        'MZS120.541648_32.030524_2': 'MZ08海事码头',
        'MZS120.548925_32.029361_2': 'MZ09码头下游',
        'MZS120.552209_32.028149_2': 'MZ10雷达站',
        'MZS120.51967889_32.04004108_4': 'MZ02顺堤',
        'MZS120.51986665_32.03998992_4': 'MZ02顺堤',
        'MZS120.52557975_32.03825056_4': 'MZ02顺堤',
        'MZS120.52565217_32.03813574_4': 'MZ03顺堤尾',
        'MZS120.52566826_32.03799363_4': 'MZ03顺堤尾',
        'MZS120.51726088_32.04054582_4': 'MZ03顺堤尾',
        'MZS120.51738292_32.04054923_4': 'MZ04江滩办',
        'MZS120.51749021_32.04053105_4': 'MZ04江滩办',
        'MZS120.51957026_32.04008655_4': 'MZ04江滩办',
    }
}

const getButtonInfoList = () => {
    return [
        {
            index: 0,
            name: '南通段预案',
            url: import.meta.env.BASE_URL + '/pdf/11.长江南通段民主沙撤离预案.pdf',
            pageNum: '29',
        },
        {
            index: 1,
            name: '靖江段预案',
            url: import.meta.env.BASE_URL + '/pdf/30.靖江市民主沙行洪运用预案.pdf',
            pageNum: '41',
        },
        {
            index: 2,
            name: '重点防御预案',
            url: import.meta.env.BASE_URL + '/pdf/75靖江市民主沙(右缘)险工段重点防御预案.pdf',
            pageNum: '63',
        },
    ]
}

const getDeviceTypeList = () => {
    return [
        'GNSS', 
        '应力桩', 
        '水压力计', 
        '测斜仪',
        // '摄像头',
        // '分布式光纤',
    ]
}

const getBankWarnDetail = () => {
    return [
        {   风险点负责人: '高卫南', 
            责任人联系方式: '15161059955', 
            巡查队伍: '靖江市西来镇巡堤查险队', 
            巡查队负责人: '刘宏江', 
            巡查队联系方式: '13921738638', 
            抢险队伍: '江苏龙源水利工程有限公司抢险队', 
            抢险队责任人: '吴明灿', 
            抢险队联系方式: '13815981186'
        },
    ]
}
/////////////////////////////////DeviceWarn/////////////////////////////////
const getSectionClassColorMap = () => {
    return {
        警告: 'warning',
        预警: 'pre-warning',
        关注: 'attention',
        普通: 'normal',
        统计: 'all',
    }
}

const getStatusTextMap = () => {
    return [
        '正常', 
        '关注', 
        '警告', 
        '危险',
    ]
}

const getStatusColorMap = () => {
    return [
        '#13a500', 
        '#003a92', 
        '#be7200', 
        '#a50101',
    ]
}

const getColorGradientMap = () => {
    return [
        ['#A7EBBC', '#12A734'],
        ['#00ACFF', '#0212a1'],
        ['#FFE56C', '#e48b18'],
        ['#FF8629', '#b11a06'],
    ]
}
/////////////////////////////////RealtimeStatus/////////////////////////////////
const getDeviceStatus = () => {
    return [
        { name: '位移测量站', count: 10, time: '2024', freq: '10分钟' },
        { name: '应力桩', count: 7, time: '2024', freq: '1分钟' },
        { name: '孔隙水压力计', count: 9, time: '2024', freq: '1小时' },
        { name: '测斜仪', count: 9, time: '2024', freq: '1小时' },
        { name: '分布式光纤', count: 1, time: '2024', freq: '1小时' },//分布式光纤的更新频率暂不确定
        // { name: '视频监控', count: 3, time: '2024', freq: '实时' },
    ]
}

const getDeviceListMap = () => {
    return {
        位移测量站: [
            'CL-01',
            'CL-02',
            'CL-03',
            'CL-04',
            'CL-05',
            'CL-06',
            'CL-07',
            'CL-08',
            'CL-09',
            'CL-10',
        ],
        测斜仪: [
            'CX-01',
            'CX-02',
            'CX-03',
            'CX-04',
            'CX-05',
            'CX-06',
            'CX-07',
            'CX-08',
            'CX-09',
        ],
        孔隙水压力计: [
            'KX-01',
            'KX-02',
            'KX-03',
            'KX-04',
            'KX-05',
            'KX-06',
            'KX-07',
            'KX-08',
            'KX-09',
        ],
        应力桩: [
            'YL-01',
            'YL-02',
            'YL-03',
            'YL-04',
            'YL-05',
            'YL-06',
            'YL-07'
        ],
        // 分布式光纤: [
        //     'GX-01'  //分布式光纤
        // ],
    }
}

const getDeviceTypeNameMap = () => {
    return {
        位移测量站: 'gnss',
        测斜仪: 'inclinometer',
        孔隙水压力计: 'manometer',
        应力桩: 'stress',
        // 分布式光纤: 'fiber', //分布式光纤
    }
}

const getDeviceTypeErrorMap = () => {
    return {
        位移测量站: 5,
        测斜仪: 3,
        孔隙水压力计: 0.2,
        应力桩: 40,
        // 分布式光纤: 1,  //分布式光纤
    }
}

const getDeviceTypeTimeMap = () => {
    return {
        位移测量站: {
            timeUnit: 'day',
            timeCount: 60,
            realTimeCount: 1,
            realTimeUnit: 'hour',
            freq: '10分钟',
        },
        测斜仪: {
            timeUnit: 'day',
            timeCount: 3,
            realTimeCount: 6,
            realTimeUnit: 'hour',
            freq: '1小时',
        },
        孔隙水压力计: {
            timeUnit: 'day',
            timeCount: 3,
            realTimeCount: 6,
            realTimeUnit: 'hour',
            freq: '1小时',
        },
        应力桩: {
            timeUnit: 'hour',
            timeCount: 24,
            realTimeCount: 1,
            realTimeUnit: 'hour',
            freq: '1分钟',
        },
        // 分布式光纤: {              //分布式光纤
        //     timeUnit: 'hour',
        //     timeCount: 3,
        //     realTimeCount: 6,
        //     realTimeUnit: 'hour',
        //     freq: '1小时',
        // },
    }
}

const getVideoList = () => {
    return [
        {
            name: '民主沙海事码头监控',
            position: '32.0316674, 120.5402574',
            deviceId: 'FB5033035',
            // videoUrl: `https://open.ys7.com/ezopen`,
            videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=`,
            order: 0,
            presetPt: [
                { name: '上游岸段', status: 'normal' },
                { name: '下游岸段', status: 'normal' },
                { name: 'CL-06', status: 'normal' },
                { name: '海事码头', status: 'normal' },
            ],
            warn: false,
            key: 0,
        },
        {
            name: '民主沙靖江市江滩办事处外堤监控',
            position: '32.0381061, 120.5263473',
            deviceId: 'FB5033037',
            // videoUrl: `https://open.ys7.com/ezopen`,
            videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.live&autoplay=1&accessToken=`,
            order: 1,
            presetPt: [
                { name: '下游岸段', status: 'normal' },
                { name: '上游岸段', status: 'normal' },
                { name: 'CL-04', status: 'normal' },
                { name: '小港池', status: 'normal' },
            ],
            warn: false,
            key: 1,
        },
        {
            name: '民主沙上游围堤监控',
            position: '32.0432963, 120.5122242',
            deviceId: 'FB5033036',
            // videoUrl: `https://open.ys7.com/ezopen`,
            videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.live&autoplay=1&accessToken=`,
            order: 2,
            presetPt: [
                { name: '下游岸段', status: 'normal' },
                { name: '上游岸段', status: 'normal' },
                { name: 'CL-02', status: 'normal' },
                { name: 'JZ-01', status: 'normal' },
            ],
            warn: false,
            key: 2,
        },
    ]
}

const getZoomFuncList = () => {
    return [
        { label: '放大', func: '' },
        { label: '缩小', func: '' },
        { label: '远焦距', func: '' },
        { label: '近焦距', func: '' },
    ]
}

const getControlParam = () => {
    return {
        deviceSerial: 'FB5033035',
        channelNo: '1',
        direction: '9',
        speed: 1,
    }
}

const getPresetParam = () => {
    return {
        deviceSerial: 'FB5033035',
        channelNo: '1',
        index: '1',
    }
}

const getFunctionIndexList = () => {
    return [
        0, 1, 2, 3, 8, 9, 10, 11
    ]
}
/////////////////////////////////RealtimeVideo/////////////////////////////////
const getToken = () => {
    return 'at.aiesix6wdmxhqgov73ss8cwi1cojuwbk-5j41zyk35u-04bzsju-xgfi1zltr'
}
/////////////////////////////////SectionRisk/////////////////////////////////
const getDataset = () => {
    return {
        dimensions: ['name', 'score'],
        source: [
            ['危险', 3],
            ['警告', 2],
            ['关注', 5],
            ['正常', 16],
        ],
    }
}
/////////////////////////////////SectionStable/////////////////////////////////
const getStableStatus = () => {
    return [
        [3, 0, 0, 0],
        [8, 6, 0, 0],
        [48, 48, 47, 36],
        [42, 46, 53, 64],
    ]
}

const getStableStatusLineData = () => {
    return [
        [8, 6, 5, 5, 3, 0, 0, 0],
        [13, 13, 12, 10, 8, 6, 0, 0],
        [52, 48, 48, 48, 48, 48, 47, 36],
        [27, 33, 35, 37, 41, 46, 53, 64],
    ]
}
/////////////////////////////////threeDdevice/////////////////////////////////
const getStationMap = () => {
    return {
        'MZS': '民主沙'
    }
}

const getNameCodeMap = () => {
    return {
        '视频01': '',
        '视频02': '',
        '视频03': '',
        '应力桩01': 'MZS120.513203_32.042733_2',
        '应力桩02': 'MZS120.515433_32.04231_2',
        '应力桩03': 'MZS120.521221_32.040331_2',
        '应力桩04': 'MZS120.529078_32.034385_2',
        '应力桩05': 'MZS120.541648_32.030524_2',
        '应力桩06': 'MZS120.548925_32.029361_2',
        '应力桩07': 'MZS120.552209_32.028149_2',
        'GNSS测量01': 'MZS120.51749289_32.04059243_1',
        'GNSS测量02': 'MZS120.51977143_32.04001152_1',
        'GNSS测量03': 'MZS120.52557975_32.03825056_1',
        'GNSS测量04': 'MZS120.52660704_32.03676583_1',
        'GNSS测量05': 'MZS120.53334877_32.03227055_1',
        'GNSS测量06': 'MZS120.54599538_32.02837993_1',
        'GNSS测量07': 'MZS120.55327892_32.02707923_1',
        'GNSS测量08': 'MZS120.55649757_32.02592404_1',
        'GNSS测量09': 'MZS120.56334257_32.02298144_1',
        'GNSS测量10': 'MZS120.56944728_32.02070961_1',
        'GNSS基准01': '',
        'GNSS基准02': '',
        'GNSS基准03': '',
        '测斜水压01': 'MZS120.51967889_32.04004108_4',//only 测斜
        '测斜水压02': 'MZS120.51986665_32.03998992_4',
        '测斜水压03': 'MZS120.52557975_32.03825056_4',
        '测斜水压04': 'MZS120.52565217_32.03813574_4',
        '测斜水压05': 'MZS120.52566826_32.03799363_4',
        '测斜水压06': 'MZS120.51726088_32.04054582_4',
        '测斜水压07': 'MZS120.51738292_32.04054923_4',
        '测斜水压08': 'MZS120.51749021_32.04053105_4',
        '测斜水压09': 'MZS120.51957026_32.04008655_4',
    }
}

/////////////////////////////////WarnHistoryTable/////////////////////////////////
const getWarnHistoryList = () => {
    return [
        {
            id: '暂无',
            warnTime: '暂无',
            place: '暂无',
            ifDealt: '是',
            deviceId: '',
        },
    ]
}
