package com.johnny.bank.controller.node;

import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@RestController
@RequestMapping("api/v2/dataNode")
public class DataNodeControllerV2 extends BaseNodeController<DataNodeV2> {
    @PutMapping("/category/{category}/tableName/{tableName}")
    public ResponseEntity<Boolean> alterAllDataNodeUsage(
            @PathVariable("category") String category, @PathVariable("tableName") String tableName) {
        boolean res = ((DataNodeServiceV2)nodeServiceImpl).updateDataNodeTableNameOfOneCategory(category, tableName);
        return ResponseEntity.ok(res);
    }
}
