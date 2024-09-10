<template>
    <div class="main">
        <!-- <div ref="mapRef" id="map"></div> -->

        <div class="math-model-calculation flex-coloum" style="align-items: center" v-show="true">
            <div class="main-title">
                数学模型计算
                <div class="minimize-btn" @click="mathModelCalcBlockShow = false"></div>
            </div>
            <div class="file-upload-container one-center">
                <div class="card border" style="margin-top: 0; height: 25.7vh">
                    <div class="title">
                        <span style="font-size: medium; margin-left: 1vw">➤</span>
                        文件上传
                    </div>
                    <div class="content flex-coloum" style="
                                height: 20vh;
                                justify-content: space-evenly;
                                align-items: center;
                            ">
                        <el-upload v-model:file-list="fileLists[index]" action="#" :show-file-list="false" :limit="1"
                            ref="uploadRef" :http-request="handleUpload" v-for="(item, index) in filesNeedUpload
                            " style="height: 4vh">
                            <el-button type="primary" plain>
                                {{ item }}
                                <span>({{ exampleFileLists[index] }})</span>
                            </el-button>
                        </el-upload>
                    </div>
                </div>
            </div>
            <div class="model-container one-center">
                <div class="card border">
                    <div class="title">
                        <span style="font-size: medium; margin-left: 1vw">➤</span>
                        模型计算
                    </div>
                    <div class="content flex-coloum" style="
                                justify-content: flex-start;
                                align-items: center;
                            ">
                        <div class="setting-container">
                            <div class="judge-container flex-coloum" style="
                                        justify-content: center;
                                        align-items: center;
                                    ">
                                <div class="judge-desc">
                                    是否作为参考动力条件加入崩岸风险研判 ?
                                </div>

                                <el-radio-group v-model="mathModelParams.addToRiskJudgeFlag
                                    ">
                                    <el-radio value="1" size="large">
                                        是
                                    </el-radio>
                                    <el-radio value="2" size="large">
                                        否
                                    </el-radio>
                                </el-radio-group>

                                <div class="after-judge one-center" v-show="mathModelParams.addToRiskJudgeFlag ==
                                    1
                                    ">
                                    <div class="flex-coloum">
                                        <div style="margin-bottom: 1vh">
                                            <span>流量：</span>
                                            <el-input v-model="mathModelParams.flow
                                                " style="
                                                        width: 8vw;
                                                        height: 3.5vh;
                                                    " placeholder="请输入流量" />
                                        </div>
                                        <div>
                                            <span>潮型：</span>
                                            <el-select v-model="mathModelParams.tideType
                                                " placeholder="请选择潮型" style="
                                                        width: 8vw;
                                                        height: 3.5vh;
                                                        
                                                    " @change="">
                                                <el-option v-for="(
                                                            item, index
                                                        ) in tideTypeList" :key="index" :label="item"
                                                    :value="tideValue[index]">
                                                    <div style="
                                                                text-align: center;
                                                            ">
                                                        {{ item }}
                                                    </div>
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="after-judge one-center" v-show="mathModelParams.addToRiskJudgeFlag ==
                                    2
                                    ">
                                    <div class="flex-row">
                                        <span style="line-height: 3.5vh">自定义名称：</span>
                                        <el-input v-model="mathModelParams.customName
                                            " style="
                                                    width: 6vw;
                                                    height: 3.5vh;
                                                " placeholder="请输入名称" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="running-container">
                            <el-button type="primary" plain @click="runMathModel">确认并运行</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ElMessage } from 'element-plus';
const mapRef = ref(null)



//////////////////// math model calculation ////////////////////START
const uploadRef = ref(null)
const filesNeedUpload = ['属性文件', '网格文件', '控制文件', '径流边界', '潮位边界']
const exampleFileLists = ['fort.13', 'fort.14', 'fort.15', 'fort.19', 'fort.20']
const fileLists = ref([[], [], [], [], []])
const mathModelParams = reactive({
    addToRiskJudgeFlag: null,
    flow: null,
    tideType: null,
    customName: null,
})
const tideTypeList = ['小潮', '中潮', '大潮']
const tideValue = ['xc', 'zc', 'dc']
const handleUpload = (file) => {
    console.log('user upload file -- ', file)
}
const runMathModel = () => {
    console.log('mathModelParams')
    console.log(mathModelParams)
    console.log('file lists')
    console.log(fileLists.value)

    const formData = new FormData()
    for (let i = 0; i < fileLists.value.length; i++) {
        const fileList = fileLists.value[i]
        const key = exampleFileLists[i]
        if (fileList.length > 0) {
            const file = fileList[0].raw
            formData.append(key, file)
        } else {
            alert('文件未完全上传！')
            return
        }
    }
    const name = mathModelParams.addToRiskJudgeFlag == 1 ? '' + mathModelParams.flow + mathModelParams.tideType : mathModelParams.customName
    const mathModelInfo = {
        "segment": "Mzs",
        "year": "2023",
        "set": "standard",
        "name": name,
        "temp": mathModelParams.addToRiskJudgeFlag == 1,
        "boundary": "geojson/Mzs/2023/standard/boundary/boundary.geojson"
    }
    formData.append("info", JSON.stringify(mathModelInfo))

    axios.post('/model/taskNode/start/numeric/hydrodynamic/real', formData).then(res => {
        ElMessage.success({
            message: '模型开始计算',
            offset: 130
        })
    }).catch(err => {
        ElMessage.success({
            message: '模型计算失败',
            offset: 130
        })
        console.error('数模计算失败', err)
    })
}
//////////////////// math model calculation ////////////////////END





onMounted(async () => {

    // const map = new mapboxgl.Map({
    //     container: mapRef.value, // container ID
    //     accessToken:
    //         'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
    //     style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
    //     center: [120.312, 31.917], // starting position [lng, lat]
    //     zoom: 8,
    //     maxZoom: 22,
    //     projection: 'mercator',
    //     antialias: true,
    //     transformRequest: (url) => {
    //         if (url.startsWith(import.meta.env.VITE_APP_TEMP_ADDRESS)) {
    //             return {
    //                 url: url,
    //                 headers: { token: localStorage.getItem("token") },
    //             };
    //         }
    //     },

    // }).on('load', async () => {
    //     console.log('PureScratchMap init!')

    //     let tileInfo = {
    //         "name": "199901",
    //         "bank": "Mzs"
    //     }
    //     const tileServer = import.meta.env.VITE_APP_TEMP_ADDRESS

    //     map.addSource('mapRaster2020', {
    //         type: 'raster',
    //         tiles: [
    //             tileServer + '/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
    //         ],
    //         // tileSize: 1024,
    //         // minzoom: 10,
    //         // maxzoom: 20,
    //         // bounds: [120.509, 32.023, 120.555, 32.0402],
    //     })
    //     // map.addLayer({
    //     //     id: 'ras',
    //     //     type: 'raster',
    //     //     source: 'mapRaster2020',
    //     // })

    //     map.addSource('demTile', {
    //         type: 'raster',
    //         tiles: [tileServer + '/tile/raster/dem/Mzs/199901/{x}/{y}/{z}'],
    //         tileSize: 1024,
    //         minzoom: 10,
    //         maxzoom: 20,
    //         bounds: [120.509, 32.023, 120.555, 32.0402],
    //     })
    //     map.addLayer({
    //         id: 'ras',
    //         type: 'raster',
    //         source: 'demTile',
    //         paint: {
    //             'raster-opacity': 1.0,
    //         }
    //     })

    // })

})
</script>

<style lang="scss" scoped>
div.flex-coloum {
    display: flex;
    flex-direction: column;
}

div.flex-row {
    display: flex;
    flex-direction: row;
}

div.one-center {
    position: relative;
    display: grid;
    place-items: center;
}

.main {
    position: absolute;
    width: 100vw;
    height: 92vh;
    display: flex;
    align-items: center;
    justify-content: center;

    #map {
        width: 100%;
        height: 100%;
    }

    div.math-model-calculation {
        position: absolute;
        z-index: 1;
        top: 8vh;
        left: 20.3vw;
        width: 15vw;
        // height: 76vh;
        background-color: rgb(248, 248, 248);
        // backdrop-filter: blur(20px);
        border-radius: calc(0vw + 0.5vh);
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
            rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
            rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

        div.main-title {
            position: relative;
            width: 13vw;
            height: 5vh;
            font-size: calc(0.8vw + 0.7vh);
            font-weight: 800;
            font-family: 'Microsoft YaHei';
            text-align: center;
            line-height: 5vh;
            color: #054bb3;
            // border-bottom: #055279 solid 2px;

            div.minimize-btn {
                position: absolute;
                right: 0.1vw;
                top: 1.5vh;
                width: 2vh;
                height: 2vh;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url('/minimize.png');
                z-index: 1;
                cursor: pointer;
            }
        }

        div.file-upload-container {
            position: relative;
            width: 14.8vw;
            height: 26vh;

            :deep(.el-button, .el-button--primary, .is-plain) {
                width: 8vw;
                height: 3.7vh;
                font-size: calc(0.5vw + 0.6vh);
                font-family: 'Microsoft YaHei';
                margin: 0;
            }
        }

        div.model-container {
            position: relative;
            width: 14.8vw;
            // height: 44.8vh;
            margin-bottom: 0.5vh;

            .card {
                margin-bottom: 0.7vh;

                .content {
                    .running-container {
                        margin-top: 0.5vh;
                        border: #0d6eff54 solid 1px;
                        border-radius: 5px;
                    }

                    .setting-container {
                        margin-top: 1vh;
                        border: #0d6eff54 solid 1px;
                        border-radius: 5px;

                        .judge-container {
                            position: relative;
                            width: 14vw;

                            .judge-desc {
                                position: relative;
                                margin-top: 1vh;
                                margin-bottom: 1vh;
                                width: 12.5vw;
                                font-size: calc(0.6vw + 0.4vh);
                                font-weight: 600;
                            }

                            .after-judge {
                                position: relative;
                                margin-top: 1vh;
                                margin-bottom: 1vh;
                                width: 12.5vw;
                                font-size: calc(0.6vw + 0.4vh);
                                font-weight: 600;
                            }

                            .confirm-container {
                                position: relative;
                                margin-top: 1vh;
                                margin-bottom: 1vh;
                                width: 12.5vw;
                                font-size: calc(0.6vw + 0.4vh);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>