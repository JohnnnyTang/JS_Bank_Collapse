package com.johnny.bank.controller.resource.data;

import com.johnny.bank.controller.resource.data.base.BaseMonitorDataController;
import com.johnny.bank.model.resource.dataResource.GnssData;
import com.johnny.bank.service.resource.data.impl.MonitorDataService;
import com.johnny.bank.service.resource.data.impl.MonitorInfoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
@RestController
@RequestMapping("api/v1/data/gnssData")
public class GnssDataController extends BaseMonitorDataController<GnssData> {
    public GnssDataController(MonitorDataService<GnssData> MonitorDataService, MonitorInfoService monitorInfoService) {
        super(MonitorDataService, monitorInfoService);
    }
}
