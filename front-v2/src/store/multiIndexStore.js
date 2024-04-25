import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMultiIndexStore = defineStore(
    'multiIndex',
    () => {
        const taskIdMap = ref({
            section: '',
            water: '',
            land: '',
            multi: '',
        })

        const resJsonId = ref('')

        return { taskIdMap, resJsonId }
    },
    {
        persist: {
            storage: sessionStorage,
            paths: ['multiIndex'],
        },
    },
)
