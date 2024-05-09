


const sceneOperateMap = {
    '行政区划': {
        show: (map) => {
            //该场景下所有图层的加载、显示  和 交互逻辑
        },
        hide: (map) => {
            //该场景下所有图层的隐藏或删除
        }
    },
    '河道分段': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '流域水系': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '湖泊河流': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '水文站点': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '长江堤防': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '过江通道': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '沿江码头': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '大型枢纽': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '水库大坝': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '水闸工程': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '泵站工程': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '组合工程': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '岸段名录': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '历史崩岸': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '近岸地形': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },
    '近年冲淤': {
        show: (map) => {

        },
        hide: (map) => {

        }
    },

}

const sceneNames = [
    '行政区划',
    '行政区划',
    '河道分段',
    '流域水系',
    '湖泊河流',
    '水文站点',
    '长江堤防',
    '过江通道',
    '沿江码头',
    '大型枢纽',
    '水库大坝',
    '水闸工程',
    '泵站工程',
    '组合工程',
    '岸段名录',
    '历史崩岸',
    '近岸地形',
    '近年冲淤',
]

class SceneRelate {
    constructor() {
        this.sceneNames = sceneNames
        this.sceneOperateMap = sceneOperateMap
    }
}




const sceneRelate = new SceneRelate()
export default sceneRelate