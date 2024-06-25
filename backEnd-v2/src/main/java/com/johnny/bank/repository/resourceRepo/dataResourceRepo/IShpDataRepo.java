package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.ShpData;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IGeoDataRepo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("ShpDataRepo")
public interface IShpDataRepo extends IGeoDataRepo {

    List<ShpData> findAll();

    ShpData findById(String id);

    List<ShpData> findByIdList(List<String> ids);

    void insertData(ShpData shpData);
}
