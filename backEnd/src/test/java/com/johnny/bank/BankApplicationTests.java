package com.johnny.bank;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.service.node.impl.DataNodeService;
import com.johnny.bank.service.resource.data.impl.StationInfoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BankApplicationTests {

    @Autowired
    StationInfoService stationInfoService;
    @Autowired
    DataNodeService dataNodeService;

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

    @Test
    void testNullQuery() {
        System.out.println(dataNodeService.findByCategoryAndName("1", "2"));
    }

}
