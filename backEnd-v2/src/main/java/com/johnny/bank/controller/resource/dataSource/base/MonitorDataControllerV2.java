package com.johnny.bank.controller.resource.dataSource.base;

import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.resource.dataSource.impl.MonitorDataServiceV2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
@RestController
@RequestMapping("api/v2/data/bank/{bank}/monitorData")
public class MonitorDataControllerV2<T extends MonitorData> {
    private final MonitorDataServiceV2<T> monitorDataService;
    private final DataNodeServiceV2 dataNodeService;
    private final Map<String, Integer> timeUnitMap = Map.of(
            "minute", Calendar.MINUTE,
            "hour", Calendar.HOUR,
            "day", Calendar.DATE
    );

    public MonitorDataControllerV2(
            @Qualifier("MonitorDataServiceV2") MonitorDataServiceV2<T> MonitorDataService,
            @Qualifier("DataNodeServiceV2") DataNodeServiceV2 dataNodeServiceV2
    ) {
        this.monitorDataService = MonitorDataService;
        this.dataNodeService = dataNodeServiceV2;
    }

    @GetMapping("/minute/{minutes}/device/{deviceCode}")
    public ResponseEntity<List<? extends MonitorData>> getDataByMinOfDevice(
            @PathVariable String bank, @PathVariable int minutes, @PathVariable String deviceCode
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, Calendar.MINUTE, minutes, 0, null, null
        ));
    }

    @GetMapping()
    public ResponseEntity<List<? extends MonitorData>> getData(
            @PathVariable String bank, @RequestParam String timeUnit,
            @RequestParam String deviceCode, @RequestParam(defaultValue = "0") Integer beg,
            @RequestParam Integer dur, @RequestParam(required = false) Integer precedentNum,
            @RequestParam(required = false) Integer rowLimit
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, timeUnitMap.get(timeUnit), dur, beg, precedentNum, rowLimit
        ));
    }

    @GetMapping("/{timeUnit}/{interval}/device/{deviceCode}")
    public ResponseEntity<List<? extends MonitorData>> getDataByTimeFromNowOfDevice(
            @PathVariable String bank,
            @PathVariable String timeUnit, @PathVariable int interval,
            @PathVariable String deviceCode
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, timeUnitMap.get(timeUnit), interval, 0, null, null
        ));
    }

    @GetMapping("/{timeUnit}/{interval}/device/{deviceCode}/avgNum/{avgNum}")
    public ResponseEntity<List<? extends MonitorData>> getDataByTimeFromNowOfDevice(
            @PathVariable String bank,
            @PathVariable String timeUnit, @PathVariable int interval,
            @PathVariable String deviceCode, @PathVariable Integer avgNum
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, timeUnitMap.get(timeUnit), interval, 0, avgNum, null
        ));
    }

    @GetMapping("/{timeUnit}/beg/{timeBefore}/dur/{interval}/device/{deviceCode}")
    public ResponseEntity<List<? extends MonitorData>> getDataByTimeBeforeNowWithIntervalOfDevice(
            @PathVariable String bank,
            @PathVariable String timeUnit, @PathVariable int timeBefore, @PathVariable int interval,
            @PathVariable String deviceCode
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, timeUnitMap.get(timeUnit), interval, timeBefore, null, null
        ));
    }

    @GetMapping("/{timeUnit}/beg/{timeBefore}/dur/{interval}/device/{deviceCode}/avgNum/{avgNum}")
    public ResponseEntity<List<? extends MonitorData>> getDataByTimeBeforeNowWithIntervalOfDevice(
            @PathVariable String bank,
            @PathVariable String timeUnit, @PathVariable int timeBefore, @PathVariable int interval,
            @PathVariable String deviceCode, @PathVariable Integer avgNum
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, timeUnitMap.get(timeUnit), interval, timeBefore, avgNum, null
        ));
    }

    @GetMapping("/{timeUnit}/beg/{timeBefore}/dur/{interval}/device/{deviceCode}/avgNum/{avgNum}/limit/{limit}")
    public ResponseEntity<List<? extends MonitorData>> getDataByTimeBeforeNowWithIntervalOfDevice(
            @PathVariable String bank,
            @PathVariable String timeUnit, @PathVariable int timeBefore, @PathVariable int interval,
            @PathVariable String deviceCode, @PathVariable Integer avgNum, @PathVariable Integer limit
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, timeUnitMap.get(timeUnit), interval, timeBefore, avgNum, limit
        ));
    }

    @GetMapping("/newest/type/{typeCode}")
    public ResponseEntity<? extends MonitorData> getNewestData(@PathVariable String bank, @PathVariable Character typeCode) {
        DataNodeV2 dataNode = dataNodeService.getDeviceTypeDataNode(typeCode, bank);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, null, null, 0, null, 1
        ).get(0));
    }

    @GetMapping("/newest/device/{deviceCode}")
    public ResponseEntity<? extends MonitorData> getNewestDataOfDevice(
            @PathVariable String bank, @PathVariable String deviceCode
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getDataByTimeInterval(
                dataNode, null, null, 0, null, 1
        ).get(0));
    }

    @GetMapping("/type/{type}/count")
    public ResponseEntity<Integer> getTotalCountOfType(@PathVariable String bank, @PathVariable Character type) {
        DataNodeV2 dataNode = dataNodeService.getDeviceTypeDataNode(type, bank);
        return ResponseEntity.ok(
                monitorDataService.getTotalCount(dataNode)
        );
    }

    @GetMapping("/id/{deviceCode}/count")
    public ResponseEntity<Integer> getTotalCountOfDevice(@PathVariable String bank, @PathVariable String deviceCode) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(monitorDataService.getTotalCountOfDevice(dataNode));
    }

    
    @GetMapping("/checkDevice/{timeUnit}/{timeLimit}/device/{deviceCode}")
    public ResponseEntity<Boolean> checkContinueUpdateOfDevice(
            @PathVariable String bank, @PathVariable String timeUnit,
            @PathVariable int timeLimit, @PathVariable String deviceCode
    ) {
        DataNodeV2 dataNode = dataNodeService.getMonitorItemNode(bank, deviceCode);
        return ResponseEntity.ok(
                monitorDataService.checkContinueUpdateOfDevice(
                        dataNode, timeUnitMap.get(timeUnit), timeLimit, deviceCode
                )
        );
    }
//
//
//    @GetMapping("/checkDevice/minute/{timeInMinute}/{deviceCode}")
//    public ResponseEntity<Boolean> checkContinueUpdateOfDeviceWithMinute(@PathVariable int timeInMinute, @PathVariable String deviceCode) {
//        return ResponseEntity.ok(monitorDataService.checkContinueUpdateOfDeviceWithMinute(dataNode, timeInMinute, deviceCode));
//    }

}
