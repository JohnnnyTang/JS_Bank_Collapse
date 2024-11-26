import axios from "axios";
import * as util from './util';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Delaunay } from 'd3-delaunay';
import earcut from 'earcut';
import * as dat from 'dat.gui';
import './dat_gui_style.css';
export class EulerFlowLayer {
    id = '';
    type = 'custom';
    ready = false;
    map = null;
    gui = null;
    gl = null;
    stationUrl = '';
    uvUrls = [];
    prefix = '';
    // mask_program
    program_mask = null;
    Locations_mask = {};
    maskTexture = null;
    maskFbo = null;
    vao_mask = null;
    maskPosBuffer = null;
    maskIndexBuffer = null;
    maskIndexLength = 0;
    programe_delaunay = null;
    Locations_delaunay = {};
    indexLength_delaunay = 0;
    vertexData_station = null;
    indexData_station = null;
    velocityData_Array = [];
    velocityData_from = null;
    velocityData_to = null;
    totalResourceCount = 26;
    uvResourcePointer = 1;
    particleRandomInitData = [];
    velocityEmptyInitData = [];
    vao_delaunay = null;
    stationBuffer = null;
    stationIndexBuffer = null;
    velocityBuffer_from = null;
    velocityBuffer_to = null;
    uvTexture = null;
    fbo_delaunay = null;
    Locations_showing = {};
    program_showing = null;
    vao_showing = null;
    positionBuffer_showing = null;
    texCoordBuffer_showing = null;
    showingTexture = null;
    ///////// temp
    program_point = null;
    Locations_point = {};
    vao_startPoint = null;
    vao_endPoint = null;
    startPosBuffer = null;
    endPosBuffer = null;
    pointNum = 0;
    Locations_simulate = {};
    program_simulate = null;
    pposBuffer_simulate_1 = null;
    pposBuffer_simulate_2 = null;
    vao_simulate_1 = null;
    vao_simulate_2 = null;
    // velocityBuffer: WebGLBuffer | null = null
    velocityBuffer1 = null;
    velocityBuffer2 = null;
    xfo_simulate_1 = null;
    xfo_simulate_2 = null;
    program_segmentShowing = null;
    Locations_segmentShowing = {};
    vao_segmentShowing1 = null;
    vao_segmentShowing2 = null;
    program_arrowShowing = null;
    Locations_arrowShowing = {};
    vao_arrowShowing = null;
    arrowAngle = 30;
    arrowLength = 7;
    /// static data
    flowExtent = [9999, 9999, -9999, -9999]; //xmin, ymin, xmax, ymax
    flowMaxVelocity = 0;
    velocityFactor = 300.0;
    aaWidth = 2.0;
    fillWidth = 0.5;
    /// dynamic data
    globalFrames = 0;
    randomSeed = Math.random();
    framePerStep = 120; //frame
    localFrames = 0;
    progressRatio = 0;
    mapExtent = [9999, 9999, -9999, -9999]; //xmin, ymin, xmax, ymax
    stop = false;
    steady = false;
    validExtent = [];
    gridNumPerRow = 50;
    gridNumPerCol = 30;
    arrowColor = [255, 255, 255];

    stepProgressRate = 0.0

    axiosIns = axios.create({
        baseURL: import.meta.env.BASE_URL,
    })

    constructor(id, stationUrl, uvUrls, prefix) {
        this.id = id;
        this.stationUrl = stationUrl;
        this.uvUrls = uvUrls;
        this.prefix = prefix;
        this.totalResourceCount = uvUrls.length + 1;
    }
    async onAdd(map, gl) {
        this.initGUI();
        const available_extensions = gl.getSupportedExtensions();
        available_extensions?.forEach(ext => {
            gl.getExtension(ext);
        });
        this.gl = gl;
        this.map = map;
        await this.programInit_mask(gl);
        await this.programInit_delaunay(gl);
        await this.programInit_showing(gl);
        await this.programInit_pointShowing(gl);
        await this.programInit_simulate(gl);
        await this.programInit_segmentShowing(gl);
        await this.programInit_arrowShowing(gl);
        const idle = () => {
            // need to regenerate point data
            // do nothing
            // this.stop = true
            // stop simulate?
        };
        const restart = () => {
            // this.stop = false
            let flowExtent = this.flowExtent;
            let mapExtent = this.mapExtent;
            let result = this.currentExtent(flowExtent, mapExtent);
            this.validExtent = result;
            let data = this.generateGrid(this.validExtent, this.gridNumPerRow, this.gridNumPerCol);
            this.pointNum = data.gridDataArray.length / 2;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.startPosBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.gridDataArray), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.endPosBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.gridDataArray), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        };
        this.map.on('movestart', idle);
        this.map.on('move', idle);
        this.map.on('moveend', restart);
        this.map.on('dragstart', idle);
        this.map.on('drag', idle);
        this.map.on('dragend', restart);
        this.map.on('zoomstart', idle);
        this.map.on('zoom', idle);
        this.map.on('zoomend', () => {
            // let res = this.getSpeedFactorInNowZoom()
            // this.velocityFactor = res
            restart();
        });
        this.map.on('rotatestart', idle);
        this.map.on('rotate', idle);
        this.map.on('rotateend', restart);
        this.map.on('pitchstart', idle);
        this.map.on('pitch', idle);
        this.map.on('pitchend', restart);
        this.ready = true;
        // window.addEventListener('keydown', (e) => {
        //     if (e.key == 'r') {
        //         this.printBuffer(gl, this.startPosBuffer!, this.pointNum * 2);
        //     }
        //     else if (e.key == 't') {
        //         this.printBuffer(gl, this.endPosBuffer!, this.pointNum * 2);
        //     }
        // })
    }
    onRemove() {
        this.gui?.destroy();
    }
    render(gl, matrix) {
        if (this.ready) {
            let mapCenterInMercator = mapboxgl.MercatorCoordinate.fromLngLat(this.map.getCenter());
            ////////// update dynamic data
            if (!this.stop) {
                this.globalFrames += 1;
                this.localFrames = (this.localFrames + 1) % this.framePerStep;
                this.progressRatio = this.localFrames / this.framePerStep;
                this.stepProgressRate = Math.round((this.uvResourcePointer + this.progressRatio) * 10) / 10
            }
            this.mapExtent = getMapExtent(this.map);
            this.randomSeed = Math.random();
            if (this.steady === false && this.localFrames === 0) {
                this.nextStep(gl);
            }
            ////////// 0st::: mask program to get mask texture
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.maskFbo);
            gl.useProgram(this.program_mask);
            // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
            gl.bindVertexArray(this.vao_mask);
            gl.uniformMatrix4fv(this.Locations_mask['u_matrix'], false, matrix);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.maskIndexBuffer);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, this.maskIndexLength, gl.UNSIGNED_SHORT, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            ////////// 1st::: delaunay program to get uv texture
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo_delaunay);
            gl.useProgram(this.programe_delaunay);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.bindVertexArray(this.vao_delaunay);
            gl.uniformMatrix4fv(this.Locations_delaunay['u_matrix'], false, matrix);
            gl.uniform4f(this.Locations_delaunay['u_flowExtent'], this.flowExtent[0], this.flowExtent[1], this.flowExtent[2], this.flowExtent[3]);
            gl.uniform1f(this.Locations_delaunay['progressRatio'], this.progressRatio);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.maskTexture);
            gl.uniform1i(this.Locations_delaunay['maskTexture'], 0);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.stationIndexBuffer);
            gl.drawElements(gl.TRIANGLES, this.indexLength_delaunay, gl.UNSIGNED_INT, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            ////////// 2nd::: show uvTexture program  ///// background SHOWING
            gl.useProgram(this.program_showing);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.bindVertexArray(this.vao_showing);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.uvTexture);
            gl.uniform1i(this.Locations_showing['uv_texture'], 0);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.maskTexture);
            gl.uniform1i(this.Locations_showing['uv_texture'], 1);
            // gl.enable(gl.BLEND);
            // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            ////////// 3rd::: point showing program  ///// point SHOWING
            // gl.useProgram(this.program_point!)
            // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
            // gl.bindVertexArray(this.vao_startPoint)
            // gl.uniformMatrix4fv(this.Locations_point['u_matrix'] as WebGLUniformLocation, false, matrix)
            // gl.activeTexture(gl.TEXTURE0)
            // gl.bindTexture(gl.TEXTURE_2D, this.uvTexture)
            // gl.uniform1i(this.Locations_point['uv_texture'] as WebGLUniformLocation, 0)
            // gl.drawArrays(gl.POINTS, 0, this.pointNum)
            ////////// 4th::: simulate program  ///// simulate
            gl.enable(gl.RASTERIZER_DISCARD);
            gl.useProgram(this.program_simulate);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.xfo_simulate_1);
            gl.bindVertexArray(this.vao_simulate_1);
            gl.uniform4f(this.Locations_simulate['mapExtent'], this.mapExtent[0], this.mapExtent[1], this.mapExtent[2], this.mapExtent[3]);
            gl.uniform4f(this.Locations_simulate['flowExtent'], this.flowExtent[0], this.flowExtent[1], this.flowExtent[2], this.flowExtent[3]);
            gl.uniformMatrix4fv(this.Locations_simulate['u_matrix'], false, matrix);
            gl.uniform1f(this.Locations_simulate['speedFactor'], this.velocityFactor);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.uvTexture);
            gl.uniform1i(this.Locations_simulate['uvTexture'], 0);
            gl.beginTransformFeedback(gl.POINTS);
            gl.drawArrays(gl.POINTS, 0, this.pointNum);
            gl.endTransformFeedback();
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disable(gl.RASTERIZER_DISCARD);
            ////////// 5th::: segment showing program  ///// segment SHOWING
            gl.useProgram(this.program_segmentShowing);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.bindVertexArray(this.vao_segmentShowing1);
            gl.uniformMatrix4fv(this.Locations_segmentShowing['u_matrix'], false, matrix);
            gl.uniform2f(this.Locations_segmentShowing['u_screenSize'], gl.canvas.width, gl.canvas.height);
            gl.uniform1f(this.Locations_segmentShowing['aaWidth'], this.aaWidth);
            gl.uniform1f(this.Locations_segmentShowing['fillWidth'], this.fillWidth);
            gl.uniform3f(this.Locations_segmentShowing['u_arrowColor'], this.arrowColor[0], this.arrowColor[1], this.arrowColor[2]);
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.pointNum);
            ////////// 6th::: arrow showing program  ///// arrow SHOWING
            gl.useProgram(this.program_arrowShowing);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.bindVertexArray(this.vao_arrowShowing);
            gl.uniformMatrix4fv(this.Locations_arrowShowing['u_matrix'], false, matrix);
            gl.uniform1f(this.Locations_arrowShowing['u_arrowAngle'], this.arrowAngle);
            gl.uniform1f(this.Locations_arrowShowing['u_arrowLength'], this.arrowLength);
            gl.uniform2f(this.Locations_arrowShowing['u_canvasSize'], gl.canvas.width, gl.canvas.height);
            gl.uniform3f(this.Locations_arrowShowing['u_arrowColor'], this.arrowColor[0], this.arrowColor[1], this.arrowColor[2]);
            gl.drawArraysInstanced(gl.LINES, 0, 4, this.pointNum);
        }
        else {
            // console.log('layer not readydd');
        }
        this.map.triggerRepaint();
    }
    async programInit_mask(gl) {
        const maskShapeUrl = '/scratchSomething/geojson/CHENGTONG.geojson';
        var data = await this.parsePolygon(maskShapeUrl);
        var vertexData = data.vertexData;
        var indexData = data.indexData;
        const vsSource = (await this.axiosIns.get('/scratchSomething/eulerWebGL/polygon.vert.glsl')).data;
        const fsSource = (await this.axiosIns.get('/scratchSomething/eulerWebGL/polygon.frag.glsl')).data;
        const vs = util.createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = util.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        this.program_mask = util.createProgram(gl, vs, fs);
        this.maskTexture = util.createCanvasSizeTexture(gl);
        this.maskFbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.maskFbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.maskTexture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.Locations_mask['a_postion'] = gl.getAttribLocation(this.program_mask, 'a_position');
        this.Locations_mask['u_matrix'] = gl.getUniformLocation(this.program_mask, 'u_matrix');
        // // console.log(this.Locations_mask);
        this.maskPosBuffer = util.createVBO(gl, vertexData);
        this.maskIndexBuffer = util.createIBO(gl, indexData);
        this.maskIndexLength = indexData.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.vao_mask = gl.createVertexArray();
        gl.bindVertexArray(this.vao_mask);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.maskPosBuffer);
        gl.enableVertexAttribArray(this.Locations_mask['a_postion']);
        gl.vertexAttribPointer(this.Locations_mask['a_postion'], 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        // console.log('mask program init done');
    }
    async programInit_delaunay(gl) {
        // // console.log(this.prefix + this.stationUrl);
        let { vertexData_station, indexData_station } = await this.getStationData(this.prefix + this.stationUrl);
        // // console.log(vertexData_station, indexData_station);
        this.vertexData_station = vertexData_station;
        this.indexData_station = indexData_station;
        this.velocityData_Array.push(await this.getVelocityData(this.prefix + this.uvUrls[0]));
        this.velocityData_Array.push(await this.getVelocityData(this.prefix + this.uvUrls[1]));
        this.velocityData_Array.push(await this.getVelocityData(this.prefix + this.uvUrls[2]));
        this.uvResourcePointer = 1;
        let toIndex = this.uvResourcePointer;
        let fromIndex = (this.uvResourcePointer + 2) % 3;
        this.velocityData_from = this.velocityData_Array[fromIndex];
        this.velocityData_to = this.velocityData_Array[toIndex];
        // // console.log('vertexData', vertexData_station)
        // // console.log('velocityData', velocityData)
        ////////// 1st::: delaunay program to get uv texture
        const vsSource_delaunay = (await this.axiosIns.get('/scratchSomething/eulerWebGL/delaunay.vert.glsl')).data;
        const fsSource_delaunay = (await this.axiosIns.get('/scratchSomething/eulerWebGL/delaunay.frag.glsl')).data;
        // // console.log(vsSource_delaunay, fsSource_delaunay)
        const vs_delaunay = util.createShader(gl, gl.VERTEX_SHADER, vsSource_delaunay);
        const fs_delaunay = util.createShader(gl, gl.FRAGMENT_SHADER, fsSource_delaunay);
        this.programe_delaunay = util.createProgram(gl, vs_delaunay, fs_delaunay);
        this.Locations_delaunay['a_postion'] = gl.getAttribLocation(this.programe_delaunay, 'a_position');
        this.Locations_delaunay['a_velocity_from'] = gl.getAttribLocation(this.programe_delaunay, 'a_velocity_from');
        this.Locations_delaunay['a_velocity_to'] = gl.getAttribLocation(this.programe_delaunay, 'a_velocity_to');
        this.Locations_delaunay['progressRatio'] = gl.getUniformLocation(this.programe_delaunay, 'progressRatio');
        this.Locations_delaunay['u_flowExtent'] = gl.getUniformLocation(this.programe_delaunay, 'u_flowExtent');
        this.Locations_delaunay['u_matrix'] = gl.getUniformLocation(this.programe_delaunay, 'u_matrix');
        this.Locations_delaunay['u_mask'] = gl.getUniformLocation(this.programe_delaunay, 'u_mask');
        // // console.log(this.Locations_delaunay)
        ///// vertex data
        this.vao_delaunay = gl.createVertexArray();
        gl.bindVertexArray(this.vao_delaunay);
        this.indexLength_delaunay = indexData_station.length;
        this.stationBuffer = util.createVBO(gl, Array.from(new Float32Array(vertexData_station)));
        gl.enableVertexAttribArray(this.Locations_delaunay['a_position']);
        gl.vertexAttribPointer(this.Locations_delaunay['a_position'], 2, gl.FLOAT, false, 0, 0);
        this.velocityBuffer_from = util.createVBO(gl, Array.from(new Float32Array(this.velocityData_from)));
        gl.enableVertexAttribArray(this.Locations_delaunay['a_velocity_from']);
        gl.vertexAttribPointer(this.Locations_delaunay['a_velocity_from'], 2, gl.FLOAT, false, 0, 0);
        this.velocityBuffer_to = util.createVBO(gl, Array.from(new Float32Array(this.velocityData_to)));
        gl.enableVertexAttribArray(this.Locations_delaunay['a_velocity_to']);
        gl.vertexAttribPointer(this.Locations_delaunay['a_velocity_to'], 2, gl.FLOAT, false, 0, 0);
        this.stationIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.stationIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexData_station), gl.STATIC_DRAW);
        gl.bindVertexArray(null);
        ///// frame buffer
        this.uvTexture = util.createCanvasSizeTexture(gl);
        this.fbo_delaunay = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo_delaunay);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.uvTexture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    async programInit_showing(gl) {
        ////////// 2nd::: show uvTexture program
        const vsSource_showing = (await this.axiosIns.get('/scratchSomething/eulerWebGL/showing.vert.glsl')).data;
        const fsSource_showing = (await this.axiosIns.get('/scratchSomething/eulerWebGL/showing.frag.glsl')).data;
        const vs_showing = util.createShader(gl, gl.VERTEX_SHADER, vsSource_showing);
        const fs_showing = util.createShader(gl, gl.FRAGMENT_SHADER, fsSource_showing);
        this.program_showing = util.createProgram(gl, vs_showing, fs_showing);
        this.Locations_showing['a_pos'] = gl.getAttribLocation(this.program_showing, 'a_pos');
        this.Locations_showing['a_texCoord'] = gl.getAttribLocation(this.program_showing, 'a_texCoord');
        this.Locations_showing['uv_texture'] = gl.getUniformLocation(this.program_showing, 'uv_texture');
        this.Locations_showing['mask'] = gl.getUniformLocation(this.program_showing, 'mask');
        // // console.log(this.Locations_showing)
        this.vao_showing = gl.createVertexArray();
        gl.bindVertexArray(this.vao_showing);
        const positionData_showing = [
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0
        ];
        this.positionBuffer_showing = util.createVBO(gl, positionData_showing);
        gl.enableVertexAttribArray(this.Locations_showing['a_pos']);
        gl.vertexAttribPointer(this.Locations_showing['a_pos'], 2, gl.FLOAT, false, 0, 0);
        const texCoordData_showing = [
            0, 1,
            1, 1,
            0, 0,
            1, 0,
        ];
        this.texCoordBuffer_showing = util.createVBO(gl, texCoordData_showing);
        gl.enableVertexAttribArray(this.Locations_showing['a_texCoord']);
        gl.vertexAttribPointer(this.Locations_showing['a_texCoord'], 2, gl.FLOAT, false, 0, 0);
        // this.showingTexture = util.createEmptyTexture(gl)!
        gl.bindVertexArray(null);
        // let image = await util.loadImageBitmap('/images/02texture/leaves.jpg') as ImageBitmap
        // this.testTexture = util.createEmptyTexture(gl)
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    }
    async programInit_pointShowing(gl) {
        let VSS = (await this.axiosIns.get('/scratchSomething/eulerWebGL/point.vert.glsl'));
        let FSS = (await this.axiosIns.get('/scratchSomething/eulerWebGL/point.frag.glsl'));
        let VS = util.createShader(gl, gl.VERTEX_SHADER, VSS.data);
        let FS = util.createShader(gl, gl.FRAGMENT_SHADER, FSS.data);
        this.program_point = util.createProgram(gl, VS, FS);
        this.Locations_point['a_pos'] = gl.getAttribLocation(this.program_point, 'a_pos');
        this.Locations_point['u_matrix'] = gl.getUniformLocation(this.program_point, 'u_matrix');
        this.Locations_point['uvTexture'] = gl.getUniformLocation(this.program_point, 'uvTexture');
        // // console.log(this.Locations_point);
        this.mapExtent = getMapExtent(this.map);
        let currentExtent = this.currentExtent(this.flowExtent, this.mapExtent);
        let data = this.generateGrid(currentExtent, this.gridNumPerRow, this.gridNumPerCol);
        this.pointNum = data.gridDataArray.length / 2;
        // // console.log('init pos data', data);
        this.vao_startPoint = gl.createVertexArray();
        gl.bindVertexArray(this.vao_startPoint);
        this.startPosBuffer = util.createVBO(gl, data.gridDataArray);
        gl.enableVertexAttribArray(this.Locations_point['a_pos']);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.startPosBuffer);
        gl.vertexAttribPointer(this.Locations_point['a_pos'], 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        this.vao_endPoint = gl.createVertexArray();
        gl.bindVertexArray(this.vao_endPoint);
        // // console.log(' init endpos buffer');
        this.endPosBuffer = util.createVBO(gl, data.gridDataArray);
        gl.enableVertexAttribArray(this.Locations_point['a_pos']);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.endPosBuffer);
        gl.vertexAttribPointer(this.Locations_point['a_pos'], 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
    }
    async programInit_simulate(gl) {
        const VSS = (await this.axiosIns.get('/scratchSomething/eulerWebGL/simulate.vert.glsl'));
        const FSS = (await this.axiosIns.get('/scratchSomething/eulerWebGL/simulate.frag.glsl'));
        const VS = util.createShader(gl, gl.VERTEX_SHADER, VSS.data);
        const FS = util.createShader(gl, gl.FRAGMENT_SHADER, FSS.data);
        const outVaryings = ['out_endPos'];
        this.program_simulate = util.createProgram2(gl, VS, FS, outVaryings);
        this.Locations_simulate['a_startPos'] = gl.getAttribLocation(this.program_simulate, 'a_startPos');
        this.Locations_simulate['mapExtent'] = gl.getUniformLocation(this.program_simulate, 'mapExtent');
        this.Locations_simulate['flowExtent'] = gl.getUniformLocation(this.program_simulate, 'flowExtent');
        this.Locations_simulate['u_matrix'] = gl.getUniformLocation(this.program_simulate, 'u_matrix');
        this.Locations_simulate['speedFactor'] = gl.getUniformLocation(this.program_simulate, 'speedFactor');
        this.Locations_simulate['uvTexture'] = gl.getUniformLocation(this.program_simulate, 'uvTexture');
        this.vao_simulate_1 = gl.createVertexArray();
        gl.bindVertexArray(this.vao_simulate_1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.startPosBuffer);
        gl.enableVertexAttribArray(this.Locations_simulate['a_startPos']);
        gl.vertexAttribPointer(this.Locations_simulate['a_startPos'], 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        this.xfo_simulate_1 = gl.createTransformFeedback();
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.xfo_simulate_1);
        // console.log('use enpos buffer as transform feedback buffer');
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.endPosBuffer);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    }
    async programInit_segmentShowing(gl) {
        const vss = (await this.axiosIns.get('/scratchSomething/eulerWebGL/segment.vert.glsl'));
        const fss = (await this.axiosIns.get('/scratchSomething/eulerWebGL/segment.frag.glsl'));
        const vs = util.createShader(gl, gl.VERTEX_SHADER, vss.data);
        const fs = util.createShader(gl, gl.FRAGMENT_SHADER, fss.data);
        this.program_segmentShowing = util.createProgram(gl, vs, fs);
        this.Locations_segmentShowing['a_startPos'] = gl.getAttribLocation(this.program_segmentShowing, 'a_startPos');
        this.Locations_segmentShowing['a_endPos'] = gl.getAttribLocation(this.program_segmentShowing, 'a_endPos');
        this.Locations_segmentShowing['u_matrix'] = gl.getUniformLocation(this.program_segmentShowing, 'u_matrix');
        this.Locations_segmentShowing['u_screenSize'] = gl.getUniformLocation(this.program_segmentShowing, 'u_screenSize');
        this.Locations_segmentShowing['aaWidth'] = gl.getUniformLocation(this.program_segmentShowing, 'aaWidth');
        this.Locations_segmentShowing['fillWidth'] = gl.getUniformLocation(this.program_segmentShowing, 'fillWidth');
        this.Locations_segmentShowing['u_arrowColor'] = gl.getUniformLocation(this.program_segmentShowing, 'u_arrowColor');
        // console.log(this.Locations_segmentShowing);
        this.vao_segmentShowing1 = gl.createVertexArray();
        gl.bindVertexArray(this.vao_segmentShowing1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.startPosBuffer);
        gl.enableVertexAttribArray(this.Locations_segmentShowing['a_startPos']);
        gl.vertexAttribPointer(this.Locations_segmentShowing['a_startPos'], 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(this.Locations_segmentShowing['a_startPos'], 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.endPosBuffer);
        gl.enableVertexAttribArray(this.Locations_segmentShowing['a_endPos']);
        gl.vertexAttribPointer(this.Locations_segmentShowing['a_endPos'], 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(this.Locations_segmentShowing['a_endPos'], 1);
        gl.bindVertexArray(null);
    }
    async programInit_arrowShowing(gl) {
        const vss = (await this.axiosIns.get('/scratchSomething/eulerWebGL/arrow.vert.glsl'));
        const fss = (await this.axiosIns.get('/scratchSomething/eulerWebGL/arrow.frag.glsl'));
        const vs = util.createShader(gl, gl.VERTEX_SHADER, vss.data);
        const fs = util.createShader(gl, gl.FRAGMENT_SHADER, fss.data);
        this.program_arrowShowing = util.createProgram(gl, vs, fs);
        this.Locations_arrowShowing['startPos'] = gl.getAttribLocation(this.program_arrowShowing, 'startPos');
        this.Locations_arrowShowing['endPos'] = gl.getAttribLocation(this.program_arrowShowing, 'endPos');
        this.Locations_arrowShowing['u_matrix'] = gl.getUniformLocation(this.program_arrowShowing, 'u_matrix');
        this.Locations_arrowShowing['u_arrowAngle'] = gl.getUniformLocation(this.program_arrowShowing, 'u_arrowAngle');
        this.Locations_arrowShowing['u_arrowLength'] = gl.getUniformLocation(this.program_arrowShowing, 'u_arrowLength');
        this.Locations_arrowShowing['u_canvasSize'] = gl.getUniformLocation(this.program_arrowShowing, 'u_canvasSize');
        this.Locations_arrowShowing['u_arrowColor'] = gl.getUniformLocation(this.program_arrowShowing, 'u_arrowColor');
        // console.log(this.Locations_arrowShowing);
        this.vao_arrowShowing = gl.createVertexArray();
        gl.bindVertexArray(this.vao_arrowShowing);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.startPosBuffer);
        gl.enableVertexAttribArray(this.Locations_arrowShowing['startPos']);
        gl.vertexAttribPointer(this.Locations_arrowShowing['startPos'], 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(this.Locations_arrowShowing['startPos'], 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.endPosBuffer);
        gl.enableVertexAttribArray(this.Locations_arrowShowing['endPos']);
        gl.vertexAttribPointer(this.Locations_arrowShowing['endPos'], 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(this.Locations_arrowShowing['endPos'], 1);
        gl.bindVertexArray(null);
    }
    async getStationData(url) {
        let vertexData;
        let indexData;
        const stationData = (await axios.get(url, { responseType: 'arraybuffer' })).data;
        const meshes = new Delaunay(new Float32Array(stationData));
        indexData = meshes.triangles; // Uint32Array
        vertexData = meshes.points; // Float32Array
        for (let i = 0; i < vertexData.length; i += 2) {
            let [lng, lat] = [vertexData[i], vertexData[i + 1]];
            if (lng < this.flowExtent[0])
                this.flowExtent[0] = lng;
            if (lat < this.flowExtent[1])
                this.flowExtent[1] = lat;
            if (lng > this.flowExtent[2])
                this.flowExtent[2] = lng;
            if (lat > this.flowExtent[3])
                this.flowExtent[3] = lat;
        }
        // PROCESS 
        return {
            vertexData_station: vertexData,
            indexData_station: indexData
        };
    }
    async getVelocityData(url) {
        const velocityData = new Float32Array((await axios.get(url, { responseType: 'arraybuffer' })).data);
        for (let i = 0; i < velocityData.length; i += 2) {
            let [u, v] = [velocityData[i], velocityData[i + 1]];
            let velocity = Math.sqrt(u * u + v * v);
            if (velocity > this.flowMaxVelocity)
                this.flowMaxVelocity = velocity;
        }
        // console.log(url, velocityData);
        return velocityData;
    }
    nextStep(gl) {
        this.uvResourcePointer = (this.uvResourcePointer + 1) % this.totalResourceCount;
        let fromIndex = (this.uvResourcePointer - 1 + 3) % 3;
        let toIndex = (this.uvResourcePointer) % 3;
        let updateIndex = (this.uvResourcePointer + 1) % 3;
        this.velocityData_from = this.velocityData_Array[fromIndex];
        this.velocityData_to = this.velocityData_Array[toIndex];
        gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer_from);
        gl.bufferData(gl.ARRAY_BUFFER, this.velocityData_from, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer_to);
        gl.bufferData(gl.ARRAY_BUFFER, this.velocityData_to, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // // console.log('///////// TIME STEP UPDATE //////////')
        // // console.log('this.uvResourcePointer', this.uvResourcePointer)
        // // console.log('globalFrames', this.globalFrames)
        this.getVelocityData(this.prefix + this.uvUrls[this.uvResourcePointer]).then(data => {
            this.velocityData_Array[updateIndex] = data;
        });
    }
    initGUI() {
        const restart = () => {
            // console.log('restart');
            let gl = this.gl;
            let data = this.generateGrid(this.validExtent, this.gridNumPerRow, this.gridNumPerCol);
            this.pointNum = data.gridDataArray.length / 2;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.startPosBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.gridDataArray), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.endPosBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.gridDataArray), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        };
        this.gui = new dat.GUI();
        dat.GUI.TEXT_OPEN = "展开控制面板";
        dat.GUI.TEXT_CLOSED = "收起控制面板";
        let parameters = {
            aaWidth: this.aaWidth,
            fillWidth: this.fillWidth,
            framePerStep: this.framePerStep,
            velocityFactor: this.velocityFactor,
            arrowAngle: this.arrowAngle,
            arrowLength: this.arrowLength,
            gridPerRow: this.gridNumPerRow,
            gridPerCol: this.gridNumPerCol,
            stop: this.stop,
            steady: this.steady,
            color: `rgb(${this.arrowColor[0]}, ${this.arrowColor[1]}, ${this.arrowColor[2]})`
        };
        this.gui.domElement.style.position = 'absolute';
        this.gui.domElement.style.top = '15vh';
        this.gui.domElement.style.right = '3vw';
        this.gui.add(parameters, 'stop', false).name('停止').onChange(value => this.stop = value);
        this.gui.add(parameters, 'steady', false).name('稳态流场').onChange(value => this.steady = value);
        // this.gui.add(parameters, 'aaWidth', 0, 5, 0.1).name('反走样宽度').onChange(value => this.aaWidth = value);
        this.gui.add(parameters, 'fillWidth', 0, 5, 0.1).name('填充宽度').onChange(value => this.fillWidth = value);
        this.gui.add(parameters, 'arrowAngle', 0, 90, 1).name('箭头角度').onChange(value => this.arrowAngle = value);
        this.gui.add(parameters, 'arrowLength', 1, 30, 1).name('箭头长度').onChange(value => this.arrowLength = value);
        this.gui.addColor(parameters, 'color').name('箭头颜色').onChange(value => { this.arrowColor = parseRGB(value); });
        this.gui.add(parameters, 'gridPerRow', 10, 200, 1).name('格网行数').onChange(value => { this.gridNumPerRow = value; restart(); });
        this.gui.add(parameters, 'gridPerCol', 10, 200, 1).name('格网列数').onChange(value => { this.gridNumPerCol = value; restart(); });
        // this.gui.add(parameters, 'framePerStep', 30, 240, 10).name('帧数控制').onChange(value => this.framePerStep = value);
        this.gui.add(parameters, 'velocityFactor', 1, 1000, 1).name('速度因子').onChange(value => this.velocityFactor = value);
        const parseRGB = (rgbString) => {
            const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
            const match = rgbString.match(regex);
            if (match) {
                const [_, r, g, b] = match;
                return [parseInt(r), parseInt(g), parseInt(b)];
            }
            else {
                throw new Error('Invalid RGB string');
            }
        };
        this.gui.open();
    }
    printBuffer(gl, buffer, size, label = '') {
        ////// debug
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const debugArr = new Float32Array(size);
        gl.getBufferSubData(gl.ARRAY_BUFFER, 0, debugArr);
        // console.log(`${label}`, debugArr);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return debugArr;
    }
    generateGrid(extent, gridNumPerRow, gridNumPerCol) {
        let lngRange = extent[2] - extent[0];
        let latRange = extent[3] - extent[1];
        let gridWidth = lngRange / gridNumPerRow;
        let gridHeight = latRange / gridNumPerCol;
        let gridDataArray = [];
        for (let i = 0; i < gridNumPerRow; i++) {
            for (let j = 0; j < gridNumPerCol; j++) {
                let x = extent[0] + (i + 0.5) * gridWidth;
                let y = extent[1] + (j + 0.5) * gridHeight;
                gridDataArray.push(x, y);
            }
        }
        // // console.log('new grid data!  length::', gridDataArray.length / 2)
        return {
            gridDataArray,
        };
    }
    getSpeedFactorInNowZoom() {
        let zoom = this.map.getZoom();
        if (zoom <= 10)
            return 800;
        if (zoom >= 16)
            return 15;
        const data = [
            { zoom: 10, speedFactor: 1000 },
            { zoom: 12, speedFactor: 350 },
            { zoom: 14, speedFactor: 70 },
            { zoom: 16, speedFactor: 15 }
        ];
        for (let i = 0; i < data.length - 1; i++) {
            if (zoom >= data[i].zoom && zoom <= data[i + 1].zoom) {
                const { zoom: x0, speedFactor: y0 } = data[i];
                const { zoom: x1, speedFactor: y1 } = data[i + 1];
                return Math.floor(y0 + (zoom - x0) * (y1 - y0) / (x1 - x0));
            }
        }
        return 0;
    }
    async parsePolygon(url) {
        const geojson = (await this.axiosIns.get(url)).data;
        let coordinate = geojson.features[0].geometry.coordinates[0];
        var data = earcut.flatten(coordinate);
        var triangle = earcut(data.vertices, data.holes, data.dimensions);
        coordinate = data.vertices.flat();
        let vertexData = [];
        for (let i = 0; i < coordinate.length; i += 2) {
            let [x, y] = this.lnglat2Mercator(coordinate[i], coordinate[i + 1]);
            vertexData.push(x);
            vertexData.push(y);
        }
        return {
            vertexData: vertexData,
            indexData: triangle,
        };
    }
    lnglat2Mercator(lng, lat) {
        let x = (180 + lng) / 360;
        let y = (180 -
            (180 / Math.PI) *
            Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) /
            360;
        return [x, y];
    }
    currentExtent(flowExtent, mapExtent) {
        let lonMin = Math.max(flowExtent[0], mapExtent[0]);
        let latMin = Math.max(flowExtent[1], mapExtent[1]);
        let lonMax = Math.min(flowExtent[2], mapExtent[2]);
        let latMax = Math.min(flowExtent[3], mapExtent[3]);
        if (lonMin > lonMax || latMin > latMax) {
            return flowExtent;
        }
        return [lonMin, latMin, lonMax, latMax];
    }
}
function getMapExtent(map) {
    const bounds = map.getBounds();
    const boundsArray = bounds.toArray();
    return [boundsArray[0][0], boundsArray[0][1], boundsArray[1][0], boundsArray[1][1]];
}
class upLine {
    id = '';
    type = 'custom';
    map = null;
    gl = null;
    program = null;
    matLoc = null;
    constructor(id) {
        this.id = id;
    }
    async onAdd(map, gl) {
        const vss = `#version 300 es
        uniform mat4 matrix;
        const vec3[2] upLineVertices = vec3[2](vec3(0.8f, 0.4f, 0.0f), vec3(0.8f, 0.4f, 0.5f));
        void main() {
            vec3 pos = upLineVertices[gl_VertexID];
            gl_Position = matrix * vec4(pos, 1.0f);
        }        
        `;
        const fss = `#version 300 es
        precision highp float;
        out vec4 fragColor;
        void main() {
            fragColor = vec4(1.0f, 0.0f, 0.0f, 1.0f);
        }`;
        const vs = util.createShader(gl, gl.VERTEX_SHADER, vss);
        const fs = util.createShader(gl, gl.FRAGMENT_SHADER, fss);
        this.program = util.createProgram(gl, vs, fs);
        this.matLoc = gl.getUniformLocation(this.program, 'matrix');
    }
    render(gl, matrix) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.matLoc, false, matrix);
        gl.drawArrays(gl.LINES, 0, 2);
        this.map.triggerRepaint();
    }
}
export const initMap = () => {
    const map = new mapboxgl.Map({
        style: "mapbox://styles/nujabesloo/clxk678ma00ch01pdd2lfgps2",
        center: [120.980697, 31.684162], // [ 120.556596, 32.042607 ], //[ 120.53525158459905, 31.94879239156117 ], // 120.980697, 31.684162
        // projection: 'mercator',
        accessToken: 'pk.eyJ1IjoibnVqYWJlc2xvbyIsImEiOiJjbGp6Y3czZ2cwOXhvM3FtdDJ5ZXJmc3B4In0.5DCKDt0E2dFoiRhg3yWNRA',
        container: 'map',
        antialias: true,
        maxZoom: 18,
        zoom: 9 //10.496958973488436, // 16
    }).on('load', () => {
        // console.log('map load!');
        // const flowTextureLayer = new EulerFlowLayer('flow')
        // map.addLayer(flowTextureLayer as mapbox.AnyLayer)
        // const upLineLayer = new upLine('upLine')
        // map.addLayer(upLineLayer as mapbox.AnyLayer)
    });
    return map;
};
export const simpleArrow = async () => {
    const gl = util.initGL('playground');
    const vss = `#version 300 es
    const vec2[2] arrowVertices = vec2[2](vec2(-0.3f, 0.0f), vec2(0.3f, 0.0f));
    void main() {
        vec2 pos = arrowVertices[gl_VertexID];
        gl_Position = vec4(pos, 0.0f, 1.0f);
    }`;
    const fss = `#version 300 es
    precision highp float;
    out vec4 fragColor;
    void main() {
        fragColor = vec4(1.0f, 1.0f, 0.9f, 1.0f);
    }`;
    const vs = util.createShader(gl, gl.VERTEX_SHADER, vss);
    const fs = util.createShader(gl, gl.FRAGMENT_SHADER, fss);
    const program = util.createProgram(gl, vs, fs);
    const vss2 = (await this.axiosIns.get('/scratchSomething/eulerWebGL/demoArrow.vert.glsl')).data;
    const fss2 = (await this.axiosIns.get('/scratchSomething/eulerWebGL/demoArrow.frag.glsl')).data;
    const vs2 = util.createShader(gl, gl.VERTEX_SHADER, vss2);
    const fs2 = util.createShader(gl, gl.FRAGMENT_SHADER, fss2);
    const program2 = util.createProgram(gl, vs2, fs2);
    let rotateMatrixLocation = gl.getUniformLocation(program2, 'rotateMatrix');
    let arrowLengthLocation = gl.getUniformLocation(program2, 'arrowLength');
    let canvasSizeLocation = gl.getUniformLocation(program2, 'canvasSize');
    // console.log(rotateMatrixLocation, arrowLengthLocation);
    let rotateAngle = 45.0;
    // let rotateMatrix = //逆时针 45°
    let arrowLength = 50.0; //pixel
    let param = {
        rotateAngle: 45,
        arrowLength: 50,
    };
    const gui = new dat.GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '30vh';
    gui.domElement.style.right = '42vw';
    gui.add(param, 'rotateAngle', 0, 90, 1).onChange(value => { rotateAngle = value; });
    gui.add(param, 'arrowLength', 50, 200, 1).onChange(value => { arrowLength = value; });
    const render = () => {
        gl.useProgram(program);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.LINES, 0, 2);
        gl.useProgram(program2);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniformMatrix2fv(rotateMatrixLocation, false, util.M2.rotateMat(rotateAngle).value);
        gl.uniform1f(arrowLengthLocation, arrowLength);
        gl.uniform2f(canvasSizeLocation, gl.canvas.width, gl.canvas.height);
        gl.drawArraysInstanced(gl.LINES, 0, 2, 2);
        requestAnimationFrame(render);
    };
    render();
};
