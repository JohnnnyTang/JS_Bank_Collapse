<template>
    <div class="model-card-container">
        <div class="model-card-wrapper">
            <div
                class="model-card"
                :class="[infoItem.firstPage ? 'inactive' : 'active']"
                @click="changeactive"
            >
                <div class="model-card-inwrapper">
                    <div class="model-title-container">
                        <div class="image-wrapper">
                            <div class="image-div">
                                <img :src="infoItem.picsrc" alt="模型图标">
                            </div>
                        </div>
                        <div class="title-text-container">
                            {{ infoItem.name }}
                        </div>
                    </div>
                    <div class="model-content-container">
                        <div class="model-content-text">
                            {{ infoItem.description }}
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="model-card"
                :class="[infoItem.firstPage ? 'active' : 'inactive']"
                @click="changeactive"
            >
                <div class="model-card-inwrapper second">
                    <div class="model-title-container second">
                        <div class="title-text-container second">
                            {{ infoItem.name }}
                        </div>
                    </div>
                    <div class="model-content-container second">
                        <div class="content-item-container">
                            <div class="content-item-title">
                                应用分类
                            </div>
                            <div class="content-item-text">
                                {{ infoItem.application }}
                            </div>
                        </div>
                        <div class="content-item-container">
                            <div class="content-item-title">
                                使用场景
                            </div>
                            <div class="content-item-text">
                                {{ infoItem.usescene }}
                            </div>
                        </div>
                        <div class="content-item-container">
                            <div class="content-item-title">
                                输入参数
                            </div>
                            <div class="content-item-text">
                                {{ infoItem.input }}
                            </div>
                        </div>
                        <div class="content-item-container">
                            <div class="content-item-title">
                                输出结果
                            </div>
                            <div class="content-item-text">
                                {{ infoItem.output }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div 
                class="see-more-button"
                @click="Detail"
                :class="[infoItem.firstPage ? 'inactive' : 'active']"
            >
                <div class="button-text">模型详情</div>
                <div class="button-arrow"></div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const props = defineProps({
    infoItem: {
        type: Object,
    },
})

// 卡片激活效果
const infoItem = ref(props.infoItem)
// const isactive = () => {
//     infoItem.value.firstPage = true
// }
// const notactive = () => {
//     infoItem.value.firstPage = false
// }
const changeactive = () => {
    infoItem.value.firstPage = !infoItem.value.firstPage
}

// 路由设置
const router = useRouter()
const Detail = () => {
    router.push('/modelStore/'+ infoItem.value.routerPath)
}

</script>
  
<style lang="scss" scoped>
div.model-card-container {
    width: 50vw;
    height: 50vh;

    div.model-card-wrapper {
        // width: 23vw;
        // height: 78vh;
        // position: relative;
        // left: 2vw;
        // top: 0vh;
        display: flex; /* 使用 flex 布局使卡片横向排列 */
        align-items: space-between;
        justify-content: space-between; /* 在父容器内平均分布每个卡片 */
        width: calc(45vw + 5vw); /* 计算容器宽度，包括卡片和间距 */
        height: calc(39vh + 0.5vh);
        position: relative;
        left: 2vw;
        right: 2vw;
        top: 4.8vh;

        div.model-card {
            width: 45vw;
            height: 39vh;
            position: relative;
            background-color: aliceblue;
            border-radius: 10px;
            box-shadow: 0px 8px 40px -10px rgba(0, 0, 0, 0.8);
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-content: flex-start;
            transition: all 0.25s ease;

            &.active {
                opacity: 1;
                z-index: 2;
                cursor: pointer;
                &:hover {
                    transform: scale(1.02);
                }
                // div.image-wrapper {
                //    opacity: 0;
                // }
            }

            &.inactive {
                position: absolute;
                opacity: 0.75;
                top: 0;
                right: 4vw;
                top: -1.25vh;
                z-index: 1;
                cursor: pointer;

                &:hover {
                    transform: translate(0.1vw, -1.2vh) rotate(3deg);
                }
                div.see-more-button,
                div.model-content-container,
                div.image-wrapper {
                   opacity: 1;
                }
            }
            
            div.model-card-inwrapper {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;

                &.second {
                    flex-direction: column;
                }
                
                div.model-title-container {
                    display: flex;
                    flex-direction: column;
                    width: 50%;
                    height: 100%;

                    &.second {
                        width: 100%;
                        height: 15%;
                    }

                    div.image-wrapper {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        -webkit-transition: all 0.25s ease;
                        -moz-transition: all 0.25s ease;
                        -o-transition: all 0.25s ease;
                        transition: all 0.25s ease;
                        // will-change: transform;
                        // margin-top: 2vh;
                        height: 85%;

                        div.image-div {
                            width: 90%;
                            height: 90%;
                            margin-top: 4%;
                            -webkit-box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                            -moz-box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                            box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                            // margin-bottom: 2vh;
                            user-select: none;
                            overflow: hidden;
                            -webkit-transition: all 0.25s ease;
                            -moz-transition: all 0.25s ease;
                            -o-transition: all 0.25s ease;
                            transition: all 0.25s ease;
                            border: rgb(235, 232, 232) 3.5px solid;

                            img {
                                object-fit: cover;
                                width: 100%;
                                height: 100%;
                                filter: contrast(1.1) hue-rotate(12deg) brightness(0.9)
                                    saturate(0.8);
                                border-radius: 10px;
                            }
                        }
                    }

                    div.title-text-container {
                        width: 100%;
                        height: 20%;
                        line-height: 5vh;

                        font-size: calc(1.6vh + 1.0vw);
                        font-weight: 600;
                        font-family: 'Microsoft YaHei';
                        text-align: center;
                        // border-top: 3px solid #9d5fd8;

                        &.second {
                            height: 100%;
                            width: 100%;
                            font-size: calc(1.5vh + 0.8vw);
                        }
                    }
                }

                div.model-content-container {
                    display: flex;
                    justify-content: center;
                    width: 48%;
                    height: 90%;
                    margin-right: 2%;
                    border: 3px dashed rgb(202, 148, 202);
                    border-radius: 15px;
                    line-height: 3vh;
                    text-align: left;
                    
                    &.second {
                        width: 100%;
                        border: 0px;
                        text-align: center;
                        margin-right: 0;
                        flex-wrap: wrap;
                        justify-content: space-between;
                    }

                    div.model-content-text {
                        width: 90%;
                        height: 90%;
                        margin-top: 5%;
                        margin-left: 5.5%;
                        font-size: calc(0.8vh + 0.7vw);
                        font-weight: 400;
                        font-family: 'Microsoft YaHei';
                        // color: #9518ae;
                    }

                    div.content-item-container {
                        display: flex;
                        flex-direction: column;
                        height: 48%;
                        width: calc(50% - 2%);
                        border-top: 3px dashed rgb(202, 148, 202);

                        div.content-item-title {
                            position: relative;
                            width: 100%;
                            height: 20%;
                            line-height: 4vh;
                            left: -7.5vw;
                            margin-bottom: 10px;
                            // background-color: aquamarine;
                            // color: #0050b1;
                            background: linear-gradient(
                                to right,
                                #c8beca 0%,
                                #881096 100%
                            );
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;

                            font-size: calc(1.2vh + 0.6vw);
                            font-weight: 600;
                            font-family: 'Microsoft YaHei';
                        }

                        div.content-item-text {
                            width: 90%;
                            height: 90%;
                            margin-left: 3%;
                            line-height: 3vh;
                            // background-color: bisque;
                            color: #5467e2;

                            font-size: calc(0.7vh + 0.65vw);
                            // font-weight: 600;
                            font-family: 'Microsoft YaHei';
                            text-align: left;
                        }
                    }
                }
            }
        }

        div.see-more-button {
            position: absolute;
            width: 8.5vw;
            height: 5vh;
            line-height: 5vh;
            // background-color: aquamarine;
            bottom: -2vh;
            right: 7vw;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            z-index: 4;

            border-radius: 10px;
            column-gap: 0.4vw;

            background: linear-gradient(to right, #5467e2 0%, #71b0eb 50%, #74deec 100%);
            color: #fff;
            transition: all 0.4s cubic-bezier(0.68, -0.45, 0.265, 1.45);
            &:hover {
                cursor: pointer;
                right: 5vw;
                column-gap: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.45, 0.265, 1.45);
            }

            div.button-text {
                width: 5.5vw;
                height: 5vh;
                // background-color: aqua;
                font-size: calc(0.5vh + 0.6vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
            }

            div.button-arrow {
                width: 1.5vw;
                height: 3vh;
                background-image: url('/right-arrow.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;
                // background-color: azure;
            }

            // &.inactive {
            //     display: none;
            // }
        }
    }
}
</style>