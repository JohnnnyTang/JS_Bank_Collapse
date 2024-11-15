package com.johnny.bank.controller.resource.dataSource;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map;

import static org.apache.naming.SelectorContext.prefix;

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

    @Autowired
    DataNodeServiceV2 dataNodeServiceV2;

    @Autowired
    IDataNodeRepoV2 iDataNodeRepoV2;

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
        if (dataGroupNode==null) {
            JSONArray emptyArray = new JSONArray();
            return ResponseEntity.ok(emptyArray);
        }
        String path = dataGroupNode.getPath()+dataGroupNode.getName() + ",";
        List<DataNodeV2> dataList = bankResourceService.getStaticDataList(path);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_calculateDEM(dataList));
    }

    @GetMapping("/bank/visual/dataType")
    public ResponseEntity<JSONArray> getBankStaticDataNode(@RequestParam String dataType, @RequestParam String bank) {
        DataNodeV2 dataGroupNode = bankResourceService.getTileVisualDataGroupNode(dataType, bank);
        if (dataGroupNode==null) {
            JSONArray emptyArray = new JSONArray();
            return ResponseEntity.ok(emptyArray);
        }
        String path = dataGroupNode.getPath()+dataGroupNode.getName() + ",";
        List<DataNodeV2> dataList = bankResourceService.getStaticDataList(path);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_visualDEM(dataList));
    }

    @GetMapping("/bank/visual/vector")
    public ResponseEntity<JSONArray> getBankStaticDataNode(@RequestParam String bank) {
        DataNodeV2 dataGroupNode = bankResourceService.getVectorVisualDataGroupNode(bank);
        if (dataGroupNode==null) {
            JSONArray emptyArray = new JSONArray();
            return ResponseEntity.ok(emptyArray);
        }
        String path = dataGroupNode.getPath()+"VectorDataGroupOf"+bank+",";
        List<DataNodeV2> dataList = bankResourceService.getStaticDataList(path);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_basicInfo(dataList));
    }

    @GetMapping("/bank/device/type")
    public ResponseEntity<JSONArray> getResourceDeviceData(@RequestParam String bank, @RequestParam String typeCode) {
        DataNodeV2 dataGroupNode = bankResourceService.getDeviceDataGroupNode(bank, typeCode);
        if (dataGroupNode==null) {
            JSONArray emptyArray = new JSONArray();
            return ResponseEntity.ok(emptyArray);
        }
        String path = dataGroupNode.getPath()+dataGroupNode.getName()+",";
        List<DataNodeV2> dataList = bankResourceService.getStaticDataList(path);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_basicInfo(dataList));
    }

    @GetMapping("/bank/picture")
    public ResponseEntity<JSONArray> getResourcePictureData(@RequestParam String bank) {
        DataNodeV2 dataGroupNode = bankResourceService.getPictureDataGroupNode(bank);
        if (dataGroupNode==null) {
            JSONArray emptyArray = new JSONArray();
            return ResponseEntity.ok(emptyArray);
        }
        String path = dataGroupNode.getPath()+dataGroupNode.getName()+",";
        List<DataNodeV2> dataLst = bankResourceService.getStaticDataList(path);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_basicInfo(dataLst));
    }

    @GetMapping("/bank/text")
    public ResponseEntity<JSONArray> getResourceTextData(@RequestParam String bank) {
        DataNodeV2 dataGroupNode = bankResourceService.getTextDataGroupNode(bank);
        if (dataGroupNode==null) {
            JSONArray emptyArray = new JSONArray();
            return ResponseEntity.ok(emptyArray);
        }
        String path = dataGroupNode.getPath()+dataGroupNode.getName()+",";
        List<DataNodeV2> dataLst = bankResourceService.getStaticDataList(path);
        return ResponseEntity.ok(DataNodeUtil.transferToFolderList_basicInfo(dataLst));
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

    // local
    @GetMapping("/down/local/resource/{bank}/picture/{name}")
    public ResponseEntity<byte[]> getResourcePictureDataByBankAndName(@PathVariable String bank, @PathVariable String name) {
        byte[] binData = bankResourceService.getPictureResourceByteDataByBankAndName(bank, name);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/png"));
        return ResponseEntity.ok()
                .headers(headers)
                .body(binData);
    }

    // 资源获取
    // local
    @GetMapping("/down/local/resource/waterCondition")
    public ResponseEntity<JSONArray> getResourceWaterCondition() {
        return ResponseEntity.ok(bankResourceService.getWaterCondition());
    }

    @GetMapping("/down/local/resource/tidalRange")
    public ResponseEntity<JSONArray> getResourcetidalRange() {
        return ResponseEntity.ok(bankResourceService.getTidalRange());
    }

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

    @PostMapping("/up/local/resource/{bank}/file")
    public ResponseEntity<String> uploadResourceVisualizationData(
            @PathVariable String bank, @RequestParam("file") MultipartFile file, @RequestParam("info") String info) throws IOException, InterruptedException {
        return ResponseEntity.ok(bankResourceService.uploadVisualizationResourceData(file, bank, JSONObject.parse(info)));
    }

    @PostMapping("/up/local/resource/{bank}/device")
    public ResponseEntity<String> uploadResourceDeviceData(@PathVariable String bank, @RequestBody JSONObject data) {
        return ResponseEntity.ok(bankResourceService.uploadDeviceResourceData(bank, data));
    }

    @PostMapping("/up/local/resource/{bank}/picture")
    public ResponseEntity<String> uploadResourcePictureData(
            @PathVariable String bank, @RequestParam("file") MultipartFile file, @RequestParam("info") String info) throws IOException {
        return ResponseEntity.ok(bankResourceService.uploadPictureResourceData(file, bank, JSONObject.parse(info)));
    }

    @PostMapping("/up/local/resource/{bank}/text")
    public ResponseEntity<String> uploadResourceTextData(
            @PathVariable String bank, @RequestParam("info") String info) throws IOException {
        return ResponseEntity.ok(bankResourceService.uploadTextResourceData(bank, JSONObject.parse(info)));
    }

    // 资源删除
    @DeleteMapping("/delete/local/resource/bank/{bank}")
    public ResponseEntity<String> deleteBank(@PathVariable String bank) {
        return ResponseEntity.ok(bankResourceService.deleteBank(bank));
    }

    @DeleteMapping("/delete/local/resource/device/{code}")
    public ResponseEntity<String> deleteDevice(@PathVariable String code) {
        return ResponseEntity.ok(bankResourceService.deleteDevice(code));
    }

    @DeleteMapping("/delete/local/resource/{bank}/file/{name}")
    public ResponseEntity<String> deleteVector(@PathVariable String bank, @PathVariable String name) {
        return ResponseEntity.ok(bankResourceService.deleteVector(bank, name));
    }

    @DeleteMapping("/delete/calculate/resource/{bank}/file/{dataType}/{name}")
    public ResponseEntity<String> deleteCalculateResource(@PathVariable String bank, @PathVariable String dataType, @PathVariable String name) {
        return ResponseEntity.ok(modelServerService.deleteCalculateResourceData(bank, dataType, name));
    }

    @DeleteMapping("/delete/local/resource/picture/{bank}/{name}")
    public ResponseEntity<String> deletePicture(@PathVariable String bank, @PathVariable String name) {
        return ResponseEntity.ok(bankResourceService.deletePictureResourceData(bank, name));
    }

    @DeleteMapping("/delete/local/resource/text/{bank}/{name}")
    public ResponseEntity<String> deleteText(@PathVariable String bank, @PathVariable String name) {
        return ResponseEntity.ok(bankResourceService.deleteTextResourceData(bank, name));
    }

    // 资源更新
    @PutMapping("/update/local/resource/bank/{bank}")
    public ResponseEntity<String> updateBankInfo(@PathVariable String bank, @RequestBody JSONObject info) {
        return ResponseEntity.ok(bankResourceService.updateBankInfo(bank, info));
    }

    @PutMapping("/update/local/resource/{bank}/device/{code}")
    public ResponseEntity<String> updateResourceDeviceData(@PathVariable String bank, @PathVariable String code, @RequestBody JSONObject data) {
        return ResponseEntity.ok(bankResourceService.updateDeviceResourceData(bank, code, data));
    }

    @PutMapping("/update/local/resource/{bank}/file/{name}")
    public ResponseEntity<String> updateResourceVectorDataInfo(@PathVariable String bank, @PathVariable String name, @RequestBody JSONObject data) {
        return ResponseEntity.ok(bankResourceService.updateVisualizationResourceDataInfo(bank, name, data));
    }

    @PostMapping("/update/local/resource/{bank}/file/{name}")
    public ResponseEntity<String> updateResourceVectorData(
            @RequestParam("file") MultipartFile file, @PathVariable String bank, @PathVariable String name, @RequestParam("data") String data) throws IOException, InterruptedException {
        return ResponseEntity.ok(bankResourceService.updateVisualizationResourceData(file, bank, name, JSONObject.parseObject(data)));
    }

    @PostMapping("/update/local/resource/picture/{bank}/{name}")
    public ResponseEntity<String> updateResourcePictureData(
            @RequestParam("file") MultipartFile file, @PathVariable String bank, @PathVariable String name, @RequestParam("data") String data) throws IOException {
        return ResponseEntity.ok(bankResourceService.updatePictureResourceData(file, bank, JSONObject.parseObject(data), name));
    }

    @PutMapping("/update/local/resource/text/{bank}/{name}")
    public ResponseEntity<String> updateTextData(
            @PathVariable String bank, @PathVariable String name, @RequestBody JSONObject data) {
        return ResponseEntity.ok(bankResourceService.updateTextResourceData(bank, data, name));
    }


    // section
    // 断面上载
    @PostMapping("/up/section/resource/file")
    public ResponseEntity<String> uploadResourceSectionData(@RequestParam("file") MultipartFile file, @RequestParam("info") String info) throws IOException, InterruptedException {
        return ResponseEntity.ok(bankResourceService.uploadSectionResourceData(file, JSONObject.parse(info)));
    }
    // 断面删除
    @DeleteMapping("/delete/section/resource/{bank}/file/{name}")
    public ResponseEntity<String> deleteResourceSectionData(@PathVariable String bank, @PathVariable String name) {
        return ResponseEntity.ok(bankResourceService.deleteSection(bank, name));
    }
    // 断面信息获取
    @GetMapping("/down/section/resource/{bank}/info/{type}")
    public ResponseEntity<JSONArray> getResourceSectionInfo(@PathVariable String bank, @PathVariable String type) {
        DataNodeV2 dataNodeV2 = iDataNodeRepoV2.getNodeByCategoryAndBank("SectionDataItem", bank);
        return ResponseEntity.ok().body(bankResourceService.getSectionInfo(dataNodeV2, type));
    }
    // 岸段名称列表获取
    @PostMapping("/down/bank/name")
    public ResponseEntity<List<String>> getImportantBankName(@RequestParam("prefix") String prefix) {
        DataNodeV2 dataNodeV2 = dataNodeServiceV2.getDataNodeByCategoryName("ImportantBank", "ImportantBank");
        return ResponseEntity.ok().body(bankResourceService.getImportantBankName(dataNodeV2, prefix));
    }
    // 岸段信息获取
    @PostMapping("/down/bank/info")
    public ResponseEntity<Map<String, String>> getImportantBankInfo(@RequestParam("name") String name) {
        DataNodeV2 dataNodeV2 = dataNodeServiceV2.getDataNodeByCategoryName("ImportantBank", "ImportantBank");
        return ResponseEntity.ok().body(bankResourceService.getImportantBankInfo(dataNodeV2, name));
    }
    // 上传模型参数
    @PostMapping("/up/model/params")
    public ResponseEntity<String> uploadModelParams(@RequestBody Map<String, Object> requestData) throws IOException, InterruptedException {
        Map<String, Object> params = (Map<String, Object>) requestData.get("params");
        String type = (String) requestData.get("type");
        Map<String, String> info = (Map<String, String>) requestData.get("info");
        return ResponseEntity.ok().body(bankResourceService.uploadModelParams(params, type, info));
    }

}
