package com.johnny.bank.controller.node;

import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.service.node.impl.TaskNodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@RestController
@RequestMapping("api/v1/taskNode")
public class TaskNodeController extends BaseNodeController<TaskNode> {
    @PostMapping("start")
    public ResponseEntity<String> startCmdOutTask(@RequestBody TaskNode taskNode) throws Exception {
        String taskNodeId = ((TaskNodeService) nodeServiceImpl).createAndStartNewTask(taskNode);
        return ResponseEntity.ok(taskNodeId);
    }

    @PutMapping("status/{id}/{status}")
    public ResponseEntity<Boolean> changeStatus(@PathVariable String id, @PathVariable String status) {
        return ResponseEntity.ok(((TaskNodeService) nodeServiceImpl).updateNodeStatusById(id, status));
    }

    @GetMapping("auto")
    public ResponseEntity<List<TaskNode>> getAutoTasks() {
        return ResponseEntity.ok(((TaskNodeService) nodeServiceImpl).getAutoTaskNode());
    }

    @GetMapping("manual")
    public ResponseEntity<List<TaskNode>> getManualTasks() {
        return ResponseEntity.ok(((TaskNodeService) nodeServiceImpl).getManualTaskNode());
    }

//    @GetMapping("idTest/{id}")
//    public ResponseEntity<TaskNode> queryById(@PathVariable String id) {
//        return ResponseEntity.ok(((TaskNodeService) nodeServiceImpl).queryById(id));
//    }
}
