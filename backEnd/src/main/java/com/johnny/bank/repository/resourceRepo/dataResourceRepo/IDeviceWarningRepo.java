package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.DeviceWarning;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository("DeviceWarningRepo")
public interface IDeviceWarningRepo {

    List<DeviceWarning> findDataByTime(Timestamp begTime, Timestamp endTime);
    List<DeviceWarning> findWarnDataByTime(Timestamp begTime, Timestamp endTime);
    List<DeviceWarning> findDangerDataByTime(Timestamp begTime, Timestamp endTime);

    List<DeviceWarning> findDataByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceId);

    List<DeviceWarning> findAll();

    DeviceWarning findNewestDataOfDevice(String deviceId);

    DeviceWarning findNewestData();

    int getTotalCount();
    int getTotalWarnCount();
    int getTotalDangerCount();

    int getTotalCountOfDevice(String deviceId);

    int getTotalWarnCountOfDevice(String deviceId);

    int getTotalDangerCountOfDevice(String deviceId);

    int getTotalCountByTime(Timestamp begTime, Timestamp endTime);
    int getTotalWarnCountByTime(Timestamp begTime, Timestamp endTime);
    int getTotalDangerCountByTime(Timestamp begTime, Timestamp endTime);

    int getTotalCountByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceId);
    int getTotalWarnCountByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceId);
    int getTotalDangerCountByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceId);

    void save(DeviceWarning deviceWarning);

    List<DeviceWarning> findByDeviceCode(String deviceCode);

    DeviceWarning findById(String id);

    void updateWarnDealtStatus(String id, Integer dealt);
}
