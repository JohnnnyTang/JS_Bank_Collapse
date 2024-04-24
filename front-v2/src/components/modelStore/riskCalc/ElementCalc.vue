<template>
    <div class="element-calc-content model-item-content">
        <div class="weight-set-container">
            <div class="weight-set-title">
                <div class="title-image-container">
                    <img src="/weight_icon.png" alt="权重">
                </div>
                <div class="title-text-container">
                    <div class="title-text">权重配置</div>
                </div>
            </div>
            <div class="weight-set-wrapper">
                <div class="place-holder"></div>
                <div class="main-index-container">
                    <dv-border-box8
                        class="style-1"
                        :dur="5"
                        :color="['rgb(96, 96, 94)', 'rgb(17, 20, 106)']"
                    >
                        <div class="main-index-wrapper">
                            <div class="index-selector">
                                <div class="main-index-text">
                                    主因子选择：
                                </div>
                                <div class="main-index-content">
                                    <el-select
                                        
                                        clearable
                                        v-model="mainIndex"
                                        placeholder="请选择主因子"
                                    >
                                    <el-option
                                        v-for="item in indexes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                    </el-select>
                                </div>
                            </div>
                            <div class="index-shower">
                                <div class="main-index-shower">
                                    <div class="main-index-shower-text">
                                        主因子权重：
                                    </div>
                                    <div class="main-index-shower-content">
                                        <el-input-number
                                            v-model="mainIndexValue"
                                            :step="0.1"
                                            :min="0"
                                            :max="1"
                                            @change="updateMainIndexValue"
                                        />
                                    </div>
                                </div>
                                <div class="another-index-shower">
                                    <div class="another-index-shower-text">
                                        次因子权重：
                                    </div>
                                    <div class="another-index-shower-content">
                                        <el-input-number
                                            v-model="anotherIndexValue"
                                            :step="0.1"
                                            :min="0"
                                            :max="1"
                                            @change="updateAnotherIndexValue"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dv-border-box8>
                </div>
                <div class="velocity-index-container">
                    <dv-border-box8
                        class="style-2"
                        :dur="5"
                        :color="['rgb(96, 96, 94)', 'rgb(140, 255, 255)']"
                        :reverse="true"
                    >
                        <div class="velocity-index-wrapper">
                            <div class="velocity-index-title">
                                <div class="velocity-title-image">
                                    <img src="/velocity_icon.png" alt="">
                                </div>
                                <div class="velocity-title-text">
                                    动力因子分项指标
                                </div>
                            </div>
                            <div class="velocity-index-item1">
                                <div class="velocity-index-item1-text">
                                    造床流量当量指标：
                                </div>
                                <div class="velocity-index-item1-content">
                                    <el-input-number
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                        v-model="velocityIndex1"
                                        style="width: 90%"
                                        placeholder="请输入0-1的指标权重"
                                        clearable
                                        @change="updataVelocityIndex1Value"
                                    />
                                </div>
                            </div>
                            <div class="velocity-index-item2">
                                <div class="velocity-index-item2-text">
                                    流速指标：
                                </div>
                                <div class="velocity-index-item2-content">
                                    <el-input-number
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                        v-model="velocityIndex2"
                                        style="width: 90%"
                                        placeholder="请输入0-1的指标权重"
                                        clearable
                                        @change="updataVelocityIndex2Value"
                                    />
                                </div>
                            </div>
                            <div class="velocity-index-item3">
                                <div class="velocity-index-item3-text">
                                    水位变幅指标：
                                </div>
                                <div class="velocity-index-item3-content">
                                    <el-input-number
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                        v-model="velocityIndex3"
                                        style="width: 90%"
                                        placeholder="请输入0-1的指标权重"
                                        clearable
                                        @change="updataVelocityIndex3Value"
                                    />
                                </div>
                            </div>
                        </div>
                    </dv-border-box8>
                </div>
                <div class="evolve-index-container">
                    <dv-border-box8
                        class="style-2"
                        :dur="5"
                        :color="['rgb(96, 96, 94)', 'rgb(140, 255, 255)']"
                        :reverse="true"
                    >
                        <div class="evolve-index-wrapper">
                            <div class="evolve-index-title">
                                <div class="evolve-title-image">
                                    <img src="/evolve_icon.png" alt="">
                                </div>
                                <div class="evolve-title-text">
                                    演变因子分项指标
                                </div>
                            </div>
                            <div class="evolve-index-item1">
                                <div class="evolve-index-item1-text">
                                    滩槽高差指标：
                                </div>
                                <div class="evolve-index-item1-content">
                                    <el-input-number
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                        v-model="evolveIndex1"
                                        style="width: 90%"
                                        placeholder="请输入0-1的指标权重"
                                        clearable
                                        @change="updataEvolveIndex1Value"
                                    />
                                </div>
                            </div>
                            <div class="evolve-index-item2">
                                <div class="evolve-index-item2-text">
                                    岸坡坡比指标：
                                </div>
                                <div class="evolve-index-item2-content">
                                    <el-input-number
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                        v-model="evolveIndex2"
                                        style="width: 90%"
                                        placeholder="请输入0-1的指标权重"
                                        clearable
                                        @change="updataEvolveIndex2Value"
                                    />
                                </div>
                            </div>
                            <div class="evolve-index-item3">
                                <div class="evolve-index-item3-text">
                                    冲淤变幅指标：
                                </div>
                                <div class="evolve-index-item3-content">
                                    <el-input-number
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                        v-model="evolveIndex3"
                                        style="width: 90%"
                                        placeholder="请输入0-1的指标权重"
                                        clearable
                                        @change="updataEvolveIndex3Value"
                                    />
                                </div>
                            </div>
                        </div>
                    </dv-border-box8>
                </div>
            </div>
        </div>
        <div class="result-show-container"></div>
    </div>
</template>

<script setup>
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
import { ElSelect, ElOption, ElInputNumber } from 'element-plus';
import { ref } from 'vue'
// 因子选择
const indexes = [
    {
        value: 'velocity',
        label: '动力因子',
    },
    {
        value: 'evolve',
        label: '演变因子',
    },
]
const mainIndex = ref("")

// 因子权重
const mainIndexValue = ref(1)
const anotherIndexValue = ref(0)
const updateMainIndexValue = (value) => {
  if (value + anotherIndexValue.value > 1) {
    anotherIndexValue.value = (1 - value).toFixed(3);
  } else {
    anotherIndexValue.value = Math.max(0, 1 - value).toFixed(3);
  }
};
const updateAnotherIndexValue = (value) => {
  if (value + mainIndexValue.value > 1) {
    mainIndexValue.value = (1 - value).toFixed(3);
  } else {
    mainIndexValue.value = Math.max(0, 1 - value).toFixed(3);
  }
};

// 动力因子值
const velocityIndex1 = ref(0.16)
const velocityIndex2 = ref(0.48)
const velocityIndex3 = ref(0.36)
const updataVelocityIndex1Value = (value) => {
    if (velocityIndex2.value!==null && velocityIndex3.value!==null) {
        velocityIndex2.value=null;
        velocityIndex3.value=null;
    } else if (velocityIndex2.value!==null && velocityIndex3.value===null) {
        velocityIndex3.value = (1-value-velocityIndex2.value).toFixed(2);
    } else if (velocityIndex2.value===null && velocityIndex3.value!==null) {
        velocityIndex2.value = (1-value-velocityIndex3.value).toFixed(2);
    } else if (velocityIndex2.value===null && velocityIndex3.value===null) {

    }
    if (velocityIndex1.value+velocityIndex2.value>1){
        velocityIndex2.value = (1-value).toFixed(2);
    }
    if (velocityIndex1.value+velocityIndex3.value>1){
        velocityIndex3.value = (1-value).toFixed(2);
    }
}
const updataVelocityIndex2Value = (value) => {
    if (velocityIndex1.value!==null && velocityIndex3.value!==null) {
        velocityIndex1.value=null;
        velocityIndex3.value=null;
    } else if (velocityIndex1.value!==null && velocityIndex3.value===null) {
        velocityIndex3.value = (1-value-velocityIndex1.value).toFixed(2);
    } else if (velocityIndex1.value===null && velocityIndex3.value!==null) {
        velocityIndex1.value = (1-value-velocityIndex3.value).toFixed(2);
    } else if (velocityIndex1.value===null && velocityIndex3.value===null) {

    }
    if (velocityIndex2.value+velocityIndex1.value>1){
        velocityIndex1.value = (1-value).toFixed(2);
    }
    if (velocityIndex2.value+velocityIndex3.value>1){
        velocityIndex3.value = (1-value).toFixed(2);
    }
}
const updataVelocityIndex3Value = (value) => {
    if (velocityIndex1.value!==null && velocityIndex2.value!==null) {
        velocityIndex1.value=null;
        velocityIndex2.value=null;
    } else if (velocityIndex1.value!==null && velocityIndex2.value===null) {
        velocityIndex2.value = (1-value-velocityIndex1.value).toFixed(2);
    } else if (velocityIndex1.value===null && velocityIndex2.value!==null) {
        velocityIndex1.value = (1-value-velocityIndex2.value).toFixed(2);
    } else if (velocityIndex1.value===null && velocityIndex2.value===null) {

    }
    if (velocityIndex3.value+velocityIndex1.value>1){
        velocityIndex1.value = (1-value).toFixed(2);
    }
    if (velocityIndex3.value+velocityIndex2.value>1){
        velocityIndex2.value = (1-value).toFixed(2);
    }
}

// 演变因子值
const evolveIndex1 = ref(0.36)
const evolveIndex2 = ref(0.36)
const evolveIndex3 = ref(0.28)
const updataEvolveIndex1Value = (value) => {
    if (evolveIndex2.value!==null && evolveIndex3.value!==null) {
        evolveIndex2.value=null;
        evolveIndex3.value=null;
    } else if (evolveIndex2.value!==null && evolveIndex3.value===null) {
        evolveIndex3.value = (1-value-evolveIndex2.value).toFixed(2);
    } else if (evolveIndex2.value===null && evolveIndex3.value!==null) {
        evolveIndex2.value = (1-value-evolveIndex3.value).toFixed(2);
    } else if (evolveIndex2.value===null && evolveIndex3.value===null) {

    }
    if (evolveIndex1.value+evolveIndex2.value>1){
        evolveIndex2.value = (1-value).toFixed(2);
    }
    if (evolveIndex1.value+evolveIndex3.value>1){
        evolveIndex3.value = (1-value).toFixed(2);
    }
}
const updataEvolveIndex2Value = (value) => {
    if (evolveIndex1.value!==null && evolveIndex3.value!==null) {
        evolveIndex1.value=null;
        evolveIndex3.value=null;
    } else if (evolveIndex1.value!==null && evolveIndex3.value===null) {
        evolveIndex3.value = (1-value-evolveIndex1.value).toFixed(2);
    } else if (evolveIndex1.value===null && evolveIndex3.value!==null) {
        evolveIndex1.value = (1-value-evolveIndex3.value).toFixed(2);
    } else if (evolveIndex1.value===null && evolveIndex3.value===null) {

    }
    if (evolveIndex2.value+evolveIndex1.value>1){
        evolveIndex1.value = (1-value).toFixed(2);
    }
    if (evolveIndex2.value+evolveIndex3.value>1){
        evolveIndex3.value = (1-value).toFixed(2);
    }
}
const updataEvolveIndex3Value = (value) => {
    if (evolveIndex1.value!==null && evolveIndex2.value!==null) {
        evolveIndex1.value=null;
        evolveIndex2.value=null;
    } else if (evolveIndex1.value!==null && evolveIndex2.value===null) {
        evolveIndex2.value = (1-value-evolveIndex1.value).toFixed(2);
    } else if (evolveIndex1.value===null && evolveIndex2.value!==null) {
        evolveIndex1.value = (1-value-evolveIndex2.value).toFixed(2);
    } else if (evolveIndex1.value===null && evolveIndex2.value===null) {

    }
    if (evolveIndex3.value+evolveIndex1.value>1){
        evolveIndex1.value = (1-value).toFixed(2);
    }
    if (evolveIndex3.value+evolveIndex2.value>1){
        evolveIndex2.value = (1-value).toFixed(2);
    }
}

</script>

<style lang="scss" scoped>
div.model-item-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 79vh;
    width: 75vw;
    &.element-calc-content {
        // background-color: #a2dede;
    }

    div.weight-set-container {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50%;
        // background-color: aqua;

        div.weight-set-title {
            position: absolute;
            display: flex;
            flex-direction: row;
            top: 0;
            left: 0;
            margin-top: 10px;
            margin-left: 10px;
            width: 32%;
            height: 8%;
            z-index: 10;
            border-radius: 10px;
            background-color: rgba(171, 158, 236, 0.95);
            border: 3px solid rgb(114, 114, 114);

            div.title-image-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30%;
                height: 100%;
                // background-color: #a2dede;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
            
            div.title-text-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: auto;
                height: 100%;

                div.title-text {
                    font-size: calc(1.5vh + 0.9vw);
                    font-weight: 550;
                    font-family: 'Microsoft YaHei';
                    color: rgb(15, 20, 199);
                    text-shadow: 1px 0px 1px #7e70b1, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                }
            }
        }

        div.weight-set-wrapper {
            display: flex;
            flex-direction: column;
            width: 95%;
            height: 93%;
            margin-top: 20px;
            // background-color: bisque;
            border-radius: 10px;
            border: 2.5px solid rgb(15, 20, 199);
            box-shadow: -4px 8px 8px -4px rgb(0, 47, 117);

            div.place-holder {
                height: 6%;
                width: 100%;
                // background-color: black;
            }

            div.main-index-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 24%;
                width: 100%;
                transition: transform 0.25s ease;
                &:hover {
                    cursor: pointer;
                    transform: scale(1.01);
                }
                // background-color: #a2dede;
                    
                div.main-index-wrapper {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    
                    div.index-selector {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        width: 96%;
                        height: 40%;
                        margin-bottom: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(190, 154, 210, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(151, 154, 214);
                    
                        div.main-index-text {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100%;
                            width: 40%;
                            font-size: calc(1.0vh + 0.9vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(36, 48, 187);
                            text-shadow: 1px 0px 1px #7e70b1, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                    
                        }

                        div.main-index-content {

                            display: flex;
                            align-items: center;
                            justify-content: left;
                            height: 100%;
                            width: 60%;

                            :deep(.el-select) {
                                height: 3.3vh;
                                width: 90%;
                                box-shadow:
                                rgba(225, 188, 231, 0.8) 1px 1px,
                                rgba(204, 159, 236, 0.7) -2px 2px,
                                rgba(142, 187, 213, 0.6) -3px 4px;
                                border-radius: 6px;
                            }
                            :deep(.el-select__wrapper) {
                                height: 3.3vh;
                                line-height: 3.3vh;
                                border-radius: 6px;
                                font-family: 'Microsoft YaHei';
                                font-weight: bold;
                                font-size: calc(0.5vw + 0.6vh);
                                background-color: #ebdef0;
                            }
                            :deep(.el-select__placeholder) {
                                color: #738ab6;
                            }

                            :deep(.el-icon) {
                                width: 0.5vw;
                                height: 0.5vw;

                                svg {
                                    width: 0.5vw;
                                    height: 0.5vw;

                                    path {
                                        fill: #001cb8;
                                    }
                                }
                            }
        
                        }
                    
                    }

                    div.index-shower {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        width: 96%;
                        height: 40%;
                        margin-top: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(190, 154, 210, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(151, 154, 214);

                        div.main-index-shower {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            width: 48%;
                            height: 100%;
                            margin-right: 5px;
                            border-right: rgba(171,162,232,0.9) 2.5px solid;
                            // background-color: #001cb8;

                            div.main-index-shower-text {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 40%;
                                height: 100%;
                                // background-color: #001cb8;
                                font-size: calc(0.7vh + 0.6vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                                color: rgb(221, 135, 54);
                            }

                            div.main-index-shower-content {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                margin-left: -10px;
                                width: 60%;
                                height: 40%;
                                // background-color: #6e76a2;
                            }
                        }

                        div.another-index-shower {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            width: 48%;
                            height: 100%;
                            margin-right: 5px;
                            // border-left: rgba(171,162,232,0.9) 2.5px solid;
                            // background-color: #494c5e;

                            div.another-index-shower-text {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 40%;
                                height: 100%;
                                margin-left: 10px;
                                // background-color: #001cb8;
                                font-size: calc(0.7vh + 0.6vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                                color: rgb(39, 195, 190);
                            }

                            div.another-index-shower-content {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                margin-left: -10px;
                                width: 60%;
                                height: 40%;
                                // background-color: #6e76a2;
                            }
                        }
                    }
                }
            }

            div.velocity-index-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 35%;
                width: 100%;
                transition: transform 0.25s ease;
                &:hover {
                    cursor: pointer;
                    transform: scale(1.01);
                }
                // background-color: #0f2727;

                div.velocity-index-wrapper {

                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;

                    div.velocity-index-title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: row;
                        margin-left: -40%;
                        width: 60%;
                        height: 15%;
                        margin-bottom: 3px;
                        border-radius: 10px;
                        // border: 2px solid rgba(236, 234, 238, 0.7);
                        // box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);
                    
                        div.velocity-title-image {
                            margin-left: -15%;
                            display: flex;
                            width: 35%;
                            height: 100%;
                        }

                        div.velocity-title-text {
                            display: flex;
                            margin-left: -21%;
                            width: 65%;
                            height: 100%;
                            font-size: calc(1.0vh + 0.9vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(243, 244, 248);
                        }

                    }

                    div.velocity-index-item1 {
                        display: flex;
                        flex-direction: row;
                        justify-content: left;
                        align-items: center;
                        width: 96%;
                        height: 22%;
                        margin-bottom: 3px;
                        margin-top: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(236, 234, 238, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);

                        div.velocity-index-item1-text {
                            display: flex;
                            align-items: center;
                            justify-content: right;
                            height: 100%;
                            width: 34%;
                            font-size: calc(0.8vh + 0.6vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(243, 244, 248);
                        }

                        div.velocity-index-item1-content {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                            width: 50%;

                        }
                    }

                    div.velocity-index-item2 {
                        display: flex;
                        flex-direction: row;
                        justify-content: left;
                        align-items: center;
                        width: 96%;
                        height: 22%;
                        margin-bottom: 3px;
                        margin-top: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(236, 234, 238, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);

                        div.velocity-index-item2-text {
                            display: flex;
                            align-items: center;
                            justify-content: right;
                            height: 100%;
                            width: 34%;
                            font-size: calc(0.8vh + 0.6vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(243, 244, 248);
                        }

                        div.velocity-index-item2-content {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                            width: 50%;

                        }
                    }

                    div.velocity-index-item3 {
                        display: flex;
                        flex-direction: row;
                        justify-content: left;
                        align-items: center;
                        width: 96%;
                        height: 22%;
                        margin-bottom: 3px;
                        margin-top: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(236, 234, 238, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);

                        div.velocity-index-item3-text {
                            display: flex;
                            align-items: center;
                            justify-content: right;
                            height: 100%;
                            width: 34%;
                            font-size: calc(0.8vh + 0.6vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(243, 244, 248);
                        }

                        div.velocity-index-item3-content {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                            width: 50%;

                        }
                    }
                }
            }

            div.evolve-index-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 35%;
                width: 100%;
                transition: transform 0.25s ease;
                &:hover {
                    cursor: pointer;
                    transform: scale(1.01);
                }
                // background-color: #10b5b5;
                div.evolve-index-wrapper {

                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;

                    div.evolve-index-title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: row;
                        margin-left: -40%;
                        width: 60%;
                        height: 15%;
                        margin-bottom: 3px;
                        border-radius: 10px;
                        // border: 2px solid rgba(236, 234, 238, 0.7);
                        // box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);

                        div.evolve-title-image {
                            margin-left: -15%;
                            display: flex;
                            width: 35%;
                            height: 100%;
                        }

                        div.evolve-title-text {
                            display: flex;
                            margin-left: -21%;
                            width: 65%;
                            height: 100%;
                            font-size: calc(1.0vh + 0.9vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(243, 244, 248);
                        }

                    }

                    div.evolve-index-item1 {
                        display: flex;
                        flex-direction: row;
                        justify-content: left;
                        align-items: center;
                        width: 96%;
                        height: 22%;
                        margin-bottom: 3px;
                        margin-top: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(236, 234, 238, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);

                        div.evolve-index-item1-text {
                            display: flex;
                            align-items: center;
                            justify-content: right;
                            height: 100%;
                            width: 34%;
                            font-size: calc(0.8vh + 0.6vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(243, 244, 248);
                        }

                        div.evolve-index-item1-content {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                            width: 50%;

                        }
                    }

                    div.evolve-index-item2 {
                        display: flex;
                        flex-direction: row;
                        justify-content: left;
                        align-items: center;
                        width: 96%;
                        height: 22%;
                        margin-bottom: 3px;
                        margin-top: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(236, 234, 238, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);

                        div.evolve-index-item2-text {
                            display: flex;
                            align-items: center;
                            justify-content: right;
                            height: 100%;
                            width: 34%;
                            font-size: calc(0.8vh + 0.6vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(243, 244, 248);
                        }

                        div.evolve-index-item2-content {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                            width: 50%;

                        }
                    }

                    div.evolve-index-item3 {
                        display: flex;
                        flex-direction: row;
                        justify-content: left;
                        align-items: center;
                        width: 96%;
                        height: 22%;
                        margin-bottom: 3px;
                        margin-top: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(236, 234, 238, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);

                        div.evolve-index-item3-text {
                            display: flex;
                            align-items: center;
                            justify-content: right;
                            height: 100%;
                            width: 34%;
                            font-size: calc(0.8vh + 0.6vw);
                            font-weight: 450;
                            font-family: 'Microsoft YaHei';
                            color: rgb(243, 244, 248);
                        }

                        div.evolve-index-item3-content {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                            width: 50%;

                        }
                    }
                }

                div.evolve-index-item1 {
                    display: flex;
                    width: 96%;
                    height: 22%;
                    margin-bottom: 3px;
                    margin-top: 3px;
                    border-radius: 10px;
                    border: 2px solid rgba(236, 234, 238, 0.7);
                    box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);
                }

                div.evolve-index-item2 {
                    display: flex;
                    width: 96%;
                    height: 22%;
                    margin-bottom: 3px;
                    margin-top: 3px;
                    border-radius: 10px;
                    border: 2px solid rgba(236, 234, 238, 0.7);
                    box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);
                }

                div.evolve-index-item3 {
                    display: flex;
                    width: 96%;
                    height: 22%;
                    margin-top: 3px;
                    border-radius: 10px;
                    border: 2px solid rgba(236, 234, 238, 0.7);
                    box-shadow: -4px 4px 4px -2px rgb(220, 221, 229);
                }
                
            }
        }

    }

    div.result-show-container {
        display: flex;
        flex-direction: column;
        width: 50%;
        background-color: rgb(46, 48, 103);
    }
}

:deep(.dv-border-box-8.style-1) {
    display: flex;
    background-color: rgba(192, 201, 214, 0.1);
    backdrop-filter: blur(8px);
    width: 97%;
    height: 96%;
}

:deep(.dv-border-box-8.style-2) {
    display: flex;
    background-color: rgba(31, 66, 116, 0.7);
    backdrop-filter: blur(8px);
    width: 97%;
    height: 96%;
}

// ::v-deep .el-select {
//   width: 80%;
// }

</style>
