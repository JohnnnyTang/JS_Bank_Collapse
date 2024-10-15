import { onMounted, onUnmounted, toValue, ref } from 'vue'

export function useListenResizeDom(domRef) {
    const width = ref(0)
    const height = ref(0)
    
    const resizeObserver = new ResizeObserver((entries) => {
        console.log('resize', domRef.value.clientWidth, domRef.value.clientHeight )
        width.value = domRef.value.clientWidth;
        height.value = domRef.value.clientHeight;
    })

    // const domEle = toValue(domRef)

    onMounted(() => {
        console.log(domRef.value.clientHeight)
        resizeObserver.observe(domRef.value)
    })

    onUnmounted(() => {
        resizeObserver.unobserve(domRef.value)
    })

    return { width, height }
}
