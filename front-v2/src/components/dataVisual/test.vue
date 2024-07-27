<template>
    <div class="main">

    </div>
</template>
<script setup>
import * as dat from 'dat.gui'
import '../../utils/WebGL/dat_gui_style.css'
import { onMounted } from 'vue';


onMounted(() => {

    let gui = new dat.GUI()
    let parameters = {
        aaWidth: 1,
        fillWidth: 2,
        framePerStep: 3,
        velocityFactor: 4,
        arrowAngle: 5,
        arrowLength: 6,
        gridPerRow: 7,
        gridPerCol: 7,
        stop: true,
    }
    gui.domElement.style.position = 'absolute'
    gui.domElement.style.top = '15vh'
    gui.domElement.style.right = '45vw'
    gui.add(parameters, 'stop', false).name('停止').onChange()
    gui.add(parameters, 'aaWidth', 0, 5, 0.1).name('反走样宽度').onChange()
    gui.add(parameters, 'fillWidth', 0, 5, 0.1).name('填充宽度').onChange()
    gui.add(parameters, 'framePerStep', 30, 240, 10).name('帧数控制').onChange()
    gui.add(parameters, 'velocityFactor', 1, 1000, 1).name('速度因子').onChange()
    gui.add(parameters, 'arrowAngle', 0, 90, 1).name('箭头角度').onChange()
    gui.add(parameters, 'arrowLength', 1, 30, 1).name('箭头长度').onChange()
    gui.add(parameters, 'gridPerRow', 10, 200, 1).name('格网行数').onChange()
    gui.add(parameters, 'gridPerCol', 10, 200, 1).name('格网列数').onChange()

    // gui.closedText = '关闭控制面板';
    // gui.openText = '打开控制面板';
    dat.GUI.TEXT_OPEN = "打开控制面板";
    dat.GUI.TEXT_CLOSED = "关闭控制面板";
    gui.open()

    //     GUI.TEXT_CLOSED = 'Close Controls';
    // GUI.TEXT_OPEN = 'Open Controls';


})

</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;
    background-color: rgb(202, 248, 253);

    div.map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    canvas.GPU {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-color: transparent;
    }

    canvas#GPUFrame {
        z-index: 3;
    }

    canvas#UnityCanvas {
        z-index: 1;
    }

    .value {
        position: absolute;
        left: 8vw;
        top: 10px;
        font-size: 12px;
        color: #000000;
        z-index: 1;

        .value-item {
            margin-bottom: 0.2px;
        }
    }
}
</style>
