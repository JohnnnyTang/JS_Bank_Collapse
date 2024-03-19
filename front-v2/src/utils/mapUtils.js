import mapboxgl from "mapbox-gl";

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

const flytoLarge = (map)=>{
    map.flyTo({
        center:[119.9617548378,32.04382454852],
        pitch: 48.0432167520608,
        bearing: 0,
        zoom: 8.28560629149188,
        speed: 0.7
    })
}
const flytoSmall = (map)=>{
    map.flyTo({
        center:[120.53070965313992,32.042615280683805],
        pitch:61.99999999999988,
        bearing:0,
        zoom:13.245427972376211,
        speed:0.7
    })
}


export {
    initMap,
    flytoLarge,
    flytoSmall
}