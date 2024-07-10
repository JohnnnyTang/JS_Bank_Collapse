package com.johnny.bank.controller.manage;

import com.johnny.bank.utils.DataNodeSyncUtilV2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/7/2
 * @Description:
 */
@RestController
@RequestMapping("api/v2/dataNode")
@Slf4j
public class DataNodeManageController {

    @GetMapping("/syncDevice")
    public ResponseEntity<List<Integer>> SyncDevice2DataNode() {
        List<Integer> res = DataNodeSyncUtilV2.SyncMonitorNodeOfTreeAndOrigin("Mzs");
        return ResponseEntity.ok(res);
    }

}
