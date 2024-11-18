package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/11/5 21:37
 * @Description:
 */

@Service("KnowledgeService")
public class KnowledgeService {

    @Value("${staticData.knowledgePath.picture}")
    String pictureKnowledgePath;

    @Value("${staticData.knowledgePath.pdf}")
    String pdfKnowledgePath;

    @Value("${staticData.knowledgePath.video}")
    String videoKnowledgePath;

    @Value("${staticData.knowledgePath.others}")
    String othersKnowledgePath;

    @Autowired
    DataNodeServiceV2 dataNodeServiceV2;

    public byte[] getKnowledgeData(String type, String name) {
        String basePath;
        String category;
        switch (type) {
            case "pdf" ->  { basePath=pdfKnowledgePath+"/"; category="PdfDataItem";}
            case "picture" -> { basePath=pictureKnowledgePath+"/"; category="PictureDataItem";}
            case "video" -> { basePath=videoKnowledgePath+"/"; category="VideoDataItem";}
            case "others" -> { basePath=othersKnowledgePath+"/"; category="OthersDataItem";}
            default -> {
                return null;
            }
        }
        DataNodeV2 knowledgeDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, "all", name);
        if (knowledgeDataNode == null) {
            return null;
        }
        String filePath = basePath + knowledgeDataNode.getUsage().getString("name");
        return FileUtil.getByteStreamFromFile(filePath);
    }

    public String uploadKnowledgeData(MultipartFile file, JSONObject info, String type) throws IOException {
        String basePath;
        String nodePath;
        String category;
        switch (type) {
            case "pdf" ->  { basePath=pdfKnowledgePath+"/"; nodePath=",DataNodeHead,KnowledgeNode,PdfDataGroupOfAll"; category="PdfDataItem"; info.put("type","pdf");}
            case "picture" -> { basePath=pictureKnowledgePath+"/"; nodePath=",DataNodeHead,KnowledgeNode,PictureDataGroupOfAll"; category="PictureDataItem"; info.put("type","picture");}
            case "video" -> { basePath=videoKnowledgePath+"/"; nodePath=",DataNodeHead,KnowledgeNode,VideoDataGroupOfAll"; category="VideoDataItem"; info.put("type","video");}
            case "others" -> { basePath=othersKnowledgePath+"/"; nodePath=",DataNodeHead,KnowledgeNode,OthersDataGroupOfAll"; category="OthersDataItem"; info.put("type","others");}
            default -> {
                return "无法上传此类型知识库资源";
            }
        }
        String name = info.getString("name");
        DataNodeV2 knowledgeDataNodeBefore = dataNodeServiceV2.getDataNodeByCategoryBankName(category, "all", name);
        if (knowledgeDataNodeBefore != null) {
            return "该数据资源已存在，请更换名称";
        }
        JSONObject usage = new JSONObject();
        String storeFileName = FileUtil.generateNewFileName(file.getOriginalFilename());
        FileUtil.storeFile(file, basePath, storeFileName);
        usage.put("name",storeFileName);
        DataNodeV2 knowledgeDataNode = DataNodeV2.dataNodeBuilder()
                .auth("all").name(name).category(category)
                .usage(usage).basicInfo(info).bank("all")
                .path(nodePath)
                .build();
        dataNodeServiceV2.save(knowledgeDataNode);
        return type+" 类型知识库资源 "+name+" 上传成功！";
    }

    public String updateKnowledgeData(MultipartFile file, JSONObject info, String type, String name) throws IOException {
        String category;
        String basePath;
        switch (type) {
            case "pdf" ->  { basePath=pdfKnowledgePath+"/"; category = "PdfDataItem"; info.put("type","pdf");}
            case "picture" -> { basePath=pictureKnowledgePath+"/"; category = "PictureDataItem";info.put("type","picture");}
            case "video" -> { basePath=videoKnowledgePath+"/"; category = "VideoDataItem";info.put("type","video");}
            case "others" -> { basePath=othersKnowledgePath+"/"; category = "OthersDataItem";info.put("type","others");}
            default -> {
                return "无法更新该类型数据";
            }
        }
        DataNodeV2 knowledgeDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, "all", name);
        if (knowledgeDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        FileUtil.deleteFile(new File(basePath+"/"+knowledgeDataNode.getUsage().getString("name")));
        String storeFileName = FileUtil.generateNewFileName(file.getOriginalFilename());
        FileUtil.storeFile(file, basePath, storeFileName);
        JSONObject usage = new JSONObject();
        usage.put("name",storeFileName);
        knowledgeDataNode.setUsage(usage);
        knowledgeDataNode.setBasicInfo(info);
        knowledgeDataNode.setName(info.getString("name"));
        dataNodeServiceV2.updateNodeById(knowledgeDataNode.getId(),knowledgeDataNode);
        return type+" 类型知识库资源 "+name+" 更新成功！";
    }

    public String deleteKnowledgeData(String type, String name) {
        String category;
        String basePath;
        switch (type) {
            case "pdf" ->  { basePath=pdfKnowledgePath+"/"; category = "PdfDataItem";}
            case "picture" -> { basePath=pictureKnowledgePath+"/"; category = "PictureDataItem";}
            case "video" -> { basePath=videoKnowledgePath+"/"; category = "VideoDataItem";}
            case "others" -> { basePath=othersKnowledgePath+"/"; category = "OthersDataItem";}
            default -> {
                return "无法更新该类型数据";
            }
        }
        DataNodeV2 knowledgeDataNode = dataNodeServiceV2.getDataNodeByCategoryBankName(category, "all", name);
        if (knowledgeDataNode == null) {
            return "数据资源 "+name+" 不存在！";
        }
        FileUtil.deleteFile(new File(basePath+"/"+knowledgeDataNode.getUsage().getString("name")));
        dataNodeServiceV2.delete(knowledgeDataNode.getId());
        return type+" 类型知识库资源 "+name+" 删除成功！";
    }
}
