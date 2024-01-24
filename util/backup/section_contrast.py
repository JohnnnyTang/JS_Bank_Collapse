import sys

import section
from osgeo import gdal


def excute(raster_arr, points):
    result = []
    for i in range(len(raster_arr)):
        temp = []
        values_arr = []
        dataset = gdal.Open(raster_arr[i])
        band = dataset.GetRasterBand(1)
        dem_data = band.ReadAsArray(
            0, 0, dataset.RasterXSize, dataset.RasterYSize)
        for j in range(len(points) - 1):
            temp.extend(section.excute(dataset, float(points[j][0]), float(
                points[j][1]), float(points[j + 1][0]), float(points[j + 1][1])))
        for j in range(len(temp)):
            values_arr.append(dem_data[temp[j][0]][temp[j][1]])
        result.append(values_arr)
        del dataset
    return result


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('参数错误')
    else:
        with open(sys.argv[1], encoding='utf-8') as file:
            raster_number = int(file.readline().strip("\n"))
            raster_arr = []
            for i in range(raster_number):
                raster_arr.append(file.readline().strip("\n"))
            result_path = file.readline().strip("\n")
            point_number = int(file.readline().strip("\n"))
            points = []
            for i in range(point_number):
                points.append(file.readline().strip("\n").split(","))
            file.close()

        result = excute(raster_arr, points)

        with open(result_path, "w", encoding='utf-8') as file:
            file.write(str(raster_number) + "\n")
            for i in range(raster_number):
                for j in range(len(result[i])):
                    file.write(str(result[i][j]) + '\n')
                file.write('\n')
            file.close()

        # result = excute(float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]))
        # file = open(sys.argv[5], 'w')
        # file.write("3\n")
        # file.write('199801_dem 200408_dem 200602_dem\n')

    # raster = []
    # count = 6
    # while count < len(sys.argv):
    #     raster.append(sys.argv[count])
    # result = excute(float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), raster)
    # file = open(sys.argv[5], 'w')
    # file.write("3\n")
    # file.write('199801_dem 200408_dem 200602_dem\n')
    # for i in range(len(result)):
    #     print(i)
    #     for j in range(len(result[i])):
    #         file.write(str(result[i][j]) + '\n')
    #     file.write('\n')
    # file.close()

# result = excute(31.711050418040728, 121.07723289772088, 31.76011067544897, 121.2145782876791)
# print(len(result[2]))
