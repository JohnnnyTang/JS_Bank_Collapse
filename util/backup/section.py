import sys

import numpy as np
from osgeo import gdal, ogr, osr


def geo2imagexy(dataset, x, y):
    trans = dataset.GetGeoTransform()
    originX = trans[0]
    originY = trans[3]
    pixelWidth = trans[1]
    pixelHeight = trans[5]
    line = int((y - originY) / pixelHeight)
    column = int((x - originX) / pixelWidth)
    return (line, column)


def geo2lonlat(dataset, x, y):
    prosrs = osr.SpatialReference()
    prosrs.ImportFromWkt(dataset.GetProjection())
    geosrs = prosrs.CloneGeogCS()
    ct = osr.CoordinateTransformation(prosrs, geosrs)
    coords = ct.TransformPoint(x, y)
    return coords[:2]


def lonlat2geo(dataset, lon, lat):
    prosrs = osr.SpatialReference()
    prosrs.ImportFromWkt(dataset.GetProjection())
    geosrs = prosrs.CloneGeogCS()
    ct = osr.CoordinateTransformation(geosrs, prosrs)
    coords = ct.TransformPoint(lon, lat)
    return coords[:2]


def get_k(x1, y1, x2, y2):
    return (y2 - y1) / (x2 - x1)


def excute(dataset, lon1, lat1, lon2, lat2):
    max_col = dataset.RasterXSize
    max_row = dataset.RasterYSize

    x1 = lonlat2geo(dataset, lat1, lon1)[0]
    y1 = lonlat2geo(dataset, lat1, lon1)[1]
    x2 = lonlat2geo(dataset, lat2, lon2)[0]
    y2 = lonlat2geo(dataset, lat2, lon2)[1]

    row1 = geo2imagexy(dataset, x1, y1)[0]
    col1 = geo2imagexy(dataset, x1, y1)[1]
    row2 = geo2imagexy(dataset, x2, y2)[0]
    col2 = geo2imagexy(dataset, x2, y2)[1]
    result = []
    k = (row2 - row1) / (col2 - col1)
    b = row1 - k * col1
    if (abs(row2 - row1) <= abs(col2 - col1)):
        if col1 <= col2:
            for i in range(col1, col2 + 1):
                temp_row = round(k * i + b)
                if temp_row >= 0 and temp_row < max_row and i >= 0 and i < max_col:
                    result.append([temp_row, i])
                if k >= 0 and (i >= max_col or temp_row >= max_row):
                    break
                if k < 0 and (i > max_col or temp_row < 0):
                    break
        else:
            for i in range(col1, col2 - 1, -1):
                temp_row = round(k * i + b)
                if temp_row >= 0 and temp_row < max_row and i >= 0 and i < max_col:
                    result.append([temp_row, i])
                if k >= 0 and (i < 0 or temp_row < 0):
                    break
                if k < 0 and (i < 0 or temp_row >= max_row):
                    break
    else:
        if row1 <= row2:
            for i in range(row1, row2 + 1):
                temp_col = round((i - b) / k)
                if temp_col >= 0 and temp_col < max_col and i >= 0 and i < max_row:
                    result.append([i, temp_col])
                if k >= 0 and (i >= max_row or temp_col >= max_col):
                    break
                if k < 0 and (i > max_row or temp_col < 0):
                    break
        else:
            for i in range(row1, row2 - 1, -1):
                temp_col = round((i - b) / k)
                if temp_col >= 0 and temp_col < max_col and i >= 0 and i < max_row:
                    result.append([i, temp_col])
                if k > 0 and (i < 0 or temp_col < 0):
                    break
                if k < 0 and (i < 0 or temp_col >= max_col):
                    break
    # write_result(path, result, dataset)
    return result


def write_result(path, arr, dataset):
    band = dataset.GetRasterBand(1)
    dem_data = band.ReadAsArray(0, 0, dataset.RasterXSize, dataset.RasterYSize)
    file = open(path, 'w')
    for i in range(len(arr)):
        file.write(str(dem_data[arr[i][0]][arr[i][1]]) + '\n')
    file.close()


# dataset = gdal.Open("D:\\zhuomian\\水科院\\数据\\整合数据库\\地形\\1998\\199801_DEM\\199801_dem")
# print(dataset.RasterXSize)
# print(dataset.RasterYSize)
# band = dataset.GetRasterBand(1)
# dem_data = band.ReadAsArray(0, 0, dataset.RasterXSize, dataset.RasterYSize)
# dGeoTrans = dataset.GetGeoTransform()
# dTemp = dGeoTrans[1] * dGeoTrans[5] - dGeoTrans[2] * dGeoTrans[4]
# print(dataset.GetGeoTransform())
# print(dataset.GetProjectionRef())
# print(geo2lonlat(dataset, 504070.023333, 3551310.39884))
# print(geo2lonlat(dataset, 686790.023333, 3451710.39884))
# print(lonlat2geo(dataset, 32.08471730292341, 120.04311111723482))
# print(lonlat2geo(dataset, 31.171563732319527, 121.95913433421603))
# print(geo2imagexy(dataset, 503990.023333, 3551390.39884))
# print(geo2imagexy(dataset, 686790.023333, 3451710.39884))
#
# print(excute(dataset, 120.778145, 31.926967, 120.930625, 31.926967))
# del dataset
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('参数错误！')
    else:
        path = sys.argv[1]
        file = open(path, 'r')
        rasterPath = file.readline().strip('\n')
        resultPath = file.readline().strip('\n')
        number = int(file.readline().strip('\n'))
        point = []
        for i in range(number):
            temp = file.readline().strip('\n')
            point.append(temp.split(","))
        dataset = gdal.Open(rasterPath)
        result = []
        for i in range(number - 1):
            result.extend(excute(dataset, float(point[i][0]), float(
                point[i][1]), float(point[i + 1][0]), float(point[i + 1][1])))
        write_result(resultPath, result, dataset)
        del dataset

        # dataset = gdal.Open(sys.argv[1])
        # excute(dataset, float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]), sys.argv[6])
        # del dataset
