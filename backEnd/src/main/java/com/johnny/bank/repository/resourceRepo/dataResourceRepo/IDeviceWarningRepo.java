package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.DeviceWarning;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository("DeviceWarningRepo")
public interface IDeviceWarningRepo {
    List<DeviceWarning> findDataByTime(Timestamp begTime, Timestamp endTime);

    List<DeviceWarning> findDataByTimeOfDevice(Timestamp begTime, Timestamp endTime, String deviceId);

    List<DeviceWarning> findAll();

    DeviceWarning findNewestDataOfDevice(String deviceId);

    DeviceWarning findNewestData();

    int getTotalCount();

    int getTotalCountOfDevice(String deviceId);

    void save(DeviceWarning deviceWarning);

    List<DeviceWarning> findByDeviceCode(String deviceCode);
}
