package com.johnny.bank.controller.resource.data.base;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import com.johnny.bank.service.resource.data.impl.MonitorDataService;
import com.johnny.bank.service.resource.data.impl.MonitorInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
@RestController
public class BaseMonitorDataController<T extends MonitorData> extends AbstractMonitorDataController<T> {

    private final MonitorDataService<T> monitorDataService;
    private final MonitorInfoService monitorInfoService;
    private final DataNode dataNode;

    @Autowired
    public BaseMonitorDataController(MonitorDataService<T> MonitorDataService, MonitorInfoService monitorInfoService) {
        this.monitorDataService = MonitorDataService;
        this.monitorInfoService = monitorInfoService;
        this.dataNode = monitorDataService.getDataNode();
    }

    @Override
    @GetMapping("/time")
    public ResponseEntity<List<T>> getDataByTime(@RequestParam Timestamp begTime,@RequestParam Timestamp endTime) {
        return ResponseEntity.ok(monitorDataService.getDataByTime(dataNode, begTime, endTime));
    }

    @Override
    @GetMapping("/minute/{minutes}")
    public ResponseEntity<List<T>> getDataByMin(@PathVariable int minutes) {
        return ResponseEntity.ok(monitorDataService.getDataByMin(dataNode, minutes));
    }

    @Override
    @GetMapping("/hour/{hours}")
    public ResponseEntity<List<T>> getDataByHour(@PathVariable int hours) {
        return ResponseEntity.ok(monitorDataService.getDataByHour(dataNode, hours));
    }

    @Override
    @GetMapping("/day/{days}")
    public ResponseEntity<List<T>> getDataByDay(@PathVariable int days) {
        return ResponseEntity.ok(monitorDataService.getDataByDay(dataNode, days));
    }

    @Override
    @GetMapping("/time/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByTimeOfDevice(@RequestParam Timestamp begTime,@RequestParam Timestamp endTime,@PathVariable int deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByTimeOfDevice(dataNode, begTime, endTime, deviceCode));
    }

    @Override
    @GetMapping("/minute/{minutes}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByMinOfDevice(@PathVariable int minutes,@PathVariable int deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByMinOfDevice(dataNode, minutes, deviceCode));
    }

    @Override
    @GetMapping("/hour/{hours}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByHourOfDevice(@PathVariable int hours, @PathVariable int deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByHourOfDevice(dataNode, hours, deviceCode));
    }

    @Override
    @GetMapping("/day/{days}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByDayOfDevice(@PathVariable int days, @PathVariable int deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByDayOfDevice(dataNode, days, deviceCode));
    }

    @Override
    @GetMapping("/time/station/{stationCode}")
    public ResponseEntity<List<T>> getDataByTimeInStation(@RequestParam Timestamp begTime,@RequestParam  Timestamp endTime, @PathVariable int stationCode) {
        return ResponseEntity.ok(monitorDataService.getDataByTimeInStation(dataNode, begTime, endTime, stationCode));
    }

    @Override
    @GetMapping("/minute/{minutes}/station/{stationCode}")
    public ResponseEntity<List<T>> getDataByMinInStation(@PathVariable int minutes, @PathVariable int stationCode) {
        return ResponseEntity.ok(monitorDataService.getDataByMinInStation(dataNode, minutes, stationCode));
    }

    @Override
    @GetMapping("/hour/{hours}/station/{stationCode}")
    public ResponseEntity<List<T>> getDataByHourInStation(@PathVariable int hours, @PathVariable int stationCode) {
        return ResponseEntity.ok(monitorDataService.getDataByHourInStation(dataNode, hours, stationCode));
    }

    @Override
    @GetMapping("/day/{days}/station/{stationCode}")
    public ResponseEntity<List<T>> getDataByDayInStation(@PathVariable int days, @PathVariable int stationCode) {
        return ResponseEntity.ok(monitorDataService.getDataByDayInStation(dataNode, days, stationCode));
    }

    @Override
    @GetMapping
    public ResponseEntity<List<T>> getAll() {
        return ResponseEntity.ok(monitorDataService.getAll(dataNode));
    }

    @Override
    @GetMapping("/station/{stationCode}")
    public ResponseEntity<List<T>> getByStationCode(@PathVariable int stationCode) {
        return ResponseEntity.ok(monitorDataService.getByStationCode(dataNode, stationCode));
    }

    @Override
    @GetMapping("/device/{deviceCode}")
    public ResponseEntity<List<T>> getByDeviceCode(@PathVariable int deviceCode) {
        return ResponseEntity.ok(monitorDataService.getByDeviceCode(dataNode, deviceCode));
    }

    @Override
    @GetMapping("/newest")
    public ResponseEntity<T> getNewestData() {
        return ResponseEntity.ok(monitorDataService.getNewestData(dataNode));
    }

    @Override
    @GetMapping("/newest/station/{stationCode}")
    public ResponseEntity<T> getNewestDataInStation(@PathVariable int stationCode) {
        return ResponseEntity.ok(monitorDataService.getNewestDataInStation(dataNode, stationCode));
    }

    @Override
    @GetMapping("/newest/device/{deviceCode}")
    public ResponseEntity<T> getNewestDataOfDevice(@PathVariable int deviceCode) {
        return ResponseEntity.ok(monitorDataService.getNewestDataOfDevice(dataNode, deviceCode));
    }

    @Override
    @GetMapping("/count")
    public ResponseEntity<Integer> getTotalCount() {
        return ResponseEntity.ok(monitorDataService.getTotalCount(dataNode));
    }

    @Override
    @GetMapping("/count/station/{stationCode}")
    public ResponseEntity<Integer> getTotalCountInStation(@PathVariable int stationCode) {
        return ResponseEntity.ok(monitorDataService.getTotalCountInStation(dataNode, stationCode));
    }

    @Override
    public ResponseEntity<Integer> getTotalCountOfDevice(@PathVariable int deviceCode) {
        return ResponseEntity.ok(monitorDataService.getTotalCountOfDevice(dataNode, deviceCode));
    }

    @Override
    @GetMapping("/checkDevice/{updateInterval}/{deviceCode}")
    public ResponseEntity<Boolean> checkContinueUpdateOfDevice(@PathVariable Timestamp updateInterval, @PathVariable int deviceCode) {
        return ResponseEntity.ok(monitorDataService.checkContinueUpdateOfDevice(dataNode, updateInterval, deviceCode));
    }

    @Override
    @GetMapping("/checkDevice/{updateInterval}/{stationCode}")
    public ResponseEntity<Boolean> checkContinueUpdateInStation(@PathVariable Timestamp updateInterval, @PathVariable int stationCode) {
        return ResponseEntity.ok(monitorDataService.checkContinueUpdateInStation(dataNode, updateInterval, stationCode));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<List<T>> getDataByMonitorId(@PathVariable String id) {
        MonitorInfo monitorInfo = monitorInfoService.getDataById(monitorInfoService.getDataNode(), id);
        if(monitorInfo == null) return null;
        return ResponseEntity.ok(monitorDataService.getByDeviceCode(dataNode, monitorInfo.getCode()));
    }

}
