import json
import os
import sys

from multiUtil import (
    computeLnIndex,
    computeSaIndex,
    computeZbIndex,
    getDeepestPointInfoOnSection,
    getSectionPointList,
    isSectionInArea,
)
from osgeo import gdal


def main(jsonPath: str, beforeDate: str):
    content: dict = {}
    # read json
    with open(jsonPath, "r", encoding="utf8") as file:
        content = json.load(file)
    scene: str = content.get("scene")  # type: ignore
    dataFolderPath: str = content.get("dataFolderPath")  # type: ignore
    currentDate: str = content.get("date")  # type: ignore
    vertex: tuple[tuple[float, float], tuple[float, float]] = [  # type: ignore
        tuple(point)
        for point in content.get("vertex")  # type: ignore
    ]
    isSectionWithInArea: tuple[bool, bool] = content.get("isSectionWithInArea")  # type: ignore

    # path
    depthCsvPath = os.path.join(dataFolderPath, "csv", f"{scene}-depth.csv")
    indexPath = os.path.join(dataFolderPath, "csv", f"{scene}-index.pkl")
    beforeDemPath = os.path.join(
        dataFolderPath, "raster", f"{scene}-{beforeDate.replace('-','')}.tif"
    )

    # section
    currentSectionPointsList: list = content.get("section")  # type: ignore
    currentSectionPoints: tuple = tuple(
        tuple(point) for point in currentSectionPointsList
    )
    beforeDataset: gdal.Dataset = gdal.Open(beforeDemPath)
    beforeSectionPoints = getSectionPointList(
        beforeDataset,
        float(vertex[0][0]),
        float(vertex[0][1]),
        float(vertex[1][0]),
        float(vertex[1][1]),
    )
    isAllInArea = isSectionInArea(
        beforeDataset,
        float(vertex[0][0]),
        float(vertex[0][1]),
        float(vertex[1][0]),
        float(vertex[1][1]),
    )
    isSectionWithInArea = (isSectionWithInArea[0], isAllInArea)

    # params
    currentPointCoord = [(point[0], point[1]) for point in currentSectionPoints]
    deepestPointInfo = getDeepestPointInfoOnSection(
        currentPointCoord, depthCsvPath, indexPath
    )

    # Zb
    ZBIndex = computeZbIndex(deepestPointInfo[1])
    # Sa
    SAIndex = computeSaIndex([point[2] for point in currentSectionPoints])
    # Ln
    LNIndex = None
    if not isSectionWithInArea[0] or (not isSectionWithInArea[1]):
        LNIndex = computeLnIndex([], currentDate, [], beforeDate)
    else:
        LNIndex = computeLnIndex(
            [point[2] for point in currentSectionPoints],
            currentDate,
            [point[2] for point in beforeSectionPoints],
            beforeDate,
        )

    # write json
    content["ZB"] = ZBIndex
    content["SA"] = SAIndex
    content["LN"] = LNIndex
    content["beforeSection"] = beforeSectionPoints
    content["isSectionWithInArea"] = isSectionWithInArea
    with open(jsonPath, "w", encoding="utf8") as f:
        json.dump(content, f, ensure_ascii=False)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("参数错误！")
    else:
        # json 路径, 对比年
        [jsonPath, beforeDate] = sys.argv[1:3]

        # test
        # D:\project\JS_Bank_Collapse\util\model\multi\test\result.json 2021-03-01
        main(jsonPath, beforeDate)
