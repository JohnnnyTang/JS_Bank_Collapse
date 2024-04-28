<template>
    <div class="param-card-container">
        <div class="top-section">
            <div class="border">
                <div class="title-text">{{ props.name }}</div>
            </div>
            <div class="see-more-button" @click="changeInfoPage()">
                <div class="button-text">计算</div>
                <div class="button-arrow"></div>
            </div>
            <div class="desc-container">
                <div class="desc-item-container">
                    <div class="desc-item-title desc-text right">
                        地形时间：
                    </div>
                    <div class="desc-item-content desc-text left">
                        {{ props.year }}
                    </div>
                </div>
                <div class="desc-item-container">
                    <div class="desc-item-title desc-text right">
                        创建时间：
                    </div>
                    <div class="desc-item-content desc-text left">
                        {{ props.timeString }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
  name: String,
  year: String,
  timeString: String,
})

const changeInfoPage = () => {}
</script>

<style lang="scss" scoped>
$selector-height: 5vh;
div.param-card-container {
    margin-top: 2vh;
    height: 10vh;
    width: calc(22vw - 16px);
    margin-left: 1vw;
    border-radius: 14px;

    background: #175fa3;
    padding: 8px;

    &:hover {
        transform: scale(1.03, 1.03);
        transition: all 0.3s cubic-bezier(0.68, -0.25, 0.265, 1.15);
    }

    div.top-section {
        height: 10vh;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        background: linear-gradient(45deg, #c9e1f5, #e2ffee);
        position: relative;

        &::before {
            content: '';
            position: absolute;
            top: 4vh;
            left: 0;
            background: rgba(255, 255, 255, 0);
            height: 15px;
            width: 15px;
            border-top-left-radius: 15px;
            box-shadow: -3px -3px 0 2px #175fa3;
        }

        .border {
            border-bottom-right-radius: 10px;
            height: 4vh;
            width: 70%;
            background: #175fa3;
            position: relative;
            transform: skew(-10deg);
            box-shadow: -3px -3px 0 0 #175fa3;

            &::before {
                content: '';
                position: absolute;
                width: 15px;
                height: 15px;
                top: 0;
                right: -15px;
                border-top-left-radius: 10px;
                box-shadow: -3px -3px 0 2px #175fa3;
            }

            .title-text {
                color: #ecf4fd;
                font-size: calc(0.8vw + 0.6vh);
                font-style: normal;
                font-weight: bold;
                text-align: center;
                line-height: 4vh;
            }
        }

        div.see-more-button {
            position: absolute;
            width: 4vw;
            height: 4vh;
            line-height: 4vh;
            // background-color: aquamarine;
            top: 0.1vh;
            right: 0.8vw;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            z-index: 4;

            border-radius: 6px;
            // column-gap: 0.4vw;

            background: linear-gradient(135deg, #1b6dbb 0%, #109fff 100%);
            color: #fff;
            transition: all 0.4s cubic-bezier(0.68, -0.45, 0.265, 1.45);
            &:hover {
                cursor: pointer;
                right: 1.4vw;
                column-gap: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.45, 0.265, 1.45);
            }

            div.button-text {
                width: 3vw;
                height: 4vh;
                // background-color: aqua;
                font-size: calc(0.3vh + 0.6vw);
                font-weight: 600;
                text-align: center;
                font-family: 'Microsoft YaHei';
            }

            div.button-arrow {
                width: 1vw;
                height: 3vh;
                background-image: url('/right-arrow.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;
                // background-color: azure;
            }

            // &.inactive {
            //     display: none;
            // }
        }

        .desc-container {
            color: rgb(0, 23, 71);
            font-style: normal;
            font-weight: bold;
            padding: 5px;
            overflow: hidden;
            height: 5vh;
            border-radius: 8px;

            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;

            div.desc-item-container {
                // width: 50%;
                height: 5vh;
                // background-color: #e2ffee;
                display: flex;
                flex-flow: row nowrap;

                div.desc-text {
                    // width: 50%;
                    text-align: center;
                    line-height: 5vh;
                    font-size: calc(0.6vw + 0.3vh);

                    &.left {
                        text-align: left;
                        color: rgb(0, 69, 173);
                    }
                    &.right {
                        text-align: right;
                    }
                }
            }
        }
    }
}
</style>
