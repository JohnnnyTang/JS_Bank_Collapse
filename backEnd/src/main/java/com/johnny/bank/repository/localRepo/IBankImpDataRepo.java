package com.johnny.bank.repository.localRepo;

import com.johnny.bank.model.resource.dataResource.BankImpData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("BankImpDataRepo")
public interface IBankImpDataRepo extends MongoRepository<BankImpData, String> {

    @Query(value = "{}", fields="{'id' : 1, 'bankName' : 1, 'riverName' : 1, 'warningLevel': 1}")
    List<BankImpData> findBankSimpleData();
}
