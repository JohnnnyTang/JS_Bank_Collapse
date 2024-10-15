import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useBankInfoStore = defineStore('bankInfoStore', () => {
    const bankList = ref([])

    return {
        bankList
    }
})

