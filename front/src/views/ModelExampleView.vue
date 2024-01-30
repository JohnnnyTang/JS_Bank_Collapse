<template>
    <div class="model-example-container">
        <el-scrollbar class="top">
            <div class="list-name-container auto-model-name">
                <div class="name-text">自动运行模型案例</div>
            </div>
            <el-skeleton
                style="
                    width: 100vw;
                    height: 46.5vh;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    position: relative;
                    background-image: linear-gradient(
                            rgba(0, 0, 0, 0.5),
                            rgba(0, 0, 0, 0.5)
                        ),
                        url('/long-bg2.jpg');
                    background-size: contain;
                "
                :loading="loadingA"
                animated
                :count="6"
            >
                <template #template>
                    <el-skeleton-item
                        variant="rect"
                        style="width: 12%; height: 40vh"
                    />
                </template>
                <template #default>
                    <div class="auto-model-container model-list-container">
                        <div
                            v-for="(autoTask, index) in autoTaskInfoListRef"
                            class="mode-item-container auto-item"
                            :class="{ expanded: autoTask.expand }"
                        >
                            <div class="task-title-icon"></div>
                            <div class="task-item-title">
                                {{ autoTask.name.split('-')[0] }}<br />{{
                                    autoTask.name.split('-')[1]
                                }}
                            </div>
                            <div class="key-val-container">
                                <div class="key-title-text">使用模型</div>
                                <div class="val-text">预警多指标计算模型</div>
                            </div>
                            <div class="key-val-container">
                                <div class="key-title-text">输入参数</div>
                                <div class="val-text">filePath1, filePath2</div>
                            </div>
                            <div
                                class="key-val-container"
                                v-if="autoTask.expand"
                            >
                                <div class="key-title-text">模型程序</div>
                                <div class="val-text">本地Python</div>
                            </div>
                            <div
                                class="key-val-container"
                                v-if="autoTask.expand"
                            >
                                <div class="key-title-text">参数详情</div>
                                <div class="val-text">
                                    {{
                                        getFileName(
                                            autoTask.paramNode.params.filePath1,
                                        )
                                    }}<br />{{
                                        getFileName(
                                            autoTask.paramNode.params.filePath2,
                                        )
                                    }}
                                </div>
                            </div>
                            <div class="key-val-container">
                                <div class="key-title-text">启动时间</div>
                                <div class="val-text">
                                    {{
                                        transTimestamp2String(
                                            +autoTask.name.split('-')[1],
                                        )
                                    }}
                                </div>
                            </div>
                            <div
                                class="key-val-container"
                                v-if="autoTask.expand"
                            >
                                <div class="key-title-text">结果输出</div>
                                <div class="val-text">
                                    {{
                                        processOutPutStr(
                                            autoTask.result.resultString,
                                        )
                                    }}
                                </div>
                            </div>
                            <div
                                class="detail-info-button"
                                @click="swicthAutoExpand(index)"
                            >
                                {{ autoTask.expand ? '返回' : '更多信息' }}
                            </div>
                        </div>
                    </div>
                </template>
            </el-skeleton>
        </el-scrollbar>
        <el-scrollbar>
            <div class="list-name-container man-model-name">
                <div class="name-text">自定义模型案例</div>
            </div>
            <el-skeleton
                style="
                    width: 100vw;
                    height: 46.5vh;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    position: relative;
                    background-image: linear-gradient(
                            rgba(0, 0, 0, 0.5),
                            rgba(0, 0, 0, 0.5)
                        ),
                        url('/long-bg3.jpg');
                    background-size: contain;
                "
                :loading="loadingB"
                animated
                :count="6"
            >
                <template #template>
                    <el-skeleton-item
                        variant="rect"
                        style="width: 12%; height: 40vh"
                    />
                </template>
                <template #default>
                    <div class="man-model-container model-list-container">
                        <div class="add-item-container">
                            <div class="plus-icon"></div>
                        </div>
                        <div
                            v-for="(autoTask, index) in manTaskInfoListRef"
                            class="mode-item-container auto-item"
                            :class="{ expanded: autoTask.expand }"
                        >
                            <div class="task-title-icon"></div>
                            <div class="task-item-title">
                                {{ autoTask.name.split('-')[0] }}<br />{{
                                    autoTask.name.split('-')[1]
                                }}
                            </div>
                            <div class="key-val-container">
                                <div class="key-title-text">使用模型</div>
                                <div class="val-text">预警多指标计算模型</div>
                            </div>
                            <div class="key-val-container">
                                <div class="key-title-text">输入参数</div>
                                <div class="val-text">filePath1, filePath2</div>
                            </div>
                            <div
                                class="key-val-container"
                                v-if="autoTask.expand"
                            >
                                <div class="key-title-text">模型程序</div>
                                <div class="val-text">本地Python</div>
                            </div>
                            <div
                                class="key-val-container"
                                v-if="autoTask.expand"
                            >
                                <div class="key-title-text">参数详情</div>
                                <div class="val-text">
                                    {{
                                        getFileNameB(
                                            autoTask.paramNode.params,
                                            0,
                                        )
                                    }}<br />{{
                                        getFileNameB(
                                            autoTask.paramNode.params,
                                            1,
                                        )
                                    }}
                                </div>
                            </div>
                            <div class="key-val-container">
                                <div class="key-title-text">启动时间</div>
                                <div class="val-text">暂无数据</div>
                            </div>
                            <div
                                class="key-val-container"
                                v-if="autoTask.expand"
                            >
                                <div class="key-title-text">结果输出</div>
                                <div class="val-text">
                                    {{
                                        processOutPutStr(
                                            autoTask.result.resultString,
                                        )
                                    }}
                                </div>
                            </div>
                            <div
                                class="detail-info-button"
                                @click="swicthManExpand(index)"
                            >
                                {{ autoTask.expand ? '返回' : '更多信息' }}
                            </div>
                        </div>
                    </div>
                </template>
            </el-skeleton>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const loadingA = ref(true);
const loadingB = ref(true);
const autoTaskInfoListRef = ref([]);
const manTaskInfoListRef = ref([]);

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
});

const transTimestamp2String = (timestamp) => {
    var date = new Date(timestamp); //根据时间戳生成的时间对象
    var year = date.getFullYear(); //年
    var month = date.getMonth() + 1; //月
    var day = date.getDate(); //日
    var hour = date.getHours(); //时
    var minutes = date.getMinutes(); //分
    var second = date.getSeconds(); //秒
    var clock = year + '-';
    if (month < 10) clock += '0';
    clock += month + '-';
    if (day < 10) clock += '0';
    clock += day + ' ';
    if (hour < 10) clock += '0';
    clock += hour + ':';
    if (minutes < 10) clock += '0';
    clock += minutes + ':';
    if (second < 10) clock += '0';
    clock += second;
    return clock;
};

const swicthAutoExpand = (index) => {
    autoTaskInfoListRef.value[index].expand =
        !autoTaskInfoListRef.value[index].expand;
};

const swicthManExpand = (index) => {
    manTaskInfoListRef.value[index].expand =
        !manTaskInfoListRef.value[index].expand;
};

const processOutPutStr = (outputStr) => {
    let outList = [];
    let splitList = outputStr.split(',');
    splitList.forEach((el) => {
        outList.push((+el).toFixed(2));
    });
    return outList.join(',');
};

const getFileName = (filePath) => {
    let splitList = filePath.split('\\');
    return splitList[splitList.length - 1];
};

const getFileNameB = (param, i) => {
    let splitList = Object.values(param)[i].split('/');
    return splitList[splitList.length - 1];
};

onMounted(async () => {
    let autoTaskNodes = await backendInstance.get('taskNode/auto');
    autoTaskInfoListRef.value = autoTaskNodes.data;
    autoTaskInfoListRef.value.forEach((taskInfo) => {
        taskInfo['expand'] = false;
    });
    console.log(autoTaskNodes.data);
    loadingA.value = false;

    let manTaskNodes = await backendInstance.get('taskNode/manual');
    manTaskInfoListRef.value = manTaskNodes.data;
    manTaskInfoListRef.value.forEach((taskInfo) => {
        taskInfo['expand'] = false;
    });
    console.log(manTaskNodes.data);
    loadingB.value = false;
});
</script>

<style lang="scss" scoped>
$container-border-width: 5px;
div.model-example-container {
    width: 100vw;
    height: 93vh;
    // background-color: rgb(112, 93, 67);

    div.list-name-container {
        position: fixed;
        // left: 1vw;
        height: 46.5vh;
        width: 4.5vw;
        padding-left: 1vw;
        // background-color: rgb(0, 255, 30);
        // background-image: url("/title-bg.jpg");
        // background-size: cover;
        background-image: linear-gradient(
                rgba(255, 255, 255, 0.4),
                rgba(255, 255, 255, 0.4)
            ),
            url('/knowledge2.jpg');
        background-size: cover;

        z-index: 3;

        &.auto-model-name {
            height: calc(46.5vh - $container-border-width);
            background-image: linear-gradient(
                    rgba(0, 0, 0, 0.5),
                    rgba(0, 0, 0, 0.5)
                ),
                url('/gears.jpg');
            background-size: cover;
            div.name-text {
                height: calc(46.5vh - $container-border-width);
                background: linear-gradient(
                    to bottom,
                    #ffffff 0%,
                    #ffffff 100%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        div.name-text {
            writing-mode: vertical-lr;
            width: 4vw;
            height: 46.5vh;
            text-align: center;
            line-height: 4vw;

            font-size: calc(1vh + 1vw);
            font-weight: 700;
            font-family: 'Microsoft YaHei';

            background: linear-gradient(to bottom, #0a0097 0%, #000000 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;

            // background-color: aliceblue;
        }
    }

    div.model-list-container {
        // position: relative;
        height: 46.5vh;
        width: fit-content;
        min-width: 100vw;
        margin-left: 5.5vw;
        // background-color: aqua;

        display: flex;
        flex-flow: row nowrap;
        column-gap: 7vw;
        align-items: center;

        background-image: linear-gradient(
                rgba(255, 255, 255, 0.5),
                rgba(255, 255, 255, 0.5)
            ),
            url('/long-bg3.jpg');
        background-size: contain;

        &.auto-model-container {
            height: calc(46.5vh - $container-border-width);
            background-image: linear-gradient(
                    rgba(0, 0, 0, 0.5),
                    rgba(0, 0, 0, 0.5)
                ),
                url('/long-bg2.jpg');
            background-size: contain;
            // background-repeat: no-repeat;
        }

        div.mode-item-container {
            height: calc(38.5vh - $container-border-width);
            width: 8vw;
            background-color: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(4px);
            border-radius: 6px;
            padding: 1vh 1vw 1vh 1vw;
            z-index: 1;

            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-content: space-around;
            transition: all 0.2s ease-in-out;

            &.expanded {
                width: 16vw;
                transition: all 0.2s ease-in-out;

                div.task-title-icon {
                    border-bottom: 3px solid rgb(12, 0, 139);
                }

                div.key-val-container {
                    height: 7vh;
                }

                div.detail-info-button {
                    margin-top: 0;
                    margin-left: 6vw;
                    margin-right: 6vw;
                }
            }

            div.task-title-icon {
                width: 8vw;
                // margin-left: 2vw;
                // margin-right: 2vw;
                height: 6vh;
                // background-color: #0a0097;
                background-image: url('/engineering1.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;
            }

            div.task-item-title {
                width: 8vw;
                height: 6vh;
                line-height: 2.5vh;
                text-align: center;

                font-size: calc(0.2vh + 0.7vw);
                font-weight: 700;
                font-family: 'Microsoft YaHei';

                border-bottom: 3px solid rgb(12, 0, 139);
            }

            div.key-val-container {
                text-align: center;
                width: 8vw;
                height: 5vh;
                div.key-title-text {
                    height: 3vh;
                    width: 8vw;
                    line-height: 3vh;
                    font-size: calc(0.5vh + 0.6vw);
                    font-weight: 700;
                    font-family: 'Microsoft YaHei';
                    color: rgb(6, 0, 130);
                }

                div.val-text {
                    height: 2vh;
                    width: 8vw;
                    line-height: 2vh;
                    font-size: calc(0.3vh + 0.6vw);
                    // font-weight: 700;
                    font-family: 'Microsoft YaHei';
                }
            }

            div.detail-info-button {
                width: 4vw;
                margin-left: 2vw;
                margin-right: 2vw;
                margin-top: 1.5vh;
                height: 4vh;
                line-height: 4vh;
                background-color: #0a0097;
                text-align: center;

                font-size: calc(0.3vh + 0.55vw);
                font-weight: 700;
                border-radius: 5px;
                font-family: 'Microsoft YaHei';

                background: linear-gradient(135deg, #3011d4 0%, #2bc5fc 100%);
                color: #e1e1e1;
                box-shadow: 0px 12px 20px -8px rgba(0, 0, 0, 0.6);
                transition: all 0.25s ease-in-out;
                &:hover {
                    cursor: pointer;
                    // right: 1.8vw;
                    // column-gap: 0;
                    font-size: calc(0.3vh + 0.6vw);
                    color: #ffff;
                    box-shadow: 0px 12px 10px -8px rgba(0, 0, 0, 0.8);
                    transition: all 0.25s ease-in-out;
                }
            }
        }

        &.man-model-container {
            :deep(div.task-title-icon) {
                background-image: url("intelligence.png") !important;
            }
            div.mode-item-container {
                background-color: rgba(0, 9, 61, 0.6);
            }

            div.task-item-title {
                word-break: break-all;
                color: rgb(195, 255, 254) !important;
            }

            :deep(div.key-val-container) {
                div.key-title-text {
                    color: rgb(183, 211, 255) !important;
                }

                div.val-text {
                    color: rgb(236, 243, 255) !important;
                }
            }

            :deep(div.detail-info-button) {
                background: linear-gradient(135deg, #bbaffb 0%, #6ccbee 100%) !important;
                color: black !important;
            }
        }

        div.add-item-container {
            height: calc(38.5vh - $container-border-width);
            width: 8vw;
            background-color: rgba(0, 9, 61, 0.4);
            backdrop-filter: blur(7px);
            border-radius: 6px;
            padding: 1vh 1vw 1vh 1vw;
            z-index: 1;

            display: flex;
            justify-content: center;
            align-items: center;

            div.plus-icon {
                width: 8vh;
                height: 8vh;

                // background-color: #000000;

                background-image: url('/add.png');
                background-size: contain;
                background-repeat: no-repeat;
                transition: all 0.3s ease-in-out;

                &:hover {
                    width: 8.5vh;
                    height: 8.5vh;
                    cursor: pointer;
                    transition: all 0.3s ease-in-out;
                }
            }
        }
    }
}
.el-scrollbar {
    height: 46.5vh;
    &.top {
        height: calc(46.5vh - $container-border-width);
        border-bottom: $container-border-width solid rgb(64, 76, 245);
    }
}
</style>
