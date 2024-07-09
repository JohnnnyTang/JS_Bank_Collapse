package com.johnny.bank.controller.resource.dataSource;

import com.johnny.bank.controller.resource.dataSource.base.BaseMonitorDataController;
import com.johnny.bank.model.resource.dataResource.ManometerData;
import com.johnny.bank.service.resource.dataSource.impl.MonitorDataService;
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
@RequestMapping("api/v1/data/manometerData")
public class ManometerDataController extends BaseMonitorDataController<ManometerData> {
    @Autowired
    public ManometerDataController(@Qualifier("ManometerDataService") MonitorDataService<ManometerData> MonitorDataService) {
        super(MonitorDataService);
    }
}
