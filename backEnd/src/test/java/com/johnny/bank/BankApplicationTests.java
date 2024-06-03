package com.johnny.bank;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.SectionLineInfo;
import com.johnny.bank.repository.resourceRepo.MapRepo.IVectorTileRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IDeviceWarningRepo;
import com.johnny.bank.service.node.impl.DataNodeService;
import com.johnny.bank.service.resource.data.impl.StationInfoService;
import com.johnny.bank.utils.MailUtil;
import com.johnny.bank.utils.SMSUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

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
    @Qualifier("VectorTileRepo")
    @Autowired
    IVectorTileRepo vectorTileRepo;
    @Qualifier("DeviceWarningRepo")
    @Autowired
    IDeviceWarningRepo deviceWarningRepo;

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

//    @Test
    void testMessageSender() throws IOException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("time", "2024-04-25 16:09");
        jsonObject.put("position", "120.123123,31.12312");
        jsonObject.put("device", "DV2132131");
        smsUtil.sendSms("13382058110", jsonObject.toJSONString());
    }

//    @Test
    void testDynamicMapper() {
        List<Map<String, Object>> res = vectorTileRepo.getLayerBasicInfo("depth_line", List.of("year"));
        System.out.println(res);
    }

//    @Test
    void testSectionInfo() {
        SectionLineInfo res = vectorTileRepo.selectSectionLineInfoById(1);
        System.out.println(res);
    }

//    @Test
void testUpdateDeviceWarn() {
    deviceWarningRepo.updateWarnDealtStatus("125a3b38-a602-45c3-b747-54504ef186c4", 1);
}

//    @Test
    void testSystemName() {
        System.out.println("system ... " + System.getProperties().getProperty("os.name"));
    }

}
