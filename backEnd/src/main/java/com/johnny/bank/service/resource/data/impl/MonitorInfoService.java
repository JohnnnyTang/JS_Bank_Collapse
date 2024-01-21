package com.johnny.bank.service.resource.data.impl;

import com.johnny.bank.aop.DynamicNodeData;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IMonitorInfoRepo;
import com.johnny.bank.service.resource.data.IMonitorInfoService;
import com.johnny.bank.utils.DataNodeSyncUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
@Service("DeviceInfoService")
public class MonitorInfoService implements IMonitorInfoService {
    private final IDataNodeRepo dataNodeRepo;
    private final IMonitorInfoRepo deviceInfoRepo;
    private final List<String> deviceTypeList = new ArrayList<>(){{
       add("gnss");
    }};

    public MonitorInfoService(@Qualifier("DataNodeRepo") IDataNodeRepo DataNodeRepo, @Qualifier("DeviceInfoRepo") IMonitorInfoRepo DeviceInfoRepo) {
        this.dataNodeRepo = DataNodeRepo;
        this.deviceInfoRepo = DeviceInfoRepo;
    }

    @Override
    @DynamicNodeData
    public List<MonitorInfo> getAllData(DataNode dataNode) {
        List<MonitorInfo> monitorInfoList = deviceInfoRepo.findAll();
        DataNodeSyncUtil.SyncDeviceNodeWhenDataChanged(monitorInfoList, dataNodeRepo, dataNode);
        return monitorInfoList;
    }

    @DynamicNodeData
    @Override
    public int getRowNumber(DataNode dataNode) {
        return deviceInfoRepo.getTotalCount();
    }

    @DynamicNodeData
    @Override
    public MonitorInfo getDataById(DataNode dataNode, String id) {
        return deviceInfoRepo.findById(id);
    }

    @DynamicNodeData
    @Override
    public List<MonitorInfo> getDataByIdList(DataNode dataNode, List<String> ids) {
        return deviceInfoRepo.findByIdList(ids);
    }

    @DynamicNodeData
    @Override
    public MonitorInfo getDataByCode(DataNode dataNode, int code) {
        return deviceInfoRepo.findByCode(code);
    }

    @DynamicNodeData
    @Override
    public List<MonitorInfo> getDataByCodeList(DataNode dataNode, List<Integer> codeList) {
        return deviceInfoRepo.findByCodeList(codeList);
    }

    @DynamicNodeData
    @Override
    public MonitorInfo getNewestData(DataNode dataNode) {
        return deviceInfoRepo.findNewestData();
    }

    @Override
    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName(
                "MonitorInfoGroup", "monitorInfoGroupOfTestBank");
    }

    @DynamicNodeData
    @Override
    public List<MonitorInfo> getDataByStationCode(DataNode dataNode, int stationCode) {
        return deviceInfoRepo.findByStationCode(stationCode);
    }

    @DynamicNodeData
    @Override
    public List<MonitorInfo> getDataByStationCodeList(DataNode dataNode, List<Integer> stationCodeList) {
        return deviceInfoRepo.findByStationCodeList(stationCodeList);
    }

    @DynamicNodeData
    @Override
    public MonitorInfo getNewestDeviceInStation(DataNode dataNode, int stationCode) {
        return deviceInfoRepo.findNewestDeviceInStation(stationCode);
    }

    @Override
    @DynamicNodeData
    public List<MonitorInfo> getDeviceByType(DataNode dataNode, String deviceType) {
        return deviceInfoRepo.findDeviceByType(deviceTypeList.indexOf(deviceType)+1);
    }
}
