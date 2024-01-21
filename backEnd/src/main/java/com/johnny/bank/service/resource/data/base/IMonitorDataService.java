package com.johnny.bank.service.resource.data.base;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
public interface IMonitorDataService<T extends MonitorData> {
    DataNode getDataNode();
    DataNode getDataNodeById(String nodeId);
    DataNode getDataNodeByBankAndName(String bank, String name);

    List<T> getDataByTime(DataNode dataNode, Timestamp begTime, Timestamp endTime);
    List<T> getDataByMin(DataNode dataNode, int minutes);
    List<T> getDataByHour(DataNode dataNode, int hours);
    List<T> getDataByDay(DataNode dataNode, int days);

    List<T> getDataByTimeOfDevice(DataNode dataNode, Timestamp begTime, Timestamp endTime, int deviceCode);
    List<T> getDataByMinOfDevice(DataNode dataNode, int minutes, int deviceCode);
    List<T> getDataByHourOfDevice(DataNode dataNode, int hours, int deviceCode);
    List<T> getDataByDayOfDevice(DataNode dataNode, int days, int deviceCode);

    List<T> getDataByTimeInStation(DataNode dataNode, Timestamp begTime, Timestamp endTime, int stationCode);
    List<T> getDataByMinInStation(DataNode dataNode, int minutes, int stationCode);
    List<T> getDataByHourInStation(DataNode dataNode, int hours, int stationCode);
    List<T> getDataByDayInStation(DataNode dataNode, int days, int stationCode);

    List<T> getAll(DataNode dataNode);

    List<T> getByStationCode(DataNode dataNode, int stationCode);

    List<T> getByDeviceCode(DataNode dataNode, int deviceCode);

    T getNewestData(DataNode dataNode);

    T getNewestDataInStation(DataNode dataNode, int stationCode);

    T getNewestDataOfDevice(DataNode dataNode, int deviceCode);

    int getTotalCount(DataNode dataNode);
    int getTotalCountOfDevice(DataNode dataNode, int deviceCode);
    int getTotalCountInStation(DataNode dataNode, int stationCode);

    // 检查是否还在连续更新
    boolean checkContinueUpdateOfDevice(DataNode dataNode, Timestamp updateInterval, int deviceCode);

    boolean checkContinueUpdateInStation(DataNode dataNode, Timestamp updateInterval, int stationCode);
}
