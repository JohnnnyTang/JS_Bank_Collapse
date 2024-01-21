package com.johnny.bank.repository.resourceRepo.dataResourceRepo.base;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/29
 * @Description:
 */

//@NoRepositoryBean
//@Repository("MonitorDataRepo")
public interface IMonitorDataRepo<T> {
    List<T> findDataByTime(Timestamp begTime, Timestamp endTime);

    List<T> findDataByTimeOfDevice(Timestamp begTime, Timestamp endTime, int deviceCode);

    List<T> findDataByTimeInStation(Timestamp begTime, Timestamp endTime, int stationCode);

//    List<T> getDataByHourFromNow(int hour);
    List<T> findAll();

    List<T> findByStationCode(int stationCode);

    List<T> findByDeviceCode(int deviceCode);

    T findNewestData();

    T findNewestDataInStation(int stationCode);

    T findNewestDataOfDevice(int deviceCode);

    int getTotalCount();

    int getTotalCountOfDevice(int deviceCode);

    int getTotalCountInStation(int stationCode);

    // 检查是否还在连续更新
    boolean ifContinueUpdateOfDevice(Timestamp updateInterval, int deviceCode);

    boolean ifContinueUpdateInStation(Timestamp updateInterval, int stationCode);

}
