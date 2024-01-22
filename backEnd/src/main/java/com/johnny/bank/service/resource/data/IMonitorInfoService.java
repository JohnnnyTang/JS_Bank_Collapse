package com.johnny.bank.service.resource.data;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.service.resource.data.base.IStaticInfoBaseService;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
public interface IMonitorInfoService extends IStaticInfoBaseService<MonitorInfo> {
    List<MonitorInfo> getDataByStationCode(DataNode dataNode, int stationCode);

    List<MonitorInfo> getDataByStationCodeList(DataNode dataNode, List<Integer> stationCodeList);

    MonitorInfo getNewestDeviceInStation(DataNode dataNode, int stationCode);

    List<MonitorInfo> getDeviceByType(DataNode dataNode, String deviceType);
}
