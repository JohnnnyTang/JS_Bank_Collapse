package com.johnny.bank.service.resource.dataResource;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.RasterData;
import com.johnny.bank.service.resource.dataResource.base.IGeoDataService;

import java.util.List;

public interface IRasterDataService extends IGeoDataService<RasterData> {

    List<RasterData> findAll(DataNode dataNode);

    RasterData findById(DataNode dataNode, String id);

    void deleteById(DataNode dataNode, String id);

    List<RasterData> findByIdList(DataNode dataNode, List<String> ids);
}
