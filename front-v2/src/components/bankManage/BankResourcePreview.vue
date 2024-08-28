<template>
    <div class="bank-resouce-create-container">
        <div class="desc-box-container">
            <div class="title-container">民主沙右缘-基础信息</div>
            <div class="detail-content-container">
                <div class="detail-box-item" v-for="(item, index) in mzsInfo" :key="index" :class="item.type">
                    <div class="detail-key">{{ item.key }}</div>
                    <div class="detail-val" v-if="item.type.includes('two-row')">
                        <div class="detail-val-row">
                            {{ item.val.split(item.splitter)[0] }}
                        </div>
                        <div class="detail-val-row">
                            {{ item.val.split(item.splitter)[1] }}
                        </div>
                    </div>
                    <div class="detail-val" v-else>{{ item.val }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as testData from './basicBankInfo.json'



onMounted(() => {
    console.log(testData)
})


</script>

<style lang="scss" scoped>
div.bank-resouce-create-container {
    position: absolute;
    left: 12vw;
    top: 1vh;

    width: 87vw;
    height: 88.5vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    margin-left: 0.5vw;
    padding-right: 0.5vw;

    border-radius: 12px;
    // margin-bottom: 1vh;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    background-color: rgb(0, 225, 255);

    div.desc-box-container {
        width: 43vw;
        height: 90vh;

        margin-top: 1vh;
        margin-bottom: 1vh;
        margin-left: 0.5vw;
        margin-right: 0.5vw;

        background-color: aliceblue;
        border: 2px solid #7aa8ff;

        border-radius: 12px;

        box-shadow: 10px 12px 20px -10px rgba(0, 0, 0, 0.8);

        overflow: hidden;

        div.title-container {
            width: 42vw;
            height: 7vh;
            margin-left: 0.5vw;

            line-height: 7vh;

            text-align: center;

            font-size: calc(1vw + 1vh);
            font-weight: bold;

            border-bottom: 4px solid #0040a0;
            color: #001d7a;
        }

        div.detail-content-container {
            width: 38vw;
            margin-left: 2.5vw;
            // padding-right: 0.5vw;
            height: calc(83vh - 4px);

            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-content: flex-start;
            row-gap: 3vh;

            div.detail-box-item {
                width: 19vw;
                height: 16vh;
                font-size: calc(0.8vw + 0.8vh);
                border-bottom: 3px solid rgb(31, 123, 209);

                div.detail-key {
                    height: 8vh;
                    line-height: 8vh;
                    font-weight: bold;
                    font-size: calc(0.8vw + 1vh);
                    color: #002397;
                }

                div.detail-val {
                    height: 8vh;
                    line-height: 8vh;

                    div.detail-val-row {
                        height: 4vh;
                        line-height: 4vh;
                    }
                }

                &.single {
                    width: 38vw;
                }

                &.long-text {
                    height: 24vh;

                    div.detail-val {
                        line-height: normal;
                        height: 16vh;
                    }
                }

                &.left {
                    text-align: left;
                }

                &.right {
                    text-align: right;
                }
            }

            div.change-button-container {
                position: relative;
                width: 8vw;
                height: 4vh;
                top: 2vh;
                left: 30vw;

                // background-color: #0040a0;

                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;

                text-align: center;
                font-weight: bold;
                font-size: calc(0.8vw + 0.4vh);

                div.change-button {
                    width: 8vw;
                    height: 4vh;
                    line-height: 4vh;
                    border-radius: 6px;

                    background-color: #b4ddff;
                    transition: all 0.2s ease-in-out;

                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 2px 2px,
                        rgba(0, 119, 255, 0.6) 3px 3px;

                    &.modify {
                        width: 3.2vw;
                    }

                    &:hover {
                        cursor: pointer;
                        transform: translate3d(2px, 2px, 2px);
                        color: #0539a8;
                        box-shadow:
                            rgba(0, 132, 255, 0.8) 1px 1px,
                            rgba(0, 119, 255, 0.7) 2px 2px,
                            rgba(0, 119, 255, 0.6) 3px 3px,
                            rgba(0, 119, 255, 0.4) 4px 4px;
                    }
                }

                div.cancel-button {
                    width: 3.2vw;
                    height: 4vh;
                    line-height: 4vh;
                    transition: all 0.6s ease-in-out;

                    border-radius: 6px;
                    color: #f0f8ff;
                    background-color: #2358eb;
                    box-shadow:
                        rgba(29, 142, 248, 0.8) 1px 1px,
                        rgba(26, 133, 255, 0.7) 2px 2px,
                        rgba(25, 132, 255, 0.6) 3px 3px;

                    &:hover {
                        cursor: pointer;
                        color: #85f7ff;
                        transform: translate3d(2px, 2px, 2px);
                        box-shadow:
                            rgba(29, 142, 248, 0.8) 1px 1px,
                            rgba(26, 133, 255, 0.7) 2px 2px,
                            rgba(25, 132, 255, 0.6) 3px 3px,
                            rgba(35, 138, 255, 0.4) 4px 4px;
                    }
                }
            }

            // background-color: antiquewhite;
        }
    }
}
</style>