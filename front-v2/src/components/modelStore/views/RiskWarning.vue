<template>
    <div class="dataInterpretation-container">
        <div class="model-title-container">
            <div
                class="return-arrow"
                @click="returnMain"
            >
            </div>
            <div class="title-text">
                风险预警模型
            </div>
        </div>
        <div class="model-content-container">
            <div class="model-information-container">
                <div class="model-information-wrapper">
                    <div class="information-item-container">
                        <div class="information-item-title">
                            流程图
                        </div>
                        <div class="information-item-content">
                            内容
                        </div>
                    </div>
                    <div class="information-item-container">
                        <div class="information-item-title">
                            模型基本信息
                        </div>
                        <div class="information-item-content">
                            内容
                        </div>
                    </div>
                </div>
            </div>
            <div class="model-data-container">
                <div class="model-data-wrapper">
                    <div class="model-data-item">
                        <div class="data-item-title">
                            model1
                        </div>
                        <div class="data-item-content">
                            model1-information
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            model2
                        </div>
                        <div>
                            model2-information
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            model3
                        </div>
                        <div>
                            model3-information
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            model4
                        </div>
                        <div>
                            model4-information
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const returnMain = () => {
    router.push('/modelStore')
}
</script>
  
<style lang="scss" scoped>

div.dataInterpretation-container {
    width:100%;
    height: 92vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    div.model-title-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 5vh;
        text-align: left;
        padding-top: 5px;
        padding-left: 20px;
        // background: linear-gradient(
        //     to right, #8b99d3 0%, rgb(98, 208, 228) 100%
        // );
        background-color: bisque;

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
            background-color: aquamarine;
            
            div.model-information-wrapper {
                width: 98%;
                height: 98%;
                background-color: rgb(192, 185, 165);

                div.information-item-container {
                    position: relative;
                    width:100%;
                    height:50%;

                    div.information-item-title {
                        width: 100%;
                        height: 3vh;
                        background-color: rgb(114, 114, 114);
                        line-height: 3vh;
                        font-size: calc(1vh + 0.5vw);
                        font-weight: 600;
                        font-family: 'Microsoft YaHei';
                    }

                    div.information-item-content {
                        width: 100%;
                        height: 100%;
                    }

                }
            }
        }

        div.model-data-container {
            display: flex;
            width: 70vw;
            height: 86vh;
            justify-content: center;
            align-items: center;
            background-color: rgb(160, 38, 150);

            div.model-data-wrapper {
                // position: relative;
                display: flex;
                flex-wrap: wrap;
                // flex-direction: col;
                width: 99%;
                height: 98%;
                background-color: rgb(192, 185, 165);

                div.model-data-item {
                    width: 50%;
                    height: 50%;
                    background-color: aquamarine;

                    div.data-item-title {
                        width: 100%;
                        height: 10%;
                        font-size: calc(0.5vh + 1vw);
                        font-weight: 600;
                        font-family: 'Microsoft YaHei';
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