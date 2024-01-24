import datetime
import json

import pymongo
import xlrd
from bson import ObjectId


def resolveTXT(path: str):
    client = pymongo.MongoClient("mongodb://bankAdmin:20000601@192.168.1.6:27017/bank")
    db = client["bank"]
    collection = db["yujing"]
    idSet = set()
    result = dict()
    with open(path) as f:
        geoJSON = json.load(f)
        features = geoJSON["features"]
        for feature in features:
            id = feature["properties"]["id"]
            if id in idSet:
                continue
            else:
                idSet.add(id)
                document = collection.find_one({"_id": ObjectId(id)})
                if document:
                    number = document["number"]
                    coord = feature["geometry"]["coordinates"]
                    result[number] = coord

    return result


def resolveLonLat(string: str):
    temp = string.split("°")
    degree = int(temp[0])
    temp = temp[1].split("'")
    minute = int(temp[0])
    second = float(temp[1].removesuffix('"'))
    value = degree + minute / 60 + second / 3600
    return value


def resolveYuJingExcel(path: str):
    workbook = xlrd.open_workbook(path)
    sheet = workbook.sheet_by_index(0)
    rows = sheet.nrows  # 62
    result = []

    cityName = ""
    riverName = ""
    number = ""
    bankName = ""
    warningLever = ""
    monitoringLength = ""
    startOfY = ""
    startOfX = ""
    endOfY = ""
    endOfX = ""
    startOfLat = ""
    startOfLon = ""
    endOfLat = ""
    endOfLon = ""
    memo = ""
    for row in range(4, rows):
        temp = {}

        cityName = sheet.cell_value(row, 0) or cityName
        riverName = sheet.cell_value(row, 1) or riverName
        number = sheet.cell_value(row, 2) or number
        bankName = sheet.cell_value(row, 3) or bankName
        warningLever = (
            sheet.cell_value(row, 4)
            .replace("Ⅱ", "2")
            .replace("Ⅰ", "1")
            .replace("Ⅲ", "3")
            or warningLever
        )
        monitoringLength = sheet.cell_value(row, 5) or monitoringLength
        startOfY = sheet.cell_value(row, 6)
        startOfX = sheet.cell_value(row, 7)
        endOfY = sheet.cell_value(row, 8)
        endOfX = sheet.cell_value(row, 9)
        startOfLat = resolveLonLat(sheet.cell_value(row, 10))
        startOfLon = resolveLonLat(sheet.cell_value(row, 11))
        endOfLat = resolveLonLat(sheet.cell_value(row, 12))
        endOfLon = resolveLonLat(sheet.cell_value(row, 13))
        memo = sheet.cell_value(row, 14)
        description = sheet.cell_value(row, 15)

        temp["cityName"] = cityName
        temp["riverName"] = riverName
        temp["number"] = number
        temp["bankName"] = bankName
        temp["warningLever"] = int(warningLever)
        temp["monitoringLength"] = monitoringLength
        temp["startOfY"] = startOfY
        temp["startOfX"] = startOfX
        temp["endOfY"] = endOfY
        temp["endOfX"] = endOfX
        temp["startOfLat"] = startOfLat
        temp["startOfLon"] = startOfLon
        temp["endOfLat"] = endOfLat
        temp["endOfLon"] = endOfLon
        temp["memo"] = memo
        temp["description"] = description

        result.append(temp)

    return result


def createYuJing(
    name: str,
    dataArray: list[dict],
    coordDict: dict[str, list[tuple[float, float]]],
):
    client = pymongo.MongoClient("mongodb://bankAdmin:20000601@192.168.1.6:27017/bank")
    db = client["bank"]
    collection = db[name]
    collection.delete_many({})

    for data in dataArray:
        localized_time = datetime.datetime.now()

        doc = {
            "cityName": data["cityName"],
            "riverName": data["riverName"],
            "number": data["number"],
            "bankName": data["bankName"],
            "warningLevel": data["warningLever"],
            "monitoringLength": data["monitoringLength"],
            "coord": coordDict[data["number"]],
            "memo": data["memo"],
            "description": data["description"],
            "state": "active",
            "createTime": localized_time,
            "updateTime": localized_time,
        }
        collection.insert_one(doc)


if __name__ == "__main__":
    # net start MongoDB
    coordDict = resolveTXT(r"d:\project\JS_Bank_Collapse\data\excel\1.22.txt")
    result = resolveYuJingExcel(
        r"D:\project\JS_Bank_Collapse\data\excel\江苏省长江河道崩岸险情监测预警表V1.xls"
    )
    createYuJing("warning", result, coordDict)
