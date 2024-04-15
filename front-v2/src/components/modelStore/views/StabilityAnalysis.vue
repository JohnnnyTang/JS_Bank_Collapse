<template>
    <div class="stabilityAnalysis-container">
        <ModelTitleVue
            :ModelName="ModelName"
        />
        <div class="model-content-container">
            <div class="map-container">
                <div id="map" ref="mapContainerRef"></div>
            </div>
            <div class="model-item-container">
                <div class="switch-icon">
                    <img 
                        src="/icons/switch.png" 
                        alt="switch"
                        @click="switchContent"
                    >
                </div>
                <div class="model-calculate-container">
                    <div v-if="firstPage == false" class="model-info-container">
                        <ModelInfoVue
                            :modelInfo="modelInfo"
                        />
                    </div>
                    <div v-if="firstPage == true" class="calculate-data-container">
                        <div class="calculate-data-wrapper">
                            <div class="calculate-data-title">
                                <div
                                    v-if="ifShowData == false"
                                    class="data-title-icon"
                                >
                                    <img src="/data.png" alt="data">
                                </div>
                                <div
                                    v-if="ifShowData == true"
                                    class="data-shower-icon"
                                >
                                    <img src="/dataTable.png" alt="data">
                                </div>
                                <div class="data-title-text">模型计算数据</div>
                            </div>
                            <div
                                v-if="ifShowData == false"
                                class="calculate-data-content"
                            >
                                <DataCardVue
                                    @showData="showData"
                                    v-for="(item, index) in ModelDataList"
                                    :title="item.title"
                                    :desc="item.desc"
                                    :iconSrc="item.iconSrc"
                                    :data="item.data"
                                />
                            </div>
                            <div
                                class="data-shower-content"
                                v-if="ifShowData == true"
                            >
                                <DataShowTableVue
                                    :tableData="tableData"
                                />
                                <div
                                    class="switch-icon-data"
                                    @click="ifShowData=false"
                                >
                                    <img src="/switch2.png" alt="switch">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="calculate-result-container">
                        <div class="calculate-result-wrapper">
                            <div class="calculate-result-title">
                                <div class="result-title-icon">
                                    <img src="/result.png" alt="result">
                                </div>
                                <div class="result-title-text">模型计算结果</div>
                            </div>
                            <div class="calculate-result-content">
                                <ResultCardVue
                                    v-for="(item, index) in ModelResultList"
                                    :title="item.title"
                                    :time="item.time"
                                    :iconSrc="item.iconSrc"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import { initMap, flytoLarge } from '../../../utils/mapUtils';
import { useMapStore } from '../../../store/mapStore'
import ModelInfoVue from '../ModelInfo.vue'
import ModelTitleVue from '../ModelTitle.vue';
import DataCardVue from '../DataCard.vue';
import ResultCardVue from '../ResultCard.vue';
import DataShowTableVue from '../DataShowTable.vue'
import { infoItemList } from '../modelInfoList.js'

const modelInfo = {
    application: infoItemList[2].application,
    usescene: infoItemList[2].usescene,
    input: infoItemList[2].input,
    output: infoItemList[2].output,
    processPicSrc:infoItemList[2].processPicSrc,
}


const ModelName = '岸坡稳定性分析模型'

const mapContainerRef = ref()
const mapStore = useMapStore()
let map = null
const firstPage = ref(true)
const switchContent = () => {
    // console.log(firstPage.value)
    firstPage.value = !firstPage.value
}

const ifShowData = ref(false)

const tableData = {}
const showData = (data) => {
    // console.log(data)
    ifShowData.value = true
    tableData.title = data.title
    tableData.data = data.data
}


const ModelDataList = [
    {
        title:'模型计算数据',
        desc:'bulabulabula',
        iconSrc:'/data.png',
        data:{
            name:"11"
        }
    },
    {
        title:'模型计算数据',
        desc:'bulabulabula',
        iconSrc:'/data.png',
        data:{
            name:"11"
        }
    },
    {
        title:'模型计算数据',
        desc:'bulabulabula',
        iconSrc:'/data.png',
        data:{
            name:"11"
        }
    },
    {
        title:'模型计算数据',
        desc:'bulabulabula',
        iconSrc:'/data.png',
        data:{
            name:"11"
        }
    },
    {
        title:'模型计算数据',
        desc:'bulabulabula',
        iconSrc:'/data.png',
        data:{
            name:"11"
        }
    },
    {
        title:'模型计算数据',
        desc:'bulabulabula',
        iconSrc:'/data.png',
        data:{
            name:"11"
        }
    },
    {
        title:'模型计算数据',
        desc:'bulabulabula',
        iconSrc:'/data.png',
        data:{
            name:"11"
        }
    },
    {
        title:'模型计算数据',
        desc:'bulabulabula',
        iconSrc:'/data.png',
        data:{
            name:"11"
        }
    },
]

const ModelResultList = [
    {
        title:'模型计算结果',
        time:'2024-3-31 8:00:00',
        iconSrc:'/result.png'
    },
    {
        title:'模型计算结果',
        time:'2024-3-31 8:00:00',
        iconSrc:'/result.png'
    },
    {
        title:'模型计算结果',
        time:'2024-3-31 8:00:00',
        iconSrc:'/result.png'
    },
    {
        title:'模型计算结果',
        time:'2024-3-31 8:00:00',
        iconSrc:'/result.png'
    },
    {
        title:'模型计算结果',
        time:'2024-3-31 8:00:00',
        iconSrc:'/result.png'
    },
    {
        title:'模型计算结果',
        time:'2024-3-31 8:00:00',
        iconSrc:'/result.png'
    },
    {
        title:'模型计算结果',
        time:'2024-3-31 8:00:00',
        iconSrc:'/result.png'
    }
]


onMounted(async () => {
    let mapInstance = await initMap(mapContainerRef.value)
    mapStore.setMap(mapInstance)
    map = mapStore.getMap()
    flytoLarge(map)
})
onUnmounted(() => {

})


</script>
  
<style lang="scss" scoped>
@keyframes slideBackgroundColor {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
div.stabilityAnalysis-container {
    display: flex;
    align-items: center;
    width:100%;
    height: 92vh;
    overflow: hidden;
    flex-direction: column;
    background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
    background-size: 200% 200%;
    animation: slideBackgroundColor 4s ease infinite;

    div.model-content-container {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 95%;

        div.map-container {
        width: 100%;
        height: 100%;

            div#map {
                z-index: 1;
                position: relative;
                width: 100vw;
                height: 92vh;
                background-color: rgb(124, 179, 203);
                // opacity: 0.8;
            }
        }

        div.model-item-container {
            position: absolute;
            z-index: 2;
            top: 0;
            right: 75%;
            width: 25%;
            height: 100%;
            // background-color: #2aa9c9;

            div.switch-icon {
                z-index: 5;
                position: absolute;
                width: 8%;
                height: 5%;
                right: 2%;
                top: 1%;
                transition: transform 0.25s ease;
                &:hover {
                    cursor: pointer;
                    // transform: scale(1.1);
                }
                
                // background-color: #2aa9c9;

                img {
                    width: 100%;
                    height: 100%;
                    animation: floating 1s ease-in-out infinite;
                }
                &:hover img {
                    animation-play-state: paused;
                }
            }

            div.model-info-container {
                display: flex;
                width:100%;
                height:100%;
            }

            div.model-calculate-container {
                width:100%;
                height:100%;
                // overflow-y: scroll;
                // overflow-x: hidden;
                background: linear-gradient(45deg, #C9E1F5, #E2FFEE);
                border-right: 3px solid #9eb5bb;
                
                div.calculate-data-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width:100%;
                    height:50%;
                    border-bottom: #a2b8c0 3px solid;
                    // background-color: #2aa9c9;

                    div.calculate-data-wrapper {
                        width: 96%;
                        height: 96%;
                        // background-color: #0d60fa;

                        div.calculate-data-title {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            // margin-left: 5%;
                            width: 100%;
                            height: 12%;
                            // background-color: #a542d3;

                            div.data-title-icon {
                                width: 40px;
                                height: 40px;

                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            div.data-shower-icon {
                                width: 40px;
                                height: 40px;

                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            div.data-title-text {
                                margin-left: 15px;
                                font-size: calc(0.9vh + 0.9vw);
                                font-weight: 600;
                                font-family: 'Microsoft YaHei';
                                color: #343c44;
                                text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                            }  
                        }

                        div.calculate-data-content {
                            display: flex;
                            flex-wrap: wrap;
                            width: 100%;
                            height: auto;
                            max-height: 87%;
                            overflow-y: scroll;
                            overflow-x: hidden;
                            &::-webkit-scrollbar {
                                width: 3px;
                            }
                            &::-webkit-scrollbar-track {
                                background-color: rgba(6, 181, 197, 0.219);
                            }
                            &::-webkit-scrollbar-thumb {
                                background-color: #9ea4a794;
                                border-radius: 5px;
                            }
                            &::-webkit-scrollbar-thumb:hover {
                                background-color: #2b303081;
                            }
                            // background-color: #2aa9c9;
                            border: 3px solid rgb(197, 195, 195);
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                        }

                        div.data-shower-content {
                            position: relative;
                            display: flex;
                            flex-wrap: wrap;
                            width: 100%;
                            height: 87%;
                            max-height: 87%;
                            // overflow-y: scroll;
                            overflow-x: hidden;
                            background-color: rgb(232, 245, 243);
                            &::-webkit-scrollbar {
                                width: 3px;
                            }
                            &::-webkit-scrollbar-track {
                                background-color: rgba(6, 181, 197, 0.219);
                            }
                            &::-webkit-scrollbar-thumb {
                                background-color: #9ea4a794;
                                border-radius: 5px;
                            }
                            &::-webkit-scrollbar-thumb:hover {
                                background-color: #2b303081;
                            }
                            // background-color: #2aa9c9;
                            border: 3px solid rgb(197, 195, 195);
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

                            div.switch-icon-data {
                                position:absolute;
                                width: 40px;
                                height: 40px;
                                right: 5px;
                                bottom: 5px;
                                transition: transform 0.25s;
                                user-select: none;

                                &:hover {
                                    transform: scale(1.1);
                                    cursor: pointer;
                                }

                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }

                div.calculate-result-container {

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width:100%;
                    height:50%;
                    // background-color: #2f3477;
                    
                    div.calculate-result-wrapper {
                        width: 96%;
                        height: 96%;
                        // background-color: #0d60fa;

                        div.calculate-result-title {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            // margin-left: 5%;
                            width: 100%;
                            height: 12%;
                            // background-color: #39555c;

                            div.result-title-icon {
                                width: 40px;
                                height: 40px;

                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            div.result-title-text {
                                margin-left: 15px;
                                font-size: calc(0.9vh + 0.9vw);
                                font-weight: 600;
                                font-family: 'Microsoft YaHei';
                                color: #343c44;;
                                text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                            }
                        }

                        div.calculate-result-content {
                            display: flex;
                            flex-wrap: wrap;
                            width: 100%;
                            height: auto;
                            max-height: 87%;
                            overflow-y: scroll;
                            overflow-x: hidden;
                            &::-webkit-scrollbar {
                                width: 3px;
                            }
                            &::-webkit-scrollbar-track {
                                background-color: rgba(6, 181, 197, 0.219);
                            }
                            &::-webkit-scrollbar-thumb {
                                background-color: #9ea4a794;
                                border-radius: 5px;
                            }
                            &::-webkit-scrollbar-thumb:hover {
                                background-color: #2b303081;
                            }
                            // background-color: #2aa9c9;
                            border: 3px solid rgb(197, 195, 195);
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                        }
                    }
                }
            }
        }
    }

}
@keyframes floating {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>