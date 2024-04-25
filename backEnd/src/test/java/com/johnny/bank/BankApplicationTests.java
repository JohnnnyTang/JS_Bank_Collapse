package com.johnny.bank;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.service.node.impl.DataNodeService;
import com.johnny.bank.service.resource.data.impl.StationInfoService;
import com.johnny.bank.utils.MailUtil;
import com.johnny.bank.utils.SMSUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BankApplicationTests {

    @Autowired
    StationInfoService stationInfoService;
    @Autowired
    DataNodeService dataNodeService;
    @Autowired
    MailUtil mailUtil;
    @Autowired
    SMSUtil smsUtil;

//    @Test
    void testStation() {
        JSONObject usage =  new JSONObject(){{
            put("userName", "postgres");
            put("password", "20000601");
        }};
        DataNode dataNode = DataNode.dataNodeBuilder()
                .id("1").name("test")
                .usage(usage).category("staticGroup")
                .apiPrefix("jdbc:postgresql://192.168.1.125:5432/bankdemo?stringtype=unspecified")
                .build();
        System.out.println(stationInfoService.getAllData(dataNode));
    }

//    @Test
    void testNullQuery() {
        System.out.println(dataNodeService.findByCategoryAndName("1", "2"));
    }

//    @Test
    void testEmailSender() {
        mailUtil.sendSimpleMail("1275441282@qq.com", "test-sen", "abcasddadsa");
    }

    @Test
    void testMessageSender() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("time", "2024-04-25 16:09");
        jsonObject.put("position", "120.123123,31.12312");
        jsonObject.put("device", "DV2132131");
        smsUtil.sendSms("13382058110", jsonObject.toJSONString());
    }

}
