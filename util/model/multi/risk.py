import json
import sys

from multiUtil import getRiskMatrix

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("参数错误！")
    else:
        [
            jsonPath,
        ] = sys.argv[1:2]
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
        weight: list[float] = content.get("weight")  # type:ignore

        result = getRiskMatrix(
            PQ,
            KY,
            ZD,
            ZB,
            SA,
            LN,
            weight[0],
            weight[1],
            weight[2],
            weight[3],
            weight[4],
            weight[5],
            weight[6],
            weight[7],
        )

        # write json
        content["risk"] = result
        with open(jsonPath, "w", encoding="utf8") as f:
            json.dump(content, f, ensure_ascii=False)

        # test
        # D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
