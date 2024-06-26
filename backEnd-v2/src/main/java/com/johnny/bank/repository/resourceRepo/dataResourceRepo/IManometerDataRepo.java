package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.ManometerData;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IMonitorDataRepo;
import org.springframework.stereotype.Repository;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
@Repository("ManometerDataRepo")
public interface IManometerDataRepo extends IMonitorDataRepo<ManometerData> {
}
