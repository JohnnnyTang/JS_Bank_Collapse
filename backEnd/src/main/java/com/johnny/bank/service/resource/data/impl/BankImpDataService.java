package com.johnny.bank.service.resource.data.impl;

import com.johnny.bank.model.resource.dataResource.BankImpData;
import com.johnny.bank.repository.localRepo.IBankImpDataRepo;
import com.johnny.bank.service.resource.data.IBankImpDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.service.resource.data.impl
 * @className: BankImpDataService
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/22 14:18
 * @version: 1.0
 */
@Service
public class BankImpDataService implements IBankImpDataService {

    private final IBankImpDataRepo IBankImpDataRepo;

    @Autowired
    public BankImpDataService(IBankImpDataRepo IBankImpDataRepo) {
        this.IBankImpDataRepo = IBankImpDataRepo;
    }

    @Override
    public List<BankImpData> getAllData() {
        return IBankImpDataRepo.findAll();
    }

    public List<BankImpData> getSimpleData() {
        return IBankImpDataRepo.findBankSimpleData();
    }
}
