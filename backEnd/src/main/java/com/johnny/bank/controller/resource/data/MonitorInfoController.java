package com.johnny.bank.controller.resource.data;

import com.johnny.bank.controller.resource.data.base.BaseStaticInfoController;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.service.resource.data.impl.MonitorInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
@RestController
@RequestMapping("api/v1/data/monitorInfo")
public class MonitorInfoController extends BaseStaticInfoController<MonitorInfo> {
    private final MonitorInfoService deviceInfoService;
    private final DataNode dataNode;

    @Autowired
    public MonitorInfoController(MonitorInfoService deviceInfoService) {
        this.deviceInfoService = deviceInfoService;
        this.dataNode = deviceInfoService.getDataNode();
    }

    @Override
    @GetMapping
    public ResponseEntity<List<MonitorInfo>> findAll() {
        return ResponseEntity.ok(deviceInfoService.getAllData(dataNode));
    }

    @Override
    @GetMapping("/id/{id}")
    public ResponseEntity<MonitorInfo> findById(@PathVariable String id) {
        return ResponseEntity.ok(deviceInfoService.getDataById(dataNode, id));
    }

    @Override
    @GetMapping("/ids")
    public ResponseEntity<List<MonitorInfo>> findByIdList(@RequestParam List<String> idList) {
        return ResponseEntity.ok(deviceInfoService.getDataByIdList(dataNode, idList));
    }

    @Override
    @GetMapping("/count")
    public ResponseEntity<Integer> getRowNumber() {
        return ResponseEntity.ok(deviceInfoService.getRowNumber(dataNode));
    }

    @Override
    @GetMapping("/code/{code}")
    public ResponseEntity<MonitorInfo> findByCode(@PathVariable int code) {
        return ResponseEntity.ok(deviceInfoService.getDataByCode(dataNode, code));
    }

    @Override
    @GetMapping("/codes")
    public ResponseEntity<List<MonitorInfo>> findByCodeList(@RequestParam List<Integer> codeList) {
        return null;
    }

    @Override
    @GetMapping("/newest")
    public ResponseEntity<MonitorInfo> findNewestData() {
        return null;
    }

    @GetMapping("/station/{stationCode}")
    public ResponseEntity<List<MonitorInfo>> findDataByStationCode(@PathVariable int stationCode) {
        return ResponseEntity.ok(deviceInfoService.getDataByStationCode(dataNode, stationCode));
    }

    @GetMapping("/stations")
    public ResponseEntity<List<MonitorInfo>> findDataByStationCodeList(@RequestParam List<Integer> stationCodeList) {
        return ResponseEntity.ok(deviceInfoService.getDataByStationCodeList(dataNode, stationCodeList));
    }

    @GetMapping("/newest/station/{stationCode}")
    public ResponseEntity<MonitorInfo> findNewestInStation(@PathVariable int stationCode) {
        return ResponseEntity.ok(deviceInfoService.getNewestDeviceInStation(dataNode, stationCode));
    }
}
