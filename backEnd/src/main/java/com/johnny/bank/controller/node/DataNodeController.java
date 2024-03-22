package com.johnny.bank.controller.node;

import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.service.node.impl.DataNodeService;
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
@RequestMapping("api/v1/dataNode")
public class DataNodeController extends BaseNodeController<DataNode> {
    @PutMapping("/usage/{userName}/{password}")
    public ResponseEntity<Boolean> alterAllDataNodeUsage(
            @PathVariable("userName") String userName, @PathVariable("password") String password) {
        boolean res = ((DataNodeService)nodeServiceImpl).updateDataNodeUsage(userName, password);
        return ResponseEntity.ok(res);
    }
}
