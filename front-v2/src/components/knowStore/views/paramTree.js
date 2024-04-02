const paramTree = {
    id: 'root',
    label: '江苏段崩岸\n指标体系',
    children: [
        {
            id: 'p1',
            label: '水流动力\n因子',
            children: [
                {
                    id: 'p1-1',
                    label: '水流造床\n流量当量',
                },
                {
                    id: 'p1-2',
                    label: '三日平均\n水位变幅',
                },
                {
                    id: 'p1-3',
                    label: '流速指标',
                },
                {
                    id: 'p1-4',
                    label: '河道二次流',
                },
            ],
        },
        {
            id: 'p2',
            label: '河床演变\n因子',
            children: [
                {
                    id: 'p2-1',
                    label: '深泓离岸\n相对距离',
                },
                {
                    id: 'p2-2',
                    label: '近岸冲刷\n幅度',
                },
                {
                    id: 'p2-3',
                    label: '近岸滩槽\n高差',
                },
                {
                    id: 'p2-4',
                    label: '汊道分流比',
                },
            ],
        },
        {
            id: 'p3',
            label: '岸坡特征\n因子',
            children: [
                {
                    id: 'p3-1',
                    label: '土体组成',
                },
                {
                    id: 'p3-2',
                    label: '水下岸坡坡度\n抗滑稳定系数',
                },
                {
                    id: 'p3-3',
                    label: '渗流坡降',
                },
                {
                    id: 'p3-4',
                    label: '土体沉降\n位移',
                },
            ],
        },
        {
            id: 'p4',
            label: '人类活动\n因子',
            children: [
                {
                    id: 'p4-1',
                    label: '岸坡防护\n方量',
                },
                {
                    id: 'p4-2',
                    label: '突加荷载',
                },
                {
                    id: 'p4-3',
                    label: '近岸来沙',
                },
            ],
        },
    ],
}

export { paramTree }
