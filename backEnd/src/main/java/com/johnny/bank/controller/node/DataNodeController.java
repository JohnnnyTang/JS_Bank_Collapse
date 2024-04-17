package com.johnny.bank.controller.node;

import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.service.node.impl.DataNodeService;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/apiPrefix")
    public ResponseEntity<Boolean> alterAllNodeApiPrefix(
            @RequestParam("ip") String ip, @RequestParam("port") String port, @RequestParam("db") String db) {
        boolean res = ((DataNodeService)nodeServiceImpl).updateDataNodeApi(ip, port, db);
        return ResponseEntity.ok(res);
    }
}
