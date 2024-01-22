package com.johnny.bank.repository.nodeRepo;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import org.springframework.data.mongodb.repository.Query;
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
}
