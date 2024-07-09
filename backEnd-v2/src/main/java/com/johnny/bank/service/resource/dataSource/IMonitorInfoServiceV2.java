package com.johnny.bank.service.resource.dataSource;

import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
public interface IMonitorInfoServiceV2 {

    List<MonitorInfo> getAllData(DataNodeV2 DataNodeV2);

    int getRowNumber(DataNodeV2 DataNodeV2);

    MonitorInfo getInfoById(DataNodeV2 DataNodeV2, String id);

    List<MonitorInfo> getInfoByIdList(DataNodeV2 DataNodeV2, List<String> ids);

//    MonitorInfo getInfoByCode(DataNodeV2 DataNodeV2, String code);
//
//    List<MonitorInfo> getInfoByCodeList(DataNodeV2 DataNodeV2, List<String> codeList);

    MonitorInfo getNewestData(DataNodeV2 DataNodeV2);

    DataNodeV2 getDataNode(String bank);

    List<MonitorInfo> getInfoByStationCode(DataNodeV2 DataNodeV2, String stationCode);

    List<MonitorInfo> getInfoByStationCodeList(DataNodeV2 DataNodeV2, List<String> stationCodeList);

    MonitorInfo getNewestDeviceInStation(DataNodeV2 DataNodeV2, String stationCode);

    List<MonitorInfo> getDeviceByTypeWithTypeNode(DataNodeV2 DataNodeV2);

    List<MonitorInfo> getDeviceByTypeChar(Character typeCode, String bank);

    List<String> getDeviceIdListByType(Character deviceType, String bank);
}
