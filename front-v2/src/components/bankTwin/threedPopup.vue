<template>
    <div class="test" id="test" style="width: 200px;height: 200px;">
        {{ useDeviceNameStore().deviceName }}
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useDeviceNameStore } from '../../store/mapStore.js'
// const props = defineProps({
//     test: String
// })
// watch(()=>pickedObject.name, (newVal) => {
//     console.log(' i am mounted ', newVal);
// })
watch(() => useDeviceNameStore().deviceName, (newVal) => {
    console.log(' new pick up device ', newVal);
})

onMounted(() => {
    // console.log(' i am mounted ', pickedObject.name);
    // setInterval(()=>{
    //     console.log(' i am mounted ', DEVICEName);
    // },1000)
})


const nameMap = {
    '视频01':'',
    '视频02':'',
    '视频03':'',
    '应力桩01':'',
    '应力桩02':'',
    '应力桩03':'',
    '应力桩04':'',
    '应力桩05':'',
    '应力桩06':'',
    '应力桩07':'',
    'GNSS测量01':'',
    'GNSS测量02':'',
    'GNSS测量03':'',
    'GNSS测量04':'',
    'GNSS测量05':'',
    'GNSS测量06':'',
    'GNSS测量07':'',
    'GNSS测量08':'',
    'GNSS测量09':'',
    'GNSS测量10':'',
    'GNSS基准01':'',
    'GNSS基准02':'',
    'GNSS基准03':'',
    '测斜水压01':'',
    '测斜水压02':'',
    '测斜水压03':'',
    '测斜水压04':'',
    '测斜水压05':'',
    '测斜水压06':'',
    '测斜水压07':'',
    '测斜水压08':'',
    '测斜水压09':'',
}



</script>

<style lang="scss" scoped>
div.test {
    position: relative;
    background-color: rgba(175, 174, 174, 0.8);
}
</style>