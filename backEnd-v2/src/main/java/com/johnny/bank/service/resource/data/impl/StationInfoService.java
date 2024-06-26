package com.johnny.bank.service.resource.data.impl;

import com.johnny.bank.aop.DynamicNodeData;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.StationInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IStationInfoRepo;
import com.johnny.bank.service.resource.data.IStationInfoService;
import com.johnny.bank.utils.DataNodeSyncUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
@Service("StationInfoService")
public class StationInfoService implements IStationInfoService {

    private IStationInfoRepo stationRepo;
    private IDataNodeRepo dataNodeRepo;

    @Autowired
    @Qualifier("StationRepo")
    public void setStationRepo(IStationInfoRepo stationRepo) {
        this.stationRepo = stationRepo;
    }
    @Autowired
    @Qualifier("DataNodeRepo")
    public void setDataNodeRepo(IDataNodeRepo dataNodeRepo) {
        this.dataNodeRepo = dataNodeRepo;
    }


    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName("StationInfoGroup", "stationInfoGroupOfTestBank");
    }

    @Override
    @DynamicNodeData
    public List<StationInfo> getAllData(DataNode dataNode) {
        List<StationInfo> stationInfoList = stationRepo.findAll();
        DataNodeSyncUtil.SyncNoLinkDataNodeWhenDataChanged(stationInfoList, dataNodeRepo, dataNode);
        return stationInfoList;
    }

    @Override
    @DynamicNodeData
    public int getRowNumber(DataNode dataNode) {
        return stationRepo.getTotalCount();
    }

    @Override
    @DynamicNodeData
    public StationInfo getDataById(DataNode dataNode, String id) {
        return stationRepo.findById(id);
    }

    @Override
    @DynamicNodeData
    public List<StationInfo> getDataByIdList(DataNode dataNode, List<String> ids) {
        return stationRepo.findByIdList(ids);
    }

    @Override
    @DynamicNodeData
    public StationInfo getDataByCode(DataNode dataNode, String stationCode) {
        return stationRepo.findByCode(stationCode);
    }

    @Override
    @DynamicNodeData
    public List<StationInfo> getDataByCodeList(DataNode dataNode, List<String> stationCodeList) {
        return stationRepo.findByCodeList(stationCodeList);
    }

    @Override
    @DynamicNodeData
    public StationInfo getNewestData(DataNode dataNode) {
        return stationRepo.findNewestData();
    }
}
