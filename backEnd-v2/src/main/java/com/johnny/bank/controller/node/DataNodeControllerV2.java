package com.johnny.bank.controller.node;

import com.alibaba.fastjson2.JSONArray;
import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.utils.DataNodeUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
