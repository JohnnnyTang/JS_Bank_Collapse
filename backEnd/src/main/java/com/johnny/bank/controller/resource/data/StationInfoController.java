package com.johnny.bank.controller.resource.data;

import com.johnny.bank.controller.resource.data.base.BaseStaticInfoController;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.StationInfo;
import com.johnny.bank.service.resource.data.impl.StationInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
@RestController
@RequestMapping("api/v1/data/stationInfo")
public class StationInfoController extends BaseStaticInfoController<StationInfo> {

    private final StationInfoService stationInfoService;
    private final DataNode dataNode;

    @Autowired
    public StationInfoController(
            @Qualifier("StationInfoService") StationInfoService stationInfoService) {
        this.stationInfoService = stationInfoService;
        this.dataNode = stationInfoService.getDataNode();
    }

    @Override
    @GetMapping
    public ResponseEntity<List<StationInfo>> findAll() {
        return ResponseEntity.ok(stationInfoService.getAllData(dataNode));
    }

    @Override
    @GetMapping("/id/{id}")
    public ResponseEntity<StationInfo> findById(@PathVariable String id) {
        return ResponseEntity.ok(stationInfoService.getDataById(dataNode, id));
    }

    @Override
    @GetMapping("/ids")
    public ResponseEntity<List<StationInfo>> findByIdList(@RequestParam List<String> idList) {
        return ResponseEntity.ok(stationInfoService.getDataByIdList(dataNode, idList));
    }

    @Override
    @GetMapping("/count")
    public ResponseEntity<Integer> getRowNumber() {
        return ResponseEntity.ok(stationInfoService.getRowNumber(dataNode));
    }

    @Override
    @GetMapping("/code/{code}")
    public ResponseEntity<StationInfo> findByCode(@PathVariable String code) {
        return ResponseEntity.ok(stationInfoService.getDataByCode(dataNode, code));
    }

    @Override
    @GetMapping("/codes")
    public ResponseEntity<List<StationInfo>> findByCodeList(@RequestParam List<String> codeList) {
        return ResponseEntity.ok(stationInfoService.getDataByCodeList(dataNode, codeList));
    }

    @Override
    @GetMapping("/newest")
    public ResponseEntity<StationInfo> findNewestData() {
        return ResponseEntity.ok(stationInfoService.getNewestData(dataNode));
    }

}
