package com.johnny.bank.service.resource.dataSource.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.service.resource.dataSource.IModelServerService;
import com.johnny.bank.utils.InternetUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
        String response = InternetUtil.doGet(url, body);
        return response;
    }

    @Override
    public byte[] getByteDataByCaseIdAndFileName(String caseId, String name) {
        String url = baseUrl + "/v0/fs/result/file";
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        body.put("name",name);
        byte[] response = InternetUtil.doGet_Byte(url, body);
        return response;
    }
}
