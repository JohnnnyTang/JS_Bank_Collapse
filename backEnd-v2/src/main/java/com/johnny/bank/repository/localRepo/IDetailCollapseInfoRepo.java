package com.johnny.bank.repository.localRepo;

import com.johnny.bank.model.resource.dataResource.CollapseHistory;
import com.johnny.bank.model.resource.dataResource.DetailHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface IDetailCollapseInfoRepo extends MongoRepository<DetailHistory, String> {
    DetailHistory findDetailHistoriesByUuid(String uuid);
}
