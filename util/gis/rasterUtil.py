from typing import Tuple

from osgeo import gdal, osr


# 获取栅格投影
def getRasterProjection(rasterPath: str) -> str:
    ds = gdal.Open(rasterPath)
    prj = ds.GetProjection()
    ds = None

    return prj


# 投影坐标转地理坐标
def lonLat2geo(prj, lon, lat):
    proSRS: osr.SpatialReference = osr.SpatialReference()
    proSRS.ImportFromWkt(prj)
    geoSRS = proSRS.CloneGeogCS()
    proSRS.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    geoSRS.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    ct: osr.CoordinateTransformation = osr.CoordinateTransformation(
        geoSRS, proSRS
    )
    coords: tuple = ct.TransformPoint(lon, lat)
    return coords[:2]


# 地理坐标转投影坐标
def geo2LonLat(prj, x, y):
    proSRS: osr.SpatialReference = osr.SpatialReference()
    proSRS.ImportFromWkt(prj)
    geoSRS = proSRS.CloneGeogCS()
    proSRS.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    geoSRS.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    ct: osr.CoordinateTransformation = osr.CoordinateTransformation(
        proSRS, geoSRS
    )
    coords: tuple = ct.TransformPoint(x, y)
    return coords[:2]


# 使用矢量裁剪栅格
def clipRasterByVector(
    rasterPath: str, vectorPath: str, outputPath: str, noData: int = -9999
) -> None:
    option = gdal.WarpOptions(
        format="GTiff",
        cutlineDSName=vectorPath,
        cropToCutline=True,
        dstNodata=noData,
    )

    gdal.Warp(outputPath, rasterPath, options=option)


# 单通道栅格转灰度图 png
def singleRasterToGrayScaleImage(rasterPath: str, outputPath: str) -> None:
    ds = gdal.Open(rasterPath)
    band = ds.GetRasterBand(1)
    minMax = band.ComputeRasterMinMax()

    option = gdal.TranslateOptions(
        format="PNG",
        outputType=gdal.GDT_Byte,
        scaleParams=[[minMax[0], minMax[1], 1, 255]],
        noData=0,
    )
    gdal.Translate(outputPath, rasterPath, options=option)
    ds = None


# 灰度图伪彩色合成
def grayScaleImagePseudoColorComposite() -> None:
    print("continuing")


# 获得栅格外接矩形
def getRasterBBox(rasterPath: str) -> Tuple[float, float, float, float]:
    ds: gdal.Dataset = gdal.Open(rasterPath)
    info = ds.GetGeoTransform()
    xSize: int = ds.RasterXSize
    ySize: int = ds.RasterYSize
    width: float = xSize * info[1]
    height: float = ySize * info[5]

    minX: float = info[0]
    minY: float = info[3]
    maxX: float = minX + width
    maxY: float = minY + height

    return [minX, minY, maxX, maxY]  # type: ignore


# 重投影栅格
def reprojectRaster(rasterPath: str, outputPath: str, targetSRS: str) -> None:
    option = gdal.TranslateOptions(outputSRS=targetSRS)
    gdal.Translate(outputPath, rasterPath, options=option)


# 修改栅格高度和宽度
def modifyRasterResolution(
    rasterPath: str, outputPath: str, width: int, height: int
) -> None:
    option = gdal.WarpOptions(format="GTiff", width=width, height=height)
    gdal.Warp(outputPath, rasterPath, options=option)
