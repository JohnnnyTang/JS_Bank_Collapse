package com.johnny.bank.service.resource.dataResource.impl;

import com.johnny.bank.aop.DynamicNodeData;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IMonitorDataRepo;
import com.johnny.bank.service.resource.dataResource.base.IMonitorDataService;
import com.johnny.bank.utils.TimeCalcUtil;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
//@Service("MonitorDataService")
public abstract class MonitorDataService<T extends MonitorData> implements IMonitorDataService<T> {

    protected IMonitorDataRepo<T> monitorDataRepo;
    protected IDataNodeRepo dataNodeRepo;

    public MonitorDataService(IDataNodeRepo dataNodeRepo, IMonitorDataRepo<T> monitorDataRepo) {
        this.dataNodeRepo =dataNodeRepo;
        this.monitorDataRepo = monitorDataRepo;
    }

    public DataNode getDataNodeById(String nodeId) {
        return dataNodeRepo.findById(nodeId).orElse(null);
    }
    public abstract DataNode getDataNode();
    public abstract DataNode getDataNodeByBankAndName(String bank, String name);

    @Override
    @DynamicNodeData
    public List<T> getDataByTime(DataNode dataNode, Timestamp begTime, Timestamp endTime) {
        return monitorDataRepo.findDataByTime(begTime, endTime);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByMin(DataNode dataNode, int minutes) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByHour(DataNode dataNode, int hours) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByDay(DataNode dataNode, int days) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTime(TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByTimeOfDevice(DataNode dataNode, Timestamp begTime, Timestamp endTime, String deviceCode) {
        return monitorDataRepo.findDataByTimeOfDevice(begTime, endTime, deviceCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByMinOfDevice(DataNode dataNode, int minutes, String deviceCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, deviceCode);
    }

    @Override
    @DynamicNodeData
    public List<T> getDataByMinBeforeStartOfDevice(DataNode dataNode, int minutesBefore, int minutesDur, String deviceCode) {
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesDur+minutesBefore),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutesBefore),
                deviceCode
        );
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByHourOfDevice(DataNode dataNode, int hours, String deviceCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, deviceCode);
    }

    @Override
    @DynamicNodeData
    public List<T> getDataByHourBeforeStartOfDevice(DataNode dataNode, int hoursBefore, int hoursDur, String deviceCode) {
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore+hoursDur),
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hoursBefore),
                deviceCode
        );
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByDayOfDevice(DataNode dataNode, int days, String deviceCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current, deviceCode);
    }

    @Override
    @DynamicNodeData
    public List<T> getDataByDayBeforeStartOfDevice(DataNode dataNode, int daysBefore, int daysDur, String deviceCode) {
        Timestamp begTime = TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore+daysDur);
        Timestamp endTime = TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, daysBefore);
        return monitorDataRepo.findDataByTimeOfDevice(
                begTime,
                endTime,
                deviceCode
        );
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByTimeInStation(DataNode dataNode, Timestamp begTime, Timestamp endTime, String stationCode) {
        return monitorDataRepo.findDataByTimeInStation(begTime, endTime, stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByMinInStation(DataNode dataNode, int minutes, String stationCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByHourInStation(DataNode dataNode, int hours, String stationCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByDayInStation(DataNode dataNode, int days, String stationCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current, stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getAll(DataNode dataNode) {
        return monitorDataRepo.findAll();
    }

    @DynamicNodeData
    @Override
    public List<T> getByStationCode(DataNode dataNode, String stationCode) {
        return monitorDataRepo.findByStationCode(stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getByDeviceCode(DataNode dataNode, String deviceCode) {
        return monitorDataRepo.findByDeviceCode(deviceCode);
    }

    @DynamicNodeData
    @Override
    public T getNewestData(DataNode dataNode) {
        return monitorDataRepo.findNewestData();
    }

    @DynamicNodeData
    @Override
    public T getNewestDataInStation(DataNode dataNode, String stationCode) {
        return monitorDataRepo.findNewestDataInStation(stationCode);
    }

    @DynamicNodeData
    @Override
    public T getNewestDataOfDevice(DataNode dataNode, String deviceCode) {
        return monitorDataRepo.findNewestDataOfDevice(deviceCode);
    }

    @DynamicNodeData
    @Override
    public int getTotalCount(DataNode dataNode) {
        return monitorDataRepo.getTotalCount();
    }

    @Override
    @DynamicNodeData
    public int getTotalCountOfDevice(DataNode dataNode, String deviceCode) {
        return monitorDataRepo.getTotalCountOfDevice(deviceCode);
    }

    @Override
    @DynamicNodeData
    public int getTotalCountInStation(DataNode dataNode, String stationCode) {
        return monitorDataRepo.getTotalCountInStation(stationCode);
    }

    @DynamicNodeData
    @Override
    public boolean checkContinueUpdateOfDevice(DataNode dataNode, int timeLimit, String deviceCode) {

        return monitorDataRepo.ifContinueUpdateOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.SECOND, timeLimit),
                deviceCode
        );
    }

    @DynamicNodeData
    @Override
    public boolean checkContinueUpdateOfDeviceWithMinute(DataNode dataNode, int timeLimitMinute, String deviceCode) {
        return monitorDataRepo.ifContinueUpdateOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, timeLimitMinute),
                deviceCode
        );
    }

    @DynamicNodeData
    @Override
    public boolean checkContinueUpdateInStation(DataNode dataNode, int timeLimit, String stationCode) {
        return monitorDataRepo.ifContinueUpdateOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.SECOND, timeLimit),
                stationCode
        );
    }

}
