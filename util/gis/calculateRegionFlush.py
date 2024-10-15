from osgeo import gdal
from osgeo_utils import gdal_calc
from rasterUtil import clipRasterByVector, modifyRasterResolution


# 计算指定区域的冲於
def calculateRegionFlush(
    originDemPath: str,
    subtractedDemPath: str,
    regionShpPath: str,
    outputPath: str,
) -> None:
    # 裁剪指定区域
    clipRasterByVector(
        originDemPath, regionShpPath, "/vsimem/originDemClip.tif"
    )
    clipRasterByVector(
        subtractedDemPath, regionShpPath, "/vsimem/subtractedDemClip.tif"
    )
    # 调整分辨率
    originDemClip: gdal.Dataset = gdal.Open("/vsimem/originDemClip.tif")
    originDemClipBand: gdal.Band = originDemClip.GetRasterBand(1)
    xSize: int = originDemClipBand.XSize
    ySize: int = originDemClipBand.YSize
    modifyRasterResolution(
        r"/vsimem/subtractedDemClip.tif",
        r"/vsimem/subtractedDemAlign.tif",
        xSize,
        ySize,
    )
    # 冲於计算
    gdal_calc.Calc(
        calc="A-B",
        A="/vsimem/originDemClip.tif",
        B="/vsimem/subtractedDemAlign.tif",
        outfile=outputPath,
    )


if __name__ == "__main__":
    calculateRegionFlush(
        r"D:\project\JS_Bank_Collapse\data\dem\200408_dem.tif",
        r"D:\project\JS_Bank_Collapse\data\dem\199801_dem.tif",
        r"C:\Users\kxh\Documents\test.shp",
        r"D:\project\JS_Bank_Collapse\data\dem\flush.tif",
    )
