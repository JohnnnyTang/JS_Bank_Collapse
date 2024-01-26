package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.InclinometerData;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IMonitorDataRepo;
import org.springframework.stereotype.Repository;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
@Repository("InclinometerDataRepo")
public interface IInclinometerDataRepo extends IMonitorDataRepo<InclinometerData> {
}
