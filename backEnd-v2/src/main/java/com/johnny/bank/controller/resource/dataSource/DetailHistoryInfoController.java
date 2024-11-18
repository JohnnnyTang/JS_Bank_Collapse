package com.johnny.bank.controller.resource.dataSource;

import com.johnny.bank.model.resource.dataResource.                                               DetailHistory;
import com.johnny.bank.service.resource.dataSource.impl.DetailCollapseInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
@RequestMapping("api/v1/data/detail")
public class DetailHistoryInfoController {

    private final DetailCollapseInfoService collapseInfoService;

    @Autowired
    public DetailHistoryInfoController(DetailCollapseInfoService collapseInfoService) {
        this.collapseInfoService = collapseInfoService;
    }

    @GetMapping
    public ResponseEntity<List<DetailHistory>> getAllInfo() {
        return ResponseEntity.ok(collapseInfoService.getAllDetail());
    }

    @GetMapping("uuid/{uuid}")
    public ResponseEntity<DetailHistory> getInfoWithUuid(@PathVariable String uuid) {
        return ResponseEntity.ok(collapseInfoService.getDetailByUuid(uuid));
    }

//    @PostMapping
//    public ResponseEntity<Boolean> saveDetailInfo(@RequestBody DetailHistory detailHistory) {
//        collapseInfoService.
//    }
}
