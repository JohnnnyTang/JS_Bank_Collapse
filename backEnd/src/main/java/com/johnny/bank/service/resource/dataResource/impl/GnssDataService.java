package com.johnny.bank.service.resource.dataResource.impl;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.GnssData;
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
@Service("GnssDataService")
public class GnssDataService extends MonitorDataService<GnssData> {

    @Autowired
    public GnssDataService(IDataNodeRepo dataNodeRepo, @Qualifier("GnssDataRepo") IMonitorDataRepo<GnssData> monitorDataRepo) {
        super(dataNodeRepo, monitorDataRepo);
    }

    @Override
    public DataNode getDataNode() {
        return dataNodeRepo.getNodeByCategoryAndName("GnssDataGroup", "gnssDataGroupOfTestBank");
    }

    @Override
    public DataNode getDataNodeByBankAndName(String bank, String name) {
        return dataNodeRepo.getNodeByCategoryAndNameAndBank("GnssDataItem", name, bank);
    }

}
