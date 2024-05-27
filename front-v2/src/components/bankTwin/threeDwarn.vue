<template>
    <div class="test" id="test" style="width: 200px;height: 200px;">
        {{ useDeviceNameStore().deviceName }}
    </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { useDeviceNameStore } from '../../store/mapStore.js'

const deviceCode = ref('')
// const props = defineProps({
//     test: String
// })
// watch(()=>pickedObject.name, (newVal) => {
//     console.log(' i am mounted ', newVal);
// })
watch(() => useDeviceNameStore().deviceName, (newVal) => {
    console.log(' new pick up device ', newVal)
    const deviceMap = {
        '视频': 'camera',
        '应力桩': 'stress',
        '测斜': 'incline',
        'GNSS': 'gnss',
    }
    deviceCode.value = nameMap[newVal]
})

onMounted(() => {
    // console.log(' i am mounted ', pickedObject.name);
    // setInterval(()=>{
    //     console.log(' i am mounted ', DEVICEName);
    // },1000)
})


const nameMap = {
    '视频01': '',
    '视频02': '',
    '视频03': '',
    '应力桩01': 'MZS120.513203_32.042733_2',
    '应力桩02': 'MZS120.515433_32.04231_2',
    '应力桩03': 'MZS120.521221_32.040331_2',
    '应力桩04': 'MZS120.529078_32.034385_2',
    '应力桩05': 'MZS120.541648_32.030524_2',
    '应力桩06': 'MZS120.548925_32.029361_2',
    '应力桩07': 'MZS120.552209_32.028149_2',
    'GNSS测量01': 'MZS120.51749289_32.04059243_1',
    'GNSS测量02': 'MZS120.51977143_32.04001152_1',
    'GNSS测量03': 'MZS120.52557975_32.03825056_1',
    'GNSS测量04': 'MZS120.52660704_32.03676583_1',
    'GNSS测量05': 'MZS120.53334877_32.03227055_1',
    'GNSS测量06': 'MZS120.54599538_32.02837993_1',
    'GNSS测量07': 'MZS120.55327892_32.02707923_1',
    'GNSS测量08': 'MZS120.55649757_32.02592404_1',
    'GNSS测量09': 'MZS120.56334257_32.02298144_1',
    'GNSS测量10': 'MZS120.56944728_32.02070961_1',
    'GNSS基准01': '',
    'GNSS基准02': '',
    'GNSS基准03': '',
    '测斜水压01': 'MZS120.51967889_32.04004108_4',//only 测斜
    '测斜水压02': 'MZS120.51986665_32.03998992_4',
    '测斜水压03': 'MZS120.52557975_32.03825056_4',
    '测斜水压04': 'MZS120.52565217_32.03813574_4',
    '测斜水压05': 'MZS120.52566826_32.03799363_4',
    '测斜水压06': 'MZS120.51726088_32.04054582_4',
    '测斜水压07': 'MZS120.51738292_32.04054923_4',
    '测斜水压08': 'MZS120.51749021_32.04053105_4',
    '测斜水压09': 'MZS120.51957026_32.04008655_4',
}



</script>

<style lang="scss" scoped>
div.test {
    position: relative;
    background-color: rgba(175, 174, 174, 0.8);
}
</style>