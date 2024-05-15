package com.johnny.bank.service.resource.data;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.GeoJsonData;
import com.johnny.bank.service.resource.data.base.IGeoDataService;

import java.io.IOException;
import java.util.List;

public interface IGeoJsonDataService extends IGeoDataService<GeoJsonData> {
    List<GeoJsonData> findAll(DataNode dataNode);

    GeoJsonData findById(DataNode dataNode, String id);

    List<GeoJsonData> findByIdList(DataNode dataNode, List<String> ids);

    GeoJsonData findNewestByName(DataNode dataNode, String dataName);

    void deleteById(DataNode dataNode, String id);

    String readGeoJsonFile(String filepath) throws IOException;
}
