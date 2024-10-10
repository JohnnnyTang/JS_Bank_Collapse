<template>
    <div class="bank-twin-container">
        <BankTwinNavVue ref="navRef" />
        <router-view  @refresh-bank-list="updateBankBasicInfoHandler"/>
    </div>
</template>

<script setup>
import BankTwinNavVue from '../components/bankManage/BankTwinNav.vue';
import { ref } from 'vue';

const navRef = ref(null);
const updateBankBasicInfoHandler = (val) => {
    if (!val) return;
    if (navRef.value) {
        navRef.value.updateBankList()
    }
}
// const refreshBanklistHandler = (val) => {
//     if (!val) return
//     if (navRef.value) {
//         navRef.value.updateBankList()
//     }
// }

</script>

<style lang="scss" scoped>
div.bank-twin-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    --el-menu-item-height: 8vh;
    --el-menu-sub-item-height: 6vh;
    --el-menu-border-color: #0536bd;
    --el-menu-item-font-size: calc(0.5vw + 0.5vh);
    --el-menu-bg-color: rgba(143, 210, 255, 0.9);
    --el-menu-text-color: rgba(0, 9, 59, 0.9);

    letter-spacing: 0.2rem;

    overflow: hidden;

    background: linear-gradient(70deg, rgba(0, 56, 128, 1) 0%, rgb(44, 151, 252) 100%);

    :deep(.el-form) {
        // background-color: red;
        margin: 0vh 2vw;

    }

}
</style>
