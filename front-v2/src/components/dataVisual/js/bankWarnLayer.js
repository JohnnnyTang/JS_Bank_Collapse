import axios from 'axios'
import mapboxgl from 'mapbox-gl'

export default class BankWarnLayer {

    constructor(JsonData) {
        this.id = '岸段预警'
        this.jsonData = JsonData
        this.map = undefined
        this.type = 'custom'
        this.showLayer = false
        this.prepared = false
    }
    async onAdd(map, gl) {
        this.gl = gl
        // const data = JsonData
        this.map = map
        this.vertexData = []
        this.vertexCount = 0
        this.jsonData.forEach(element => {
            //coords 1
            let pos1 = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: element.coords[0][0],
                lat: element.coords[0][1],
            })
            let pos2 = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: element.coords[1][0],
                lat: element.coords[1][1],
            })

            this.vertexData.push(pos1.x, pos1.y, element.warnValue, pos2.x, pos2.y, element.warnValue)
            this.vertexCount += 2
        });

        const vertexSource = `
        uniform mat4 u_matrix;
        attribute vec3 a_position; 
        varying float v_warnValue; 

        void main() {
            v_warnValue = a_position.z; 
            gl_Position = u_matrix * vec4(a_position.x, a_position.y, 0.0, 1.0);
        }`;

        // create GLSL source for fragment shader
        const fragmentSource = `
        precision mediump float;
        varying float v_warnValue; 

        void main() {
            // int pallete[10] = {
            //     0x00b0f0,
            //     0x76a9c8,
            //     0xa69f9f,
            //     0xcc9071,
            //     0xed7c31,
            //     0xf06f24,
            //     0xf46018,
            //     0xf84e0d,
            //     0xfb3704,
            //     0xff0000,
            // }
            // int pallete[3] = {
            //     0x00b0f0,
            //     0x76a9c8,
            //     0xff0000,
            // }
            // int botIndex = floor(v_warnValue * 2);
            // int topIndex = floor(v_warnValue * 2 + 0.5);
            // int interval = value * 10.0 - botIndex;

            // vec3 botColor = colorFromInt(rampColors[botIndex]);
            // vec3 topColor = colorFromInt(rampColors[botIndex+1]);
            // vec3 topColor = colorFromInt(rampColors[topIndex]);
            // vec3 resultColor = mix(botColor, topColor, interval);

            // vec3 green = vec3(0.0, 1.0, 0.0);
            vec3 blue = vec3(0.0, 0.0, 1.0);
            vec3 orange = vec3(240.0, 120.0, 0.0) / 255.0;
            vec3 red = vec3(1.0, 0.0, 0.0);
            float v_warnValueP = clamp(v_warnValue*1.2 + 0.1, 0.0, 1.0);


            vec3 greenToBlue = mix(blue, orange, smoothstep(0.0, 0.5, v_warnValueP));
            // Interpolate between blue and red from 0.5 to 1.0
            vec3 blueToRed = mix(orange, red, smoothstep(0.5, 1.0, v_warnValueP));
            // Combine the two interpolations
            vec3 color = mix(greenToBlue, blueToRed, smoothstep(0.0, 1.0, v_warnValueP));

            // gl_FragColor  = vec4(v_warnValueP, 0, 1.0-v_warnValueP, 0.85); // 使用 fragColor 代替 gl_FragColor
            gl_FragColor  = vec4(color, 0.85); // 使用 fragColor 代替 gl_FragColor
        }`;
        // shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        // program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        // vertexAttribute
        this.aPos = gl.getAttribLocation(this.program, 'a_position');
        // buffer
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.vertexData),// 3 points (x,y)
            gl.STATIC_DRAW
        );



        this.prepared = true
    }


    async render(gl, matrix) {

        if (!this.prepared) return;

        gl.useProgram(this.program);
        gl.uniformMatrix4fv(
            gl.getUniformLocation(this.program, 'u_matrix'),
            false,
            matrix
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.enableVertexAttribArray(this.aPos);
        gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexCount);

    }

    update(jsonData) {
        this.jsonData = jsonData
        this.vertexData = []
        this.vertexCount = 0
        this.jsonData.forEach(element => {
            //coords 1
            let pos1 = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: element.coords[0][0],
                lat: element.coords[0][1],
            })
            let pos2 = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: element.coords[1][0],
                lat: element.coords[1][1],
            })

            this.vertexData.push(pos1.x, pos1.y, element.warnValue, pos2.x, pos2.y, element.warnValue)
            this.vertexCount += 2
        });
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.vertexData),// 3 points (x,y)
            gl.STATIC_DRAW
        );
    }


    show() {
        // this.showLayer = true
    }

    hide() {
        // this.showLayer = false
    }

}
