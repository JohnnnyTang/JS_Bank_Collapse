package com.johnny.bank.controller.resource.data;

import com.johnny.bank.controller.resource.data.base.DetailMonitorInfoController;
import com.johnny.bank.service.resource.dataResource.impl.StressInfoService;
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
@RequestMapping("api/v1/data/stressInfo")
@Slf4j
public class StressInfoController extends DetailMonitorInfoController<StressInfoService> {

    @Autowired
    public StressInfoController(StressInfoService detailMonitorInfoService) {
        super(detailMonitorInfoService);
    }
}
