package com.johnny.bank.jobs;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.model.resource.dataResource.GnssData;
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
            } catch (SchedulerException e) {
                log.info(e.toString());
            }
        } else if ( status.equals("ERROR") || status.equals("NONE")) {
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
}
