package com.johnny.bank.controller.resource.data.base;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.base.DetailMonitorInfo;
import com.johnny.bank.service.resource.data.impl.DetailMonitorInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.controller.resource.data.base
 * @className: DetailMonitorInfoController
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/23 20:30
 * @version: 1.0
 */
@Slf4j
public class DetailMonitorInfoController<T extends DetailMonitorInfoService<?>> {
    protected T detailMonitorInfoService;
    protected DataNode dataNode;

    public DetailMonitorInfoController(T detailMonitorInfoService) {
        this.detailMonitorInfoService = detailMonitorInfoService;
        this.dataNode = detailMonitorInfoService.getDataNode();
//        log.info(this.dataNode.toString());
    }

    @GetMapping
    public ResponseEntity<List<DetailMonitorInfo>> getAllData() {
        return ResponseEntity.ok(detailMonitorInfoService.getAllData(dataNode));
    }

    @GetMapping("id/{id}")
    public ResponseEntity<DetailMonitorInfo> getDataById(@PathVariable String id) {
        return ResponseEntity.ok(detailMonitorInfoService.getDataById(dataNode, id));
    }
}
