import * as scr from '../scratch/scratch.js'

export default class TerrainLayer extends scr.LocalTerrain {

    constructor(maxLevel) {

        super(maxLevel)

        this.type = 'custom'
        this.map = undefined
        this.id = '三维地形'
        this.renderingMode = '3d'
    }

    onAdd(map, gl) {

        this.map = map
        this.setResource(map.dynamicUniformBuffer)
        map.add2PreProcess(this.prePass).add2RenderPass(this.pipeline, this.binding)
    }

    render(gl, matrix) {

        this.registerRenderableNode({
            cameraPos: this.map.mercatorCenter.toLngLat().toArray(),
            cameraBounds: this.map.cameraBounds,
            zoomLevel: this.map.zoom.n,
        })
    }

    
}