package com.johnny.bank.jobs;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.node.impl.TaskNodeServiceV2;
import com.johnny.bank.utils.BeanUtil;
import com.johnny.bank.utils.ProcessUtilV2;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;

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
public class ModelCaseDeletePreparingJob implements Job {

    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        String jobName = jobExecutionContext.getJobDetail().getKey().getName();
        String jobGroup = jobExecutionContext.getJobDetail().getKey().getGroup();
        QuartzSchedulerManager quartzSchedulerManager = BeanUtil.getBean(QuartzSchedulerManager.class);
        TaskNodeServiceV2 taskNodeServiceV2 = BeanUtil.getBean(TaskNodeServiceV2.class);
        // 更新taskNode的status
        List<TaskNode> taskNodeList = taskNodeServiceV2.findAll();
        for (TaskNode taskNode : taskNodeList) {
            if (taskNode.getStatus().equals("LOCK")) {
                return;
            }
        }
        log.info("Model case can be deleted now!");
        try {
            quartzSchedulerManager.deleteJob(jobName, jobGroup);
        } catch (SchedulerException e) {
            log.info(e.getMessage());
        }
    }
}
