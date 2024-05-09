import mapboxgl from 'mapbox-gl'
import sceneRelate from './sceneUtil'

// Scene
class NewScene {
    constructor() {
        //规范
        this.title = ''
        this.markers = []
        this.active = false
        this.allLayers = [] //only id
        this.allSources = []
    }
    static create(title) {
        let scene = new NewScene()
        scene.title = title
        return scene
    }


    async initLayers(map) {
        await initLayers(this, map)
    }

    showLayers(map, showArrays) {
        var invisibleLayers = this.allLayers.filter(
            (v) => !showArrays.includes(v),
        )
        hideLayersFunction(map, invisibleLayers)
        showLayersFunction(map, showArrays)
    }

    removeLayers(map) {

        globalpopup && globalpopup.remove()
        hideLayersFunction(map, this.allLayers)
        this.allLayers = []

        // source 是否需要删除？
        // this.layerSrc.forEach((sourceID) => {
        //     map.getSource(sourceID) && map.removeSource(sourceID)
        // })

        //hide marker
        let markersDoms = document.getElementsByClassName(
            'mapboxgl-marker mapboxgl-marker-anchor-center',
        )
        for (let i = markersDoms.length - 1; i >= 0; i--) {
            markersDoms[i].remove()
        }
    }

    static getSceneTree() {
        let tree = [
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
        return tree
    }
    static getInitSceneMap() {
        let scenes = {}
        for (let i = 0; i < sceneRelate.sceneNames.length; i++) {
            let scene = NewScene.create(sceneRelate.sceneNames[i])
            scenes[sceneRelate.sceneNames[i]] = scene
        }
        return scenes
    }
}


export {
    NewScene
}