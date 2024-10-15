package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/29
 * @Description:
 */
@Repository("MonitorInfoRepo")
public interface IMonitorInfoRepoV2 {
    List<MonitorInfo> findAll(String tableName);

    int getTotalCount(String tableName);

    MonitorInfo findById(String id, String tableName);
    // machine_id_nnu
    List<MonitorInfo> findByIdList(List<String> ids, String tableName);
    // machine_id_nnu
    MonitorInfo findByCode(String code, String tableName);

    List<MonitorInfo> findByCodeList(List<String> codeList, String tableName);

    MonitorInfo findNewestData(String tableName);

    List<MonitorInfo> findByStationCode(String stationCode, String tableName);

    List<MonitorInfo> findByStationCodeList(List<String> stationCodeList, String tableName);

    MonitorInfo findNewestDeviceInStation(String stationCode, String tableName);

    List<MonitorInfo> findDeviceByType(String typeField, Character deviceType, String tableName);
}
