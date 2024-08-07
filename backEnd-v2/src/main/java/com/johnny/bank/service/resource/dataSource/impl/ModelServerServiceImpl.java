package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import com.johnny.bank.service.node.impl.DataNodeService;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.node.impl.NodeService;
import com.johnny.bank.service.resource.dataSource.IModelServerService;
import com.johnny.bank.utils.BeanUtil;
import com.johnny.bank.utils.InternetUtil;
import org.bouncycastle.crypto.agreement.srp.SRP6Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/20 12:52
 * @Description:
 */

@Service("modelServerService")
public class ModelServerServiceImpl implements IModelServerService {

    @Value("${modelServer.url}")
    String baseUrl;

    @Override
    public String getJsonDataByCaseIdAndFileName(String caseId, String name) {
        String url = baseUrl + "/v0/fs/result/file";
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        body.put("name",name);
        return InternetUtil.doGet(url, body);
    }

    @Override
    public String getResourceJsonDataByCaseIdAndFileName(String name) {
        String url = baseUrl + "/v0/fs/resource/file";
        JSONObject body = new JSONObject();
//        body.put("id",caseId);
//        body.put("name",name);
        body.put("directory", name);
        return InternetUtil.doPost(url, body);
    }


    @Override
    public byte[] getByteDataByCaseIdAndFileName(String caseId, String name) {
        String url = baseUrl + "/v0/fs/result/file";
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        body.put("name",name);
        return InternetUtil.doGet_Byte(url, body);
    }

    @Override
    public byte[] getResourceByteDataByCaseIdAndFileName(String name) {
        String url = baseUrl + "/v0/fs/resource/file";
        JSONObject body = new JSONObject();
//        body.put("id",caseId);
//        body.put("name",name);
        body.put("directory", name);
        return InternetUtil.doPost_Byte(url, body);
    }

    @Override
    public String uploadResourceDEMData(MultipartFile file, JSONObject info) {

        // TODO: tif文件自动切片并保存至数据库或文件系统

        String url = baseUrl + "/v0/fs/resource/hydrodynamic";
        JSONObject dataNodeBasicInfo = new JSONObject();
        dataNodeBasicInfo.put("type","calculate");
        dataNodeBasicInfo.put("year",info.getString("year"));
        dataNodeBasicInfo.put("set",info.getString("set"));
        dataNodeBasicInfo.put("temp",info.getString("temp"));
        DataNodeV2 dataNode = DataNodeV2.dataNodeBuilder()
                .bank(info.getString("segment")).basicInfo(dataNodeBasicInfo)
                .name(info.getString("name")).dataOrigin("ModelServer")
                .category("HydrodynamicDataItem").path(",DataNodeHead,MzsBankNode,StaticDataGroupOfMzs,ModelServerDataGroupOfMzs,HydrodynamicDataGroup,")
                .build();
        DataNodeServiceV2 dataNodeServiceV2 = BeanUtil.getBean(DataNodeServiceV2.class);
        dataNodeServiceV2.save(dataNode);
        return InternetUtil.doPost_File(url, file, info);
    }
}
