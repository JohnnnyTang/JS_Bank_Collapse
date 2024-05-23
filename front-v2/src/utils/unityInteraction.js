// import bank3dTest from '../components/bankTwin/bank3dTest.vue'
// import { ref, createApp } from 'vue'

// const app = createApp(bank3dTest)

const infoBoxDiv = document.createElement('div')
infoBoxDiv.style.backgroundColor = 'red'
infoBoxDiv.style.pointerEvents = 'none'
infoBoxDiv.style.position = 'absolute'
infoBoxDiv.style.textAlign = 'center'
infoBoxDiv.style.lineHeight = '50px'
infoBoxDiv.style.fontSize = '20px'
infoBoxDiv.style.display = 'none'
infoBoxDiv.style.zIndex = '1000'
infoBoxDiv.style.height = '50px'
infoBoxDiv.style.opacity = '0.8'
infoBoxDiv.style.color = 'white'
infoBoxDiv.style.width = '50px'
infoBoxDiv.id = 'DeviceInfoBox'
document.body.appendChild(infoBoxDiv)

// app.mount(infoBoxDiv)

// pickedObject = {

//   /** @type { string } */ _name: '',

//   /** @type { number[] } */ _position: [0.0, 0.0],

//   /** @type { number[] } */ boxSize: [150.0, 150.0],

//   /** @type { HTMLDivElement } */ infoBox: infoBoxDiv,

//   /** @type { number } */ pixelRation: window.devicePixelRatio,

//   /**
//    * @param { string } nameStr
//    */
//   set name(nameStr) {

//     pickedObject.infoBox.innerHTML = nameStr

//     this._name = nameStr
//   },

//   get name() {

//     return this._name
//   },

//   /**
//   * @param { number[] } xy
//   */
//   set position(xy) {

//     const [x, y] = xy

//     if (x === -1 && y === -1) {

//       this.infoBox.style.display = 'none'

//     } else {

//       this.infoBox.style.display = 'block'
//       this.infoBox.style.bottom = `${y / this.pixelRation}px`
//       this.infoBox.style.left = `${x / this.pixelRation - this.boxSize[0] / 2}px`

//     }

//     this._position = xy
//   },

//   get position() {

//     return this._position
//   },
// }

// // function consoleLogMessageFromUnity(message) {

// //   console.log("Received message from Unity:", message);
// // }

// // function pickUp(name) {

// //   pickedObject.name = name
// //   pickedObject.infoBox.style.width = `${pickedObject.boxSize[0]}px`
// //   pickedObject.infoBox.style.height = `${pickedObject.boxSize[1]}px`
// // }

// // function pickScreenPos(x, y) {

// //   pickedObject.position = [x, y]
// // }
