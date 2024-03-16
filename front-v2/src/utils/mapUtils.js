import mapboxgl from "mapbox-gl";

const initMap = async () => {
    return new Promise((res, rej) => {
        const map = new mapboxgl.Map({
            accessToken: 'pk.eyJ1IjoibnVqYWJlc2xvbyIsImEiOiJjbGp6Y3czZ2cwOXhvM3FtdDJ5ZXJmc3B4In0.5DCKDt0E2dFoiRhg3yWNRA',
            container: 'map',
            style: 'mapbox://styles/nujabesloo/cltspinee004601qsfbk3gxv0',
            center: [120.9, 31.6],
            zoom: 6
        })
        map.on('load',()=>{
            res(map)
        })
    })
}

export{
    initMap
}