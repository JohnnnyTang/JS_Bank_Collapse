package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSONException;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.aop.DynamicNodeData;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.TxtData;
import com.johnny.bank.model.resource.dataResource.base.GeoData;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.ITxtDataRepo;
import com.johnny.bank.service.resource.dataSource.ITxtDataService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: TxtDataServiceImpl
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/28 23:00
 * @version: 1.0
 */

@Service
public class TxtDataServiceImpl implements ITxtDataService {
    private ITxtDataRepo txtDataRepo;
    private IDataNodeRepo dataNodeRepo;

    public TxtDataServiceImpl(@Qualifier("DataNodeRepo") IDataNodeRepo DataNodeRepo, @Qualifier("TxtDataRepo") ITxtDataRepo TxtDataRepo){
        this.txtDataRepo = TxtDataRepo;
        this.dataNodeRepo = DataNodeRepo;
    }

    @Override
    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName(
                "ShpDataItem", "ShpData");
    }

    @Override
    @DynamicNodeData
    public Integer getTotalCount(DataNode dataNode) {
        return txtDataRepo.getTotalCount();
    }

    @Override
    @DynamicNodeData
    public List<TxtData> findAll(DataNode dataNode) {
        return txtDataRepo.findAll();
    }

    @Override
    @DynamicNodeData
    public TxtData findById(DataNode dataNode, String id) {
        return txtDataRepo.findById(id);
    }

    @Override
    @DynamicNodeData
    public void deleteById(DataNode dataNode, String id){
        txtDataRepo.deleteById(id);
    }

    @Override
    @DynamicNodeData
    public List<TxtData> findByIdList(DataNode dataNode, List<String> ids) {
        return txtDataRepo.findByIdList(ids);
    }

    private TxtData dataProcess(JSONObject jsonObject) {
        TxtData txtData;
        try {
            txtData = TxtData.txtBuilder()
                    .name(jsonObject.getString("name"))
                    .type(jsonObject.getString("type"))
                    .path(jsonObject.getString("path"))
                    .build();
        } catch (JSONException | NumberFormatException | NullPointerException e ) {
            return (TxtData) GeoData.builder().build();
        }
        txtData.setCreateTime(new Timestamp(System.currentTimeMillis()));
        txtData.setUpdateTime(null);

        return txtData;
    }

    @Override
    @DynamicNodeData
    public String insertData(DataNode dataNode, JSONObject jsonObject) {
        TxtData txtData = dataProcess(jsonObject);
        txtDataRepo.insertData(txtData);
        return txtData.getId();
    }
}
