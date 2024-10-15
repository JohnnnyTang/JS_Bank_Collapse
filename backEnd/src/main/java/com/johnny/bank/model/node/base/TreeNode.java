package com.johnny.bank.model.node.base;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/9
 * @Description:
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class TreeNode<T extends BaseNode> {
    T node;
    List<TreeNode<T>> children;

    public TreeNode(T aNode) {
        this.node = aNode;
        this.children = new ArrayList<>();
    }

//    public String getName() {
//        return node.getName();
//    }

//    public String getNodePath() {
//        return node.getPath();
//    }

    public String getParentName() {
        String[] path = node.getPath().split(",");
        return path[path.length-1];
    }
}
