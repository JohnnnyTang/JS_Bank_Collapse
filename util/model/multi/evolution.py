import json
import os
import sys

from multiUtil import (computeLnIndex, computeSaIndex, computeZbIndex,
                       getDeepestPointInfoOnSection,
                       getLevelOfDeepestPointOnSection, getSectionPointList,
                       getVelOfDeepestPointOnSection)
from osgeo import gdal

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("参数错误！")
    else:
        [jsonPath, beforeYear] = sys.argv[1:3]

        content: dict = {}
        # read json
        with open(jsonPath, "r", encoding="utf8") as file:
            content = json.load(file)
        currentYear: str = content.get("currentYear")  # type: ignore
        condition: str = content.get("condition")  # type: ignore
        scene: str = content.get("scene")  # type: ignore
        dataFolderPath: str = content.get("dataFolderPath")  # type: ignore
        currentSectionPoints: list[tuple[float, float, float]] = [  # type: ignore
            tuple(point)
            for point in content.get("section")  # type: ignore
        ]
        vertex: tuple[tuple[float, float], tuple[float, float]] = [  # type: ignore
            tuple(point)
            for point in content.get("vertex")  # type: ignore
        ]

        # path
        depthCsvPath = os.path.join(dataFolderPath, "csv", f"{scene}-depth.csv")
        indexPath = os.path.join(dataFolderPath, "csv", f"{scene}-index.pkl")
        levelPath = os.path.join(
            dataFolderPath, "csv", f"{scene}-level-{condition}.csv"
        )
        velPath = os.path.join(
            dataFolderPath, "csv", f"{scene}-vel-{condition}.csv"
        )
        beforeDemPath = os.path.join(
            dataFolderPath, "raster", f"{beforeYear}Before.tif"
        )

        # point
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
        vel = getVelOfDeepestPointOnSection(
            deepestPointInfo[0],
            velPath,
        )
        level = getLevelOfDeepestPointOnSection(
            deepestPointInfo[0],
            levelPath,
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
        # D:\project\JS_Bank_Collapse\util\model\multi\test\result.json 2021
