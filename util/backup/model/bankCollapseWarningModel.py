import numpy as np
import sys


def __matrixDot(matrix: list[list[float]], weight: list[float]) -> list[float]:
    dataMatrix = np.array(matrix)
    weightMatrix = np.array(weight)
    result = np.dot(weightMatrix, dataMatrix)
    return result


def __hydrodynamicMatrix(data: list[list[float]]) -> list[list[float]]:
    zeroMatrix = np.zeros((4, 4))
    xMove = [x[0] for x in data]
    yMove = [x[1] for x in data]
    zMove = [x[2] for x in data]
    mean = sum(xMove + yMove + zMove) / 3 * len(xMove)
    start = 2 if mean > data[0][0] else 0
    for row in zeroMatrix:
        row[np.random.randint(start, 4)] = 1
    return zeroMatrix.tolist()


def __riverBedMatrix(data: list[list[float]]):
    zeroMatrix = np.zeros((4, 4))
    x1 = [x[0] for x in data]
    y1 = [x[1] for x in data]
    x2 = [x[2] for x in data]
    y2 = [x[3] for x in data]
    mean = sum(x1 + x2 + y1 + y2) / 4 * len(x1)
    start = 2 if mean > data[0][0] else 0
    for row in zeroMatrix:
        row[np.random.randint(start, 4)] = 1
    return zeroMatrix.tolist()


def __bankSlopeMatrix(data: list[list[float]]):
    zeroMatrix = np.zeros((4, 4))
    pressure1 = [x[0] for x in data]
    pressure2 = [x[1] for x in data]
    pressure3 = [x[2] for x in data]
    pressure4 = [x[3] for x in data]
    pressure5 = [x[4] for x in data]
    pressure6 = [x[5] for x in data]
    mean = (
        sum(
            pressure1
            + pressure2
            + pressure3
            + pressure4
            + pressure5
            + pressure6
        )
        / 6
        * len(pressure1)
    )
    start = 2 if mean > data[0][0] else 0
    for row in zeroMatrix:
        row[np.random.randint(start, 4)] = 1
    return zeroMatrix.tolist()


def __humanActivityMatrix(data: list[list[float]]):
    zeroMatrix = np.zeros((3, 4))
    pressure1 = [x[0] for x in data]
    pressure2 = [x[1] for x in data]
    pressure3 = [x[2] for x in data]
    pressure4 = [x[3] for x in data]
    pressure5 = [x[4] for x in data]
    pressure6 = [x[5] for x in data]
    mean = (
        sum(
            pressure1
            + pressure2
            + pressure3
            + pressure4
            + pressure5
            + pressure6
        )
        / 6
        * len(pressure1)
    )
    start = 2 if mean > data[0][0] else 0
    for row in zeroMatrix:
        row[np.random.randint(start, 4)] = 1
    return zeroMatrix.tolist()


def getData(dataPath: str, weightPath: str) -> dict[str, dict[str, list]]:
    result = {}

    # read data file
    with open(dataPath, "r", encoding="utf8") as f:
        dataResult = {}
        # GNSS
        temp = []
        for row in f:
            if "x,y,z" in row:
                continue
            if "x1,y1" in row:
                break
            strList = row.removesuffix("\n").split(",")
            floatList = [float(x) for x in strList]
            temp.append(floatList)
        dataResult["gnss"] = temp

        # Inclinometer
        temp = []
        for row in f:
            if "pressure" in row:
                break
            strList = row.removesuffix("\n").split(",")
            floatList = [float(x) for x in strList]
            temp.append(floatList)
        dataResult["inclinometer"] = temp

        # manometer
        temp = []
        for row in f:
            if "horizontal_stress1" in row:
                break
            strList = row.removesuffix("\n").split(",")
            floatList = [float(x) for x in strList]
            temp.append(floatList)
        dataResult["manometer"] = temp

        # manometer
        temp = []
        for row in f:
            strList = row.removesuffix("\n").split(",")
            floatList = [float(x) for x in strList]
            temp.append(floatList)
        dataResult["stresspile"] = temp

        result["data"] = dataResult

    # read weight file
    with open(weightPath, "r", encoding="utf8") as f:
        weightResult = {}
        # main
        strList = f.readline().removesuffix("\n").split(",")
        floatList = [float(x) for x in strList]
        weightResult["main"] = floatList
        # hydrodynamic
        strList = f.readline().removesuffix("\n").split(",")
        floatList = [float(x) for x in strList]
        weightResult["hydrodynamic"] = floatList
        # riverBed
        strList = f.readline().removesuffix("\n").split(",")
        floatList = [float(x) for x in strList]
        weightResult["riverBed"] = floatList
        # bankSlope
        strList = f.readline().removesuffix("\n").split(",")
        floatList = [float(x) for x in strList]
        weightResult["bankSlope"] = floatList
        # humanActivity
        strList = f.readline().removesuffix("\n").split(",")
        floatList = [float(x) for x in strList]
        weightResult["humanActivity"] = floatList

        result["weight"] = weightResult

    return result


if __name__ == "__main__":
    if sys.argv[1]:
        argv = sys.argv
        dataPath = argv[1]
        weightPath = argv[2]
    #     outputPath = argv[3]

    # dataPath = r"D:\project\JS_Bank_Collapse\util\model\data.csv"
    # weightPath = r"D:\project\JS_Bank_Collapse\util\model\weight.csv"
    # outputPath = r"D:\project\JS_Bank_Collapse\util\model\output.csv"

    modelData = getData(dataPath, weightPath)

    hydrodynamicMatrix = __hydrodynamicMatrix(modelData["data"]["gnss"])
    riverBedMatrix = __riverBedMatrix(modelData["data"]["inclinometer"])
    bankSlopeMatrix = __bankSlopeMatrix(modelData["data"]["manometer"])
    humanActivityMatrix = __humanActivityMatrix(modelData["data"]["stresspile"])

    row0 = __matrixDot(hydrodynamicMatrix, modelData["weight"]["hydrodynamic"])
    row1 = __matrixDot(riverBedMatrix, modelData["weight"]["riverBed"])
    row2 = __matrixDot(bankSlopeMatrix, modelData["weight"]["bankSlope"])
    row3 = __matrixDot(
        humanActivityMatrix, modelData["weight"]["humanActivity"]
    )
    result = __matrixDot([row0, row1, row2, row3], modelData["weight"]["main"])

    print(",".join([str(i) for i in result]))

    # with open(outputPath, "w", encoding="utf8") as f:
    #     f.writelines(",".join([str(i) for i in result]))

    # python D:\project\JS_Bank_Collapse\util\model\bankCollapseWarningModel.py D:\project\JS_Bank_Collapse\util\model\data.csv D:\project\JS_Bank_Collapse\util\model\weight.csv D:\project\JS_Bank_Collapse\util\model\output.csv
