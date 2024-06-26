package com.johnny.bank.controller.resource.data;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.controller.resource.data.base.GeoDataController;
import com.johnny.bank.model.resource.dataResource.ShpData;
import com.johnny.bank.model.resource.dataResource.TxtData;
import com.johnny.bank.service.resource.data.ITxtDataService;
import com.johnny.bank.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: TxtDataController
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/28 23:08
 * @version: 1.0
 */

@RestController
@RequestMapping("GeoData/TxtData")
public class TxtDataController extends GeoDataController<ITxtDataService> {

    @Autowired
    public TxtDataController(ITxtDataService txtDataService) {
        super(txtDataService);
    }

    @GetMapping("/getTotalCount")
    public ResponseEntity<Integer> getTotalCount(){
        return ResponseEntity.ok(igeoDataService.getTotalCount(dataNode));
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<TxtData>> findAll() {
        return ResponseEntity.ok(igeoDataService.findAll(dataNode));
    }

    @GetMapping("/findById")
    public ResponseEntity<TxtData> findById(@RequestParam String id){
        return ResponseEntity.ok(igeoDataService.findById(dataNode, id));
    }

    @GetMapping("/findByIdList")
    public ResponseEntity<List<TxtData>> findByIdList(@RequestParam List<String> ids){
        return ResponseEntity.ok(igeoDataService.findByIdList(dataNode, ids));
    }

    @PostMapping("/insertData")
    public ResponseEntity<String> insertData(@RequestBody JSONObject jsonObject)  {
        return ResponseEntity.ok(igeoDataService.insertData(dataNode, jsonObject));
    }

    @GetMapping("getFilePathById")
    public ResponseEntity<String> getFilePathById(@RequestParam String id) {
        TxtData txtData = igeoDataService.findById(dataNode, id);
        return ResponseEntity.ok(txtData.getPath());
    }

    @GetMapping("/getFileById")
    public ResponseEntity<FileSystemResource> getFileById(@RequestParam String id) {
        TxtData txtData = igeoDataService.findById(dataNode, id);
        String filePath = txtData.getPath();
        String fileName = txtData.getName();
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName + ".txt");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/txt"); // 根据实际文件类型设置
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
        TxtData txtData = igeoDataService.findById(dataNode, id);
        String filePath = txtData.getPath();
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

//    @PostMapping("/test")
//    public ResponseEntity<String> test(@RequestPart MultipartFile file) throws IOException {
//        String path = "D:/DownLoads";
//        String storedFilePath = FileUtil.storeFile(file, path);
//
//        return ResponseEntity.ok(storedFilePath);
//    }

}
