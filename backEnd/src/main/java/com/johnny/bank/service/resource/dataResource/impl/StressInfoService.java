package com.johnny.bank.service.resource.dataResource.impl;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IStressInfoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.service.resource.data.impl
 * @className: InclinoInfoService
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/23 17:10
 * @version: 1.0
 */
@Service
public class StressInfoService extends DetailMonitorInfoService<IStressInfoRepo> {
    @Autowired
    public StressInfoService(@Qualifier("DataNodeRepo") IDataNodeRepo DataNodeRepo,
                             @Qualifier("StressInfoRepo") IStressInfoRepo InclinometerRepo) {
        super(InclinometerRepo, DataNodeRepo);
    }

    @Override
    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName(
                "StressInfoGroup", "stressInfoGroupOfTestBank");
    }
}
