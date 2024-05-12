import { layerAddFunction, layerRemoveFunction } from "../layerUtil"

class LayerGroup {
    constructor(title, layerIDs, map = undefined) {
        this.map = map
        this.title = title
        this.active = false
        this.layerIDs = []
        layerIDs.forEach(element => {
            this.layerIDs.push(element)
        });
    }

    setMap(mapInstance) {
        this.map = mapInstance
    }

    async showLayer() {
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                await layerAddFunction(this.map, this.layerIDs[i])
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }

    async hideLayer() {
        if (this.map) {
            for (let i = 0; i < this.layerIDs.length; i++) {
                layerRemoveFunction(this.map, this.layerIDs[i])
            }
            this.active = false
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }
}

class LayerScene {
    constructor(title, LayerGroups, map = undefined) {
        this.map = map
        this.title = title
        this.LayerGroups = []
        LayerGroups.forEach(element => {
            this.LayerGroups.push(element)
        })
        this.active = false
    }

    setMap(mapInstance) {
        this.map = mapInstance
        for(let i = 0; i < this.LayerGroups.length; i++){
            this.LayerGroups[i].setMap(this.map)
        }
    }

    async showScene() {
        if (this.map) {
            for (let i = 0; i < this.LayerGroups.length; i++) {
                await this.LayerGroups[i].showLayer()
            }
            this.active = true
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }

    }

    async hideScene() {
        if (this.map) {
            for (let i = 0; i < this.LayerGroups.length; i++) {
                this.LayerGroups[i].hideLayer()
            }
        } else {
            console.log('WARNING:: NOT VALID MAP');
        }
    }
}

const layerGroupMap = {
    '行政区划': ['省级行政区', '市级行政区', '市级行政区-注记'],
    '河道分段': ['河道分段', '河道分段-注记'],
    '流域水系': ['流域水系'],
    '湖泊河流': ['湖泊河流'],
    '水文站点': ['水文站点'],
    '长江堤防': ['长江堤防'],
    '过江通道': ['过江通道-线', '过江通道-桥墩', '过江通道-桥'],
    '沿江码头': ['沿江码头'],
    '大型枢纽': [],
    '水库大坝': ['水库大坝'],
    '水闸工程': ['水闸工程'],
    '泵站工程': ['泵站工程'],
    '组合工程': ['组合工程'],
    '岸段名录': [],
    '历史崩岸': [],
    '近岸地形': ['近岸地形'],
    '近年冲淤': [],
}
const layerSceneMap = {
    '全江概貌': ['行政区划', '河道分段', '流域水系', '湖泊河流', '水文站点'],
    '涉水工程': ['长江堤防', '过江通道', '沿江码头', '大型枢纽', '水库大坝', '水闸工程', '泵站工程', '组合工程'],
    '重点岸段': ['岸段名录', '历史崩岸', '近岸地形', '近年冲淤'],
}

const initLayerGroups = () => {
    const dict = {
        '行政区划': ['省级行政区', '市级行政区', '市级行政区-注记'],
        '河道分段': ['河道分段', '河道分段-注记'],
        '流域水系': ['流域水系'],
        '湖泊河流': ['湖泊河流'],
        '水文站点': ['水文站点'],
        '长江堤防': ['长江堤防'],
        '过江通道': ['过江通道-线', '过江通道-桥墩', '过江通道-桥'],
        '沿江码头': ['沿江码头'],
        '大型枢纽': [],
        '水库大坝': ['水库大坝'],
        '水闸工程': ['水闸工程'],
        '泵站工程': ['泵站工程'],
        '组合工程': ['组合工程'],
        '岸段名录': [],
        '历史崩岸': [],
        '近岸地形': ['近岸地形'],
        '近年冲淤': [],
    }
    let map = new Map()
    for (let key in dict) {
        let LGins = new LayerGroup(key, dict[key])
        map.set(key, LGins)
    }
    return map
}

let layerGroupInstanceMap = initLayerGroups()

const initLayerScenes = () => {
    const dict = {
        '全江概貌': ['行政区划', '河道分段', '流域水系', '湖泊河流', '水文站点'],
        '涉水工程': ['长江堤防', '过江通道', '沿江码头', '大型枢纽', '水库大坝', '水闸工程', '泵站工程', '组合工程'],
        '重点岸段': ['岸段名录', '历史崩岸', '近岸地形', '近年冲淤'],
    }
    let map = new Map()
    for (let key in dict) {
        let layerGroups = []
        for (let i = 0; i < dict[key].length; i++) {
            layerGroups.push(layerGroupInstanceMap.get(dict[key][i]))
        }
        let LSins = new LayerScene(key, layerGroups)
        map.set(key, LSins)
    }
    return map
}

const mapToObject = (mapObj)=>{
    const obj = {}
    mapObj.forEach((value,key)=>{
        obj[key] = value
    })
    return obj
}


const scenes = mapToObject(initLayerScenes()) 
const layerGroups = mapToObject(initLayerGroups())
const tree = [
    {
        label: '全江概貌',
        children: [
            {
                label: '行政区划',
                icon: '/icons/行政区划.png'

            },
            {
                label: '河道分段',
                icon: '/icons/河道分段.png'

            },
            {
                label: '流域水系',
                icon: '/icons/流域水系.png'

            },
            {
                label: '湖泊河流',
                icon: '/icons/湖泊河流.png'

            },
            {
                label: '水文站点',
                icon: '/icons/水文站点.png'

            }
        ]
    },
    {
        label: '涉水工程',
        children: [
            {
                label: '长江堤防',
                icon: '/icons/长江堤防.png'
            },
            {
                label: '过江通道',
                icon: '/icons/过江通道.png'

            },
            {
                label: '沿江码头',
                icon: '/icons/沿江码头.png'

            },
            {
                label: '大型枢纽',
                icon: '/icons/大型枢纽.png'

            },
            {
                label: '水库大坝',
                icon: '/icons/水库大坝.png'

            },
            {
                label: '水闸工程',
                icon: '/icons/水闸工程.png'

            },
            {
                label: '泵站工程',
                icon: '/icons/泵站工程.png'

            },
            {
                label: '组合工程',
                icon: '/icons/组合工程.png'

            },
        ]
    },
    {
        label: '重点岸段',
        children: [
            {
                label: '岸段名录',
                icon: '/icons/岸段名录.png'

            },
            {
                label: '历史崩岸',
                icon: '/icons/历史崩岸.png'

            },
            {
                label: '近岸地形',
                icon: '/icons/近岸地形.png'

            },
            {
                label: '近年冲淤',
                icon: '/icons/近年冲淤.png'

            },
        ]
    }
]



export {
    scenes,
    layerGroups,
    initLayerScenes,
    initLayerGroups,
    tree
}