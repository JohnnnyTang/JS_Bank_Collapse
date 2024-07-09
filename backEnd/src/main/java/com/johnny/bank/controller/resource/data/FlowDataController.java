package com.johnny.bank.controller.resource.data;

import com.johnny.bank.model.configuration.FlowData;
import com.johnny.bank.service.resource.dataResource.impl.GeoJsonDataServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;

/**
 * @Author: Johnny Tang
 * @Date: 2024/5/29
 * @Description:
 */
@RestController
@RequestMapping("api/v1/data/flow")
@Slf4j
public class FlowDataController {


    private final FlowData flowData;
    private final GeoJsonDataServiceImpl geoJsonDataService;

    @Autowired
    public FlowDataController(FlowData flowData, GeoJsonDataServiceImpl geoJsonDataService) {
        this.flowData = flowData;
        this.geoJsonDataService = geoJsonDataService;
    }

    @GetMapping("/configJson/{scene}")
    public ResponseEntity<String> GetSceneFlowJSon(@PathVariable String scene) throws IOException {
        String wholePath = flowData.getTexturePath() + scene + "/flow_field_description.json";
        return ResponseEntity.ok(geoJsonDataService.readGeoJsonFile(wholePath));
    }

    @GetMapping("/texture/{scene}/{textureName}")
    public ResponseEntity<FileSystemResource> GetSceneFlowPic(@PathVariable String scene, @PathVariable String textureName) throws IOException {
        String wholePath = flowData.getTexturePath() + scene + "/" + textureName;
        File file = new File(wholePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + scene + "/" + textureName);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/png"); // 根据实际文件类型设置

            return ResponseEntity.ok().
                    headers(headers).contentLength(file.length()).
                    contentType(MediaType.APPLICATION_OCTET_STREAM).
                    body(new FileSystemResource(file));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

//    @GetMapping("/field/flow/pic")
//    public ResponseEntity<FileSystemResource> getFlowPic(@RequestParam String name) {
//        String filePath = FlowField + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/png"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
