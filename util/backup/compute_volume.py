import json
import sys

import numpy as np
from cv2 import cv2
from osgeo import gdal, ogr, osr


def execute(file_path):
    with open(file_path, 'r', encoding='utf8') as f:
        depth = float(f.readline().removesuffix('\n'))
        coords_num = int(f.readline().removesuffix('\n'))
        coords_geo = list()
        for i in range(coords_num):
            coords_geo.append(f.readline().removesuffix('\n').split(','))
        in_raster = f.readline().removesuffix('\n')
        result_path = f.readline().removesuffix('\n')
        visual_path = f.readline().removesuffix('\n')
        volume_path = f.readline().removesuffix('\n')
        output_coords = f.readline().removesuffix('\n')

    # 获取栅格图像各种元数据
    ds_raster: gdal.Dataset = gdal.Open(in_raster)
    prj = ds_raster.GetProjection()
    geo = ds_raster.GetGeoTransform()
    area = abs(geo[1] * geo[5])

    # 地理坐标转投影坐标
    prosrs: osr.SpatialReference = osr.SpatialReference()
    prosrs.ImportFromWkt(prj)
    geosrs: osr.SpatialReference = prosrs.CloneGeogCS()
    # 设置地图坐标策略
    prosrs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    geosrs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    ct: osr.CoordinateTransformation = osr.CoordinateTransformation(
        geosrs, prosrs)
    # 坐标转换
    coords_pro = list()
    for coords in coords_geo:
        coords_trans = ct.TransformPoint(
            float(coords[0]), float(coords[1]))
        coords_pro.append(coords_trans)
    coords_pro.append(coords_pro[0])
    ds_raster = prosrs = geosrs = coords_geo = ct = None

    # 根据坐标点建立掩膜 geometry
    ring: ogr.Geometry = ogr.Geometry(ogr.wkbLinearRing)
    for coords in coords_pro:
        ring.AddPoint(coords[0], coords[1])
    poly: ogr.Geometry = ogr.Geometry(ogr.wkbPolygon)
    poly.AddGeometry(ring)
    ring = coords = None

    # 根据掩膜 geometry 建立 shp 文件
    driver_shp: ogr.Driver = ogr.GetDriverByName('ESRI Shapefile')
    ds_shp: ogr.DataSource = driver_shp.CreateDataSource(
        "/vsimem/temp_shp.shp")
    srs: osr.SpatialReference = osr.SpatialReference()
    srs.ImportFromWkt(prj)
    layer: ogr.Layer = ds_shp.CreateLayer('polygon', srs, ogr.wkbPolygon)
    layer.CreateField(ogr.FieldDefn("ID", ogr.OFTString))
    defn: ogr.FeatureDefn = layer.GetLayerDefn()
    feature: ogr.Feature = ogr.Feature(defn)
    geom: ogr.Geometry = ogr.CreateGeometryFromWkt(poly.ExportToWkt())
    feature.SetGeometry(geom)
    layer.CreateFeature(feature)
    poly = driver_shp = ds_shp = srs = layer = defn = feature = geom = None

    # 根据 shp 文件裁剪栅格图像
    # 之前 ds 必须赋 None, 否则一直占用, 读不出来
    gdal.Warp('/vsimem/temp_tif.tif',
              in_raster,
              cutlineDSName="/vsimem/temp_shp.shp",
              cropToCutline=True,
              dstNodata=-9999,
              )

    # 读取栅格图像原始数据
    ds_raster: gdal.Dataset = gdal.Open('/vsimem/temp_tif.tif')
    band: gdal.Band = ds_raster.GetRasterBand(1)
    min = band.ComputeRasterMinMax()[0]
    max = band.ComputeRasterMinMax()[1]
    # 栅格图像输出为 numpy 数组
    tif_array: np.ndarray = band.ReadAsArray()
    # 提取符合条件的像素点
    tif_array_extract = np.where(
        (tif_array < -1 * depth) & (tif_array > -9999), tif_array, -9999)
    tif_array_calculate = np.where(
        (tif_array < -1 * depth) & (tif_array > -9999), (tif_array + depth) * area, 0)
    volume = tif_array_calculate.sum() * -1

    projection = ds_raster.GetProjection()
    transform = ds_raster.GetGeoTransform()
    ds_raster = None

    # 保存为tif
    driver = gdal.GetDriverByName('GTiff')
    new_dataset = driver.Create(
        result_path, tif_array_extract.shape[1], tif_array_extract.shape[0], 1, gdal.GDT_Float32)
    new_dataset.SetProjection(projection)
    new_dataset.SetGeoTransform(transform)
    new_band = new_dataset.GetRasterBand(1)
    new_band.WriteArray(tif_array_extract)

    new_band.SetNoDataValue(-9999)
    new_dataset = None

    # tif转png4通道
    gdal.Translate(visual_path,
                   result_path,
                   format='PNG',
                   outputType=gdal.GDT_Byte,
                   scaleParams=[[min, max, 1, 255]],
                   )
    img = cv2.imread(visual_path)
    img_color = cv2.applyColorMap(img, 9)
    alpha = np.ones(
        (img_color.shape[0], img_color.shape[1], 1), dtype=np.uint8) * 255
    img_rgba = np.concatenate((img_color, alpha), axis=2)
    mask = (img != 0)
    mask = mask.astype(np.uint8)
    mask_alpha = mask[:, :, 2].reshape(
        img_color.shape[0], img_color.shape[1], 1)
    mask_rgba = np.concatenate((mask, mask_alpha), axis=2)
    img_color = img_rgba * mask_rgba

    cv2.imwrite(visual_path, img_color)

    bound_coords_pro = get_bound_coords(result_path)
    bound_coords_geo = {}

    for key in bound_coords_pro:
        coord = bound_coords_pro[key]
        a = geo2lonlat(prj, coord[0], coord[1])
        bound_coords_geo[key] = a[::-1]

    bound_coords_geo['ur'] = [
        bound_coords_geo['lr'][0], bound_coords_geo['ul'][1]]
    bound_coords_geo['ll'] = [
        bound_coords_geo['ul'][0], bound_coords_geo['lr'][1]]

    volume_file = open(volume_path, 'w', encoding='utf8')
    volume_file.write(str(volume))
    volume_file.close()

    with open(output_coords, 'w') as file_obj:
        json.dump(bound_coords_geo, file_obj)


def get_bound_coords(output_tif: str) -> dict:
    list_coords = {}
    ds: gdal.Dataset = gdal.Open(output_tif)
    info = ds.GetGeoTransform()
    width = ds.RasterXSize
    height = ds.RasterYSize
    offset_width = width*info[1]
    offset_height = height*info[5]
    ul_coord = [info[0], info[3]]
    lr_coord = [info[0] + offset_width, info[3]+offset_height]
    list_coords = {'ul': [ul_coord[0], ul_coord[1]],
                   'lr': [lr_coord[0], lr_coord[1]], }

    return list_coords


def geo2lonlat(prj, x, y):
    prosrs = osr.SpatialReference()
    prosrs.ImportFromWkt(prj)
    geosrs = prosrs.CloneGeogCS()
    ct = osr.CoordinateTransformation(prosrs, geosrs)
    coords = ct.TransformPoint(x, y)
    return coords[:2]


if __name__ == '__main__':
    execute(sys.argv[1])
