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

    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();
        String waterConditionPath = dataMap.getString("waterConditionPath");
        String waterConditionUrl = dataMap.getString("waterConditionUrl");
        String tideUrl = waterConditionUrl + "/jssqApi/v1/tide";
        String flowUrl = waterConditionUrl + "/jssqApi/v1/river";
        final Map<String, List<String>> stationMap = new HashMap<>(Map.of(
                "datong", List.of("大通站", "001"),
                "nanjing", List.of("南京站", "002"),
                "zhenjiang", List.of("镇江站", "003"),
                "sanjiangying", List.of("三江营站", "004"),
                "jiangyin", List.of("江阴站", "005"),
                "xuliujing", List.of("徐六泾站", "006")
        ));
        String category = "BankNode";
        BankResourceService bankResourceService = BeanUtil.getBean(BankResourceService.class);
        List<DataNodeV2> bankList = bankResourceService.getBankList(category);
        for (DataNodeV2 bankNode : bankList) {
            String bank = bankNode.getBank();
            String path = waterConditionPath + File.separator + bank + File.separator + "water.json";
            String content = FileUtil.getFileContent(path);
            JSONArray waterConditionJson = JSONArray.parseArray(content);
            for (int index=0; index<waterConditionJson.size(); index++) {
                JSONObject stationJson = (JSONObject) waterConditionJson.get(index);
                String stationName = stationJson.getString("stationName");
                String stationId = stationMap.get(stationName).get(1);
                stationJson.put("flow",getFlow(flowUrl, stationId));
                stationJson.put("tide-level",getTide(tideUrl, stationId));
                waterConditionJson.set(index, stationJson);
            }
            FileUtil.modifiyFileContent(path, waterConditionJson.toString());
        }
    }

    private static Double getFlow(String flowUrl, String stationId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime endTime = LocalDateTime.now();
        String endTimeStr = endTime.format(formatter);
        LocalDateTime startTime = LocalDateTime.now().minusHours(1);
        String startTimeStr = startTime.format(formatter);
        JSONObject requestBody = new JSONObject();
        requestBody.put("STCDS",stationId);
        requestBody.put("STARTTIME",startTimeStr);
        requestBody.put("ENDTIME",endTimeStr);
//        JSONObject response = JSONObject.parseObject(InternetUtil.doPost(flowUrl, requestBody));
        return 57500.0;
    }

    private static Double getTide(String tideUrl, String stationId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime endTime = LocalDateTime.now();
        String endTimeStr = endTime.format(formatter);
        LocalDateTime startTime = LocalDateTime.now().minusHours(1);
        String startTimeStr = startTime.format(formatter);
        JSONObject requestBody = new JSONObject();
        requestBody.put("STCDS",stationId);
        requestBody.put("STARTTIME",startTimeStr);
        requestBody.put("ENDTIME",endTimeStr);
//        JSONObject response = JSONObject.parseObject(InternetUtil.doPost(tideUrl, requestBody));
        return 3.3;
    }
}
