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
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Objects;
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
        String tideUrl = dataMap.getString("tideUrl");
        String flowUrl = dataMap.getString("flowUrl");
        String category = "BankNode";
        BankResourceService bankResourceService = BeanUtil.getBean(BankResourceService.class);
        List<DataNodeV2> bankList = bankResourceService.getBankList(category);
        for (DataNodeV2 bankNode : bankList) {
            // TODO: 通过接口获取各个站点的实时水文数据

            String bank = bankNode.getBank();
            String path = waterConditionPath + File.separator + bank + File.separator + "water.json";
            String content = FileUtil.getFileContent(path);
            JSONArray waterConditionJson = JSONArray.parseArray(content);
            for (int index=0; index<waterConditionJson.size(); index++) {
                JSONObject stationJson = (JSONObject) waterConditionJson.get(index);
//                if (stationJson.getString("station").equals("大通站")) {
//                    stationJson.put("flow","121");
//                    waterConditionJson.set(index, stationJson);
//                }
            }
            FileUtil.modifiyFileContent(path, waterConditionJson.toString());
        }
    }
}
