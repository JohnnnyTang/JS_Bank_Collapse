<template>
<div class="risk-result-shower">
    <dv-decoration-2
        :Dur="2"
        :reverse="true"
        :color="['rgba(255, 255, 255, 1)']"
        style="position: absolute; height: 43vh; width: 0.45vw; top: 1vh"
    />
    <div class="risk-result-wrapper">
        <div class="risk-title-container">
            <div class="risk-title-text">
                岸段风险状态
            </div>
        </div>
        <div class="risk-line"></div>
        <div class="risk-index-container low" v-if="riskDataAll[props.riskDataIndex].value==='low'">
            <div class="risk-index-image">
                <img src="/left_triangle.png" alt="左箭头">
            </div>
            <div class="risk-index-text low">
                {{ riskDataAll[props.riskDataIndex].label }}
            </div>
        </div>
        <div class="risk-index-container middle" v-else-if="riskDataAll[props.riskDataIndex].value==='middle'">
            <div class="risk-index-image">
                <img src="/left_triangle.png" alt="左箭头">
            </div>
            <div class="risk-index-text middle">
                {{ riskDataAll[props.riskDataIndex].label }}
            </div>
        </div>
        <div class="risk-index-container high" v-else>
            <div class="risk-index-image">
                <img src="/left_triangle.png" alt="左箭头">
            </div>
            <div class="risk-index-text high">
                {{ riskDataAll[props.riskDataIndex].label }}
            </div>
        </div>
        <div
            class="show-more-text"
            v-if="props.showRiskResult===false"
            @click="props.showRiskResult=!props.showRiskResult"
        >
            <dv-decoration-7 style="position:absolute;width:8vw;height:2.5vh;top:40vh">
                具体断面信息
            </dv-decoration-7>
        </div>
        <div
            class="show-more-text"
            v-else
            @click="props.showRiskResult=!props.showRiskResult"
        >
            <dv-decoration-7 style="position:absolute;width:8vw;height:2.5vh;top:40vh">
                关闭
            </dv-decoration-7>
        </div>
    </div>
    <dv-decoration-2
        :Dur="2"
        :reverse="true"
        :color="['rgba(255, 255, 255, 1)']"
        style="position: absolute; height: 43vh; width: 19.55vw; top: 1vh"
    />
</div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['showRiskResultChange'])
const props = defineProps({
    riskDataIndex: {
        type: Number,
    },
    showRiskResult: {
        type: Boolean,
    }
})

const riskDataAll = ref([
    {
        value: 'low',
        label: '低风险'
    },
    {
        value: 'middle',
        label: '中风险'
    },
    {
        value: 'high',
        label: '高风险'
    },
])

</script>

<style lang="scss" scoped>
 div.risk-result-shower {
    position: absolute;
    top: 6vh;
    right: 2.5vw;
    width: 10vw;
    height: 45vh;
    background-color: rgba(48, 49, 51, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    border: #167aec 1px solid;
    z-index: 2;

    div.risk-result-wrapper {
        position: absolute;
        top: 0.4vh;
        right: 0.45vw;
        width: 9vw;
        height: 44vh;
        backdrop-filter: blur(5px);
        background-color: rgba(252, 253, 255, 0.9);
        border-radius: 10px;
        border: #167aec 1px solid;
        z-index: 2;

        div.risk-title-container {
            position: absolute;
            top: 0.5vh;
            right: 0.24vw;
            width: 8.5vw;
            height: 4vh;
            border-radius: 6px;
            background-color: rgb(73, 90, 250);

            div.risk-title-text {
                position: absolute;
                top: 0.3vh;
                left: 0.6vw;
                text-align: center;
                font-family: 'Microsoft YaHei';
                font-weight: bold;
                font-size: calc(0.9vw + 0.6vh);
                color:rgb(255, 255, 255);
            }
        }

        div.risk-line {
            position: absolute;
            top: 6vh;
            left: 1vw;
            width: 1vw;
            height: 33vh;
            border-radius: 20px;
            border:#0f1011 2px solid;
            z-index: 2;
            background-image: linear-gradient(to bottom, rgb(17, 17, 255), rgb(220, 126, 37), rgb(255, 9, 9))
        }

        div.risk-index-container {
            position: absolute;
            left: 1vw;
            width: 4vw;
            height: 2.5vh;

            &.low {
                top: 6vh;
            }

            &.middle {
                top: 20vh;
            }

            &.high {
                top: 34vh;
            }

            div.risk-index-image {
                position: absolute;
                left: 1.2vw;
                top: 1vh;
                width: 2.5vw;
                height: 2vh;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }

            div.risk-index-text {
                position: absolute;
                left: 3.8vw;
                top: 0.4vh;
                width: 3.5vw;
                height: 2vh;
                font-family: 'Microsoft YaHei';
                font-weight: bold;
                font-size: calc(0.8vw + 0.5vh);
                text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
            
                &.low {
                    color: rgb(32, 93, 207);
                }

                &.middle {
                    color: rgb(220, 126, 37);
                }

                &.high {
                    color: rgb(255, 9, 9);
                }
            }

        }

        div.show-more-text {
            position: absolute;
            top: 0.4vh;
            left: 0.5vw;
            width: 6vw;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.6vw + 0.4vh);
            cursor: pointer;
            transition: transform 0.3s ease;
            &:hover {
                transform: scale(1.01);
            }

        }
    }
}
</style>
    