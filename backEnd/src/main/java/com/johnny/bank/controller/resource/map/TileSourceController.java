package com.johnny.bank.controller.resource.map;

import com.johnny.bank.model.resource.dataResource.VectorTileSource;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.ITileSourceRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @Author: Johnny Tang
 * @Date: 2024/5/7
 * @Description:
 */
@RestController
@RequestMapping("api/v1/tileSource")
@Slf4j
public class TileSourceController {

    private final ITileSourceRepo ITileSourceRepo;

    public TileSourceController(@Qualifier("TileSourceRepo") ITileSourceRepo ITileSourceRepo) {
        this.ITileSourceRepo = ITileSourceRepo;
    }

    @PostMapping
    public ResponseEntity<Boolean> addTileSource(@RequestBody VectorTileSource vectorTileSource) {
        ITileSourceRepo.insertTileSource(vectorTileSource);
        return ResponseEntity.ok(true);
    }
}
