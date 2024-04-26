function convertToMercator(lonLat) {
    var D2R = Math.PI / 180,
        // 900913 properties
        A = 6378137.0,
        MAXEXTENT = 20037508.342789244

    // compensate longitudes passing the 180th meridian
    // from https://github.com/proj4js/proj4js/blob/master/lib/common/adjust_lon.js
    var adjusted =
        Math.abs(lonLat[0]) <= 180
            ? lonLat[0]
            : lonLat[0] - Math.sign(lonLat[0]) * 360
    var xy = [
        A * adjusted * D2R,
        A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lonLat[1] * D2R)),
    ]

    // if xy value is beyond maxextent (e.g. poles), return maxextent
    if (xy[0] > MAXEXTENT) xy[0] = MAXEXTENT
    if (xy[0] < -MAXEXTENT) xy[0] = -MAXEXTENT
    if (xy[1] > MAXEXTENT) xy[1] = MAXEXTENT
    if (xy[1] < -MAXEXTENT) xy[1] = -MAXEXTENT

    return xy
}

export {convertToMercator}
