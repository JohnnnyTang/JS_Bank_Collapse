package com.johnny.bank.jobs;

import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

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

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        log.info("task start to execute...");
    }
}
