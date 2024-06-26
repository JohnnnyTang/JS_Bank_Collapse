package com.johnny.bank.repository.resourceRepo.dataResourceRepo.base;

import com.johnny.bank.model.resource.dataResource.base.DetailMonitorInfo;

import java.util.List;

public interface IDetailMonitorInfoRepo extends IStaticInfoBaseRepo<DetailMonitorInfo> {
    List<DetailMonitorInfo> findByStationCode(String stationCode);

    List<DetailMonitorInfo> findByStationCodeList(List<String> stationCodeList);

    DetailMonitorInfo findNewestDeviceInStation(String stationCode);
}
