package com.johnny.bank.service.node.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import org.springframework.stereotype.Service;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/21
 * @Description:
 */
@Service("DataNodeService")
public class DataNodeService extends NodeService<DataNode> {
    public boolean updateDataNodeUsage(String userName, String password) {
        JSONObject newUsage = new JSONObject();
        newUsage.put("userName", userName);
        newUsage.put("password", password);
        ((IDataNodeRepo)IBaseNodeRepo).alterAllDataNodeUsageJson(newUsage);
        return true;
    }

    public boolean updateDataNodeApi(String ipAddr, String port, String dbName) {
        ((IDataNodeRepo)IBaseNodeRepo).alterAllDataApiPrefix("jdbc:postgresql://" + ipAddr + ":" + port + "/" + dbName + "?stringtype=unspecified");
        return true;
    }
}
