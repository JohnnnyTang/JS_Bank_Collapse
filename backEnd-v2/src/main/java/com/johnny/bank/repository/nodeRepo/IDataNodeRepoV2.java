package com.johnny.bank.repository.nodeRepo;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@Repository("DataNodeRepoV2")
public interface IDataNodeRepoV2 extends IBaseNodeRepo<DataNodeV2> {
    @Query("{'category' : ?0, 'bank': ?1}")
    DataNodeV2 getNodeByCategoryAndBank(String category, String bank);

    @Query("{'bank' : ?0, 'basicInfo.code': ?1}")
    DataNodeV2 getNodeByBankAndInfoId(String bank, String dataId);

    @Query("{'category' : ?0, 'bank': ?1, 'basicInfo.code': ?2}")
    DataNodeV2 getNodeByCategoryAndBankAndInfoId(String category, String bank, String dataId);

    @Query("{'usage': {'$exists': true}}")
    @Update("{'$set':  {'usage': ?0}}")
    void alterAllDataNodeUsageJson(JSONObject newUsageJson);

    @Query("{'category': ?0}")
    @Update("{'$set':  {'usage.tableName': ?1}}")
    void alterDataNodeTableNameOfSameCategory(String category, String newTableName);

    @Query("{'usage': {'$exists': true}, 'bank': ?0, 'category': 'DB'}")
    @Update("{'$set':  {'usage': ?1}}")
    void alterAllDataNodeUsageJsonOfABank(String bankName, JSONObject newUsageJson);

    @Query("{'apiPrefix': {'$ne': ''}}")
    @Update("{'$set':  {'apiPrefix': ?0}}")
    void alterAllDataApiPrefix(String newPrefix);

    @Query("{'apiPrefix': {'$ne': ''}, 'bank': ?0}")
    @Update("{'$set':  {'apiPrefix': ?1}}")
    void alterAllDataApiPrefixOfABank(String bankName, String newPrefix);
}
