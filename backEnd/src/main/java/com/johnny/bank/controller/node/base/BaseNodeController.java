package com.johnny.bank.controller.node.base;

import com.johnny.bank.model.node.base.BaseNode;
import com.johnny.bank.model.node.base.TreeNode;
import com.johnny.bank.service.node.impl.NodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Author: Johnny T
 * @Date: 2023/12/20
 * @Description:
 */
@RestController
//@RequestMapping("api/v1/baseNode")
public abstract class BaseNodeController<T extends BaseNode> extends AbstractNodeController<T> {

    private NodeService<T> nodeServiceImpl;

    @Autowired
    public void setNodeServiceImpl(NodeService<T> nodeServiceImpl) {
        this.nodeServiceImpl = nodeServiceImpl;
    }

    @PostMapping
    public ResponseEntity<String> save(@RequestBody T baseNode) {
        return  ResponseEntity.ok(nodeServiceImpl.save(baseNode));
    }

    @GetMapping
    public ResponseEntity<List<T>> findAll() {
        return ResponseEntity.ok(nodeServiceImpl.findAll());
    }

    @GetMapping("/{nodeId}")
    public ResponseEntity<T> findById(@PathVariable("nodeId") String productId) {
        return ResponseEntity.ok(nodeServiceImpl.findById(productId));
    }

    @PostMapping("/{nodeId}")
    public ResponseEntity<Void> deleteById(@PathVariable("nodeId") String productId) {
        nodeServiceImpl.delete(productId);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/category/{category}/name/{name}")
    public ResponseEntity<T> findByCategoryAndName(
            @PathVariable("category") String category, @PathVariable("name") String name) {
        return ResponseEntity.ok(nodeServiceImpl.findByCategoryAndName(category, name));
    }

    @GetMapping("/tree")
    public ResponseEntity<TreeNode<T>> findAllSortByPath() {
        return ResponseEntity.ok(nodeServiceImpl.getNodeTree());
    }

    @Override
    @PutMapping("/{nodeId}")
    public ResponseEntity<Void> updateById(@PathVariable String nodeId, @RequestBody T node) {
        nodeServiceImpl.updateNodeById(nodeId, node);
        return ResponseEntity.accepted().build();
    }
}
