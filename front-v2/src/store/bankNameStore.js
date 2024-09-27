import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBankNameStore = defineStore(
    'bankNameStore',
    () => {
        const globalBankName = ref('Mzs') // default bank name
        return {
            globalBankName
        }
    }
)