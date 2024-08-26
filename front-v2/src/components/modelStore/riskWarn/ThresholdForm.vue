<template>
    <div class="threshold-form">
        <div class="form-container">
            <el-row>
                <el-col :span="6">
                    <div class="title">
                        <div class="title-text">一级指标</div>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="title">
                        <div class="title-text">二级指标</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="title">
                        <div class="title-text">风险阈值</div>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="title">
                        <div class="title-text">权重</div>
                    </div>
                </el-col>
            </el-row>
            <el-row style="height: 15vh;">
                <el-col :span="6" style="height: 13.8vh;">
                    <!-- <div class="full ep-bg-purple" style="height: 100%;">水流动力指标</div> -->
                    <div class="indicator-1 ">
                        <div class="indicator-title">水流动力指标</div>
                        <div class="indecator-weight">
                            <div class="desc">准则权重</div>
                            <div class="weight">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wRL'][0]">
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">抗冲流速指标</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">造床流量当量</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">水位变幅指标</div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="10">
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Ky'][0]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Ky'][1]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Ky'][2]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['PQ'][0]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['PQ'][1]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['PQ'][2]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Zd'][2]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Zd'][2]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Zd'][2]">
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wNM'][0]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wNM'][1]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wNM'][2]">
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row style="height: 15vh;">
                <el-col :span="6" style="height: 13.8vh;">
                    <div class="indicator-1">
                        <div class="indicator-title">河床演变指标</div>
                        <div class="indecator-weight">
                            <div class="desc">准则权重</div>
                            <div class="weight">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wRL'][1]">
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">岸坡坡比指标</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">近岸冲刷指标</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">滩槽高差指标</div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="10">
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Sa'][0]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Sa'][1]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Sa'][2]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Ln'][0]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Ln'][0]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Ln'][0]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Zb'][0]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Zb'][1]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Zb'][2]">
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wRE'][0]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wRE'][1]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wRE'][2]">
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row style="height: 15vh;">
                <el-col :span="6" style="height: 13.8vh;">
                    <div class="indicator-1 ">
                        <div class="indicator-title">地质工程指标</div>
                        <div class="indecator-weight">
                            <div class="desc">准则权重</div>
                            <div class="weight">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wRL'][2]">
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">土体组成指标</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">岸坡防护指标</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="indicator-2">
                                <div class="indicator-text">荷载控制指标</div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="10">
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Dsed'][0]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Dsed'][1]">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['Dsed'][2]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <div class="NA">N/A</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <div class="NA">N/A</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <div class="NA">N/A</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="full">
                                <div class="NA">N/A</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <div class="NA">N/A</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="full">
                                <div class="NA">N/A</div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wGE'][0]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wGE'][1]">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div class="full">
                                <input type="number" name="" :step="0.01" v-model="thresholdParmas['wGE'][2]">
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'



//////////////// threshold params
const thresholdParmas = reactive({
    "Zb": [0.0, 0.0, 0.0],
    "Sa": [0.0, 0.0, 0.0],
    "Ln": [0.0, 0.0, 0.0],
    "PQ": [0.0, 0.0, 0.0],
    "Ky": [0.0, 0.0, 0.0],
    "Zd": [0.0, 0.0, 0.0],
    "Dsed": [0.0, 0.0, 0.0],
    "all": [0.0, 0.0, 0.0],
    "wNM": [0.0, 0.0, 0.0],
    "wRE": [0.0, 0.0, 0.0],
    "wGE": [0.0, 0.0, 0.0],
    "wRL": [0.0, 0.0, 0.0],
})
const requestTemplate = async () => {
    // threshold template
    const json = {
        "Zb": [20, 30, 40],
        "Sa": [0.2, 0.3, 0.5],
        "Ln": [0.04, 0.12, 0.20],
        "PQ": [0.5, 1.0, 2.3],
        "Ky": [1.7, 1.35, 1.0],
        "Zd": [0.1, 0.15, 0.3],
        "Dsed": [0.7, 1.0, 1.5],
        "all": [0.25, 0.50, 0.75],
        "wNM": [0.43, 0.32, 0.25],
        "wRE": [0.48, 0.16, 0.36],
        "wGE": [0.6, 0.2, 0.2],
        "wRL": [0.32, 0.43, 0.25]
    }
    const res = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(json)
        }, 0)
    })
    const json2params = (res) => {
        for (let key in res) {
            if (res.hasOwnProperty(key)) {
                thresholdParmas[key] = res[key]
            }
        }
    }
    json2params(res)
}
defineExpose({
    thresholdParmas
})




onMounted(() => {
    requestTemplate()
})
</script>

<style lang="scss" scoped>
.threshold-form {
    position: relative;
    width: 50vw;
    // height: 54vh;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;


    .form-container {
        position: relative;
        width: 45vw;
        height: 48vh;
        padding: calc(0.5vw + 0.5vh);
        border-radius: 3px;
        user-select: none;
        background-color: rgb(232, 247, 255);
        // box-shadow: rgba(0, 72, 131, 0.2) 5px 5px, rgba(0, 72, 131, 0.1) 10px 10px, rgba(0, 72, 131, 0.05) 15px 15px;


        .el-row {
            margin-bottom: 2px;
            align-items: center;
            position: relative;
        }

        .el-row:last-child {
            margin-bottom: 0;
        }

        .el-col {
            border-radius: 4px;
            // border: solid 1px #020000;
        }


        .title {
            position: relative;
            width: 100%;
            height: 4vh;
            line-height: 4vh;
            display: flex;
            justify-content: center;
            align-items: center;

            .title-text {
                width: 98%;
                background-color: rgb(40, 113, 159);
                border-radius: 2px;
                text-align: center;
                color: aliceblue;
                font-size: calc(0.7vw + 0.7vh);
                font-weight: 600;
            }
        }

        .full {
            position: relative;
            width: 100%;
            height: 4vh;
            // background-color: aliceblue;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;

            .NA {
                position: relative;
                height: 3.5vh;
                width: 90%;

                border: none !important;
                border-right: 2px solid rgb(2, 143, 199) !important;
                border-bottom: 1px solid rgb(5, 88, 121) !important;
                border-radius: 5px;
                text-align: center;
                background-color: rgb(187, 230, 255);

                display: grid;
                place-items: center;
                font-size: calc(0.5vw + 0.5vh);
                transition: .3s ease-in-out;
            }

            input {
                position: relative;
                height: 3.5vh;
                width: 90%;

                border: none !important;
                border-right: 2px solid rgb(2, 143, 199) !important;
                border-bottom: 1px solid rgb(5, 88, 121) !important;
                border-radius: 5px;
                text-align: center;
                background-color: rgb(187, 230, 255);

                display: grid;
                place-items: center;
                font-size: calc(0.6vw + 0.5vh);
                transition: .3s ease-in-out;

                &:focus {
                    background-color: rgb(236, 245, 254);
                    color: rgb(3, 99, 177);
                    font-weight: bold;
                }
            }
        }

        .indicator-1 {
            position: relative;
            width: 99%;
            height: 100%;
            background-color: rgb(211, 232, 249);
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .indicator-title {
                position: relative;
                height: 3.5vh;
                line-height: 3.5vh;
                font-weight: 700;
                font-size: calc(0.7vw + 0.7vh);
                color: rgb(0, 40, 170);

                margin-top: 1vh;
                margin-bottom: .2vh;
            }

            .indecator-weight {
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: center;

                .desc {
                    position: relative;
                    height: 3vh;
                    line-height: 3vh;
                    font-weight: 400;
                    font-size: calc(0.5vw + 0.6vh);
                    margin-right: .2vw;
                    padding: 0vh .5vw;
                    background-color: rgb(194, 232, 252);
                }

                .weight {

                    input {
                        height: 2.8vh;
                        width: 2.5vw;

                        border: none !important;
                        // border-right: 2px solid rgb(2, 143, 199) !important;
                        // border-bottom: 1px solid rgb(5, 88, 121) !important;
                        border-radius: 2px;
                        text-align: center;
                        background-color: rgb(178, 222, 248);

                        display: grid;
                        place-items: center;
                        font-size: calc(0.5vw + 0.4vh);
                        transition: .3s ease-in-out;
                        ;

                    }
                }

            }
        }

        .indicator-2 {
            position: relative;
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .indicator-text {
                color: rgb(0, 79, 170);
                background-color: rgb(211, 232, 249);
                height: 4.2vh;
                line-height: 4.5vh;
                text-align: center;
                width: 95%;
                font-size: calc(0.5vw + 0.7vh);
                font-weight: 400;
                border-radius: 5px;
            }

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