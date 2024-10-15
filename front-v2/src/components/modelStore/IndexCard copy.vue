<template>
    <div class="card">
        <div class="index-content">
            <div class="index-content-title">
                <div class="content-title-icon">
                    <img src="/index.png" alt="index">
                </div>
                <div class="content-title-text">
                    {{ title }}
                </div>
            </div>
            <div class="index-content-description">
                <div class="content-description-text">
                    这里是指标描述#这里是指标描述#这里是指标描述
                </div>
            </div>
            <div class="index-content-chart">
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title:String,
    data:Object
})
const title=props.title

import { onMounted, ref } from "vue";

const main = ref(null);


</script>

<style lang="scss" scoped>
div.part1-card {
    min-width: 23vw;
    height: 90%;
    margin: 15px;
    padding: 8px;
    border: 4px solid #6e9bc7;
    border-radius: 10px;
    background: rgba(220,250,239,0.4);
    overflow: hidden;
    box-shadow: #b4c8fc 5px 1px 8px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.5s;
    user-select: none;
    &:hover {
        transform: scale(1.01);
        cursor: pointer;
    }

    div.index-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        border-radius: 10px;

        div.index-content-title {
            display: flex;
            flex-direction: row;
            margin-left: 5px;
            width: 35%;
            height: 10%;
            border-bottom: #a231e4 3px solid;

            div.content-title-icon {
                width: 40px;
                height: 40px;

                img {
                    width: 100%;
                    height: 100%;
                    margin-left: 2px;
                    margin-top: 2px;
                }
            }

            div.content-title-text {
                margin-left: 12px;
                font-size: calc(1vh + 1vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                color: #a231e4;
                text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
            }
        }

        div.index-content-description {
            width: 100%;
            height: 10%;
            border: #a9dce2 2px solid;
            border-radius: 10px;
            margin-top: 7px;
            margin-bottom: -10px;

            div.content-description-text {
                width:100%;
                height: 100%;
                margin-left: 5px;
                margin-top: 2px;
                margin-right: 5px;
                margin-bottom: 2px;
                font-size: calc(0.5vh + 0.5vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                color: #a231e4;
            }
        }

        div.index-content-chart {
            width: 100%;
            height: 80%;
        }
    }
}
</style>
