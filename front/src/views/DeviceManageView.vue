<template>
    <div class="deviceManage-container">
        <div class="device-content-container">
            <el-skeleton style="width: 240px" :loading="loading" animated>
                <template #template>
                    <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
                    <div style="padding: 14px">
                        <el-skeleton-item variant="h3" style="width: 50%" />
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-items: space-between;
                            margin-top: 16px;
                            height: 16px;
                        ">
                            <el-skeleton-item variant="text" style="margin-right: 16px" />
                            <el-skeleton-item variant="text" style="width: 30%" />
                        </div>
                    </div>
                </template>
                <template #default>
                    <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
                        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                            class="image" />
                        <div style="padding: 14px">
                            <span>Delicious hamburger</span>
                            <div class="bottom card-header">
                                <div class="time">{{ currentDate }}</div>
                                <el-button text class="button">Operation button</el-button>
                            </div>
                        </div>
                    </el-card>
                </template>
            </el-skeleton>
        </div>

    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
div.deviceManage-container {
    height: 93vh;
    width: 100vw;
    // background-color: aquamarine;
    background-image: url("/wave-bg.png");

    div.device-content-container {
        position: relative;
        width: 88vw;
        height: 90vh;
        background-color: rgba(109, 141, 172, 0.664);
        left: 6vw;
        top: 1.5vh;

        display: flex;
        flex-flow: row wrap;

        justify-content: space-around;
        align-content: space-around;
        
        border-radius: 8px;
        backdrop-filter: blur(6px);
    }
}
</style>