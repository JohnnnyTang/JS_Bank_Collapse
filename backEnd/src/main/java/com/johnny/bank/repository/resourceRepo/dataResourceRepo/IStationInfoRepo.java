package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.StationInfo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IStaticInfoBaseRepo;
import org.springframework.stereotype.Repository;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
@Repository("StationRepo")
public interface IStationInfoRepo extends IStaticInfoBaseRepo<StationInfo> {
}
