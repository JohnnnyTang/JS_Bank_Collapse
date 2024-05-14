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

    # write json
    content = {
        "date": date,
        "vertex": ((x1, y1), (x2, y2)),
        "scene": scene,
        "dataFolderPath": dataFolderPath,
        "section": currentSectionPoints,
        "isSectionWithInArea": [isAllInArea, True],
    }
    with open(dstPath, "w", encoding="utf8") as f:
        json.dump(content, f)


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
        # 13414573 3769008 13414748 3768302 20230901 minzhusha D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
        main(x1, y1, x2, y2, date, scene, dataFolderPath, dstPath)
