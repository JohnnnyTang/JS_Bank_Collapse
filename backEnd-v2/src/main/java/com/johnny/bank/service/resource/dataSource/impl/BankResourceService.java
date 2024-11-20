package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.aop.DynamicNodeDataV2;
import com.johnny.bank.model.common.DefaultDatasource;
import com.johnny.bank.model.common.PublicDatasource;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.ImportantBankRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.SectionDataRepo;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.utils.FileUtil;
import com.johnny.bank.utils.InternetUtil;
import com.johnny.bank.utils.VectorUtil;
import com.johnny.bank.utils.ZipUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileWriter;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static java.awt.SystemColor.info;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/8/29 10:14
 * @Description:
 */

@Service("BankResourceService")
@Slf4j
public class BankResourceService {

    @Value("${staticData.tifTilePath}")
    String tifTilePath;

    @Value("${staticData.draftDataPath}")
    String draftDataPath;

    @Value("${staticData.pictureDataPath}")
    String pictureDataPath;

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

    @Autowired
    SectionDataRepo sectionDataRepo;

    @Autowired
    IDataNodeRepoV2 iDataNodeRepoV2;

    @Autowired
    ImportantBankRepo importantBankRepo;

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

    // 模型计算资源操作
    public DataNodeV2 getCalculateDataGroupNode(String dataType, String bank) {
        // 获取指定岸段的某种类型数据
        return dataNodeRepoV2.getNodeByCategoryAndBank(
                dataType + "DataGroup",
                bank
        );
    }

    // 静态资源获取
    public List<DataNodeV2> getStaticDataList(String path) {
        // 获取某路径下数据列表
        List<DataNodeV2> dataNodeList = dataNodeRepoV2.getNodeChildByPath(path);
        if (dataNodeList.isEmpty()) {
            return new ArrayList<>();
        }
        return dataNodeList;
    }

    // 实时水情资源获取
    public JSONArray getWaterCondition() {
        String waterCondition = waterConditionPath + File.separator + "water.json";
        return JSONArray.parseArray(FileUtil.getFileContent(waterCondition));
    }
    public JSONArray getTidalRange() {
        String tidalRange = waterConditionPath + File.separator + "tidalRange.json";
        return JSONArray.parseArray(FileUtil.getFileContent(tidalRange));
    }

    // 岸段资源操作
    public String getBankInfo(String category, String name) {
        // 获取岸段详细信息
        DataNodeV2 bankDataNode = dataNodeRepoV2.getNodeByCategoryAndName(category, name);
        if (bankDataNode == null) {
            return "无此岸段信息";
        } else {
            return bankDataNode.getBasicInfo().toString();
        }
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
        // 岸段根节点(1)
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
        // 信息数据节点(3)
        dataNodeServiceV2.addDataGroupNode(bank, "InformationDataGroupOf"+bank, "InformationDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",");
        // 图片，文本，pdf数据节点(4)
        dataNodeServiceV2.addDataGroupNode(bank, "PictureDataGroupOf"+bank, "PictureDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",InformationDataGroupOf"+bank+",");
        dataNodeServiceV2.addDataGroupNode(bank, "TextDataGroupOf"+bank, "TextDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",InformationDataGroupOf"+bank+",");
        // 断面数据节点(3)
        dataNodeServiceV2.addDataGroupNode(bank, "SectionDataGroupOf"+bank, "SectionDataGroup", ",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",");

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
        File deletePictureFolder = new File(pictureDataPath + "/" + bank);
        FileUtil.deleteFolder(deleteTileFolder);
        FileUtil.deleteFolder(deleteDraftFolder);
        FileUtil.deleteFolder(deletePictureFolder);
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
        dataNodeBasicInfo.put("name",info.getString("name"));
        dataNodeBasicInfo.put("riskLevel",info.getString("riskLevel"));
        dataNodeBasicInfo.put("introduction",info.getString("introduction"));
        dataNodeBasicInfo.put("management",info.getJSONObject("management"));
        dataNodeBasicInfo.put("center",info.getString("center"));
        dataNodeBasicInfo.put("monitorLength",info.getString("monitorLength"));
        dataNodeBasicInfo.put("monitorStartTime",info.getString("monitorStartTime"));
        DataNodeV2 dataNode = DataNodeV2.dataNodeBuilder()
                .bank(bank).name(bank+"BankNode").dataOrigin("Local")
                .category("BankNode").path(",DataNodeHead,").basicInfo(dataNodeBasicInfo)
                .build();
        String bankDataNodeId = dataNodeServiceV2.getDataNodeByCategoryName("BankNode",bank+"BankNode").getId();
        dataNodeServiceV2.updateNodeById(bankDataNodeId, dataNode);
        return "岸段 " + info.getString("name") + " 信息更新成功！";
    }

    // 信息资源操作
    public DataNodeV2 getPictureDataGroupNode(String bank) {
        return dataNodeRepoV2.getNodeByCategoryAndBank(
                "PictureDataGroup",
                bank
        );
    }
    public byte[] getPictureResourceByteDataByBankAndName(String bank, String name) {
        String category = "PictureDataItem";
        if (!ifBankExist(bank)) {
            return null;
        }
        DataNodeV2 pictureDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (pictureDataNode == null) {
            return null;
        }
        String path = pictureDataNode.getUsage().getString("path");
        String fileName = pictureDataNode.getUsage().getString("name");
        String filePath = pictureDataPath + path + fileName;
        return FileUtil.getByteStreamFromFile(filePath);
    }

    public String uploadPictureResourceData(MultipartFile file, String bank, JSONObject info) throws IOException {
        String category = "PictureDataItem";
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        JSONObject usage = new JSONObject();
        String name = info.getString("name");
        DataNodeV2 pictureDataNodeBefore = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (pictureDataNodeBefore != null) {
            return "数据资源 "+name+" 已存在！请更换名称";
        }
        String filePath = pictureDataPath + "/" + bank;
        String storeFileName = FileUtil.generateNewFileName(file.getOriginalFilename());
        FileUtil.storeFile(file, filePath, storeFileName);
        usage.put("path", "/"+bank);usage.put("name",storeFileName);
        DataNodeV2 pictureDataNode = DataNodeV2.dataNodeBuilder()
                .bank(bank).auth("all").name(name).category("PictureDataItem")
                .usage(usage).basicInfo(info)
                .path(",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",InformationDataGroupOf"+bank+",PictureDataGroupOf"+bank+",")
                .build();
        dataNodeServiceV2.save(pictureDataNode);
        return "静态图片资源 "+name+" 上传完成！";
    }
    public String updatePictureResourceData(MultipartFile file, String bank, JSONObject info, String name) throws IOException {
        String infoName = null;
        if (info.containsKey("name")) {
            infoName = info.getString("name");
        } else {
            info.put("name",name);
        }
        String category = "PictureDataItem";
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        DataNodeV2 pictureDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (pictureDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        if (Objects.equals(pictureDataNode.getName(), infoName)) {
            return "数据资源 "+name+" 已存在！请更换名称";
        }
        String filePath = pictureDataPath + pictureDataNode.getUsage().getString("path");
        String fileName = pictureDataNode.getUsage().getString("name");
        FileUtil.deleteFile(new File(filePath+"/"+fileName));
        String storeFileName = FileUtil.generateNewFileName(file.getOriginalFilename());
        FileUtil.storeFile(file, filePath, storeFileName);
        JSONObject usage = new JSONObject();
        usage.put("path", "/"+bank+"/"); usage.put("name",storeFileName);
        pictureDataNode.setUsage(usage);
        pictureDataNode.setBasicInfo(info);
        pictureDataNode.setName(String.valueOf(infoName == null ? name : infoName ));
        dataNodeServiceV2.updateNodeById(pictureDataNode.getId(), pictureDataNode);
        return "静态图片资源 "+name+" 更新完成！";
    }
    public String deletePictureResourceData(String bank, String name) {
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        String category = "PictureDataItem";
        DataNodeV2 pictureDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (pictureDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        String filePath = pictureDataNode.getUsage().getString("path");
        String fileName = pictureDataNode.getUsage().getString("name");
        FileUtil.deleteFile(new File(pictureDataPath+filePath+"/"+fileName));
        dataNodeRepoV2.deleteById(pictureDataNode.getId());
        return "静态图片资源 "+name+" 删除完成！";
    }
    public DataNodeV2 getTextDataGroupNode(String bank) {
        return dataNodeRepoV2.getNodeByCategoryAndBank(
                "TextDataGroup",
                bank
        );
    }
    public String  uploadTextResourceData(String bank, JSONObject info) {
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        String category = "TextDataItem";
        String name = info.getString("name");
        DataNodeV2 textDataNodeBefore = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (textDataNodeBefore != null) {
            return "数据资源 "+name+" 已存在！请更换名称";
        }
        DataNodeV2 pictureDataNode = DataNodeV2.dataNodeBuilder()
                .bank(bank).auth("all").name(name).category("TextDataItem")
                .basicInfo(info)
                .path(",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",InformationDataGroupOf"+bank+",TextDataGroupOf"+bank+",")
                .build();
        dataNodeServiceV2.save(pictureDataNode);
        return "静态文本资源 "+name+" 上传完成！";
    }
    public String updateTextResourceData(String bank, JSONObject info, String name) {
        String infoName = null;
        if (info.containsKey("name")) {
            infoName = info.getString("name");
        } else {
            info.put("name",name);
        }
        String category = "TextDataItem";
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        DataNodeV2 textDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (textDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        if (Objects.equals(textDataNode.getName(), infoName)) {
            return "数据资源 "+name+" 已存在！请更换名称";
        }
        textDataNode.setBasicInfo(info);
        textDataNode.setName(String.valueOf(infoName==null ? name : infoName));
        dataNodeServiceV2.updateNodeById(textDataNode.getId(), textDataNode);
        return "静态文本资源 "+name+" 更新完成！";
    }
    public String deleteTextResourceData(String bank, String name) {
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        String category = "TextDataItem";
        DataNodeV2 textDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (textDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        dataNodeRepoV2.deleteById(textDataNode.getId());
        return "静态文本资源 "+name+" 删除完成！";
    }

    // 可视化资源操作
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
    public String uploadSectionResourceData(MultipartFile file, JSONObject info) throws IOException, InterruptedException {
        String category = "SectionDataItem";
        String name = info.getString("name");
        String bank = info.getString("segment");
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        if (iDataNodeRepoV2.getNodeByCategoryAndBank(category, bank) != null) {
            return "数据资源已存在！";
        }
        info.put("type","section");
        if (!VectorUtil.shpVector2pg(file, info, bank)) {
            return "断面 "+name+" 上传失败！";
        } else {
            DataNodeV2 vectorDataNode = VectorUtil.section2DataNode(bank, info);
            dataNodeServiceV2.save(vectorDataNode);
            return "断面 "+name+" 上传完成！";
        }
    }

    public String uploadVisualizationResourceData(MultipartFile file, String bank, JSONObject info) throws IOException, InterruptedException {
        String category = "VectorDataItem";
        String name = info.getString("name");
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        if (dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name) != null) {
            return "数据资源 "+name+" 已存在！请更换名称";
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

    // 设备资源操作
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
    public String deleteSection(String bank, String name) {
        if (!ifBankExist(bank)) {
            return "岸段 "+bank+" 不存在！";
        }
        String category = "SectionDataItem";
        DataNodeV2 sectionDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, bank, name);
        if (sectionDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        String path = sectionDataNode.getBasicInfo().getString("path");
        FileUtil.deleteFolder(new File(path));
        dataNodeRepoV2.deleteById(sectionDataNode.getId());
        if (!VectorUtil.deletePgVector(sectionDataNode.getBasicInfo().getString("tableName"))) {
            return "断面资源 " + name + " 删除失败！";
        } else {
            return "断面资源 " + name + " 删除成功！";
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

    @DynamicNodeDataV2
    public JSONArray getSectionInfo(DataNodeV2 dataNodeV2, String type){
        List<Map<String, Object>> infoList = sectionDataRepo.getSectionInfo(dataNodeV2.getBasicInfo().getString("tableName"), type);
        JSONArray responseArray = new JSONArray();

        for (Map<String, Object> info : infoList) {
            String id = info.get("id").toString();
            String label = info.get("label").toString();
            JSONObject geometryData = JSONObject.parseObject((String) info.get("geometry"));
            JSONObject response = new JSONObject();
            response.put("id", id);
            response.put("label", label);
            response.put("geometry", geometryData);
            responseArray.add(response);
        }
        return responseArray;
    }

    @DynamicNodeDataV2
    public List<String> getImportantBankName(DataNodeV2 dataNodeV2, String prefix){
        return importantBankRepo.getImportantBankNameByPrefix(dataNodeV2.getUsage().getString("tableName"), prefix);
    }

    @DynamicNodeDataV2
    public Map<String, String> getImportantBankInfo(DataNodeV2 dataNodeV2, String name){
        return importantBankRepo.getImportantBankInfoByName(dataNodeV2.getUsage().getString("tableName"), name);
    }

    public String uploadModelParams(Map<String, Object> params, String type, Map<String, String> info) throws IOException, InterruptedException {
        String paramsJsonString = JSON.toJSONString(params);
        System.out.println(paramsJsonString);
        // 将 JSON 字符串写入文件

        String jsonFolderPath = String.join(File.separator, draftDataPath, "modelParam", type);

        // 确保目录存在
        Path path = Paths.get(jsonFolderPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String jsonPath = String.join(File.separator, jsonFolderPath, type + ".json");

        try (FileWriter fileWriter = new FileWriter(jsonPath)) {
            fileWriter.write(paramsJsonString);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
//        String zipFileName` = ZipUtil.zipFolder(new File(jsonFolderPath));
//        System.out.println(zipFileName);
//
//        System.out.println(info);
//        modelServerService.uploadCalculateResourceData(FileUtil.convertFileToMultipartFile(new File(zipFileName)), new JSONObject(info));
        modelServerService.uploadCalculateResourceData(ZipUtil.zipFolderAndGetAsMultipartFileV2(jsonFolderPath, type), JSONObject.from(info));

        return "";
    }

}
