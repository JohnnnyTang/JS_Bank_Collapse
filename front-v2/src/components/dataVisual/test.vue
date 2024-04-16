<template>

    <div class="test">
        <div class="testTitle">TEST-PAGE</div>
    </div>

</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';


onMounted(async () => {

})




</script>

<style lang="scss" scoped>
.test {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 92vh;
    background-color: rgb(0, 0, 0);
    user-select: none;

    .testTitle {
        font-size: calc(1vh + 5vw);
        color: #1eff00;
        text-shadow: 0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px #49ff18, 0 0 30px #49FF18, 0 0 40px #49FF18, 0 0 55px #49FF18, 0 0 75px #49ff18;
    }
}
</style>