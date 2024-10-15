package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.RasterData;
import com.johnny.bank.model.resource.dataResource.ShpData;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IGeoDataRepo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("RasterDataRepo")
public interface IRasterDataRepo extends IGeoDataRepo {
    List<RasterData> findAll();

    RasterData findById(String id);

    List<RasterData> findByIdList(List<String> ids);

   void insertData(RasterData rasterData);
}
