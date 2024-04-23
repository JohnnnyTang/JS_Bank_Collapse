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
            x1,
            y1,
            x2,
            y2,
            currentYear,
            condition,
            scene,
            dataFolderPath,
            dstPath,
        ] = sys.argv[1:10]

        # section
        currentDemPath = os.path.join(
            dataFolderPath, "raster", f"{currentYear}Before.tif"
        )
        currentDataset: gdal.Dataset = gdal.Open(currentDemPath)
        currentSectionPoints = getSectionPointList(
            currentDataset, float(x1), float(y1), float(x2), float(y2)
        )

        # write json
        content = {
            "vertex": ((x1, y1), (x2, y2)),
            "currentYear": currentYear,
            "condition": condition,
            "scene": scene,
            "dataFolderPath": dataFolderPath,
            "section": currentSectionPoints,
        }
        with open(dstPath, "w", encoding="utf8") as f:
            json.dump(content, f)

        # test
        # 13415473 3768179 13415962 3767887 2023 dry minzhusha D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
