import datetime
import json
import uuid

import pymongo


def resolveJSON(jsonPath: str) -> list[dict[str, str]]:
    result = []
    with open(jsonPath, encoding="utf8") as f:
        historyInfoArray = json.load(f)
        for historyInfo in historyInfoArray:
            result.append(historyInfo)

    return result


def createHistoryInfo(
    name: str,
    historyInfoArray: list[dict],
) -> None:
    filedSet = {
        "口门长度（m）": "length",
        "县（市、区）": "district",
        "时间": "time",
        "所在河段": "river",
        "宽/深比": "ratio",
        "岸别": "side",
        "崩窝宽度(m)": "width",
        "崩岸地点": "place",
        "崩岸类型": "type",
        "描述": "description",
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
            doc[value] = historyInfo.get(key)

        localized_time = datetime.datetime.now()
        doc["state"] = "active"
        doc["createTime"] = localized_time
        doc["updateTime"] = localized_time

        collection.insert_one(doc)


if __name__ == "__main__":
    historyInfoArray = resolveJSON(
        r"D:\project\JS_Bank_Collapse\data\history\historyInfo.json"
    )
    createHistoryInfo("historyInfo", historyInfoArray)
