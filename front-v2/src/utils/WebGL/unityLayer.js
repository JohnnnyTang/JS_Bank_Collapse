import { Threebox } from 'threebox-plugin'
import * as THREE from 'three'

// const unityCanvas = document.createElement('canvas')
// unityCanvas.id = 'UnityCanvas'
// unityCanvas.style.zIndex = '1 !important'
// unityCanvas.style.width = '100%'
// unityCanvas.style.height = '100%'
// unityCanvas.style.border = 'none'
// unityCanvas.style.position = 'absolute'
// unityCanvas.style.pointerEvents = 'none'
// unityCanvas.style.background = 'transparent !important'
// document.body.appendChild(unityCanvas)

export class UnityLayer {

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
        this.unityCanvas.style.width = this.unityCanvas.clientWidth
        this.unityCanvas.style.height = this.unityCanvas.clientHeight
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

        const worldSize = this.tb.Constants.WORLD_SIZE
        const op_webMercator = fromLonLat(this.originPosition)
        this.op_world = [
            (op_webMercator[0] - 0.5) * worldSize,
            (0.5 - op_webMercator[1]) * worldSize
        ]

        // Init Unity insatnce
        createUnityInstance(this.unityCanvas, config, (progress) => {

        }).then((unityInstance) => {

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

        // Render or not
        // const currentZoom = this.map.getZoom()
        // if (this.zoom < this.visibleZoom && currentZoom >= this.visibleZoom) {

        //     this.keep(true)
        // }
        // else if (this.zoom >= this.visibleZoom && currentZoom < this.visibleZoom) {

        //     this.keep(false)
        //     this.clear()
        // }
        // this.zoom = currentZoom

        // // Tick logic
        // if (this.zoom >= this.visibleZoom) {

        //     this.tb.camera.far = 1500000.0
        //     this.tb.camera.near = this.tb.camera.far / 100000.0
        //     this.tb.camera.updateProjectionMatrix()
        //     this.tb.update()
        //     this.tick()
        // }
        // this.tb.camera.far = this.map.far.n
        // this.tb.camera.near = Math.max(this.tb.camera.far / 100000.0, 0.1)
        // this.tb.camera.far = 150000.0
        // this.tb.camera.near = this.tb.camera.far / 100000.0
        this.tb.camera.updateProjectionMatrix()
        this.tb.update()
        this.tick()
        // this.map.triggerRepaint()
    }

    // Unity interfaces
    init() {

        this.dispatchMessage({
            Method: 'Init'
        })
    }

    pick(x, y) {

        // this.dispatchMessage({
        //     Method: 'Pick',
        //     F32Array: [
        //         2.0 * x / this.unityCanvas.clientWidth - 1.0,
        //         2.0 * (this.unityCanvas.clientHeight - y) / this.unityCanvas.clientHeight - 1.0
        //     ]
        // })
    }

    tick() {

        updateCamera$2(this.tb.cameraSync, this.tb.Constants.WORLD_SIZE)

        // console.log(this.tb.cameraSync.updateCameraState())
        const flip = new THREE.Matrix4().set(
            1.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        )
        // const model = this.tb.world.matrixWorld.multiply(new THREE.Matrix4().makeTranslation(this.originPoint.x, this.originPoint.y, this.originPoint.z))
        // const view = new THREE.Matrix4().copy(this.tb.camera.matrixWorldInverse)
        // const projection = new THREE.Matrix4().copy(this.tb.camera.projectionMatrix)
        // const mvp = projection.multiply(view).multiply(model).multiply(flip)


        // this.xCamera={
        //     position:cameraP,
        //     center:centerP,
        //     up:upDir,
        //     fov,
        //     aspect:cameraAspect,
        //     nearZ:cameraToCenterDistance/10,
        //     farZ:cameraToCenterDistance*5,
        // }

        const xCamera = this.tb.cameraSync.xCamera

        const xModel = new THREE.Matrix4().multiply(new THREE.Matrix4().makeTranslation(this.op_world[0] - 25.0, this.op_world[1], 10.0))
        const xView = new THREE.Matrix4().lookAt(xCamera.position, xCamera.center, xCamera.up).premultiply(new THREE.Matrix4().makeTranslation(xCamera.position.x, xCamera.position.y, xCamera.position.z)).invert()
        const xProjection = this.tb.utils.makePerspectiveMatrix(xCamera.fov, xCamera.aspect, xCamera.nearZ, xCamera.farZ)
        const xMVP = xProjection.multiply(xView).multiply(xModel).multiply(flip)

        // const cameraPos = new THREE.Vector4(0, 0, 0, 1.0).applyMatrix4(this.tb.camera.matrixWorld)
        // console.log(cameraPos)

        this.dispatchMessage({
            Method: 'Tick',
            F32Array: [...xMVP.elements, xCamera.position.x, xCamera.position.z, xCamera.position.y, xCamera.center.x, xCamera.center.z, xCamera.center.y]
            // F32Array: xMVP.elements
            // F32Array: mvp.elements
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

    remove() {
        if (this.unity) {
            console.log('unityLayer removing')
            this.keep(false)
            this.clear()
            this.unity.Quit(function() {
                console.log("done!")
            })
            this.unity = null
        }


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


function updateCamera$2(cameraSync, _worldSize) {

    if (!cameraSync.camera) {
        console.log('nocamera')
        return;
    }
    const t = cameraSync.map.transform;
    const cameraAspect = t.width / t.height;
    const offset = t.centerOffset || new THREE.Vector3();
    let mercatorWorldSize = _worldSize
    let farZ = 0;
    let furthestDistance = 0;
    const halfFov = t._fov / 2;
    const fov = t._fov;
    const groundAngle = Math.PI / 2 + t._pitch;
    const pitchAngle = Math.cos(Math.PI / 2 - t._pitch);
    let zoomPow = t.scale * cameraSync.state.worldSizeRatio;
    const cameraToCenterDistance = 0.5 / Math.tan(cameraSync.halfFov) * mercatorWorldSize / t.scale * t.height / 512;
    let pixelsPerMeter = 1;
    let worldSize = 5120000
    if (cameraSync.map.tb.mapboxVersion >= 2.0) {
        // mapbox version >= 2.0
        // pixelsPerMeter = cameraSync.mercatorZfromAltitude(1, t.center.lat) * worldSize;
        // const fovAboveCenter = t._fov * (0.5 + t.centerOffset.y / t.height);

        // // Adjust distance to MSL by the minimum possible elevation visible on screen,
        // // this way the far plane is pushed further in the case of negative elevation.
        // const minElevationInPixels = t.elevation ? t.elevation.getMinElevationBelowMSL() * pixelsPerMeter : 0;
        // const cameraToSeaLevelDistance = ((t._camera.position[2] * worldSize) - minElevationInPixels) / Math.cos(t._pitch);
        // const topHalfSurfaceDistance = Math.sin(fovAboveCenter) * cameraToSeaLevelDistance / Math.sin(utils.clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01));

        // // Calculate z distance of the farthest fragment that should be rendered.
        // furthestDistance = pitchAngle * topHalfSurfaceDistance + cameraToSeaLevelDistance;

        // // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
        // const horizonDistance = cameraToSeaLevelDistance * (1 / t._horizonShift);
        // farZ = Math.min(furthestDistance * 1.01, horizonDistance);
    } else {
        // mapbox version < 2.0 or azure maps
        // Furthest distance optimized by @jscastro76
        const topHalfSurfaceDistance = Math.sin(cameraSync.halfFov) * cameraSync.cameraToCenterDistance / Math.sin(Math.PI - groundAngle - cameraSync.halfFov);

        // Calculate z distance of the farthest fragment that should be rendered. 
        furthestDistance = pitchAngle * topHalfSurfaceDistance + cameraSync.cameraToCenterDistance;

        // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
        farZ = furthestDistance * 1.01;
    }
    const nz = (t.height / 50); //min near z as coded by @ansis
    const nearZ = Math.max(nz * pitchAngle, nz); //on changes in the pitch nz could be too low

    let x = t.pointMerc.x
    let y = t.pointMerc.y

    let centerX = (x - 0.5) * mercatorWorldSize;
    let centerY = (0.5 - y) * mercatorWorldSize;
    let centerP = new THREE.Vector3(centerX, centerY, 0);

    const _pitch = t._pitch;
    const _angle = t.angle;


    let pitchMatrix = new THREE.Matrix4().makeRotationX(_pitch);
    let angleMatrix = new THREE.Matrix4().makeRotationZ(_angle);

    let cameraViewMatrix1 = new THREE.Matrix4()
        .premultiply(pitchMatrix)
        .premultiply(angleMatrix);

    let cameraP = new THREE.Vector3(0, 0, 1).applyMatrix4(cameraViewMatrix1);
    cameraP.multiplyScalar(cameraToCenterDistance);
    cameraP.add(centerP);

    let upDir = new THREE.Vector3(0, 1, 0).applyMatrix4(angleMatrix);

    cameraSync.xCamera = {
        position: cameraP,
        center: centerP,
        up: upDir,
        fov,
        aspect: cameraAspect,
        nearZ: cameraToCenterDistance / 200,
        farZ: cameraToCenterDistance * 200 + 10000,
    }
}

// {
//     // Used used Matrix Rotation
//     const zFlipMatrix = new THREE.Matrix4().makeScale(1, 1, -1)
//     const rotationZ = new THREE.Matrix4().makeRotationZ(Math.PI)
//     const rotationX = new THREE.Matrix4().makeRotationX(Math.PI / 2)
//     const rotationMatrix = new THREE.Matrix4().multiplyMatrices(rotationX, rotationZ)
//     mvp.multiply(zFlipMatrix).multiply(rotationMatrix)
// }