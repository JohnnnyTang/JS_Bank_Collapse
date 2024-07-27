<template>
  <div class="section" ref="section"></div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import ModelRequest from "../../modelApi.js";
const { getResultData } = ModelRequest;
import * as echarts from "echarts";
import axios from "axios";
export default defineComponent({
  props: {
    chartInfo: {
      type: Object,
    },
  },
  setup(props) {
    const section = ref();
    let myChart;

    let option = {};

    const getArrs = async () => {
      try {
        const response = await axios.get("/section-view2.txt");
        const content = response.data;

        const lines = content.split("\n");

        let currentArray = [];
        const arrays = [];

        lines.forEach((line) => {
          if (line.trim() === "") {
            if (currentArray.length > 0) {
              arrays.push(currentArray);
              currentArray = [];
            }
          } else {
            currentArray.push(
              line.trim() === "-3.4028235e+38" || line.trim() === "-9999.0"
                ? null
                : line.trim()
            );
          }
        });

        if (currentArray.length > 0) {
          arrays.push(currentArray);
        }

        return {
          code: 0,
          data: { list: arrays[0], slopeRatio: arrays[1] },
        };
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    const initData = async () => {
      const data = await getResultData('common', props.chartInfo.caseid, props.chartInfo.name);
      const interval = props.chartInfo.params.interval
      //const data = await getArrs(props.chartInfo?.id);
      if (data != null) {
        let hList = [];
        let xdata = [];
        let xdata2 = [];

        data.data.points.forEach((item, index) => {
          hList.push(item[2]);
          xdata.push(index * interval);
        });

        data.data.Sa_h.forEach((item, index) => {
          xdata2.push(index * interval);
        });

        option = {
          title: [
            {
              text: "地形剖面图",
              left: "5%",
            },
            {
              text: "坡比图",
              left: "5%",
              bottom: "50%",
            },
          ],
          // 提示框
          tooltip: {
            trigger: "axis",
          },
          // 工具栏
          toolbox: {
            right: "50px",
            feature: {
              dataZoom: {
                yAxisIndex: "none",
                brushStyle: {
                  color: "#869d9d",
                  opacity: 0.4,
                },
              },
              restore: {},
              saveAsImage: {
                pixelRatio: 2,
              },
            },
          },
          grid: [
            {
              show: true,
              borderColor: "#867e76",
              bottom: "55%",
            },
            {
              show: true,
              borderColor: "#867e76",
              top: "55%",
            },
          ],
          xAxis: [
            {
              type: "category",
              name: "米",
              axisLine: {
                onZero: false,
              },
              data: xdata,
              axisLabel: {
                formatter: function (value) {
                  return Math.round(parseFloat(value));
                },
              },
            },
            {
              type: "category",
              name: "米",
              gridIndex: 1,
              data: xdata2,
              axisLabel: {
                formatter: function (value) {
                  return Math.round(parseFloat(value));
                },
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "高程(m)",
              splitLine: { show: false },
              interval: 5,
            },
            {
              type: "value",
              name: "坡比",
              splitLine: { show: false },
              gridIndex: 1,
            },
          ],
          series: [
            {
              data: hList,
              type: "line",
              connectNulls: true,
              symbol: "none",
              animation: false,
              smooth: true,
              emphasis: {
                disabled: true,
              },
              markLine: {
                symbol: ["none", "none"],
                animation: false,
                lineStyle: {
                  color: "#21373d",
                  width: 1,
                  type: "dotted",
                },
                label: { show: false },
                data: [
                  {
                    yAxis: 0,
                    label: {
                      formatter: "海平面",
                      show: true,
                      position: "insideEndTop",
                    },
                    lineStyle: {
                      type: "solid",
                      width: 0.7,
                    },
                  },
                  {
                    yAxis: -5,
                  },
                  {
                    yAxis: -10,
                  },
                  {
                    yAxis: -15,
                  },
                  {
                    yAxis: -20,
                  },
                  {
                    yAxis: -25,
                  },
                  {
                    yAxis: -30,
                  },
                  {
                    yAxis: -35,
                  },
                ],
                silent: true,
              },
              markArea: {
                silent: true,
                data: [
                  [
                    {
                      yAxis: 0,
                      itemStyle: {
                        color: {
                          type: "linear",
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [
                            {
                              offset: 0,
                              color: "#b0d5df", // 0% 处的颜色
                            },

                            {
                              offset: 1,
                              color: "#11659a", // 100% 处的颜色
                            },
                          ],
                        },
                      },
                    },
                    {
                      yAxis: -40, //填充区域下界
                    },
                  ],
                ],
              },
              lineStyle: {
                color: "#867e76",
                width: 1,
              },
              areaStyle: {
                origin: "start",
                opacity: 1,
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#e4dfd7", // 0% 处的颜色
                    },

                    {
                      offset: 1,
                      color: "#bbb5ac", // 100% 处的颜色
                    },
                  ],
                },
              },
            },
            {
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: data.data.Sa_h,
              type: "line",
              connectNulls: true,
              symbol: "none",
              animation: false,
              smooth: true,
              silent: true,
              lineStyle: { color: "#0D7509" },
              markLine: {
                symbol: ["none", "none"],
                animation: false,
                lineStyle: {
                  color: "#21373d",
                  width: 1,
                  type: "dotted",
                },
                label: { show: false },
              },
              // areaStyle: {
              //   origin: 0,
              // },
            },
          ],
        };
      }
    };

    onMounted(async () => {
      await initData();
      myChart = echarts.init(section.value);
      myChart.setOption(option);
    });

    return {
      section,
    };
  },
});
</script>

<style lang="scss" scoped>
.section {
  width: 900px;
  height: 700px;
}
</style>
