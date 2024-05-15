import sys
import evolution
import powerIndex
import section
import risk


if __name__ == "__main__":
    if len(sys.argv) != 19:
        print("参数错误！")
    else:
        [
            x1,  # 起点
            y1,
            x2,  # 终点
            y2,
            currentDate,  # 当前日期
            beforeDate,  # 对比日期
            condition,  # 水文状况
            scene,  # 场景, 目前恒为 sanshawan
            weight0,  # 2 个主权重, 6 个指标权重
            weight1,
            weight2,
            weight3,
            weight4,
            weight5,
            weight6,
            weight7,
            dataFolderPath,  # 数据文件夹
            dstPath,  # 输出 json 路径
        ] = sys.argv[1:19]

        # test
        # 13417691 3767754 13417931 3767270 2023-09-01 2022-03-01 dry minzhusha  0.5 0.5 0.16 0.48 0.36 0.16 0.48 0.36 D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
        # con
        # 13417931 3767270 13417691 3767754 2023-09-01 2022-03-01 dry minzhusha  0.5 0.5 0.16 0.48 0.36 0.16 0.48 0.36 D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
        # -999
        # 13414573 3769008 13414748 3768302 2023-09-01 2022-03-01 dry minzhusha  0.5 0.5 0.16 0.48 0.36 0.16 0.48 0.36 D:\project\JS_Bank_Collapse\util\model\multi\data D:\project\JS_Bank_Collapse\util\model\multi\test\result.json
        section.main(
            x1, y1, x2, y2, currentDate, scene, dataFolderPath, dstPath
        )
        powerIndex.main(dstPath, currentDate, condition)
        evolution.main(dstPath, beforeDate)
        risk.main(
            dstPath,
            weight0,
            weight1,
            weight2,
            weight3,
            weight4,
            weight5,
            weight6,
            weight7,
        )
