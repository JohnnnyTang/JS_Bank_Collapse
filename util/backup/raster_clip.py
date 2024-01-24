from osgeo import ogr
from osgeo import osr
from osgeo import gdal
import os
import cv2
import numpy as np
import json
import sys


def get_raster_projection(input: str) -> str:
    ds = gdal.Open(input)
    prj = ds.GetProjection()
    ds = None

    return prj


def lonlat2geo(prj, lon, lat):
    prosrs = osr.SpatialReference()
    prosrs.ImportFromWkt(prj)
    geosrs = prosrs.CloneGeogCS()
    ct = osr.CoordinateTransformation(geosrs, prosrs)
    coords = ct.TransformPoint(lat, lon)
    return coords[:2]


def geo2lonlat(prj, x, y):
    prosrs = osr.SpatialReference()
    prosrs.ImportFromWkt(prj)
    geosrs = prosrs.CloneGeogCS()
    ct = osr.CoordinateTransformation(prosrs, geosrs)
    coords = ct.TransformPoint(x, y)
    return coords[:2]


def create_geometry(coords: list[list[int]]):
    ring = ogr.Geometry(ogr.wkbLinearRing)
    for coord in coords:
        ring.AddPoint(coord[0], coord[1])
    poly = ogr.Geometry(ogr.wkbPolygon)
    poly.AddGeometry(ring)

    return poly


def create_mask(poly, prj: str) -> None:
    driver = ogr.GetDriverByName('ESRI Shapefile')
    ds = driver.CreateDataSource('temporary_mask.shp')

    srs = osr.SpatialReference()
    srs.ImportFromWkt(prj)

    layer = ds.CreateLayer('polygon', srs, ogr.wkbPolygon)
    defn = layer.GetLayerDefn()
    feature = ogr.Feature(defn)
    geom = ogr.CreateGeometryFromWkt(poly.ExportToWkt())
    feature.SetGeometry(geom)
    layer.CreateFeature(feature)

    ds = layer = feature = geom = driver = None


def clip_and_to_png(input: str, output_tif: str) -> None:
    gdal.Warp(output_tif,
              input,
              format='GTiff',
              cutlineDSName='temporary_mask.shp',
              cropToCutline=True,
              dstNodata=0,
              )

    ds = gdal.Open(output_tif)
    band = ds.GetRasterBand(1)
    minmax = band.ComputeRasterMinMax()
    gdal.Translate('temporary_img.png',
                   output_tif,
                   format='PNG',
                   outputType=gdal.GDT_Byte,
                   scaleParams=[[minmax[0], minmax[1], 1, 255]],
                   )

    ds = None


def gray_to_pseudo_color(output: str) -> None:
    img = cv2.imread('temporary_img.png')
    img_color = cv2.applyColorMap(img, 9)
    alpha = np.ones(
        (img_color.shape[0], img_color.shape[1], 1), dtype=np.uint8)*255
    img_rgba = np.concatenate((img_color, alpha), axis=2)
    mask = (img != 0)
    mask = mask.astype(np.uint8)
    mask_alpha = mask[:, :, 2].reshape(
        img_color.shape[0], img_color.shape[1], 1)
    mask_rgba = np.concatenate((mask, mask_alpha), axis=2)
    img_color = img_rgba*mask_rgba

    cv2.imwrite(output, img_color)


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


def delete_temporary_files() -> None:
    driver = ogr.GetDriverByName('ESRI Shapefile')
    driver.DeleteDataSource('temporary_mask.shp')

    # os.remove('temporary_raster.tif')
    os.remove('temporary_img.png')
    os.remove('temporary_img.png.aux.xml')


if __name__ == '__main__':
    if(len(sys.argv) > 1):
        # 设置输出文件路径
        output_png = 'D:\\zhuomian\\output.png'
        output_coords = 'D:\\zhuomian\\output.json'
        input_raster = ''
        num = 0
        coords_geo = []
        coords_pro = []

        # 读文件
        with open(sys.argv[1]) as f:
            i = 0
            for content in f:
                i += 1
                content = content.rstrip('\n')
                if (i == 1):
                    input_raster = content
                elif i == 2:
                    output_png = content.rstrip('\n')
                elif i == 3:
                    output_coords = content.rstrip('\n')
                elif i == 4:
                    output_tif = content.rstrip('\n')
                elif i == 5:
                    num = int(content)
                elif i != 5:
                    coord = content.split(',')
                    coords_geo.append([float(coord[0]), float(coord[1])])

        # 转坐标
        prj = get_raster_projection(input_raster)
        for i in range(0, num):
            a = lonlat2geo(prj, coords_geo[i][0], coords_geo[i][1])
            coords_pro.append(a)

        # 乱七八糟的东西
        coords_close = coords_pro
        coords_close = coords_close.append(coords_pro[0])
        poly = create_geometry(coords_pro)
        create_mask(poly, prj)
        clip_and_to_png(input_raster, output_tif)
        gray_to_pseudo_color(output_png)
        bound_coords_pro = get_bound_coords(output_tif)
        delete_temporary_files()
        bound_coords_geo = {}

        # 转坐标
        for key in bound_coords_pro:
            coord = bound_coords_pro[key]
            a = geo2lonlat(prj, coord[0], coord[1])
            bound_coords_geo[key] = a[::-1]

        bound_coords_geo['ur'] = [
            bound_coords_geo['lr'][0], bound_coords_geo['ul'][1]]
        bound_coords_geo['ll'] = [
            bound_coords_geo['ul'][0], bound_coords_geo['lr'][1]]

        # 写文件
        with open(output_coords, 'w') as file_obj:
            json.dump(bound_coords_geo, file_obj)
