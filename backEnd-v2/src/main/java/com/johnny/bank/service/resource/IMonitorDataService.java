package com.johnny.bank.service.resource;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
public interface IMonitorDataService<T> {
    List<T> getAllData();

    List<T> getDataByDay(int dayCount);

    List<T> getDataByHour(int hourCount);

    List<T> getDataByMin(int minCount);

    T getNewestData();

    boolean checkContinueUpdate(Timestamp timeInterval);
}
