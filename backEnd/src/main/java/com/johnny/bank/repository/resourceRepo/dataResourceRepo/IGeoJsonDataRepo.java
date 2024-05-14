package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.GeoJsonData;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IGeoDataRepo;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository("GeoJsonDataRepo")
public interface IGeoJsonDataRepo extends IGeoDataRepo {
    List<GeoJsonData> findAll();

    GeoJsonData findById(String id);

    List<GeoJsonData> findByName(String name);

    GeoJsonData findByNameNewest(String name);

    List<GeoJsonData> findByIdList(List<String> ids);

    void insertData(GeoJsonData geoJsonData);
}
