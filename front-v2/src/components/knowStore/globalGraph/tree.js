
const paramTree = {
    id: 'root',
    label: '长江崩岸监测预警\n知识库',
    layer: 1.5,
    class: 1,
    type: 0,
    children: [
        {
            id: 'p1',
            label: '历史崩岸库',
            layer: 2,
            class: 2,
            type: 1,
            children: [
                {
                    id: 'p1-1',
                    label: '典型案例',
                    layer: 3,
                    class: 2,
                    children: [
                        {
                            id: 'p1-1-1',
                            label: '扬中118崩岸抢险案例',
                            layer: 4,
                            class: 2,
                            children: [
                                {
                                    id: 'p1-1-1-1',
                                    label: '扬中118崩岸抢险视频.mp4',
                                    layer: 5,
                                    class: 2,
                                    filePath: '/test.mp4'
                                },
                                {
                                    id: 'p1-1-1-2',
                                    label: '指南村崩岸.jpg',
                                    layer: 5,
                                    class: 2,
                                    filePath: '/BK0.png'
                                },
                                {
                                    id: 'p1-1-1-3',
                                    label: '扬中118抢险记录.pdf',
                                    layer: 5,
                                    class: 2,
                                    filePath: '/pdf/11.长江南通段民主沙撤离预案.pdf'
                                },
                                {
                                    id: 'p1-1-1-4',
                                    label: '长江扬中河段落成洲右汊口门右岸崩岸抢险工程浅析_薛晶.pdf',
                                    layer: 5,
                                    class: 2,
                                }
                            ],
                        },
                        {
                            id: 'p1-1-2',
                            label: '20120608世业洲迷笛广场崩岸案例',
                            layer: 4,
                            class: 2,
                            children: [
                                {
                                    id: 'p1-1-2-1',
                                    label: '世业洲崩塌位置示意图.pdf',
                                    layer: 5,
                                    class: 2,
                                },
                                {
                                    id: 'p1-1-2-2',
                                    label: '世业洲迷笛广扬.pdf',
                                    layer: 5,
                                    class: 2,
                                },
                            ],
                        },
                        {
                            id: 'p1-1-3',
                            label: '典型崩窝实例分析.pdf',
                            layer: 4,
                            class: 2,
                        },
                    ],
                },
                {
                    id: 'p1-2',
                    label: '监测报告',
                    layer: 3,
                    class: 2,
                    children: [
                        {
                            id: 'p1-2-1',
                            label: '长江镇扬河段和畅洲头工段汛前监测分析报告.pdf',
                            layer: 4,
                            class: 2,
                        },
                    ],
                },
                {
                    id: 'p1-3',
                    label: '情况汇总',
                    layer: 3,
                    class: 2,
                    children: [
                        {
                            id: 'p1-3-1',
                            label: '长江江苏段历史崩岸情况汇总.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p1-3-2',
                            label: '历史崩岸情况概览',
                            layer: 4,
                            class: 2,
                        }
                    ],
                },
            ],
        },
        {
            id: 'p2',
            label: '模型参数库',
            layer: 2,
            class: 3,
            children: [
                {
                    id: 'p2-1',
                    label: '风险评估因子阈值.pdf',
                    layer: 3,
                    class: 3,
                },
            ],
        },
        {
            id: 'p3',
            label: '相关规划库',
            layer: 2,
            class: 4,
            children: [
                {
                    id: 'p3-1',
                    label: '长江岸线规划',
                    layer: 3,
                    class: 4,
                    children: [
                        {
                            id: 'p3-1-1',
                            label: '澄通河段.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p3-1-2',
                            label: '江苏段.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p3-1-3',
                            label: '南京河段.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p3-1-4',
                            label: '扬中河段.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p3-1-5',
                            label: '长江口河段.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p3-1-6',
                            label: '镇扬河段.pdf',
                            layer: 4,
                            class: 2,
                        },
                    ],
                },
                {
                    id: 'p3-2',
                    label: '过江通道布局规划.pdf',
                    layer: 3,
                    class: 4,
                },
                {
                    id: 'p3-3',
                    label: '河道治理规划.pdf',
                    layer: 3,
                    class: 4,
                },
                {
                    id: 'p3-4',
                    label: '长江口综合整治开发规划.pdf',
                    layer: 3,
                    class: 4,
                },
            ],
        },
        {
            id: 'p4',
            label: '专家经验库',
            layer: 2,
            class: 5,
            children: [
                {
                    id: 'p4-1',
                    label: '行洪运用预案',
                    layer: 3,
                    class: 4,
                    children: [
                        {
                            id: 'p4-1-1',
                            label: '长江南通段民主沙行洪运用预案.pdf',
                            layer: 4,
                            class: 2,
                        },
                    ],
                },
                {
                    id: 'p4-2',
                    label: '重点防御预案',
                    layer: 3,
                    class: 4,
                    children: [
                        {
                            id: 'p4-2-1',
                            label: '江都区长江嘶马弯道重点防御预案20240207.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p4-2-2',
                            label: '孟家港险工段重点防御预案.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p4-2-3',
                            label: '南京市鼓楼区长江下关岸段重点防御预案.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p4-2-4',
                            label: '新太海汽渡~七丫口风险隐患段重点防御预案.pdf',
                            layer: 4,
                            class: 2,
                        },
                        {
                            id: 'p4-2-5',
                            label: '扬中市太平洲左缘（二墩港至胜利河）险工段重点防御预案.pdf',
                            layer: 4,
                            class: 2,
                        },
                    ],
                },
            ],
        },
    ],
}

const fileTree = [
    {
        id: 'p1',
        label: '历史场景与规划',
        layer: 2,
        children: [
            {
                id: 'p1-1',
                label: '典型案例',
                layer: 3,
                upload: true,
                children: [
                    {
                        id: 'p1-1-1',
                        label: '',
                        layer: 4,
                        fileCollection: [
                            {
                                id: 'p1-1-1-1',
                                label: '扬中118崩岸抢险视频.mp4',
                                filePath: '/test.mp4',
                                layer: 5,
                            },
                            {
                                id: 'p1-1-1-2',
                                label: '指南村崩岸.png',
                                filePath: '/BK0.png',
                                layer: 5,
                            },
                            {
                                id: 'p1-1-1-3',
                                label: '测试1.pdf',
                                filePath: '/pdf/11.长江南通段民主沙撤离预案.pdf',
                                layer: 5,
                            },
                            {
                                id: 'p1-1-1-4',
                                label: '测试2.pdf',
                                filePath: '/pdf/30.靖江市民主沙行洪运用预案.pdf',
                                layer: 5,
                            },
                            {
                                id: 'p1-1-2-1',
                                label: '20120608世业洲崩塌位置示意图.pdf',
                                layer: 5,
                            },
                            {
                                id: 'p1-1-2-2',
                                label: '20120608世业洲迷笛广扬.pdf',
                                layer: 5,
                            },
                            {
                                id: 'p1-1-3',
                                label: '典型崩窝实例分析.pdf',
                                layer: 4,
                            },
                        ]
                    },
                ],
            },
            {
                id: 'p1-2',
                label: '监测报告',
                layer: 3,
                upload: true,
                children: [
                    {
                        fileCollection: [
                            {
                                id: 'p1-2-1',
                                label: '长江镇扬河段和畅洲头工段汛前监测分析报告.pdf',
                                layer: 4,
                            },
                        ],
                    }
                ]
            },
            {
                id: 'p1-3',
                label: '情况汇总',
                layer: 3,
                upload: true,
                children: [
                    {
                        fileCollection: [
                            {
                                id: 'p1-3-1',
                                label: '长江江苏段历史崩岸情况汇总.pdf',
                                layer: 4,
                            }
                        ],
                    }
                ]

            },
            {
                id: 'p3',
                label: '相关规划库',
                layer: 3,
                class: 4,
                upload: true,
                children: [
                    {
                        fileCollection: [
                            {
                                id: 'p3-1',
                                label: '澄通河段长江岸线规划.pdf',
                                layer: 5,
                            },
                            {
                                id: 'p3-2',
                                label: '江苏段长江岸线规划.pdf',
                                layer: 5,
                            },
                            {
                                id: 'p3-3',
                                label: '南京河段长江岸线规划.pdf',
                                layer: 5,

                            },
                            {
                                id: 'p3-4',
                                label: '扬中河段长江岸线规划.pdf',
                                layer: 5,

                            },
                            {
                                id: 'p3-5',
                                label: '长江口河段长江岸线规划.pdf',
                                layer: 5,

                            },
                            {
                                id: 'p3-6',
                                label: '镇扬河段长江岸线规划.pdf',
                                layer: 5,

                            },
                            {
                                id: 'p3-7',
                                label: '过江通道布局规划.pdf',
                                layer: 5,
                            },
                            {
                                id: 'p3-8',
                                label: '河道治理规划.pdf',
                                layer: 5,
                            },
                            {
                                id: 'p3-9',
                                label: '长江口综合整治开发规划.pdf',
                                layer: 5,
                            },
                        ],
                    }
                ]

            },
        ],
    },
    {
        id: 'p2',
        label: '模型参数库',
        layer: 2,
        children: [
            {
                id: 'p2-1',
                label: '风险预警模型',
                layer: 3,
                upload: true,
                children: [
                    {
                        fileCollection: [
                            {
                                id: 'p2-1',
                                label: '风险评估因子阈值.pdf',
                                layer: 3,
                            },
                        ],
                    }
                ]

            }
        ]
    },
    {
        id: 'p4',
        label: '专家经验库',
        layer: 2,
        children: [
            {
                id: 'p4-1',
                label: '行洪运用预案',
                layer: 3,
                upload: true,
                children: [
                    {
                        fileCollection: [
                            {
                                id: 'p4-1-1',
                                label: '长江南通段民主沙行洪运用预案.pdf',
                                layer: 4,
                            },
                        ],
                    }
                ]
            },
            {
                id: 'p4-2',
                label: '重点防御预案',
                layer: 3,
                class: 4,
                upload: true,
                children: [
                    {
                        fileCollection: [
                            {
                                id: 'p4-2-1',
                                label: '江都区长江嘶马弯道重点防御预案20240207.pdf',
                                layer: 4,
                            },
                            {
                                id: 'p4-2-2',
                                label: '孟家港险工段重点防御预案.pdf',
                                layer: 4,
                            },
                            {
                                id: 'p4-2-3',
                                label: '南京市鼓楼区长江下关岸段重点防御预案.pdf',
                                layer: 4,
                            },
                            {
                                id: 'p4-2-4',
                                label: '新太海汽渡~七丫口风险隐患段重点防御预案.pdf',
                                layer: 4,
                            },
                            {
                                id: 'p4-2-5',
                                label: '扬中市太平洲左缘（二墩港至胜利河）险工段重点防御预案.pdf',
                                layer: 4,
                            },
                        ],
                    }
                ]
            },
        ],
    },
]


export { paramTree, fileTree }
