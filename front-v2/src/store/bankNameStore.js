import { defineStore } from 'pinia'
import { ref } from 'vue'

// export const useBankNameStore = defineStore('bankNameStore', () => {
//         const globalBankName = ref()
//         return {
//             globalBankName
//         }
//     }
// )

// 启用持久化,刷新页面保留bank的值
export const useBankNameStore = defineStore('bankNameStore', {
    persist: true, 
    state: () => ({
        globalBankName: '' // 初始值
    })
})