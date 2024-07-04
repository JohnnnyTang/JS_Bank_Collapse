package com.johnny.bank.service.resource.dataResource.base;

import com.johnny.bank.model.node.DataNode;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
public interface IStaticBaseService<T> {
    List<T> getAllData(DataNode dataNode);

    int getRowNumber(DataNode dataNode);

    T getDataById(DataNode dataNode, String id);

    List<T> getDataByIdList(DataNode dataNode, List<String> ids);
}
