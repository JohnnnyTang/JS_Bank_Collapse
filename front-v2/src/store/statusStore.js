import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatusStore = defineStore(
    'statusStore',
    () => {
        const loginStatus = ref()
        localStorage.getItem('token')? loginStatus.value = true : loginStatus.value = false
        return {
            loginStatus
        }
    }
)
