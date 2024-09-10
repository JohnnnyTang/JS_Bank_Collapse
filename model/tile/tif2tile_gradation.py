from osgeo import gdal, gdalconst
import numpy as np
import gdal2tiles
import sys

if __name__ == '__main__':
    print(sys.argv)
    tif_path = sys.argv[1]
    tiles_path = sys.argv[2]
    zoom = sys.argv[3]
    tilesize = sys.argv[4]

    color_tif_path = tif_path.replace('.tif','_colored.tif')

    # 打开TIF文件
    dataset = gdal.Open(tif_path, gdalconst.GA_ReadOnly)
    band = dataset.GetRasterBand(1)

    # 读取数据
    data = band.ReadAsArray()

    # 定义色阶和颜色
    color_map = {
        -60: {"line_color": (0, 100, 255), "fill_foreground": (0, 100, 255), "fill_background": (0, 0, 0)},
        -30: {"line_color": (0, 150, 255), "fill_foreground": (0, 150, 255), "fill_background": (0, 0, 0)},
        -20: {"line_color": (173, 216, 230), "fill_foreground": (173, 216, 230), "fill_background": (23, 23, 23)},
        -16: {"line_color": (135, 206, 235), "fill_foreground": (135, 206, 235), "fill_background": (52, 52, 52)},
        -15: {"line_color": (173, 216, 230), "fill_foreground": (173, 216, 230), "fill_background": (128, 128, 128)},
        -13.5: {"line_color": (255, 255, 255), "fill_foreground": (255, 255, 255), "fill_background": (104, 104, 104)},
        -13: {"line_color": (238, 221, 130), "fill_foreground": (238, 221, 130), "fill_background": (133, 133, 133)},
        -11: {"line_color": (230, 230, 128), "fill_foreground": (230, 230, 128), "fill_background": (153, 153, 153)},
        -10: {"line_color": (255, 215, 0), "fill_foreground": (255, 215, 0), "fill_background": (185, 185, 185)},
        -8: {"line_color": (63, 122, 58), "fill_foreground": (63, 122, 58), "fill_background": (208, 208, 208)},
        -5: {"line_color": (39, 199, 51), "fill_foreground": (39, 199, 51), "fill_background": (220, 220, 220)},
        -2: {"line_color": (120, 183, 102), "fill_foreground": (120, 183, 102), "fill_background": (102, 102, 102)},
        0: {"line_color": (39, 199, 51), "fill_foreground": (39, 199, 51), "fill_background": (51, 51, 51)}
    }

    # 排序色阶
    sorted_thresholds = sorted(color_map.keys())

    # 准备颜色插值函数
    def interpolate_color(val, thresholds, color_map):
        if val > max(thresholds):
            return (255, 255, 255)  # 大于最高色阶值的颜色设置为白色
        for i in range(len(thresholds) - 1):
            if thresholds[i] <= val < thresholds[i + 1]:
                t = (val - thresholds[i]) / (thresholds[i + 1] - thresholds[i])
                color1 = np.array(color_map[thresholds[i]]["fill_foreground"])
                color2 = np.array(color_map[thresholds[i + 1]]["fill_foreground"])
                return tuple((1 - t) * color1 + t * color2)
        return color_map[sorted_thresholds[0]]["fill_foreground"]

    # 生成彩色图像
    height, width = data.shape
    color_image = np.zeros((height, width, 3), dtype=np.uint8)

    for i in range(height):
        for j in range(width):
            value = data[i, j]
            color_image[i, j] = interpolate_color(value, sorted_thresholds, color_map)

    # 保存新的TIF文件
    driver = gdal.GetDriverByName('GTiff')
    out_dataset = driver.Create(color_tif_path, width, height, 3, gdalconst.GDT_Byte)
    out_dataset.SetGeoTransform(dataset.GetGeoTransform())
    out_dataset.SetProjection(dataset.GetProjection())

    # 写入每个颜色通道
    for i in range(3):
        out_band = out_dataset.GetRasterBand(i + 1)
        out_band.WriteArray(color_image[:, :, i])
        out_band.FlushCache()

    out_dataset = None

    gdal2tiles.generate_tiles(color_tif_path, tiles_path, zoom=zoom, tilesize=tilesize)
