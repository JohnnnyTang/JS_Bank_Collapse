package com.johnny.bank.controller.resource.dataSource;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.service.resource.dataSource.impl.BankResourceService;
import com.johnny.bank.service.resource.dataSource.impl.KnowledgeService;
import com.johnny.bank.utils.DataNodeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/11/5 21:36
 * @Description:
 */
@Slf4j
@RestController
@RequestMapping("api/v2/data/knowledge")
public class KnowledgeController {

    @Autowired
    KnowledgeService knowledgeService;

    @Autowired
    BankResourceService bankResourceService;

    // 所有类型资源获取
    @GetMapping
    public ResponseEntity<JSONArray> getAllKnowledgeDataNode() {
        String pdfKnowledgePath = ",DataNodeHead,KnowledgeNode,PdfDataGroupOfAll";
        String pictureKnowledgePath = ",DataNodeHead,KnowledgeNode,PictureDataGroupOfAll";
        String videoKnowledgePath = ",DataNodeHead,KnowledgeNode,VideoDataGroupOfAll";
        String othersKnowledgePath = ",DataNodeHead,KnowledgeNode,OthersDataGroupOfAll";
        List<DataNodeV2> knowledgeList = new ArrayList<>(bankResourceService.getStaticDataList(pdfKnowledgePath));
        knowledgeList.addAll(bankResourceService.getStaticDataList(pictureKnowledgePath));
        knowledgeList.addAll(bankResourceService.getStaticDataList(videoKnowledgePath));
        knowledgeList.addAll(bankResourceService.getStaticDataList(othersKnowledgePath));
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_basicInfo(knowledgeList));
    }

    // 单类型资源获取
    @GetMapping("/{type}")
    public ResponseEntity<JSONArray> getTypeAllKnowledgeDataNode(@PathVariable String type) {
        String knowledgePath;
        switch (type) {
            case "pdf" -> knowledgePath = ",DataNodeHead,KnowledgeNode,PdfDataGroupOfAll";
            case "picture" -> knowledgePath = ",DataNodeHead,KnowledgeNode,PictureDataGroupOfAll";
            case "video" -> knowledgePath = ",DataNodeHead,KnowledgeNode,VideoDataGroupOfAll";
            case "others" -> knowledgePath = ",DataNodeHead,KnowledgeNode,OthersDataGroupOfAll";
            default -> {
                return null;
            }
        }
        List<DataNodeV2> knowledgeList = bankResourceService.getStaticDataList(knowledgePath);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_basicInfo(knowledgeList));
    }

    // 单个资源获取
    @GetMapping("/{type}/{name}")
    // local
    public ResponseEntity<byte[]> getKnowledgeData(@PathVariable String type, @PathVariable String name) {
        byte[] binData = knowledgeService.getKnowledgeData(type, name);
        HttpHeaders headers = new HttpHeaders();
        switch (type) {
            case "picture" -> headers.setContentType(MediaType.valueOf("image/png"));
            case "pdf" -> headers.setContentType(MediaType.valueOf("application/pdf"));
            case "video" -> headers.setContentType(MediaType.valueOf("video/mp4"));
            case "others" -> headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            default -> {
                return null;
            }
        }
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    // 资源上载
    @PostMapping("/{type}")
    public ResponseEntity<String> uploadKnowledgeDataNode(
            @PathVariable String type, @RequestParam("file") MultipartFile file, @RequestParam("info") String info) throws IOException {
        return ResponseEntity.ok(knowledgeService.uploadKnowledgeData(file, JSONObject.parse(info), type));
    }

    // 资源更新
    @PostMapping("/{type}/{name}")
    public ResponseEntity<String> updateKnowledgeDataNode(
            @PathVariable String type, @PathVariable String name, @RequestParam("file") MultipartFile file, @RequestParam("data") String info) throws IOException {
        return ResponseEntity.ok(knowledgeService.updateKnowledgeData(file, JSONObject.parse(info), type, name));
    }

    // 资源删除
    @DeleteMapping("/{type}/{name}")
    public ResponseEntity<String> deleteKnowledgeDataNode(@PathVariable String type, @PathVariable String name) {
        return ResponseEntity.ok(knowledgeService.deleteKnowledgeData(type, name));
    }

}
