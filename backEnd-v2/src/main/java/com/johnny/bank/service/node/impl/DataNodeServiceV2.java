package com.johnny.bank.service.node.impl;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.common.DefaultDatasource;
import com.johnny.bank.model.common.PublicDatasource;
import com.johnny.bank.model.node.*;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.utils.DataNodeUtil;
import org.bouncycastle.math.ec.custom.sec.SecT571R1Curve;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

import javax.xml.crypto.Data;
import java.util.*;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/21
 * @Description:
 */
@Service("DataNodeServiceV2")
public class DataNodeServiceV2 extends NodeService<DataNodeV2> {

    @Autowired
    @Qualifier("publicDatasource")
    private PublicDatasource publicDatasource;

    @Override
    public String save(DataNodeV2 dataNode) {
        return IBaseNodeRepo.save(dataNode).getId();
    }

    public DataNodeV2 getDataNodeByCategoryName(String category, String name) {
        return IBaseNodeRepo.getNodeByCategoryAndName(category, name);
    }

    public DataNodeV2 getDataNodeByCategoryBankName(String category, String bank, String name) {
        return IBaseNodeRepo.getNodeByCategoryBankAndName(category, bank, name);
    }

    public void addDataGroupNode(String bank, String name, String category, String path) {
        DataNodeV2 dataNodeV2 = DataNodeV2.dataNodeBuilder()
                .bank(bank).name(name).dataOrigin("Local")
                .category(category).path(path).auth("all")
                .build();
        switch (category) {
            case ("RealtimeDeviceGroup") -> {
                dataNodeV2.setApiPrefix(publicDatasource.getUrl());
                JSONObject usage = new JSONObject();
                usage.put("password",publicDatasource.getPassword());
                usage.put("userName",publicDatasource.getUsername());
                usage.put("tableName", "machine");
                dataNodeV2.setUsage(usage);
            }
            case ("GnssGroup") -> {
                dataNodeV2.setApiPrefix(publicDatasource.getUrl());
                JSONObject usage = new JSONObject();
                usage.put("password",publicDatasource.getPassword());
                usage.put("userName",publicDatasource.getUsername());
                usage.put("tableName", "machine"); usage.put("typeField","type"); usage.put("typeValue",1);
                usage.put("dataTable","gnss_record"); usage.put("avgNum", "60");
                dataNodeV2.setUsage(usage);
            }
            case ("StressGroup") -> {
                dataNodeV2.setApiPrefix(publicDatasource.getUrl());
                JSONObject usage = new JSONObject();
                usage.put("password",publicDatasource.getPassword());
                usage.put("userName",publicDatasource.getUsername());
                usage.put("tableName", "machine"); usage.put("typeField","type"); usage.put("typeValue",2);
                usage.put("dataTable","stresspile_record"); usage.put("avgNum", "300");
                dataNodeV2.setUsage(usage);
            }
            case ("ManometerGroup") -> {
                dataNodeV2.setApiPrefix(publicDatasource.getUrl());
                JSONObject usage = new JSONObject();
                usage.put("password",publicDatasource.getPassword());
                usage.put("userName",publicDatasource.getUsername());
                usage.put("tableName", "machine"); usage.put("typeField","type"); usage.put("typeValue",3);
                usage.put("dataTable","manometer_record"); usage.put("avgNum", "300");
                dataNodeV2.setUsage(usage);
            }
            case ("InclinometerGroup") -> {
                dataNodeV2.setApiPrefix(publicDatasource.getUrl());
                JSONObject usage = new JSONObject();
                usage.put("password",publicDatasource.getPassword());
                usage.put("userName",publicDatasource.getUsername());
                usage.put("tableName", "machine"); usage.put("typeField","type"); usage.put("typeValue",4);
                usage.put("dataTable","stresspile_record"); usage.put("avgNum", "2");
                dataNodeV2.setUsage(usage);
            }
            case ("VideoGroup") -> {
                dataNodeV2.setApiPrefix(publicDatasource.getUrl());
                JSONObject usage = new JSONObject();
                usage.put("password",publicDatasource.getPassword());
                usage.put("userName",publicDatasource.getUsername());
                usage.put("tableName", "machine"); usage.put("typeField","type");
                usage.put("typeValue",6);
                dataNodeV2.setUsage(usage);
            }
        }
        save(dataNodeV2);
    }

    private final List<String> deviceTypeList = new ArrayList<>(
            Arrays.asList("Gnss", "Stress", "Manometer", "Inclinometer", "Inclinometer_O", "Video"));

    public boolean updateDataNodeTableNameOfOneCategory(String category, String tableName) {
        ((IDataNodeRepoV2)IBaseNodeRepo).alterDataNodeTableNameOfSameCategory(category, tableName);
        return true;
    }

    public DataNodeV2 getRealtimeDeviceGroupNode(String bank) {
        return ((IDataNodeRepoV2)IBaseNodeRepo).getNodeByCategoryAndBank(
                "RealtimeDeviceGroup", bank);
    }

    public DataNodeV2 getMonitorItemNode(String bank, String deviceId) {
        return ((IDataNodeRepoV2)IBaseNodeRepo).getNodeByBankAndInfoId(
                bank, deviceId);
    }

    public DataNodeV2 getDeviceTypeDataNode(Character deviceType, String bank) {
        String deviceTypeStr = deviceTypeList.get(Character.getNumericValue(deviceType)-1);
        return ((IDataNodeRepoV2)IBaseNodeRepo).getNodeByCategoryAndBank(
                deviceTypeStr + "Group",
                bank
        );
    }

    public static String getDataNodeStringValueOfUsage(DataNodeV2 dataNode, String key) {
        return dataNode.getUsage().getString(key);
    }

    public static Integer getDataNodeIntValueOfUsage(DataNodeV2 dataNode, String key) {
        return dataNode.getUsage().getInteger(key);
    }

//    public List<DataNodeV2> getModelServerResourceNode(String category, String bank, String year, String name) {
//        return ((IDataNodeRepoV2)IBaseNodeRepo).getNodeByCategoryBankYearAndName(category, bank, year, name);
//    }
}
