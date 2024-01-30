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
public class TestJob implements Job {

    public String before() {
        GnssDataService gnssDataService = BeanUtil.getBean(GnssDataService.class);
        InclinometerDataService inclinometerDataService = BeanUtil.getBean(InclinometerDataService.class);
        ManometerDataService manometerDataService = BeanUtil.getBean(ManometerDataService.class);
        StressPileDataService stressPileDataService = BeanUtil.getBean(StressPileDataService.class);
        List<GnssData> gnssDataList = gnssDataService.getDataByHour(gnssDataService.getDataNode(), 76);
        List<InclinometerData> inclinometerDataList = inclinometerDataService.getDataByHour(inclinometerDataService.getDataNode(), 76);
        List<ManometerData> manometerDataList = manometerDataService.getDataByHour(manometerDataService.getDataNode(), 76);
        List<StressPileData> stressPileDataList = stressPileDataService.getDataByHour(stressPileDataService.getDataNode(), 76);
        String dataText = FileUtil.buildGnssDataString(gnssDataList) +
                FileUtil.buildInclinoDataString(inclinometerDataList) +
                FileUtil.buildManoDataString(manometerDataList) +
                FileUtil.buildStressDataString(stressPileDataList);
        String timestampStr = String.valueOf(System.currentTimeMillis());
        String filePath = "D:\\2023_work\\bank-files\\" + timestampStr + "-data.csv";
        FileUtil.storeFileLocal(dataText, filePath);
        JSONObject params = new JSONObject();
        params.put("filePath1", filePath);
        log.info(filePath);
        params.put("filePath2", "D:\\2023_work\\bank-files\\testParam.csv");
        ParamNode paramNode = ParamNode.paramNodeBuilder().params(params).modelId("65b78631028eca632d0afae2")
                .auth("all").category("ModelParamItem").name("calcModelAutoParam-" + timestampStr)
                .path(",paramNode,calcModelParamGroup,").build();
        IParamNodeRepo paramNodeRepo = BeanUtil.getBean(IParamNodeRepo.class);
        return paramNodeRepo.save(paramNode).getId();
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        TaskNodeService taskNodeService = BeanUtil.getBean(TaskNodeService.class);
        String paramNodeId = before();
        JSONObject result = new JSONObject();
        result.put("resultString", "");
        String timestampStr = String.valueOf(System.currentTimeMillis());
        TaskNode taskNode = TaskNode.taskNodeBuilder()
                .modelNode(ModelNode.modelNodeBuilder().id("65b78631028eca632d0afae2").build())
                .paramNode(ParamNode.paramNodeBuilder().id(paramNodeId).build())
                .result(result).status("0").ifAuto(true).category("ModelTaskItem")
                .path(",taskNode,calcModelTaskGroup,").name("多因子模型自动任务-" + timestampStr)
                .build();
        try {
            log.info("task start to execute...");
            taskNodeService.createAndStartNewTask(taskNode);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
