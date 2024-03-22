import mapboxgl from "mapbox-gl";
import { useMapStore } from "../store/mapStore";

// window.addEventListener('keydown', (e) => {
//     if (e.key == 'Enter') {
//         console.log('center', map.getCenter());
//         console.log('bearing', map.getBearing());
//         console.log('Pitch', map.getPitch());
//         console.log('zoom', map.getZoom());
//     }
// })


const initMap = (ref) => {
    return new mapboxgl.Map({
        container: ref.value, // container ID
        accessToken: 'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 3, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })
}

const flytoLarge = (map) => {
    map.flyTo({
        center: [119.9617548378, 32.04382454852],
        // center:[-74.5447, 40.6892],
        pitch: 48.0432167520608,
        bearing: 0,
        zoom: 8.28560629149188,
        speed: 0.7,
        essential: true
    })
}
const flytoSmall = (map) => {
    map.flyTo({
        center: [120.53070965313992, 32.042615280683805],
        pitch: 61.99999999999988,
        bearing: 0,
        zoom: 13.245427972376211,
        speed: 0.7,
        essential: true

    })
}

const flytoFeature = (map, coord) => {
    map.flyTo({
        center: coord,
        pitch: 61.99999999999988,
        bearing: 0,
        zoom: 10,
        speed: 0.8,
        essential: true

    })
}

const loadImage = async (map, url, imageID) => {
    if (map.hasImage(imageID)) return
    return new Promise((resolve, reject) => {
        map.loadImage(url, (err, img) => {
            if (err) throw err;
            map.addImage(imageID, img)
            resolve()
        })
    })
}

const size = 80
const squareThreeDivideTwo = Math.sqrt(3) / 2.0;
const pulsing = {
    point: {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d', { willReadFrequently: true });
            this.context.canvas.willReadFrequently = true;
        },

        // Call once before every frame where the icon will be used.
        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            context.canvas.willReadFrequently = true;
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;
            context.canvas.willReadFrequently = true;

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            useMapStore().getMap().triggerRepaint();

            // Return `true` to let the map know that the image was updated.
            return true;
        }
    },
    rectangle: {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d', { willReadFrequently: true });
            this.context.canvas.willReadFrequently = true;
        },

        // Call once before every frame where the icon will be used.
        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const rectWidth = size * 0.3;
            const outerWidth = size * 0.7 * t + rectWidth;
            const context = this.context;

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.rect(
                (this.width - outerWidth) / 2,
                (this.height - outerWidth) / 2,
                outerWidth,
                outerWidth
            );
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.rect(
                (this.width - rectWidth) / 2,
                (this.height - rectWidth) / 2,
                rectWidth,
                rectWidth
            );
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            context.canvas.willReadFrequently = true;
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;
            context.canvas.willReadFrequently = true;

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            useMapStore().getMap().triggerRepaint();


            // Return `true` to let the map know that the image was updated.
            return true;
        }
    },
    triangle: {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d', { willReadFrequently: true });
            this.context.canvas.willReadFrequently = true;
        },

        // Call once before every frame where the icon will be used.
        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const rectWidth = size * 0.3;
            const outerWidth = size * 0.7 * t + rectWidth;
            const outerTriHeight = outerWidth * squareThreeDivideTwo;
            const triHeight = rectWidth * squareThreeDivideTwo;
            const context = this.context;
            const innerStartPoint = [(this.width - rectWidth) / 2, (this.height - rectWidth) / 2]
            const outerRectStartPoint = [(this.width - outerWidth) / 2, (this.height - outerWidth) / 2];
            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.moveTo(
                this.width / 2,
                (this.height - outerWidth) / 2
            );
            context.lineTo(
                outerRectStartPoint[0], outerRectStartPoint[1] + outerTriHeight
            );
            context.lineTo(
                outerRectStartPoint[0] + outerWidth, outerRectStartPoint[1] + outerTriHeight
            )
            context.closePath();
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.moveTo(
                this.width / 2,
                (this.height - rectWidth) / 2
            );
            context.lineTo(
                innerStartPoint[0], innerStartPoint[1] + triHeight
            );
            context.lineTo(
                innerStartPoint[0] + rectWidth, innerStartPoint[1] + triHeight
            )
            context.closePath();
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            context.canvas.willReadFrequently = true;
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;
            context.canvas.willReadFrequently = true;

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            useMapStore().getMap().triggerRepaint();


            // Return `true` to let the map know that the image was updated.
            return true;
        }
    },
    diamond: {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d', { willReadFrequently: true });
            this.context.canvas.willReadFrequently = true;
        },

        // Call once before every frame where the icon will be used.
        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const rectWidth = size * 0.3;
            const outerWidth = size * 0.7 * t + rectWidth;
            const context = this.context;
            const innerStartPoint = [(this.width - rectWidth) / 2, (this.height - rectWidth) / 2]
            const outerRectStartPoint = [(this.width - outerWidth) / 2, (this.height - outerWidth) / 2];
            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.moveTo(
                this.width / 2,
                (this.height - outerWidth) / 2
            );
            context.lineTo(
                outerRectStartPoint[0], this.width / 2
            );
            context.lineTo(
                this.width / 2, outerRectStartPoint[1] + outerWidth
            )
            context.lineTo(
                outerRectStartPoint[0] + outerWidth, this.width / 2
            )
            context.closePath();
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.moveTo(
                this.width / 2,
                (this.height - rectWidth) / 2
            );
            context.lineTo(
                innerStartPoint[0], this.width / 2
            );
            context.lineTo(
                this.width / 2, innerStartPoint[1] + rectWidth
            )
            context.lineTo(
                innerStartPoint[0] + rectWidth, this.width / 2
            )
            context.closePath();
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            context.canvas.willReadFrequently = true;
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;
            context.canvas.willReadFrequently = true;

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            useMapStore().getMap().triggerRepaint();


            // Return `true` to let the map know that the image was updated.
            return true;
        }
    }
}



export {
    initMap,
    flytoLarge,
    flytoSmall,
    flytoFeature,
    loadImage,
    pulsing
}