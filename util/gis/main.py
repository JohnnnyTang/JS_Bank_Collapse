from rasterUtil import clipRasterByVector

# srs: osr.SpatialReference = osr.SpatialReference()
# srs.ImportFromEPSG(3857)

clipRasterByVector(
    r"D:\project\JS_Bank_Collapse\data\dem\199801_dem.tif",
    r"C:\Users\kxh\Documents\test.shp",
    r"D:\project\JS_Bank_Collapse\data\dem\199801_dem_clip.tif",
    -9999,
)
