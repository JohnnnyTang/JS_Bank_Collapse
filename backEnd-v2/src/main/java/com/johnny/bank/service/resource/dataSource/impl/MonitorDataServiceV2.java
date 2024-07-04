package com.johnny.bank.service.resource.dataSource.impl;

import com.johnny.bank.aop.DynamicNodeDataV2;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import com.johnny.bank.model.resource.dataResource.base.MonitorDataQueryParam;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepoV2;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.base.IMonitorDataRepoV2;
import com.johnny.bank.utils.TimeCalcUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
@Service("MonitorDataServiceV2")
public class MonitorDataServiceV2<T extends MonitorData> {

    protected IMonitorDataRepoV2<T> monitorDataRepo;
    protected IDataNodeRepoV2 dataNodeRepo;

    public MonitorDataServiceV2(IDataNodeRepoV2 dataNodeRepo, @Qualifier("MonitorDataRepoV2") IMonitorDataRepoV2<T> monitorDataRepo) {
        this.dataNodeRepo = dataNodeRepo;
        this.monitorDataRepo = monitorDataRepo;
    }

    private MonitorDataQueryParam buildQueryParamFromNodeWithTime(
            DataNodeV2 dataNode, Timestamp begTime, Timestamp endTime, Integer precedentNum, Integer rowLimit
    ) {
        if(precedentNum == null) {
            if(!dataNode.getCategory().endsWith("Group")) {
                DataNodeV2 typeNode = dataNodeRepo.getNodeByCategoryAndBank(
                        dataNode.getCategory().replace("Monitor", "Group"), dataNode.getBank()
                );
                precedentNum = Integer.parseInt(typeNode.getUsage().getString("avgNum"));
            }
            else {
                precedentNum = Integer.parseInt(dataNode.getUsage().getString("avgNum"));
            }
        }
        MonitorDataQueryParam monitorDataQueryParam = MonitorDataQueryParam.builder()
                .begTime(begTime).endTime(endTime)
                .precedentNum(precedentNum-1).rowLimit(rowLimit)
                .build();
        if(dataNode.getCategory().endsWith("Monitor")) {
            monitorDataQueryParam.setTableName(dataNode.getUsage().getString("tableName"));
            monitorDataQueryParam.setDeviceId(dataNode.getBasicInfo().getString("code"));
            monitorDataQueryParam.setType(Integer.parseInt(dataNode.getBasicInfo().getString("type")));
        }
        else {
            monitorDataQueryParam.setTableName(dataNode.getUsage().getString("dataTable"));
            monitorDataQueryParam.setType(dataNode.getUsage().getInteger("typeValue"));
        }
        return monitorDataQueryParam;
    }

    @DynamicNodeDataV2
    public List<? extends MonitorData> getDataByTimeInterval(
            DataNodeV2 dataNode, Integer timeUnit, Integer timeDuration,
            int timeStartBefore, Integer precedentNum, Integer rowLimit
    ) {
        MonitorDataQueryParam monitorDataQueryParam;
        if(timeUnit == null || timeDuration == null) {
            monitorDataQueryParam = buildQueryParamFromNodeWithTime(
                    dataNode, null, null,
                    precedentNum, rowLimit
            );
        }
        else {
            monitorDataQueryParam = buildQueryParamFromNodeWithTime(
                    dataNode, TimeCalcUtil.calcTimeBeforeNow(timeUnit, timeDuration+timeStartBefore),
                    TimeCalcUtil.calcTimeBeforeNow(timeUnit, timeStartBefore),
                    precedentNum, rowLimit
            );
        }
        if(monitorDataQueryParam.getType() == 1) {
            return monitorDataRepo.getGnssData(monitorDataQueryParam);
        } else if (monitorDataQueryParam.getType() == 2) {
            return monitorDataRepo.getStressData(monitorDataQueryParam);
        } else if (monitorDataQueryParam.getType() == 3) {
            return monitorDataRepo.getManometerData(monitorDataQueryParam);
        } else if (monitorDataQueryParam.getType() == 4) {
            return monitorDataRepo.getInclinometerData(monitorDataQueryParam);
        } else return null;
    }

    @DynamicNodeDataV2
    public int getTotalCount(DataNodeV2 dataNode) {
        String dataTableName = dataNode.getUsage().getString("dataTable");
        if(dataTableName == null) {
            dataTableName = dataNode.getUsage().getString("tableName");
        }
        MonitorDataQueryParam monitorDataQueryParam = MonitorDataQueryParam.builder()
                .tableName(dataTableName)
                .build();
        return monitorDataRepo.getCount(monitorDataQueryParam);
    }

    @DynamicNodeDataV2
    public int getTotalCountOfDevice(DataNodeV2 dataNode) {
        String dataTableName = dataNode.getUsage().getString("tableName");
        String deviceId = dataNode.getBasicInfo().getString("code");
        MonitorDataQueryParam monitorDataQueryParam = MonitorDataQueryParam.builder()
                .tableName(dataTableName).deviceId(deviceId)
                .build();
        return monitorDataRepo.getCount(monitorDataQueryParam);
    }

    @DynamicNodeDataV2
    public boolean checkContinueUpdateOfDevice(DataNodeV2 dataNode, int timeUnit, int timeLimit, String deviceCode) {
        return monitorDataRepo.ifContinueUpdateOfDevice(
                dataNode.getUsage().getString("tableName"),
                TimeCalcUtil.calcTimeBeforeNow(timeUnit, timeLimit),
                deviceCode
        );
    }

}
