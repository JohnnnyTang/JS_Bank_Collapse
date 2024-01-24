package com.johnny.bank.controller.resource.data.base;

import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import org.springframework.http.ResponseEntity;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
public abstract class AbstractMonitorDataController<T extends MonitorData> {
    public abstract ResponseEntity<List<T>> getDataByTime(Timestamp begTime, Timestamp endTime);
    public abstract ResponseEntity<List<T>> getDataByMin(int minutes);
    public abstract ResponseEntity<List<T>> getDataByHour(int hours);
    public abstract ResponseEntity<List<T>> getDataByDay(int days);

    public abstract ResponseEntity<List<T>> getDataByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceCode);
    public abstract ResponseEntity<List<T>> getDataByMinOfDevice(int minutes, String deviceCode);
    public abstract ResponseEntity<List<T>> getDataByHourOfDevice(int hours, String deviceCode);
    public abstract ResponseEntity<List<T>> getDataByDayOfDevice(int days, String deviceCode);

    public abstract ResponseEntity<List<T>> getDataByTimeInStation(Timestamp begTime, Timestamp endTime, String stationCode);
    public abstract ResponseEntity<List<T>> getDataByMinInStation(int minutes, String stationCode);
    public abstract ResponseEntity<List<T>> getDataByHourInStation(int hours, String stationCode);
    public abstract ResponseEntity<List<T>> getDataByDayInStation(int days, String stationCode);

    public abstract ResponseEntity<List<T>> getAll();

    public abstract ResponseEntity<List<T>> getByStationCode(String stationCode);

    public abstract ResponseEntity<List<T>> getByDeviceCode(String deviceCode);

    public abstract ResponseEntity<T> getNewestData();

    public abstract ResponseEntity<T> getNewestDataInStation(String stationCode);

    public abstract ResponseEntity<T> getNewestDataOfDevice(String deviceCode);

    public abstract ResponseEntity<Integer> getTotalCount();
    public abstract ResponseEntity<Integer> getTotalCountInStation(String stationCode);
    public abstract ResponseEntity<Integer> getTotalCountOfDevice(String deviceCode);

    // 检查是否还在连续更新
    public abstract ResponseEntity<Boolean> checkContinueUpdateOfDevice(Timestamp updateInterval, String deviceCode);

    public abstract ResponseEntity<Boolean> checkContinueUpdateInStation(Timestamp updateInterval, String stationCode);

}
