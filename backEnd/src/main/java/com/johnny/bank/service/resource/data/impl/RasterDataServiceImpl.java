package com.johnny.bank.service.resource.data.impl;

import com.alibaba.fastjson2.JSONException;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.aop.DynamicNodeData;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.RasterData;
import com.johnny.bank.model.resource.dataResource.base.GeoData;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IRasterDataRepo;
import com.johnny.bank.service.resource.data.IRasterDataService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: RasterDataServiceImpl
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/25 10:24
 * @version: 1.0
 */

@Service
public class RasterDataServiceImpl implements IRasterDataService {
    private IRasterDataRepo rasterDataRepo;
    private IDataNodeRepo dataNodeRepo;

    public RasterDataServiceImpl(@Qualifier("DataNodeRepo") IDataNodeRepo DataNodeRepo, @Qualifier("RasterDataRepo") IRasterDataRepo RasterDataRepo){
        this.rasterDataRepo = RasterDataRepo;
        this.dataNodeRepo = DataNodeRepo;
    }

    @Override
    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName(
                "RasterDataItem", "RasterData");
    }

    @Override
    @DynamicNodeData
    public Integer getTotalCount(DataNode dataNode) {
        return rasterDataRepo.getTotalCount();
    }

    @Override
    @DynamicNodeData
    public List<RasterData> findAll(DataNode dataNode) {
        return rasterDataRepo.findAll();
    }

    @Override
    @DynamicNodeData
    public RasterData findById(DataNode dataNode, String id) {
        return rasterDataRepo.findById(id);
    }

    @Override
    @DynamicNodeData
    public void deleteById(DataNode dataNode, String id) {
        rasterDataRepo.deleteById(id);
    }

    @Override
    @DynamicNodeData
    public List<RasterData> findByIdList(DataNode dataNode, List<String> ids) {
        return rasterDataRepo.findByIdList(ids);
    }

    private RasterData dataProcess(JSONObject jsonObject) {
        RasterData rasterData;
        try {
            rasterData = RasterData.rasterBuilder()
                        .name(jsonObject.getString("name"))
                        .type(jsonObject.getString("type"))
                        .path(jsonObject.getString("path"))
                        .build();
        } catch (JSONException | NumberFormatException | NullPointerException e ) {
            return (RasterData) GeoData.builder().build();
        }
        rasterData.setCreateTime(new Timestamp(System.currentTimeMillis()));
        rasterData.setUpdateTime(null);

        return rasterData;
    }

    @Override
    @DynamicNodeData
    public String insertData(DataNode dataNode, JSONObject jsonObject) {
        RasterData rasterData = dataProcess(jsonObject);
        rasterDataRepo.insertData(rasterData);
        return rasterData.getId();
    }
}
