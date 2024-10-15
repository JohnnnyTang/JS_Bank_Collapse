<template>
    <div class="warn-notice-container">
        <div class="warn-notice-title">
            <div class="warn-notice-icon"></div>
            <div class="warn-title-text">最新预警提示</div>
        </div>
        <table class="warn-table-container">
            <thead>
                <tr>
                    <th><h3>名称</h3></th>
                    <th><h3>断面名称</h3></th>
                    <th><h3>预警时间</h3></th>
                    <th><h3>预警等级</h3></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>GNSS-CL01</td>
                    <td>断面2</td>
                    <td>8:46</td>
                    <td
                        class="danger"
                        :class="{ active: curActiveIndex === 0 }"
                    >
                        危险
                    </td>
                </tr>
                <tr>
                    <td>GNSS-CL02</td>
                    <td>断面2</td>
                    <td>8:26</td>
                    <td class="danger" :class="{ active: curActiveIndex === 1 }">
                        危险
                    </td>
                </tr>
                <tr>
                    <td>GNSS-CL03</td>
                    <td>断面2</td>
                    <td>8:26</td>
                    <td class="danger" :class="{ active: curActiveIndex === 2 }">
                        危险
                    </td>
                </tr>
                <tr>
                    <td>应力桩-YL01</td>
                    <td>断面2</td>
                    <td>8:36</td>
                    <td class="warn" :class="{ active: curActiveIndex === 3 }">
                        警告
                    </td>
                </tr>
                <tr>
                    <td>GNSS-CL04</td>
                    <td>断面2</td>
                    <td>8:16</td>
                    <td class="focus" :class="{ active: curActiveIndex === 4 }">
                        关注
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const curActiveIndex = ref(-1)

onMounted(() => {
    setInterval(() => {
        curActiveIndex.value = (curActiveIndex.value + 1) % 5
    }, 3000)
})
</script>

<style lang="scss" scoped>
$shadow: #6b94e0;
$shadowGreen: #6be071;
$shadowBlue: #6ba7e0;
$shadowOrange: #e0a96b;
$shadowRed: #e06b6b;

div.warn-notice-container {
    position: absolute;
    top: 59vh;
    left: 1vw;
    width: 20vw;
    height: 30vh;

    background-color: rgba(45, 213, 255, 0.4);
    backdrop-filter: blur(5px);

    border: solid 3px #0064e7;
    border-radius: 0.2rem;
    overflow: hidden;

    div.warn-notice-title {
        width: 20vw;
        height: 6vh;

        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 0.4vw;

        // border-style: solid;
        border-bottom: inset 2px #0064e7;

        background-color: rgba(0, 61, 192, 1);

        div.warn-notice-icon {
            height: 4vh;
            width: 4vh;
            background-image: url('/alert1.png');
            background-size: contain;
        }

        div.warn-title-text {
            width: fit-content;
            height: 6vh;
            line-height: 6vh;
            text-align: center;
            font-size: calc(1vw + 0.3vh);
            font-weight: 600;
            // color: #173eaa;
            color: #e3f4ff;
            text-shadow:
                #173eaa 1px 1px,
                #173eaa 2px 2px,
                #173eaa 3px 3px;
        }
    }

    .warn-table-container {
        overflow: hidden;
        width: 20vw;
        height: 24vh;
        margin: 0 0 0 0;
        border-right: none;
        border-left: none;
        font-weight: 600;

        td,
        th,
        tr {
            text-align: center;
            border-collapse: collapse;
            // border-bottom: 1px solid #b5dbff;
            color: #00447c;
            font-size: calc(0.6vw + 0.2vh);
        }
        tbody {
            position: relative;
            top: 4px;
        }

        tr:nth-child(odd) {
            background-color: #f1f6ff;
        }
        tr:nth-child(even) {
            background-color: #a3d3ff;
        }

        th {
            background-color: #e1efff;
            height: 2vh;
            color: #173eaa;
            border-radius: 4px;
            border: 1px solid #1546cca2;
            text-shadow:
                #c7e7fd 1px 1px,
                #c7e7fd 2px 2px,
                #c7e7fd 3px 3px;
            box-shadow:
                $shadowBlue 1px 1px,
                $shadowBlue 2px 2px,
                $shadowBlue 3px 3px,
                $shadowBlue 4px 4px,
                $shadowBlue 5px 5px;
            transform: translate3d(-4px, -1px, 0);
            h3 {
                height: 2vh;
                line-height: 2vh;
                margin-block-start: 0.5em;
                margin-block-end: 0.5em;
            }
        }

        td:first-child {
            color: #1755c9;
            font-weight: 600;
        }

        td {
            transition: all 1s cubic-bezier(0.68, -0.45, 0.265, 1.45);
            &.danger {
                color: #ac2323;
                font-weight: bold;
                font-size: calc(0.7vw + 0.3vh);

                &.active {
                    background-color: #ac2323;
                    box-shadow:
                        $shadowRed 1px 1px,
                        $shadowRed 2px 2px,
                        $shadowRed 3px 3px,
                        $shadowRed 4px 4px,
                        $shadowRed 5px 5px,
                        $shadowRed 6px 6px;
                }
            }
            &.warn {
                color: #e26600;
                font-weight: 600;
                font-size: calc(0.7vw + 0.3vh);
                &.active {
                    background-color: #e26600;
                    box-shadow:
                        $shadowOrange 1px 1px,
                        $shadowOrange 2px 2px,
                        $shadowOrange 3px 3px,
                        $shadowOrange 4px 4px,
                        $shadowOrange 5px 5px,
                        $shadowOrange 6px 6px;
                }
            }
            &.focus {
                color: #2a008b;
                font-weight: 600;
                font-size: calc(0.7vw + 0.3vh);
                &.active {
                    background-color: #2a008b;
                    box-shadow:
                        $shadowBlue 1px 1px,
                        $shadowBlue 2px 2px,
                        $shadowBlue 3px 3px,
                        $shadowBlue 4px 4px,
                        $shadowBlue 5px 5px,
                        $shadowBlue 6px 6px;
                }
            }
        }
        // tr:hover {
        //     background-color: #464a52;
        //     -webkit-box-shadow: 0 6px 6px -6px #0e1119;
        //     -moz-box-shadow: 0 6px 6px -6px #0e1119;
        //     box-shadow: 0 6px 6px -6px #0e1119;
        // }
        td.active {
            // background-color: #bce1ff;
            color: #f3ffff;
            font-weight: bold;
            border-radius: 4px;

            box-shadow:
                $shadowBlue 1px 1px,
                $shadowBlue 2px 2px,
                $shadowBlue 3px 3px,
                $shadowBlue 4px 4px,
                $shadowBlue 5px 5px,
                $shadowBlue 6px 6px;
            transform: translate3d(-6px, -6px, 0);

            transition: all 1s cubic-bezier(0.68, -0.45, 0.265, 1.45);
        }
    }
}
</style>
