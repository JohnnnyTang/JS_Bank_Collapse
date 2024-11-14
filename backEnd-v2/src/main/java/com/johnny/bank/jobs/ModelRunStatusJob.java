package com.johnny.bank.jobs;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.model.resource.dataResource.GnssData;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.node.impl.TaskNodeService;
import com.johnny.bank.service.node.impl.TaskNodeServiceV2;
import com.johnny.bank.utils.BeanUtil;
import com.johnny.bank.utils.ProcessUtilV2;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/18 22:08
 * @Description:
 * @description: 模型计算容器运行状态轮询任务
 *
 */

@Slf4j
public class ModelRunStatusJob implements Job {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        String jobName = jobExecutionContext.getJobDetail().getKey().getName();
        String jobGroup = jobExecutionContext.getJobDetail().getKey().getGroup();
        JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();
        String modelServerUrl = dataMap.getString("modelServerUrl");
        TaskNode taskNode = (TaskNode) dataMap.get("taskNode");
        String status = ProcessUtilV2.getModelTaskStatus(modelServerUrl, taskNode);
        // 更新taskNode的status
        TaskNodeServiceV2 taskNodeServiceV2 = BeanUtil.getBean(TaskNodeServiceV2.class);
        QuartzSchedulerManager quartzSchedulerManager = BeanUtil.getBean(QuartzSchedulerManager.class);
        taskNodeServiceV2.updateNodeStatusById(taskNode.getId(), status);
        if ( status.equals("COMPLETE") ) {
            log.info("model task " + taskNode.getCaseId() + "has finished!");
            try {
                // 停止查询任务状态
                quartzSchedulerManager.deleteJob(jobName, jobGroup);
                // 获取任务结果
                JSONObject resObj = ProcessUtilV2.getModelTaskRes(modelServerUrl,taskNode);
                // 更新任务节点结果
                taskNodeServiceV2.updateNodeStatusResultById(taskNode.getId(), status, resObj);
                // taskNode与case对齐
                taskNodeServiceV2.modelServerSerialization();

                // 针对真实水动力计算任务，完成后将结果写入资源节点中
                if (taskNode.getModelNode().getId().equals("66cf190d7965ee56bc04ebf9")) {
                    writeRealHydroToNode(taskNodeServiceV2.findById(taskNode.getId()));
                }

            } catch (SchedulerException e) {
                log.info(e.toString());
            }
        } else if ( status.equals("ERROR") || status.equals("NONE") || status.equals("NOT FOUND")) {
            log.info("model task " + taskNode.getCaseId() + "has failed!");
            try {
                // 停止查询任务状态
                quartzSchedulerManager.deleteJob(jobName, jobGroup);
                JSONObject errorLog = ProcessUtilV2.getCaseErrorLog(modelServerUrl,taskNode.getCaseId());
                taskNodeServiceV2.updateTaskNodeResultById(taskNode.getId(), errorLog);
                // taskNode与case对齐
                taskNodeServiceV2.modelServerSerialization();
            } catch (SchedulerException e) {
                log.info(e.toString());
            }
        }
    }

    private void writeRealHydroToNode(TaskNode realHydroTaskNode) {
        DataNodeServiceV2 dataNodeServiceV2 = BeanUtil.getBean(DataNodeServiceV2.class);
        JSONObject params = realHydroTaskNode.getParamNode().getParams();
        JSONObject basicInfo = new JSONObject();
        basicInfo.put("fileType","hydrodynamic");
        String bank = params.getString("segment");basicInfo.put("bank",bank);
        String year = params.getString("year");basicInfo.put("year",year);
        String set = params.getString("set");basicInfo.put("set",set);
        String name = params.getString("name");basicInfo.put("name",name);
        String temp = params.getString("temp");basicInfo.put("temp",temp);
        String boundary = params.getString("boundary");basicInfo.put("boundary",boundary);
        String path = realHydroTaskNode.getResult().getString("resource-path");basicInfo.put("path",path);
        DataNodeV2 realHydroDataNode = DataNodeV2.dataNodeBuilder()
                .bank(bank).basicInfo(basicInfo)
                .name(name).dataOrigin("ModelServer").category("HydrodynamicDataItem")
                .path(",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf" + bank + ",ModelServerDataGroupOf" + bank + "," + "HydrodynamicDataGroupOf" + bank + ",")
                .build();
        dataNodeServiceV2.save(realHydroDataNode);
    }
}
