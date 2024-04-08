package com.johnny.bank.jobs;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.model.resource.dataResource.GnssData;
import com.johnny.bank.model.resource.dataResource.InclinometerData;
import com.johnny.bank.model.resource.dataResource.ManometerData;
import com.johnny.bank.model.resource.dataResource.StressPileData;
import com.johnny.bank.repository.nodeRepo.IParamNodeRepo;
import com.johnny.bank.service.node.impl.TaskNodeService;
import com.johnny.bank.service.resource.data.impl.GnssDataService;
import com.johnny.bank.service.resource.data.impl.InclinometerDataService;
import com.johnny.bank.service.resource.data.impl.ManometerDataService;
import com.johnny.bank.service.resource.data.impl.StressPileDataService;
import com.johnny.bank.utils.BeanUtil;
import com.johnny.bank.utils.FileUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.io.IOException;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.jobs
 * @className: TestJob
 * @author: Johnny Tang
 * @description: Quartz 测试任务
 * @date: 2024/1/27 23:19
 * @version: 1.0
 */
@Slf4j
public class TestRunningJob implements Job {

    public String before() {
        System.out.println("before task");
        return "before task";
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        log.info("task start to execute...");
    }
}
