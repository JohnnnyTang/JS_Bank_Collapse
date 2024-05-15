<template>
    <div class="realtime-video-container" :class="props.active? 'active': 'in-active'">
        <div class="realtime-video-title">实时视频监控</div>
        <div class="video-box" v-for="(item, index) in videoList" :key="index">
            <div class="video-content">
                <iframe
                    :src="item.videoUrl + token"
                    width="100%"
                    height="100%"
                    :id="item.name"
                    allowfullscreen
                >
                </iframe>
            </div>
            <div class="video-title">{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'

const token = ref(
    'at.9muaq1l4dwsnaqkfbhn98qxe10ud6kgw-54xl36oksd-1bmu6o1-pilufj5d3',
)

const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
})

const videoList = ref([
    {
        name: '民主沙上游围堤监控',
        position: '32.0432963, 120.5122242',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        position: '32.0381061, 120.5263473',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙海事码头监控',
        position: '32.0316674, 120.5402574',
        // videoUrl: `https://open.ys7.com/ezopen`,
         videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.live&autoplay=1&accessToken=`,
    },
])
</script>

<style lang="scss" scoped>
div.realtime-video-container {
    position: absolute;
    right: 1vw;
    top: 9vh;

    height: 82vh;
    width: 24vw;

    z-index: 4;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;

    backdrop-filter: blur(12px);
    box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    background-color: rgba(156, 195, 255, 0.4);
    border-radius: 4px;
    border: 2px solid rgb(28, 105, 247);

    div.realtime-video-title {
        height: 4vh;
        line-height: 4vh;
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

    div.video-box {
        width: 23vw;
        margin-left: 0.5vw;
        height: 25vh;

        background-color: rgba(3, 63, 173, 1);

        div.video-content {
            height: 22vh;
            width: 23vw;

            background-color: rgb(34, 75, 165);
        }

        div.video-title {
            line-height: 3vh;
            height: 3vh;
            text-align: center;

            font-weight: bold;
            font-size: calc(0.6vw + 0.6vh);
            color: #eef3ff;
        }
    }


    transition: transform 0.2s ease-in-out;
    &.in-active {
        transform: translateX(30vw);
    }
}
</style>
