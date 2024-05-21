<template>
    <div
        class="warn-detail-container"
        :class="props.warnActive ? 'active' : 'in-active'"
        v-loading="detailLoading"
        v-if="props.warnActive"
    >
        <div class="warn-detail-title">报警信息详情</div>
        <div class="warn-detail-content"></div>
        <div class="plan-button-group">
            <div class="plan-button-title">
                <div>处置预案</div>
                <div>预览</div>
            </div>
            <div
                class="plan-button-item"
                v-for="but in buttonInfoList"
                :key="but.index"
            >
                <div class="plan-button-name">{{ but.name }}</div>
                <div class="plan-button-func">预览</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
    warnActive: {
        type: Boolean,
        default: true,
    },
})

const buttonInfoList = ref([
    { index: 0, name: '撤离预案', url: '' },
    { index: 1, name: '行洪运用预案', url: '' },
    { index: 2, name: '重点防御预案', url: '' },
])
</script>

<style lang="scss" scoped>
div.warn-detail-container {
    position: absolute;
    right: 1vw;
    top: 10vh;
    height: 45vh;
    width: 24vw;

    backdrop-filter: blur(12px);
    box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    background-color: rgba(156, 195, 255, 0.8);
    border-radius: 4px;
    border: 2px solid rgb(28, 105, 247);
    z-index: 3;
    border-radius: 4px;
    overflow: hidden;

    div.warn-detail-title {
        height: 4vh;
        line-height: 4vh;
        width: 100%;
        background-color: transparent;
        text-align: center;
        font-size: calc(0.8vw + 0.8vh);
        font-weight: bold;
        color: #0400fd;
        text-shadow:
            #eef3ff 1px 1px,
            #eef3ff 2px 2px,
            #6493ff 3px 3px;
        letter-spacing: 0.4rem;
        border-bottom: 2px solid #0400fd;
    }

    div.warn-detail-content {
        height: 35vh;
        width: 23vw;
        margin-left: 0.5vw;

        background-color: #6493ff;

        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        justify-content: center;

        div.key-val-container {
            margin-top: 0.6vh;
            width: 90%;
            height: 6vh;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            // background-color: #0446a8;
            text-align: center;
            border-bottom: 2px solid rgb(0, 32, 175);

            &:first-child {
                margin-top: 0;
            }

            div.icon {
                width: 20%;
                height: 3vh;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: 50% 50%;
                background-color: transparent;

                &#warning-icon {
                    background-image: url('/warning.png');
                }

                &#length-icon {
                    background-image: url('/distance.png');
                }
            }

            div.key-text {
                width: width;
                line-height: 6vh;
                background-color: transparent;
                font-size: calc(0.7vw + 0.6vh);
                color: #0043fd;
            }

            div.val-text {
                line-height: 6vh;
                font-size: calc(0.7vw + 0.5vh);
                font-weight: bold;
                color: #1d00be;
                // max-width: 70%;
                width: 12vw;
                text-align: right;
                // text-align: center;
            }

            // &:nth-child(2n + 1) {
            //     text-align: left;

            //     // padding-left: 6%;
            //     // border-right: 2px solid rgb(0, 32, 175);
            // }
            // &:nth-child(2n) {
            //     text-align: right;
            //     justify-content: flex-end;
            //     // padding-right: 6%;
            //     // border-left: 2px solid rgb(0, 32, 175);
            // }
        }
    }

    div.plan-button-group {
        height: 4.8vh;
        width: 23vw;
        margin-left: 0.5vw;
        margin-top: 0.5vh;

        // background-color: red;
        border-radius: 2px;
        box-shadow:
            4px 3px rgb(0, 111, 175),
            -4px -3px rgb(20, 94, 255);
        display: flex;
        flex-flow: row nowrap;

        justify-content: space-between;
        align-items: center;

        div.plan-button-title {
            height: 4.5vh;
            line-height: 2vh;
            padding-left: 0.5vw;
            padding-right: 0.5vw;

            font-size: calc(0.5vw + 0.65vh);
            font-weight: bold;

            box-shadow: 3px 0px rgb(4, 0, 255);
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
        }

        div.plan-button-item {
            margin-right: 0.5vw;
            padding-left: 0.5vw;
            padding-right: 0.5vw;
            font-size: calc(0.5vw + 0.4vh);
            height: 4vh;
            line-height: 2vh;
            font-weight: bold;

            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            border-radius: 4px;

            border: 2px solid rgb(0, 119, 255);
            background-color: #b9d7ff;

            &:hover {
                cursor: pointer;
                border: 2px solid rgb(0, 204, 255);
                background-color: #002897;
                color: #dcebff;
            }
        }
    }
}
</style>
