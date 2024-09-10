package com.johnny.bank.jobs;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.DeviceWarning;
import com.johnny.bank.model.resource.dataResource.GnssData;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.model.resource.dataResource.StressPileData;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.resource.dataSource.impl.BankResourceService;
import com.johnny.bank.service.resource.dataSource.impl.DeviceWarningService;
import com.johnny.bank.service.resource.dataSource.impl.GnssDataService;
import com.johnny.bank.service.resource.dataSource.impl.MonitorInfoService;
import com.johnny.bank.utils.*;
import lombok.extern.slf4j.Slf4j;
import net.jodah.expiringmap.ExpirationPolicy;
import org.quartz.Job;
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

    @Value("${staticData.waterConditionPath}")
    String waterConditionPath;

    @Autowired
    BankResourceService bankResourceService;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        String category = "BankNode";
        List<DataNodeV2> bankList = bankResourceService.getBankList(category);
        // TODO: 这里需要通过服务获取实时水情数据
        MultipartFile file = null;
        // 像某个服务发送请求获取数据并写入文件
        for (DataNodeV2 bankNode : bankList) {
            String bank = bankNode.getBank();
            String path = waterConditionPath + File.pathSeparator + bank + File.pathSeparator + "water.json";
            try {
                FileUtil.storeFile(file, path);
            } catch (IOException e) {
                log.info(e.getMessage());
            }
        }
    }
}
