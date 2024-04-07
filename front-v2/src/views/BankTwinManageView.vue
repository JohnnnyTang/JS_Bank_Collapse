<template>
    <div class="bank-twin-container">
        <BankTwinNavVue />
    </div>
</template>

<script setup>
import BankTwinNavVue from '../components/bankTwin/BankTwinNav.vue';

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

    background-color: rgb(222, 250, 215);

}

</style>
