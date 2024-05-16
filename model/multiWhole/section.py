import json
import os
import sys

from multiUtil import getSectionPointList, isSectionInArea
from osgeo import gdal


def main(
    x1: str,
    y1: str,
    x2: str,
    y2: str,
    date: str,
    scene: str,
    dataFolderPath: str,
    dstPath: str,
):
    # section
    currentDemPath = os.path.join(
        dataFolderPath, "raster", f"{scene}-{date.replace('-','')}.tif"
    )
    currentDataset: gdal.Dataset = gdal.Open(currentDemPath)
    currentSectionPoints = getSectionPointList(
        currentDataset, float(x1), float(y1), float(x2), float(y2)
    )
    isAllInArea = isSectionInArea(
        currentDataset, float(x1), float(y1), float(x2), float(y2)
    )

    # no intersection entirely
    if not isAllInArea:
        content = {
            "date": date,
            "vertex": ((x1, y1), (x2, y2)),
            "scene": scene,
            "section": currentSectionPoints,
            "PQ": [[1, 0, 0, 0], "较低风险", 0],
            "KY": [[1, 0, 0, 0], "较低风险", 0],
            "ZD": [[1, 0, 0, 0], "较低风险", 0],
            "ZB": [[1, 0, 0, 0], "较低风险", 0],
            "SA": [[1, 0, 0, 0], "较低风险", 0],
            "LN": [[1, 0, 0, 0], "较低风险", 0],
            "risk": [[1, 0, 0, 0], "较低风险", 0],
        }
        with open(dstPath, "w", encoding="utf8") as f:
            json.dump(content, f, ensure_ascii=False)
        return False

    vertex0 = None
    vertex1 = None
    if currentSectionPoints[0][2] > currentSectionPoints[-1][2]:
        vertex0 = (x1, y1)
        vertex1 = (x2, y2)
    else:
        vertex0 = (x2, y2)
        vertex1 = (x1, y1)
        currentSectionPoints.reverse()

    # write json
    content = {
        "date": date,
        "vertex": (vertex0, vertex1),
        "scene": scene,
        "dataFolderPath": dataFolderPath,
        "section": currentSectionPoints,
        "isSectionWithInArea": [isAllInArea, True],
    }
    with open(dstPath, "w", encoding="utf8") as f:
        json.dump(content, f)

    return True


if __name__ == "__main__":
    if len(sys.argv) != 9:
        print("参数错误！")
    else:
        [
            x1,  # 起点
            y1,
            x2,  # 终点
            y2,
            date,  # 年份
            scene,  # 场景, 目前恒为 sanshawan
            dataFolderPath,  # 数据文件夹
            dstPath,  # 输出 json 路径
        ] = sys.argv[1:9]

        # test
        # 13417691 3767754 13417931 3767270 20230901 minzhusha D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
        # con
        # 13417931 3767270 13417691 3767754 20230901 minzhusha D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
        # -999
        # 13414573 3769008 13414748 3768302 20230901 minzhusha D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
        main(x1, y1, x2, y2, date, scene, dataFolderPath, dstPath)
