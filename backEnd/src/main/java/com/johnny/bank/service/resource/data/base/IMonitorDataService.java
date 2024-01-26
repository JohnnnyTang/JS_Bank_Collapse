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

    List<T> getDataByTimeOfDevice(DataNode dataNode, Timestamp begTime, Timestamp endTime, String deviceCode);
    List<T> getDataByMinOfDevice(DataNode dataNode, int minutes, String deviceCode);
    List<T> getDataByHourOfDevice(DataNode dataNode, int hours, String deviceCode);
    List<T> getDataByDayOfDevice(DataNode dataNode, int days, String deviceCode);

    List<T> getDataByTimeInStation(DataNode dataNode, Timestamp begTime, Timestamp endTime, String stationCode);
    List<T> getDataByMinInStation(DataNode dataNode, int minutes, String stationCode);
    List<T> getDataByHourInStation(DataNode dataNode, int hours, String stationCode);
    List<T> getDataByDayInStation(DataNode dataNode, int days, String stationCode);

    List<T> getAll(DataNode dataNode);

    List<T> getByStationCode(DataNode dataNode, String stationCode);

    List<T> getByDeviceCode(DataNode dataNode, String deviceCode);

    T getNewestData(DataNode dataNode);

    T getNewestDataInStation(DataNode dataNode, String stationCode);

    T getNewestDataOfDevice(DataNode dataNode, String deviceCode);

    int getTotalCount(DataNode dataNode);
    int getTotalCountOfDevice(DataNode dataNode, String deviceCode);
    int getTotalCountInStation(DataNode dataNode, String stationCode);

    // 检查是否还在连续更新
    boolean checkContinueUpdateOfDevice(DataNode dataNode, int timeLimit, String deviceCode);
    boolean checkContinueUpdateOfDeviceWithMinute(DataNode dataNode, int timeLimitMinute, String deviceCode);

    boolean checkContinueUpdateInStation(DataNode dataNode, int timeLimit, String stationCode);
}
