package com.johnny.bank.controller.resource.dataSource;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.resource.dataSource.impl.BankResourceService;
import com.johnny.bank.service.resource.dataSource.impl.ModelServerService;
import com.johnny.bank.utils.DataNodeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/8/28 15:38
 * @Description:
 */

@RestController
@RequestMapping("api/v2/data/bankResource")
@Slf4j
public class BankResourceController {

    @Autowired
    BankResourceService bankResourceService;

    @Autowired
    ModelServerService modelServerService;

    // 资源节点获取
    @GetMapping("/bank")
    public ResponseEntity<JSONArray> getAllBankDataNode() {
        String category = "BankNode";
        List<DataNodeV2> bankList = bankResourceService.getBankList(category);
        return ResponseEntity.ok(DataNodeUtil.transferToJsonArray(bankList));
    }

    @GetMapping("/bank/{bank}")
    public ResponseEntity<String> getBankInfo(@PathVariable String bank) {
        String category = "BankNode";
        String name = bank + "BankNode";
        String bankInfo = bankResourceService.getBankInfo(category, name);
        return ResponseEntity.ok(bankInfo);
    }

    @GetMapping("/bank/calculate/dataType")
    public ResponseEntity<JSONArray> getBankStaticCalculateDataNode(@RequestParam String dataType, @RequestParam String bank) {
        DataNodeV2 dataGroupNode = bankResourceService.getCalculateDataGroupNode(dataType, bank);
        String path = dataGroupNode.getPath()+dataGroupNode.getName() + ",";
        List<DataNodeV2> dataList = bankResourceService.getStaticDataList(path);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_calculateDEM(dataList));
    }

    @GetMapping("/bank/visual/dataType")
    public ResponseEntity<JSONArray> getBankStaticDataNode(@RequestParam String dataType, @RequestParam String bank) {
        DataNodeV2 dataGroupNode = bankResourceService.getVisualDataGroupNode(dataType, bank);
        String path = dataGroupNode.getPath()+dataGroupNode.getName() + ",";
        List<DataNodeV2> dataList = bankResourceService.getStaticDataList(path);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_visualDEM(dataList));
    }

    // 资源获取
    // modelServer
    @GetMapping("/down/modelServer/result/caseId")
    public String getResultByCaseId(@RequestParam String caseId) {
        return modelServerService.getResultByCaseId(caseId);
    }

    @GetMapping("/down/modelServer/result/file/json")
    public String getJsonDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        return modelServerService.getJsonDataByCaseIdAndFileName(caseId, name);
    }

    @GetMapping("/down/modelServer/result/file/txt")
    public ResponseEntity<byte[]> getTxtDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] binData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/down/modelServer/result/file/bin")
    public ResponseEntity<byte[]> getBinDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] binData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/down/modelServer/result/file/image")
    public ResponseEntity<byte[]> getPngDataByCaseIdAndFileName(@RequestParam String caseId, @RequestParam String name) {
        byte[] imageData = modelServerService.getByteDataByCaseIdAndFileName(caseId, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/png"));
        return ResponseEntity.ok()
                .headers(headers)
                .body(imageData);
    }

    @GetMapping("/down/modelServer/resource/file/json")
    public String getResourceJsonDataByCaseIdAndFileName(@RequestParam String name) {
        return modelServerService.getResourceJsonDataByCaseIdAndFileName(name);
    }

    @GetMapping("/down/modelServer/resource/file/txt")
    public ResponseEntity<byte[]> getResourceTxtDataByCaseIdAndFileName(@RequestParam String name) {
        byte[] binData = modelServerService.getResourceByteDataByCaseIdAndFileName(name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/down/modelServer/resource/file/bin")
    public ResponseEntity<byte[]> getResourceBinDataByCaseIdAndFileName(@RequestParam String name) {
        byte[] binData = modelServerService.getResourceByteDataByCaseIdAndFileName(name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    @GetMapping("/down/modelServer/resource/file/image")
    public ResponseEntity<byte[]> getResourcePngDataByCaseIdAndFileName(@RequestParam String name) {
        byte[] imageData = modelServerService.getResourceByteDataByCaseIdAndFileName(name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/png"));
        return ResponseEntity.ok()
                .headers(headers)
                .body(imageData);
    }

    // 资源获取
    // local


    // 资源上载
    // modelServer
    @PostMapping("/up/modelServer/resource/file")
    public ResponseEntity<String> uploadResourceCalculateData(@RequestParam("file") MultipartFile file, @RequestParam("info") String info) throws IOException, InterruptedException {
        return ResponseEntity.ok(modelServerService.uploadCalculateResourceData(file, JSONObject.parse(info)));
    }

    // 资源上载
    // local
    @PostMapping("/up/local/resource/bank/{bank}")
    public ResponseEntity<String> addNewBank(@PathVariable String bank, @RequestBody JSONObject info) {
        return ResponseEntity.ok(bankResourceService.addNewBank(bank, info));
    }

    // 资源删除
    @DeleteMapping("/delete/local/resource/bank/{bank}")
    public ResponseEntity<String> deleteBank(@PathVariable String bank) {
        return ResponseEntity.ok(bankResourceService.deleteBank(bank));
    }

    // 资源更新
    @PutMapping("/update/local/resource/bank/{bank}")
    public ResponseEntity<String> updateBankInfo(@PathVariable String bank, @RequestBody JSONObject info) {
        return ResponseEntity.ok(bankResourceService.updateBankInfo(bank, info));
    }

}
