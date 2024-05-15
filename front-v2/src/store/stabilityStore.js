import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStabilityStore = defineStore(
    'stability',
    () => {
        // undefined pending success error
        const modelStatus = ref('undefined')
        const modelProgress = ref(0)
        const modelStartTime = ref(0)
        return {
            modelStatus,
            modelProgress,
            modelStartTime,
        }
    },
    {
        persist: {
            storage: sessionStorage,
            paths: ['stability'],
        },
    },
)
