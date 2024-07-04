package com.johnny.bank.controller.resource.data.base;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.service.resource.dataResource.base.IGeoDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: GeoDataController
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/25 11:06
 * @version: 1.0
 */

public class GeoDataController<T extends IGeoDataService<?>> {

    protected  T igeoDataService;
    protected DataNode dataNode;

    public GeoDataController(T IGeoDataService) {
        this.igeoDataService = IGeoDataService;
        this.dataNode = IGeoDataService.getDataNode();
    }

    protected ResponseEntity<String> deleteById(DataNode dataNode, @RequestParam String id){
        igeoDataService.deleteById(dataNode, id);
        return ResponseEntity.ok(id);
    }

}
