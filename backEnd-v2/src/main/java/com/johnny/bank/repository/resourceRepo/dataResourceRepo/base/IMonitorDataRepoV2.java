package com.johnny.bank.repository.resourceRepo.dataResourceRepo.base;

import com.johnny.bank.model.resource.dataResource.GnssData;
import com.johnny.bank.model.resource.dataResource.InclinometerData;
import com.johnny.bank.model.resource.dataResource.ManometerData;
import com.johnny.bank.model.resource.dataResource.StressPileData;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import com.johnny.bank.model.resource.dataResource.base.MonitorDataQueryParam;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/29
 * @Description:
 */

@Repository("MonitorDataRepoV2")
public interface IMonitorDataRepoV2<T extends MonitorData> {
    List<GnssData> getGnssData(MonitorDataQueryParam queryParams);
    List<StressPileData> getStressData(MonitorDataQueryParam queryParams);
    List<ManometerData> getManometerData(MonitorDataQueryParam queryParams);
    List<InclinometerData> getInclinometerData(MonitorDataQueryParam queryParams);

    Integer getCount(MonitorDataQueryParam queryParams);

    // 检查是否还在连续更新
    boolean ifContinueUpdateOfDevice(String tableName, Timestamp timeLimit, String deviceId);

}
