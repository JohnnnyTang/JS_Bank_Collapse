package com.johnny.bank.controller.resource.dataSource.base;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import com.johnny.bank.service.resource.dataSource.impl.MonitorDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
//@RestController
public class BaseMonitorDataController<T extends MonitorData> extends AbstractMonitorDataController<T> {

    private final MonitorDataService<T> monitorDataService;
//    private final MonitorInfoService monitorInfoService;
    private final DataNode dataNode;


    public BaseMonitorDataController(MonitorDataService<T> MonitorDataService) {
        this.monitorDataService = MonitorDataService;
//        this.monitorInfoService = monitorInfoService;
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
    public ResponseEntity<List<T>> getDataByTimeOfDevice(@RequestParam Timestamp begTime,@RequestParam Timestamp endTime,@PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByTimeOfDevice(dataNode, begTime, endTime, deviceCode));
    }

    @Override
    @GetMapping("/minute/{minutes}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByMinOfDevice(@PathVariable int minutes,@PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByMinOfDevice(dataNode, minutes, deviceCode));
    }

    @Override
    @GetMapping("/hour/{hours}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByHourOfDevice(@PathVariable int hours, @PathVariable String deviceCode) {
        List<T> list = monitorDataService.getDataByHourOfDevice(dataNode, hours, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByHourOfDevice(dataNode, hours, deviceCode));
    }

    @Override
    @GetMapping("/day/{days}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByDayOfDevice(@PathVariable int days, @PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByDayOfDevice(dataNode, days, deviceCode));
    }

    @Override
    @GetMapping("/minute/beg/{minutesBefore}/dur/{minutesDur}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByMinBeforeBegOfDevice(@PathVariable int minutesBefore, @PathVariable int minutesDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByMinBeforeStartOfDevice(dataNode, minutesBefore, minutesDur, deviceCode));
    }

    @Override
    @GetMapping("/hour/beg/{hoursBefore}/dur/{hoursDur}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByHourBeforeBegOfDevice(@PathVariable int hoursBefore, @PathVariable int hoursDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByHourBeforeStartOfDevice(dataNode, hoursBefore, hoursDur, deviceCode));
    }

    @Override
    @GetMapping("/day/beg/{daysBefore}/dur/{daysDur}/device/{deviceCode}")
    public ResponseEntity<List<T>> getDataByDayBeforeBegOfDevice(@PathVariable int daysBefore, @PathVariable int daysDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getDataByDayBeforeStartOfDevice(dataNode, daysBefore, daysDur, deviceCode));
    }

    @Override
    @GetMapping("/time/station/{stationCode}")
    public ResponseEntity<List<T>> getDataByTimeInStation(@RequestParam Timestamp begTime,@RequestParam  Timestamp endTime, @PathVariable String stationCode) {
        return ResponseEntity.ok(monitorDataService.getDataByTimeInStation(dataNode, begTime, endTime, stationCode));
    }

    @Override
    @GetMapping("/minute/{minutes}/station/{stationCode}")
    public ResponseEntity<List<T>> getDataByMinInStation(@PathVariable int minutes, @PathVariable String stationCode) {
        return ResponseEntity.ok(monitorDataService.getDataByMinInStation(dataNode, minutes, stationCode));
    }

    @Override
    @GetMapping("/hour/{hours}/station/{stationCode}")
    public ResponseEntity<List<T>> getDataByHourInStation(@PathVariable int hours, @PathVariable String stationCode) {
        return ResponseEntity.ok(monitorDataService.getDataByHourInStation(dataNode, hours, stationCode));
    }

    @Override
    @GetMapping("/day/{days}/station/{stationCode}")
    public ResponseEntity<List<T>> getDataByDayInStation(@PathVariable int days, @PathVariable String stationCode) {
        return ResponseEntity.ok(monitorDataService.getDataByDayInStation(dataNode, days, stationCode));
    }

    @Override
    @GetMapping
    public ResponseEntity<List<T>> getAll() {
        return ResponseEntity.ok(monitorDataService.getAll(dataNode));
    }

    @Override
    @GetMapping("/station/{stationCode}")
    public ResponseEntity<List<T>> getByStationCode(@PathVariable String stationCode) {
        return ResponseEntity.ok(monitorDataService.getByStationCode(dataNode, stationCode));
    }

    @Override
    @GetMapping("/device/{deviceCode}")
    public ResponseEntity<List<T>> getByDeviceCode(@PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getByDeviceCode(dataNode, deviceCode));
    }

    @Override
    @GetMapping("/newest")
    public ResponseEntity<T> getNewestData() {
        return ResponseEntity.ok(monitorDataService.getNewestData(dataNode));
    }

    @Override
    @GetMapping("/newest/station/{stationCode}")
    public ResponseEntity<T> getNewestDataInStation(@PathVariable String stationCode) {
        return ResponseEntity.ok(monitorDataService.getNewestDataInStation(dataNode, stationCode));
    }

    @Override
    @GetMapping("/newest/device/{deviceCode}")
    public ResponseEntity<T> getNewestDataOfDevice(@PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getNewestDataOfDevice(dataNode, deviceCode));
    }

    @Override
    @GetMapping("/count")
    public ResponseEntity<Integer> getTotalCount() {
        return ResponseEntity.ok(monitorDataService.getTotalCount(dataNode));
    }

    @Override
    @GetMapping("/count/station/{stationCode}")
    public ResponseEntity<Integer> getTotalCountInStation(@PathVariable String stationCode) {
        return ResponseEntity.ok(monitorDataService.getTotalCountInStation(dataNode, stationCode));
    }

    @Override
    @GetMapping("/count/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalCountOfDevice(@PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.getTotalCountOfDevice(dataNode, deviceCode));
    }

    @Override
    @GetMapping("/checkDevice/{timeLimit}/{deviceCode}")
    public ResponseEntity<Boolean> checkContinueUpdateOfDevice(@PathVariable int timeLimit, @PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.checkContinueUpdateOfDevice(dataNode, timeLimit, deviceCode));
    }

    @Override
    @GetMapping("/checkDevice/minute/{timeInMinute}/{deviceCode}")
    public ResponseEntity<Boolean> checkContinueUpdateOfDeviceWithMinute(@PathVariable int timeInMinute, @PathVariable String deviceCode) {
        return ResponseEntity.ok(monitorDataService.checkContinueUpdateOfDeviceWithMinute(dataNode, timeInMinute, deviceCode));
    }

    @Override
    @GetMapping("/checkStation/{timeLimit}/{stationCode}")
    public ResponseEntity<Boolean> checkContinueUpdateInStation(@PathVariable int timeLimit, @PathVariable String stationCode) {
        return ResponseEntity.ok(monitorDataService.checkContinueUpdateInStation(dataNode, timeLimit, stationCode));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<List<T>> getDataByMonitorId(@PathVariable String id) {
//        MonitorInfo monitorInfo = monitorInfoService.getDataById(monitorInfoService.getDataNode(), id);
//        if(monitorInfo == null) return null;
        return ResponseEntity.ok(monitorDataService.getByDeviceCode(dataNode, id));
    }

}
