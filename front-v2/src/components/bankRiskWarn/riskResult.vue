<template>
    <div class="risk-result-container">
        <div class="risk-result-title">
            风险评估结果
        </div>
        <dv-decoration10
            :Dur="1"
            :color="['#0446a8','rgb(134, 245, 230)']"
            style="position: absolute; height: 9vh; width: 20vw; left: 5.3vw;"
        />
        
        <!-- <dv-border-box8
            class="low"
            :dur="3"
            :color="['rgba(1, 1, 1, 0)', 'rgb(0, 176, 240)']"
        ></dv-border-box8> -->
        <div class="risk-item-container low">
            <div class="risk-item-title-container low">
                <div class="risk-item-title">
                    低风险区域:
                </div>
            </div>
            <div class="risk-item-content">
                <div
                    v-for="item in riskResult"
                    :key="item.value"
                    class="risk-item-name"
                >
                    <span
                        class="risk-item-span low"
                        v-if="item.risk === 'low'"
                    >
                        {{ item.name }}
                    </span>
                </div>
            </div>
        </div>

        <!-- <dv-border-box8
            class="middle"
            :dur="3"
            :color="['rgba(1, 1, 1, 0)', 'rgb(237, 125, 49)']"
        ></dv-border-box8> -->
        <div class="risk-item-container middle">
            <div class="risk-item-title-container middle">
                <div class="risk-item-title">
                    中风险区域:
                </div>
            </div>
            <div class="risk-item-content">
                <div
                    v-for="item in riskResult"
                    :key="item.value"
                    class="risk-item-name"
                >
                    <span
                        class="risk-item-span middle"
                        v-if="item.risk === 'middle'"
                    >
                        {{ item.name }}
                    </span>
                </div>
            </div>
        </div>

        <!-- <dv-border-box8
            class="high"
            :dur="3"
            :color="['rgba(1, 1, 1, 0)', 'rgba(255, 0, 0, 0.5)']"
        ></dv-border-box8> -->
        <div class="risk-item-container high">
            <div class="risk-item-title-container high">
                <div class="risk-item-title">
                    高风险区域:
                </div>
            </div>
            <div class="risk-item-content">
                <div
                    v-for="item in riskResult"
                    :key="item.value"
                    class="risk-item-name"
                >
                    <span
                        class="risk-item-span high"
                        v-if="item.risk === 'high'"
                    >
                        {{ item.name }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
const riskResult = ref([
    {
        value: 1,
        name: 'JC01: 头部围堤',
        risk: 'low'
    },
    {
        value: 2,
        name: 'JC02: 南顺堤',
        risk: 'low'
    },
    {
        value: 3,
        name: 'JC03: 南顺堤尾部',
        risk: 'middle'
    },
    {
        value: 4,
        name: 'JC04: 江滩办事处',
        risk: 'middle'
    },
    {
        value: 5,
        name: 'JC05: 小港池',
        risk: 'low'
    },
    {
        value: 6,
        name: 'JC06: 张靖皋桥位上游',
        risk: 'low'
    },
    {
        value: 7,
        name: 'JC07: 张靖皋桥位下游',
        risk: 'middle'
    },
    {
        value: 8,
        name: 'JC08: 海事码头',
        risk: 'high'
    },
    {
        value: 9,
        name: 'JC09: 海事码头下游',
        risk: 'middle'
    },
    {
        value: 10,
        name: 'JC10: 雷达站',
        risk: 'high'
    },
    {
        value: 11,
        name: 'JC11: 民主沙尾部主路',
        risk: 'middle'
    },
    {
        value: 12,
        name: 'JC12: 民主沙尾',
        risk: 'high'
    }
])
onMounted(() => {
    
})
</script>

<style lang="scss" scoped>
    div.risk-result-container {
        position: absolute;
        left: 69vw;
        top: 2vh;
        width: 30vw;
        height: 30vh;
        border: 2px solid rgb(169, 197, 226);
        border-radius: 6px;
        background-color: rgba(164, 212, 255, 0.8);
        backdrop-filter: blur(12px);
        z-index: 2;

        div.risk-result-title{
            position: absolute;
            left: 11.2vw;
            width: 10vw;
            line-height: 4vh;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.9vw + 0.7vh);
            color: #0c60af;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
        }

        div.risk-item-container {
            position: absolute;
            top: 5.3vh;
            width: 9vw;
            height: 23.5vh;
            border-radius: 6px;

            &.low {
                left: 0.7vw;
                border: 1px solid rgba(0, 176, 240, 0.7);
                background-color: rgba(0, 176, 240, 0.2);
            }

            &.middle {
                left: 10.5vw;
                border: 1px solid rgba(237, 125, 49, 0.7);
                background-color: rgba(237, 125, 49, 0.2);
            }

            &.high {
                left: 20.3vw;
                border: 1px solid rgba(255, 0, 0, 0.7);
                background-color: rgba(255, 0, 0, 0.2);
            }

            div.risk-item-title-container {
                position: absolute;
                left: 0.15vw;
                top: 0.4vh;
                width: 5.7vw;
                height: 3vh;
                border-radius: 10px;

                &.low {
                    background-color: rgba(19, 99, 204, 0.9);
                }

                &.middle {
                    background-color: rgba(223, 117, 18, 0.9);
                }

                &.high {
                    background-color: rgba(223, 42, 18, 0.9);
                }

                div.risk-item-title {
                    position: absolute;
                    left: 0.3vw;
                    top: 0.2vh;
                    font-weight: bold;
                    font-size: calc(0.7vw + 0.5vh);
                    color:#eef3ff;
                }
            }

            div.risk-item-content {
                position: absolute;
                top:4vh;
                left:0.3vw;
                width: 8.4vw;
                height: 19.3vh;

                div.risk-item-name {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: auto;

                    span.risk-item-span {
                        font-size: calc(0.6vw + 0.4vh);
                        font-weight: 600;
                        line-height: 3vh;

                        &.low {
                            color:rgb(2, 46, 102);
                        }

                        &.middle {
                            color:rgb(90, 52, 3);
                        }

                        &.high {
                            color:rgb(80, 2, 2);
                        }
                    }
                }
            }
        }
        // :deep(.dv-border-box-8) {
        //     position: fixed;
        //     top: 5vh;
        //     width: 9.3vw;
        //     height: 24vh;
        //     z-index: 10;

        //     &.low {
        //         left: 0.6vw;
        //     }

        //     &.middle {
        //         left: 10.4vw;
        //     }

        //     &.high {
        //         left: 20.2vw;
        //     }
        // }
    }
    
</style>
