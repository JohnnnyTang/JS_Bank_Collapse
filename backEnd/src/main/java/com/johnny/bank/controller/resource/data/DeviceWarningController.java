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
//    @GetMapping("/warn/hour/{hours}")
//    public ResponseEntity<List<DeviceWarning>> getWarnDataByHour(@PathVariable int hours) {
//        return ResponseEntity.ok(deviceWarningService.getDataByHour(hours));
//    }
//    @GetMapping("/danger/hour/{hours}")
//    public ResponseEntity<List<DeviceWarning>> getDangerDataByHour(@PathVariable int hours) {
//        return ResponseEntity.ok(deviceWarningService.getDataByHour(hours));
//    }

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
    @GetMapping("/count/minute/beg/{minutesBefore}/dur/{minutesDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getCountByMinBeforeBegOfDevice(@PathVariable int minutesBefore, @PathVariable int minutesDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getCountByMinBeforeStartOfDevice(minutesBefore, minutesDur, deviceCode));
    }
    @GetMapping("/count/warn/minute/beg/{minutesBefore}/dur/{minutesDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getWarnCountByMinBeforeBegOfDevice(@PathVariable int minutesBefore, @PathVariable int minutesDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByMinBeforeStartOfDevice(minutesBefore, minutesDur, deviceCode));
    }
    @GetMapping("/count/danger/minute/beg/{minutesBefore}/dur/{minutesDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getDangerCountByMinBeforeBegOfDevice(@PathVariable int minutesBefore, @PathVariable int minutesDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByMinBeforeStartOfDevice(minutesBefore, minutesDur, deviceCode));
    }

    
    @GetMapping("/hour/beg/{hoursBefore}/dur/{hoursDur}/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByHourBeforeBegOfDevice(@PathVariable int hoursBefore, @PathVariable int hoursDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByHourBeforeStartOfDevice(hoursBefore, hoursDur, deviceCode));
    }
    @GetMapping("/count/hour/beg/{hoursBefore}/dur/{hoursDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getCountByHourBeforeBegOfDevice(@PathVariable int hoursBefore, @PathVariable int hoursDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getCountByHourBeforeStartOfDevice(hoursBefore, hoursDur, deviceCode));
    }
    @GetMapping("/count/warn/hour/beg/{hoursBefore}/dur/{hoursDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getWarnCountByHourBeforeBegOfDevice(@PathVariable int hoursBefore, @PathVariable int hoursDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByHourBeforeStartOfDevice(hoursBefore, hoursDur, deviceCode));
    }
    @GetMapping("/count/danger/hour/beg/{hoursBefore}/dur/{hoursDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getDangerCountByHourBeforeBegOfDevice(@PathVariable int hoursBefore, @PathVariable int hoursDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByHourBeforeStartOfDevice(hoursBefore, hoursDur, deviceCode));
    }

    
    @GetMapping("/day/beg/{daysBefore}/dur/{daysDur}/device/{deviceCode}")
    public ResponseEntity<List<DeviceWarning>> getDataByDayBeforeBegOfDevice(@PathVariable int daysBefore, @PathVariable int daysDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDataByDayBeforeStartOfDevice(daysBefore, daysDur, deviceCode));
    }
    @GetMapping("/count/day/beg/{daysBefore}/dur/{daysDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getCountByDayBeforeBegOfDevice(@PathVariable int daysBefore, @PathVariable int daysDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getCountByDayBeforeStartOfDevice(daysBefore, daysDur, deviceCode));
    }
    @GetMapping("/count/warn/day/beg/{daysBefore}/dur/{daysDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getWarnCountByDayBeforeBegOfDevice(@PathVariable int daysBefore, @PathVariable int daysDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByDayBeforeStartOfDevice(daysBefore, daysDur, deviceCode));
    }
    @GetMapping("/count/danger/day/beg/{daysBefore}/dur/{daysDur}/device/{deviceCode}")
    public ResponseEntity<Integer> getDangerCountByDayBeforeBegOfDevice(@PathVariable int daysBefore, @PathVariable int daysDur, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByDayBeforeStartOfDevice(daysBefore, daysDur, deviceCode));
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

    // total count
    @GetMapping("/count")
    public ResponseEntity<Integer> getTotalCount() {
        return ResponseEntity.ok(deviceWarningService.getTotalCount());
    }
    @GetMapping("/warn/count")
    public ResponseEntity<Integer> getTotalWarnCount() {
        return ResponseEntity.ok(deviceWarningService.getTotalWarnCount());
    }
    @GetMapping("/danger/count")
    public ResponseEntity<Integer> getTotalDangerCount() {
        return ResponseEntity.ok(deviceWarningService.getTotalDangerCount());
    }
    // minutes count
    @GetMapping("/count/min/{minutes}")
    public ResponseEntity<Integer> getTotalCountByMin(@PathVariable int minutes) {
        return ResponseEntity.ok(deviceWarningService.getCountByMin(minutes));
    }
    @GetMapping("/warn/count/min/{minutes}")
    public ResponseEntity<Integer> getTotalWarnCountByMin(@PathVariable int minutes) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByMin(minutes));
    }
    @GetMapping("/danger/count/min/{minutes}")
    public ResponseEntity<Integer> getTotalDangerCountByMin(@PathVariable int minutes) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByMin(minutes));
    }
    // hour count
    @GetMapping("/count/hour/{hours}")
    public ResponseEntity<Integer> getTotalCountByHour(@PathVariable int hours) {
        return ResponseEntity.ok(deviceWarningService.getCountByHour(hours));
    }
    @GetMapping("/warn/count/hour/{hours}")
    public ResponseEntity<Integer> getTotalWarnCountByHour(@PathVariable int hours) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByHour(hours));
    }
    @GetMapping("/danger/count/hour/{hours}")
    public ResponseEntity<Integer> getTotalDangerCountByHour(@PathVariable int hours) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByHour(hours));
    }
    // day count
    @GetMapping("/count/day/{days}")
    public ResponseEntity<Integer> getTotalCountByDay(@PathVariable int days) {
        return ResponseEntity.ok(deviceWarningService.getCountByDay(days));
    }
    @GetMapping("/warn/count/day/{days}")
    public ResponseEntity<Integer> getTotalWarnCountByDay(@PathVariable int days) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByDay(days));
    }
    @GetMapping("/danger/count/day/{days}")
    public ResponseEntity<Integer> getTotalDangerCountByDay(@PathVariable int days) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByDay(days));
    }
    @GetMapping("/count/minute/beg/{minutesBefore}/dur/{minutesDur}")
    public ResponseEntity<Integer> getCountByMinBeforeStart(@PathVariable int minutesBefore, @PathVariable int minutesDur) {
        return ResponseEntity.ok(deviceWarningService.getCountByMinBeforeStart(minutesBefore, minutesDur));
    }
    @GetMapping("/count/warn/minute/beg/{minutesBefore}/dur/{minutesDur}")
    public ResponseEntity<Integer> getWarnCountByMinBeforeStart(@PathVariable int minutesBefore, @PathVariable int minutesDur) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByMinBeforeStart(minutesBefore, minutesDur));
    }
    @GetMapping("/count/danger/minute/beg/{minutesBefore}/dur/{minutesDur}")
    public ResponseEntity<Integer> getDangerCountByMinBeforeStart(@PathVariable int minutesBefore, @PathVariable int minutesDur) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByMinBeforeStart(minutesBefore, minutesDur));
    }
    //device total count
    @GetMapping("/count/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalCountOfDevice(@PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getTotalCountOfDevice(deviceCode));
    }
    @GetMapping("/warn/count/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalWarnCountOfDevice(@PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getTotalWarnCountOfDevice(deviceCode));
    }
    @GetMapping("/danger/count/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalDangerCountOfDevice(@PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getTotalDangerCountOfDevice(deviceCode));
    }
    // device min count
    @GetMapping("/count/min/{minutes}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalCountByMinOfDevice(@PathVariable int minutes, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getCountByMinOfDevice(minutes, deviceCode));
    }
    @GetMapping("/warn/count/min/{minutes}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalWarnCountByMinOfDevice(@PathVariable int minutes, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByMinOfDevice(minutes, deviceCode));
    }
    @GetMapping("/danger/count/min/{minutes}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalDangerCountByMinOfDevice(@PathVariable int minutes, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByMinOfDevice(minutes, deviceCode));
    }
    // device hour count
    @GetMapping("/count/hour/{hours}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalCountByHourOfDevice(@PathVariable int hours, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getCountByHourOfDevice(hours, deviceCode));
    }
    @GetMapping("/warn/count/hour/{hours}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalWarnCountByHourOfDevice(@PathVariable int hours, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByHourOfDevice(hours, deviceCode));
    }
    @GetMapping("/danger/count/hour/{hours}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalDangerCountByHourOfDevice(@PathVariable int hours, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByHourOfDevice(hours, deviceCode));
    }
    // device day count
    @GetMapping("/count/day/{days}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalCountByDayOfDevice(@PathVariable int days, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getCountByDayOfDevice(days, deviceCode));
    }
    @GetMapping("/warn/count/day/{days}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalWarnCountByDayOfDevice(@PathVariable int days, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getWarnCountByDayOfDevice(days, deviceCode));
    }
    @GetMapping("/danger/count/day/{days}/device/{deviceCode}")
    public ResponseEntity<Integer> getTotalDangerCountByDayOfDevice(@PathVariable int days, @PathVariable String deviceCode) {
        return ResponseEntity.ok(deviceWarningService.getDangerCountByDayOfDevice(days, deviceCode));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<List<DeviceWarning>> getDataByMonitorId(@PathVariable String id) {
//        MonitorInfo monitorInfo = monitorInfoService.getDataById(monitorInfoService.getDataNode(), id);
//        if(monitorInfo == null) return null;
        return ResponseEntity.ok(deviceWarningService.getByDeviceCode(id));
    }

}
