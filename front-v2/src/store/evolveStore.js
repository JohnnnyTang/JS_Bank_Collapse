import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStabilityStore = defineStore(
    'evolve',
    () => {
        // undefined pending success error
        const sectionData = ref({})
        return {
            sectionData
        }
    },
    {
        persist: {
            storage: sessionStorage,
            paths: ['evolve'],
        },
    },
)
