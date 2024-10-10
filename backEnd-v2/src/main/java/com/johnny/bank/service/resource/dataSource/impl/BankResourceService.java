package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.common.DefaultDatasource;
import com.johnny.bank.model.common.PublicDatasource;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.utils.FileUtil;
import com.johnny.bank.utils.VectorUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static java.awt.SystemColor.info;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/8/29 10:14
 * @Description:
 */

@Service("BankResourceService")
public class BankResourceService {

    @Value("${staticData.tifTilePath}")
    String tifTilePath;

    @Value("${staticData.draftDataPath}")
    String draftDataPath;

    @Value("${staticData.waterConditionPath}")
    String waterConditionPath;

    @Autowired
    ModelServerService modelServerService;

    @Autowired
    IDataNodeRepoV2 dataNodeRepoV2;

    @Autowired
    DataNodeServiceV2 dataNodeServiceV2;

    @Autowired
    @Qualifier("publicDatasource")
    PublicDatasource publicDatasource;

    public Boolean ifBankExist(String bank) {
        boolean flag = false;
        List<DataNodeV2> bankNodes = getBankList("BankNode");
        for (DataNodeV2 dataNode : bankNodes) {
            if (dataNode.getBank().equals(bank)) {
                flag = true; break;
            }
        }
        return flag;
    }

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

    public DataNodeV2 getTileVisualDataGroupNode(String dataType, String bank) {
        // 获取指定岸段的某种类型数据
        return dataNodeRepoV2.getNodeByCategoryAndBank(
                dataType + "TileDataGroup",
                bank
        );
    }

    public DataNodeV2 getVectorVisualDataGroupNode(String bank) {
        // 获取指定岸段的某种类型数据
        return dataNodeRepoV2.getNodeByCategoryAndBank(
                "VectorDataGroup",
                bank
        );
    }

    public DataNodeV2 getDeviceDataGroupNode(String bank, String typeCode) {
        // 获取指定岸段的某种类型数据
        String groupName;
        switch (typeCode) {
            case "1" -> {groupName = "GnssGroup";}
            case "2" -> {groupName = "StressGroup";}
            case "3" -> {groupName = "ManometerGroup";}
            case "4" -> {groupName = "InclinometerGroup";}
            case "6" -> {groupName = "VideoGroup";}
            default -> {
                return DataNodeV2.dataNodeBuilder().build();
            }
        }
        return dataNodeRepoV2.getNodeByCategoryAndBank(
                groupName,
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

    public JSONArray getWaterCondition() {
        String waterCondition = waterConditionPath + File.separator + "water.json";
        return JSONArray.parseArray(FileUtil.getFileContent(waterCondition));
    }
    public JSONArray getTidalRange() {
        String tidalRange = waterConditionPath + File.separator + "tidalRange.json";
        return JSONArray.parseArray(FileUtil.getFileContent(tidalRange));
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
        dataNodeBasicInfo.put("monitorLength", info.getString("monitorLength"));
        dataNodeBasicInfo.put("monitorStartTime", info.getString("monitorStartTime"));
        DataNodeV2 dataNode = DataNodeV2.dataNodeBuilder()
                .bank(bank).name(bank+"BankNode").dataOrigin("Local").auth("all")
                .category("BankNode").path(",DataNodeHead,").basicInfo(dataNodeBasicInfo)
                .build();
        // 根节点(1)
        dataNodeServiceV2.save(dataNode);
        // 静态数据节点(2)
        dataNodeServiceV2.addDataGroupNode(bank, "StaticDataGroupOf"+bank, "StaticDataGroup", ",DataNodeHead,"+bank+"BankNode,");
        // 可视化数据节点(3)
        dataNodeServiceV2.addDataGroupNode(bank, "VisualizationDataGroupOf"+bank, "VisualizationDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",");
        // 瓦片数据节点(4)
        dataNodeServiceV2.addDataGroupNode(bank, "DEMTileDataGroupOf"+bank, "DEMTileDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",VisualizationDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "VectorDataGroupOf"+bank, "VectorDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",VisualizationDataGroupOf"+bank+",");
        // 模型计算数据节点(3)
        dataNodeServiceV2.addDataGroupNode(bank, "ModelDataGroupOf"+bank, "ModelDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",");
        // 水动力，边界，dem，配置数据节点(4)
        dataNodeServiceV2.addDataGroupNode(bank, "HydrodynamicDataGroupOf"+bank, "HydrodynamicDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "BoundaryDataGroupOf"+bank, "BoundaryDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "DEMDataGroupOf"+bank, "DEMDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "ConfigDataGroupOf"+bank, "ConfigDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",");
        // 设备数据节点（2）
        dataNodeServiceV2.addDataGroupNode(bank, "RealtimeDeviceGroupOf"+bank, "RealtimeDeviceGroup",",DataNodeHead,"+bank+"BankNode,");
        // 四种设备数据节点（3）
        dataNodeServiceV2.addDataGroupNode(bank, "GnssGroupOf"+bank, "GnssGroup", ",DataNodeHead,"+bank+"BankNode,RealtimeDeviceGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "InclinometerGroupOf"+bank, "InclinometerGroup", ",DataNodeHead,"+bank+"BankNode,RealtimeDeviceGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "ManometerGroupOf"+bank, "ManometerGroup", ",DataNodeHead,"+bank+"BankNode,RealtimeDeviceGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "StressGroupOf"+bank, "StressGroup", ",DataNodeHead,"+bank+"BankNode,RealtimeDeviceGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "VideoGroupOf"+bank, "VideoGroup", ",DataNodeHead,"+bank+"BankNode,RealtimeDeviceGroupOf"+bank+",");
        return "岸段 " + info.getString("name") + " 新建成功！";
    }
    public String deleteBank(String bank) {
        DataNodeV2 bankDataNode = dataNodeServiceV2.getDataNodeByCategoryName("BankNode",bank+"BankNode");
        String bankPath = "^(?i),?DataNodeHead," + bank + "BankNode,.*";
        String vectorPath = ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",VisualizationDataGroupOf"+bank+","+"VectorDataGroupOf"+bank+",";
//        String modelResourcePath = ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",ModelServerDataGroupOf"+bank+",";
        // 检测岸段是否存在
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        // 删除矢量资源
        List<DataNodeV2> vectorDataNodes = dataNodeRepoV2.getNodeChildByPath(vectorPath);
        for (DataNodeV2 vectorDataNode : vectorDataNodes) {
            deleteVector(vectorDataNode.getBank(), vectorDataNode.getName());
        }
        // 删除本地瓦片资源
        File deleteTileFolder = new File(tifTilePath + "/tile/" + bank);
        File deleteDraftFolder = new File(draftDataPath + "/tif/" + bank);
        FileUtil.deleteFolder(deleteTileFolder);
        FileUtil.deleteFolder(deleteDraftFolder);
        // 删除岸段所有数据节点
        List<DataNodeV2> deleteDataNodes = dataNodeRepoV2.getNodeChildByPath(bankPath);
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

    public String uploadVisualizationResourceData(MultipartFile file, String bank, JSONObject info) throws IOException, InterruptedException {
        String category = "VectorDataItem";
        String name = info.getString("name");
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        if (dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name) != null) {
            return "数据资源 "+name+" 已存在！";
        }
        if (!VectorUtil.shpVector2pg(file, info, bank)) {
            return "矢量可视化资源 "+name+" 上传失败！";
        } else {
            DataNodeV2 vectorDataNode = VectorUtil.vector2DataNode(bank, info);
            dataNodeServiceV2.save(vectorDataNode);
            return "矢量可视化资源 "+name+" 上传完成！";
        }
    }
    public String updateVisualizationResourceData(MultipartFile file, String bank, String name, JSONObject info) throws IOException, InterruptedException {
        String category = "VectorDataItem";
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        DataNodeV2 vectorDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (vectorDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        if (!VectorUtil.deletePgVector(vectorDataNode.getBasicInfo().getString("tableName"))) {
            return "矢量可视化资源 " + name + " 更新失败！";
        } else {
            if (!VectorUtil.shpVector2pg(file, info, bank)) {
                return "矢量可视化资源 "+name+" 更新失败！";
            } else {
                DataNodeV2 newVectorDataNode = VectorUtil.vector2DataNode(bank, info);
                dataNodeServiceV2.updateNodeById(vectorDataNode.getId(), newVectorDataNode);
                return "矢量可视化资源 "+name+" 更新成功！";
            }
        }
    }
    public String updateVisualizationResourceDataInfo(String bank, String name, JSONObject info) {
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        String category = "VectorDataItem";
        String newName = info.getString("name");
        DataNodeV2 vectorDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (vectorDataNode == null) {
            return "矢量可视化资源 "+name+" 不存在！";
        }
        if (!name.equals(newName)) {
            if (!VectorUtil.updateTableName(bank, name, newName)) {
                return "矢量可视化资源 "+newName+" 信息修改失败！";
            }
        }
        DataNodeV2 newVectorDataNode = VectorUtil.vector2DataNode(bank, info);
        dataNodeServiceV2.updateNodeById(vectorDataNode.getId(),newVectorDataNode);
        return "矢量可视化资源 "+newName+" 信息修改完成！";
    }
    public String deleteVector(String bank, String name) {
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        String category = "VectorDataItem";
        DataNodeV2 vectorDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (vectorDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        dataNodeRepoV2.deleteById(vectorDataNode.getId());
        if (!VectorUtil.deletePgVector(vectorDataNode.getBasicInfo().getString("tableName"))) {
            return "矢量可视化资源 " + name + " 删除失败！";
        } else {
            return "矢量可视化资源 " + name + " 删除成功！";
        }
    }

    public String uploadDeviceResourceData(String bank, JSONObject data) {
        DataNodeV2 dataNode = deviceDataProcess(bank, data);
        if (!ifBankExist(dataNode.getBank())) {
            return "岸段 "+dataNode.getBank()+" 不存在！";
        }
        if (dataNode.getBank() == null) {
            return "无法注册此类设备";
        }
        if (dataNodeRepoV2.getDeviceNodeByCode(dataNode.getBasicInfo().getString("code")) != null) {
            return "该设备已被注册！请勿重复";
        }
        dataNodeServiceV2.save(dataNode);
        return "设备"+data.getString("deviceId")+"已上传并注册成功!";
    }
    public String updateDeviceResourceData(String bank, String code, JSONObject data) {
        DataNodeV2 deviceDataNode = dataNodeRepoV2.getDeviceNodeByCode(code);
        DataNodeV2 dataNode = deviceDataProcess(bank, data);
        if (dataNode.getBank() == null) {
            return "更新设备类型错误";
        }
        String bankDataNodeId = deviceDataNode.getId();
        dataNodeServiceV2.updateNodeById(bankDataNodeId, dataNode);
        return "设备"+data.getString("deviceId")+"信息更新成功!";
    }
    public String deleteDevice(String code) {
        String bankDataNodeId = dataNodeRepoV2.getDeviceNodeByCode(code).getId();
        dataNodeRepoV2.deleteById(bankDataNodeId);
        return "设备 " + code + " 删除成功！";
    }
    private DataNodeV2 deviceDataProcess(String bank, JSONObject data) {
        String aspect = data.getString("aspect"); String deviceName = data.getString("deviceName");
        String type = data.getString("type"); Double longitude = data.getDouble("longitude"); Double latitude = data.getDouble("latitude");
        Double elevation = data.getDouble("elevation"); String deviceId = data.getString("deviceId");
        String typeName; String tableNamePre = null;
        switch (type) {
            case "1" -> {typeName = "Gnss"; tableNamePre = "gnss";}
            case "2" -> {typeName = "Stress"; tableNamePre = "stresspile";}
            case "3" -> {typeName = "Manometer"; tableNamePre = "manometer";}
            case "4" -> {typeName = "Inclinometer"; tableNamePre = "inclinometer";}
            case "6" -> {typeName = "Video"; tableNamePre = "vedio";}
            default -> {
                return DataNodeV2.dataNodeBuilder().build();
            }
        }
        String category = typeName+"Monitor";
        String code = bank + longitude + "_" + latitude + "_" + type;
        String startTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        JSONObject basicInfo = new JSONObject();
        basicInfo.put("begTime", startTime); basicInfo.put("code", code); basicInfo.put("elevation", elevation); basicInfo.put("inTime", startTime);
        basicInfo.put("latitude", latitude); basicInfo.put("longitude", longitude); basicInfo.put("machineId", deviceId); basicInfo.put("name", deviceName);
        basicInfo.put("operateDesc", ""); basicInfo.put("operateFlag", 1); basicInfo.put("operationTime", startTime); basicInfo.put("operateUser", "Admin");
        basicInfo.put("sectionId", aspect); basicInfo.put("stationCode", bank);basicInfo.put("type", type);
        JSONObject usage = new JSONObject();
        usage.put("userName", publicDatasource.getUsername()); usage.put("password", publicDatasource.getPassword()); usage.put("tableName",tableNamePre+"_record");
        return DataNodeV2.dataNodeBuilder()
                .bank(bank).name(deviceName).dataOrigin("DB").auth("all").apiPrefix(publicDatasource.getUrl())
                .category(category).path(",DataNodeHead,"+bank+"BankNode"+",RealtimeDeviceGroupOf"+bank+","+typeName+"GroupOf"+bank+",")
                .basicInfo(basicInfo).usage(usage)
                .build();
    }
}
