package com.johnny.bank.controller.scheduleTask;

import com.johnny.bank.jobs.QuartzSchedulerManager;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.quartz.CronExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.controller.scheduleTask
 * @className: QuartzController
 * @author: Johnny Tang
 * @description: Quartz 控制器
 * @date: 2024/1/27 23:32
 * @version: 1.0
 */
@RestController("api/v1/scheduleTask")
@Slf4j
public class QuartzController {
    @Autowired
    private QuartzSchedulerManager quartzSchedulerManager;

    // @Description: 获取定时器信息
    @GetMapping("/info")
    public String getQuartzJob(String name, String group) {
        String info = null;
        try {
            info = quartzSchedulerManager.getJobInfo(name, group);
        } catch (SchedulerException e) {
            log.info(e.getMessage(), e.toString());
        }
        return info;
    }

    // @Description: 修改定时器的 执行时间
    @PostMapping("/modify")
    public boolean modifyQuartzJob(String name, String group, String time) {
        boolean flag = true;

        if (!CronExpression.isValidExpression(time)) {
            throw new RuntimeException("非法的cron表达式");
        }

        try {
            flag = quartzSchedulerManager.modifyJob(name, group, time);
        } catch (SchedulerException e) {
            log.info(e.getMessage(), e.toString());
        }
        return flag;
    }

    // @Description: 启动所有定时器
    @PostMapping("/start")
    public void startQuartzJob() {
        try {
            quartzSchedulerManager.startJob();
        } catch (SchedulerException e) {
            log.info(e.getMessage(), e.toString());
        }
    }

    // @Description: 暂停指定 定时器
    @PostMapping(value = "/pause")
    public void pauseQuartzJob(String name, String group) {
        try {
            quartzSchedulerManager.pauseJob(name, group);
        } catch (SchedulerException e) {
            log.info(e.getMessage(), e.toString());
        }
    }

    // 暂停所有定时器
    @PostMapping(value = "/pauseAll")
    public void pauseAllQuartzJob() {
        try {
            quartzSchedulerManager.pauseAllJob();
        } catch (SchedulerException e) {
            log.info(e.getMessage(), e.toString());
        }
    }

    // 删除指定定时器
    @PostMapping(value = "/delete")
    public void deleteJob(String name, String group) {
        try {
            quartzSchedulerManager.deleteJob(name, group);
        } catch (SchedulerException e) {
            log.info(e.getMessage(), e.toString());
        }
    }
}
