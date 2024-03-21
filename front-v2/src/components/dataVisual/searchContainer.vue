<template>
    <div class="search-container">
        <div class="search-container-icon-container" @click="showSearchMain = !showSearchMain">
            <!-- <el-tooltip :content="showSearchMain ? '最小化' : '要素检索'" placement="top" effect="light" :show-arrow="false"> -->
            <div class="search-container-icon" :style="{ backgroundImage: `url(${iconSrc})` }"></div>
            <!-- </el-tooltip> -->
        </div>

        <Transition name="slidefade">
            <div class="search-container-main" v-show="showSearchMain">
                <div class="input-container">
                    <input type="text" name="text" class="input" placeholder="要素检索" v-model="inputText">
                    <span class="icon">
                        <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path opacity="1" d="M14 5H20" stroke="#000" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                                <path opacity="1" d="M14 8H17" stroke="#000" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                                <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                                    stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                </path>
                                <path opacity="1" d="M22 22L20 20" stroke="#000" stroke-width="3.5"
                                    stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                        </svg>
                    </span>
                </div>

                <el-tree ref="treeRef" style="max-width: 600px" class="filter-tree" :data="data" :props="defaultProps"
                    :default-expand-all="false" :filter-node-method="filterNode" @node-click="selectedNodeHandler">

                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <div class="leaf-node" v-if="node.isLeaf"></div>
                            <span>{{ node.label }}</span>
                            <span>
                                <a v-show="node.isLeaf"> 查看详情 </a>
                            </span>
                        </span>
                    </template>

                </el-tree>
            </div>
        </Transition>

        <!-- <Transition name="'slidefade">
            <featureDetail v-show="showfeatureDetail" :selectedFeature></featureDetail>
        </Transition> -->

    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl';
import featureDetail from './featureDetail.vue';
import { onMounted, ref, computed, watch, reactive, createApp, defineComponent, nextTick } from 'vue';
import { ElMessage } from "element-plus"
import { Scene } from './Scene';
import { useMapStore } from '../../store/mapStore';




const mapStore = useMapStore()

const props = defineProps({
    selectedScene: Scene
})

const showSearchMain = ref(true)
const showfeatureDetail = ref(false)
const selectedFeature = ref({})
const iconSrc = computed(() => {
    return showSearchMain.value ? './icons/resize.png' : './icons/searching.png'
})
const inputText = ref("")
const treeRef = ref()
const defaultProps = {
    children: 'children',
    label: 'label',
}
let data = ref([
    {
        id: 1,
        label: 'Level one 1',
        type: 'F',
        children: [
            {
                id: 4,
                label: 'Level two 1-1',
                type: 'F',
                children: [
                    {
                        id: 9,
                        label: 'Level three 1-1-1',
                        type: 'Leaf',
                    },
                    {
                        id: 10,
                        label: 'Level three 1-1-2',
                        type: 'Leaf'
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        label: 'Level one 2',
        type: 'F',
        children: [
            {
                id: 5,
                label: 'Level two 2-1',
                type: 'Leaf'
            },
            {
                id: 6,
                label: 'Level two 2-2',
                type: 'Leaf'
            },
        ],
    },
    {
        id: 3,
        label: 'Level one 3',
        type: 'F',
        children: [
            {
                id: 7,
                label: 'Level two 3-1',
                type: 'Leaf'
            },
            {
                id: 8,
                label: 'Level two 3-2',
                type: 'Leaf'
            },
        ],
    },
])


const filterNode = (value, data, node) => {
    if (!value) return true
    return data.label.includes(value)
}

const createPopUpComponent = ()=>{
    const ap = createApp(featureDetail,{selectedFeature,})
    const container = document.createElement("div")
    const componentInstance = ap.mount(container)
    return container;//返回挂载了组件的dom
}
const domwithComp = createPopUpComponent()
let popUp = undefined;



const selectedNodeHandler = (nodeObj, nodeProp, Node, event) => {
    if (nodeProp.isLeaf) {
        showLeafDetailHandler(nodeProp)
    }
}

const showLeafDetailHandler = (node) => {
    // console.log(node.data);
    selectedFeature.value = node.data;
    showfeatureDetail.value = true;
    let popupCoord = getPopupCoord(node.data.coord ? node.data.coord : node.data.llCoords)
    popUp&&popUp.remove()
    popUp = new mapboxgl.Popup()
        .setDOMContent(domwithComp)
        .setLngLat(popupCoord)
        .addTo(mapStore.getMap());

}

const getPopupCoord = (coordsArray) => {
    if (coordsArray.length % 2) {
        console.log(coordsArray.length, Math.floor(coordsArray.length / 2));
        return coordsArray[Math.floor(coordsArray.length / 2)]
    } else {
        console.log(coordsArray.length, coordsArray.length / 2);
        let long = (coordsArray[coordsArray.length / 2][0] + coordsArray[coordsArray.length / 2 - 1][0]) / 2
        let lat = (coordsArray[coordsArray.length / 2][1] + coordsArray[coordsArray.length / 2 - 1][1]) / 2
        return [long, lat]
    }
}


watch(props, (newV) => {
    // get scene layer info and init data
    popUp&&popUp.remove()
    let map = mapStore.getMap()
    if (props.selectedScene.allLayers.length != 0) {
        // only for geojson?
        data.value = initDataByScene(newV.selectedScene)
    }

})


watch(inputText, (v1, v) => {
    // console.log(v1);
    treeRef.value.filter(v1)
})

onMounted(async () => {

})


const initDataByScene = (sceneInstance) => {
    let map = mapStore.getMap()
    let data = []
    let idCount = 0
    sceneInstance.allLayers.forEach(layerID => {
        let layerChildren = []
        let layerItem = {
            id: idCount++,
            label: layerID,
            children: []
        }
        let layerSourceId = map.getLayer(layerID).source
        let geojsonFeatures = map.getSource(layerSourceId)['_data']['features']
        geojsonFeatures.forEach((feat) => {
            let item = {
                id: idCount++,
                label: feat["properties"]["bankName"] ? feat["properties"]["bankName"] : feat["properties"]["name"],
                children: [],
                ...feat["properties"]
            }
            layerChildren.push(item)
        })
        layerItem.children = layerChildren
        data.push(layerItem)
    })


    return data
}




</script>

<style lang="scss" scoped>
.search-container {
    user-select: none;

    .search-container-icon-container {
        position: absolute;
        right: 2vw;
        top: 2.5vh;
        z-index: 10;
        width: 6.5vh;
        height: 6.5vh;
        background-color: rgb(255, 255, 255);
        border-radius: 6vh;
        display: flex;
        align-items: center;
        justify-content: center;

        .search-container-icon {
            width: 5vh;
            height: 5vh;
            background-size: contain;
            transition: 300ms;

            &:hover {
                cursor: pointer;
            }

            &:active {
                transform: rotate3d(0, 1, 1, 15deg);
                background-color: rgba(255, 255, 255, 0)
            }
        }
    }

    .search-container-main {
        position: absolute;
        right: 2vw;
        top: 2vh;
        height: 40vh;
        width: 20vw;
        padding: 1vh;
        //linear-gradient(45deg, #C9E1F5, #E2FFEE);
        background-color: #D3F3F8;
        border-radius: 1vh;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
        transition: 300ms;
        border: solid 5px #2281da;

        .input-container {
            width: calc(100% - 6.5vh - 2vw);
            height: 7vh;
            position: relative;

            .input {
                width: 100%;
                height: 3vh;
                padding: 1vh;
                transition: 200ms linear;
                border: 2.5px solid #54A2E9;
                background-color: #ECF4FD;
                font-size: 18px;
                letter-spacing: 1px;

                &:focus {
                    outline: none;
                    border: 1px solid #54A2E9;
                    box-shadow: -2px -2px 0px #3c58fa;
                }
            }

            .icon {
                position: absolute;
                right: 0;
                top: 30%;
                transform: translateY(-30%);
                // &:hover {
                //     cursor: pointer;
                animation: anim 2s linear infinite;
                //}
            }
        }

        @keyframes anim {

            0%,
            100% {
                transform: translateY(-30%) scale(1);
            }

            50% {
                transform: translateY(-30%) scale(1.3);
            }
        }

        .filter-tree {
            //background-color: rgb(215, 200, 231);
            //color: rgb(247, 1, 1);
            overflow-y: scroll;
            height: 33vh;
            background-color: rgba(240, 248, 255, 0.11);



            &::-webkit-scrollbar {
                width: 5px;
            }

            &::-webkit-scrollbar-track {
                background-color: rgba(6, 181, 197, 0.219);
            }

            &::-webkit-scrollbar-thumb {
                background-color: #15a1e294;
                border-radius: 5px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background-color: #3af0f781;
            }

        }


    }

    .slidefade-enter-active,
    .slidefade-leave-active {
        transition: opacity 300ms linear;
    }

    .slidefade-enter-from,
    .slidefade-leave-to {
        opacity: 0;
    }
}



.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .leaf-node {
        position: absolute;
        left: 1vw;
        //width: 0.5vw;
        //height: 0.5vw;
        //border-radius: 1vw;
        //background-color: rgb(30, 31, 30);
        //line-height: 1vw;
    }
}

.el-tree {
    color: #152478;
    font-weight: 500;
}

:deep(.el-tree-node__content) {
    &:hover {
        background-color: #a9f2fd;
    }
}

:deep(.el-tree-node .is-focusable) {
    background-color: #c1f4fc;
}

:deep(.el-tree-node .is-focusable) {
    background-color: #c1f4fc;
}
</style>
