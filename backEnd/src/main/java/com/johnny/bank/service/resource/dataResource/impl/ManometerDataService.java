package com.johnny.bank.service.resource.dataResource.impl;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.ManometerData;
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
@Service("ManometerDataService")
public class ManometerDataService extends MonitorDataService<ManometerData> {
    @Autowired
    public ManometerDataService(IDataNodeRepo dataNodeRepo, @Qualifier("ManometerDataRepo") IMonitorDataRepo<ManometerData> monitorDataRepo) {
        super(dataNodeRepo, monitorDataRepo);
    }

    @Override
    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName("ManometerDataGroup", "manometerDataGroupOfTestBank");
    }

    @Override
    public DataNode getDataNodeByBankAndName(String bank, String name) {
        return dataNodeRepo.getNodeByCategoryAndNameAndBank("ManometerDataItem", name, bank);
    }

}
