package com.johnny.bank.service.resource.dataSource;

import com.alibaba.fastjson2.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/20 12:49
 * @Description: 模型服务容器业务层
 */
public interface IModelServerService {

    String getResultByCaseId(String caseId);

    String getJsonDataByCaseIdAndFileName(String caseId, String name);

    String getResourceJsonDataByCaseIdAndFileName(String name);

    byte[] getByteDataByCaseIdAndFileName(String caseId, String name);

    byte[] getResourceByteDataByCaseIdAndFileName(String name);

    String uploadCalculateResourceData(MultipartFile file, JSONObject info) throws IOException, InterruptedException;

}
