import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useResourceStore = defineStore('resourceStore', () => {
    const resourceInfo = ref({})

    return { resourceInfo }
})