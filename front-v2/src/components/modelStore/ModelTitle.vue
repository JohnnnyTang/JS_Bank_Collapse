<template>
    <div class="model-title-container">
        <div class="return-arrow" @click="returnMain">
        </div>
        <div class="title-text">
            {{ ModelName }}
        </div>
        <div class="bank-select-container">

            <el-select v-model="selectedBank" placeholder="选择岸段" style="width: 10vw; height: 3.5vh" :value-key="'name'"
                @change="selectedBankChangeHandler">
                <el-option v-for="(item, index ) in bankList" :key="index" :label="item.name" :value="item">
                    <div style="text-align: center; width: 7vw; font-size: calc(0.6vw + 0.7vh); font-weight: bold;">{{
                        item.name
                    }}</div>
                </el-option>
                <el-option disabled :value="''">
                    <div style="text-align: center;width: 7vw;font-size: calc(0.6vw + 0.7vh); font-weight: bold;">···</div>
                </el-option>
            </el-select>

        </div>
    </div>
</template>

<script setup>

import { useRouter } from 'vue-router'
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useBankInfoStore } from '../../store/bankInfoStore'
import BankResourceHelper from './views/bankResourceHelper';
const router = useRouter()
const bankInfoStore = useBankInfoStore()

const selectedBank = ref(null)
const bankList = ref([])
const emit = defineEmits(['confirmBank'])

const selectedBankChangeHandler = (value) => {
    console.log(value)
    emit('confirmBank', {
        name: value.name,
        bankEnName: value.bank,
    })
}

const returnMain = () => {
    router.push('/modelStore')
}
const props = defineProps({
    ModelName: String,
})

const getBankList = async () => {
    if (bankInfoStore.bankList.length > 0) {
        return bankInfoStore.bankList
    }

    try {
        const bankResource = (await BankResourceHelper.getBankNamesList()).data
        let _bankList = []
        bankResource.forEach(item => {
            _bankList.push({
                name: item.name,
                bankEnName: item.bank,
            })
        })
        bankInfoStore.bankList = _bankList
        return _bankList

    } catch (err) {
        console.log(err)
    }



}

onMounted(() => {
    getBankList().then(data => {
        console.log(data)
        bankList.value = data
    })
})

</script >

<style lang="scss" scoped>
div.model-title-container {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: row;
    width: calc(100% - 20px);
    height: 5%;
    text-align: left;
    // padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 20px;

    background: linear-gradient(45deg, rgb(91, 219, 209), rgb(35, 119, 247));


    div.return-arrow {
        width: 2vw;
        height: 4vh;
        margin-top: 0.5vh;
        background-image: url('/left-arrow.png');
        background-size: contain;
        transition: transform 0.25s ease;
        background-repeat: no-repeat;
        background-position: 50% 50%;

        &:hover {
            cursor: pointer;
            transform: scale(1.1);
        }

    }

    div.title-text {

        width: 20vw;
        padding-left: 1%;
        font-size: calc(1vh + 1vw);
        font-weight: 600;
        font-family: 'Microsoft YaHei';
        color: aliceblue;
        text-shadow: #4bb0f3 1px 1px;
    }

    div.bank-select-container {
        position: absolute;
        right: 1vw;
        top: 0;
        // background-color: aliceblue;
        width: 13vw;
        height: 5vh;
        display: grid;
        place-items: center;

        :deep(.el-select) {
            height: 3.5vh;
            box-shadow:
                rgba(173, 255, 251, 0.8) 1px 1px,
                rgba(173, 255, 251, 0.7) 2px 2px,
                rgba(173, 255, 251, 0.6) 3px 4px;
            border-radius: 6px;
        }

        :deep(.el-select__wrapper) {
            height: 3.5vh;
            line-height: 3.3vh;
            border-radius: 6px;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.7vw + 0.7vh);
            background-color: #ffffff;
        }

        :deep(.el-select__placeholder) {
            color: #0956ad;
        }

        :deep(.el-icon) {
            width: 0.5vw;
            height: 0.5vw;

            svg {
                width: 0.5vw;
                height: 0.5vw;

                path {
                    fill: #001cb8;
                }
            }
        }
    }


}
</style>
