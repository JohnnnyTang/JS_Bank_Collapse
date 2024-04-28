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
                <div class="place-holder">
                    <dv-loading class="loading-icon" v-show="isRunning">运行中...</dv-loading>
                    <div class="botton-wrapper" @click="RiskMatrixModelRun">
                        <div class="botton-text">运行模型</div>   
                    </div>
                </div>
                <div class="main-index-container">
                    <dv-border-box8
                        class="style-1"
                        :dur="5"
                        :color="['rgb(96, 96, 94)', 'rgb(17, 20, 106)']"
                    >
                        <div class="main-index-wrapper">
                            <!-- <div class="index-selector"> -->
                            <div class="main-index-text">
                                因子权重设置：
                            </div>
                                <!-- <div class="main-index-content">
                                    <el-select
                                        v-model="mainIndex"
                                        placeholder="请选择主因子"
                                        @change="MainIndexChange"
                                    >
                                    <el-option
                                        v-for="item in indexes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                    </el-select>
                                </div> -->
                            <!-- </div> -->
                            <div class="index-shower">
                                <div class="main-index-shower">
                                    <div class="main-index-shower-text">
                                        动力因子权重：
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
                                        演变因子权重：
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
                                    <el-input
                                        :min="0"
                                        :max="1"
                                        v-model="velocityIndex1"
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
                                    <el-input
                                        :min="0"
                                        :max="1"
                                        v-model="velocityIndex2"
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
                                    <el-input
                                        :min="0"
                                        :max="1"
                                        v-model="velocityIndex3"
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
                                    <el-input
                                        :min="0"
                                        :max="1"
                                        v-model="evolveIndex1"
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
                                    <el-input
                                        :min="0"
                                        :max="1"
                                        v-model="evolveIndex2"
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
                                    <el-input
                                        :min="0"
                                        :max="1"
                                        v-model="evolveIndex3"
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
        <div class="result-show-container">
            <div class="result-set-title">
                <div class="title-image-container">
                    <img src="/alarm_icon.png" alt="风险">
                </div>
                <div class="title-text-container">
                    <div class="title-text">崩塌风险计算结果</div>
                </div>
            </div>
            <div class="result-set-wrapper">
                <div class="place-holder">
                    <div class="botton-wrapper">
                    </div>
                </div>
                <div class="alarm-grade-container">
                    <dv-border-box10
                        class="style-1"
                        :color="getAlarmColor(alarmGrade)"
                    >
                        <div class="alarm-grade-wrapper">
                            <div class="alarm-item1-container">
                                <div class="alarm-item1-decorator">
                                    <dv-decoration-9
                                        :color="getAlarmDecoratorColor(alarmGrade)"
                                        style="width:100%;height:60%;text-align: center;display: flex; margin-left: 20%;"
                                        :dur="5"
                                    />
                                </div>
                                <div class="alarm-item1-text">
                                    风险评级：
                                </div>
                                <div class="alarm-item1-resulttext" :style="{color:getAlarmColor(alarmGrade)[0]}">
                                    {{ getAlarmText(alarmGrade) }}
                                </div>
                            </div>
                            <div class="alarm-item2-container">
                                <div class="alarm-itme2-text">
                                    风险综合等级：
                                </div>
                                <div class="alarm-itme2-number" :style="{color:getAlarmColor(alarmGrade)[0]}">
                                    {{ alarmLevel }}
                                </div>
                            </div>
                        </div>
                    </dv-border-box10>
                </div>
                <div class="risk-matrix-container">
                    <div class="risk-matrix-wrapper">
                        <div class="risk-matrix-title">
                            <div class="risk-matrix-text">
                                岸坡崩塌风险矩阵
                            </div>
                        </div>
                        <div class="risk-matrix-content">
                            <div class="matrix">
                                <div class="cell-lowest">
                                    <div class="text">较低风险</div>
                                    <div class="number">{{riskValue1}}</div>
                                </div>
                                <div class="cell-low">
                                    <div class="text">低风险</div>
                                    <div class="number">{{riskValue2}}</div>
                                </div>
                                <div class="cell-high">
                                    <div class="text">高风险</div>
                                    <div class="number">{{riskValue3}}</div>
                                </div>
                                <div class="cell-highest">
                                    <div class="text">较高风险</div>
                                    <div class="number">{{riskValue4}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="loss-matrix-container">
                    <div class="loss-matrix-wrapper">
                        <div class="loss-matrix-title">
                            <div class="loss-matrix-text">
                                社会经济损失矩阵
                            </div>
                        </div>
                        <div class="loss-matrix-content">
                            <div class="matrix">
                                <div class="cell-important">
                                    重要
                                </div>
                                <div class="cell-important">
                                    重要
                                </div>
                                <div class="cell-important">
                                    重要
                                </div>
                                <div class="cell-normal">
                                    一般
                                </div>
                                <div class="cell-normal">
                                    一般
                                </div>
                                <div class="cell-normal">
                                    一般
                                </div>
                                <div class="cell-notimportant">
                                    不重要
                                </div>
                                <div class="cell-notimportant">
                                    不重要
                                </div>
                                <div class="cell-notimportant">
                                    不重要
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3';
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3';
import { ElInputNumber, ElInput } from 'element-plus';
import { ref } from 'vue'
import { riskMatrixModel } from './api'
import { useMultiIndexStore } from '@/store/multiIndexStore'

// 状态管理
const multiIndexStore = useMultiIndexStore()

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

// 预警框颜色
const alarmGrade = ref(0)
const alarmShowerColorGroup = [
    ['#828b89', '#828b89'],
    ['rgba(18, 100, 214, 0.7)', 'rgba(231, 234, 238, 0.7)'],
    ['rgba(220, 174, 7, 1)', 'rgba(231, 234, 238, 0.7)'],
    ['rgba(239, 111, 6, 0.7)', 'rgba(231, 234, 238, 0.7)'],
    ['rgba(244, 8, 8, 0.7)', 'rgba(231, 234, 238, 0.7)'],
]
const getAlarmColor = (alarmGrade) => {
    if (alarmGrade === 0){
        return alarmShowerColorGroup[0]
    } else if (alarmGrade === 1) {
        return alarmShowerColorGroup[1]
    } else if (alarmGrade === 2) {
        return alarmShowerColorGroup[2]
    } else if (alarmGrade === 3) {
        return alarmShowerColorGroup[3]
    } else if (alarmGrade === 4) {
        return alarmShowerColorGroup[4]
    }
}
// 预警标识颜色
const alarmDecoratorColorGroup = [
    ['#828b89', '#828b89'],
    ['rgba(18, 100, 214, 0.7)', 'rgba(11, 101, 227, 0.8)'],
    ['rgba(220, 174, 7, 1)', 'rgba(183, 163, 47, 0.8)'],
    ['rgba(239, 111, 6, 0.7)', 'rgba(199, 113, 15, 0.8)'],
    ['rgba(244, 8, 8, 0.7)', 'rgba(213, 53, 29, 0.8)'],
]
const getAlarmDecoratorColor = (alarmGrade) => {
    if (alarmGrade === 0) {
        return alarmDecoratorColorGroup[0]
    } else if (alarmGrade === 1) {
        return alarmDecoratorColorGroup[1]
    } else if (alarmGrade === 2) {
        return alarmDecoratorColorGroup[2]
    } else if (alarmGrade === 3) {
        return alarmDecoratorColorGroup[3]
    } else if (alarmGrade === 4) {
        return alarmDecoratorColorGroup[4]
    }
}
// 预警文字
const getAlarmText = (alarmGrade) => {
    if (alarmGrade === 0)
        return ("未计算")
    else if (alarmGrade === 1) {
        return "较低风险"
    } else if (alarmGrade === 2) {
        return "低风险"
    } else if (alarmGrade === 3) {
        return "高风险"
    } else if (alarmGrade === 4) {
        return "较高风险"
    }
}

// 预警综合等级
const alarmLevel = ref(0)
// 四类风险等级
const riskValue1 = ref(0)
const riskValue2 = ref(0)
const riskValue3 = ref(0)
const riskValue4 = ref(0)

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const isRunning = ref(false)

const RiskMatrixModelRun = async () => {
    if (velocityIndex1.value===null || velocityIndex2.value===null || velocityIndex3.value===null
        || evolveIndex1.value===null || evolveIndex2.value===null || evolveIndex3.value===null) {
        alert("因子权重不为空!")
    }
    const jsonId = multiIndexStore.taskId;
    // 设置主权重
    const runModelData = {
        "modelNode": {
            "id": "662a4521ddd45f65873eb067"
        },
        "paramNode": {
            "modelId": "662a4521ddd45f65873eb067",
            "params": {
                "jsonId": jsonId,
                "weight0": mainIndexValue.value,
                "weight1": anotherIndexValue.value,
                "weight2": velocityIndex1.value,
                "weight3": velocityIndex2.value,
                "weight4": velocityIndex3.value,
                "weight5": evolveIndex1.value,
                "weight6": evolveIndex2.value,
                "weight7": evolveIndex3.value
            },
            "name": "multiIndexMatrixDefaultParamItem",
            "auth": "all",
            "category": "ModelParamItem",
            "path": ",paramNode,multiIndexMatrixParamGroup,"
        },
        "dataNode": {},
        "status": "0",
        "result": {
            "resultString": "",
            "resJsonId": ""
        },
        "ifAuto": false,
        "name": "matrixCalcModelTaskItem-test",
        "auth": "all",
        "category": "ModelTaskItem",
        "path": ",taskNode,matrixCalcModelTaskGroup,"
    }
    isRunning.value = true
    const taskNodeId = await(riskMatrixModel.runModel(runModelData))
    const RunStatus = ref("")
    for (;;) {
        RunStatus.value = await(riskMatrixModel.getRunStatus(taskNodeId.data))
        if (RunStatus.value.data == 2) {
            break;
        } else if (RunStatus.value.data == -1) {
            alert("模型运行结果失败")
        } else if (RunStatus.value.data == -2) {
            alert("模型运行生成json失败")
        } else if (RunStatus.value.data == 1) {
            // alert("模型运行中")
        }
        await wait(500);
    }
    const RunResult = await(riskMatrixModel.getRunResult(jsonId))
    alarmLevel.value = RunResult.data.risk[2].toFixed(3)
    const RiskString = RunResult.data.risk[1]
    if (RiskString == "较低风险") {
        alarmGrade.value = 1
    } else if (RiskString == "低风险") {
        alarmGrade.value = 2
    } else if (RiskString == "高风险") {
        alarmGrade.value = 3
    } else if (RiskString == "较高风险") {
        alarmGrade.value = 4
    }
    const riskValueList = RunResult.data.risk[0]
    riskValue1.value = riskValueList[0].toFixed(3)
    riskValue2.value = riskValueList[1].toFixed(3)
    riskValue3.value = riskValueList[2].toFixed(3)
    riskValue4.value = riskValueList[3].toFixed(3)
    isRunning.value = false
}

</script>

<style lang="scss" scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: scale(1.06);
  }
}
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
@mixin flex-center-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
@mixin flex-center-column {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
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
        @include flex-center-column();
        position: relative;
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
                @include flex-center();
                width: 30%;
                height: 100%;
                // background-color: #a2dede;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
            
            div.title-text-container {
                @include flex-center();
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
                height: 12%;
                width: 100%;
                // background-color: black;

                div.botton-wrapper {
                    animation: float 2s ease-in-out infinite;
                    transition: transform 0.25s ease;
                    position: absolute;
                    top: 4.5%;
                    left: 2.5%;
                    width: 18%;
                    height: 5.5%;
                    margin-top: 15px;
                    margin-left: 74%;
                    border: #02242d solid 3px;
                    border-radius: 10px;
                    background-color: rgba(33, 96, 183, 0.7);
                    border-radius: 5px;
                    &:hover {
                        cursor: pointer;
                        animation-play-state: paused;
                        transform: scale(1.1);
                    }
                    z-index: 10;

                    div.botton-text {
                        @include flex-center();
                        height: 100%;
                        width: 100%;
                        // background-color: #001cb8;
                        font-size: calc(0.9vh + 0.7vw);
                        font-weight: 550;
                        font-family: 'Microsoft YaHei';
                        color: rgb(241, 243, 247);
                        // text-shadow: 0.3px 0px 0.3px #9283c4, 0px 1px 1px #061411, 1px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1pxd 2px 1px #CCCCCC, 1px 1px 1px #EEEEEE, 1px 1px 1px #CCCCCC, 1px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                    }

                }

            }

            div.main-index-container {
                @include flex-center-column();
                height: 22%;
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
                    align-items: center;
                    justify-content: left;
                    height: 100%;
                    width: 100%;
                    
                    // div.index-selector {
                    //     @include flex-center-row();
                    //     width: 96%;
                    //     height: 40%;
                    //     margin-bottom: 3px;
                    //     border-radius: 10px;
                    //     border: 2px solid rgba(190, 154, 210, 0.7);
                    //     box-shadow: -4px 4px 4px -2px rgb(151, 154, 214);
                    
                    div.main-index-text {
                        display: flex;
                        justify-content: left;
                        align-items: center;
                        height: 40%;
                        width: 100%;
                        margin-left:30px;
                        font-size: calc(1.0vh + 0.9vw);
                        font-weight: 450;
                        font-family: 'Microsoft YaHei';
                        color: rgb(36, 48, 187);
                        text-shadow: 1px 0px 1px #7e70b1, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;

                    }

                    // div.main-index-content {

                    //     display: flex;
                    //     align-items: center;
                    //     justify-content: left;
                    //     height: 100%;
                    //     width: 60%;

                    //     :deep(.el-select) {
                    //         height: 3.3vh;
                    //         width: 90%;
                    //         box-shadow:
                    //         rgba(225, 188, 231, 0.8) 1px 1px,
                    //         rgba(204, 159, 236, 0.7) -2px 2px,
                    //         rgba(142, 187, 213, 0.6) -3px 4px;
                    //         border-radius: 6px;
                    //     }
                    //     :deep(.el-select__wrapper) {
                    //         height: 3.3vh;
                    //         line-height: 3.3vh;
                    //         border-radius: 6px;
                    //         font-family: 'Microsoft YaHei';
                    //         font-weight: bold;
                    //         font-size: calc(0.5vw + 0.6vh);
                    //         background-color: #ebdef0;
                    //     }
                    //     :deep(.el-select__placeholder) {
                    //         color: #738ab6;
                    //     }

                    //     :deep(.el-icon) {
                    //         width: 0.5vw;
                    //         height: 0.5vw;

                    //         svg {
                    //             width: 0.5vw;
                    //             height: 0.5vw;

                    //             path {
                    //                 fill: #001cb8;
                    //             }
                    //         }
                    //     // }
    
                    //     }
                    
                    // }

                    div.index-shower {
                        @include flex-center-row();
                        width: 96%;
                        height: 45%;
                        margin-top: 3px;
                        border-radius: 10px;
                        border: 2px solid rgba(190, 154, 210, 0.7);
                        box-shadow: -4px 4px 4px -2px rgb(151, 154, 214);

                        div.main-index-shower {
                            @include flex-center-row();
                            width: 48%;
                            height: 100%;
                            margin-right: 5px;
                            border-right: rgba(171,162,232,0.9) 2.5px solid;
                            // background-color: #001cb8;

                            div.main-index-shower-text {
                                @include flex-center();
                                width: 50%;
                                height: 100%;
                                // background-color: #001cb8;
                                font-size: calc(0.7vh + 0.6vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                                color: rgb(221, 135, 54);
                            }

                            div.main-index-shower-content {
                                @include flex-center();
                                margin-left: -10px;
                                width: 50%;
                                height: 100%;
                                // background-color: #6e76a2;
                            }
                        }

                        div.another-index-shower {
                            @include flex-center();
                            width: 48%;
                            height: 100%;
                            margin-right: 5px;
                            // border-left: rgba(171,162,232,0.9) 2.5px solid;
                            // background-color: #494c5e;

                            div.another-index-shower-text {
                                @include flex-center();
                                width: 50%;
                                height: 100%;
                                margin-left: 10px;
                                // background-color: #001cb8;
                                font-size: calc(0.7vh + 0.6vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                                color: rgb(39, 195, 190);
                            }

                            div.another-index-shower-content {
                                @include flex-center();
                                margin-left: -10px;
                                width: 50%;
                                height: 100%;
                                // background-color: #6e76a2;
                            }
                        }
                    }
                }
            }

            div.velocity-index-container {
                @include flex-center-column();
                height: 35%;
                width: 100%;
                transition: transform 0.25s ease;
                &:hover {
                    cursor: pointer;
                    transform: scale(1.01);
                }
                // background-color: #0f2727;

                div.velocity-index-wrapper {

                    @include flex-center-column();
                    height: 100%;
                    width: 100%;

                    div.velocity-index-title {
                        @include flex-center-row();
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
                        @include flex-center-row();
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
                        @include flex-center-row();
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
                            @include flex-center();
                            height: 100%;
                            width: 50%;

                        }
                    }

                    div.velocity-index-item3 {
                        @include flex-center-row();
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
                            @include flex-center();
                            height: 100%;
                            width: 50%;

                        }
                    }
                }
            }

            div.evolve-index-container {
                @include flex-center-column();
                height: 35%;
                width: 100%;
                transition: transform 0.25s ease;
                &:hover {
                    cursor: pointer;
                    transform: scale(1.01);
                }
                // background-color: #10b5b5;
                div.evolve-index-wrapper {

                    @include flex-center-column();
                    height: 100%;
                    width: 100%;

                    div.evolve-index-title {
                        @include flex-center-row();
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
                        @include flex-center-row();
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
                            @include flex-center();
                            height: 100%;
                            width: 50%;

                        }
                    }

                    div.evolve-index-item2 {
                        @include flex-center-row();
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
                            @include flex-center();
                            height: 100%;
                            width: 50%;

                        }
                    }

                    div.evolve-index-item3 {
                        @include flex-center-row();
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
                            @include flex-center();
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
        position: relative;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: -17px;
        width: 50%;
        height: 100%;
        // background-color: rgb(46, 48, 103);

        div.result-set-title {
            @include flex-center-row();
            position: absolute;
            top: 0;
            left: 0;
            margin-top: 10px;
            margin-left: 49.5%;
            width: 49%;
            height: 8%;
            z-index: 10;
            border-radius: 10px;
            background-color: rgba(237, 215, 227, 0.95);
            border: 3px solid rgb(217, 150, 217);

            div.title-image-container {
                @include flex-center();
                margin-left: -10px;
                width: auto;
                height: 100%;
                // background-color: #a2dede;

                img {
                    width: 97%;
                    height: 97%;
                }
            }

            div.title-text-container {
                @include flex-center();
                width: auto;
                height: 100%;

                div.title-text {
                    font-size: calc(1.5vh + 0.9vw);
                    font-weight: 550;
                    font-family: 'Microsoft YaHei';
                    color: rgb(88, 17, 10);
                    text-shadow: 1px 0px 1px #7e70b1, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                }
            }
        }

        div.result-set-wrapper {
            display: flex;
            flex-direction: column;
            width: 95%;
            height: 93%;
            margin-top: 20px;
            // margin-left: -20px;
            // background-color: bisque;
            border-radius: 10px;
            border: 2.5px solid rgb(199, 39, 15);
            box-shadow: 4px 8px 8px -4px rgb(231, 228, 161);

            div.place-holder {
                display: absolute;
                justify-content: left;
                align-items: center;
                height: 4%;
                width: 100%;
                // background-color: black;
            }

            div.alarm-grade-container {
                @include flex-center-row();
                height: 18%;
                width: 100%;
                // background-color: #001cb8;

                div.alarm-grade-wrapper {
                    @include flex-center-row();
                    height: 100%;
                    width: 100%;
                    
                    div.alarm-item1-container {
                        @include flex-center-row();
                        width: 55%;
                        height: 100%;
                        // background-color: #001cb8;

                        div.alarm-item1-decorator {
                            @include flex-center();
                            width: 20%;
                            height: 100%;
                            // background-color: #001cb8;
                        }

                        div.alarm-item1-text {
                            display: flex;
                            justify-content: right;
                            align-items: center;
                            width: 40%;
                            height: 100%;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';
                            color: rgb(22, 23, 25);
                            text-shadow: 1px 0px 1px #c27d2e, 0px 1px 1px #d11dc2, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                        }

                        div.alarm-item1-resulttext {
                            display: flex;
                            justify-content: left;
                            align-items: center;
                            width: 30%;
                            height: 100%;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';
                        }
                    }

                    div.alarm-item2-container {
                        display: flex;
                        flex-direction: row;
                        width: 50%;
                        height: 100%;
                        // background-color: #2e334c;

                        div.alarm-itme2-text {
                            display: flex;
                            justify-content: right;
                            align-items: center;
                            width: 70%;
                            height: 100%;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';
                            color: rgb(22, 23, 25);
                            text-shadow: 1px 0px 1px #c27d2e, 0px 1px 1px #d11dc2, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                        }

                        div.alarm-itme2-number {
                            display: flex;
                            justify-content: left;
                            align-items: center;
                            width: 30%;
                            height: 100%;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';
                        }

                    }
                }   

            }

            div.risk-matrix-container {
                @include flex-center-row();
                height: 38%;
                width: 100%;
                margin-bottom: 10px;
                // background-color: #11ffc4;

                div.risk-matrix-wrapper {
                    @include flex-center();
                    width: 98%;
                    height: 96%;
                    background-color:rgba(0, 47, 117, 0.2);
                    border-radius: 5px;
                    transition: transform 0.25s ease;
                    &:hover {
                        cursor: pointer;
                        transform: scale(1.01);
                    }

                    div.risk-matrix-title {
                        @include flex-center-row();
                        width: 20%;
                        height: 100%;
                        // background-color: #11ffc4;

                        div.risk-matrix-text {
                            @include flex-center();
                            width: 35%;
                            height: 85%;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';
                            writing-mode: vertical-rl;
                            color: #835b05;
                            background-color: rgba(221, 231, 235, 0.902);
                            border-radius: 10px;
                            border: #4b5057 3px solid;
                        }
                    }
                    
                    div.risk-matrix-content {
                        @include flex-center();
                        width: 80%;
                        height: 100%;
                        // background-color: #001cb8;\

                        .matrix {
                            display: grid;
                            margin-left: -70px;
                            grid-template-columns: repeat(2, 1fr); 
                            grid-template-rows: repeat(2, auto);
                        }

                        .cell-lowest {
                            display: flex;
                            flex-direction: column;
                            justify-content: left;
                            background-color: rgba(124, 182, 219, 0.7);
                            border: 2px solid #ece6e6;
                            padding: 20px; 

                            .text {
                                height: 50%;
                                text-align: center;
                                font-size: calc(0.8vh + 0.8vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                            }

                            .number {
                                height: 50%;
                                text-align: center;
                                font-size: calc(0.8vh + 0.8vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                            }
                            
                        }
                        .cell-low {
                            display: flex;
                            flex-direction: column;
                            justify-content: left;
                            background-color: rgba(215, 209, 100, 0.7);
                            border: 2px solid #ece6e6;
                            padding: 20px; 
                        
                            .text {
                                height: 50%;
                                text-align: center;
                                font-size: calc(0.8vh + 0.8vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                            }

                            .number {
                                height: 50%;
                                text-align: center;
                                font-size: calc(0.8vh + 0.8vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                            }

                        }
                        .cell-high {
                            background-color: rgba(211, 164, 66, 0.7);
                            display: flex;
                            flex-direction: column;
                            justify-content: left;
                            border: 2px solid #ece6e6;
                            padding: 20px; 
                        
                            .text {
                                height: 50%;
                                text-align: center;
                                font-size: calc(0.8vh + 0.8vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                            }

                            .number {
                                height: 50%;
                                text-align: center;
                                font-size: calc(0.8vh + 0.8vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                            }
                        }
                        .cell-highest {
                            background-color: rgba(213, 59, 48, 0.7);
                            display: flex;
                            flex-direction: column;
                            justify-content: left;
                            border: 2px solid #ece6e6;
                            padding: 20px; 
                        
                            .text {
                                height: 50%;
                                text-align: center;
                                font-size: calc(0.8vh + 0.8vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                            }

                            .number {
                                height: 50%;
                                text-align: center;
                                font-size: calc(0.8vh + 0.8vw);
                                font-weight: 550;
                                font-family: 'Microsoft YaHei';
                            }
                        }
                    }
                }
            }

            div.loss-matrix-container {
                @include flex-center-row();
                height: 38%;
                width: 100%;
                // background-color: #11ffc4;

                div.loss-matrix-wrapper {
                    @include flex-center-row();
                    width: 98%;
                    height: 96%;
                    background-color:rgba(82, 157, 190, 0.2);
                    border-radius: 5px;
                    transition: transform 0.25s ease;
                    &:hover {
                        cursor: pointer;
                        transform: scale(1.01);
                    }

                    div.loss-matrix-title {
                        @include flex-center-row();
                        width: 20%;
                        height: 100%;
                        // background-color: #11ffc4;

                        div.loss-matrix-text {
                            @include flex-center();
                            width: 35%;
                            height: 85%;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';
                            writing-mode: vertical-rl;
                            color: #375ed6;
                            background-color: rgba(235, 228, 221, 0.902);
                            border-radius: 10px;
                            border: #4b5057 3px solid;
                        }
                    }
                    
                    div.loss-matrix-content {
                        @include flex-center();
                        width: 80%;
                        height: 100%;
                        // background-color: #001cb8;

                        .matrix {
                            display: grid;
                            margin-left: -70px;
                            grid-template-columns: repeat(3, 1fr); 
                            grid-template-rows: repeat(3, auto);
                        }

                        .cell-important {
                            display: flex;
                            flex-direction: column;
                            justify-content: left;
                            background-color: rgba(147, 91, 221, 0.5);
                            border: 2px solid #ece6e6;
                            padding: 20px;
                            text-align: center;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';                            
                        }
                        .cell-normal {
                            display: flex;
                            flex-direction: column;
                            justify-content: left;
                            background-color: rgba(209, 177, 94, 0.6);
                            border: 2px solid #ece6e6;
                            padding: 20px; 
                            text-align: center;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';

                        }
                        .cell-notimportant {
                            background-color: rgba(135,217,75,0.35);
                            display: flex;
                            flex-direction: column;
                            justify-content: left;
                            border: 2px solid #ece6e6;
                            padding: 20px; 
                            text-align: center;
                            font-size: calc(0.8vh + 0.8vw);
                            font-weight: 550;
                            font-family: 'Microsoft YaHei';
                        }
                    }
                }
            }
        }
    }
}

:deep(.dv-border-box-8.style-1) {
    display: flex;
    position: relative;
    background-color: rgba(227, 121, 16, 0.1);
    backdrop-filter: blur(8px);
    width: 97%;
    height: 90%;
}


:deep(.dv-border-box-8.style-2) {
    display: flex;
    background-color: rgba(31, 66, 116, 0.7);
    backdrop-filter: blur(8px);
    width: 97%;
    height: 96%;
}

:deep(.dv-border-box-10.style-1) {
    display: flex;
    backdrop-filter: blur(8px);
    width: 90%;
    height: 60%;
}

:deep(.dv-loading.loading-icon) {
    display: flex;
    margin-left:22%;
    height: auto;
}

:deep(.el-input) {
    width: 80%;
    text-align: center;
    // justify-content: center;
}

</style>
