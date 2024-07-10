package com.johnny.bank.service.resource.dataSource;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.ShpData;
import com.johnny.bank.service.resource.dataSource.base.IGeoDataService;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface IShpDataService extends IGeoDataService<ShpData> {

    List<ShpData> findAll(DataNode dataNode);

    ShpData findById(DataNode dataNode, String id);

    List<ShpData> findByIdList(DataNode dataNode, List<String> ids);

    JSONObject shpToGeoJson(File zipFile, String tempDir) throws IOException;
}