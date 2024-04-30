const paramTree = {
    id: 'root',
    label: '江苏段崩岸\n指标体系',
    layer: 1.5,
    class: 1,
    children: [
        {
            id: 'p1',
            label: '水流动力\n因子',
            layer: 2,
            class: 2,
            children: [
                {
                    id: 'p1-1',
                    label: '水流造床\n流量当量',
                    layer: 3,
                    class: 2,
                },
                {
                    id: 'p1-2',
                    label: '三日平均\n水位变幅',
                    layer: 3,
                    class: 2,
                },
                {
                    id: 'p1-3',
                    label: '流速指标',
                    layer: 3,
                    class: 2,
                },
                {
                    id: 'p1-4',
                    label: '河道\n二次流',
                    layer: 3,
                    class: 2,
                },
            ],
        },
        {
            id: 'p2',
            label: '河床演变\n因子',
            layer: 2,
            class: 3,
            children: [
                {
                    id: 'p2-1',
                    label: '深泓离岸\n相对距离',
                    layer: 3,
                    class: 3,
                },
                {
                    id: 'p2-2',
                    label: '近岸冲刷\n幅度',
                    layer: 3,
                    class: 3,
                },
                {
                    id: 'p2-3',
                    label: '近岸滩槽\n高差',
                    layer: 3,
                    class: 3,
                },
                {
                    id: 'p2-4',
                    label: '汊道\n分流比',
                    layer: 3,
                    class: 3,
                },
            ],
        },
        {
            id: 'p3',
            label: '岸坡特征\n因子',
            layer: 2,
            class: 4,
            children: [
                {
                    id: 'p3-1',
                    label: '土体组成',
                    layer: 3,
                    class: 4,
                },
                {
                    id: 'p3-2',
                    label: '水下岸坡坡度\n抗滑稳定系数',
                    layer: 3,
                    class: 4,
                },
                {
                    id: 'p3-3',
                    label: '渗流坡降',
                    layer: 3,
                    class: 4,
                },
                {
                    id: 'p3-4',
                    label: '土体沉降\n位移',
                    layer: 3,
                    class: 4,
                },
            ],
        },
        {
            id: 'p4',
            label: '人类活动\n因子',
            layer: 2,
            class: 5,
            children: [
                {
                    id: 'p4-1',
                    label: '岸坡防护\n方量',
                    layer: 3,
                    class: 5,
                },
                {
                    id: 'p4-2',
                    label: '突加荷载',
                    layer: 3,
                    class: 5,
                },
                {
                    id: 'p4-3',
                    label: '近岸来沙',
                    layer: 3,
                    class: 5,
                },
            ],
        },
    ],
}

const paramMatrixList = [
    [
        {
            name: '关键指标',
            model: '崩岸风险预警模型',
            timeString: '2024-04-01',
        },
        {
            name: '分项权重',
            model: '崩岸风险预警模型',
            timeString: '2024-04-02',
        },
        {
            name: '分级阈值',
            model: '崩岸风险预警模型',
            timeString: '2024-04-02',
        },
        {
            name: '实时预警阈值',
            model: '崩岸风险预警模型',
            timeString: '2024-04-02',
        },
    ],
    [
        {
            name: '崩岸风险预警模型-三小时预报参数',
            model: '崩岸风险预警模型',
            timeString: '2024-04-01',
        },
        {
            name: '崩岸风险预警模型-一日预测参数',
            model: '崩岸风险预警模型',
            timeString: '2024-04-02',
        },
        {
            name: '崩岸风险预警模型-三日预测参数',
            model: '崩岸风险预警模型',
            timeString: '2024-04-02',
        },
    ],
    [
        {
            name: '崩岸风险预警模型-特大洪水预演参数',
            model: '崩岸风险预警模型',
            timeString: '2024-04-01',
        },
    ],
    // 
    [
        {
            name: '分层土体内摩擦角',
            model: '土体变形分析模型',
            timeString: '2024-04-01',
        },
        {
            name: '坡脚冲刷曼宁系数',
            model: '土体变形分析模型',
            timeString: '2024-04-02',
        },
        {
            name: '分层土体粘聚力',
            model: '土体变形分析模型',
            timeString: '2024-04-02',
        },
        {
            name: '分层土体饱和容重',
            model: '土体变形分析模型',
            timeString: '2024-04-02',
        },
    ],
    [
        {
            name: '土体变形分析模型-三小时预报参数',
            model: '土体变形分析模型',
            timeString: '2024-04-01',
        },
        {
            name: '土体变形分析模型-一日预测参数',
            model: '土体变形分析模型',
            timeString: '2024-04-02',
        },
        {
            name: '土体变形分析模型-三日预测参数',
            model: '土体变形分析模型',
            timeString: '2024-04-02',
        },
    ],
    [
        {
            name: '土体变形分析模型-特大洪水预演参数',
            model: '土体变形分析模型',
            timeString: '2024-04-01',
        },
    ],
    //
    [
        {
            name: '数学模型糙率',
            model: '岸坡稳定分析模型',
            timeString: '2024-04-01',
        },
        {
            name: '紊动扩散系数',
            model: '岸坡稳定分析模型',
            timeString: '2024-04-02',
        },
        {
            name: '计算时间步长',
            model: '岸坡稳定分析模型',
            timeString: '2024-04-02',
        },
        {
            name: '断面提取距离',
            model: '岸坡稳定分析模型',
            timeString: '2024-04-02',
        },
    ],
    [
        {
            name: '岸坡稳定分析模型-三小时预报参数',
            model: '岸坡稳定分析模型',
            timeString: '2024-04-01',
        },
        {
            name: '岸坡稳定分析模型-一日预测参数',
            model: '岸坡稳定分析模型',
            timeString: '2024-04-02',
        },
        {
            name: '岸坡稳定分析模型-三日预测参数',
            model: '岸坡稳定分析模型',
            timeString: '2024-04-02',
        },
    ],
    [
        {
            name: '岸坡稳定分析模型-特大洪水预演参数',
            model: '岸坡稳定分析模型',
            timeString: '2024-04-01',
        },
    ],
    //

]

export { paramTree, paramMatrixList }
