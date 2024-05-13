<template>
    <div class="clock-container">
        <p class="clock-date">{{ clockDate }}</p>
        <p class="clock-time">{{ clockTime }}</p>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { updateTime } from '../../utils/timeUtils';

const clockTime = ref('')
const clockDate = ref('')

function updateClock() {
    let curTime = updateTime()
    clockTime.value = curTime.clockTime
    clockDate.value = curTime.clockDate
}

var timerID = setInterval(updateClock, 1000)
updateClock()

</script>

<style lang="scss" scoped>
$shadow: #6b94e0;

div.clock-container {
    position: absolute;
    top: 1.6vh;
    left: 1vw;
    width: 12vw;
    height: 8.6vh;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    border-radius: 0.2rem;

    background-color: rgba(223, 234, 255, 0.8);
    backdrop-filter: blur(4px);
    box-shadow:
        0 0 4px 1px rgba(#0e50c9, 0.35),
        0 6px 12px 0 rgba(#0d4fc9, 0.65);
    z-index: 3;
    border: 2px solid #0e50c9;

    p {
        width: fit-content;
        color: rgb(3, 29, 145);
        margin-block-start: 0px;
        margin-block-end: 0px;
        line-height: 4vh;
        font-size: calc(0.95vw + 0.3vh);
        font-weight: 600;
        text-align: center;
        text-shadow:
            $shadow 1px 1px,
            $shadow 2px 2px;
        // $shadow 3px 3px;

        &.clock-time {
            letter-spacing: 0.3rem;
            font-size: calc(1.4vw + 0.4vh);
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold',
                sans-serif;
            text-shadow:
                $shadow 1px 1px,
                $shadow 2px 2px;
                // $shadow 3px 3px;
            // $shadow 4px 4px;
        }
    }
}
</style>
