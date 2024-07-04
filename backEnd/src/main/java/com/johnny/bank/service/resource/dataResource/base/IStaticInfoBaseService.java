package com.johnny.bank.service.resource.dataResource.base;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.base.StaticInfoData;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
public interface IStaticInfoBaseService<T extends StaticInfoData> extends IStaticBaseService<T> {
    T getDataByCode(DataNode dataNode, String code);

    List<T> getDataByCodeList(DataNode dataNode, List<String> codeList);

    T getNewestData(DataNode dataNode);

    DataNode getDataNode();
}
