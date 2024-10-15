package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.aop.DynamicNodeDataV2;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IMonitorInfoRepoV2;
import org.springframework.aop.framework.AopContext;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
@Service("MonitorInfoService")
public class MonitorInfoServiceV2 {
    private final IDataNodeRepoV2 dataNodeRepo;
    private final IMonitorInfoRepoV2 deviceInfoRepo;

    private final List<String> deviceTypeList = new ArrayList<>(
            Arrays.asList("Gnss", "Stress", "Manometer", "Inclinometer", "Inclinometer_O", "Video"));

    public MonitorInfoServiceV2(
            @Qualifier("DataNodeRepoV2") IDataNodeRepoV2 DataNodeRepo,
            @Qualifier("MonitorInfoRepo") IMonitorInfoRepoV2 DeviceInfoRepo

    ) {
        this.dataNodeRepo = DataNodeRepo;
        this.deviceInfoRepo = DeviceInfoRepo;
    }

    private String getDataNodeTableName(DataNodeV2 dataNode) {
        return dataNode.getUsage().getString("tableName");
    }

    private Integer getDataNodeTypeValue(DataNodeV2 dataNode) {
        return dataNode.getUsage().getInteger("typeValue");
    }

    private String getDataNodeValueOfUsage(DataNodeV2 dataNode, String key) {
        return dataNode.getUsage().getString(key);
    }

    @DynamicNodeDataV2
    public List<MonitorInfo> getAllData(DataNodeV2 dataNode) {
        //        DataNodeSyncUtil.SyncDeviceNodeWhenBaseGroupDataChanged(monitorInfoList, dataNodeRepo, dataNode);
        return deviceInfoRepo.findAll(getDataNodeTableName(dataNode));
    }

    @DynamicNodeDataV2
    public int getRowNumber(DataNodeV2 dataNode) {
        return deviceInfoRepo.getTotalCount(getDataNodeTableName(dataNode));
    }

    @DynamicNodeDataV2
    public MonitorInfo getInfoById(DataNodeV2 dataNode, String id) {
        return deviceInfoRepo.findById(id, getDataNodeTableName(dataNode));
    }

    public MonitorInfo getInfoByTypeAndIdFromNode(String bank, String type, String id) {
        JSONObject info = dataNodeRepo.getNodeByCategoryAndBankAndInfoId(
                        deviceTypeList.get(Integer.parseInt(type)-1) + "Monitor", bank, id
                ).getBasicInfo();
//        MonitorInfo monitorInfo = info.to(MonitorInfo.class);
        return info.to(MonitorInfo.class);
    }

    public MonitorInfo getInfoByIdFromNode(String bank, String id) {
        JSONObject info = dataNodeRepo.getNodeByBankAndInfoId(
                bank, id
        ).getBasicInfo();
//        MonitorInfo monitorInfo = info.to(MonitorInfo.class);
        return info.to(MonitorInfo.class);
    }

    @DynamicNodeDataV2
    public List<MonitorInfo> getInfoByIdList(DataNodeV2 dataNode, List<String> ids) {
        return deviceInfoRepo.findByIdList(ids, getDataNodeTableName(dataNode));
    }

    @DynamicNodeDataV2
    public MonitorInfo getNewestData(DataNodeV2 dataNode) {
        return deviceInfoRepo.findNewestData(getDataNodeTableName(dataNode));
    }

//    
//    public DataNodeV2 getDataNode(String bank) {
//        return dataNodeRepo.getNodeByCategoryAndBank(
//                "RealtimeDeviceGroup", bank);
//    }

    public DataNodeV2 getDeviceTypeDataNode(Character deviceType, String bank) {
        String deviceTypeStr = deviceTypeList.get(Character.getNumericValue(deviceType)-1);
        return dataNodeRepo.getNodeByCategoryAndBank(
                deviceTypeStr + "Group",
                bank
        );
    }

    @DynamicNodeDataV2
    public List<MonitorInfo> getInfoByStationCode(DataNodeV2 dataNode, String stationCode) {
        return deviceInfoRepo.findByStationCode(stationCode, getDataNodeTableName(dataNode));
    }

    @DynamicNodeDataV2
    public List<MonitorInfo> getInfoByStationCodeList(DataNodeV2 dataNode, List<String> stationCodeList) {
        return deviceInfoRepo.findByStationCodeList(stationCodeList, getDataNodeTableName(dataNode));
    }

    @DynamicNodeDataV2
    public MonitorInfo getNewestDeviceInStation(DataNodeV2 dataNode, String stationCode) {
        return deviceInfoRepo.findNewestDeviceInStation(stationCode, getDataNodeTableName(dataNode));
    }

    
    @DynamicNodeDataV2
    public List<MonitorInfo> getDeviceByTypeWithTypeNode(DataNodeV2 dataNode) {
//        System.out.println(Character.forDigit(getDataNodeTypeValue(dataNode),10));
        return deviceInfoRepo.findDeviceByType(
                getDataNodeValueOfUsage(dataNode, "typeField"),
                Character.forDigit(getDataNodeTypeValue(dataNode),10), getDataNodeTableName(dataNode)
        );
    }

    public List<MonitorInfo> getDeviceByTypeChar(Character typeCode, String bank) {
        DataNodeV2 typeNode = getDeviceTypeDataNode(typeCode, bank);
        // 内部this调用AOP会不生效!!!
//        return getDeviceByTypeWithTypeNode(typeNode);
        // 需要使用aop找到当前proxy代理对象并调用方法
        return ((MonitorInfoServiceV2) AopContext.currentProxy()).getDeviceByTypeWithTypeNode(typeNode);
    }

    public List<String> getDeviceIdListByType(Character deviceType, String bank) {
        List<MonitorInfo> monitorInfoList = getDeviceByTypeChar(deviceType, bank);
        List<String> monitorIdList = new ArrayList<>();
        for(MonitorInfo monitorInfo:monitorInfoList) {
            monitorIdList.add(monitorInfo.getCode());
        }
        return monitorIdList;
    }
}
