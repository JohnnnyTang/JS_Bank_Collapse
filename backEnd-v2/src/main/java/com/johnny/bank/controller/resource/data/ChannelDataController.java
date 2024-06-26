package com.johnny.bank.controller.resource.data;

import com.johnny.bank.model.resource.dataResource.ChannelData;
import com.johnny.bank.service.resource.data.impl.ChannelDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.controller.resource.data
 * @className: ChannelDataController
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/22 11:39
 * @version: 1.0
 */
@RestController
@RequestMapping("api/v1/data/channel")
@Slf4j
public class ChannelDataController {
    private final ChannelDataService ChannelDataService;

    @Autowired
    public ChannelDataController(ChannelDataService ChannelDataService) {
        this.ChannelDataService = ChannelDataService;
    }

    @GetMapping
    public ResponseEntity<List<ChannelData>> findAll() {
        return ResponseEntity.ok(ChannelDataService.findAll());
    }
}
