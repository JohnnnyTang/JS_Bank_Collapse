import * as scr from '../scratch/scratch.js'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'

export default class BankWarnLayer {


    constructor(JsonUrl) {
        this.id = '岸段预警'
        this.jsonUrl = JsonUrl
        this.map = undefined
        this.type = 'custom'
        this.renderingMode = '3d'
        this.showLayer = false
        this.prepared = false

    }
    async onAdd(map, gl) {
        console.log('onAdd');
        const data = (await axios.get(this.jsonUrl)).data
        console.log(data);

        this.map = map
        this.vertexData = []
        this.warnValues = []
        this.vertexCount = 0

        data.forEach(element => {
            //coords 1
            let x = encodeFloatToDouble(scr.MercatorCoordinate.mercatorXfromLon(element.coords[0][0]))
            let y = encodeFloatToDouble(scr.MercatorCoordinate.mercatorYfromLat(element.coords[0][1]))
            this.vertexData.push(x[0])
            this.vertexData.push(x[1])
            this.vertexData.push(y[0])
            this.vertexData.push(y[1])

            //coords 2
            x = encodeFloatToDouble(scr.MercatorCoordinate.mercatorXfromLon(element.coords[1][0]))
            y = encodeFloatToDouble(scr.MercatorCoordinate.mercatorYfromLat(element.coords[1][1]))
            this.vertexData.push(x[0])
            this.vertexData.push(x[1])
            this.vertexData.push(y[0])
            this.vertexData.push(y[1])

            this.warnValues.push(element.warnValue)
            this.warnValues.push(element.warnValue)//两个点同样的warnValue
            this.vertexCount += 2
        });
        // test
        // this.vertexData = [
        //     0.1,0.0,0.8,0.0,
        //     0.8,0.0,0.8,0.0,
        //     0.1,0.0,0.1,0.0,
        // ]
        // this.warnValues = [
        //     0.1,
        //     0.5,
        //     0.8
        // ]
        // this.vertexCount = 3

        console.log(this.vertexData);
        console.log(this.warnValues);
        console.log(this.vertexCount);

        this.layerTexture = this.map.screen.createScreenDependentTexture('--warnLayerTexture--')
        console.log(this.layerTexture);
        this.vertexBuffer4coord = scr.vertexBuffer({
            name: `--vertexBuffer4coord--`,
            resource: {
                arrayRef: scr.aRef(new Float32Array(this.vertexData)),
                structure: [
                    { components: 4 },
                ]
            },
        })
        this.vertexBuffer4warn = scr.vertexBuffer({
            name: `--vertexBuffer4warn--`,
            resource: {
                arrayRef: scr.aRef(new Float32Array(this.warnValues)),
                structure: [
                    { components: 1 },
                ]
            },
        })

        this.warnBinding = scr.binding({
            name: '--Binding1--',
            range: () => [this.vertexCount],
            vertices: [
                { buffer: this.vertexBuffer4coord },
                { buffer: this.vertexBuffer4warn }
            ],
            sharedUniforms: [
                { buffer: this.map.dynamicUniformBuffer }
            ]
        })

        this.warnPipline = scr.renderPipeline({
            name: '--WarnPipline--',
            shader: {
                module: scr.shaderLoader.load('Shader (Warn)', '/bankWarn/shader/warn.wgsl')
            },
            // colorTargetStates: [{ blend: scr.PremultipliedBlending }],
            primitive: { topology: 'triangle-strip' },
        })

        this.warnRenderPass = scr.renderPass({
            name: '--WarnRenderPass--',
            colorAttachments: [{ colorResource: this.layerTexture }],
            depthStencilAttachment: { depthStencilResource: this.map.depthTexture }
        }).add(this.warnPipline, this.warnBinding)

        this.showBinding = scr.binding({
            name: 'Binding (layer Show)',
            range: () => [4],
            textures: [{ texture: this.layerTexture }],
        })
        this.showPipeline = scr.renderPipeline({
            name: 'Render Pipeline (layer Show)',
            shader: { module: scr.shaderLoader.load('Shader (layer Show)', '/bankWarn/shader/layerShow.wgsl') },
            primitive: { topology: 'triangle-strip' },
            colorTargetStates: [{ blend: scr.NormalBlending }],
        })
        this.map.add2PreProcess(this.warnRenderPass)
        this.map.add2RenderPass(this.showPipeline, this.showBinding)



        this.prepared = true
    }


    async render(gl, matrix) {
        console.log('render!');
        if (!this.prepared) return
    }


    show() {
        this.showLayer = true
    }

    hide() {
        this.showLayer = false
    }

}


function encodeFloatToDouble(value) {

    const result = new Float32Array(2);
    result[0] = value;

    const delta = value - result[0];
    result[1] = delta;
    return result;
}
