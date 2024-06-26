package com.johnny.bank.controller.resource.data;

import com.johnny.bank.controller.resource.data.base.BaseMonitorDataController;
import com.johnny.bank.model.resource.dataResource.InclinometerData;
import com.johnny.bank.service.resource.data.impl.MonitorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
@RestController
@RequestMapping("api/v1/data/inclinometerData")
public class InclinometerDataController extends BaseMonitorDataController<InclinometerData> {
    @Autowired
    public InclinometerDataController(@Qualifier("InclinometerDataService") MonitorDataService<InclinometerData> MonitorDataService) {
        super(MonitorDataService);
    }
}
