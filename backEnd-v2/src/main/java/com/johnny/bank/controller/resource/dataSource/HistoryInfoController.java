package com.johnny.bank.controller.resource.dataSource;

import com.johnny.bank.model.resource.dataResource.CollapseHistory;
import com.johnny.bank.service.resource.dataSource.impl.CollapseInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.controller.resource.data
 * @className: CollapseInfoController
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/24 15:12
 * @version: 1.0
 */
@RestController
@RequestMapping("api/v1/data/historyInfo")
public class HistoryInfoController {

    private final CollapseInfoService collapseInfoService;

    @Autowired
    public HistoryInfoController(CollapseInfoService collapseInfoService) {
        this.collapseInfoService = collapseInfoService;
    }

    @GetMapping
    public ResponseEntity<List<CollapseHistory>> getAllInfo() {
        return ResponseEntity.ok(collapseInfoService.getAllInfo());
    }

    @GetMapping("desc")
    public ResponseEntity<List<CollapseHistory>> getInfoWithDesc() {
        return ResponseEntity.ok(collapseInfoService.getAllInfoWithDesc());
    }

    @GetMapping("desc/sort")
    public ResponseEntity<List<CollapseHistory>> getInfoSortByDesc() {
        return ResponseEntity.ok(collapseInfoService.getAllInfoSortByDesc());
    }
}
