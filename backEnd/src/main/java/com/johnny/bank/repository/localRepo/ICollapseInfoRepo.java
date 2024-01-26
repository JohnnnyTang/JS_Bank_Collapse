package com.johnny.bank.repository.localRepo;

import com.johnny.bank.model.resource.dataResource.CollapseHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ICollapseInfoRepo extends MongoRepository<CollapseHistory, String> {
    @Query("{'description': {$ne: null}}")
    public List<CollapseHistory> findInfoWithDescription();
}
