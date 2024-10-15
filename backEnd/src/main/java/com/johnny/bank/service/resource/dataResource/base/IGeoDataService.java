package com.johnny.bank.service.resource.dataResource.base;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;

import java.util.List;

public interface IGeoDataService<T> {
    DataNode getDataNode();

    Integer getTotalCount(DataNode dataNode);

    List<T> findAll(DataNode dataNode);

    T findById(DataNode dataNode, String id);

    void deleteById(DataNode dataNode, String id);

    List<T> findByIdList(DataNode dataNode, List<String> ids);

    String insertData(DataNode dataNode, JSONObject jsonObject);

}
