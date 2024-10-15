package com.johnny.bank.repository.nodeRepo;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    @Query("{'caseId': ?0}")
    List<TaskNode> getTaskNodeItemByCaseId(String caseId);

    @Query("{'_id': ?0}")
    @Update("{'$set': {'status': ?1}}")
    void updateTaskNodeStatusById(String nodeId, String statusCode);

    @Query("{'_id': ?0}")
    @Update("{'$set': {'status': ?1, 'result': ?2}}")
    void updateTaskNodeStatusResultById(String nodeId, String statusCode, JSONObject resultString);
//    @Query("{'_id': ?0}")
//    TaskNode queryById(String nodeId);

    @Query("{'_id': ?0}")
    @Update("{'$set': {'result': ?1}}")
    void updateTaskNodeResultById(String nodeId, JSONObject resultString);

    @Query("{'_id': ?0}")
    @Update("{'$set': {'updateTime': ?1}}")
    void updateNodeUpdateTimeById(String nodeId, LocalDateTime updateTime);

}
