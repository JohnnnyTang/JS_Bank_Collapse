package com.johnny.bank.controller.resource.data;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.controller.resource.data.base.GeoDataController;
import com.johnny.bank.model.resource.dataResource.GeoJsonData;
import com.johnny.bank.service.resource.dataResource.IGeoJsonDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: GeoJsonDataController
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/25 14:20
 * @version: 1.0
 */

@RestController
@RequestMapping("api/v1/fileData/json")
public class GeoJsonDataController extends GeoDataController<IGeoJsonDataService> {

    @Autowired
    public GeoJsonDataController(IGeoJsonDataService geojsonDataService) {
        super(geojsonDataService);
    }

    @GetMapping()
    public ResponseEntity<List<GeoJsonData>> findAll() {
        return ResponseEntity.ok(igeoDataService.findAll(dataNode));
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getTotalCount(){
        return ResponseEntity.ok(igeoDataService.getTotalCount(dataNode));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<GeoJsonData> findById(@PathVariable String id){
        return ResponseEntity.ok(igeoDataService.findById(dataNode, id));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<GeoJsonData>> findByIdList(@RequestParam List<String> ids){
        return ResponseEntity.ok(igeoDataService.findByIdList(dataNode, ids));
    }

    @GetMapping("/path/id/{id}")
    public ResponseEntity<String> getFilePathById(@PathVariable String id) {
        GeoJsonData geoJsonData = igeoDataService.findById(dataNode, id);
        return ResponseEntity.ok(geoJsonData.getPath());
    }

    @PostMapping()
    public ResponseEntity<String> insertData(@RequestBody JSONObject jsonObject)  {
        return ResponseEntity.ok(igeoDataService.insertData(dataNode, jsonObject));
    }

    @GetMapping("/file/id/{id}")
    public ResponseEntity<FileSystemResource> getFileById(@PathVariable String id) {
        GeoJsonData geoJsonData = igeoDataService.findById(dataNode, id);
        String filePath = geoJsonData.getPath();
        String fileName = geoJsonData.getName();
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName + ".geojson");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/geojson"); // 根据实际文件类型设置
            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new FileSystemResource(file));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping()
    public ResponseEntity<String> deleteFileById(@RequestParam String id) {
        GeoJsonData geoJsonData = igeoDataService.findById(dataNode, id);
        String filePath = geoJsonData.getPath();
        File file = new File(filePath);
        if (file.exists()) {
            // 删除文件
            if (file.delete()) {
                // 删除表内容
                deleteById(dataNode, id);
                return ResponseEntity.ok(id);
            } else {
                return ResponseEntity.status(500).body("Unable to delete file");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value="/jsonStr/id/{id}", produces = "application/json;charset=utf-8")
    public String getGeoJsonById(@PathVariable String id) throws IOException {
        GeoJsonData geoJsonData = igeoDataService.findById(dataNode, id);
        String filePath = geoJsonData.getPath();
        //        JSONObject jsonObject = new JSONObject(Integer.parseInt(geoJsonString));
        return igeoDataService.readGeoJsonFile(filePath);
    }

    @GetMapping(value="/jsonStr/name/{name}/newest", produces = "application/json;charset=utf-8")
    public ResponseEntity<String> getNewestGeoJsonByName(@PathVariable String name) throws IOException {
        GeoJsonData geoJsonData = igeoDataService.findNewestByName(dataNode, name);
        if(geoJsonData == null) {
            return ResponseEntity.ok(null);
        }
        String filePath = geoJsonData.getPath();
        //        JSONObject jsonObject = new JSONObject(Integer.parseInt(geoJsonString));
        return ResponseEntity.ok(igeoDataService.readGeoJsonFile(filePath));
    }
}
