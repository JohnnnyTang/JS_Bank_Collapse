package com.johnny.bank.controller.resource.data;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.controller.resource.data.base.GeoDataController;
import com.johnny.bank.model.resource.dataResource.RasterData;
import com.johnny.bank.model.resource.dataResource.ShpData;
import com.johnny.bank.model.resource.dataResource.TxtData;
import com.johnny.bank.service.resource.data.IRasterDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: RasterDataController
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/25 14:17
 * @version: 1.0
 */

@RestController
@RequestMapping("GeoData/RasterData")
public class RasterDataController extends GeoDataController<IRasterDataService> {

    @Autowired
    public RasterDataController(IRasterDataService rasterDataService) {
        super(rasterDataService);
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<RasterData>> findAll() {
        return ResponseEntity.ok(igeoDataService.findAll(dataNode));
    }

    @GetMapping("/getTotalCount")
    public ResponseEntity<Integer> getTotalCount(){
        return ResponseEntity.ok(igeoDataService.getTotalCount(dataNode));
    }

    @GetMapping("/findById")
    public ResponseEntity<RasterData> findById(@RequestParam String id){
        return ResponseEntity.ok(igeoDataService.findById(dataNode, id));
    }

    @GetMapping("/findByIdList")
    public ResponseEntity<List<RasterData>> findByIdList(@RequestParam List<String> ids){
        return ResponseEntity.ok(igeoDataService.findByIdList(dataNode, ids));
    }

    @GetMapping("getFilePathById")
    public ResponseEntity<String> getFilePathById(@RequestParam String id) {
        RasterData rasterData = igeoDataService.findById(dataNode, id);
        return ResponseEntity.ok(rasterData.getPath());
    }

    @PostMapping("/insertData")
    public ResponseEntity<String> insertData(@RequestBody JSONObject jsonObject)  {
        return ResponseEntity.ok(igeoDataService.insertData(dataNode, jsonObject));
    }

    @GetMapping("/getFileById")
    public ResponseEntity<FileSystemResource> getFileById(@RequestParam String id) {
        RasterData rasterData = igeoDataService.findById(dataNode, id);
        String filePath = rasterData.getPath();
        String fileName = rasterData.getName();
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName + ".tif");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/zip"); // 根据实际文件类型设置
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

    @DeleteMapping("/deleteFileById")
    public ResponseEntity<String> deleteFileById(@RequestParam String id) {
        RasterData rasterData = igeoDataService.findById(dataNode, id);
        String filePath = rasterData.getPath();
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
}
