package com.johnny.bank.jobs;

import com.johnny.bank.service.node.impl.TaskNodeServiceV2;
import com.johnny.bank.utils.BeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/8/2 10:12
 * @Description:
 */

@Slf4j
public class modelServerShakingHandJob implements Job {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();
        Integer storageLimit = dataMap.getInt("storageLimit");
        Integer caseLimit = dataMap.getInt("caseLimit");
        TaskNodeServiceV2 taskNodeServiceV2 = BeanUtil.getBean(TaskNodeServiceV2.class);
        try {
            taskNodeServiceV2.checkModelServerStorage(storageLimit, caseLimit);
            taskNodeServiceV2.modelServerSerialization();
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }
}
