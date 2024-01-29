package com.johnny.bank.service.node.impl;

import com.johnny.bank.model.node.base.BaseNode;
import com.johnny.bank.model.node.base.TreeNode;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import com.johnny.bank.service.node.INodeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;

/**
 * @Author: Johnny T
 * @Date: 2023/12/20
 * @Description:
 */

@Service
@Slf4j
public abstract class NodeService<T extends BaseNode> implements INodeService<T> {
    protected IBaseNodeRepo<T> IBaseNodeRepo;

    @Autowired
//    @Qualifier("BaseNodeRepo")
    public void setBaseNodeRepo(IBaseNodeRepo<T> IBaseNodeRepo) {
        this.IBaseNodeRepo = IBaseNodeRepo;
    }

    @Override
    public String save(T baseNode) {
        return IBaseNodeRepo.save(baseNode).getId();
    }

    @Override
    public T findById(String id) {
        return IBaseNodeRepo.findById(id)
                .orElse(null);
    }

    @Override
    public List<T> findAll() {
        return IBaseNodeRepo.findAll();
    }

    @Override
    public void delete(String id) {
        IBaseNodeRepo.deleteById(id);
    }

    @Override
    public T findByCategoryAndName(String category, String name) {
        return IBaseNodeRepo.getNodeByCategoryAndName(category, name);
    }

    @Override
    public List<T> findChildByPath(String nodePath) {
        return IBaseNodeRepo.getNodeChildByPath(nodePath);
    }

    @Override
    public List<T> findAllSortByPath() {
        Sort.Order pathOrder = new Sort.Order(Sort.Direction.ASC, "path");
        return IBaseNodeRepo.findAll(Sort.by(pathOrder));
    }

    @Override
    public TreeNode<T> getNodeTree() {
        Sort.Order pathOrder = new Sort.Order(Sort.Direction.ASC, "path");
        List<T> allNodeList =  IBaseNodeRepo.findAll(Sort.by(pathOrder));
        List<TreeNode<T>> treeNodeList = new ArrayList<>();
        allNodeList.forEach(aNode -> {
            treeNodeList.add(new TreeNode<T>(aNode));
        });
        Map<String, List<TreeNode<T>>> treeNodePerParent = treeNodeList
                .stream().collect((groupingBy(TreeNode<T>::getParentName)));
        treeNodeList.forEach(treeNode -> {
            treeNode.setChildren(treeNodePerParent.get(treeNode.getNode().getName()));
        });
        //        Map<String, List<T>> nodePerPath = allNodeList.stream().collect(groupingBy(T::getName));
//        log.info(treeTop.toString());
        return treeNodeList.stream().filter(treeNode->
            treeNode.getParentName().isEmpty()
        ).toList().get(0);
    }

    @Override
    public void updateNodeById(String id, T node) {
        IBaseNodeRepo.updateById(id, node);
    }
}
