package com.johnny.bank.service.node.impl;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.*;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.utils.DataNodeUtil;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/21
 * @Description:
 */
@Service("DataNodeServiceV2")
public class DataNodeServiceV2 extends NodeService<DataNodeV2> {

    @Override
    public String save(DataNodeV2 dataNode) {
        return IBaseNodeRepo.save(dataNode).getId();
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

    public DataNodeV2 getStaticDataGroupNode(String dataType, String bank) {
        return ((IDataNodeRepoV2)IBaseNodeRepo).getNodeByCategoryAndBank(
                dataType + "DataGroup",
                bank
        );
    }

    public JSONArray getStaticDataList(String path) {

        List<DataNodeV2> dataNodeList = IBaseNodeRepo.getNodeChildByPath(path);
        if (dataNodeList.isEmpty()) {
            return new JSONArray();
        }
        return DataNodeUtil.transferToFolderList(dataNodeList);
    }

    public static String getDataNodeStringValueOfUsage(DataNodeV2 dataNode, String key) {
        return dataNode.getUsage().getString(key);
    }

    public static Integer getDataNodeIntValueOfUsage(DataNodeV2 dataNode, String key) {
        return dataNode.getUsage().getInteger(key);
    }

    public List<DataNodeV2> getModelServerResourceNode(String category, String bank, String year, String name) {
        return ((IDataNodeRepoV2)IBaseNodeRepo).getNodeByCategoryBankYearAndName(category, bank, year, name);
    }
}
