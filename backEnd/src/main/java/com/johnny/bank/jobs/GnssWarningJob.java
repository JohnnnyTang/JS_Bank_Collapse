package com.johnny.bank.jobs;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.resource.dataResource.DeviceWarning;
import com.johnny.bank.model.resource.dataResource.GnssData;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.service.resource.data.impl.DeviceWarningService;
import com.johnny.bank.service.resource.data.impl.GnssDataService;
import com.johnny.bank.service.resource.data.impl.MonitorInfoService;
import com.johnny.bank.utils.BeanUtil;
import com.johnny.bank.utils.GlobalMap;
import com.johnny.bank.utils.MailUtil;
import com.johnny.bank.utils.SMSUtil;
import lombok.extern.slf4j.Slf4j;
import net.jodah.expiringmap.ExpirationPolicy;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
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
public class GnssWarningJob implements Job {

    private static final List<String> mailList = List.of("249884523@qq.com", "1275441282@qq.com");
    private static final List<String> phoneList = List.of("18860847206", "13382058110", "13913859225");
//    private static final List<String> phoneList = List.of("13382058110");
//    private static final List<String> phoneList = List.of("18860847206");
//    ExpiringMap<String, Double> messageMap = ExpiringMap.builder()
//        .variableExpiration()
//        .build();

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
            if(gnssData == null) {
                continue;
            }
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
        if(warningGnssDataList.get(0).isEmpty() && warningGnssDataList.get(1).isEmpty()) {
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
            log.info("gnss warn: " + deviceWarning);
            gnssWarningService.save(deviceWarning);
        }
        if(i > 0) {
            warnStrBuilder.append("\n");
            warnStrBuilder.append("河岸变形较大，崩岸风险很高，请注意相关防汛安全！");
            String warnStr = warnStrBuilder.toString();
            log.info(warnStr);
//            for(String mailTo: mailList) {
//                mailUtil.sendSimpleMail(
//                        mailTo, "江苏省长江崩岸监测预警系统（测试版）系统崩岸预警信息", warnStr);
//            }
        }

        GlobalMap globalMap = BeanUtil.getBean(GlobalMap.class);

        for(GnssData gnssData: warningGnssDataList.get(1)) {
            MonitorInfo gnssInfo = monitorInfoService.getDataById(
                    monitorInfoService.getDataNode(), gnssData.getDeviceId()
            );
            if(!globalMap.getWarMessageMap().containsKey(gnssInfo.getCode())) {
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
//                for(String phoneNumber: phoneList) {
//                    SendSmsResponse smsResponse = null;
//                    try {
//                        smsResponse = smsUtil.sendSms(phoneNumber, paramsJson.toJSONString());
//                    } catch (IOException e) {
//                        throw new RuntimeException(e);
//                    }
//                    log.info(smsResponse.getMessage());
//                    try {
//                        TimeUnit.SECONDS.sleep(5);
//                    } catch (InterruptedException e) {
//                        throw new RuntimeException(e);
//                    }
//                }
                log.info(paramsJson.toString());
                globalMap.getWarMessageMap().put(gnssInfo.getCode(), gnssData.getThreeD(), ExpirationPolicy.CREATED, 2, TimeUnit.HOURS);
//                log.info("message map: " + globalMap.getWarMessageMap().toString());
            }
            log.info("curMessage: " + globalMap.getWarMessageMap().toString());
            DeviceWarning deviceWarning = DeviceWarning.builder()
                    .deviceId(gnssData.getDeviceId()).warnTime(gnssData.getMeasureTime())
                    .threeDiff(gnssData.getThreeD()).deviceCode(gnssInfo.getMachineId())
                    .build();
            log.info("gnss warn: " + deviceWarning);
            gnssWarningService.save(deviceWarning);
        }
        try {
            log.info("watching gnss data...");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
