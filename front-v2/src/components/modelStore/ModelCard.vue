<template>
    <div class="model-card-container">
        <div class="model-card-wrapper">
            <div
                class="model-card"
                :class="[infoItem.firstPage ? 'inactive' : 'active']"
                @mouseover="isactive"
                @mouseleave="notactive"
            >
                <div class="image-wrapper">
                    <div class="image-div">
                        <img :src="'/model.png'" alt="模型图标">
                    </div>
                </div>
                <div class="model-title-container">
                    {{ infoItem.name }}
                </div>
                <div class="model-content-container">
                    <div class="model-content-text">
                        {{ infoItem.description }}
                    </div>
                </div>
            </div>
            <div
                class="model-card"
                :class="[infoItem.firstPage ? 'active' : 'inactive']"
                @mouseover="isactive"
                @mouseleave="notactive"
            >
                <div class="model-title-container second">
                    {{ infoItem.name }}
                </div>
                <div class="model-content-container second">
                    <div class="content-item-container">
                        <div class="content-item-title">
                            应用分类
                        </div>
                        <div class="content-item-text">
                            这里是应用分类#这里是应用分类#这里是应用分类#这里是应用分类
                        </div>
                    </div>
                    <div class="content-item-container">
                        <div class="content-item-title">
                            使用场景
                        </div>
                        <div class="content-item-text">
                            这里是使用场景#这里是使用场景#这里是使用场景#这里是使用场景
                        </div>
                    </div>
                    <div class="content-item-container">
                        <div class="content-item-title">
                            输入参数
                        </div>
                        <div class="content-item-text">
                            这里是输入参数#这里是输入参数#这里是输入参数#这里是输入参数
                        </div>
                    </div>
                    <div class="content-item-container">
                        <div class="content-item-title">
                            输出结果
                        </div>
                        <div class="content-item-text">
                            这里是输出结果#这里是输出结果#这里是输出结果#这里是输出结果
                        </div>
                    </div>
                </div>
            </div>
            <div 
                class="see-more-button"
                @click="Detail"
                :class="[infoItem.firstPage ? 'inactive' : 'active']"
            >
                <div class="button-text">模型计算</div>
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

// const SoilAnalysis = () => {
//     router.push('/modelStore/soilAnalysis')
// }
// const StabilityAnalysis = () => {
//     router.push('/modelStore/stabilityAnalysis')
// }
// const RiskWarning = () => {
//     router.push('/modelStore/riskWarning')
// }

// 卡片激活效果
const infoItem = ref(props.infoItem)
const isactive = () => {
    infoItem.value.firstPage = true
}
const notactive = () => {
    infoItem.value.firstPage = false
}

// 路由设置
const router = useRouter()
const Detail = () => {
    router.push('/modelStore/'+ infoItem.value.routerPath)
}

</script>
  
<style lang="scss" scoped>
div.model-card-container {
    width: 28vw;
    height: 78vh;
    text-align: center;

    div.model-card-wrapper {
        // width: 23vw;
        // height: 78vh;
        // position: relative;
        // left: 2vw;
        // top: 0vh;
        display: flex; /* 使用 flex 布局使卡片横向排列 */
        flex-wrap: nowrap; /* 不换行 */
        justify-content: space-between; /* 在父容器内平均分布每个卡片 */
        width: calc(18vw + 4vw); /* 计算容器宽度，包括卡片和间距 */
        height: 80vh;
        position: relative;
        left: 2vw;
        right: 2vw;
        top: 3vh;

        div.model-card {
            width: 18vw;
            height: 70vh;
            padding-left: 1vw;
            padding-right: 1vw;
            padding-bottom: 4vh;
            position: relative;
            top: 1.5vh;

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
                // div.image-wrapper {
                //    opacity: 0;
                // }
            }

            &.inactive {
                position: absolute;
                opacity: 0.75;
                top: 0;
                right: 15px;
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

            div.image-wrapper {
                -webkit-transition: all 0.25s ease;
                -moz-transition: all 0.25s ease;
                -o-transition: all 0.25s ease;
                transition: all 0.25s ease;
                // will-change: transform;
                margin-top: 2vh;
                height: 29vh;

                div.image-div {
                    width: calc(100% + 15%);
                    -webkit-transform: translate(-10%, 0);
                    -moz-transform: translate(-10%, 0);
                    -o-transform: translate(-10%, 0);
                    -ms-transform: translate(-10%, 0);
                    transform: translate(-7%, 0);
                    height: 28vh;
                    -webkit-box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                    -moz-box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                    box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                    margin-bottom: 2vh;
                    user-select: none;
                    overflow: hidden;
                    -webkit-transition: all 0.25s ease;
                    -moz-transition: all 0.25s ease;
                    -o-transition: all 0.25s ease;
                    transition: all 0.25s ease;

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

            div.model-title-container {
                width: 100%;
                height: 6vh;
                line-height: 5vh;
                // background-color: aqua;

                font-size: calc(1vh + 0.8vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                // border-top: 3px solid #9d5fd8;

                &.second {
                    margin-top: 30px;
                    height: 5vh;
                    font-size: calc(1.5vh + 0.8vw);
                }
            }

            div.model-content-container {
                width: 100%;
                height: 30vh;
                padding: 20px;
                border: 3px dashed rgb(202, 148, 202);
                border-radius: 15px;
                
                &.second {
                    border: 0px;
                }

                div.content-item-container {
                    height: 15vh;
                    width: 100%;
                    border-top: 3px dashed rgb(202, 148, 202);

                    div.content-item-title {
                        position: relative;
                        width: 100%;
                        height: 3vh;
                        line-height: 4vh;
                        left: -6vw;
                        // background-color: aquamarine;
                        // color: #0050b1;
                        background: linear-gradient(
                            to right,
                            #c8beca 0%,
                            #881096 100%
                        );
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;

                        font-size: calc(0.8vh + 0.6vw);
                        font-weight: 600;
                        font-family: 'Microsoft YaHei';
                    }

                    div.content-item-text {
                        width: 100%;
                        height: 4vh;
                        line-height: 4vh;
                        // background-color: bisque;
                        color: #5467e2;

                        font-size: calc(0.5vh + 0.65vw);
                        // font-weight: 600;
                        font-family: 'Microsoft YaHei';
                    }
                }
            }
        }

        div.see-more-button {
            position: absolute;
            width: 7vw;
            height: 5vh;
            line-height: 5vh;
            // background-color: aquamarine;
            bottom: 1.4vh;
            right: 3vw;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            z-index: 4;

            border-radius: 10px;
            column-gap: 0.4vw;

            background: linear-gradient(135deg, #a84d8d 0%, #bcc3c5 100%);
            color: #fff;
            transition: all 0.4s cubic-bezier(0.68, -0.45, 0.265, 1.45);
            &:hover {
                cursor: pointer;
                right: 1.8vw;
                column-gap: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.45, 0.265, 1.45);
            }

            div.button-text {
                width: 4.5vw;
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