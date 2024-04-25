import json
import os
import sys

from multiUtil import getSectionPointList
from osgeo import gdal

if __name__ == "__main__":
    if len(sys.argv) != 10:
        print("参数错误！")
    else:
        [
            x1,  # 起点
            y1,
            x2,  # 终点
            y2,
            year,  # 年份
            tag,  # before or after
            scene,  # 场景, 目前恒为 sanshawan
            dataFolderPath,  # 数据文件夹
            dstPath,  # 输出 json 路径
        ] = sys.argv[1:9]

        tag = tag.capitalize()
        # section
        currentDemPath = os.path.join(
            dataFolderPath, "raster", f"{year}{tag}.tif"
        )
        currentDataset: gdal.Dataset = gdal.Open(currentDemPath)
        currentSectionPoints = getSectionPointList(
            currentDataset, float(x1), float(y1), float(x2), float(y2)
        )

        # write json
        content = {
            "year": year,
            "vertex": ((x1, y1), (x2, y2)),
            "scene": scene,
            "dataFolderPath": dataFolderPath,
            "section": currentSectionPoints,
        }
        with open(dstPath, "w", encoding="utf8") as f:
            json.dump(content, f)

        # test
        # 13415473 3768179 13415962 3767887 2023 after minzhusha D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
