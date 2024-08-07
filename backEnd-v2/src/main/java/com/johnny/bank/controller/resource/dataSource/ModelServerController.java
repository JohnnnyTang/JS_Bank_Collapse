package com.johnny.bank.controller.resource.dataSource;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.service.resource.dataSource.impl.ModelServerServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Base64;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/20 13:03
 * @Description: 模型服务数据调用接口
 */
@RestController
@RequestMapping("api/v2/data/modelServer")
@Slf4j
public class ModelServerController {

    @Autowired
    ModelServerServiceImpl modelServerService;

    @GetMapping("/down/result/file/json")
    public String getJsonDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        return modelServerService.getJsonDataByCaseIdAndFileName(caseId, name);
    }

    @GetMapping("/down/result/file/txt")
    public ResponseEntity<byte[]> getTxtDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] binData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/down/result/file/bin")
    public ResponseEntity<byte[]> getBinDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] binData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/down/result/file/image")
    public ResponseEntity<byte[]> getPngDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] imageData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/png"));
        return ResponseEntity.ok()
                .headers(headers)
                .body(imageData);
    }

    @GetMapping("/down/resource/file/json")
    public String getResourceJsonDataByCaseIdAndFileName(@RequestParam String name) {
        return modelServerService.getResourceJsonDataByCaseIdAndFileName(name);
    }

    @GetMapping("/down/resource/file/txt")
    public ResponseEntity<byte[]> getResourceTxtDataByCaseIdAndFileName(@RequestParam String name) {
        byte[] binData = modelServerService.getResourceByteDataByCaseIdAndFileName(name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/down/resource/file/bin")
    public ResponseEntity<byte[]> getResourceBinDataByCaseIdAndFileName(@RequestParam String name) {
        byte[] binData = modelServerService.getResourceByteDataByCaseIdAndFileName(name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/down/resource/file/image")
    public ResponseEntity<byte[]> getResourcePngDataByCaseIdAndFileName(@RequestParam String name) {
        byte[] imageData = modelServerService.getResourceByteDataByCaseIdAndFileName(name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/png"));
        return ResponseEntity.ok()
                .headers(headers)
                .body(imageData);
    }

    @PostMapping("/up/resource/file/dem")
    public ResponseEntity<String> uploadResourceDEMData(@RequestParam("file")MultipartFile file, @RequestParam("info") String info) {
        return ResponseEntity.ok(modelServerService.uploadResourceDEMData(file, JSONObject.parse(info)));
    }
}
