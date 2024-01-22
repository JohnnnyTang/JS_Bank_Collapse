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

    public abstract ResponseEntity<List<T>> getDataByTimeOfDevice(Timestamp begTime, Timestamp endTime, int deviceCode);
    public abstract ResponseEntity<List<T>> getDataByMinOfDevice(int minutes, int deviceCode);
    public abstract ResponseEntity<List<T>> getDataByHourOfDevice(int hours, int deviceCode);
    public abstract ResponseEntity<List<T>> getDataByDayOfDevice(int days, int deviceCode);

    public abstract ResponseEntity<List<T>> getDataByTimeInStation(Timestamp begTime, Timestamp endTime, int stationCode);
    public abstract ResponseEntity<List<T>> getDataByMinInStation(int minutes, int stationCode);
    public abstract ResponseEntity<List<T>> getDataByHourInStation(int hours, int stationCode);
    public abstract ResponseEntity<List<T>> getDataByDayInStation(int days, int stationCode);

    public abstract ResponseEntity<List<T>> getAll();

    public abstract ResponseEntity<List<T>> getByStationCode(int stationCode);

    public abstract ResponseEntity<List<T>> getByDeviceCode(int deviceCode);

    public abstract ResponseEntity<T> getNewestData();

    public abstract ResponseEntity<T> getNewestDataInStation(int stationCode);

    public abstract ResponseEntity<T> getNewestDataOfDevice(int deviceCode);

    public abstract ResponseEntity<Integer> getTotalCount();
    public abstract ResponseEntity<Integer> getTotalCountInStation(int stationCode);
    public abstract ResponseEntity<Integer> getTotalCountOfDevice(int deviceCode);

    // 检查是否还在连续更新
    public abstract ResponseEntity<Boolean> checkContinueUpdateOfDevice(Timestamp updateInterval, int deviceCode);

    public abstract ResponseEntity<Boolean> checkContinueUpdateInStation(Timestamp updateInterval, int stationCode);

}
