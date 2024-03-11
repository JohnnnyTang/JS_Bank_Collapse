<template>
    <div class="dv-decoration-7" ref="domRef">
        <svg :width="minusWidth / 2" :height="height">
            <!-- <polyline
                :stroke-width="(minusWidth) / 12"
                fill="transparent"
                :stroke="mainColor[0]"
                :points="`
                    ${(minusWidth) * 0.2381}, 0 
                    ${(minusWidth) * 0.4524}, ${height / 2} 
                    ${(minusWidth) * 0.2381}, ${height}
                `"
                class="big-arrow test"
            /> -->
            <polyline
                :stroke-width="minusWidth / 12"
                fill="transparent"
                :stroke="mainColor[0]"
                :points="`
                    ${minusWidth * 0.2381}, ${(1 * height) / 6} 
                    ${minusWidth * 0.2381}, ${height / 2} 
                    ${minusWidth * 0.2381}, ${(5 * height) / 6}
                `"
                class="big-arrow left-big"
            />
            <!-- <polyline
                :stroke-width="(minusWidth) / 16"
                fill="transparent"
                :stroke="mainColor[1]"
                :points="`
                    ${(minusWidth) * 0.0476}, 0 
                    ${(minusWidth) * 0.2619}, ${height / 2}
                    ${(minusWidth) * 0.0476}, ${height}
                `"
                class="small-arrow"
            /> -->
            <polyline
                :stroke-width="minusWidth / 16"
                fill="transparent"
                :stroke="mainColor[1]"
                :points="`
                    ${minusWidth * 0.0476}, 0 
                    ${minusWidth * 0.0476}, ${height / 2}
                    ${minusWidth * 0.0476}, ${height}
                `"
                class="small-arrow left-small"
            />
        </svg>
        <div class="placement-div" :style="{ width: titleWidth + 'px' }"></div>
        <svg :width="minusWidth / 2" :height="height">
            <!-- <polyline
                :stroke-width="(minusWidth) / 12"
                fill="transparent"
                :stroke="mainColor[0]"
                :points="`
                    ${(minusWidth) * 0.2619}, 0 
                    ${(minusWidth) * 0.0476}, ${height / 2}
                    ${(minusWidth) * 0.2619}, ${height}
                `"
                class="big-arrow"
            /> -->
            <polyline
                :stroke-width="minusWidth / 12"
                fill="transparent"
                :stroke="mainColor[0]"
                :points="`
                    ${minusWidth * 0.2619}, ${(1 * height) / 6}  
                    ${minusWidth * 0.2619}, ${height / 2}
                    ${minusWidth * 0.2619}, ${(5 * height) / 6} 
                `"
                class="big-arrow right-big"
            />
            <!-- <polyline
                :stroke-width="(minusWidth) / 16"
                fill="transparent"
                :stroke="mainColor[1]"
                :points="`
                    ${(minusWidth) * 0.4524}, 0 
                    ${(minusWidth) * 0.2381}, ${height / 2}
                    ${(minusWidth) * 0.4524}, ${height}
                `"
                class="small-arrow"
            /> -->
            <polyline
                :stroke-width="minusWidth / 16"
                fill="transparent"
                :stroke="mainColor[1]"
                :points="`
                    ${minusWidth * 0.4524}, 0 
                    ${minusWidth * 0.4524}, ${height / 2}
                    ${minusWidth * 0.4524}, ${height}
                `"
                class="small-arrow right-small"
            />
        </svg>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import anime from 'animejs'

const props = defineProps({
    mainColor: {
        type: Array,
        default: ['#01E3E5', '#46ACE5'],
    },
    titleWidth: {
        type: Number,
        default: 0,
    },
})
const domRef = ref(null)
const width = ref(0)
const height = ref(0)
const minusWidth = ref(0)

function resizeSvg() {
    // console.log(domRef.value.clientWidth, domRef.value.clientHeight)
    width.value = domRef.value.offsetWidth
    height.value = domRef.value.offsetHeight
    // console.log('re', width.value, height.value)
    if (width.value != 0) {
        minusWidth.value = width.value - props.titleWidth
    } else {
        minusWidth.value = 0
    }
}

const trans2Tri = async () => {
    resizeSvg()
    await nextTick()
    // console.log('anime', minusWidth.value)
    anime({
        targets: '.left-big',
        points: [
            {
                value: [
                    `${minusWidth.value * 0.2381}, ${(1 * height.value) / 6}  ${minusWidth.value * 0.2381}, ${height.value / 2} ${minusWidth.value * 0.2381}, ${(5 * height.value) / 6} `,
                ],
            },
            {
                value: [
                    `${minusWidth.value * 0.2381}, 0 ${minusWidth.value * 0.4524}, ${height.value / 2} ${minusWidth.value * 0.2381}, ${height.value}`,
                ],
            },
        ],
        easing: 'easeOutQuad',
        duration: 1000,
        loop: false,
    })

    anime({
        targets: '.left-small',
        points: [
            {
                value: [
                    `${minusWidth.value * 0.0476}, 0  ${minusWidth.value * 0.0476}, ${height.value / 2} ${minusWidth.value * 0.0476}, ${height.value} `,
                ],
            },
            {
                value: [
                    `${minusWidth.value * 0.0476}, 0 ${minusWidth.value * 0.2619}, ${height.value / 2} ${minusWidth.value * 0.0476}, ${height.value}`,
                ],
            },
        ],
        easing: 'easeOutQuad',
        duration: 1000,
        loop: false,
    })

    anime({
        targets: '.right-big',
        points: [
            {
                value: [
                    `   ${minusWidth.value * 0.2619}, ${(1 * height.value) / 6}  
                        ${minusWidth.value * 0.2619}, ${height.value / 2}
                        ${minusWidth.value * 0.2619}, ${(5 * height.value) / 6} 
                    `,
                ],
            },
            {
                value: [
                    `
                        ${(minusWidth.value) * 0.2619}, 0 
                        ${(minusWidth.value) * 0.0476}, ${height.value / 2}
                        ${(minusWidth.value) * 0.2619}, ${height.value}
                    `,
                ],
            },
        ],
        easing: 'easeOutQuad',
        duration: 1000,
        loop: false,
    })

    anime({
        targets: '.right-small',
        points: [
            {
                value: [
                    `
                        ${minusWidth.value * 0.4524}, 0 
                        ${minusWidth.value * 0.4524}, ${height.value / 2}
                        ${minusWidth.value * 0.4524}, ${height.value}
                    `,
                ],
            },
            {
                value: [
                    `
                        ${(minusWidth.value) * 0.4524}, 0 
                        ${(minusWidth.value) * 0.2381}, ${height.value / 2}
                        ${(minusWidth.value) * 0.4524}, ${height.value}
                    `,
                ],
            },
        ],
        easing: 'easeOutQuad',
        duration: 1000,
        loop: false,
    })

}

const initOri = async () => {
    resizeSvg()
    await nextTick()
    anime({
        targets: '.test',
        points: [
            {
                value: [
                    `${minusWidth.value * 0.2381}, 0 ${minusWidth.value * 0.4524}, ${height.value / 2} ${minusWidth.value * 0.2381}, ${height.value}`,
                ],
            },
            {
                value: [
                    `${minusWidth.value * 0.2381}, 0 ${minusWidth.value * 0.2381}, ${height.value / 2} ${minusWidth.value * 0.2381}, ${height.value}`,
                ],
            },
        ],
        easing: 'easeOutQuad',
        duration: 1000,
        loop: false,
    })
}

const resizeObserver = new ResizeObserver((entries) => {
    resizeSvg()
})

defineExpose({
    initOri,
    trans2Tri,
})

onMounted(() => {
    // resizeSvg()
    // console.log('mount', minusWidth.value)
    // domRef = useListenResizeDom(domRef, resizeSvg)
    resizeObserver.observe(domRef.value)
})

onUnmounted(() => {
    resizeObserver.unobserve(domRef.value)
})
</script>

<style lang="scss">
@keyframes blink-fast {
    0% {
        opacity: 0.2;
    }
    60% {
        opacity: 1;
    }

    100% {
        opacity: 1;
    }
}

@keyframes blink {
    0% {
        opacity: 0.2;
    }

    60% {
        opacity: 0.2;
    }

    100% {
        opacity: 1;
    }
}

div.dv-decoration-7 {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    .small-arrow {
        animation: blink-fast 1s ease-in infinite alternate;
    }

    .big-arrow {
        // transition: all 3s ease-in;
        animation: blink 1s ease-in infinite alternate;
    }
}
</style>
