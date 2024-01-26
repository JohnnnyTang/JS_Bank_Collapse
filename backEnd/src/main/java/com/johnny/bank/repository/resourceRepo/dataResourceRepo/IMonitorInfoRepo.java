package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IStaticInfoBaseRepo;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/29
 * @Description:
 */
@Repository("DeviceInfoRepo")
public interface IMonitorInfoRepo extends IStaticInfoBaseRepo<MonitorInfo> {
    List<MonitorInfo> findByStationCode(String stationCode);

    List<MonitorInfo> findByStationCodeList(List<String> stationCodeList);

    MonitorInfo findNewestDeviceInStation(String stationCode);

    List<MonitorInfo> findDeviceByType(Character deviceType);
}
