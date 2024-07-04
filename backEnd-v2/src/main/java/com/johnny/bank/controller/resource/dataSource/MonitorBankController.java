package com.johnny.bank.controller.resource.dataSource;

import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.MonitorBankInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/7/3
 * @Description:
 */
@RestController
@RequestMapping("api/v2/data/bank")
public class MonitorBankController {
    private final IDataNodeRepoV2 dataNodeRepo;

    public MonitorBankController(
            @Qualifier("DataNodeRepoV2") IDataNodeRepoV2 DataNodeRepo
    ) {
        this.dataNodeRepo = DataNodeRepo;
    }

    @GetMapping
    public ResponseEntity<List<MonitorBankInfo>> findAll() {
        List<DataNodeV2> bankNodes = dataNodeRepo.getNodeByCategory("BankNode");
        List<MonitorBankInfo> monitorBankInfoList = new ArrayList<>();
        for(DataNodeV2 bankNode: bankNodes) {
            monitorBankInfoList.add(bankNode.getBasicInfo().to(MonitorBankInfo.class));
        }
        return ResponseEntity.ok(monitorBankInfoList);
    }
}
