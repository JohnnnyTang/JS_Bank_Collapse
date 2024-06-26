package com.johnny.bank.service.resource.data.impl;

import com.johnny.bank.aop.DynamicNodeData;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.base.DetailMonitorInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IDetailMonitorInfoRepo;
import com.johnny.bank.service.resource.data.base.IDetailMonitorInfoService;
import com.johnny.bank.utils.DataNodeSyncUtil;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.service.resource.data.impl
 * @className: DetailMonitorInfoServie
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/23 20:37
 * @version: 1.0
 */
public class DetailMonitorInfoService<T extends IDetailMonitorInfoRepo> implements IDetailMonitorInfoService {
    T detailMonitorRepo;
    final IDataNodeRepo dataNodeRepo;

    public DetailMonitorInfoService(T detailInfoRepo, IDataNodeRepo dataNodeRepo) {
        this.detailMonitorRepo = detailInfoRepo;
        this.dataNodeRepo = dataNodeRepo;
    }

    @Override
    @DynamicNodeData
    public List<DetailMonitorInfo> getDataByStationCode(DataNode dataNode, String stationCode) {
        return detailMonitorRepo.findByStationCode(stationCode);
    }

    @Override
    @DynamicNodeData
    public List<DetailMonitorInfo> getDataByStationCodeList(DataNode dataNode, List<String> stationCodeList) {
        return detailMonitorRepo.findByStationCodeList(stationCodeList);
    }

    @Override
    @DynamicNodeData
    public DetailMonitorInfo getNewestDeviceInStation(DataNode dataNode, String stationCode) {
        return detailMonitorRepo.findNewestDeviceInStation(stationCode);
    }

    @Override
    @DynamicNodeData
    public List<DetailMonitorInfo> getAllData(DataNode dataNode) {
        List<DetailMonitorInfo> detailMonitorInfos = detailMonitorRepo.findAll();
        DataNodeSyncUtil.SyncDeviceNodeWhenSpecificGroupDataChanged(detailMonitorInfos, dataNodeRepo, dataNode);
        return detailMonitorInfos;
    }

    @Override
    @DynamicNodeData
    public int getRowNumber(DataNode dataNode) {
        return detailMonitorRepo.getTotalCount();
    }

    @Override
    @DynamicNodeData
    public DetailMonitorInfo getDataById(DataNode dataNode, String id) {
        return detailMonitorRepo.findById(id);
    }

    @Override
    @DynamicNodeData
    public List<DetailMonitorInfo> getDataByIdList(DataNode dataNode, List<String> ids) {
        return detailMonitorRepo.findByIdList(ids);
    }

    @Override
    @DynamicNodeData
    public DetailMonitorInfo getDataByCode(DataNode dataNode, String code) {
        return detailMonitorRepo.findByCode(code);
    }

    @Override
    @DynamicNodeData
    public List<DetailMonitorInfo> getDataByCodeList(DataNode dataNode, List<String> codeList) {
        return detailMonitorRepo.findByCodeList(codeList);
    }

    @Override
    @DynamicNodeData
    public DetailMonitorInfo getNewestData(DataNode dataNode) {
        return detailMonitorRepo.findNewestData();
    }

    @Override
    public DataNode getDataNode() {
        return null;
    }
}
