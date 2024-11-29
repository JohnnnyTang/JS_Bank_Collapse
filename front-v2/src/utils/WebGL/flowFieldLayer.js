// import {CustomLayerInterface} from 'mapbox-gl'
// import {FlowFieldManager} from './FlowFieldManager';
import { FlowFieldController } from './FlowFieldController';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import * as dat from 'dat.gui';
import './dat_gui_style.css';
class JsonFileParser {
    //JsonFile info
    url = '';
    flowFieldResourceArr = [];
    seedingResourceArr = [];
    projection2DResource = '';
    projection3DResource = '';
    flowFieldTexSize = [0.0, 0.0];
    seedingTexSize = [0.0, 0.0];
    projectionTexSize = [0.0, 0.0];
    flowBoundary = [0.0, 0.0, 0.0, 0.0];
    extent = [0.0, 0.0, 0.0, 0.0];
    maxDropRate = 0.0;
    maxDropRateBump = 0.0;
    maxSegmentNum = 0.0;
    maxTrajectoryNum = 0.0;
    maxTextureSize = 0.0;

    axiosIns = axios.create({
        baseURL: import.meta.env.BASE_URL
    })

    constructor(fileurl) {
        this.url = fileurl;
    }
    async Parsing() {
        await axios.get(this.url)
            .then((response) => {
                for (let item of response.data['flow_fields']) {
                    this.flowFieldResourceArr.push(item);
                }
                for (let item of response.data['area_masks']) {
                    this.seedingResourceArr.push(item);
                }
                this.projection2DResource = response.data['projection'][0];
                // this.projection3DResource = response.data['projection']['3D'];
                this.flowFieldTexSize = response.data['texture_size']['flow_field'];
                this.seedingTexSize = response.data['texture_size']['area_mask'];
                this.projectionTexSize = response.data['texture_size']['projection'];
                this.flowBoundary[0] = response.data['flow_boundary']['u_min'];
                this.flowBoundary[1] = response.data['flow_boundary']['v_min'];
                this.flowBoundary[2] = response.data['flow_boundary']['u_max'];
                this.flowBoundary[3] = response.data['flow_boundary']['v_max'];
                this.extent[0] = response.data['extent'][0];
                this.extent[1] = response.data['extent'][1];
                this.extent[2] = response.data['extent'][2];
                this.extent[3] = response.data['extent'][3];
                this.maxDropRate = response.data['constraints']['max_drop_rate'];
                this.maxDropRateBump = response.data['constraints']['max_drop_rate_bump'];
                this.maxSegmentNum = response.data['constraints']['max_segment_num'];
                // trajectoryNum === streamline_num
                this.maxTrajectoryNum = response.data['constraints']['max_streamline_num'];
                this.maxTextureSize = response.data['constraints']['max_texture_size'];
            });
    }
}
export default class FlowFieldLayer {
    id;
    type;
    renderingMode;
    // ffManager:FlowFieldManager;
    parser;
    controller;
    resourcePrefix;
    map = null;
    GL = null;
    gui = null;
    exaggeration = 4.0;
    uboMapBufferData = new Float32Array(12);
    phaseCount = 0.0;
    timePerFrame = 120.0;
    timeLast = 10.0;
    currentResourcePointer = 0;
    _timeCount = 0.0;
    _progressRate = 0.0;
    textureArraySize = 0;
    flowFieldTextureArr = [0, 0, 0];
    seedingTextureArr = [0, 0, 0];
    transformTexture = 0;
    particleMapBufferData = new Float32Array(0);
    simulationBuffer = 0;
    xfSimulationBuffer = 0;
    lifeBuffer = 0;
    xfLifeBuffer = 0;
    BO = 0;
    simulationVAO = 0;
    simulationVAO2 = 0;
    XFO = 0;
    XFO2 = 0;
    trajectoryPool = 0;
    // updateShaderObj:{program:WebGLProgram,vertexShader:WebGLShader,fragmentShader:WebGLShader}
    updateShaderObj;
    trajectoryShaderObj;
    isReady = false;
    renderVAO = 0;
    renderVAO2 = 0;
    textureOffsetArray = [];
    beginBlock = -1.0;
    now_FFTextureArr = [0, 0];
    now_SeedTextureArr = [0, 0];
    now_sVAO = 0;
    now_rVAO = 0;
    now_XFO = 0; //XF对象
    now_XFBO = 0; //XF所用buffer
    // constructor(ffManager:FlowFieldManager) {
    //     this.id = 'FlowLayer';
    //     this.type = 'custom';
    //     this.renderingMode = '2d';
    //     this.ffManager = ffManager;
    // }

    stepProgressRate = 0.0

    axiosIns = axios.create({
        baseURL: import.meta.env.BASE_URL
    })

    constructor(layerID, jsonUrl, resourcePrefix, hideGUI = false, errcallback = null) {
        this.id = layerID;
        this.type = 'custom';
        this.renderingMode = '2d';
        // this.ffManager = ffManager;
        this.parser = new JsonFileParser(jsonUrl);
        this.resourcePrefix = resourcePrefix;
        this.controller = new FlowFieldController();
        this.hideGUI = hideGUI;
        this.errcallback = errcallback;
    }
    set progressRate(value) {
        //phaseCount is the texSrc NUM
        //progressRate is a number between 0 and 1 === timeCount / timeLast
        //phase is the progressRate * phaseCount   === textureSrc index 
        //new phase ---> checkout new texture
        const lastPhase = Math.floor(this._progressRate * this.phaseCount) % this.phaseCount; //value would be (timecount+1)/timeLast
        const currentPhase = Math.floor(value * this.phaseCount) % this.phaseCount;
        const nextPhase = (currentPhase + 1) % this.phaseCount;
        this._progressRate = value;
        this.now_FFTextureArr[0] = this.flowFieldTextureArr[currentPhase % this.textureArraySize],
            this.now_FFTextureArr[1] = this.flowFieldTextureArr[nextPhase % this.textureArraySize];
        this.now_SeedTextureArr[0] = this.seedingTextureArr[currentPhase % this.textureArraySize],
            this.now_SeedTextureArr[1] = this.seedingTextureArr[nextPhase % this.textureArraySize];
        let temp = value * this.phaseCount;
        this.uboMapBufferData[0] = temp - Math.floor(temp);
        this.stepProgressRate = this.currentResourcePointer + Math.round(this.uboMapBufferData[0] * 10) / 10;
        if (currentPhase != lastPhase) {
            this.currentResourcePointer = (this.currentResourcePointer + 1) % this.phaseCount;
            // //console.log('now time step :: ', this.currentResourcePointer)
            //checkout new texture
            let index = nextPhase % this.textureArraySize;
            let gl = this.GL;
            this.UpdateTextureByImage(gl, this.flowFieldTextureArr[index], gl.RG, gl.LINEAR, this.parser.flowFieldTexSize[0], this.parser.flowFieldTexSize[1], this.parser.flowFieldResourceArr[nextPhase], 'Float');
            // this.UpdateTextureByImage(gl, this.seedingTextureArr[index], gl.RGBA, gl.NEAREST,
            //     this.parser.seedingTexSize[0], this.parser.seedingTexSize[1],
            //     this.parser.seedingResourceArr[nextPhase], 'UNSIGHNED_BYTE');
        }
    }
    get progressRate() {
        return this._progressRate;
    }
    set timeCount(value) {
        this._timeCount = value % this.timeLast;
    }
    get timeCount() {
        return this._timeCount;
    }
    async init2ShadersFromSrc(gl, vertURL, fragURL, XF_Varings) {
        const vertSrc = await this.axiosIns.get(vertURL)
            .then((response) => {
                return response.data;
            }).catch((error) => {
                //console.log('ERROR::VERTEX_SHADER FILE NOT FOUND', error);
            });
        const fragSrc = await this.axiosIns.get(fragURL)
            .then((response) => {
                return response.data;
            }).catch((error) => {
                //console.log('ERROR::FRAGMENT_SHADER FILE NOT FOUND', error);
            });
        const Vshader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(Vshader, vertSrc);
        gl.compileShader(Vshader);
        const Fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(Fshader, fragSrc);
        gl.compileShader(Fshader);
        const program = gl.createProgram();
        gl.attachShader(program, Vshader);
        gl.attachShader(program, Fshader);
        // set transformfeedbackvaryings 
        if (XF_Varings) {
            gl.transformFeedbackVaryings(program, XF_Varings, gl.SEPARATE_ATTRIBS);
        }
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            //check 
            //console.log(gl.getProgramInfoLog(program));
            return;
        }
        //这里的program需不需要记录？？不用shader对象的话，好不好记录？
        return {
            program,
            vertexShader: Vshader,
            fragmentShader: Fshader,
        };
    }
    async FillTextureByImage(gl, Tex, format, filter, width, height, imgSrc, type) {
        let imgSrc_backEnd = this.resourcePrefix + imgSrc;
        console.log(imgSrc_backEnd)
        //reparsing 
        if (type === 'Float') {
            axios.get(imgSrc_backEnd, { responseType: 'blob' })
                .then((response) => {
                    createImageBitmap(response.data, {
                        imageOrientation: 'flipY',
                        premultiplyAlpha: 'none', colorSpaceConversion: 'default'
                    })
                        .then((bitmap) => {
                            const pixelData = new Uint8Array(bitmap.width * bitmap.height * 4);
                            const ofsCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                            const ofsGL = ofsCanvas.getContext('webgl2');
                            const FB = ofsGL.createFramebuffer();
                            ofsGL.bindFramebuffer(ofsGL.FRAMEBUFFER, FB);
                            const ofsTex = ofsGL.createTexture();
                            ofsGL.bindTexture(ofsGL.TEXTURE_2D, ofsTex);
                            ofsGL.texImage2D(ofsGL.TEXTURE_2D, 0, ofsGL.RGBA8, bitmap.width, bitmap.height, 0, ofsGL.RGBA, ofsGL.UNSIGNED_BYTE, bitmap);
                            ofsGL.texParameteri(ofsGL.TEXTURE_2D, ofsGL.TEXTURE_MAG_FILTER, ofsGL.LINEAR);
                            ofsGL.texParameteri(ofsGL.TEXTURE_2D, ofsGL.TEXTURE_MIN_FILTER, ofsGL.LINEAR);
                            ofsGL.framebufferTexture2D(ofsGL.FRAMEBUFFER, ofsGL.COLOR_ATTACHMENT0, ofsGL.TEXTURE_2D, ofsTex, 0);
                            ofsGL.readPixels(0, 0, bitmap.width, bitmap.height, ofsGL.RGBA, ofsGL.UNSIGNED_BYTE, pixelData);
                            ofsGL.bindTexture(ofsGL.TEXTURE_2D, null);
                            ofsGL.bindFramebuffer(ofsGL.FRAMEBUFFER, null);
                            ofsGL.deleteTexture(ofsTex);
                            ofsGL.deleteFramebuffer(FB);
                            ofsGL.finish();
                            //get pixelData.buffer
                            gl.bindTexture(gl.TEXTURE_2D, Tex);
                            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RG, gl.FLOAT, new Float32Array(pixelData.buffer));
                            gl.bindTexture(gl.TEXTURE_2D, null);
                            gl.finish();
                        })
                        .catch((e) => {
                            console.warn(e);
                            console.warn('ERROR::FillTextureByImage CREATEIMAGEBITMAP ERROR' + imgSrc);
                        });
                })
                .catch((e) => {
                    console.warn('ERROR::FillTextureByImage GET IMG ERROR' + imgSrc);
                });
        }
        else {
            await axios.get(imgSrc_backEnd, { responseType: 'blob' })
                .then((response) => {
                    createImageBitmap(response.data, { imageOrientation: "flipY", premultiplyAlpha: "none", colorSpaceConversion: "default" })
                        .then((bitmap) => {
                            // //console.log("SUCCESS::GET BLOB RESPONSE & CREATE BITMAP FOR UNSIGNED_BYTE TYPE");
                            gl.bindTexture(gl.TEXTURE_2D, Tex);
                            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, format, gl.UNSIGNED_BYTE, bitmap);
                            //no generateMipmap 
                            gl.bindTexture(gl.TEXTURE_2D, null);
                            gl.finish();
                            // //console.log('FINISH::unsigned_byte reparsing');
                        });
                });
        }
    }
    async UpdateTextureByImage(gl, Tex, format, filter, width, height, imgSrc, type) {
        await this.FillTextureByImage(gl, Tex, format, filter, width, height, imgSrc, type);
    }
    FillBlockByData(gl, Tex, offsetX, offsetY, width, height, data) {
        gl.bindTexture(gl.TEXTURE_2D, Tex);
        //在解码时的数据处理方式设置
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, offsetX, offsetY, width, height, gl.RGB, gl.FLOAT, data);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    swap() {
        if (this.beginBlock % 2 == 0) {
            this.now_sVAO = this.simulationVAO;
            this.now_rVAO = this.renderVAO;
            this.now_XFO = this.XFO;
            this.now_XFBO = this.simulationBuffer;
        }
        else {
            this.now_sVAO = this.simulationVAO2;
            this.now_rVAO = this.renderVAO2;
            this.now_XFO = this.XFO2;
            this.now_XFBO = this.xfSimulationBuffer;
        }
    }
    async prepare(gl) {
        await this.parser.Parsing().catch(err=>{
            this.errcallback && this.errcallback(err)
        })
        //console.log(this.parser);
        //get gl extensions 
        const extensions = gl.getSupportedExtensions();
        for (let ext of extensions) {
            gl.getExtension(ext);
        }
        //parser as a JsonFileParser and a data storage
        //just for short writing
        // maxSegmentNum === segmentNum === segmentPrepare
        // this.parser.trajectoryNum = this.parser.maxTrajectoryNum;
        this.parser.trajectoryNum = 65536;
        this.parser.segmentPrepare = this.parser.maxSegmentNum;
        this.parser.segmentNum = this.parser.maxSegmentNum;
        this.parser.maxBlockSize = Math.ceil(Math.sqrt(this.parser.maxTrajectoryNum));
        // why?
        // the last one is a phase from the end to the head
        this.phaseCount = this.parser.flowFieldResourceArr.length;
        this.timeLast = this.phaseCount * this.timePerFrame; // 150 frame per timePoint
        // why 3?
        this.textureArraySize = 3;
        for (var i = 0; i < this.textureArraySize; i++) {
            let ff_tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, ff_tex);
            gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32F, this.parser.flowFieldTexSize[0], this.parser.flowFieldTexSize[1]);
            gl.bindTexture(gl.TEXTURE_2D, null);
            await this.FillTextureByImage(gl, ff_tex, gl.RG, gl.LINEAR, this.parser.flowFieldTexSize[0], this.parser.flowFieldTexSize[1], this.parser.flowFieldResourceArr[i], 'Float');
            this.flowFieldTextureArr[i] = (ff_tex);
            let seed_tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, seed_tex);
            gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, this.parser.seedingTexSize[0], this.parser.seedingTexSize[1]);
            gl.bindTexture(gl.TEXTURE_2D, null);
            await this.FillTextureByImage(gl, seed_tex, gl.RGBA, gl.NEAREST, this.parser.seedingTexSize[0], this.parser.seedingTexSize[1], this.parser.seedingResourceArr[i], 'UNSIGNED_BYTE');
            this.seedingTextureArr[i] = seed_tex;
            //能成功await到fill by image吗？ 并不能
        }
        let trans_tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, trans_tex);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32F, this.parser.projectionTexSize[0], this.parser.projectionTexSize[1]);
        gl.bindTexture(gl.TEXTURE_2D, null);
        await this.FillTextureByImage(gl, trans_tex, gl.RG, gl.LINEAR, this.parser.projectionTexSize[0], this.parser.projectionTexSize[1], this.parser.projection2DResource, 'Float');
        this.transformTexture = trans_tex;
        this.particleMapBufferData = new Float32Array(this.parser.maxBlockSize * this.parser.maxBlockSize * 3).fill(0); //one block`s data 
        //vec3 (x,y,attribute)   in paper
        for (let i = 0; i < this.parser.maxTrajectoryNum; i++) {
            //maxTrajectoryNum is equal to blocksize*blocksize
            this.particleMapBufferData[i * 3 + 0] = Math.random();
            this.particleMapBufferData[i * 3 + 1] = Math.random();
            this.particleMapBufferData[i * 3 + 2] = 0.0;
        }
        //age in paper
        const particleCountdownData = new Float32Array(this.parser.maxTrajectoryNum);
        for (let i = 0; i < this.parser.maxTrajectoryNum; i++) {
            //maxTrajectoryNum is equal to blocksize*blocksize
            particleCountdownData[i] = this.parser.maxSegmentNum * 9.0;
            //particle age is the maxSegmentNum*9
        }
        //buffer for simulation
        //simulationBuffer & xfsimulationbuffer store the vec3 data  in oneblock
        this.simulationBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.simulationBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.particleMapBufferData, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.xfSimulationBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.xfSimulationBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.particleMapBufferData, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //lifebuffer & xflifebuffer store the age data in oneblock
        this.lifeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lifeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, particleCountdownData, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.xfLifeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.xfLifeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, particleCountdownData, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //vertex Array object
        this.simulationVAO = gl.createVertexArray();
        gl.bindVertexArray(this.simulationVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.simulationBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
        gl.enableVertexAttribArray(0); // 第0个属性，每次读3个，滑动3*4 bits，从0开始
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lifeBuffer);
        gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 1 * 4, 0);
        gl.enableVertexAttribArray(1);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.simulationVAO2 = gl.createVertexArray();
        gl.bindVertexArray(this.simulationVAO2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.xfSimulationBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.xfLifeBuffer);
        gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 1 * 4, 0);
        gl.enableVertexAttribArray(1);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.renderVAO = gl.createVertexArray();
        gl.bindVertexArray(this.renderVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lifeBuffer);
        gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 1 * 4, 0);
        gl.vertexAttribDivisor(0, 1);
        gl.enableVertexAttribArray(0);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.renderVAO2 = gl.createVertexArray();
        gl.bindVertexArray(this.renderVAO2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.xfLifeBuffer);
        gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 1 * 4, 0);
        gl.vertexAttribDivisor(0, 1);
        gl.enableVertexAttribArray(0);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //transform feedback object-->  XFO or TFO 
        this.XFO = gl.createTransformFeedback();
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.XFO);
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.xfSimulationBuffer); //use array_buffer as transform_feedback_buffer
        gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.xfSimulationBuffer, 0, this.parser.maxBlockSize * this.parser.maxBlockSize * 4 * 3); //vec3
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.xfLifeBuffer);
        gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, 1, this.xfLifeBuffer, 0, this.parser.maxBlockSize * this.parser.maxBlockSize * 4); //age
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
        this.XFO2 = gl.createTransformFeedback();
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.XFO2);
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.simulationBuffer);
        // 0 is a binding point 
        gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.simulationBuffer, 0, this.parser.maxBlockSize * this.parser.maxBlockSize * 3 * 4);
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.lifeBuffer);
        // 1 is a binding point
        gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, 1, this.lifeBuffer, 0, this.parser.maxBlockSize * this.parser.maxBlockSize * 4);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
        //maxBlockSize already set  , just for eazy understanding
        this.parser.maxBlockSize = Math.ceil(Math.sqrt(this.parser.maxTrajectoryNum));
        this.parser.maxBlockColumn = Math.floor(this.parser.maxTextureSize / this.parser.maxBlockSize);
        //build offser array
        for (let i = 0; i < this.parser.maxSegmentNum; i++) {
            let offsetItem = {
                offsetX: this.parser.maxBlockSize * ((i) % this.parser.maxBlockColumn),
                offsetY: this.parser.maxBlockSize * Math.floor((i) / this.parser.maxBlockColumn),
            };
            this.textureOffsetArray.push(offsetItem);
        }
        // this.particleMapBufferData = new Float32Array(this.parser.maxBlockSize * this.parser.maxBlockSize * 3).fill(0);
        this.BO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.BO);
        gl.bufferData(gl.ARRAY_BUFFER, 48, gl.DYNAMIC_DRAW); //size === 48bytes -- uniformblock里有12个float
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //init the trajectory pool
        this.trajectoryPool = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.trajectoryPool);
        //Allocate the memory space of trajectoryPool
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGB32F, this.parser.maxTextureSize, this.parser.maxTextureSize);
        gl.bindTexture(gl.TEXTURE_2D, null);
        //fill each block by particlebufferdata
        for (let i = 0; i < this.parser.maxSegmentNum; i++) {
            this.FillBlockByData(gl, this.trajectoryPool, this.textureOffsetArray[i].offsetX, this.textureOffsetArray[i].offsetY, this.parser.maxBlockSize, this.parser.maxBlockSize, this.particleMapBufferData);
        }
        //init Shader and set TransformFeedbackVaryings
        let XF_Varings = ['newInfo', 'aliveTime'];
        this.updateShaderObj = await this.init2ShadersFromSrc(gl, '/scratchSomething/flowWebGL/shaders/update.vert', '/scratchSomething/flowWebGL/shaders/update.frag', XF_Varings);
        this.trajectoryShaderObj = await this.init2ShadersFromSrc(gl, '/scratchSomething/flowWebGL/shaders/trajectory.noCulling.vert', '/scratchSomething/flowWebGL/shaders/trajectory.noCulling.frag');
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
        gl.bindVertexArray(null);
        this.uboMapBufferData[8] = this.parser.flowBoundary[0];
        this.uboMapBufferData[9] = this.parser.flowBoundary[1];
        this.uboMapBufferData[10] = this.parser.flowBoundary[2];
        this.uboMapBufferData[11] = this.parser.flowBoundary[3];
        this.isReady = true;
    }
    tickfunc(gl, matrix) {
        this.beginBlock = (this.beginBlock + 1) % this.parser.segmentNum;
        this.swap();
        if (this.controller.isUnsteady) {
            this.progressRate = this.timeCount / this.timeLast;
            // here  set the uboMapBufferData[0] -- would be a data in (0,1)
            this.timeCount = this.timeCount + 1;
        }
        this.uboMapBufferData[1] = this.parser.maxSegmentNum;
        this.uboMapBufferData[2] = this.parser.maxSegmentNum * 10;
        this.uboMapBufferData[3] = this.controller.dropRate;
        this.uboMapBufferData[4] = this.controller.dropRateBump;
        this.uboMapBufferData[5] = this.controller.speedFactor * 0.01 * 100;
        this.uboMapBufferData[6] = this.controller.colorScheme;
        // [7]?               ------ notice the offset
        // 下面的部分放prepare
        // this.uboMapBufferData[8] = this.parser.flowBoundary[0];
        // this.uboMapBufferData[9] = this.parser.flowBoundary[1];
        // this.uboMapBufferData[10] = this.parser.flowBoundary[2];
        // this.uboMapBufferData[11] = this.parser.flowBoundary[3];
        //## simulation
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.BO); //array_buffer as uniform_buffer
        gl.bufferData(gl.UNIFORM_BUFFER, this.uboMapBufferData, gl.DYNAMIC_DRAW);
        let bindingPoint = 0;
        gl.bindBufferRange(gl.UNIFORM_BUFFER, bindingPoint, this.BO, 0, 48);
        gl.bindVertexArray(this.now_sVAO);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.now_XFO);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.now_FFTextureArr[0]);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.now_FFTextureArr[1]);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.now_SeedTextureArr[0]);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, this.now_SeedTextureArr[1]);
        //-----updateShader start work
        gl.useProgram(this.updateShaderObj.program);
        let location = null;
        location = gl.getUniformLocation(this.updateShaderObj.program, 'flowField');
        gl.uniform1iv(location, [0, 1]);
        location = gl.getUniformLocation(this.updateShaderObj.program, 'mask');
        gl.uniform1iv(location, [2, 3]);
        location = gl.getUniformLocation(this.updateShaderObj.program, 'randomSeed');
        gl.uniform1f(location, Math.random());
        let blockIndex = 0;
        blockIndex = gl.getUniformBlockIndex(this.updateShaderObj.program, 'FlowFieldUniforms');
        gl.uniformBlockBinding(this.updateShaderObj.program, blockIndex, bindingPoint); //bind uniformblock to the specific bindingpoint
        gl.enable(gl.RASTERIZER_DISCARD);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, this.parser.trajectoryNum); //just one block
        gl.endTransformFeedback();
        gl.disable(gl.RASTERIZER_DISCARD);
        gl.bindVertexArray(null);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
        // //console.log('simulation is done for one block');
        //-----update TrajectoryPool by the XFBO
        gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, this.now_XFBO); //store the block simulated data
        // texSubImage2D  can  read from  unpack_BUFFER  no need to be parameter
        gl.bindTexture(gl.TEXTURE_2D, this.trajectoryPool);
        //just the begin block
        // //console.log('this.maxBlockSize::'+this.parser.maxBlockSize);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, this.textureOffsetArray[this.beginBlock].offsetX, this.textureOffsetArray[this.beginBlock].offsetY, this.parser.maxBlockSize, this.parser.maxBlockSize, gl.RGB, gl.FLOAT, 0); // particle data from buffer to texture
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);
        gl.finish(); // wait gpu finish all assignments
        // ----wait for all block is updated
        if (this.parser.segmentPrepare > 0) {
            this.parser.segmentPrepare--;
            return;
        }
        // // //console.log('all block is updated , start rendering');
        //## render
        gl.bindVertexArray(this.now_rVAO);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.trajectoryPool);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.transformTexture);
        // ------some rendering options
        gl.disable(gl.DEPTH_TEST);
        // gl.enable(gl.BLEND);
        // gl.blendColor(0.0, 0.0, 0.0, 0.0);
        // gl.blendEquation(gl.FUNC_ADD);
        // gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        // ------primitive == 0  ---> flow
        // ------trajectoryShader working!
        gl.useProgram(this.trajectoryShaderObj.program);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'particlePool');
        gl.uniform1i(location, 0);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'projectionTexture');
        gl.uniform1i(location, 1);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'blockNum');
        gl.uniform1i(location, this.parser.maxSegmentNum);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'beginBlock');
        gl.uniform1i(location, this.beginBlock);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'blockSize');
        gl.uniform1i(location, this.parser.maxBlockSize);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'fillWidth');
        gl.uniform1f(location, this.controller.fillWidth);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'aaWidth');
        gl.uniform1f(location, this.controller.aaWidth);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'viewport');
        gl.uniform2f(location, gl.canvas.width, gl.canvas.height);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'u_matrix');
        gl.uniformMatrix4fv(location, false, matrix);
        location = gl.getUniformLocation(this.trajectoryShaderObj.program, 'exagration');
        gl.uniform1f(location, this.exaggeration);
        blockIndex = gl.getUniformBlockIndex(this.trajectoryShaderObj.program, 'FlowFieldUniforms');
        gl.uniformBlockBinding(this.trajectoryShaderObj.program, blockIndex, bindingPoint);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, (this.controller.segmentNum - 1) * 2, this.controller.lineNum);
        gl.bindVertexArray(null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    async onAdd(map, gl) {
        this.GL = gl;
        // //console.log('Custom flow field layer is being added...');
        if (this.hideGUI === false) this.initGUI();
        this.map = map;
        await this.prepare(gl);
    }
    onRemove() {
        if (this.gui) this.gui.destroy();
    }
    render(gl, matrix) {
        if (!this.isReady) {
            // //console.log('manager not ready');
            this.map?.triggerRepaint();
            return;
        }
        this.tickfunc(gl, matrix);
        this.map?.triggerRepaint();
    }
    initGUI = () => {
        dat.GUI.TEXT_OPEN = "展开控制面板";
        dat.GUI.TEXT_CLOSED = "收起控制面板";
        this.gui = new dat.GUI();
        this.gui.domElement.style.position = 'absolute';
        this.gui.domElement.style.top = '15vh';
        this.gui.domElement.style.right = '3vw';
        this.gui.add(this.controller, 'isUnsteady', true).name('非稳态流场').onChange(value => this.controller.isUnsteady = value);
        this.gui.add(this.controller, 'lineNum', 0, 65536).name('流线数量').onChange(value => this.controller.lineNum = value);
        this.gui.add(this.controller, 'segmentNum', 1, 64).name('流线分段数').onChange(value => this.controller.segmentNum = value);
        // this.gui.add(this.controller, 'progressRate', 0.0, 1.0).name('进度率').onChange(value => this.controller.progressRate = value);
        this.gui.add(this.controller, 'speedFactor', 0.1, 10.0).name('速度因子').onChange(value => this.controller.speedFactor = value);
        this.gui.add(this.controller, 'fillWidth', 0, 10).name('填充宽度').onChange(value => this.controller.fillWidth = value);
        this.gui.add(this.controller, 'aaWidth', 0, 10).name('反走样宽度').onChange(value => this.controller.aaWidth = value);
        this.gui.add(this.controller, 'colorScheme', [1.0, 2.0, 3.0]).name('颜色方案').onChange(value => this.controller.colorScheme = value);
        this.gui.open();
    };
}
