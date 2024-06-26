package com.johnny.bank.service.resource.data.impl;

import com.alibaba.fastjson2.JSONException;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.GeoJsonData;
import com.johnny.bank.model.resource.dataResource.base.GeoData;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IGeoJsonDataRepo;
import com.johnny.bank.service.resource.data.IGeoJsonDataService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: GeoJsonDataServiceImpl
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/25 10:39
 * @version: 1.0
 */
@Service
public class GeoJsonDataServiceImpl implements IGeoJsonDataService {
    private IGeoJsonDataRepo geojsonDataRepo;
    private IDataNodeRepo dataNodeRepo;

    public GeoJsonDataServiceImpl(@Qualifier("DataNodeRepo") IDataNodeRepo DataNodeRepo, @Qualifier("GeoJsonDataRepo") IGeoJsonDataRepo GeoJsonDataRepo){
        this.geojsonDataRepo = GeoJsonDataRepo;
        this.dataNodeRepo = DataNodeRepo;
    }

    @Override
    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName(
                "GeoJsonDataItem", "GeoJsonData");
    }

    @Override
//    @DynamicNodeData
    public Integer getTotalCount(DataNode dataNode) {
        return geojsonDataRepo.getTotalCount();
    }

    @Override
//    @DynamicNodeData
    public List<GeoJsonData> findAll(DataNode dataNode) {
        return geojsonDataRepo.findAll();
    }

    @Override
//    @DynamicNodeData
    public GeoJsonData findById(DataNode dataNode, String id) {
        return geojsonDataRepo.findById(id);
    }

    @Override
//    @DynamicNodeData
    public void deleteById(DataNode dataNode, String id) {
        geojsonDataRepo.deleteById(id);
    }

    @Override
//    @DynamicNodeData
    public List<GeoJsonData> findByIdList(DataNode dataNode, List<String> ids) {
        return geojsonDataRepo.findByIdList(ids);
    }

    @Override
    public GeoJsonData findNewestByName(DataNode dataNode, String dataName) {
        return geojsonDataRepo.findByNameNewest(dataName);
    }

    private GeoJsonData dataProcess(JSONObject jsonObject) {
        GeoJsonData geoJsonData;
        try {
            geoJsonData = GeoJsonData.geojsonBuilder().id(jsonObject.getString("id"))
                          .name(jsonObject.getString("name"))
                          .type(jsonObject.getString("type"))
                          .path(jsonObject.getString("path"))
                          .build();
        } catch (JSONException | NumberFormatException | NullPointerException e ) {
            return (GeoJsonData) GeoData.builder().build();
        }
        geoJsonData.setCreateTime(new Timestamp(System.currentTimeMillis()));
        geoJsonData.setUpdateTime(null);

        return geoJsonData;
    }

    @Override
//    @DynamicNodeData
    public String insertData(DataNode dataNode, JSONObject jsonObject) {
        GeoJsonData geoJsonData = dataProcess(jsonObject);
        geojsonDataRepo.insertData(geoJsonData);
        return geoJsonData.getId();
    }

    @Override
    public String readGeoJsonFile(String filepath) throws IOException {
        byte[] bytes = Files.readAllBytes(Paths.get(filepath));
        return new String(bytes);
    }
}
