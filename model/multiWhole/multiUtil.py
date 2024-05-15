import math
import pickle

import numpy as np
from osgeo import gdal, osr
from scipy.spatial import cKDTree


def lnglat2xy(
    lnglat: tuple[float, float], srcSrs: int, dstSrs: int
) -> tuple[float, float]:
    src: osr.SpatialReference = osr.SpatialReference()
    src.ImportFromEPSG(srcSrs)
    src.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    dst: osr.SpatialReference = osr.SpatialReference()
    dst.ImportFromEPSG(dstSrs)
    dst.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)

    ct: osr.CoordinateTransformation = osr.CoordinateTransformation(src, dst)
    transform = ct.TransformPoint(lnglat[0], lnglat[1])
    return transform


def geo2imagexy(dataset: gdal.Dataset, x: float, y: float):
    trans = dataset.GetGeoTransform()
    originX = trans[0]
    originY = trans[3]
    pixelWidth = trans[1]
    pixelHeight = trans[5]
    line = int((y - originY) / pixelHeight)
    column = int((x - originX) / pixelWidth)
    return (line, column)


def imagexy2geo(dataset: gdal.Dataset, row: float, column: float):
    trans = dataset.GetGeoTransform()
    originX = trans[0]
    originY = trans[3]
    pixelWidth = trans[1]
    pixelHeight = trans[5]
    x = pixelWidth * column + originX
    y = pixelHeight * row + originY
    return (x, y)


def isSectionInArea(
    dataset: gdal.Dataset, x1: float, y1: float, x2: float, y2: float
) -> bool:
    tag = True
    max_col = dataset.RasterXSize
    max_row = dataset.RasterYSize

    row1 = geo2imagexy(dataset, x1, y1)[0]
    col1 = geo2imagexy(dataset, x1, y1)[1]
    row2 = geo2imagexy(dataset, x2, y2)[0]
    col2 = geo2imagexy(dataset, x2, y2)[1]
    if row1 < 0 or col1 < 0 or row2 < 0 or col2 < 0:
        tag = False
    if row1 >= max_row or col1 >= max_col or row2 >= max_row or col2 >= max_col:
        tag = False

    if tag:
        k = (row2 - row1) / (col2 - col1)
        b = row1 - k * col1
        if abs(row2 - row1) <= abs(col2 - col1):
            if col1 <= col2:
                for i in range(col1, col2 + 1):
                    temp_row = round(k * i + b)

                    if (
                        temp_row >= 0
                        and temp_row < max_row
                        and i >= 0
                        and i < max_col
                    ):
                        band: gdal.Band = dataset.GetRasterBand(1)
                        array = band.ReadAsArray(i, temp_row, 1, 1)
                        if array:
                            value: float = float(array[0, 0])
                            if value < -233:
                                tag = False
                        else:
                            tag = False
                    if k >= 0 and (i >= max_col or temp_row >= max_row):
                        break
                    if k < 0 and (i > max_col or temp_row < 0):
                        break
            else:
                for i in range(col1, col2 - 1, -1):
                    temp_row = round(k * i + b)
                    if (
                        temp_row >= 0
                        and temp_row < max_row
                        and i >= 0
                        and i < max_col
                    ):
                        band: gdal.Band = dataset.GetRasterBand(1)
                        array = band.ReadAsArray(i, temp_row, 1, 1)
                        if array:
                            value: float = float(array[0, 0])
                            if value < -233:
                                tag = False
                        else:
                            tag = False
                    if k >= 0 and (i < 0 or temp_row < 0):
                        break
                    if k < 0 and (i < 0 or temp_row >= max_row):
                        break
        else:
            if row1 <= row2:
                for i in range(row1, row2 + 1):
                    temp_col = round((i - b) / k)
                    if (
                        temp_col >= 0
                        and temp_col < max_col
                        and i >= 0
                        and i < max_row
                    ):
                        band: gdal.Band = dataset.GetRasterBand(1)
                        array = band.ReadAsArray(temp_col, i, 1, 1)
                        if array:
                            value: float = float(array[0, 0])
                            if value < -233:
                                tag = False
                        else:
                            tag = False
                    if k >= 0 and (i >= max_row or temp_col >= max_col):
                        break
                    if k < 0 and (i > max_row or temp_col < 0):
                        break
            else:
                for i in range(row1, row2 - 1, -1):
                    temp_col = round((i - b) / k)
                    if (
                        temp_col >= 0
                        and temp_col < max_col
                        and i >= 0
                        and i < max_row
                    ):
                        band: gdal.Band = dataset.GetRasterBand(1)
                        array = band.ReadAsArray(temp_col, i, 1, 1)
                        if array:
                            value: float = float(array[0, 0])
                            if value < -233:
                                tag = False
                        else:
                            tag = False
                    if k > 0 and (i < 0 or temp_col < 0):
                        break
                    if k < 0 and (i < 0 or temp_col >= max_col):
                        break

    return tag


def getSectionPointList(
    dataset: gdal.Dataset, x1: float, y1: float, x2: float, y2: float
) -> list[tuple[float, float, float]]:
    max_col = dataset.RasterXSize
    max_row = dataset.RasterYSize
    row1 = geo2imagexy(dataset, x1, y1)[0]
    col1 = geo2imagexy(dataset, x1, y1)[1]
    row2 = geo2imagexy(dataset, x2, y2)[0]
    col2 = geo2imagexy(dataset, x2, y2)[1]
    print(row1)
    print(row2)
    print(col1)
    print(col2)

    result: list[tuple[float, float, float]] = []
    k = (row2 - row1) / (col2 - col1)
    b = row1 - k * col1
    if abs(row2 - row1) <= abs(col2 - col1):
        if col1 <= col2:
            for i in range(col1, col2 + 1):
                temp_row = round(k * i + b)

                if (
                    temp_row >= 0
                    and temp_row < max_row
                    and i >= 0
                    and i < max_col
                ):
                    band: gdal.Band = dataset.GetRasterBand(1)
                    array = band.ReadAsArray(i, temp_row, 1, 1)
                    if array:
                        coord = imagexy2geo(dataset, temp_row, i)
                        value: float = float(array[0, 0])
                        result.append((coord[0], coord[1], value))
                if k >= 0 and (i >= max_col or temp_row >= max_row):
                    break
                if k < 0 and (i > max_col or temp_row < 0):
                    break
        else:
            for i in range(col1, col2 - 1, -1):
                temp_row = round(k * i + b)
                if (
                    temp_row >= 0
                    and temp_row < max_row
                    and i >= 0
                    and i < max_col
                ):
                    band: gdal.Band = dataset.GetRasterBand(1)
                    array = band.ReadAsArray(i, temp_row, 1, 1)
                    if array:
                        coord = imagexy2geo(dataset, temp_row, i)
                        value: float = float(array[0, 0])
                        result.append((coord[0], coord[1], value))
                if k >= 0 and (i < 0 or temp_row < 0):
                    break
                if k < 0 and (i < 0 or temp_row >= max_row):
                    break
    else:
        if row1 <= row2:
            for i in range(row1, row2 + 1):
                temp_col = round((i - b) / k)
                if (
                    temp_col >= 0
                    and temp_col < max_col
                    and i >= 0
                    and i < max_row
                ):
                    band: gdal.Band = dataset.GetRasterBand(1)
                    array = band.ReadAsArray(temp_col, i, 1, 1)
                    if array:
                        coord = imagexy2geo(dataset, i, temp_col)
                        value: float = float(array[0, 0])
                        result.append((coord[0], coord[1], value))
                if k >= 0 and (i >= max_row or temp_col >= max_col):
                    break
                if k < 0 and (i > max_row or temp_col < 0):
                    break
        else:
            for i in range(row1, row2 - 1, -1):
                temp_col = round((i - b) / k)
                if (
                    temp_col >= 0
                    and temp_col < max_col
                    and i >= 0
                    and i < max_row
                ):
                    band: gdal.Band = dataset.GetRasterBand(1)
                    array = band.ReadAsArray(temp_col, i, 1, 1)
                    if array:
                        coord = imagexy2geo(dataset, i, temp_col)
                        value: float = float(array[0, 0])
                        result.append((coord[0], coord[1], value))
                if k > 0 and (i < 0 or temp_col < 0):
                    break
                if k < 0 and (i < 0 or temp_col >= max_col):
                    break

    return result


def readValueCSVFile(filePath: str) -> list:
    valFile = open(filePath, "r")
    valList = []
    next(valFile)
    for line in valFile:
        content = line.strip("\n").split(",")
        vel = tuple(map(float, content))
        valList.append(vel)
    return valList


def generateSpatialIndex(points: list[tuple[float, float]], dstPath: str):
    tree = cKDTree(points)
    with open(dstPath, "wb") as f:
        pickle.dump(tree, f)


def getIndexOfNearestPoint(x: float, y: float, indexPath: str):
    with open(indexPath, "rb") as f:
        tree = pickle.load(f)
        _, indices = tree.query([x, y], k=1)
        return indices


# [index, depth, coord]
def getDeepestPointInfoOnSection(
    rasterValueList: list[tuple[float, float]],
    depthCsvPath: str,
    spatialIndexPath: str,
) -> tuple[int, float, tuple[float, float]]:
    maxDepth = -9999
    maxPoint = (0, 0)
    index = 0
    depthList: list[tuple[float, float, float]] = readValueCSVFile(depthCsvPath)
    for rasterValue in rasterValueList:
        index = getIndexOfNearestPoint(
            rasterValue[0], rasterValue[1], spatialIndexPath
        )
        depth = depthList[index][2]
        if depth > maxDepth:
            maxDepth = depth
            maxPoint = rasterValue[0:2]

    return (index, maxDepth, maxPoint)


def getVelOfDeepestPointOnSection(
    index: int,
    velPath: str,
) -> float:
    velList: list[tuple[float, float, float]] = readValueCSVFile(velPath)
    vel = velList[index][2]
    return vel


def getLevelOfDeepestPointOnSection(
    index: int,
    levelPath: str,
) -> float:
    levelList: list[tuple[float, float, float]] = readValueCSVFile(levelPath)
    level = levelList[index][2]
    return level


def getSectionPointListUnderWater(points: list[tuple[float, float, float]]):
    out: list = []
    for point in points:
        if point[2] < 0.0:
            out.append(point)

    return point


def computePQIndex(
    year: int, pqList: list[float]
) -> tuple[tuple[int, int, int, int], str, float]:
    index = year - 1990
    matrix: tuple[int, int, int, int] = (0, 0, 0, 0)
    message: str = ""
    if pqList[index] < 0.5:
        matrix = (1, 0, 0, 0)
        message = "较低风险"
    elif pqList[index] < 1:
        matrix = (0, 1, 0, 0)
        message = "低风险"
    elif pqList[index] < 2.3:
        matrix = (0, 0, 1, 0)
        message = "高风险"
    else:
        matrix = (0, 0, 0, 1)
        message = "较高风险"

    return (matrix, message, pqList[index])


def computeKYIndex(vel: float) -> tuple[tuple[int, int, int, int], str, float]:
    ky = 2.4231 * math.exp(-0.547 * vel)
    matrix: tuple[int, int, int, int] = (0, 0, 0, 0)
    message: str = ""

    if ky > 1.7:
        matrix = (1, 0, 0, 0)
        message = "较低风险"
    elif ky > 1.3:
        matrix = (0, 1, 0, 0)
        message = "低风险"
    elif ky > 1:
        matrix = (0, 0, 1, 0)
        message = "高风险"
    else:
        matrix = (0, 0, 0, 1)
        message = "较高风险"

    return (matrix, message, ky)


# 3. Zd
def computeZdIndex(
    level: float, depth: float, condition: str
) -> tuple[tuple[int, int, int, int], str, float]:
    Zd: float = 0.0
    if condition == "flood":
        Zd = 0.14 + level / depth
    if condition == "dry":
        Zd = 0.2 + level / depth

    matrix: tuple[int, int, int, int] = (0, 0, 0, 0)
    message: str = ""

    if Zd < 0.1:
        matrix = (1, 0, 0, 0)
        message = "较低风险"
    elif Zd < 0.15:
        matrix = (0, 1, 0, 0)
        message = "低风险"
    elif Zd < 0.3:
        matrix = (0, 0, 1, 0)
        message = "高风险"
    else:
        matrix = (0, 0, 0, 1)
        message = "较高风险"

    return (matrix, message, Zd)


# 4. Zb
def computeZbIndex(
    depth: float,
) -> tuple[tuple[int, int, int, int], str, float]:
    depth = abs(depth)
    matrix: tuple[int, int, int, int] = (0, 0, 0, 0)
    message: str = ""

    if depth < 20.0:
        matrix = (1, 0, 0, 0)
        message = "较低风险"
    elif depth < 30.0:
        matrix = (0, 1, 0, 0)
        message = "低风险"
    elif depth < 40.0:
        matrix = (0, 0, 1, 0)
        message = "高风险"
    else:
        matrix = (0, 0, 0, 1)
        message = "较高风险"

    return (matrix, message, depth)


# 5. Sa
def computeSaIndex(
    Z: list[float],
) -> tuple[tuple[int, int, int, int], str, list[float]]:
    totalNum: int = len(Z)
    selectedLSet: list = []
    selectedZSet: list = []

    for i in range(0, totalNum, 10):
        selectedLSet.append(i)
        selectedZSet.append(Z[i])
    selectedLSet.append(totalNum - 1)
    selectedZSet.append(Z[totalNum - 1])

    Sa: list = [0.0 for i in range(len(selectedZSet) - 1)]

    for index in range(1, len(selectedZSet)):
        Sa[index - 1] = (selectedZSet[index] - selectedZSet[index - 1]) / (
            5.0 * (selectedLSet[index] - selectedLSet[index - 1])
        )
    maxSa: float = max(Sa)

    matrix: tuple[int, int, int, int] = (0, 0, 0, 0)
    message: str = ""

    if maxSa < 0.2:
        matrix = (1, 0, 0, 0)
        message = "较低风险"
    elif maxSa < 0.33:
        matrix = (0, 1, 0, 0)
        message = "低风险"
    elif maxSa < 0.5:
        matrix = (0, 0, 1, 0)
        message = "高风险"
    else:
        matrix = (0, 0, 0, 1)
        message = "较高风险"

    return (matrix, message, Sa)


# 6. Ln
def computeLnIndex(
    ZNow: list[float], currentDate: str, ZBefore: list[float], beforeDate: str
) -> tuple[tuple[int, int, int, int], str, float]:
    totalNum: int = min(len(ZNow), len(ZBefore))
    LnList: list = []

    for i in range(totalNum):
        tLn = ZNow[i] - ZBefore[i]
        if tLn < 0:
            LnList.append(tLn)
    if len(LnList) == 0:
        return ((1, 0, 0, 0), "较低风险", 0)

    [currentYear, currentMonth, currentDay] = currentDate.split("-")
    [beforeYear, beforeMonth, beforeDay] = beforeDate.split("-")
    month = (
        (int(currentYear) - int(beforeYear)) * 12
        + int(currentMonth)
        - int(beforeMonth)
        + ((int(currentDay) - int(beforeDay)) / 30)
    )
    Ln = abs(min(LnList) / (month))

    matrix: tuple[int, int, int, int] = (0, 0, 0, 0)
    message: str = ""

    if Ln < 2.0 / 12:
        matrix = (1, 0, 0, 0)
        message = "较低风险"
    elif Ln < 5.0 / 12:
        matrix = (0, 1, 0, 0)
        message = "低风险"
    elif Ln < 8.0 / 12:
        matrix = (0, 0, 1, 0)
        message = "高风险"
    else:
        matrix = (0, 0, 0, 1)
        message = "较高风险"

    return (matrix, message, LnList)  # type: ignore


def getRiskMatrix(
    pqMatrix: tuple[int, int, int, int],
    kyMatrix: tuple[int, int, int, int],
    zdMatrix: tuple[int, int, int, int],
    zbMatrix: tuple[int, int, int, int],
    saMatrix: tuple[int, int, int, int],
    lnMatrix: tuple[int, int, int, int],
    hyMain: float,
    seMain: float,
    pq: float,
    ky: float,
    zd: float,
    zb: float,
    sa: float,
    ln: float,
) -> tuple[tuple[float, float, float, float], str, float]:
    hyMatrix: np.array = np.array([pqMatrix, kyMatrix, zdMatrix])  # type: ignore
    hyWeight: np.array = np.array([pq, ky, zd])  # type: ignore
    hyRisk: np.array = hyWeight @ hyMatrix  # type: ignore

    seMatrix: np.array = np.array([zbMatrix, saMatrix, lnMatrix])  # type: ignore
    seWeight: np.array = np.array([zb, sa, ln])  # type: ignore
    seRisk: np.array = seWeight @ seMatrix  # type: ignore

    bankRisk: np.array = np.array([hyMain, seMain]) @ np.array([hyRisk, seRisk])  # type: ignore

    sum: float = bankRisk[2] + bankRisk[3]
    message: str = ""

    if sum < 0.25:
        message = "较低风险"
    elif sum < 0.5:
        message = "低风险"
    elif sum < 0.75:
        message = "高风险"
    else:
        message = "较高风险"

    resultMatrix: tuple[float, float, float, float] = tuple(bankRisk.tolist())
    return (resultMatrix, message, sum)
