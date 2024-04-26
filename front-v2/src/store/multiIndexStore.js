import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMultiIndexStore = defineStore(
    'multiIndex',
    () => {
        const resJson = ref({
        })

        const taskId = ref('')

        return { resJson, taskId }
    },
    {
        persist: {
            storage: sessionStorage,
            paths: ['multiIndex'],
        },
    },
)
