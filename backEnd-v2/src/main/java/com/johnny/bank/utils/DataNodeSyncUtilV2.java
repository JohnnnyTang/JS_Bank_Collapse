package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.service.resource.dataSource.impl.MonitorInfoServiceV2;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description: deal with data and node sync problems
 */
public class DataNodeSyncUtilV2 {
    public static final List<String> deviceTypeList = new ArrayList<>(
            Arrays.asList("Gnss", "Stress", "Manometer", "Inclinometer", "Inclinometer_O", "Video"));

    public static DataNodeV2 CreateDataNodeFromMonitorData(
            MonitorInfo monitorInfo, DataNodeV2 parentNode, String deviceTypeString
    ) {
        JSONObject parentUsage = parentNode.getUsage();
        parentUsage.put("tableName", deviceTypeString.toLowerCase() + "_record");
        parentUsage.remove("typeField");
        parentUsage.remove("typeValue");
        return DataNodeV2.dataNodeBuilder().auth("all").name(monitorInfo.getName())
                .path(parentNode.getPath() + parentNode.getName() + ",").dataOrigin("DB")
                .category(deviceTypeString + "Monitor").apiPrefix(parentNode.getApiPrefix())
                .bank(parentNode.getBank()).usage(parentUsage).
                basicInfo(JSON.parseObject(JSONObject.toJSONString(monitorInfo))) // make it string first to format date
                .build();
    }

    public static List<Integer> SyncMonitorNodeOfTreeAndOrigin(String bank) {
        List<Character> typeCodeList = List.of('1', '2', '3', '4', '6');
        IDataNodeRepoV2 dataNodeRepoV2 = BeanUtil.getBean(IDataNodeRepoV2.class);
        MonitorInfoServiceV2 monitorInfoServiceV2 = BeanUtil.getBean(MonitorInfoServiceV2.class);
        List<Integer> addDeleteNumList = new ArrayList<>(List.of(0, 0));
        for(Character typeCode: typeCodeList) {
            List<MonitorInfo> typeMonitorList = monitorInfoServiceV2.getDeviceByTypeChar(typeCode, bank);
//            System.out.println(typeMonitorList);
            String deviceTypeStr = deviceTypeList.get(Character.getNumericValue(typeCode)-1);
            DataNodeV2 typeNode = dataNodeRepoV2.getNodeByCategoryAndBank(
                    deviceTypeStr + "Group",
                    bank
            );
            if(typeNode == null) {
                System.out.println("No this type of monitor node...Please Check!!!");
                continue;
            }
            List<DataNodeV2> typeChildNodeList = dataNodeRepoV2.getNodeChildByPath(
                    "," + typeNode.getName() + ",$"
            );
            // check if there is monitor not mounted on tree
            for(MonitorInfo monitorInfo: typeMonitorList) {
                DataNodeV2 monitorNode = dataNodeRepoV2.getNodeByCategoryAndBankAndInfoId(
                        deviceTypeStr + "Monitor", bank, monitorInfo.getCode()
                );
                if(monitorNode == null) {
                    DataNodeV2 newNode = CreateDataNodeFromMonitorData(monitorInfo, typeNode, deviceTypeStr);
                    dataNodeRepoV2.save(newNode);
                    addDeleteNumList.set(0, addDeleteNumList.get(0) + 1);
                }
            }
            // check if there is monitor deleted from origin table
            for(DataNodeV2 childNode: typeChildNodeList) {
                String monitorCode = childNode.getBasicInfo().getString("code");
                MonitorInfo monitorInfo = monitorInfoServiceV2.getInfoById(typeNode, monitorCode);
                if(monitorInfo == null) {
                    System.out.println("not in origin table delete: \n"+ childNode);
                    dataNodeRepoV2.delete(childNode);
                    addDeleteNumList.set(0, addDeleteNumList.get(0) - 1);
                }
            }

        }

        System.out.println("add Node +" + addDeleteNumList.get(0));
        System.out.println("delete Node " + addDeleteNumList.get(1));
        return addDeleteNumList;
    }

    // TODO: 从数据库更新节点的basic info
}
