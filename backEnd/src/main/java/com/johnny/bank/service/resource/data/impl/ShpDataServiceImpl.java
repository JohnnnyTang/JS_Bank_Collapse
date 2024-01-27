package com.johnny.bank.service.resource.data.impl;

import com.alibaba.fastjson2.JSONException;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.aop.DynamicNodeData;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.ShpData;
import com.johnny.bank.model.resource.dataResource.base.GeoData;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IShpDataRepo;
import com.johnny.bank.service.resource.data.IShpDataService;
import com.johnny.bank.utils.ShpFileUtil;
import com.johnny.bank.utils.ZipUtil;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.geojson.feature.FeatureJSON;
import org.opengis.feature.simple.SimpleFeature;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: ShpDataServiceImpl
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/24 16:40
 * @version: 1.0
 */
@Service
public class ShpDataServiceImpl implements IShpDataService {

    private IShpDataRepo shpDataRepo;
    private IDataNodeRepo dataNodeRepo;

    public ShpDataServiceImpl(@Qualifier("DataNodeRepo") IDataNodeRepo DataNodeRepo, @Qualifier("ShpDataRepo") IShpDataRepo ShpDataRepo){
        this.shpDataRepo = ShpDataRepo;
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
        return shpDataRepo.getTotalCount();
    }

    @Override
    @DynamicNodeData
    public List<ShpData> findAll(DataNode dataNode) {
        return shpDataRepo.findAll();
    }

    @Override
    @DynamicNodeData
    public ShpData findById(DataNode dataNode, String id) {
        return shpDataRepo.findById(id);
    }

    @Override
    @DynamicNodeData
    public void deleteById(DataNode dataNode, String id){
        shpDataRepo.deleteById(id);
    }

    @Override
    @DynamicNodeData
    public List<ShpData> findByIdList(DataNode dataNode, List<String> ids) {
        return shpDataRepo.findByIdList(ids);
    }

    private ShpData dataProcess(JSONObject jsonObject) {
        ShpData shpData;
        try {
            shpData = ShpData.shpBuilder()
                    .name(jsonObject.getString("name"))
                        .type(jsonObject.getString("type"))
                        .path(jsonObject.getString("path"))
                        .build();
        } catch (JSONException | NumberFormatException | NullPointerException e ) {
            return (ShpData) ShpData.builder().build();
        }
        String createTime = (String) jsonObject.getOrDefault("createtime",null);
        String updateTime = (String) jsonObject.getOrDefault("updatetime",null);
        shpData.setCreateTime(createTime);
        shpData.setUpdateTime(updateTime);

        return shpData;
    }

    @Override
    @DynamicNodeData
    public String insertData(DataNode dataNode, JSONObject jsonObject) {
        ShpData shpData = dataProcess(jsonObject);
        shpDataRepo.insertData(shpData);
        return shpData.getId();
    }

    @Override
    public JSONObject shpToGeoJson(File zipFile, String tempDir) throws IOException {
        // shp 文件转为geojson格式文件并传出
        FeatureJSON fjson = new FeatureJSON();
        JSONObject geoJsonObject=new JSONObject();
        geoJsonObject.put("type","FeatureCollection");
        try {
            // 获取FeatureCollection
            FeatureCollection collection = ShpFileUtil.getFeatureCollectionByShpFile(zipFile, tempDir);
            FeatureIterator iterator = collection.features();
            List<JSONObject> array  = new ArrayList<JSONObject>();
            //遍历feature转为json对象
            while (iterator.hasNext()) {
                SimpleFeature feature = (SimpleFeature) iterator.next();
                StringWriter writer = new StringWriter();
                fjson.writeFeature(feature, writer);
                String temp = writer.toString();
                byte[] b = temp.getBytes("iso8859-1");
                temp = new String(b, "gbk");
                JSONObject json = JSONObject.parseObject(temp);
                array.add(json);
            }
            iterator.close();
            //添加到geojsonObject
            geoJsonObject.put("features",array);
            iterator.close();

            ZipUtil.deleteFiles(tempDir);

        }catch (Exception e){
            throw e;
        }
        return geoJsonObject;
    }
}
