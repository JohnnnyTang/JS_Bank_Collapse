import datetime
import json
import uuid

import pymongo
import xlrd


def resolveJSON(jsonPath: str) -> list[dict[str, str]]:
    result = []
    with open(jsonPath, encoding="utf8") as f:
        historyInfoArray = json.load(f)
        for historyInfo in historyInfoArray:
            result.append(historyInfo)

    return result


def resolveHistoryInfoExcel(path: str):
    workbook = xlrd.open_workbook(path)
    sheet = workbook.sheet_by_index(0)
    rows = sheet.nrows  # 62
    result = []

    for row in range(2, rows):
        temp = {}

        temp["description"] = sheet.cell_value(row, 0) or None
        temp["time"] = (
            str(sheet.cell_value(row, 1)) + str(sheet.cell_value(row, 3))
            or None
        )
        temp["district"] = sheet.cell_value(row, 2) or None
        temp["place"] = sheet.cell_value(row, 4) or None
        temp["type"] = sheet.cell_value(row, 5) or None
        temp["river"] = sheet.cell_value(row, 6) or None
        temp["side"] = sheet.cell_value(row, 7) or None
        temp["length"] = sheet.cell_value(row, 8) or None
        temp["width"] = sheet.cell_value(row, 9) or None
        temp["height"] = sheet.cell_value(row, 10) or None
        temp["volume"] = sheet.cell_value(row, 11) or None
        temp["ratio"] = sheet.cell_value(row, 12) or None
        temp["depth"] = sheet.cell_value(row, 13) or None
        temp["steep"] = sheet.cell_value(row, 14) or None
        temp["angle"] = sheet.cell_value(row, 15) or None
        temp["curvature1"] = sheet.cell_value(row, 16) or None
        temp["curvature2"] = sheet.cell_value(row, 17) or None
        temp["curvature3"] = sheet.cell_value(row, 18) or None

        result.append(temp)

    return result


def createHistoryInfo(
    name: str,
    historyInfoArray: list[dict],
) -> None:
    filedSet = {
        "描述": "description",
        "时间": "time",
        "县（市、区）": "district",
        "崩岸地点": "place",
        "崩岸类型": "type",
        "所在河段": "river",
        "岸别": "side",
        "口门长度（m）": "length",
        "崩窝宽度(m)": "width",
        "岸高(m)": "height",
        "崩窝土方量(m3)": "volume",
        "宽/深比": "ratio",
        "近岸陡坡": "steep",
        "崩窝进口夹角": "angle",
        "崩窝窝顶曲率1": "curvature1",
        "崩窝窝中曲率2": "curvature2",
        "崩窝窝顶曲率3": "curvature3",
    }
    client = pymongo.MongoClient(
        "mongodb://bankAdmin:20000601@192.168.1.6:27017/bank"
    )
    db = client["bank"]
    collection = db["historyInfo"]
    collection.delete_many({})

    for historyInfo in historyInfoArray:
        doc = {}
        doc["uuid"] = str(uuid.uuid4())
        for key, value in filedSet.items():
            doc[value] = historyInfo.get(value)

        localized_time = datetime.datetime.now()
        doc["state"] = "active"
        doc["createTime"] = localized_time
        doc["updateTime"] = localized_time

        collection.insert_one(doc)


if __name__ == "__main__":
    historyInfoJson = resolveHistoryInfoExcel(
        r"D:\project\JS_Bank_Collapse\data\history\江苏段典型窝崩统计1.xls"
    )
    with open(
        r"D:\project\JS_Bank_Collapse\data\history\historyInfoFromExcel.json",
        "w",
        encoding="utf8",
    ) as f:
        json.dump(historyInfoJson, f, ensure_ascii=False)
    historyInfoArray = resolveJSON(
        r"D:\project\JS_Bank_Collapse\data\history\historyInfoFromExcelTransform.json"
    )
    createHistoryInfo("historyInfo", historyInfoArray)
