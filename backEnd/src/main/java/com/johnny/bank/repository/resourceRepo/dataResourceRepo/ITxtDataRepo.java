package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.RasterData;
import com.johnny.bank.model.resource.dataResource.ShpData;
import com.johnny.bank.model.resource.dataResource.TxtData;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IGeoDataRepo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("TxtDataRepo")
public interface ITxtDataRepo extends IGeoDataRepo {
    List<TxtData> findAll();

    TxtData findById(String id);

    List<TxtData> findByIdList(List<String> ids);

    void insertData(TxtData txtData);
}
