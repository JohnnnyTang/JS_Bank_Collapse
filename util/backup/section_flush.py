import sys

import section
import section_contrast
from osgeo import gdal

# def execute(benchmark, refer, points):
#     result1 = []
#     result2 = []
#     result = []
#     temp = []
#     dataset = gdal.Open(benchmark)
#     band = dataset.GetRasterBand(1)
#     dem_data = band.ReadAsArray(0, 0, dataset.RasterXSize, dataset.RasterYSize)
#     for i in range(len(points) - 1):
#         temp.extend(section.excute(dataset, float(points[i][0]), float(points[i][1]), float(points[i + 1][0]), float(points[i + 1][1])))
#     for i in range(len(temp)):
#         result1.append(dem_data[temp[i][0]][temp[i][1]])
#     del dataset
#     temp = []
#     dataset = gdal.Open(refer)
#     band = dataset.GetRasterBand(1)
#     dem_data = band.ReadAsArray(0, 0, dataset.RasterXSize, dataset.RasterYSize)
#     for i in range(len(points) - 1):
#         temp.extend(section.excute(dataset, float(points[i][0]), float(points[i][1]), float(points[i + 1][0]),
#                                    float(points[i + 1][1])))
#     for i in range(len(temp)):
#         result2.append(dem_data[temp[i][0]][temp[i][1]])
#     del dataset
#     len = len(result1) if len(result1) <= len(result2) else len(result2)
#     for i in range(len):
#         if result1[i] < -100 and result2[i] > -100:
#             result.append(result2[i])
#         elif result1[i] > -100 and result2[i] < -100:
#             result.append(result1[i])
#         else:
#             result.append(result1[i] - result2[i])
#     return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("参数错误")
    else:
        with open(sys.argv[1], encoding="utf-8") as file:
            benchmark_path = file.readline().strip("\n")
            refer_path = file.readline().strip("\n")
            raster_path = file.readline().strip("\n")
            result_path = file.readline().strip("\n")
            point_number = int(file.readline().strip("\n"))
            points = []
            for i in range(point_number):
                points.append(file.readline().strip("\n").split(","))
            file.close()

        raster_arr = [benchmark_path, refer_path]
        contrast_result = section_contrast.excute(raster_arr, points)

        dataset = gdal.Open(raster_path)
        band = dataset.GetRasterBand(1)
        dem_data = band.ReadAsArray(
            0, 0, dataset.RasterXSize, dataset.RasterYSize
        )
        flush_result = []
        for i in range(point_number - 1):
            flush_result.extend(
                section.excute(
                    dataset,
                    float(points[i][0]),
                    float(points[i][1]),
                    float(points[i + 1][0]),
                    float(points[i + 1][1]),
                )
            )

        with open(result_path, "w", encoding="utf-8") as file:
            for i in range(2):
                for j in range(len(contrast_result[i])):
                    file.write(str(contrast_result[i][j]) + "\n")
                file.write("\n")

            for i in range(len(flush_result)):
                file.write(
                    str(dem_data[flush_result[i][0]][flush_result[i][1]]) + "\n"
                )
            file.close()
        del dataset
