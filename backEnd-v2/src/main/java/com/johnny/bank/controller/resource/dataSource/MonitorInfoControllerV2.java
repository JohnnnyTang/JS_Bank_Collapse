package com.johnny.bank.controller.resource.dataSource;

import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.resource.dataSource.impl.MonitorInfoServiceV2;
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
@RequestMapping("api/v2/data/bank/{bank}/monitorInfo")
public class MonitorInfoControllerV2 {
    private final MonitorInfoServiceV2 deviceInfoService;
    private final DataNodeServiceV2 dataNodeService;

    @Autowired
    public MonitorInfoControllerV2(MonitorInfoServiceV2 deviceInfoService, DataNodeServiceV2 dataNodeServiceV2) {
        this.deviceInfoService = deviceInfoService;
        this.dataNodeService = dataNodeServiceV2;
    }

    @GetMapping()
    public ResponseEntity<List<MonitorInfo>> findAll(@PathVariable String bank) {
//        return ResponseEntity.ok(deviceInfoService.getAllData(deviceInfoService.getDataNode(bank)));
        return ResponseEntity.ok(deviceInfoService.getAllData(dataNodeService.getRealtimeDeviceGroupNode(bank)));
    }

//    @GetMapping("/id/{id}")
//    public ResponseEntity<MonitorInfo> findById(@PathVariable String bank, @PathVariable String id) {
//        return ResponseEntity.ok(deviceInfoService.getInfoById(dataNodeService.getRealtimeDeviceGroupNode(bank), id));
//    }

    @GetMapping("/type/{typeCode}/id/{id}")
    public ResponseEntity<MonitorInfo> findByIdAndType(@PathVariable String bank, @PathVariable String typeCode, @PathVariable String id) {
        return ResponseEntity.ok(deviceInfoService.getInfoByTypeAndIdFromNode(bank, typeCode, id));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<MonitorInfo> findById(@PathVariable String bank, @PathVariable String id) {
        return ResponseEntity.ok(deviceInfoService.getInfoByIdFromNode(bank, id));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<MonitorInfo>> findByIdList(@PathVariable String bank, @RequestParam List<String> idList) {
        return ResponseEntity.ok(deviceInfoService.getInfoByIdList(dataNodeService.getRealtimeDeviceGroupNode(bank), idList));
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getRowNumber(@PathVariable String bank) {
        return ResponseEntity.ok(deviceInfoService.getRowNumber(dataNodeService.getRealtimeDeviceGroupNode(bank)));
    }

    @GetMapping("/newest")
    public ResponseEntity<MonitorInfo> findNewestData(@PathVariable String bank) {
        return ResponseEntity.ok(deviceInfoService.getNewestData(dataNodeService.getRealtimeDeviceGroupNode(bank)));
    }

    @GetMapping("/station/{stationCode}")
    public ResponseEntity<List<MonitorInfo>> findDataByStationCode(@PathVariable String bank, @PathVariable String stationCode) {
        return ResponseEntity.ok(deviceInfoService.getInfoByStationCode(dataNodeService.getRealtimeDeviceGroupNode(bank), stationCode));
    }

    @GetMapping("/stations")
    public ResponseEntity<List<MonitorInfo>> findDataByStationCodeList(@PathVariable String bank, @RequestParam List<String> stationCodeList) {
        return ResponseEntity.ok(deviceInfoService.getInfoByStationCodeList(dataNodeService.getRealtimeDeviceGroupNode(bank), stationCodeList));
    }

    @GetMapping("/newest/station/{stationCode}")
    public ResponseEntity<MonitorInfo> findNewestInStation(@PathVariable String bank, @PathVariable String stationCode) {
        return ResponseEntity.ok(deviceInfoService.getNewestDeviceInStation(dataNodeService.getRealtimeDeviceGroupNode(bank), stationCode));
    }

    @GetMapping("/type/{typeCode}")
    public ResponseEntity<List<MonitorInfo>> findDataByTypeCode(@PathVariable String bank, @PathVariable Character typeCode) {
        DataNodeV2 deviceTypeNode = dataNodeService.getDeviceTypeDataNode(typeCode, bank);
        return ResponseEntity.ok(deviceInfoService.getDeviceByTypeWithTypeNode(deviceTypeNode));
    }
}
