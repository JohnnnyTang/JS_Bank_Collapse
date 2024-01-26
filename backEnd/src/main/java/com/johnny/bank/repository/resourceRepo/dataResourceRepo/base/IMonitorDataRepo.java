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

    List<T> findDataByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceCode);

    List<T> findDataByTimeInStation(Timestamp begTime, Timestamp endTime, String stationCode);

//    List<T> getDataByHourFromNow(int hour);
    List<T> findAll();

    List<T> findByStationCode(String stationCode);

    List<T> findByDeviceCode(String deviceCode);

    T findNewestData();

    T findNewestDataInStation(String stationCode);

    T findNewestDataOfDevice(String deviceCode);

    int getTotalCount();

    int getTotalCountOfDevice(String deviceCode);

    int getTotalCountInStation(String stationCode);

    // 检查是否还在连续更新
    boolean ifContinueUpdateOfDevice(Timestamp timeLimit, String deviceCode);

    boolean ifContinueUpdateInStation(Timestamp timeLimit, String stationCode);

}
