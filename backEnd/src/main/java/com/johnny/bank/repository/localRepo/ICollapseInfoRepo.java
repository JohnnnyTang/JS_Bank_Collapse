package com.johnny.bank.repository.localRepo;

import com.johnny.bank.model.resource.dataResource.CollapseHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ICollapseInfoRepo extends MongoRepository<CollapseHistory, String> {
    @Query(value = "{'description': {$ne: null}}", sort = "{'description': -1}")
    List<CollapseHistory> findInfoWithDescription();

    @Query(value = "{}", sort = "{'description': -1}")
    List<CollapseHistory> findInfoSortByDescription();
}
