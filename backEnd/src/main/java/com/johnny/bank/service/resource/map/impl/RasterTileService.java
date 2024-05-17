package com.johnny.bank.service.resource.map.impl;

import com.johnny.bank.repository.resourceRepo.MapRepo.IRasterTileRepo;
import com.johnny.bank.service.resource.map.IRasterTileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/28
 * @Description:
 */
@Service("RasterTileService")
public class RasterTileService implements IRasterTileService {

    private final IRasterTileRepo RasterTileRepo;

    @Autowired
    public RasterTileService(@Qualifier("RasterTileRepo") IRasterTileRepo RasterTileRepo) {
        this.RasterTileRepo = RasterTileRepo;
    }

    @Override
    public byte[] getMXZRasterInByte(String year, String tide, int z, int x, int y) throws Exception {
        String filePath = year + tide + '/' + z + '/' + x + '/' + y + ".png";
        return RasterTileRepo.getMXSRasterFile(filePath);
    }

    public byte[] getRiverRasterInByte(String name, int z, int x, int y) throws Exception {
        String filePath = name + "/tiles/" + z + '/' + x + '/' + y + ".png";
        return RasterTileRepo.getRiverRasterFile(filePath);
    }

    public byte[] getMzsFloodRasterInByte(String name, int z, int x, int y) throws Exception {
        String filePath = name + '/' + z + '/' + x + '/' + y + ".png";
        return RasterTileRepo.getMzsFloodRasterFile(filePath);
    }
}
