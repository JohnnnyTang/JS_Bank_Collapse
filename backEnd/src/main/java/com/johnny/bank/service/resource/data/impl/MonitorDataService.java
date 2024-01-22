package com.johnny.bank.service.resource.data.impl;

import com.johnny.bank.aop.DynamicNodeData;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IMonitorDataRepo;
import com.johnny.bank.service.resource.data.base.IMonitorDataService;
import com.johnny.bank.utils.TimeCalcUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
@Service("MonitorDataService")
public abstract class MonitorDataService<T extends MonitorData> implements IMonitorDataService<T> {

    protected IMonitorDataRepo<T> monitorDataRepo;
    protected IDataNodeRepo dataNodeRepo;

    @Autowired
    public void setDataNodeRepo(IDataNodeRepo dataNodeRepo) {
        this.dataNodeRepo = dataNodeRepo;
    }
    @Autowired
    public void setMonitorDataRepo(IMonitorDataRepo<T> monitorDataRepo) {
        this.monitorDataRepo = monitorDataRepo;
    }

    public abstract DataNode getDataNodeById(String nodeId);
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
    public List<T> getDataByTimeOfDevice(DataNode dataNode, Timestamp begTime, Timestamp endTime, int deviceCode) {
        return monitorDataRepo.findDataByTimeOfDevice(begTime, endTime, deviceCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByMinOfDevice(DataNode dataNode, int minutes, int deviceCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, deviceCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByHourOfDevice(DataNode dataNode, int hours, int deviceCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, deviceCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByDayOfDevice(DataNode dataNode, int days, int deviceCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.DATE, days), current, deviceCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByTimeInStation(DataNode dataNode, Timestamp begTime, Timestamp endTime, int stationCode) {
        return monitorDataRepo.findDataByTimeInStation(begTime, endTime, stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByMinInStation(DataNode dataNode, int minutes, int stationCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.MINUTE, minutes), current, stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByHourInStation(DataNode dataNode, int hours, int stationCode) {
        Timestamp current = new Timestamp(System.currentTimeMillis());
        return monitorDataRepo.findDataByTimeOfDevice(
                TimeCalcUtil.calcTimeBeforeNow(Calendar.HOUR, hours), current, stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getDataByDayInStation(DataNode dataNode, int days, int stationCode) {
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
    public List<T> getByStationCode(DataNode dataNode, int stationCode) {
        return monitorDataRepo.findByStationCode(stationCode);
    }

    @DynamicNodeData
    @Override
    public List<T> getByDeviceCode(DataNode dataNode, int deviceCode) {
        return monitorDataRepo.findByDeviceCode(deviceCode);
    }

    @DynamicNodeData
    @Override
    public T getNewestData(DataNode dataNode) {
        return monitorDataRepo.findNewestData();
    }

    @DynamicNodeData
    @Override
    public T getNewestDataInStation(DataNode dataNode, int stationCode) {
        return monitorDataRepo.findNewestDataInStation(stationCode);
    }

    @DynamicNodeData
    @Override
    public T getNewestDataOfDevice(DataNode dataNode, int deviceCode) {
        return monitorDataRepo.findNewestDataOfDevice(deviceCode);
    }

    @DynamicNodeData
    @Override
    public int getTotalCount(DataNode dataNode) {
        return monitorDataRepo.getTotalCount();
    }

    @Override
    @DynamicNodeData
    public int getTotalCountOfDevice(DataNode dataNode, int deviceCode) {
        return monitorDataRepo.getTotalCountOfDevice(deviceCode);
    }

    @Override
    @DynamicNodeData
    public int getTotalCountInStation(DataNode dataNode, int stationCode) {
        return monitorDataRepo.getTotalCountInStation(stationCode);
    }

    @DynamicNodeData
    @Override
    public boolean checkContinueUpdateOfDevice(DataNode dataNode, Timestamp updateInterval, int deviceCode) {
        return monitorDataRepo.ifContinueUpdateOfDevice(updateInterval, deviceCode);
    }

    @DynamicNodeData
    @Override
    public boolean checkContinueUpdateInStation(DataNode dataNode, Timestamp updateInterval, int stationCode) {
        return monitorDataRepo.ifContinueUpdateOfDevice(updateInterval, stationCode);
    }

}
