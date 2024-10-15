<template>
    <div class="dv-border-box-11" ref="domRef">
        <svg class="dv-border-svg-container" :width="width" :height="height">
            <defs>
                <filter
                    :id="filterId"
                    height="150%"
                    width="150%"
                    x="-25%"
                    y="-25%"
                >
                    <feMorphology
                        operator="dilate"
                        radius="2"
                        in="SourceAlpha"
                        result="thicken"
                    />
                    <feGaussianBlur
                        in="thicken"
                        stdDeviation="3"
                        result="blurred"
                    />
                    <feFlood :flood-color="mainColor[1]" result="glowColor" />
                    <feComposite
                        in="glowColor"
                        in2="blurred"
                        operator="in"
                        result="softGlowColored"
                    />
                    <feMerge>
                        <feMergeNode in="softGlowColored" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <!-- 外包线 -->
            <polyline
                :stroke="mainColor[0]"
                :filter="`url(#${filterId})`"
                :points="`
                    ${sumWidth / 2}, ${0.5 * height} 
                    ${sumWidth / 2 - 0.067 * titleWidth}, ${0.05 * height}
                    ${minusWidth / 2 + 0.067 * titleWidth}, ${0.05 * height}
                    ${minusWidth / 2}, ${0.5 * height}  
                    ${minusWidth / 2 + 0.067 * titleWidth}, ${0.96 * height}
                    ${sumWidth / 2 - 0.067 * titleWidth}, ${0.96 * height} 
                    ${sumWidth / 2}, ${0.5 * height} 
                `"
            />
            <!-- 右上 -->
            <!-- <polygon
                :stroke="mainColor[0]"
                fill="transparent"
                :points="`
                    ${(sumWidth) / 2 - 5}, ${0.5 * height}  ${(sumWidth) / 2 - 21}, ${0.12 * height} 
                    ${(sumWidth) / 2 - 27}, ${0.12 * height}  ${(sumWidth) / 2 - 10}, ${0.62 * height} 
                `"
            /> -->
            <polygon
                :stroke="mainColor[0]"
                fill="transparent"
                :points="`
                    ${sumWidth / 2 - 0.017 * titleWidth}, ${0.5 * height}  ${sumWidth / 2 - 0.07 * titleWidth}, ${0.12 * height} 
                    ${sumWidth / 2 - 0.09 * titleWidth}, ${0.12 * height}  ${sumWidth / 2 - 0.033 * titleWidth}, ${0.62 * height} 
                `"
            />
            <!-- 左下 -->
            <!-- <polygon
                :stroke="mainColor[0]"
                fill="transparent"
                :points="`
                    ${(minusWidth) / 2 + 5}, ${0.5 * height} ${(minusWidth) / 2 + 22}, ${0.9 * height}
                    ${(minusWidth) / 2 + 28}, ${0.9 * height} ${(minusWidth) / 2 + 8}, ${0.41 * height}
                `"
            /> -->
            <polygon
                :stroke="mainColor[0]"
                fill="transparent"
                :points="`
                    ${minusWidth / 2 + 0.017 * titleWidth}, ${0.5 * height} ${minusWidth / 2 + 0.074 * titleWidth}, ${0.9 * height}
                    ${minusWidth / 2 + 0.093 * titleWidth}, ${0.9 * height} ${minusWidth / 2 + 0.027 * titleWidth}, ${0.41 * height}
                `"
            />
            <!-- 中大 -->
            <!-- <polygon
                :stroke="mainColor[0]"
                :fill="fade(mainColor[1], 30)"
                :filter="`url(#${filterId})`"
                :points="`
                    ${(sumWidth) / 2 - 11}, ${0.74 * height} ${(sumWidth) / 2 - 32}, ${0.1 * height}
                    ${(minusWidth) / 2 + 23}, ${0.1 * height} ${(minusWidth) / 2 + 11}, ${0.36 * height}
                    ${(minusWidth) / 2 + 33}, ${0.95 * height} ${(sumWidth) / 2 - 22}, ${0.95 * height}
                `"
            /> -->
            <polygon
                :stroke="mainColor[0]"
                :fill="fade(mainColor[1], 60)"
                :filter="`url(#${filterId})`"
                :points="`
                    ${sumWidth / 2 - 0.037 * titleWidth}, ${0.74 * height} ${sumWidth / 2 - 0.107 * titleWidth}, ${0.1 * height}
                    ${minusWidth / 2 + 0.077 * titleWidth}, ${0.1 * height} ${minusWidth / 2 + 0.037 * titleWidth}, ${0.36 * height}
                    ${minusWidth / 2 + 0.11 * titleWidth}, ${0.95 * height} ${sumWidth / 2 - 0.074 * titleWidth}, ${0.95 * height}
                `"
            />
            <!-- 左上1 -->
            <polygon
                :filter="`url(#${filterId})`"
                :fill="lighten(mainColor[1], 25)"
                opacity="1"
                :points="`
                    ${(17 * minusWidth) / 32}, ${0.05 * height} ${(17 * minusWidth) / 32 - smallBlockWidth}, ${0.05 * height}
                    ${minusWidth / 2 - smallBlockWidth}, ${0.05 * height + smallBlockHeight} ${minusWidth / 2}, ${0.05 * height + smallBlockHeight}
                `"
            >
                <animate
                    attributeName="opacity"
                    values="1;0.7;1"
                    dur="2s"
                    begin="0s"
                    repeatCount="indefinite"
                />
            </polygon>
            <!-- 左上2 -->
            <polygon
                :filter="`url(#${filterId})`"
                :fill="lighten(mainColor[1], 40)"
                opacity="1"
                :points="`
                    ${minusWidth / 2 - smallBlockWidth}, ${0.05 * height} ${minusWidth / 2 - 2 * smallBlockWidth}, ${0.05 * height}
                    ${(15 * minusWidth) / 32 - 2 * smallBlockWidth}, ${0.05 * height + smallBlockHeight} ${(15 * minusWidth) / 32 - smallBlockWidth}, ${0.05 * height + smallBlockHeight}
                `"
            >
                <animate
                    attributeName="opacity"
                    values="0.7;0.4;0.7"
                    dur="2s"
                    begin="0s"
                    repeatCount="indefinite"
                />
            </polygon>
            <!-- 左上3 -->
            <polygon
                :filter="`url(#${filterId})`"
                :fill="lighten(mainColor[1], 50)"
                opacity="0.5"
                :points="`
                    ${(15 * minusWidth) / 32 - 2 * smallBlockWidth}, ${0.05 * height} ${(15 * minusWidth) / 32 - 3 * smallBlockWidth}, ${0.05 * height}
                    ${(7 * minusWidth) / 16 - 3 * smallBlockWidth}, ${0.05 * height + smallBlockHeight} ${(7 * minusWidth) / 16 - 2 * smallBlockWidth}, ${0.05 * height + smallBlockHeight}
                `"
            >
                <animate
                    attributeName="opacity"
                    values="0.5;0.2;0.5"
                    dur="2s"
                    begin="0s"
                    repeatCount="indefinite"
                />
            </polygon>
            <!-- 右上1 -->
            <polygon
                :filter="`url(#${filterId})`"
                :fill="lighten(mainColor[1], 25)"
                opacity="1"
                :points="`
                    ${sumWidth / 2 - minusWidth / 32}, ${0.05 * height} ${sumWidth / 2 - minusWidth / 32 + smallBlockWidth}, ${0.05 * height}
                    ${sumWidth / 2 + smallBlockWidth}, ${0.05 * height + smallBlockHeight} ${sumWidth / 2}, ${0.05 * height + smallBlockHeight}
                `"
            >
                <animate
                    attributeName="opacity"
                    values="1;0.7;1"
                    dur="2s"
                    begin="0s"
                    repeatCount="indefinite"
                />
            </polygon>
            <!-- 右上2 -->
            <polygon
                :filter="`url(#${filterId})`"
                :fill="lighten(mainColor[1], 40)"
                opacity="0.7"
                :points="`
                    ${sumWidth / 2 + smallBlockWidth}, ${0.05 * height} ${sumWidth / 2 + 2 * smallBlockWidth}, ${0.05 * height}
                    ${sumWidth / 2 + minusWidth / 32 + 2 * smallBlockWidth}, ${0.05 * height + smallBlockHeight} ${sumWidth / 2 + minusWidth / 32 + smallBlockWidth}, ${0.05 * height + smallBlockHeight}
                `"
            >
                <animate
                    attributeName="opacity"
                    values="0.7;0.4;0.7"
                    dur="2s"
                    begin="0s"
                    repeatCount="indefinite"
                />
            </polygon>
            <!-- 右上3 -->
            <polygon
                :filter="`url(#${filterId})`"
                :fill="lighten(mainColor[1], 50)"
                opacity="0.5"
                :points="`
                    ${sumWidth / 2 + minusWidth / 32 + 2 * smallBlockWidth}, ${0.05 * height} ${sumWidth / 2 + minusWidth / 32 + 3 * smallBlockWidth}, ${0.05 * height}
                    ${sumWidth / 2 + minusWidth / 16 + 3 * smallBlockWidth}, ${0.05 * height + smallBlockHeight} ${sumWidth / 2 + minusWidth / 16 + 2 * smallBlockWidth}, ${0.05 * height + smallBlockHeight}
                `"
            >
                <animate
                    attributeName="opacity"
                    values="0.5;0.2;0.5"
                    dur="2s"
                    begin="0s"
                    repeatCount="indefinite"
                />
            </polygon>
        </svg>
    </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import { ref, onMounted, onUnmounted } from 'vue'
import { fade, lighten } from '../../utils/colorUtils'

const filterId = ref(uuidv4())

const width = ref(0)
const height = ref(0)
let domRef = ref(null)
const sumWidth = ref(0)
const minusWidth = ref(0)
const smallBlockWidth = ref(0)
const smallBlockHeight = ref(0)

const props = defineProps({
    mainColor: {
        type: Array,
        default: ['#8aaafb', '#1f33a2'],
    },
    titleWidth: {
        type: Number,
        default: 300,
    },
})

function resizeSvg() {
    // console.log(domRef.value.clientWidth, domRef.value.clientHeight)
    width.value = domRef.value.clientWidth
    height.value = domRef.value.clientHeight
    sumWidth.value = width.value + props.titleWidth
    minusWidth.value = width.value - props.titleWidth
    smallBlockWidth.value = (width.value - props.titleWidth) / 8
    smallBlockHeight.value = height.value / 6
}

const resizeObserver = new ResizeObserver((entries) => {
    resizeSvg()
})

// const resizeObserver = new ResizeObserver(resizeSvg)

onMounted(() => {
    // console.log(props.titleWidth)
    // console.log(width.value, height.value)
    resizeSvg()
    // domRef = useListenResizeDom(domRef, resizeSvg)
    resizeObserver.observe(domRef.value)
})

onUnmounted(() => {
    resizeObserver.unobserve(domRef.value)
})
</script>

<style lang="scss" scoped>
div.dv-border-box-11 {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 12;

    .dv-border-svg-container {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;

        polyline {
            fill: none;
            stroke-width: 1;
        }
    }

    .border-box-content {
        position: relative;
        width: 100%;
        height: 100%;
    }
}
</style>
