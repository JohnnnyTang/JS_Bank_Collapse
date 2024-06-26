package com.johnny.bank.controller.node.base;

import com.johnny.bank.model.node.base.BaseNode;
import com.johnny.bank.model.node.base.TreeNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
public abstract class AbstractNodeController<T extends BaseNode> {
    public abstract ResponseEntity<String> save(@RequestBody T baseNode);

    public abstract ResponseEntity<List<T>> findAll();

    public abstract ResponseEntity<T> findById(@PathVariable("nodeId") String productId);

    public abstract ResponseEntity<Void> deleteById(@PathVariable("nodeId") String productId);

    public abstract ResponseEntity<T> findByCategoryAndName(
            @PathVariable("category") String category, @PathVariable("name") String name);

    public abstract ResponseEntity<TreeNode<T>> findAllSortByPath();

    public abstract ResponseEntity<Void> updateById(String id, T node);
}
