import numpy as np


def __hydrodynamicMatrix(
    data: dict[str, dict], weight: tuple[float, float, float, float]
) -> tuple[float, float, float, float]:
    zeroMatrix = np.zeros((4, 4))
    for row in zeroMatrix:
        row[np.random.randint(0, 4)] = 1
    weightMatrix = np.array(weight)
    result = np.dot(weightMatrix, zeroMatrix)
    return result


def __riverBedMatrix(
    data: dict[str, dict], weight: tuple[float, float, float, float]
) -> tuple[float, float, float, float]:
    zeroMatrix = np.zeros((4, 4))
    for row in zeroMatrix:
        row[np.random.randint(0, 4)] = 1
    weightMatrix = np.array(weight)
    result = np.dot(weightMatrix, zeroMatrix)
    return result


def __bankSlopeMatrix(
    data: dict[str, dict], weight: tuple[float, float, float, float]
) -> tuple[float, float, float, float]:
    zeroMatrix = np.zeros((4, 4))
    for row in zeroMatrix:
        row[np.random.randint(0, 4)] = 1
    weightMatrix = np.array(weight)
    result = np.dot(weightMatrix, zeroMatrix)
    return result


def __humanActivityMatrix(
    data: dict[str, dict], weight: tuple[float, float, float]
) -> tuple[float, float, float, float]:
    zeroMatrix = np.zeros((3, 4))
    for row in zeroMatrix:
        row[np.random.randint(0, 4)] = 1
    weightMatrix = np.array(weight)
    result = np.dot(weightMatrix, zeroMatrix)
    return result


def __mainFactorMatrix(
    matrix: tuple[
        tuple[float, float, float, float],
        tuple[float, float, float, float],
        tuple[float, float, float, float],
        tuple[float, float, float, float],
    ],
    weight: tuple[float, float, float, float],
) -> tuple[float, float, float, float]:
    zeroMatrix = np.zeros((4, 4))
    for row in zeroMatrix:
        row[np.random.randint(0, 4)] = 1
    weightMatrix = np.array(weight)
    result = np.dot(weightMatrix, zeroMatrix)
    return result


def getData() -> list[list[float]]:
    return [
        [0.34, 0.34, 0.20, 0.12],
        [0.37, 0.13, 0.28, 0.22],
        [0.30, 0.30, 0.21, 0.19],
        [0.48, 0.16, 0.36],
        [0.37, 0.29, 0.22, 0.12],
    ]


def dataPreprocessing() -> None:
    print("preprocessing")


def runModel(weightList: list[list[float]]) -> tuple[float, float, float, float]:
    row0 = __hydrodynamicMatrix(
        {}, (weightList[0][0], weightList[0][1], weightList[0][2], weightList[0][3])
    )
    row1 = __riverBedMatrix(
        {}, (weightList[1][0], weightList[1][1], weightList[1][2], weightList[1][3])
    )
    row2 = __bankSlopeMatrix(
        {}, (weightList[2][0], weightList[2][1], weightList[2][2], weightList[2][3])
    )
    row3 = __humanActivityMatrix(
        {}, (weightList[3][0], weightList[3][1], weightList[3][2])
    )
    result = __mainFactorMatrix(
        (row0, row1, row2, row3),
        (weightList[4][0], weightList[4][1], weightList[4][2], weightList[4][3]),
    )
    return result


if __name__ == "__main__":
    modelData = getData()
    result = runModel(modelData)
    print(result)
