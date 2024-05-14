package com.johnny.bank.repository.nodeRepo;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@Repository("ParamNodeRepo")
public interface IParamNodeRepo extends IBaseNodeRepo<ParamNode> {

    @Query("{'_id': ?0}")
    @Update("{'$set': {'params': ?1}}")
    void updateParamNodeParamById(String nodeId, JSONObject newParams);


    ParamNode findParamNodeById(String id);
    List<ParamNode> findParamNodesByModelId(String modelId);
    List<ParamNode> findParamNodesByModelIdAndCategory(String modelId, String category);
}
