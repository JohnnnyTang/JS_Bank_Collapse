package com.johnny.bank.controller.resource.dataSource;

import com.johnny.bank.service.resource.dataSource.impl.ModelServerServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/file/json")
    public String getJsonDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        return modelServerService.getJsonDataByCaseIdAndFileName(caseId, name);
    }

    @GetMapping("/file/txt")
    public ResponseEntity<byte[]> getTxtDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] binData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/file/bin")
    public ResponseEntity<byte[]> getBinDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] binData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/file/image")
    public ResponseEntity<byte[]> getPngDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] imageData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/png"));
        return ResponseEntity.ok()
                .headers(headers)
                .body(imageData);
    }
}
