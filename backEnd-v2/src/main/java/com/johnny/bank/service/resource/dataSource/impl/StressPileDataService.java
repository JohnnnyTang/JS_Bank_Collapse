package com.johnny.bank.service.resource.dataSource.impl;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.StressPileData;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IMonitorDataRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
@Service("StressPileDataService")
public class StressPileDataService extends MonitorDataService<StressPileData> {
    @Autowired
    public StressPileDataService(IDataNodeRepo dataNodeRepo, @Qualifier("StressPileDataRepo") IMonitorDataRepo<StressPileData> monitorDataRepo) {
        super(dataNodeRepo, monitorDataRepo);
    }

    @Override
    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName("StressDataGroup", "stressDataGroupOfTestBank");
    }

    @Override
    public DataNode getDataNodeByBankAndName(String bank, String name) {
        return dataNodeRepo.getNodeByCategoryAndNameAndBank("StressDataItem", name, bank);
    }

}
