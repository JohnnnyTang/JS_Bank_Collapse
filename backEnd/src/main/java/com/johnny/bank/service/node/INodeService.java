package com.johnny.bank.service.node;

import com.johnny.bank.model.node.base.BaseNode;
import com.johnny.bank.model.node.base.TreeNode;

import java.util.List;

/**
 * @Author: Johnny T
 * @Date: 2023/12/20
 * @Description:
 */
public interface INodeService<T extends BaseNode> {
    String save(T baseNode);

    T findById(String id);

    List<T> findAll();

    void delete(String id);

    T findByCategoryAndName(String category, String name);

    List<T> findChildByPath(String nodePath);

    List<T> findAllSortByPath();

    TreeNode<T> getNodeTree();

    void updateNodeById(String id, T node);
}
