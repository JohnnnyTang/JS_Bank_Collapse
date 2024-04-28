package com.johnny.bank.controller.resource.data;

import com.johnny.bank.controller.resource.data.base.AbstractMonitorDataController;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.DeviceWarning;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import com.johnny.bank.service.resource.data.impl.DeviceWarningService;
import com.johnny.bank.service.resource.data.impl.MonitorDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
@RestController
@RequestMapping("api/v1/data/deviceWarn")
public class DeviceWarningController {

    private final DeviceWarningService deviceWarningService;
//    private final MonitorInfoService monitorInfoService;


    public DeviceWarningController(DeviceWarningService deviceWarningService) {
        this.deviceWarningService = deviceWarningService;
    }

    @GetMapping("/time")
    public ResponseEntity<List<DeviceWarning>> getDataByTime(@RequestParam Timestamp begTime, @RequestParam Timestamp endTime) {
        return ResponseEntity.ok(deviceWarningService.getDataByTime(begTime, endTime));
    }

    @GetMapping("/minute/{minutes}")
    public ResponseEntity<List<DeviceWarning>> getDataByMin(@PathVariable int minutes) {
        return ResponseEntity.ok(deviceWarningService.getDataByMin(minutes));
    }

    @GetMapping("/hour/{hours}")
    public ResponseEntity<List<DeviceWarning>> getDataByHour(@PathVariable int hours) {
        return ResponseEntity.ok(deviceWarningService.getDataByHour(hours));
    }

    @GetMapping("/day/{days}")
    public ResponseEntity<List<DeviceWarning>> getDataByDay(@PathVariable int days) {
        return ResponseEntity.ok(deviceWarningService.getDataByDay(days));
    }

    @GetMapping("/time/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByTimeOfDevice(@RequestParam Timestamp begTime,@RequestParam Timestamp endTime,@PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByTimeOfDevice(begTime, endTime, deviceCode));
    }

    @GetMapping("/minute/{minutes}/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByMinOfDevice(@PathVariable int minutes,@PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByMinOfDevice(minutes, deviceCode));
    }
    
    @GetMapping("/hour/{hours}/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByHourOfDevice(@PathVariable int hours, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByHourOfDevice(hours, deviceCode));
    }

    @GetMapping("/day/{days}/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByDayOfDevice(@PathVariable int days, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByDayOfDevice(days, deviceCode));
    }

    
    @GetMapping("/minute/beg/{minutesBefore}/dur/{minutesDur}/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByMinBeforeBegOfDevice(@PathVariable int minutesBefore, @PathVariable int minutesDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByMinBeforeStartOfDevice(minutesBefore, minutesDur, deviceCode));
    }

    
    @GetMapping("/hour/beg/{hoursBefore}/dur/{hoursDur}/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByHourBeforeBegOfDevice(@PathVariable int hoursBefore, @PathVariable int hoursDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByHourBeforeStartOfDevice(hoursBefore, hoursDur, deviceCode));
    }

    
    @GetMapping("/day/beg/{daysBefore}/dur/{daysDur}/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByDayBeforeBegOfDevice(@PathVariable int daysBefore, @PathVariable int daysDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByDayBeforeStartOfDevice(daysBefore, daysDur, deviceCode));
    }

    
    @GetMapping
    public ResponseEntity<List<DeviceWarning>> getAll() {
        return ResponseEntity.ok(deviceWarningService.getAll());
    }

    
    @GetMapping("/newest")
    public ResponseEntity<DeviceWarning> getNewestData() {
        return ResponseEntity.ok(deviceWarningService.getNewestData());
    }

    
    @GetMapping("/newest/device/{deviceCode}")
    public ResponseEntity<DeviceWarning> getNewestDataOfDevice(@PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getNewestDataOfDevice(deviceCode));
    }

    
    @GetMapping("/count")
    public ResponseEntity<Integer> getTotalCount() {
        return ResponseEntity.ok(deviceWarningService.getTotalCount());
    }


    @GetMapping("/count/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalCountOfDevice(@PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getTotalCountOfDevice(deviceCode));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<List<DeviceWarning>> getDataByMonitorId(@PathVariable String id) {
//        MonitorInfo monitorInfo = monitorInfoService.getDataById(monitorInfoService.getDataNode(), id);
//        if(monitorInfo == null) return null;
        return ResponseEntity.ok(deviceWarningService.getByDeviceCode(id));
    }

}
