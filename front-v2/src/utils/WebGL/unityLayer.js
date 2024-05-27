import { Threebox } from 'threebox-plugin'
import * as THREE from 'three'
import MaskLayer from './maskLayer'

// const unityCanvas = document.createElement('canvas')
// unityCanvas.id = 'UnityCanvas'
// unityCanvas.style.zIndex = '1'
// unityCanvas.style.width = '100%'
// unityCanvas.style.height = '100%'
// unityCanvas.style.border = 'none'
// unityCanvas.style.position = 'absolute'
// unityCanvas.style.pointerEvents = 'none'
// unityCanvas.style.background = 'transparent !important'
// document.body.appendChild(unityCanvas)

class UnityLayer {

    constructor(originPosition, visibleZoom, unityCanvas) {

        this.type = 'custom'
        this.id = 'Unity-Layer'
        this.renderingMode = '3d'
        this.unityProjName = 'output'
        this.visibleZoom = visibleZoom
        this.originPosition = originPosition

        this.tb = undefined
        this.map = undefined
        this.zoom = undefined
        this.unity = undefined
        this.originPoint = undefined
        this.dispatchMessage = undefined

        // Get Unity canvas
        this.unityCanvas = unityCanvas
        unityCanvas.style.width = unityCanvas.clientWidth
        unityCanvas.style.height = unityCanvas.clientHeight
    }

    onAdd(map, gl) {

        // Set Unity instance configuration
        const buildUrl = "/scratchSomething/unity/collapseBank/build"
        const config = {
            frameworkUrl: buildUrl + `/${this.unityProjName}.framework.js`,
            dataUrl: buildUrl + `/${this.unityProjName}.data`,
            codeUrl: buildUrl + `/${this.unityProjName}.wasm`,
            streamingAssetsUrl: "StreamingAssets",
            companyName: "DefaultCompany",
            productVersion: "0.1",
            productName: "0325",
            webglContextAttributes: {
                "alpha": true
            }
        }

        // Init map
        this.map = map
        this.zoom = this.map.getZoom()
        this.map.on('click', e => {

            if (this.zoom >= this.visibleZoom) this.pick(e.point.x, e.point.y)
        })

        // Init threebox
        this.tb = new Threebox(
            map,
            map.getCanvas().getContext('webgl2'),
            {}
        )

        // Set origin point
        // this.originPoint = this.tb.projectToWorld(this.originPosition)

        this.op_world = this.wgs84ToWorld(this.originPosition[0], this.originPosition[1])
        //     120.51988006, 32.04023661,
        //     120.54608256, 32.02842654,
        //     120.56382537, 32.02344990,
        //     120.51749289, 32.04059243,
        //     120.51977143, 32.04001152,
        //     120.52561059, 32.03824715,
        //     120.52660704, 32.03676583,
        //     120.53334877, 32.03227055,
        //     120.54599538, 32.02837993,
        //     120.55330842, 32.02691551,
        //     120.55649757, 32.02592404,
        //     120.56334257, 32.02298144,
        //     120.56944728, 32.02070961,
        //     120.51738456, 32.04042984,
        //     120.51958506, 32.03998636,
        //     120.52551656, 32.03811304,
        //     120.53327833, 32.03217940,
        //     120.54588866, 32.02838767,
        //     120.55315814, 32.02692744,
        //     120.55672182, 32.02580795,
        //     120.51726088, 32.04054582,
        //     120.51738292, 32.04054923,
        //     120.51749021, 32.04053105,
        //     120.51957026, 32.04008655,
        //     120.51967889, 32.04004108,
        //     120.51986665, 32.03998992,
        //     120.52557975, 32.03825056,
        //     120.52565217, 32.03813574,
        //     120.52566826, 32.03799363,
        //     120.51992163, 32.04023206,
        //     120.52666202, 32.03683063,
        //     120.54611474, 32.02839471,
        // ]
        // const positions_MS = []
        // for (let i = 0; i < coords.length / 2; i++) {
        //     const lon = coords[2 * i + 0]
        //     const lat = coords[2 * i + 1]
        //     const pos_WS = this.wgs84ToWorld(lon, lat)
        //     const pos_MS = this.worldToModel(pos_WS[0], pos_WS[1])
        //     positions_MS.push(pos_MS[0])
        //     positions_MS.push(pos_MS[1])
        //     positions_MS.push(pos_MS[2])
        // }

        // Init Unity insatnce
        createUnityInstance(this.unityCanvas, config, (progress) => {

        }).then((unityInstance) => {

            this.map.addLayer(new MaskLayer())

            this.unity = unityInstance

            this.dispatchMessage = (message) => {

                this.unity.SendMessage("MapCamera", "DispatchMessage", JSON.stringify(message))
            }

            this.init()
            this.keep(this.zoom >= this.visibleZoom)

        }).catch((message) => {

            alert(message)
        })
    }

    render(gl, matrix) {

        if (!this.unity) return

        this.map.triggerRepaint()

        this.tb.camera.updateProjectionMatrix()
        this.tb.update()
        this.tick()
    }

    // Unity interfaces
    init() {

        this.dispatchMessage({
            Method: 'Init'
        })
    }

    pick(x, y) {

        this.dispatchMessage({
            Method: 'Pick',
            F32Array: [
                2.0 * x / this.unityCanvas.clientWidth - 1.0,
                2.0 * (this.unityCanvas.clientHeight - y) / this.unityCanvas.clientHeight - 1.0
            ]
        })
    }

    tick() {

        const xCamera = updateWorldCamera(this.map.transform.clone(), this.tb.Constants.WORLD_SIZE, -30.0)

        const flip = new THREE.Matrix4().set(
            1.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        )

        const xModel = new THREE.Matrix4().multiply(new THREE.Matrix4().makeTranslation(this.op_world[0] - 25.0, this.op_world[1], 10.0))
        const xView = xCamera.view
        const xProjection = this.tb.utils.makePerspectiveMatrix(xCamera.fov, xCamera.aspect, xCamera.nearZ, xCamera.farZ)
        const xMVP = xProjection.multiply(xView).multiply(xModel).multiply(flip)

        const center = this.worldToModel(xCamera.center.x, xCamera.center.y, xCamera.center.z, 25.0, 0.0, -10.0)
        const position = this.worldToModel(xCamera.position.x, xCamera.position.y, xCamera.position.z, 25.0, 0.0, -10.0)
        // console.log(xCamera.fov)
        const up = xCamera.up;
        this.dispatchMessage({
            Method: 'Tick',
            F32Array: [
                /* 0 - 15 */    ...xMVP.elements,
                /* 16 - 18 */   position[0], position[2], position[1],
                /* 19 - 21 */   up.x, up.z, up.y,
                /* 22 */        xCamera.fov * 180.0 / Math.PI,
                /* 23 - 25 */   center[0], center[2], center[1],
                /* 26 */        xCamera.nearZ,
                /* 27 */        xCamera.farZ,
            ]
        })
    }

    keep(tof) {

        this.unityCanvas.style.visibility = tof ? 'visible' : 'hidden'

        this.dispatchMessage({
            Method: 'Keep',
            BoolArray: [tof]
        })
    }

    clear() {

        const gl = this.unity.Module.ctx
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        gl.clearColor(0.0, 0.0, 0.0, 0.0)
    }

    wgs84ToWorld(lon, lat) {

        const worldSize = this.tb.Constants.WORLD_SIZE
        const WMC = fromLonLat([lon, lat])
        return [
            (WMC[0] - 0.5) * worldSize,
            (0.5 - WMC[1]) * worldSize
        ]
    }

    worldToModel(x, y, z, offsetX = 0.0, offsetY = 0.0, offsetZ = 0.0) {

        return [
            x - this.op_world[0] + offsetX,
            y - this.op_world[1] + offsetY,
            z + offsetZ,
        ]
    }

    remove() {
        if (this.unity) {
            console.log('unityLayer removing')
            this.keep(false)
            this.clear()
            this.unity.Quit(function () {
                console.log("done!")
            })
            this.unity = null
        }
        if (this.map.getLayer('Mask-Layer'))
            this.map.removeLayer('Mask-Layer')

        // hide dom
        let dom = document.querySelector('#DeviceInfoBox')
        dom.style.display = 'none'


        this.tb = undefined
        this.map = undefined
        this.zoom = undefined
        this.unity = undefined
        this.originPoint = undefined
        this.dispatchMessage = undefined
        this.unityCanvas = undefined

    }
}

// Helpers //////////////////////////////////////////////////////////////////////////////////////////////////////
function mercatorXfromLon(lon) {

    return (180. + lon) / 360.
}

function mercatorYfromLat(lat) {

    return (180. - (180. / Math.PI * Math.log(Math.tan(Math.PI / 4. + lat * Math.PI / 360.)))) / 360.
}

function fromLonLat(lonLat) {

    const x = mercatorXfromLon(lonLat[0])
    const y = mercatorYfromLat(lonLat[1])

    return [x, y]
}


function updateWorldCamera(t, mercatorWorldSize, minElevation = -30.0) {

    const fov = t._fov
    const halfFov = t._fov / 2

    const angle = t.angle
    const pitch = t._pitch

    const aspect = t.width / t.height

    const cameraToCenterDistance = 0.5 / Math.tan(halfFov) * mercatorWorldSize / t.scale * t.height / 512.0

    // let minElevation = -80.06899999999999 * 30.0
    const cameraToSeaLevelDistance = ((t._camera.position[2] * mercatorWorldSize) - minElevation) / Math.cos(pitch)
    const topHalfSurfaceDistance = Math.sin(halfFov) * cameraToSeaLevelDistance / Math.sin(Math.max(Math.PI / 2.0 - pitch - halfFov, 0.01))
    const furthestDistance = Math.sin(pitch) * topHalfSurfaceDistance + cameraToSeaLevelDistance
    const horizonDistance = cameraToSeaLevelDistance / t._horizonShift
    const farZ = Math.min(furthestDistance * 1.01, horizonDistance)

    const pitchMatrix = new THREE.Matrix4().makeRotationX(pitch)
    const angleMatrix = new THREE.Matrix4().makeRotationZ(angle)
    const worldToCamera = pitchMatrix.premultiply(angleMatrix)

    const x = t.pointMerc.x
    const y = t.pointMerc.y
    const centerX = (x - 0.5) * mercatorWorldSize
    const centerY = (0.5 - y) * mercatorWorldSize
    const center = new THREE.Vector3(centerX, centerY, 0)

    const up = new THREE.Vector3(0, 1, 0)
        .applyMatrix4(angleMatrix)

    const position = new THREE.Vector3(0, 0, 1)
        .applyMatrix4(worldToCamera)
        .multiplyScalar(cameraToCenterDistance)
        .add(center)

    const view = new THREE.Matrix4().makeTranslation(position.x, position.y, position.z).multiply(worldToCamera).invert()

    return {
        position,
        center,
        up,
        fov,
        aspect,
        farZ,
        nearZ: cameraToCenterDistance / 200,
        view,
    }
}

export {
    UnityLayer
}