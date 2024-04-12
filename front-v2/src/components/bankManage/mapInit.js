const mapInit = (map) => {
    map.addSource('mzsPlaceLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsPlaceLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsPlaceLineSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsPlaceLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsBankLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankLineSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsBankLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsSectionLineSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsSectionLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsSectionLineLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsSectionLineLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankAreaWSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsBankAreaW/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsBankAreaSSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/mzsBankAreaS/{x}/{y}/{z}',
        ],
    })

    map.addLayer({
        id: 'mzsLine',
        type: 'line',
        source: 'mzsPlaceLineSource',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(26, 87, 138, 0.6)',
            'line-width': 2,
        },
    })
    map.addLayer({
        id: 'mzsLabel',
        type: 'symbol',
        source: 'mzsPlaceLabelSource',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'left',
        },
        paint: {
            'text-color': 'rgba(31, 14, 126, 0.75)',
        },
    })
    map.addLayer({
        id: 'mzsSectionArea1',
        type: 'fill',
        source: 'mzsBankAreaSSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(233, 23, 86, 0.6)',
        },
    })
    map.addLayer({
        id: 'mzsSectionArea2',
        type: 'fill',
        source: 'mzsBankAreaWSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(233, 233, 86, 0.6)',
        },
    })
    map.addLayer({
        id: 'mzsBankLine',
        type: 'line',
        source: 'mzsBankLineSource',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(31, 14, 223, 0.75)',
            'line-width': 4,
        },
    })
    map.addLayer({
        id: 'mzsSectionLine',
        type: 'line',
        source: 'mzsSectionLineSource',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(11, 214, 223, 0.75)',
            'line-width': 4,
        },
    })
    map.addLayer({
        id: 'mzsBankLabel',
        type: 'symbol',
        source: 'mzsBankLabelSource',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'left',
        },
        paint: {
            'text-color': 'rgba(231, 214, 86, 0.9)',
        },
    })
    map.addLayer({
        id: 'mzsSectionLabel',
        type: 'symbol',
        source: 'mzsSectionLineLabelSource',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'bottom',
        },
        paint: {
            'text-color': 'rgba(81, 154, 86, 0.9)',
        },
    })
}

export { mapInit }
