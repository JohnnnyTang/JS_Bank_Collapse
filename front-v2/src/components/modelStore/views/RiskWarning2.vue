<template>
    <div class="riskWarning-container">
        <ModelTitleVue :ModelName="'风险预警模型'" v-on:confirm-bank="confirmBankHandler" />
        <div class="model-content-container">
            <div class="model-content flex-coloum" style="align-items: center;">
                <div class="flex-row" style="position: relative; width: 86vw; height: 35vh; margin: 1vh 1vw;">
                    <div class="card soil">
                        <div class="title"><span style="margin-left: 1vw;">土壤参数</span></div>
                        <div class="content flex-coloum" style="justify-content: space-evenly; align-items: center;">
                            <div class="key-value">
                                <div class="key">下伏沙土层厚度</div>
                                <div class="value">
                                    <input type="number" name="">
                                </div>
                            </div>
                            <div class="key-value">
                                <div class="key">上覆粘土层厚度</div>
                                <div class="value">
                                    <input type="number" name="">
                                    <!-- <span>m</span> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card level">
                        <div class="title"><span style="margin-left: 1vw;"></span>分级参数</div>
                        <div class="content flex-coloum" style="justify-content: space-evenly; align-items: center;">
                            <div class="key-value">
                                <div class="key">保护等级：</div>
                                <div class="value">
                                    <select name="" id="">
                                        <option value="systemic">系统级保护</option>
                                        <option value="normal">常规级保护</option>
                                        <option value="low">低等级保护</option>
                                        <option value="no">无保护</option>
                                    </select>
                                </div>
                            </div>
                            <div class="key-value">
                                <div class="key">控制等级：</div>
                                <div class="value">
                                    <select name="" id="">
                                        <option value="strict">严格控制</option>
                                        <option value="normal">常规控制</option>
                                        <option value="low">微控制</option>
                                        <option value="no">无控制</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="title">地形参数</div>
                        <div class="content">
                            <div class="key-value">
                                <div class="key">判别计算地形：</div>
                                <div class="value">
                                    <input type="number" name="">
                                </div>
                            </div>
                            <div class="key-value">
                                <div class="key">冲淤起算地形：</div>
                                <div class="value">
                                    <input type="number" name="">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="title">水文参数</div>
                        <div class="content">
                            <div class="key-value">
                                <div class="key">流量：</div>
                                <div class="value">
                                    <input type="number" name="">
                                </div>
                            </div>
                            <div class="key-value">
                                <div class="key">潮型：</div>
                                <div class="value">
                                    <select name="" id="">
                                        <option value="dc">大潮</option>
                                        <option value="zc">中潮</option>
                                        <option value="xc">小潮</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="title">时间设置</div>
                        <div class="content">
                            <div class="key-value">
                                <div class="key">当前时间：</div>
                                <div class="value">
                                    <input type="number" name="">
                                </div>
                            </div>
                            <div class="key-value">
                                <div class="key">对比时间：</div>
                                <div class="value">
                                    <input type="number" name="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useMultiIndexStore } from '@/store/multiIndexStore'
import { onMounted, onUnmounted, ref } from 'vue'
import ModelTitleVue from '../ModelTitle.vue'

// variables
const curRunModelName = ref('评估断面选择')



// handlers
const confirmBankHandler = async (bankName) => {
    console.log('confirmBankHandler', bankName)
    const bankNameMap = {
        '民主沙': 'Mzs'
    }
    mapFlyToRiver(mapStore.getMap(map), bankName)
    selectedBank.value = bankName
    ElNotification({
        type: 'success',
        title: '选择岸段',
        message: `已选择岸段——${bankName},模型计算将默认采用${bankName}相关资源`,
        offset: 180
    })
}




// logics




// lifecycle
onMounted(() => {

})
onUnmounted(() => {

})
// helpers


</script>

<style lang="scss" scoped>
div.flex-coloum {
    display: flex;
    flex-direction: column;
}

div.flex-row {
    display: flex;
    flex-direction: row;
}

div.one-center {
    position: relative;
    display: grid;
    place-items: center;
}

div.card {
    position: relative;
    width: 99%;
    height: 97%;
    border-radius: 5px;
    // background-color: rgb(226, 242, 255);
    display: flex;
    flex-direction: column;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;

    &.border {
        width: 98%;
        border-top: #05527944 solid 1px;
        border-left: #05527950 solid 1px;
        border-right: #05527952 solid 2px;
        border-bottom: #05527952 solid 2px;
        margin-top: .5vh;
    }

    &.soil {
        position: absolute;
        left: 0;
        top: 0;
        width: 15vw;
        height: 20vh;
        // background-color: #ffffff;
    }

    &.level {
        position: absolute;
        left: 16vw;
        top: 0;
        width: 15vw;
        height: 20vh;
    }

    div.title {
        position: relative;
        width: 100%;
        // height: 20%;
        height: 4vh;
        line-height: 4vh;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        font-size: calc(0.8vw + 0.9vh);
        font-weight: bold;
        text-align: left;
        // margin-left: 1vw;
        color: #366ec2;
        border-bottom: #364f7ea1 solid 2px;
        // background-color: rgb(243, 243, 243);

    }

    div.content {
        position: relative;
        width: 100%;
        // height: 75%;
        flex-grow: 1;

        // background-color: antiquewhite;
    }

    div.desc {
        position: relative;
        width: 100%;
        height: 100%;
        font-size: calc(0.6vw + 0.8vh);
        font-weight: 600;
        background-color: #ffffffbb;
        backdrop-filter: blur(20px);
    }
}

div.key-value {

    display: flex;
    flex-direction: row;
    height: 4vh;
    justify-content: center;
    align-items: center;

    div.key {
        border: none !important;
        border-right: 2px solid rgb(2, 143, 199) !important;
        border-bottom: 1px solid rgb(5, 88, 121) !important;
        border-radius: 0px;
        text-align: center;
        height: 3vh;
        line-height: 3vh;
        background-color: rgb(255, 255, 255);

        padding: 0px 10px;
        display: grid;
        place-items: center;
        font-size: calc(0.6vw + 0.8vh);
        transition: .3s ease-in-out;
        margin-right: .5vw;

    }

    div.value {

        div {}

        input {
            height: 2.8vh;
            width: 3vw;

            border: none !important;
            border-right: 2px solid rgb(2, 143, 199) !important;
            border-bottom: 1px solid rgb(5, 88, 121) !important;
            border-radius: 5px;
            text-align: center;
            background-color: rgb(212, 213, 255);

            display: grid;
            place-items: center;
            font-size: calc(0.4vw + 0.4vh);
            transition: .3s ease-in-out;

            // &:hover {
            //     background-color: rgb(44, 61, 212);
            //     color: white;
            //     font-weight: bold;
            // }
            &:focus {
                background-color: rgb(3, 4, 95);
                color: white;
                font-weight: bold;
            }
        }

        select {

            option {}
        }
    }


}






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

div.riskWarning-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    flex-direction: column;
    background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
    background-size: 200% 200%;
    animation: slideBackgroundColor 4s ease infinite;

    div.model-content-container {
        width: 100vw;
        height: 85vh;
        padding-top: 1vh;
        overflow: hidden;
        display: flex;
        flex-flow: column wrap;
        justify-content: space-around;
        align-content: space-around;
        // background-color: #477ab1;

        div.model-content {
            position: relative;
            width: 87vw;
            height: 85vh;
            padding: 3px;
            border-radius: 5px;
            overflow: hidden;
            background-color: #c0deff;
        }
    }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>
