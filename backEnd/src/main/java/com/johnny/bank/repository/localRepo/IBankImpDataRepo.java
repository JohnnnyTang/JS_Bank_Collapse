package com.johnny.bank.repository.localRepo;

import com.johnny.bank.model.resource.dataResource.BankImpData;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IBankImpDataRepo extends MongoRepository<BankImpData, String> {
}
