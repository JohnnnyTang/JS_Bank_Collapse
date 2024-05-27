package com.johnny.bank.service.resource.data.impl;

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

    public Integer getTotalCount() {
        return iDeviceWarningRepo.getTotalCount();
    }
    public Integer getTotalWarnCount() {
        return iDeviceWarningRepo.getTotalWarnCount();
    }
    public Integer getTotalDangerCount() {
        return iDeviceWarningRepo.getTotalDangerCount();
    }


//    public List<DeviceWarning> getByDeviceId(String deviceId) {
//        return iDeviceWarningRepo.findByDeviceCode(deviceId);
//    }

    public DeviceWarning getNewestData() {
        return iDeviceWarningRepo.findNewestData();
    }

    public List<DeviceWarning> getDataByTime(Timestamp begTime, Timestamp endTime) {
        return iDeviceWarningRepo.findDataByTime(begTime, endTime);
    }

    public List<DeviceWarning> getDataByMin(Integer minutes) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current);
    }

    public List<DeviceWarning> getWarnDataByMin(Integer minutes) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findWarnDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current);
    }

    public List<DeviceWarning> getDangerDataByMin(Integer minutes) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDangerDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current);
    }

    public Integer getCountByMin(Integer minutes) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current);
    }
    public Integer getWarnCountByMin(Integer minutes) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalWarnCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current);
    }
    public Integer getDangerCountByMin(Integer minutes) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalDangerCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current);
    }

    public List<DeviceWarning> getDataByHour(Integer hours) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current);
    }

    public Integer getCountByHour(Integer hours) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current);
    }
    public Integer getWarnCountByHour(Integer hours) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalWarnCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current);
    }
    public Integer getDangerCountByHour(Integer hours) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalDangerCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current);
    }

    public List<DeviceWarning> getDataByDay(Integer days) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current);
    }

    public Integer getCountByDay(Integer days) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current);
    }
    public Integer getWarnCountByDay(Integer days) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalWarnCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current);
    }
    public Integer getDangerCountByDay(Integer days) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalDangerCountByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current);
    }
    public Integer getCountByMinBeforeStart(Integer minutesBefore, Integer minutesDur) {
        return iDeviceWarningRepo.getTotalCountByTime(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore)
        );
    }
    public Integer getWarnCountByMinBeforeStart(Integer minutesBefore, Integer minutesDur) {
        return iDeviceWarningRepo.getTotalWarnCountByTime(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore)
        );
    }
    public Integer getDangerCountByMinBeforeStart(Integer minutesBefore, Integer minutesDur) {
        return iDeviceWarningRepo.getTotalDangerCountByTime(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore)
        );
    }

    public List<DeviceWarning> getDataByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceId) {
        return iDeviceWarningRepo.findDataByTimeOfDevice(begTime, endTime, deviceId);
    }

    public List<DeviceWarning> getDataByMinOfDevice(Integer minutes, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, deviceId);
    }

    public List<DeviceWarning> getDataByMinBeforeStartOfDevice(Integer minutesBefore, Integer minutesDur, String deviceId) {
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore),
                deviceId
        );
    }
    public Integer getCountByMinBeforeStartOfDevice(Integer minutesBefore, Integer minutesDur, String deviceId) {
        return iDeviceWarningRepo.getTotalCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore),
                deviceId
        );
    }
    public Integer getWarnCountByMinBeforeStartOfDevice(Integer minutesBefore, Integer minutesDur, String deviceId) {
        return iDeviceWarningRepo.getTotalWarnCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore),
                deviceId
        );
    }
    public Integer getDangerCountByMinBeforeStartOfDevice(Integer minutesBefore, Integer minutesDur, String deviceId) {
        return iDeviceWarningRepo.getTotalDangerCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore),
                deviceId
        );
    }

    public Integer getCountByMinOfDevice(Integer minutes, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, deviceId);
    }
    public Integer getWarnCountByMinOfDevice(Integer minutes, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalWarnCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, deviceId);
    }
    public Integer getDangerCountByMinOfDevice(Integer minutes, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalDangerCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, deviceId);
    }

    public List<DeviceWarning> getDataByHourOfDevice(Integer hours, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, deviceId);
    }

    public Integer getCountByHourOfDevice(Integer hours, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, deviceId);
    }
    public Integer getWarnCountByHourOfDevice(Integer hours, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalWarnCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, deviceId);
    }
    public Integer getDangerCountByHourOfDevice(Integer hours, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalDangerCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, deviceId);
    }

    public List<DeviceWarning> getDataByHourBeforeStartOfDevice(Integer hoursBefore, Integer hoursDur, String deviceId) {
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore+hoursDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore),
                deviceId
        );
    }

    public Integer getCountByHourBeforeStartOfDevice(Integer hoursBefore, Integer hoursDur, String deviceId) {
        return iDeviceWarningRepo.getTotalCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore+hoursDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore),
                deviceId
        );
    }
    public Integer getWarnCountByHourBeforeStartOfDevice(Integer hoursBefore, Integer hoursDur, String deviceId) {
        return iDeviceWarningRepo.getTotalWarnCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore+hoursDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore),
                deviceId
        );
    }
    public Integer getDangerCountByHourBeforeStartOfDevice(Integer hoursBefore, Integer hoursDur, String deviceId) {
        return iDeviceWarningRepo.getTotalDangerCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore+hoursDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore),
                deviceId
        );
    }

    public List<DeviceWarning> getDataByDayOfDevice(Integer days, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current, deviceId);
    }

    public Integer getCountByDayOfDevice(Integer days, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current, deviceId);
    }
    public Integer getWarnCountByDayOfDevice(Integer days, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalWarnCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current, deviceId);
    }
    public Integer getDangerCountByDayOfDevice(Integer days, String deviceId) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return iDeviceWarningRepo.getTotalDangerCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current, deviceId);
    }

    public List<DeviceWarning> getDataByDayBeforeStartOfDevice(Integer daysBefore, Integer daysDur, String deviceId) {
        Timestamp begTime = TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore+daysDur);
        Timestamp endTime = TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore);
        return iDeviceWarningRepo.findDataByTimeOfDevice(
                begTime,
                endTime,
                deviceId
        );
    }

    public Integer getCountByDayBeforeStartOfDevice(Integer daysBefore, Integer daysDur, String deviceId) {
        return iDeviceWarningRepo.getTotalCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore+daysDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore),
                deviceId
        );
    }
    public Integer getWarnCountByDayBeforeStartOfDevice(Integer daysBefore, Integer daysDur, String deviceId) {
        return iDeviceWarningRepo.getTotalWarnCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore+daysDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore),
                deviceId
        );
    }
    public Integer getDangerCountByDayBeforeStartOfDevice(Integer daysBefore, Integer daysDur, String deviceId) {
        return iDeviceWarningRepo.getTotalDangerCountByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore+daysDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore),
                deviceId
        );
    }

    public List<DeviceWarning> getByDeviceCode(String deviceCode) {
        return iDeviceWarningRepo.findByDeviceCode(deviceCode);
    }

    public DeviceWarning getNewestDataOfDevice(String deviceCode) {
        return iDeviceWarningRepo.findNewestDataOfDevice(deviceCode);
    }

    public Integer getTotalCountOfDevice(String deviceCode) {
        return iDeviceWarningRepo.getTotalCountOfDevice(deviceCode);
    }
    public Integer getTotalWarnCountOfDevice(String deviceCode) {
        return iDeviceWarningRepo.getTotalWarnCountOfDevice(deviceCode);
    }
    public Integer getTotalDangerCountOfDevice(String deviceCode) {
        return iDeviceWarningRepo.getTotalDangerCountOfDevice(deviceCode);
    }

    public DeviceWarning updateDeviceDealtWithId(String id, Integer dealt) {
        DeviceWarning deviceWarning = iDeviceWarningRepo.findById(id);
        if(deviceWarning == null) return null;

        iDeviceWarningRepo.updateWarnDealtStatus(id, dealt);
        deviceWarning.setIfDealt(dealt);
        return deviceWarning;
    }

}
