package com.johnny.bank.service.resource.data.impl;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.GnssData;
import org.springframework.stereotype.Service;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
@Service("GnssDataService")
public class GnssDataService extends MonitorDataService<GnssData> {
    public DataNode getDataNodeById(String nodeId) {
        return dataNodeRepo.findById(nodeId).orElse(null);
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
