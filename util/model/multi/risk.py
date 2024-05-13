import json
import sys

from multiUtil import getRiskMatrix


def main(
    jsonPath: str,
    weight0: str,
    weight1: str,
    weight2: str,
    weight3: str,
    weight4: str,
    weight5: str,
    weight6: str,
    weight7: str,
):
    content: dict = {}

    # read json
    with open(jsonPath, "r", encoding="utf8") as file:
        content = json.load(file)
    PQ: tuple[int, int, int, int] = tuple(content.get("PQ")[0])  # type: ignore
    KY: tuple[int, int, int, int] = tuple(content.get("KY")[0])  # type: ignore
    ZD: tuple[int, int, int, int] = tuple(content.get("ZD")[0])  # type: ignore
    ZB: tuple[int, int, int, int] = tuple(content.get("ZB")[0])  # type: ignore
    SA: tuple[int, int, int, int] = tuple(content.get("SA")[0])  # type: ignore
    LN: tuple[int, int, int, int] = tuple(content.get("LN")[0])  # type: ignore

    result = getRiskMatrix(
        PQ,
        KY,
        ZD,
        ZB,
        SA,
        LN,
        float(weight0),
        float(weight1),
        float(weight2),
        float(weight3),
        float(weight4),
        float(weight5),
        float(weight6),
        float(weight7),
    )

    # write json
    content["risk"] = result
    with open(jsonPath, "w", encoding="utf8") as f:
        json.dump(content, f, ensure_ascii=False)


if __name__ == "__main__":
    if len(sys.argv) != 10:
        print("参数错误！")
    else:
        # json 路径, 2 个主权重, 6 个指标权重
        [
            jsonPath,
            weight0,
            weight1,
            weight2,
            weight3,
            weight4,
            weight5,
            weight6,
            weight7,
        ] = sys.argv[1:10]

        # test
        # D:\project\JS_Bank_Collapse\util\model\multi\test\result.json 0.5 0.5 0.16 0.48 0.36 0.16 0.48 0.36
        main(
            jsonPath,
            weight0,
            weight1,
            weight2,
            weight3,
            weight4,
            weight5,
            weight6,
            weight7,
        )
