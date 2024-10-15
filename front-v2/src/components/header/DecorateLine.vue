<template>
    <div class="decorate-line-container" ref="domRef">
        <svg :width="width" :height="height">
            <defs>
                <path :id="pathId" :d="pathD" fill="transparent" />
                <radialGradient :id="gradientId" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#fff" stop-opacity="1" />
                    <stop offset="100%" stop-color="#fff" stop-opacity="0" />
                </radialGradient>

                <mask :id="maskId">
                    <circle cx="0" cy="0" :r="width/4" :fill="`url(#${gradientId})`">
                        <animateMotion
                            :dur="`${dur}s`"
                            :path="pathD"
                            rotate="auto"
                            repeatCount="indefinite"
                        />
                    </circle>
                </mask>
            </defs>
            <rect
                :x="x"
                :y="y"
                :width="ifVertical ? lineWidth : width"
                :height="ifVertical ? height : lineWidth"
                :fill="lineColor"
            >
                <animate
                    :attributeName="lineRectAnimeAttrib(ifReverse, ifVertical)"
                    :from="!ifReverse ? 0 : ifVertical ? height : width"
                    :to="ifReverse ? 0 : ifVertical ? height : width"
                    :dur="`${dur}s`"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines=".42,0,.58,1"
                    repeatCount="indefinite"
                    v-if="lineAnimate"
                />
            </rect>
            <!-- <rect
                :x="nodeX"
                :y="nodeY"
                :width="nodeSize"
                :height="nodeSize"
                :fill="nodeColor"
            >
                <animate
                    :attributeName="ifVertical ? 'y' : 'x'"
                    :from="!ifReverse ? 0 : ifVertical ? height : width"
                    :to="ifReverse ? 0 : ifVertical ? height : width"
                    :dur="`${dur}s`"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.42,0,0.58,1"
                    repeatCount="indefinite"
                    v-if="nodeAnimate"
                />
            </rect> -->
            <!-- <circle :cx="nodeX" :cy="nodeY" :r="nodeSize" :fill="nodeColor">
                <animate
                    :attributeName="ifVertical ? 'cy' : 'cx'"
                    :from="!ifReverse ? 0 : ifVertical ? height : width"
                    :to="ifReverse ? 0 : ifVertical ? height : width"
                    :dur="`${dur}s`"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.42,0,0.58,1"
                    repeatCount="indefinite"
                    v-if="nodeAnimate"
                />
            </circle> -->
            <use
                :stroke="nodeColor"
                stroke-width="6"
                :xlink:href="`#${pathId}`"
                :mask="`url(#${maskId})`"

            >
                <animate
                    attributeName="stroke-dasharray"
                    :from="`0, ${width}`"
                    :to="`${width}, 0`"
                    :dur="`${dur}s`"
                    repeatCount="indefinite"
                />
            </use>
        </svg>
    </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import { ref, onMounted, onUnmounted } from 'vue'
const props = defineProps({
    lineWidth: {
        type: Number,
        default: 1,
    },
    ifVertical: {
        type: Boolean,
        default: false,
    },
    lineColor: {
        type: String,
        default: '#2F84E6',
    },
    nodeColor: {
        type: String,
        default: '#01E3E5',
    },
    nodeSize: {
        type: Number,
        default: 2,
    },
    dur: {
        type: Number,
        default: 5,
    },
    ifReverse: {
        type: Boolean,
        default: false,
    },
    lineAnimate: {
        type: Boolean,
        default: true,
    },
    nodeAnimate: {
        type: Boolean,
        default: true,
    },
})

const domRef = ref(null)
const width = ref(0)
const height = ref(0)
const x = ref(0)
const y = ref(0)
const nodeX = ref(0)
const nodeY = ref(0)

const maskId = ref(uuidv4())
const gradientId = ref(uuidv4())
const pathId = ref(uuidv4())
const pathD = ref('')

function lineRectAnimeAttrib(ifRe, ifVt) {
    if (ifRe) {
        if (ifVt) {
            return 'y'
        } else {
            return 'x'
        }
    } else {
        if (ifVt) {
            return 'height'
        } else {
            return 'width'
        }
    }
}

function resizeSvg() {
    // console.log(domRef.value.clientWidth, domRef.value.clientHeight)
    width.value = domRef.value.clientWidth
    height.value = domRef.value.clientHeight
    if (props.ifVertical) {
        x.value = (width.value - props.lineWidth) / 2
        y.value = 0
        // nodeX.value = (width.value - props.nodeSize) / 2
        nodeX.value = width.value / 2
        nodeY.value = 0
    } else {
        x.value = 0
        y.value = (height.value - props.lineWidth) / 2
        // nodeY.value = (height.value - props.nodeSize) / 2
        nodeY.value = height.value / 2
        nodeX.value = 0
    }
    if(props.ifReverse) {
        pathD.value = `M 0, ${height.value / 2 - 3} L ${width.value}, ${height.value / 2 - 3} L ${width.value}, ${height.value / 2 + 3} L 0, ${height.value / 2 + 3} L 0, ${height.value / 2 - 3}`
    }
    else {
        pathD.value = `M 0, ${height.value / 2 - 3} L 0, ${height.value / 2 + 3} L ${width.value}, ${height.value / 2 + 3} L ${width.value}, ${height.value / 2 - 3} L 0, ${height.value / 2 - 3}`
        pathD.value = `M ${width.value}, ${height.value / 2 - 3} L 0, ${height.value / 2 - 3} L 0, ${height.value / 2 + 3} L ${width.value}, ${height.value / 2 + 3} L 0, ${height.value / 2 - 3}`
    }

    // sumWidth.value = width.value + props.titleWidth
    // minusWidth.value = width.value - props.titleWidth
    // smallBlockWidth.value = (width.value - props.titleWidth) / 8
    // smallBlockHeight.value = height.value / 6
}

const resizeObserver = new ResizeObserver((entries) => {
    resizeSvg()
})

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
div.decorate-line-container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    overflow: visible;
}
</style>
