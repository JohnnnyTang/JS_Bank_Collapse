<template>
    <canvas id="playground"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const vs = `#version 300 es
precision highp float;

out vec2 vUv;
vec4[] vertices = vec4[4](vec4(-1.0, -1.0, 0.0, 0.0), vec4(1.0, -1.0, 1.0, 0.0), vec4(-1.0, 1.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0));

void main() {

    vec4 attributes = vertices[gl_VertexID];

    gl_Position = vec4(attributes.xy, 0.0, 1.0);
    vUv = attributes.zw;
}

`
const fs = `#version 300 es
precision mediump float;

in vec2 vUv;
uniform float u_time;
uniform float u_ratio;
uniform vec2 u_pointer_position;

out vec4 FragColor;

vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;

    for (int j = 0; j < 15; j++) {
        uv = rotate(uv, 1.);
        sine_acc = rotate(sine_acc, 1.);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer);
        res += (.5 + .5 * cos(layer)) / scale;
        scale *= (1.2 - .07 * p);
    }
    return res.x + res.y;
}

void main() {
    vec2 uv = .5 * vUv;
    uv.x *= u_ratio;

    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0., 1.);
    p = .5 * pow(1. - p, 2.);

    float t = .001 * u_time;
    vec3 color = vec3(0.);

    float noise = neuro_shape(uv, t, p);

    noise = 1.2 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(.0, noise - .5);
    noise *= (1. - length(vUv - .5));

    color = normalize(vec3(1.0,131.0,248.0)); 

    color = color * noise;

    FragColor = vec4(color, noise);
}`

// globle
let uniforms = {};
let pointer = { x: 0, y: 0, tX: 0, tY: 0, };
let canvas = null;
let gl = null;
let program = null;

const init = () => {
    canvas = document.querySelector('#playground');
    canvas.width = canvas.clientHeight * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;

    gl = canvas.getContext('webgl2');
    program = createProgramFromSource(gl, vs, fs);
    uniforms = getUniforms(gl, program);

    console.log(uniforms)
    gl.useProgram(program)
}

const initEvents = () => {
    const updateMousePosition = (eX, eY) => {
        pointer.tX = eX;
        pointer.tY = eY;
    }

    window.addEventListener("pointermove", e => {
        updateMousePosition(e.clientX, e.clientY);
    });
    window.addEventListener("touchmove", e => {
        updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    });
    window.addEventListener("click", e => {
        updateMousePosition(e.clientX, e.clientY);
    });


}

const tickRender = () => {
    const now = performance.now();

    pointer.x += (pointer.tX - pointer.x) * .5;
    pointer.y += (pointer.tY - pointer.y) * .5;

    gl.uniform1f(uniforms.u_ratio, canvas.width / canvas.height);
    gl.uniform1f(uniforms.u_time, now);
    gl.uniform2f(uniforms.u_pointer_position, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(tickRender);
}

onMounted(() => {

    init();
    initEvents();
    tickRender();

})


///////// helper ///////////
function createProgramFromSource(gl, vertexShaderCode, fragmentShaderCode) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('VERTEX_SHADER ERROR:', gl.getShaderInfoLog(vertexShader));
        return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('FRAGMENT_SHADER ERROR:', gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('PROGRAM ERROR:', gl.getProgramInfoLog(program));
        return null;
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
}
function getUniforms(gl, program) {
    let uniforms = [];
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
        let uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
}
</script>

<style lang="scss" scoped>
#playground {
    position: fixed;
    top: 8vh;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
}
</style>