import json
import os
import sys

from multiUtil import (
    computeLnIndex,
    computeSaIndex,
    computeZbIndex,
    getDeepestPointInfoOnSection,
    getSectionPointList,
)
from osgeo import gdal

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("参数错误！")
    else:
        # json 路径, 当前年, 对比年
        [jsonPath, currentYear, beforeYear] = sys.argv[1:4]

        content: dict = {}
        # read json
        with open(jsonPath, "r", encoding="utf8") as file:
            content = json.load(file)
        scene: str = content.get("scene")  # type: ignore
        dataFolderPath: str = content.get("dataFolderPath")  # type: ignore
        vertex: tuple[tuple[float, float], tuple[float, float]] = [  # type: ignore
            tuple(point)
            for point in content.get("vertex")  # type: ignore
        ]

        # path
        depthCsvPath = os.path.join(dataFolderPath, "csv", f"{scene}-depth.csv")
        indexPath = os.path.join(dataFolderPath, "csv", f"{scene}-index.pkl")
        beforeDemPath = os.path.join(
            dataFolderPath, "raster", f"{beforeYear}Before.tif"
        )
        currentDemPath = os.path.join(
            dataFolderPath, "raster", f"{currentYear}Before.tif"
        )

        # section
        currentDataset: gdal.Dataset = gdal.Open(currentDemPath)
        currentSectionPoints = getSectionPointList(
            currentDataset,
            float(vertex[0][0]),
            float(vertex[0][1]),
            float(vertex[1][0]),
            float(vertex[1][1]),
        )
        beforeDataset: gdal.Dataset = gdal.Open(beforeDemPath)
        beforeSectionPoints = getSectionPointList(
            beforeDataset,
            float(vertex[0][0]),
            float(vertex[0][1]),
            float(vertex[1][0]),
            float(vertex[1][1]),
        )

        # params
        currentPointCoord = [
            (point[0], point[1]) for point in currentSectionPoints
        ]
        deepestPointInfo = getDeepestPointInfoOnSection(
            currentPointCoord, depthCsvPath, indexPath
        )

        # Zb
        ZBIndex = computeZbIndex(deepestPointInfo[1])
        # Sa
        SAIndex = computeSaIndex([point[2] for point in currentSectionPoints])
        # Ln
        LNIndex = computeLnIndex(
            [point[2] for point in currentSectionPoints],
            int(currentYear),
            [point[2] for point in beforeSectionPoints],
            int(beforeYear),
        )

        # write json
        content["ZB"] = ZBIndex
        content["SA"] = SAIndex
        content["LN"] = LNIndex
        with open(jsonPath, "w", encoding="utf8") as f:
            json.dump(content, f, ensure_ascii=False)

        # test
        # D:\project\JS_Bank_Collapse\util\model\multi\test\result.json 2023 2021
