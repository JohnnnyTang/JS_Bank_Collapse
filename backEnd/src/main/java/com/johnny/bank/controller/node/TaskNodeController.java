package com.johnny.bank.controller.node;

import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.service.node.impl.TaskNodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@RestController
@RequestMapping("api/v1/taskNode")
public class TaskNodeController extends BaseNodeController<TaskNode> {
    @PostMapping("start")
    public ResponseEntity<String> startCmdOutTask(@RequestBody TaskNode taskNode) throws IOException {
        String taskNodeId = ((TaskNodeService) nodeServiceImpl).createAndStartNewTask(taskNode);
        return ResponseEntity.ok(taskNodeId);
    }
}
