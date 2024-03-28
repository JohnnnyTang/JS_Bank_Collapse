<template>
    <div class="dataInterpretation-container">
        <div class="model-title-container">
            <div
                class="return-arrow"
                @click="returnMain"
            >
            </div>
            <div class="title-text">
                数据融合解译模型
            </div>
        </div>
        <div class="model-content-container">
            <div class="model-information-container">
                <div class="model-information-wrapper">
                    <div class="information-item-container">
                        <div class="information-item-title">
                            模型基本信息
                        </div>
                        <div class="information-item-content">
                            模型应用分类
                            模型使用场景
                            模型输入参数
                            模型输出结果
                        </div>
                    </div>
                    <div class="information-item-container">
                        <div class="information-item-title">
                            模型执行流程图
                        </div>
                        <div class="information-item-content">
                            <div class="image-div">
                                <img src="/model-process.png" alt="模型流程图">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="model-data-container">
                <div class="model-data-wrapper">
                    <div class="model-data-item">
                        <div class="data-item-title">
                            GNSS表面三位位移量实时差分解算算法
                        </div>
                        <div class="data-item-content">
                            <GNSSCardVue
                                :gnss="gnss"
                            />
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            固定式测斜仪位移测量解算算法
                        </div>
                        <div class="data-item-content">
                            <incliCardVue
                                :incli="incli"
                            />
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            孔隙水压力计渗透压解算算法
                        </div>
                        <div class="data-item-content">
                            <watpreCardVue
                                :watpre="watpre"
                            />
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            应力桩应变量解算算法
                        </div>
                        <div class="data-item-content">
                            <StrepileCardVue
                                :strepile="strepile"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'
import GNSSCardVue from '../GNSSCard.vue';
import incliCardVue from '../IncliCard.vue';
import watpreCardVue from '../WatpreCard.vue';
import StrepileCardVue from '../StrepileCard.vue';

const router = useRouter()
const returnMain = () => {
    router.push('/modelStore')
}
const gnss = {
    firstPage: false,
}
const incli = {
    firstPage: false,
}
const watpre = {
    firstPage: false,
}
const strepile = {
    firstPage: false,
}
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

div.dataInterpretation-container {
    width:100%;
    height: 92vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
    background-size: 200% 200%;
    animation: slideBackgroundColor 4s ease infinite;

    div.model-title-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 5vh;
        text-align: left;
        padding-top: 5px;
        padding-left: 20px;
        // background: linear-gradient(
        //     to right, rgb(133, 160, 230) 0%, rgb(98, 208, 228) 100%
        // );

        div.return-arrow {
            width: 2vw;
            height: 4vh;
            background-image: url('/left-arrow.png');
            background-size: contain;
            transition: transform 0.25s ease;
            &:hover {
                cursor: pointer;
                transform: scale(1.2);
            }
        }

        div.title-text {
            width: 20vw;
            padding-left: 1%;
            font-size: calc(1vh + 1vw);
            font-weight: 600;
            font-family: 'Microsoft YaHei';
            color:aliceblue;
            text-shadow: #4bb0f3 1px 1px;
        }
    }

    div.model-content-container {
        width:100%;
        height: 87vh;
        overflow: hidden;
        display: flex;
        flex-direction: row;

        div.model-information-container {
            display: flex;
            width: 30vw;
            height: 86vh;
            justify-content: center;
            align-items: center;
            // background-color: rgb(240, 240, 240);
            
            div.model-information-wrapper {
                width: 98%;
                height: 98%;
                // background-color: rgb(192, 185, 165);

                div.information-item-container {
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    width:100%;
                    height:49%;
                    margin-bottom: 10px;
                    background-color: rgba(240, 248, 255, 0.95);
                    border: 2px solid rgb(114, 114, 114);
                    border-radius: 5px;
                    transition: transform 0.25s ease;
                    &:hover {
                        cursor: pointer;
                        transform: scale(1.01);
                    }

                    div.information-item-title {
                        width: 100%;
                        height: 3vh;
                        padding-left: 20px;
                        padding-top: 10px;
                        // background-color: rgb(114, 114, 114);
                        line-height: 3vh;
                        font-size: calc(1.5vh + 0.5vw);
                        font-weight: 550;
                        font-family: 'Microsoft YaHei';
                        color:black;
                        // text-shadow: #4bb0f3 1px 1px;
                    }

                    div.information-item-content {
                        width: 100%;
                        height: 100%;
                        padding-left: 30px;
                        padding-top: 10px;

                        div.image-div {
                            width: 90%;
                            height: 80%;
                            // -webkit-box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                            // -moz-box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                            // box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                            margin-bottom: 2vh;
                            user-select: none;

                            img {
                                object-fit: contain;
                                width: 100%;
                                height: 100%;
                                filter: contrast(1.1) hue-rotate(12deg) brightness(0.9)
                                    saturate(0.8);
                                border-radius: 10px;
                            }
                        }
                    }

                }
            }
        }

        div.model-data-container {
            display: flex;
            width: 70vw;
            height: 86vh;
            padding-left: 20px;
            justify-content: center;
            align-items: center;
            // background-color: rgb(160, 38, 150);

            div.model-data-wrapper {
                // position: relative;
                display: flex;
                flex-wrap: wrap;
                // flex-direction: col;
                width: 99%;
                height: 98%;
                // background-color: rgb(192, 185, 165);

                div.model-data-item {
                    width: 50%;
                    height: 50%;
                    // background-color: aquamarine;

                    div.data-item-title {
                        width: 100%;
                        height: 10%;
                        font-size: calc(0.5vh + 1vw);
                        font-weight: 600;
                        font-family: 'Microsoft YaHei';
                        color:beige;
                        text-shadow: #4bb0f3 1px 1px;
                    }

                    div.data-item-content {
                        width: 100%;
                        height: 90%;
                    }
                }
            }
        }
    }
    
        
}

</style>