package com.johnny.bank.repository.nodeRepo;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.TaskNode;
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
@Repository("TaskNodeRepo")
public interface ITaskNodeRepo extends IBaseNodeRepo<TaskNode> {

    @Query("{'ifAuto' : {$eq: true}, 'category': {$eq: 'ModelTaskItem'}}")
    List<TaskNode> getAutoTaskNodeItem();

    @Query("{'ifAuto' : {$eq: false}, 'category': {$eq: 'ModelTaskItem'}}")
    List<TaskNode> getNoAutoTaskNodeItem();

    @Query("{'_id': ?0}")
    @Update("{'$set': {'status': ?1}}")
    void updateTaskNodeStatusById(String nodeId, String statusCode);

    @Query("{'_id': ?0}")
    @Update("{'$set': {'status': ?1, 'result': ?2}}")
    void updateTaskNodeStatusResultById(String nodeId, String statusCode, JSONObject resultString);
//    @Query("{'_id': ?0}")
//    TaskNode queryById(String nodeId);
}
