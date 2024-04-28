package com.johnny.bank.service.resource.data.impl;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.DeviceWarning;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IDeviceWarningRepo;
import com.johnny.bank.service.resource.data.IDeviceWarningService;
import com.johnny.bank.utils.TimeCalcUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.service.resource.data.impl
 * @className: CollapseInfoService
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/24 15:10
 * @version: 1.0
 */
@Service
public class DeviceWarningService implements IDeviceWarningService {
    private final IDeviceWarningRepo iDeviceWarningRepo;

    @Autowired
    public DeviceWarningService(@Qualifier("DeviceWarningRepo") IDeviceWarningRepo iDeviceWarningRepo) {
        this.iDeviceWarningRepo = iDeviceWarningRepo;
    }

    @Override
    public Boolean save(DeviceWarning deviceWarning) {
        iDeviceWarningRepo.save(deviceWarning);
        return true;
    }

    public List<DeviceWarning> getAll() {
        return iDeviceWarningRepo.findAll();
    }

    public int getTotalCount() {
        return iDeviceWarningRepo.getTotalCount();
    }

    public List<DeviceWarning> getByDeviceId(String deviceId) {
        return iDeviceWarningRepo.findByDeviceCode(deviceId);
    }

    public DeviceWarning getNewestData() {
        return iDeviceWarningRepo.findNewestData();
    }

    public List<DeviceWarning> getDataByTime(Timestamp begTime, Timestamp endTime) {
        return iDeviceWarningRepo.findDataByTime(begTime, endTime);
    }

    public List<DeviceWarning> getDataByMin(int minutes) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current);
    }

    public List<DeviceWarning> getDataByHour(int hours) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current);
    }

    public List<DeviceWarning> getDataByDay(int days) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current);
    }

    public List<DeviceWarning> getDataByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceId) {
        return iDeviceWarningRepo.findDataByTimeOfDevice(begTime, endTime, deviceId);
    }

    public List<DeviceWarning> getDataByMinOfDevice(int minutes, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, deviceId);
    }

    public List<DeviceWarning> getDataByMinBeforeStartOfDevice(int minutesBefore, int minutesDur, String deviceId) {
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore),
                deviceId
        );
    }

    public List<DeviceWarning> getDataByHourOfDevice(int hours, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, deviceId);
    }

    public List<DeviceWarning> getDataByHourBeforeStartOfDevice(int hoursBefore, int hoursDur, String deviceId) {
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore+hoursDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore),
                deviceId
        );
    }

    public List<DeviceWarning> getDataByDayOfDevice(int days, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current, deviceId);
    }

    public List<DeviceWarning> getDataByDayBeforeStartOfDevice(int daysBefore, int daysDur, String deviceId) {
        Timestamp begTime = TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore+daysDur);
        Timestamp endTime = TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore);
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                begTime,
                endTime,
                deviceId
        );
    }

    public List<DeviceWarning> getByDeviceCode(String deviceCode) {
        return iDeviceWarningRepo.findByDeviceCode(deviceCode);
    }

    public DeviceWarning getNewestDataOfDevice(String deviceCode) {
        return iDeviceWarningRepo.findNewestDataOfDevice(deviceCode);
    }

    public int getTotalCountOfDevice(String deviceCode) {
        return iDeviceWarningRepo.getTotalCountOfDevice(deviceCode);
    }

}
