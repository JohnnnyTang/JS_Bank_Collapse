package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.node.impl.TaskNodeServiceV2;
import com.johnny.bank.service.resource.dataSource.IModelServerService;
import com.johnny.bank.utils.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/20 12:52
 * @Description:
 */

@Service("modelServerService")
@Slf4j
public class ModelServerService implements IModelServerService {

    @Autowired
    IDataNodeRepoV2 dataNodeRepoV2;

    @Autowired
    DataNodeServiceV2 dataNodeServiceV2;

    @Value("${staticData.draftDataPath}")
    String draftDataPath;

    @Value("${staticData.tifTilePath}")
    String tifTilePath;

    @Value("${modelServer.url}")
    String baseUrl;

    @Value("${modelServer.storageLimit}")
    Integer STORAGE_LIMIT;

    @Value("${modelServer.caseLimit}")
    Integer CASE_LIMIT;

    public List<DataNodeV2> getModelServerResourceNode(String category, String bank, String set, String year, String name) {
        return dataNodeRepoV2.getNodeByCategoryBankSetYearAndName(category, bank, set, year, name);
    }

    @Override
    public String getResultByCaseId(String caseId) {
        String url = baseUrl + "/v0/mc/result";
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        return InternetUtil.doGet(url, body);
    }

    @Override
    public String getJsonDataByCaseIdAndFileName(String caseId, String name) {
        String url = baseUrl + "/v0/fs/result/file";
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        body.put("name",name);
        return InternetUtil.doGet(url, body);
    }

    @Override
    public String getResourceJsonDataByCaseIdAndFileName(String name) {
        String url = baseUrl + "/v0/fs/resource/file";
        JSONObject body = new JSONObject();
//        body.put("id",caseId);
//        body.put("name",name);
        body.put("name", name);
        return InternetUtil.doGet(url, body);
    }


    @Override
    public byte[] getByteDataByCaseIdAndFileName(String caseId, String name) {
        String url = baseUrl + "/v0/fs/result/file";
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        body.put("name",name);
        return InternetUtil.doGet_Byte(url, body);
    }

    @Override
    public byte[] getResourceByteDataByCaseIdAndFileName(String name) {
        String url = baseUrl + "/v0/fs/resource/file";
        JSONObject body = new JSONObject();
//        body.put("id",caseId);
//        body.put("name",name);
        body.put("name", name);
        return InternetUtil.doGet_Byte(url, body);
    }

    @Override
    public String uploadCalculateResourceData(MultipartFile file, JSONObject info) throws IOException, InterruptedException {
        String fileType = info.getString("fileType");
        String bank = info.getString("segment");
        if (dataNodeServiceV2.getDataNodeByCategoryName("BankNode", bank + "BankNode") == null) {
            return "该岸段不存在！";
        }
        return switch (fileType) {
            case "shapefile" -> uploadCalculateResourceShapefileData(file, info);
            case "geojson" -> uploadCalculateResourceGeojsonData(file, info);
            case "hydrodynamic" -> uploadCalculateResourceHydrodynamicData(file, info);
            case "tiff" -> uploadCalculateResourceTiffData(file, info);
            case "adf" -> uploadCalculateResourceAdfData(file, info);
            case "json" -> uploadCalculateResourceJsonData(file, info);
            case "txt" -> uploadCalculateResourceTxtData(file, info);
//            case "geoj"
            default -> "无法上传此数据类型";
        };
    }

    public String deleteCalculateResourceData(String bank, String dataType, String name) {
        if (dataNodeServiceV2.getDataNodeByCategoryName("BankNode", bank + "BankNode") == null) {
            return "该岸段不存在！";
        }
        return switch (dataType) {
            case "Hydrodynamic" -> deleteCalculateResource(bank, "HydrodynamicDataItem", name);
            case "DEM" -> deleteCalculateResource(bank, "DEMDataItem", name);
            case "Boundary" -> deleteCalculateResource(bank, "BoundaryDataItem" ,name);
            case "RiskLevel" -> deleteCalculateResource(bank, "ConfigDataItem" ,name);
            default -> "无法删除此数据类型";
        };
    }

    private String uploadCalculateResourceShapefileData(MultipartFile file, JSONObject info) {
        if (!info.containsKey("category")) {
            return "请输入数据类别";
        }
        String categoryName = info.getString("category");
        if (!categoryName.equals("DEM") && !categoryName.equals("Hydrodynamic") && !categoryName.equals("Boundary") && !categoryName.equals("Config")) {
            return "无法上传此数据类别";
        }
        String resourceName = "shapefile";
        return uploadModelServerData(file, info, categoryName, resourceName);
    }
    private String uploadCalculateResourceGeojsonData(MultipartFile file, JSONObject info) {
        if (!info.containsKey("category")) {
            return "请输入数据类别";
        }
        String categoryName = info.getString("category");
        if (!categoryName.equals("DEM") && !categoryName.equals("Hydrodynamic") && !categoryName.equals("Boundary") && !categoryName.equals("Config")) {
            return "无法上传此数据类别";
        }
        String resourceName = "geojson";
        return uploadModelServerData(file, info, categoryName, resourceName);
    }
    private String uploadCalculateResourceHydrodynamicData(MultipartFile file, JSONObject info) {
        if (!info.containsKey("category")) {
            return "请输入数据类别";
        }
        String categoryName = info.getString("category");
        if (!categoryName.equals("DEM") && !categoryName.equals("Hydrodynamic") && !categoryName.equals("Boundary") && !categoryName.equals("Config")) {
            return "无法上传此数据类别";
        }
        String resourceName = "hydrodynamic";
        return uploadModelServerData(file, info, categoryName, resourceName);
    }
    private String uploadCalculateResourceTiffData(MultipartFile file, JSONObject info) throws IOException, InterruptedException {
        if (!info.containsKey("category")) {
            return "请输入数据类别";
        }
        String categoryName = info.getString("category");
        if (!categoryName.equals("DEM") && !categoryName.equals("Hydrodynamic") && !categoryName.equals("Boundary") && !categoryName.equals("Config")) {
            return "无法上传此数据类别";
        }
        String resourceName = "tiff";
        String fileName = file.getOriginalFilename();
        String contentType = file.getContentType();
        byte[] fileContent = file.getBytes();
        MultipartFile upLoadFile = new MockMultipartFile("file", fileName, contentType, fileContent);
        // TODO: 解析Tiff成为栅格瓦片
        TifUtil.tif2tile(file, info.getString("segment"));
        return uploadModelServerData(upLoadFile, info, categoryName, resourceName);
    }
    private String uploadCalculateResourceTxtData(MultipartFile file, JSONObject info) throws IOException, InterruptedException {
        if (!info.containsKey("category")) {
            return "请输入数据类别";
        }
        String categoryName = info.getString("category");
        if (!categoryName.equals("DEM") && !categoryName.equals("Hydrodynamic") && !categoryName.equals("Boundary") && !categoryName.equals("Config")) {
            return "无法上传此数据类别";
        }
        String bank = info.getString("segment");
        String name = info.getString("name");
        String tifFolderPath = TifUtil.txt2tif(file, info, bank);
        try (FileInputStream inputStream = new FileInputStream(new File(tifFolderPath + File.separator + name + ".tif"))) {
            MultipartFile tifMultipartFile = new MockMultipartFile(name + ".tif", name + ".tif", "image/tiff", inputStream);
            TifUtil.tif2tile(tifMultipartFile, bank);
        } catch (Exception e) {
            log.info(e.toString());
        }
        String resourceName = "tiff";
        return uploadModelServerData(ZipUtil.zipFolderAndGetAsMultipartFile(tifFolderPath,info.getString("name")), info, categoryName, resourceName);
    }
    private String uploadCalculateResourceAdfData(MultipartFile file, JSONObject info) {
        if (!info.containsKey("category")) {
            return "请输入数据类别";
        }
        String categoryName = info.getString("category");
        if (!categoryName.equals("DEM") && !categoryName.equals("Hydrodynamic") && !categoryName.equals("Boundary") && !categoryName.equals("Config")) {
            return "无法上传此数据类别";
        }
        String resourceName = "adf";
        return uploadModelServerData(file, info, categoryName, resourceName);
    }
    private String uploadCalculateResourceJsonData(MultipartFile file, JSONObject info) {
        if (!info.containsKey("category")) {
            return "请输入数据类别";
        }
        String categoryName = info.getString("category");
        if (!categoryName.equals("DEM") && !categoryName.equals("Hydrodynamic") && !categoryName.equals("Boundary") && !categoryName.equals("Config")) {
            return "无法上传此数据类别";
        }
        String resourceName = "json";
        return uploadModelServerData(file, info, categoryName, resourceName);
    }
    // typeName可以为"DEM","DEM","Boundary","Hydrodynamic"
    // resourceName可以为"dem","adf","shapefile", "hydrodynamic"
    // type与result需对应
    private String uploadModelServerData(MultipartFile file, JSONObject info, String typeName, String resourceName) {
        TaskNodeServiceV2 taskNodeServiceV2 = BeanUtil.getBean(TaskNodeServiceV2.class);
        if (!taskNodeServiceV2.checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法上传！请清理系统内存";
        }
        String url = baseUrl + "/v0/fs/resource/" + resourceName;
        String bank = info.getString("segment");
        JSONObject dataNodeBasicInfo = new JSONObject();
        dataNodeBasicInfo.put("fileType",info.getString("fileType"));
        dataNodeBasicInfo.put("year",info.getString("year"));
        dataNodeBasicInfo.put("month",info.getString("month"));
        dataNodeBasicInfo.put("set",info.getString("set"));
        dataNodeBasicInfo.put("type","calculate");
        dataNodeBasicInfo.put("segment",bank);
        if (info.containsKey("description") && !Objects.equals(info.getString("description"), "")) {
            dataNodeBasicInfo.put("description",info.getString("description"));
        }
        if (info.containsKey("temp")) {
            dataNodeBasicInfo.put("temp",info.getString("temp"));
        }
        if (info.containsKey("boundary")) {
            dataNodeBasicInfo.put("boundary",info.getString("boundary"));
        }
        DataNodeV2 dataNode = DataNodeV2.dataNodeBuilder()
                .bank(info.getString("segment")).basicInfo(null)
                .name(info.getString("name")).dataOrigin("ModelServer")
                .category(typeName + "DataItem").path(",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf" + bank + ",ModelServerDataGroupOf" + bank + "," + typeName + "DataGroupOf" + bank + ",")
                .build();
        DataNodeServiceV2 dataNodeServiceV2 = BeanUtil.getBean(DataNodeServiceV2.class);
        JSONObject response = JSONObject.parseObject(InternetUtil.doPost_File(url, file, info));
        dataNodeBasicInfo.put("path",response.getString("directory"));
        dataNode.setBasicInfo(dataNodeBasicInfo);
        List<DataNodeV2> dataNodeListBefore = getModelServerResourceNode(dataNode.getCategory(),dataNode.getBank(),dataNode.getBasicInfo().getString("set"),dataNode.getBasicInfo().getString("year"),dataNode.getName());
//        List<DataNodeV2> dataNodeListBefore = dataNodeServiceV2.getModelServerResourceNode(dataNode.getCategory(),dataNode.getBank(),dataNode.getBasicInfo().getString("year"),dataNode.getName());
        // 若资源重复，则删除后重新挂载资源
        if (!dataNodeListBefore.isEmpty()) {
            for (DataNodeV2 dataNodeBefore : dataNodeListBefore) {
                dataNodeServiceV2.delete(dataNodeBefore.getId());
            }
        }
        dataNodeServiceV2.save(dataNode);
        log.info(typeName + "Data " + dataNode.getName() + " uploaded" + "("+resourceName+")");
        return "Uploaded " + typeName + "Data" + "("+resourceName+") of "+bank;
    }

    private String deleteCalculateResource(String bank, String category, String name) {
        DataNodeV2 deleteDataNode = dataNodeRepoV2.getNodeByCategoryBankAndName(category, bank, name);
        if (category.equals("DEMDataItem")) {
            DataNodeV2 deleteVisualDataNode = dataNodeRepoV2.getNodeByCategoryBankAndName("DEMTileDataItem", bank, name);
            if (deleteVisualDataNode != null && deleteVisualDataNode.getUsage().containsKey("path")) {
                FileUtil.deleteFolder(new File(tifTilePath + deleteVisualDataNode.getUsage().getString("path")));
                dataNodeServiceV2.delete(deleteVisualDataNode.getId());
            }
        }
        if (deleteDataNode == null) {
            return bank + " 岸段模型计算资源 " + name + " 不存在！";
        }
        String url = baseUrl + "/v0/fs";
        JSONObject requestBody = new JSONObject();
        requestBody.put("directory",deleteDataNode.getBasicInfo().getString("path"));
        try {
            InternetUtil.doDelete(url, requestBody);
            FileUtil.deleteFolder(new File(draftDataPath + File.separator + "tif" + File.separator + bank + File.separator + name));
            dataNodeServiceV2.delete(deleteDataNode.getId());
            return bank + " 岸段模型计算资源 " + name + " 删除成功！";
        } catch (Exception e) {
            log.info(e.toString());
            return bank + " 岸段模型计算资源 " + name + " 删除失败！";
        }
    }
}
