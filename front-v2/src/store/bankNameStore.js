import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBankNameStore = defineStore(
    'bankNameStore',
    () => {
        const globalBankName = ref()
        return {
            globalBankName
        }
    }
)