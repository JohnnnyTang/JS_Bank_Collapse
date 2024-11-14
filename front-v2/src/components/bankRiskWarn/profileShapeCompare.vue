<template>
    <div class="riskInfo-container">
        <div class="riskInfo-title">
            <!-- <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
            历史断面变化
        </dv-border-box2> -->
            <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
                岸坡断面形态变化
            </dv-border-box2>
<!-- ////////////////////////////////////////////////////////////////////////////////////// -->
            <button class="condition-button" @click="editClickHandler()" :class="{ 'active': true }">
                编辑
            </button>
<!-- ////////////////////////////////////////////////////////////////////////////////////// -->
        </div>
        <div class="riskInfo-item profileShape">
            <div class="item-title">{{ profileName }}</div>
            <el-popover
                placement="bottom-start"
                content="其他年份地形"
                :width="100"
                trigger="hover"
            >
                <template #reference>
                    <div class="profile-show-container" @click="showOtherLine"></div>
                </template>
            </el-popover>
            <div class="profile-selector-container">
                <el-select v-model="profileValue" placeholder="选择断面" style="width: 10vw; height: 3.5vh"
                    @change="calProfileData" popper-class="profile-popper">
                    <el-option v-for="item in props.profileList" :key="item.value" :label="item.label" :value="item.value">
                        <span class="profile-name-text">
                            {{ item.label }}
                        </span>
                    </el-option>
                </el-select>
            </div>
            <div ref="shapeGraphRef" class="shape graph" element-loading-background="rgba(214, 235, 255,0.8)"></div>
            <div class="graph-container shape">
                <div ref="shapeGraphRef" class="shape graph" v-loading="props.shapeChartLoad"
                    element-loading-background="rgba(255, 255, 255, 0.4)"></div>
                <div v-if="shapeGraphNotShow" class="empty-graph">
                    当前暂无地形数据
                </div>
            </div>
        </div>
        <!-- ////////////////////////////////////////////////////////////////////////////////////// -->
        <div class="edit-pannel-container" v-if="editPannelShow">
            <div class="title">编辑页面</div>
            <div class="part">
                <span>滩槽高差：</span>
                <el-input v-model="inputGaochaList" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
            </div>
            <div class="part">
                <span>岸坡坡比：</span>
                <el-input v-model="inputPobiList" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
            </div>
            <div class="part">
                <span>冲刷幅度：</span>
                <el-input v-model="inputSpeedList" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
            </div>
            <div class="submit">
                <button class="submit-button" @click="editData" :class="{ 'active': true }" style="width: 4vw; height: 3vh; font-size: medium;">
                    修改
                </button>
            </div>
        </div>
        <!-- ////////////////////////////////////////////////////////////////////////////////////// -->
        <div class="text-info-container">
            <div class="text-info-block">
                <div class="text-info-item">
                    2023年该断面滩槽高差为 <span style="color: rgb(226, 80, 80);">{{ gaochaList[profileValue - 1] }}</span> m
                </div>
            </div>
            <div class="text-info-block">
                <div class="text-info-item">
                    2023年断面最大岸坡坡比为
                    <span style="color: rgb(226, 80, 80);">{{ pobiList[profileValue - 1] }}</span>
                    <!-- <span v-if="profileValue - 1 === 5" style="color: rgb(226, 80, 80);">1 / 1.7</span>
                    <span v-else-if="profileValue - 1 === 6" style="color: rgb(226, 80, 80);">1 / 1.8</span>
                    <span v-else-if="profileValue - 1 === 7" style="color: rgb(226, 80, 80);">1 / 2.2</span>
                    <span v-else style="color: rgb(226, 80, 80);">{{ pobiList[profileValue - 1] }}</span> -->
                </div>
            </div>
            <div class="text-info-block">
                <div class="text-info-item">
                    1999~2023年断面年最大冲刷幅度为 <span style="color: rgb(226, 80, 80);">{{ speedList[profileValue - 1] }}</span> m/年
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="riskInfo-container">
        <div class="riskInfo-title"></div>
        </div> -->
</template>

<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import { ElPopover, ElButton } from 'element-plus';
import { drawShapeCompareGraph } from './util.js'
import * as echarts from 'echarts'

// const speedList = ref([
//     3.575, 4.725, 2.675, 5.025, 4.700, 5.650, 3.375, 3.150, 4.325, 3.850, 1.275, 0.975
// ])
// const gaochaList = ref([
//     38.27, 32.72, 33.56, 30.84, 34.94, 32.88, 33.65, 31.45, 28.53, 27.61, 27.01, 25.73
// ])
// const pobiList = ref([
//     "1/4.1", "1/3.9", "1/4.0", "1/6.3", "1/3.9", "1/3.3", "1/3.1", "1/3.1", "1/6.5", "1/7.9", "1/11.3", "1/11.0"
// ])
//////////////////////////////////////////////////////////////////////////////////////
// 从 localStorage 加载数据或初始化默认值
const speedList = ref(JSON.parse(localStorage.getItem('speedList')) || [
    3.575, 4.725, 2.675, 5.025, 4.700, 5.650, 3.375, 3.150, 4.325, 3.850, 1.275, 0.975
])
const gaochaList = ref(JSON.parse(localStorage.getItem('gaochaList')) || [
    38.27, 32.72, 33.56, 30.84, 34.94, 32.88, 33.65, 31.45, 28.53, 27.61, 27.01, 25.73
])
// const pobiList = ref(JSON.parse(localStorage.getItem('pobiList')) || [
//     "1/4.1", "1/3.9", "1/4.0", "1/6.3", "1/3.9", "1/3.3", "1/3.1", "1/3.1", "1/6.5", "1/7.9", "1/11.3", "1/11.0"
// ])
const pobiList = ref(JSON.parse(localStorage.getItem('pobiList')) || [
    "1/4.1", "1/3.9", "1/4.0", "1/6.3", "1/3.9", "1/1.7", "1/1.8", "1/2.2", "1/6.5", "1/7.9", "1/11.3", "1/11.0"
])
// 定义输入框的响应式数据
const inputSpeedList = ref()
const inputGaochaList = ref()
const inputPobiList = ref()

// 编辑面板的显示状态
const editPannelShow = ref(false)
//////////////////////////////////////////////////////////////////////////////////////
const shapeGraphNotShow = ref(false)
const shapeGraphRef = ref(null)
let shapeChart = null
let section;
let beforeSection;
let compareSection;
let compareBeforeSection;


const emit = defineEmits(['profileValueChange'])

const profileValue = ref(8)
const profileName = ref('')

const props = defineProps({
    profileData: {
        type: Object,
    },
    profileDataCompare: {
        type: Object,
    },
    profileList: {
        type: Object
    },
    shapeChartLoad: {
        type: Boolean
    }
})
//////////////////////////////////////////////////////////////////////////////////////
// 编辑数据的方法
const editData = () => {
    // 更新当前选择断面的数据
    if (!isNaN(inputSpeedList.value) && inputSpeedList.value !== '') {
        speedList.value[profileValue.value - 1] = parseFloat(inputSpeedList.value);
    }
    if (!isNaN(inputGaochaList.value) && inputGaochaList.value !== '') {
        gaochaList.value[profileValue.value - 1] = parseFloat(inputGaochaList.value);
    }
    if (inputPobiList.value !== '') {
        pobiList.value[profileValue.value - 1] = inputPobiList.value;
    }

    // 存储到 localStorage 或其他存储方式
    localStorage.setItem('speedList', JSON.stringify(speedList.value));
    localStorage.setItem('gaochaList', JSON.stringify(gaochaList.value));
    localStorage.setItem('pobiList', JSON.stringify(pobiList.value));

    // 关闭编辑面板
    editPannelShow.value = false;
};

const editClickHandler = () => {
    editPannelShow.value = !editPannelShow.value;
};
//////////////////////////////////////////////////////////////////////////////////////
const calProfileData = () => {
    emit('profileValueChange', profileValue.value)
    shapeGraphNotShow.value = false
    const profileDataItem = props.profileData[profileValue.value - 1]
    const profileDataCompareItem = props.profileDataCompare[profileValue.value - 1]
    const profileInfoItem = props.profileList[profileValue.value - 1]
    profileName.value = profileInfoItem.name
    try {
        section = profileDataItem
            .section.map((value) => {
                return value[2] < -999 ? null : value[2]
            }),
            beforeSection = profileDataItem
                .beforeSection.map((value) => {
                    return value[2] < -999 ? null : value[2]
                })
        compareSection = profileDataCompareItem
            .section.map((value) => {
                return value[2] < -999 ? null : value[2]
            })
        compareBeforeSection = profileDataCompareItem
            .beforeSection.map((value) => {
                return value[2] < -999 ? null : value[2]
            })
    } catch (error) {
        DrawGraph([], [], [], [], [])
        shapeGraphNotShow.value = true
        return
    }
    DrawGraph(section, beforeSection, compareSection, compareBeforeSection)

    // // 更新输入框的值
    inputSpeedList.value = speedList.value[profileValue.value - 1]
    inputGaochaList.value = gaochaList.value[profileValue.value - 1]
    inputPobiList.value = pobiList.value[profileValue.value - 1]
    // console.log(inputSpeedList)
    // console.log(inputGaochaList)
    // console.log(inputPobiList)
}

const showOtherLine = () => {
    var option = shapeChart.getOption()
    option.legend[0].selected['1999年地形'] = !option.legend[0].selected['1999年地形']
    option.legend[0].selected['2012年地形'] = !option.legend[0].selected['2012年地形']
    option.legend[0].selected['2019年地形'] = !option.legend[0].selected['2019年地形']
    shapeChart.setOption(option)
}

const DrawGraph = (section, beforesection, compareSection, compareBeforeSection) => {
    // if (shapeChart !== null) {
    //     shapeChart.dispose();
    // }
    // if (erosionChart !== null) {
    //     erosionChart.dispose();
    // }
    shapeChart = echarts.init(shapeGraphRef.value)
    drawShapeCompareGraph(
        shapeChart,
        section,
        beforesection,
        compareSection,
        compareBeforeSection
    )
}

onMounted(() => {
    calProfileData()
})

watch(() => props.profileData, () => {
    calProfileData()
})

</script>

<style lang="scss" scoped>
div.riskInfo-container {
    position: absolute;
    // top: 54.25vh;
    top: 17vh;
    left: 0.3vw;
    height: 70vh;
    width: 26vw;
    border-radius: 8px;
    border: #167aec 1px solid;
    background-color: rgba(179, 201, 228, 0.6);
    backdrop-filter: blur(10px);
    z-index: 2;

    div.riskInfo-title {
        height: 2vh;
        width: 10vw;
        margin-left: 7.5vw;
        margin-top: 0.6vh;
        line-height: 4.3vh;
        border-radius: 6px;
        // background-color: rgba(235, 240, 247, 0.4);
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.7vw + 0.7vh);
        color: #0c60af;
        text-shadow:
            #f1f1ef 1px 1px,
            #eef3ff 2px 2px,
            #6493ff 3px 3px;

        :deep(.dv-border-box-2) {
            width: 10vw;
            height: 4.6vh;
        }

        button.condition-button {
                position: absolute;
                right: 1.3vw;
                top: 1.5vh;
                width: 3vw;
                height: 3vh;
                background: #0254bed0;
                color: #fff;
                font-family: inherit;
                font-weight: 900;
                font-size: calc(0.3vw + 0.7vh);
                border: 1px solid rgb(3, 107, 167);
                border-radius: 0.4em;
                box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
                cursor: pointer;
                transition: 0.3s linear;

                &:hover {
                  background: #348cffd0;
                }
              }
    }

    div.riskInfo-item {
        position: absolute;
        width: 25vw;
        left: 0.5vw;
        border-radius: 6px;
        border: #3b85e7 2px solid;

        &.profileShape {
            top: 5.5vh;
            height: 45vh;
            // background-color: #c9cad4;
        }

        div.item-title {
            position: absolute;
            top: 1vh;
            left: 0.5vw;
            font-size: calc(0.6vh + 0.6vw);
            font-weight: 600;
            font-family: 'Microsoft YaHei';
            // color: #a231e4;
            // text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
        }

        .el-popover {
            .el-popover__is-light{
                background: red;
            }
            
        }

        div.profile-show-container {
            position: absolute;
            top: 6.2vh;
            width: 0.7vw;
            height: 1.5vh;
            left: 23vw;
            z-index: 5;
            background-color: rgba(67, 148, 240, 0.6);
            border: #56636b solid 2px;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s linear;
            &:hover {
                transform: scale(1.1);
                cursor: pointer;
            }
        }

        div.profile-selector-container {
            position: absolute;
            width: 10vw;
            height: 4vh;
            left: 15vw;
            top: 1vh;
            // background-color: #d1d2db;

            :deep(.el-select) {
                left: 4vw;
                top: 0.4vh;
                width: 5.5vw !important;
                height: 3vh !important;
                box-shadow:
                    rgba(0, 132, 255, 0.8) 1px 1px,
                    rgba(0, 119, 255, 0.7) 1px 1px,
                    rgba(0, 119, 255, 0.6) 2px 2px;
                border-radius: 6px;
            }

            :deep(.el-select__wrapper) {
                height: 3vh;
                line-height: 3vh;
                border-radius: 6px;
                font-family: 'Microsoft YaHei';
                font-weight: bold;
                font-size: calc(0.4vw + 0.5vh);
                background-color: rgba(230, 253, 255, 0.7);
            }

            :deep(.el-select__placeholder) {
                color: #1c68cc;
            }

            :deep(.el-icon) {
                width: 0.8vw;
                height: 0.8vw;

                svg {
                    width: 0.8vw;
                    height: 0.8vw;

                    path {
                        fill: #00098a;
                    }
                }
            }

            :deep(.el-select__tags-text) {
                color: #2b61f7;
                font-size: calc(0.4vw + 0.4vh);
            }
        }

        div.graph-container {
            position: absolute;
            width: 24vw;
            top: 5.6vh;
            left: 0.25vw;

            &.shape {
                height: 38vh;
                backdrop-filter: blur(5px);
                // background-color: rgba(220, 250, 248, 0.4);
            }

            &.erosion {
                height: 17vh;
                backdrop-filter: blur(5px);
                // background-color: #00098a;
            }

            div.graph {
                position: relative;
                width: 100%;
                height: 100%;

                &.shape {
                    // height: 35vh;
                    // background-color: rgba(220, 250, 248, 0.4);
                }

                &.erosion {
                    // height: 17vh;
                    // background-color: #00098a;
                }

                z-index: 99;
            }

            div.empty-graph {
                position: absolute;
                left: 6vw;
                top: 17vh;
                display: flex;
                align-items: center;
                color: #1c68cc;
                font-size: calc(0.7vw + 0.5vh);
                font-family: 'Microsoft YaHei';
                font-weight: bold;
            }
        }
    }
    div.edit-pannel-container {
                position: absolute;
                left: 26.2vw;
                bottom: 0vh;
                display: flex;
                flex-direction: column;
                border: #167aec 1px solid;
                background-color: rgba(179, 201, 228, 0.6);
                backdrop-filter: blur(6px);
                border-radius: 5px;
                height: 26%;
                width: 50%;
                font-family: 'Microsoft YaHei', 'sans-serif';

                div.title {
                    display: flex;
                    width: 100%;
                    height: 20%;
                    color: #0c60af;
                    letter-spacing: 0.1vw;
                    font-weight: bold;

                    font-size: calc(0.8vw + 0.6vh);
                    line-height: 4vh;
                    justify-content: center;
                    align-items: center;
                    text-shadow:
                            #f1f1ef 1px 1px,
                            #eef3ff 2px 2px,
                            #6493ff 3px 3px;
                }

                div.part {
                    display: flex;
                    height: 20%;
                    left: 4vw;
                    font-size: calc(0.6vw + 0.5vh);
                    font-weight: 700;
                    color: #444;
                }

                div.submit {
                    height: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .submit-button {
                        background: #0254bed0;
                        color: #fff;
                        font-family: inherit;
                        font-weight: 900;
                        font-size: calc(0.3vw + 0.7vh);
                        border: #167aec 1px solid;
                        border-radius: 0.4em;
                        box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
                        cursor: pointer;
                        z-index: 4;
                        transition: 0.3s linear;

                        &:hover {
                            background: #348cffd0;
                        }
                    }
                }
            }

    div.text-info-container {
        position: absolute;
        top: 52vh;
        width: 25vw;
        height: 17vh;
        left: 0.5vw;
        // background-color: rgb(223, 255, 250, 0.719);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;

        div.text-info-block {

            width: 22vw;
            height: 4.5vh;
            background-color: #1f73c2;
            margin-top: 0.2vh;
            margin-bottom: 0.2vh;
            border-radius: 10px;

            div.text-info-item {
                text-align: center;
                line-height: 4.5vh;
                position: relative;
                color: #ffffff;
                font-size: calc(0.7vw + 0.5vh);
                font-family: 'Microsoft YaHei';
                font-weight: bold;
            }

        }

    }
}
</style>
    