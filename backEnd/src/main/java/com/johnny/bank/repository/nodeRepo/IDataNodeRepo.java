package com.johnny.bank.repository.nodeRepo;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@Repository("DataNodeRepo")
public interface IDataNodeRepo extends IBaseNodeRepo<DataNode> {
    @Query("{'category' : ?0 , 'name' : ?1, 'bank': ?2}")
    DataNode getNodeByCategoryAndNameAndBank(String category, String name, String bank);

    @Query("{'usage': {'$exists': true}}")
    @Update("{'$set':  {'usage': ?0}}")
    void alterAllDataNodeUsageJson(JSONObject newUsageJson);

    @Query("{'apiPrefix': {'$ne': ''}}")
    @Update("{'$set':  {'apiPrefix': ?0}}")
    void alterAllDataApiPrefix(String newPrefix);
}
