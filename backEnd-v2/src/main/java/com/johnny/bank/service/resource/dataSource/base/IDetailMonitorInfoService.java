package com.johnny.bank.service.resource.dataSource.base;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.base.DetailMonitorInfo;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.service.resource.data.base
 * @className: IDetailMonitorInfoService
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/23 20:26
 * @version: 1.0
 */

public interface IDetailMonitorInfoService extends IStaticInfoBaseService<DetailMonitorInfo> {
    List<DetailMonitorInfo> getDataByStationCode(DataNode dataNode, String stationCode);

    List<DetailMonitorInfo> getDataByStationCodeList(DataNode dataNode, List<String> stationCodeList);

    DetailMonitorInfo getNewestDeviceInStation(DataNode dataNode, String stationCode);
}
