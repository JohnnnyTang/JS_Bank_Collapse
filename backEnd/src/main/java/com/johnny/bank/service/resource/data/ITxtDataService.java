package com.johnny.bank.service.resource.data;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.ShpData;
import com.johnny.bank.model.resource.dataResource.TxtData;
import com.johnny.bank.service.resource.data.base.IGeoDataService;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface ITxtDataService extends IGeoDataService<TxtData> {

    List<TxtData> findAll(DataNode dataNode);

    TxtData findById(DataNode dataNode, String id);

    List<TxtData> findByIdList(DataNode dataNode, List<String> ids);

    void deleteById(DataNode dataNode, String id);

}
