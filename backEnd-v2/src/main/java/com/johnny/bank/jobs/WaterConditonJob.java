package com.johnny.bank.jobs;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.DeviceWarning;
import com.johnny.bank.model.resource.dataResource.GnssData;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.model.resource.dataResource.StressPileData;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.node.impl.TaskNodeServiceV2;
import com.johnny.bank.service.resource.dataSource.impl.BankResourceService;
import com.johnny.bank.service.resource.dataSource.impl.DeviceWarningService;
import com.johnny.bank.service.resource.dataSource.impl.GnssDataService;
import com.johnny.bank.service.resource.dataSource.impl.MonitorInfoService;
import com.johnny.bank.utils.*;
import lombok.extern.slf4j.Slf4j;
import net.jodah.expiringmap.ExpirationPolicy;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.jobs
 * @className: GnssWarningJob
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/4/24 22:38
 * @version: 1.0
 */
@Slf4j
public class WaterConditonJob implements Job {
    public void execute2(JobExecutionContext jobExecutionContext) {
        JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();
        String waterConditionPath = dataMap.getString("waterConditionPath");
        String waterConditionUrl = dataMap.getString("waterConditionUrl");
        String flowApiUrl = waterConditionUrl + "/newApi/SL324/ST_FORECAST_F";
        String tideApiUrl = waterConditionUrl + "/newApi/SL324/ST_TDFR_F";
        final Map<String, List<String>> stationMap = new HashMap<>(Map.of(
                "datong", List.of("大通站", "60115000"),
                "nanjing", List.of("南京站", "60116200"),
                "zhenjiang", List.of("镇江站", "60116601"),
                "sanjiangying", List.of("三江营站", "60197172"),
                "jiangyin", List.of("江阴站", "60117000"),
                "xuliujing", List.of("徐六泾站", "60117400")
        ));
        String path = waterConditionPath + File.separator + "water.json";
        String content = FileUtil.getFileContent(path);
        JSONArray waterConditionJson = JSONArray.parseArray(content);
        for (int index=0; index<waterConditionJson.size(); index++) {
            JSONObject stationJson = (JSONObject) waterConditionJson.get(index);
            String stationName = stationJson.getString("stationName");
            String stationId = stationMap.get(stationName).get(1);
            Double flow = getFlow(flowApiUrl, stationId);
            Double tide = getTide(tideApiUrl, stationId);
//               List<Double> dataList = List.of(flow, tide);
            stationJson.put("flow", flow);
            stationJson.put("tide-level", tide);
            waterConditionJson.set(index, stationJson);
//               if (!dataList.isEmpty()) {
//                   stationJson.put("flow",dataList.get(0));
//                   stationJson.put("tide-level",dataList.get(1));
//                   waterConditionJson.set(index, stationJson);
//               }
        }
        FileUtil.modifiyFileContent(path, waterConditionJson.toString());
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();
        String waterConditionPath = dataMap.getString("waterConditionPath");
        String waterConditionUrl = dataMap.getString("waterConditionUrl");
        String apiUrl = waterConditionUrl + "/newApi/SL324/getByStsc";
        final Map<String, List<String>> stationMap = new HashMap<>(Map.of(
                "datong", List.of("大通站", "60115000"),
                "nanjing", List.of("南京站", "60116200"),
                "zhenjiang", List.of("镇江站", "60116601"),
                "sanjiangying", List.of("三江营站", "60197172"),
                "jiangyin", List.of("江阴站", "60117000"),
                "xuliujing", List.of("徐六泾站", "60117400")
        ));
        final Map<String, List<String>> tidalRangeStationMap = new HashMap<>(Map.of(
                "datong", List.of("大通站", "60115000"),
                "nanjing", List.of("南京站", "60116200"),
                "zhenjiang", List.of("镇江站", "60116601"),
                "sanjiangying", List.of("三江营站", "60197172"),
                "jiangyin", List.of("江阴站", "60117000"),
                "xuliujing", List.of("徐六泾站", "60117400"),
                "tianshenggang", List.of("天生港站", "60117200")
        ));
        String path = waterConditionPath + File.separator + "water.json";
        String content = FileUtil.getFileContent(path);
        JSONArray waterConditionJson = JSONArray.parseArray(content);

        String tidalRangePath = waterConditionPath + File.separator + "tidalRange.json";
        String tidalRangeContent = FileUtil.getFileContent(tidalRangePath);
        JSONArray tidalRangeJson = JSONArray.parseArray(tidalRangeContent);

        //请求接口
        JSONObject requestBody = new JSONObject();
        requestBody.put("bsnm","长江");
        requestBody.put("sttps","");
        requestBody.put("addvcd","");
        JSONObject responseObj = JSONObject.parseObject(InternetUtil.doPost_waterCondition(apiUrl, requestBody));
        JSONArray allData = JSONArray.parseArray(responseObj.getString("data"));

        for (int index=0; index < waterConditionJson.size(); index++) {
            JSONObject stationJson = (JSONObject) waterConditionJson.get(index);
            String stationName = stationJson.getString("stationName");
            String stationId = stationMap.get(stationName).get(1);

            Double flow = null;
            Double tide = null;

            JSONArray stationArray = getStationArray(allData, stationId);

            if (stationArray == null) {
                flow = null;
                tide = null;
            } else {
                // 填充字段
                for (int i = 0; i < stationArray.size(); i++) {
                    JSONObject obj = stationArray.getJSONObject(i);
                    String sname = obj.getString("sname");

                    // 获取流量
                    if ("flow".equals(sname)) {
                        try {
                            flow = Double.parseDouble(obj.getString("value"));
                        } catch (Exception e) {}
                    }

                    // 获取水位
                    if ("waterLevel".equals(sname) || "tidallevel".equals(sname)) {
                        try {
                            tide = Math.round(Double.parseDouble(obj.getString("value")) * 100.0) / 100.0;
                        } catch (Exception e) {}
                    }
                }
            }

            stationJson.put("flow", flow);
            stationJson.put("tide-level", tide);
            waterConditionJson.set(index, stationJson);
        }

        // 潮差计算
        for (int index=0; index < tidalRangeJson.size(); index++) {
            JSONObject stationJson = (JSONObject) tidalRangeJson.get(index);
            String stationName = stationJson.getString("stationName");
            String stationId = tidalRangeStationMap.get(stationName).get(1);

            Double highTide = null;
            Double lowTide = null;
            Double tidalRange = null;

            JSONArray stationArray = getStationArray(allData, stationId);

            if (stationArray == null) {
                tidalRange = null;
            } else {
                // 填充字段
                for (int i = 0; i < stationArray.size(); i++) {
                    JSONObject obj = stationArray.getJSONObject(i);
                    String sname = obj.getString("sname");

                    if ("highTide".equals(sname)) {
                        try {
                            highTide = Double.parseDouble(obj.getString("value"));
                        } catch (Exception e) {}
                    }

                    if ("lowTide".equals(sname)) {
                        try {
                            lowTide = Double.parseDouble(obj.getString("value"));
                        } catch (Exception e) {}
                    }
                }

                if (highTide != null && lowTide != null) {
                    tidalRange = Math.round((highTide - lowTide) * 100.0) / 100.0;
                }
            }

            stationJson.put("tidalRange", tidalRange);
            tidalRangeJson.set(index, stationJson);
        }

        FileUtil.modifiyFileContent(path, waterConditionJson.toString());
        FileUtil.modifiyFileContent(tidalRangePath, tidalRangeJson.toString());
    }

    // 处理二级数组，获取某一站点的数据集合
    public static JSONArray getStationArray(JSONArray data, String stationId) {
        for (int i = 0; i < data.size(); i++) {
            JSONArray stationArray = data.getJSONArray(i);
            if (stationId.equals(stationArray.getJSONObject(0).getString("stationId"))) {
                return stationArray;
            }
        }
        return null;
    }

    private static Double getFlow(String apiUrl, String stationId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime endTime = LocalDateTime.now();
        String endTimeStr = endTime.format(formatter);
        LocalDateTime startTime = LocalDateTime.now().minusHours(24);       //间隔24小时
        String startTimeStr = startTime.format(formatter);
        JSONObject requestBody = new JSONObject();
        requestBody.put("STCDS",List.of(stationId));
        requestBody.put("STARTTIME",startTimeStr);
        requestBody.put("ENDTIME",endTimeStr);
        requestBody.put("pageNo",1);
        requestBody.put("pageSize",1000);
        JSONObject responseObj = JSONObject.parseObject(InternetUtil.doPost_waterCondition(apiUrl, requestBody));
        JSONArray stationArray = JSONArray.parseArray(responseObj.getString("data"));
        if (!stationArray.isEmpty()) {
            String flow = stationArray.getJSONObject(stationArray.size() - 1).getString("Q");     // 获取最新数据(起始时间5天后)
            return Double.parseDouble(flow);
        } else {
            return null;
        }
    }

    private static Double getTide(String apiUrl, String stationId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime endTime = LocalDateTime.now();
        String endTimeStr = endTime.format(formatter);
        LocalDateTime startTime = LocalDateTime.now().minusHours(72);       //间隔3天
        String startTimeStr = startTime.format(formatter);
        JSONObject requestBody = new JSONObject();
        requestBody.put("STCDS",List.of(stationId));
        requestBody.put("STARTTIME",startTimeStr);
        requestBody.put("ENDTIME",endTimeStr);
        requestBody.put("pageNo",1);
        requestBody.put("pageSize",1000);
        JSONObject responseObj = JSONObject.parseObject(InternetUtil.doPost_waterCondition(apiUrl, requestBody));
        JSONArray stationArray = JSONArray.parseArray(responseObj.getString("data"));
        if (!stationArray.isEmpty()) {
            // 获取最新数据
            JSONObject latestData = getLatestData(stationArray);
            String tide = latestData.getString("TDZ");
            return Double.parseDouble(tide);
        } else {
            return null;
        }
    }

    private static JSONObject getLatestData(JSONArray stationArray) {
        JSONObject latestElement = null;
        String latestYMDH = null;

        for (int i = 0; i < stationArray.size(); i++) {
            JSONObject currentElement = stationArray.getJSONObject(i);
            String currentYMDH = currentElement.getString("YMDH");

            if (latestYMDH == null || currentYMDH.compareTo(latestYMDH) > 0) {
                latestYMDH = currentYMDH;
                latestElement = currentElement;
            }
        }

        return latestElement;
    }
}



