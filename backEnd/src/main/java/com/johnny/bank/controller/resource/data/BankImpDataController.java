package com.johnny.bank.controller.resource.data;

import com.johnny.bank.model.resource.dataResource.BankImpData;
import com.johnny.bank.service.resource.data.impl.BankImpDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.controller.resource.data
 * @className: BankImpDataController
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/22 14:25
 * @version: 1.0
 */
@RestController
@RequestMapping("api/v1/data/bankLine")
@Slf4j
public class BankImpDataController {

    private final BankImpDataService bankImpDataService;

    @Autowired
    public BankImpDataController(BankImpDataService bankImpDataService) {
        this.bankImpDataService = bankImpDataService;
    }

    @GetMapping
    public ResponseEntity<List<BankImpData>> GetAllData() {
        return ResponseEntity.ok(bankImpDataService.getAllData());
    }

    @GetMapping("/simple")
    public ResponseEntity<List<BankImpData>> GetSimpleData() {
        return ResponseEntity.ok(bankImpDataService.getSimpleData());
    }
}
