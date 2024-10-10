import sys
import os
import shutil
from osgeo import ogr, osr, gdal
import geopandas as gpd
import pandas as pd

# 读取文本文件并创建矢量点数据
def create_vector_points(input_txt, output_shp):
    # 创建数据源
    driver = ogr.GetDriverByName('ESRI Shapefile')
    if os.path.exists(output_shp):
        driver.DeleteDataSource(output_shp)
    data_source = driver.CreateDataSource(output_shp)
    srs = osr.SpatialReference()
    srs.ImportFromEPSG(2437)
    layer = data_source.CreateLayer('points', srs, geom_type=ogr.wkbPoint)

    # 添加字段
    fd = ogr.FieldDefn('Z', ogr.OFTReal)
    layer.CreateField(fd)
    feature_def = layer.GetLayerDefn()

    # 读取文本文件
    with open(input_txt, 'r', encoding='utf-8-sig') as file:
        for line in file:
            parts = line.strip().split('\t')
            if len(parts) != 3:
                continue
            x, y, z = float(parts[0]), float(parts[1]), float(parts[2])
            point = ogr.Geometry(ogr.wkbPoint)
            point.AddPoint(x, y, z)
            feature = ogr.Feature(feature_def)
            feature.SetGeometry(point)
            feature.SetField('Z', z)
            layer.CreateFeature(feature)
            feature = None

    data_source = None
    print(f'矢量点数据已保存为: {output_shp}')


# 创建35m缓冲区
def make_points_buffer(input_shp, buffer_shp):
    dataSource = ogr.Open(input_shp)
    layer = dataSource.GetLayer()

    srs = osr.SpatialReference()
    srs.ImportFromEPSG(2437)

    # 创建输出文件
    driver = ogr.GetDriverByName('ESRI Shapefile')
    if driver is None:
        print('Driver not available.')
        sys.exit(1)

    # 创建输出Shapefile
    if os.path.exists(buffer_shp):
        driver.DeleteDataSource(buffer_shp)
    outDataSource = driver.CreateDataSource(buffer_shp)
    outLayer = outDataSource.CreateLayer('buffered_points', srs, geom_type=ogr.wkbPolygon)

    # 遍历所有要素，创建缓冲区并写入输出文件
    for feature in layer:
        geom = feature.GetGeometryRef()
        buffer = geom.Buffer(35)  # 创建35米的缓冲区
        newFeature = ogr.Feature(outLayer.GetLayerDefn())
        newFeature.SetGeometry(buffer)
        outLayer.CreateFeature(newFeature)

    # 清理
    outDataSource.Destroy()
    print(f'缓冲区数据已保存为: {buffer_shp}')


# 矢量叠置擦除
def overlay_erase(refShp, shpBeErased, output_shp):
    buffer_shape = gpd.read_file(refShp)

    points_shape = gpd.read_file(shpBeErased)

    points_within = gpd.sjoin(points_shape, buffer_shape, predicate='within')

    points_outside = points_shape[~points_shape.index.isin(points_within.index)]

    points_outside.to_file(output_shp)
    print('擦除后数据已保存为', output_shp)


# 不同尺度的测点合并
def merge_points():
    # vector to shp
    create_vector_points(input_txt, middle_small_shp)
    create_vector_points(input_big_txt, middle_big_shp)

    # buffer
    make_points_buffer(middle_small_shp, middle_small_buffer_shp)

    # erase
    overlay_erase(middle_small_buffer_shp, middle_big_shp, middle_big_erased_shp)

    # merge
    points1 = gpd.read_file(middle_big_erased_shp)
    points2 = gpd.read_file(middle_small_shp)

    merged_points = gpd.GeoDataFrame(pd.concat([points1, points2], ignore_index=True))
    merged_points['geometry'] = merged_points['geometry'].astype('geometry')
    merged_points = gpd.GeoDataFrame(merged_points, geometry='geometry')

    merged_points.to_file(middle_merged_shp)
    print('合并后点数据已保存为', middle_merged_shp)
    pass


# 进行插值生成地形tif
def interpolate_to_tif(input_shp, output_tif):
    # 设置GDAL Grid选项
    # invdist

    options = gdal.GridOptions(
        algorithm='invdist:power=7:smoothing=0.0:radius1=0.0:radius2=0.0:max_points=12:min_points=0:nodata=-9999',
        format='GTiff',
        outputType=gdal.GDT_Float32,
        zfield='Z'  # 假设Z是你的高程字段
    )
    gdal.Grid(destName=output_tif, srcDS=input_shp, options=options)

    print('tif文件已保存为', output_tif)


# 创建文件夹
def makeDir(folder_path):
    try:
        os.mkdir(folder_path)
        print(f"文件夹 {folder_path} 创建成功。")
    except FileExistsError:
        print(f"文件夹 {folder_path} 已经存在。")
    except Exception as e:
        print(f"创建文件夹时出错: {e}")

def delDir(folder_path):
    try:
        shutil.rmtree(folder_path)
        print(f"文件夹 {folder_path} 已被删除。")
    except Exception as e:
        print(f"删除文件夹时出错: {e}")


out_prefix = sys.argv[1]
middle_prefix = sys.argv[2]
in_prefix = sys.argv[3]
name = sys.argv[4]

if __name__ == "__main__":
    # 定义输入和输出文件路径
    # out_prefix = './output'
    # middle_prefix = './middle'
    # in_prefix = './source'

    # input ! ! !
    # input_txt = in_prefix + '/2019LocalPoints.txt' # local
    input_txt = in_prefix + os.sep + name + '.txt' # local
    input_big_txt = in_prefix + os.sep + '202304LargePoints.txt' # large

    # middle
    middle_small_shp = middle_prefix + os.sep + 'small.shp'
    middle_big_shp = middle_prefix + os.sep + 'big.shp'
    middle_small_buffer_shp = middle_prefix + os.sep + 'smallBuffer.shp'
    middle_big_erased_shp = middle_prefix + os.sep + 'erasedBig.shp'
    middle_merged_shp = middle_prefix + os.sep + 'mergedPoint.shp'

    # output ! ! !
    # output_tif = out_prefix + '/2019terrain.tif'
    output_tif = out_prefix + os.sep + name + '.tif'

    # init
    makeDir(middle_prefix)
    makeDir(out_prefix)

    # 1
    merge_points()

    # 2
    interpolate_to_tif(middle_merged_shp, output_tif)

    # 3
    delDir(middle_prefix)
