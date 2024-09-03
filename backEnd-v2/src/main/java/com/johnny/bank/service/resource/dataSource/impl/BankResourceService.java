package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/8/29 10:14
 * @Description:
 */

@Service("BankResourceService")
public class BankResourceService {

    @Autowired
    IDataNodeRepoV2 dataNodeRepoV2;

    @Autowired
    DataNodeServiceV2 dataNodeServiceV2;

    public List<DataNodeV2> getBankList(String category) {
        // 获取所有岸段基本信息
        List<DataNodeV2> dataNodeList = dataNodeRepoV2.getNodeByCategory(category);
        if (dataNodeList.isEmpty()) {
            return new ArrayList<>();
        }
        return dataNodeList;
    }

    public String getBankInfo(String category, String name) {
        // 获取岸段详细信息
        DataNodeV2 bankDataNode = dataNodeRepoV2.getNodeByCategoryAndName(category, name);
        if (bankDataNode == null) {
            return "无此岸段信息";
        } else {
            return bankDataNode.getBasicInfo().toString();
        }
    }

    public DataNodeV2 getCalculateDataGroupNode(String dataType, String bank) {
        // 获取指定岸段的某种类型数据
        return dataNodeRepoV2.getNodeByCategoryAndBank(
                dataType + "DataGroup",
                bank
        );
    }

    public DataNodeV2 getVisualDataGroupNode(String dataType, String bank) {
        // 获取指定岸段的某种类型数据
        return dataNodeRepoV2.getNodeByCategoryAndBank(
                dataType + "TileDataGroup",
                bank
        );
    }

    public List<DataNodeV2> getStaticDataList(String path) {
        // 获取某路径下数据列表
        List<DataNodeV2> dataNodeList = dataNodeRepoV2.getNodeChildByPath(path);
        if (dataNodeList.isEmpty()) {
            return new ArrayList<>();
        }
        return dataNodeList;
    }

    public String addNewBank(String bank, JSONObject info) {
        // 新建岸段
        if (dataNodeServiceV2.getDataNodeByCategoryName("BankNode", bank + "BankNode") != null) {
                return "该岸段已存在！";
        }
        JSONObject dataNodeBasicInfo = new JSONObject();
        dataNodeBasicInfo.put("riskLevel",info.getString("riskLevel"));
        dataNodeBasicInfo.put("introduction",info.getString("introduction"));
        dataNodeBasicInfo.put("management",info.getJSONObject("management"));
        dataNodeBasicInfo.put("center",info.getString("center"));
        dataNodeBasicInfo.put("name",info.getString("name"));
        DataNodeV2 dataNode = DataNodeV2.dataNodeBuilder()
                .bank(bank).name(bank+"BankNode").dataOrigin("Local")
                .category("BankNode").path(",DataNodeHead,").basicInfo(dataNodeBasicInfo)
                .build();
        dataNodeServiceV2.save(dataNode);
        dataNodeServiceV2.addDataGroupNode(bank, "RealtimeDeviceGroupOf"+bank, "RealtimeDeviceGroup", ",DataNodeHead,"+bank+"BankNode,");
        dataNodeServiceV2.addDataGroupNode(bank, "StaticDataGroupOf"+bank, "StaticDataGroup", ",DataNodeHead,"+bank+"BankNode,");
        dataNodeServiceV2.addDataGroupNode(bank, "ModelDataGroupOf"+bank, "ModelDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "HydrodynamicDataGroupOf"+bank, "HydrodynamicDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "BoundaryDataGroupOf"+bank, "BoundaryDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "DEMDataGroupOf"+bank, "DEMDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "ConfigDataGroupOf"+bank, "ConfigDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",");
        return "岸段 " + info.getString("name") + " 新建成功！";
    }

    public String deleteBank(String bank) {
        DataNodeV2 bankDataNode = dataNodeServiceV2.getDataNodeByCategoryName("BankNode",bank+"BankNode");
        String path = "^(?i),?DataNodeHead," + bank + "BankNode,.*";
        List<DataNodeV2> deleteDataNodes = dataNodeRepoV2.getNodeChildByPath(path);
        deleteDataNodes.add(bankDataNode);
        for (DataNodeV2 dataNode : deleteDataNodes) {
            String id = dataNode.getId();
            dataNodeRepoV2.deleteById(id);
        }
        return "岸段 " + bankDataNode.getBasicInfo().getString("name") + " 删除成功！";
    }

    public String updateBankInfo(String bank, JSONObject info) {
        JSONObject dataNodeBasicInfo = new JSONObject();
        dataNodeBasicInfo.put("riskLevel",info.getString("riskLevel"));
        dataNodeBasicInfo.put("introduction",info.getString("introduction"));
        dataNodeBasicInfo.put("management",info.getJSONObject("management"));
        dataNodeBasicInfo.put("center",info.getString("center"));
        dataNodeBasicInfo.put("name",info.getString("name"));
        DataNodeV2 dataNode = DataNodeV2.dataNodeBuilder()
                .bank(bank).name(bank+"BankNode").dataOrigin("Local")
                .category("BankNode").path(",DataNodeHead,").basicInfo(dataNodeBasicInfo)
                .build();
        String bankDataNodeId = dataNodeServiceV2.getDataNodeByCategoryName("BankNode",bank+"BankNode").getId();
        dataNodeServiceV2.updateNodeById(bankDataNodeId, dataNode);
        return "岸段 " + info.getString("name") + " 信息更新成功！";
    }
}
