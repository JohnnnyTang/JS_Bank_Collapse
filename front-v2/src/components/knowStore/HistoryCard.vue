<template>
    <div class="knowledge-card-container">
        <div class="knowledge-card-wrapper">
            <div
                class="knowledge-card"
                :class="[infoItem.firstPage ? 'active' : 'inactive']"
                @click="changeInfoPage()"
            >
                <div class="image-wrapper">
                    <div class="image-div">
                        <img
                            :src="'/崩岸' + (index % 3) + '.png'"
                            alt="崩岸照片"
                        />
                    </div>
                </div>
                <div class="knowledge-title-container">
                    {{
                        (infoItem.river || '') +
                        '-' +
                        (infoItem.district || '') +
                        '-' +
                        (infoItem.place || '') +
                        '崩岸'
                    }}
                </div>
                <div class="knowledge-content-container">
                    <div class="content-row-container">
                        <div class="content-item-container left">
                            <div class="content-item-title">时间</div>
                            <div class="content-item-text time">
                                {{ infoItem.time || '无数据' }}
                            </div>
                        </div>
                        <div class="content-item-container right">
                            <div class="content-item-title">类别</div>
                            <div
                                class="content-item-text"
                                :class="{
                                    'no-data': infoItem.type === null,
                                }"
                            >
                                {{ infoItem.type || '无数据' }}
                            </div>
                        </div>
                    </div>
                    <div class="content-row-container">
                        <div class="content-item-container left">
                            <div class="content-item-title">岸别</div>
                            <div
                                class="content-item-text"
                                :class="{
                                    'no-data': infoItem.side === null,
                                }"
                            >
                                {{ infoItem.side || '无数据' }}
                            </div>
                        </div>
                        <div class="content-item-container right">
                            <div class="content-item-title">口门长度</div>
                            <div
                                class="content-item-text number"
                                :class="{
                                    'no-data': infoItem.length === null,
                                }"
                            >
                                {{ infoItem.length || '无数据' }}
                            </div>
                        </div>
                    </div>
                    <div class="content-row-container">
                        <div class="content-item-container left">
                            <div class="content-item-title">崩窝宽度</div>
                            <div
                                class="content-item-text number"
                                :class="{
                                    'no-data': infoItem.width === null,
                                }"
                            >
                                {{ infoItem.width || '无数据' }}
                            </div>
                        </div>
                        <div class="content-item-container right">
                            <div class="content-item-title">岸高</div>
                            <div
                                class="content-item-text number"
                                :class="{
                                    'no-data': infoItem.height === null,
                                }"
                            >
                                {{ infoItem.height || '无数据' }}
                            </div>
                        </div>
                    </div>
                    <div class="content-row-container">
                        <div class="content-item-container left">
                            <div class="content-item-title">宽深比</div>
                            <div
                                class="content-item-text number"
                                :class="{
                                    'no-data': infoItem.ratio === null,
                                }"
                            >
                                {{ infoItem.ratio || '无数据' }}
                            </div>
                        </div>
                        <div class="content-item-container right">
                            <div class="content-item-title">崩塌土方量</div>
                            <div
                                class="content-item-text number"
                                :class="{
                                    'no-data': infoItem.volume === null,
                                }"
                            >
                                {{ infoItem.volume || '无数据' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="see-more-button"
                @click="changeInfoPage()"
                :class="[infoItem.firstPage ? 'active' : 'inactive']"
            >
                <div class="button-text">
                    {{ infoItem.firstPage ? '更多信息' : '基本信息' }}
                </div>
                <div class="button-arrow"></div>
            </div>
            <div
                class="knowledge-card"
                :class="[infoItem.firstPage ? 'inactive' : 'active']"
                @click="changeInfoPage()"
            >
                <div class="knowledge-content-container second">
                    <div class="content-row-container">
                        <div class="content-item-container left">
                            <div class="content-item-title">近岸冲刷</div>
                            <div class="content-item-text number">200</div>
                        </div>
                        <div class="content-item-container right">
                            <div class="content-item-title">近岸坡陡</div>
                            <div class="content-item-text number">1.231</div>
                        </div>
                    </div>
                    <div class="content-row-container">
                        <div class="content-item-container left">
                            <div class="content-item-title">崩窝进口夹角</div>
                            <div
                                class="content-item-text number"
                                :class="{
                                    'no-data': infoItem.angle === null,
                                }"
                            >
                                {{ infoItem.angle || '无数据' }}
                            </div>
                        </div>
                        <div class="content-item-container right">
                            <div class="content-item-title">崩窝窝顶曲率</div>
                            <div
                                class="content-item-text number"
                                :class="{
                                    'no-data': infoItem.curvature1 === null,
                                }"
                            >
                                {{ infoItem.curvature1 || '无数据' }}
                            </div>
                        </div>
                    </div>
                    <div class="content-row-container desc">
                        <div class="content-item-container left">
                            <div class="content-item-title">崩岸新闻描述</div>
                            <el-scrollbar ref="vertScrollBar">
                                <div
                                    class="content-item-text number"
                                    :class="{
                                        'no-data':
                                            infoItem.description === null,
                                    }"
                                    ref="scrollTextDom"
                                    :data-key="index"
                                >
                                    &nbsp;&nbsp;{{
                                        infoItem.description || '无数据'
                                    }}
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    infoItem: {
        type: Object,
    },
    index: {
        type: Number,
        default: 0,
    },
})

const infoItem = ref(props.infoItem)

const changeInfoPage = () => {
    infoItem.value.firstPage = !infoItem.value.firstPage
    // firstPageActive.value = !firstPageActive.value;
}
</script>

<style lang="scss" scoped>
div.knowledge-card-container {
    width: 28vw;
    height: 78vh;
    // line-height: 78vh;
    text-align: center;
    // background-color: antiquewhite;

    // &:first-of-type {
    //     margin-left: 10vw;
    // }

    div.knowledge-card-wrapper {
        width: 23vw;
        height: 78vh;
        position: relative;
        left: 2vw;
        top: 0vh;
        // background-color: aqua;

        // &:first-child {
        //     margin-left: 3vw;
        // }

        div.knowledge-card {
            width: 19.5vw;
            height: 70vh;
            padding-left: 1vw;
            padding-right: 1vw;
            padding-bottom: 4vh;
            position: relative;
            top: 1.5vh;

            background-color: aliceblue;

            border-radius: 6px;
            box-shadow: 0px 8px 40px -10px rgba(0, 0, 0, 0.8);
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-content: flex-start;
            transition: all 0.25s ease;

            &.active {
                opacity: 1;
                z-index: 3;
            }

            &.inactive {
                position: absolute;
                opacity: 0.75;
                top: 0;
                right: 0;
                z-index: 1;
                cursor: pointer;

                &:hover {
                    transform: translate(0.1vw, -1.2vh) rotate(3deg);
                }

                div.see-more-button,
                div.knowledge-content-container,
                div.image-wrapper {
                    opacity: 0;
                }
            }

            div.image-wrapper {
                -webkit-transition: all 0.25s ease;
                -moz-transition: all 0.25s ease;
                -o-transition: all 0.25s ease;
                transition: all 0.25s ease;
                will-change: transform;
                margin-top: 2vh;
                height: 29vh;

                div.image-div {
                    width: calc(100% + 15%);
                    -webkit-transform: translate(-10%, 0);
                    -moz-transform: translate(-10%, 0);
                    -o-transform: translate(-10%, 0);
                    -ms-transform: translate(-10%, 0);
                    transform: translate(-16%, 0);
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
                        border-radius: 6px;
                    }
                }
            }

            div.knowledge-title-container {
                width: 100%;
                height: 4vh;
                line-height: 2vh;
                // background-color: aqua;

                font-size: calc(0.5vh + 0.8vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                border-bottom: 3px solid #0205a3;

                // background: linear-gradient(
                //     to right,
                //     #36e2e2 0%,
                //     #6420b9 100%
                // );
                // -webkit-background-clip: text;
                // -webkit-text-fill-color: transparent;
            }

            div.knowledge-content-container {
                width: 100%;
                height: 34vh;
                // background-color: aqua;

                display: flex;
                flex-flow: row wrap;
                align-content: space-around;

                &.second {
                    height: 70vh;
                    // background-color: #2bc5fc;
                }

                div.content-row-container {
                    width: 80%;
                    height: 8vh;
                    margin-left: 6%;
                    margin-right: 6%;
                    padding-left: 4%;
                    padding-right: 4%;
                    // background-color: rgb(92, 125, 154);
                    border-bottom: 2px solid #0018a3;

                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;

                    div.content-item-container {
                        height: 8vh;
                        width: 48%;

                        // background-color: rgb(63, 109, 149);

                        div.content-item-title {
                            width: 100%;
                            height: 4vh;
                            line-height: 4vh;
                            // background-color: aquamarine;
                            // color: #0050b1;
                            background: linear-gradient(
                                to right,
                                #064fec 0%,
                                #14129e 100%
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
                            color: #045ed4;

                            font-size: calc(0.5vh + 0.65vw);
                            // font-weight: 600;
                            font-family: 'Microsoft YaHei';

                            &.number {
                                font-family: 'Trebuchet MS';
                            }

                            &.no-data {
                                opacity: 0.5;
                            }

                            &.time {
                                font-size: calc(0.5vh + 0.55vw);
                            }
                        }

                        &.left {
                            text-align: left;
                        }

                        &.right {
                            text-align: right;
                        }
                    }

                    &.desc {
                        width: 100%;
                        height: 50vh;
                        // background-color: aqua;
                        justify-content: center;
                        padding-left: 5%;
                        padding-right: 5%;
                        border-radius: 6px;
                        border-style: solid;
                        border-color: #7497c0d0;

                        .el-scrollbar {
                            top: 0;
                            height: 46vh;
                        }

                        div.content-item-container {
                            height: 50vh;
                            width: 100%;
                            // background-color: #3011d4;

                            div.content-item-title {
                                text-align: center;
                            }

                            div.content-item-text {
                                text-align: left;
                                height: 46vh;
                            }
                        }
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
            bottom: 0.6vh;
            right: 2.8vw;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            z-index: 4;

            border-radius: 6px;
            column-gap: 0.4vw;

            background: linear-gradient(135deg, #3011d4 0%, #0453fd 100%);
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
