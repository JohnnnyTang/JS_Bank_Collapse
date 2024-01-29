import getDevice from "../context/device";

export class Director {

    constructor() {

        /**
         * @type {{[name: string]: Array<any>}}
         */
        this.stages = {}
        this.stageNum = 0
        this.bindings = []
        this.buffers = {}
        this.textures = {}
    }

    makeNewStage(name) {

        if (!this.stages[name]) this.stageNum++
        this.stages[name] = []

        return this
    }


    addBinding(binding) {

        this.bindings.push(binding.use())
    }

    addBuffer(buffer) {

        this.buffers[buffer.uuid] = buffer
    }

    addTexture(texture) {

        this.textures[texture.uuid] = texture
    }

    removeBuffer(uuid) {

        this.buffers[uuid] = null
        delete this.buffers[uuid]
    }

    removeTexture(uuid) {

        this.textures[uuid] = null
        delete this.textures[uuid]
    }

    /** 
     * @param {{name: string, items: Array<any>}} stage 
     */
    addStage(stage) {

        if (!this.stages[stage.name]) this.stageNum++
        this.stages[stage.name] = stage.items
    }

    /**
     * 
     * @param {string} stageName 
     * @param {any} item 
     */
    addItem(stageName, item) {

        this.stages[stageName].push(item)

        return this
    }

    tickMemory() {

        for (const key in this.buffers) {
            this.buffers[key].update()
        }
        for (const key in this.textures) {
            this.textures[key].update()
        }
        // this.bindings.forEach(binding => binding.complete && binding.update())
    }

    tickRender() {

        const device = getDevice()
        const encoders = new Array(this.stageNum)
        let index = 0
        for (const name in this.stages) {
            const encoder = device.createCommandEncoder({label: `${name}`})
            this.stages[name].forEach(item => {
                item.execute(encoder)
            })
            encoders[index++] = encoder.finish()
        }
        device.queue.submit(encoders)
    }

    tick() {

        this.tickMemory()
        this.tickRender()
    }
}
const director = new Director()
export default director