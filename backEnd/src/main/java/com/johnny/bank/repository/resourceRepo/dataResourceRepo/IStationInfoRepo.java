package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.StationInfo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IStaticBaseRepo;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
@Repository("StationRepo")
public interface IStationInfoRepo extends IStaticBaseRepo<StationInfo> {
    StationInfo findByCode(String code);

    List<StationInfo> findByCodeList(List<String> codeList);

    StationInfo findNewestData();
}
