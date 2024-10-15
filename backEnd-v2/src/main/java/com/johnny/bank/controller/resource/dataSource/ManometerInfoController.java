package com.johnny.bank.controller.resource.dataSource;

import com.johnny.bank.controller.resource.dataSource.base.DetailMonitorInfoController;
import com.johnny.bank.service.resource.dataSource.impl.ManometerInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.controller.resource.data
 * @className: InclinometerInfoController
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/23 16:44
 * @version: 1.0
 */
@RestController
@RequestMapping("api/v1/data/manometerInfo")
@Slf4j
public class ManometerInfoController extends DetailMonitorInfoController<ManometerInfoService> {

    @Autowired
    public ManometerInfoController(ManometerInfoService detailMonitorInfoService) {
        super(detailMonitorInfoService);
    }
}
