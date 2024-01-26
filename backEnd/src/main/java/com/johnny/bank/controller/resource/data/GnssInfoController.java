package com.johnny.bank.controller.resource.data;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.service.resource.data.impl.MonitorInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/11
 * @Description:
 */
@RestController
@RequestMapping("api/v1/data/gnssInfo")
@Slf4j
public class GnssInfoController {
    private final MonitorInfoService deviceInfoService;
    private final DataNode dataNode;

    @Autowired
    public GnssInfoController(MonitorInfoService deviceInfoService) {
        this.deviceInfoService = deviceInfoService;
        this.dataNode = deviceInfoService.getDataNode();
    }

    @GetMapping()
    public ResponseEntity<List<MonitorInfo>> findAllGnssDevice() {
        return ResponseEntity.ok(deviceInfoService.getDeviceByType(dataNode, '1'));
    }

    @GetMapping("id/{id}")
    public ResponseEntity<MonitorInfo> findGnssDeviceById(@PathVariable String id) {
        return ResponseEntity.ok(deviceInfoService.getDataById(dataNode, id));
    }
}
