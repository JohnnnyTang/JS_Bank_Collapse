package com.johnny.bank.jobs;

import com.alibaba.fastjson2.JSONObject;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.johnny.bank.model.resource.dataResource.*;
import com.johnny.bank.service.resource.data.impl.*;
import com.johnny.bank.utils.BeanUtil;
import com.johnny.bank.utils.MailUtil;
import com.johnny.bank.utils.SMSUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

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
public class GnssWarningJob implements Job {

    private static final List<String> mailList = List.of("249884523@qq.com", "1275441282@qq.com");
    private static final List<String> phoneList = List.of("13382058110");
//    private static final List<String> phoneList = List.of("18678742441");

    public List<List<GnssData>> before() {
        MonitorInfoService monitorInfoService = BeanUtil.getBean(MonitorInfoService.class);
        GnssDataService gnssDataService = BeanUtil.getBean(GnssDataService.class);

        List<String> gnssIdList = monitorInfoService.getDeviceIdListByType(
                monitorInfoService.getDataNode(), '1'
        );
        log.info(gnssIdList.toString());
        List<GnssData> warningList = new ArrayList<>();
        List<GnssData> dangerList = new ArrayList<>();
        for(String gnssId: gnssIdList) {
            GnssData gnssData = gnssDataService.getNewestDataOfDevice(gnssDataService.getDataNode(), gnssId);
            double threeDiff = gnssData.getThreeD();
            log.info(gnssId+"-"+gnssData.getMeasureTime()+":"+threeDiff);
            if(threeDiff > 12) {
                if(threeDiff > 20) {
                    dangerList.add(gnssData);
                }
                else {
                    warningList.add(gnssData);
                }
            }
        }
        return List.of(warningList, dangerList);
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        List<List<GnssData>> warningGnssDataList = before();
        MonitorInfoService monitorInfoService = BeanUtil.getBean(MonitorInfoService.class);
        if(warningGnssDataList.isEmpty()) {
            log.info("no warning");
            return;
        }
        DeviceWarningService gnssWarningService = BeanUtil.getBean(DeviceWarningService.class);
        MailUtil mailUtil = BeanUtil.getBean(MailUtil.class);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        return sdf.format();
        String baseWarnStr = "GNSS三维累积值大于等于12mm，报警信息：\n" +
                "江苏省长江崩岸监测预警系统（测试版）提醒您：";
//        String baseWarnEndStr = "河岸变形较大，崩岸风险很高，请注意相关防汛安全！";
//        String baseDangerStr = "GNSS三维累积值大于等于20mm，报警信息：\n" +
//                "江苏省长江崩岸监测预警系统（测试版）提醒您：";
//        String baseDangerEndStr = "即将发生崩岸，请注意相关防汛处置！";

        StringBuilder warnStrBuilder = new StringBuilder(baseWarnStr);

        int i = 0;
        for(GnssData gnssData: warningGnssDataList.get(0)) {
            i += 1;
            MonitorInfo gnssInfo = monitorInfoService.getDataById(
                    monitorInfoService.getDataNode(), gnssData.getDeviceId()
            );
            String posStr = i + ". 位于(" +
                    gnssInfo.getLongitude() + "," +
                    gnssInfo.getLatitude() + ")" +
                    "的GNSS，设备代码为" + gnssData.getDeviceCode() + "附近区域\n";
            warnStrBuilder.append(posStr);
            DeviceWarning deviceWarning = DeviceWarning.builder()
                    .deviceId(gnssData.getDeviceId()).warnTime(gnssData.getMeasureTime())
                    .deviceCode(gnssInfo.getMachineId()).threeDiff(gnssData.getThreeD())
                    .build();
            gnssWarningService.save(deviceWarning);
        }
        String warnStr = warnStrBuilder.toString();
        log.info(warnStr);
        for(String mailTo: mailList) {
            mailUtil.sendSimpleMail(
                    mailTo, "江苏省长江崩岸监测预警系统（测试版）系统崩岸预警信息", warnStr);
        }

        for(GnssData gnssData: warningGnssDataList.get(1)) {
            MonitorInfo gnssInfo = monitorInfoService.getDataById(
                    monitorInfoService.getDataNode(), gnssData.getDeviceId()
            );
            List<DeviceWarning> deviceWarningList = gnssWarningService.getDataByHourOfDevice(
                    2, gnssInfo.getCode()
            );
            if(deviceWarningList.isEmpty()) {
                log.info("send message");
//                String posStr = gnssInfo.getLongitude() + "," + gnssInfo.getLatitude();
//                String messageStr = baseDangerStr +
//                        sdf.format(gnssData.getMeasureTime()) + "，位于" +
//                        posStr + "的GNSS设备代码为: " + gnssData.getDeviceCode() + " 附近区域" + baseDangerEndStr;
//                log.info(messageStr);
                SMSUtil smsUtil = BeanUtil.getBean(SMSUtil.class);
                JSONObject paramsJson = new JSONObject();
                paramsJson.put("time", sdf.format(gnssData.getMeasureTime()));
                paramsJson.put("position", "(" + gnssInfo.getLongitude() + "," + gnssInfo.getLatitude() + ")");
                paramsJson.put("device", gnssData.getDeviceCode());
                for(String phoneNumber: phoneList) {
                    SendSmsResponse smsResponse = null;
                    try {
                        smsResponse = smsUtil.sendSms(phoneNumber, paramsJson.toJSONString());
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    log.info(smsResponse.getMessage());
                }
            }
            DeviceWarning deviceWarning = DeviceWarning.builder()
                    .deviceId(gnssData.getDeviceId()).warnTime(gnssData.getMeasureTime())
                    .threeDiff(gnssData.getThreeD()).deviceCode(gnssInfo.getMachineId())
                    .build();
            gnssWarningService.save(deviceWarning);
//            mailUtil.sendSimpleMail(
//                    "fyzhang@nhri.cn", "江苏省长江崩岸监测预警系统（测试版）系统崩岸预警信息", resStr);
//            mailUtil.sendSimpleMail(
//                    "249884523@qq.com", "江苏省长江崩岸监测预警系统（测试版）系统崩岸预警信息", resStr
//            );
//            mailUtil.sendSimpleMail(
//                    "1275441282@qq.com", "江苏省长江崩岸监测预警系统（测试版）系统崩岸预警信息", resStr
//            );
        }
        try {
            log.info("watching gnss data...");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
