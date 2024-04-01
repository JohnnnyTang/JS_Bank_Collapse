<template>
    <div class="model-information-container">
        <div class="model-information-wrapper">
            <div class="information-container">
                <div class="information-title">
                    <div class="information-title-icon">
                        <img src="/information.png" alt="information">
                    </div>
                    <div class="information-title-text">
                        模型基本信息
                    </div>
                </div>
                <div class="information-content">
                    <div class="information-wrapper">
                        <div class="information-item">
                            <div class="information-item-title">
                                <div class="item-title-icon">
                                    <img src="/model-information.png" alt="info">
                                </div>
                                <div class="item-title-text">
                                    模型应用分类
                                </div>
                            </div>
                        </div>
                        <div class="information-item">
                            <div class="information-item-title">
                                <div class="item-title-icon">
                                    <img src="/model-information.png" alt="info">
                                </div>
                                <div class="item-title-text">
                                    模型使用场景
                                </div>
                            </div>
                        </div>
                        <div class="information-item">
                            <div class="information-item-title">
                                <div class="item-title-icon">
                                    <img src="/model-information.png" alt="info">
                                </div>
                                <div class="item-title-text">
                                    模型输入参数
                                </div>
                            </div>
                        </div>
                        <div class="information-item">
                            <div class="information-item-title">
                                <div class="item-title-icon">
                                    <img src="/model-information.png" alt="info">
                                </div>
                                <div class="item-title-text">
                                    模型输出结果
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="process-container">
                <div class="process-title">
                    <div class="process-title-icon">
                        <img src="/process.png" alt="information">
                    </div>
                    <div class="process-title-text">
                        模型使用流程
                    </div>
                </div>
                <div class="process-content">
                    <div class="process-wrapper">
                        <div class="image-div">
                            <img src="/model-process.png" alt="模型流程图">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

div.model-information-container {
    display: flex;
    width: auto;
    height: 86vh;
    justify-content: center;
    align-items: center;
    // background-color: rgb(240, 240, 240);
            
    div.model-information-wrapper {
        width: 98%;
        height: 98%;
        // background-color: rgb(192, 185, 165);

        div.information-container {
            display: flex;
            justify-content: center;
            align-content: center;
            flex-direction: column;
            position: relative;
            width:100%;
            height:49%;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #C9E1F5, #E2FFEE);
            
            border: 3px solid rgb(114, 114, 114);
            border-radius: 5px;
            transition: transform 0.25s ease;
            &:hover {
                cursor: pointer;
                transform: scale(1.01);
            }

            div.information-title {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 5vh;

                div.information-title-icon {
                    width: 3.5vw;
                    height: 5.5vh;
                    margin-left: 5px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                div.information-title-text {
                    width: 100%;
                    line-height: 5vh;
                    font-size: calc(1.5vh + 0.5vw);
                    font-weight: 550;
                    font-family: 'Microsoft YaHei';
                    margin-left: 5px;
                    color: #343c44;
                    text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;   
                }
            }

            div.information-content {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;

                div.information-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    background-color: rgba(246, 250, 249, 0.95);
                    width: 96%;
                    height: 94%;
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
                    border: 1px solid rgb(197, 195, 195);
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

                    div.information-item{
                        width: 95%;
                        height: 25%;
                        border-bottom: 2px solid rgb(144, 175, 204);
                        
                        div.information-item-title{
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            height: 40px;
                            
                            div.item-title-text{
                                width: 100%;
                                line-height: 3vh;
                                font-size: calc(0.8vh + 0.5vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                                margin-left: 5px;
                                color: #343c44;
                            }
                            
                            div.item-title-icon{
                                width: 0.8vw;
                                height: 1.6vh;

                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }

        div.process-container {
            display: flex;
            justify-content: center;
            align-content: center;
            flex-direction: column;
            position: relative;
            width:100%;
            height:49%;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #C9E1F5, #E2FFEE);
            
            border: 3px solid rgb(114, 114, 114);
            border-radius: 5px;
            transition: transform 0.25s ease;
            &:hover {
                cursor: pointer;
                transform: scale(1.01);
            }

            div.process-title {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 5vh;

                div.process-title-icon {
                    width: 3.5vw;
                    height: 5.5vh;
                    margin-left: 5px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                div.process-title-text {
                    width: 100%;
                    line-height: 5vh;
                    font-size: calc(1.5vh + 0.5vw);
                    font-weight: 550;
                    font-family: 'Microsoft YaHei';
                    margin-left: 5px;
                    color: #343c44;
                    text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;   
                }
            }

            div.process-content {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;

                div.process-wrapper {
                    display: flex;
                    flex-wrap: wrap;
                    width: 96%;
                    height: 94%;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    background-color: rgba(246, 250, 249, 0.95);
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
                    border: 1px solid rgb(197, 195, 195);
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

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
}
</style>
