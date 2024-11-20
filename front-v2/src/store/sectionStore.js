import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSectionStore = defineStore(
    'sectionStore',
    () => {
        const sectionDataCache = new Map()
        return {
            sectionDataCache
        }
    }
)
