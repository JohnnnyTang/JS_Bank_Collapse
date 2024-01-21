package com.johnny.bank.repository.nodeRepo.base;

import com.johnny.bank.model.node.base.BaseNode;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Johnny T
 * @Date: 2023/12/20
 * @Description:
 */

@Repository("BaseNodeRepo")
public interface IBaseNodeRepo<T extends BaseNode> extends MongoRepository<T, String> {
    @Query("{'category' : ?0 , 'name' : ?1}")
    T getNodeByCategoryAndName(String category, String name);

    @Query("{'path': {$regex:?0}}")
    List<T> getNodeChildByPath(String nodePath);

    @Query("{'linkCode': ?0}")
    List<T> getNodeByLinkCode(String linkCode);

    @Query(value = "{'linkCode': ?0}", delete = true)
    List<T> deleteByLinkCode(String linkCode);

    @Query(value = "{'linkCode': {$in: ?0}}", delete = true)
    List<T> deleteByLinkCodeList(List<String> linkCodeList);

    @Query(sort = "{'path': 1}")
    List<T> findAllSortByPath();

    @Query("{'id': ?0}")
    @Update("{'$set': ?1}")
    void updateById(String id, T newNode);
}
