import json
import os
import sys

from multiUtil import (
    computeKYIndex,
    computePQIndex,
    computeZdIndex,
    getDeepestPointInfoOnSection,
    getLevelOfDeepestPointOnSection,
    getVelOfDeepestPointOnSection,
)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("参数错误！")
    else:
        [jsonPath] = sys.argv[1:2]

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

        # path
        depthCsvPath = os.path.join(dataFolderPath, "csv", f"{scene}-depth.csv")
        indexPath = os.path.join(dataFolderPath, "csv", f"{scene}-index.pkl")
        levelPath = os.path.join(
            dataFolderPath, "csv", f"{scene}-level-{condition}.csv"
        )
        velPath = os.path.join(
            dataFolderPath, "csv", f"{scene}-vel-{condition}.csv"
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

        # pq
        pqList = [0.8 for i in range(0, 34)]
        PQIndex = computePQIndex(int(currentYear), pqList)
        # ky
        KYIndex = computeKYIndex(vel)
        # Zd
        ZDIndex = computeZdIndex(level, deepestPointInfo[1], condition)

        # write json
        content["PQ"] = PQIndex
        content["KY"] = KYIndex
        content["ZD"] = ZDIndex
        with open(jsonPath, "w", encoding="utf8") as f:
            json.dump(content, f, ensure_ascii=False)

        # test
        # D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
