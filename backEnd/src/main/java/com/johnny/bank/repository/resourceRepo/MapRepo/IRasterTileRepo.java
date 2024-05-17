package com.johnny.bank.repository.resourceRepo.MapRepo;

import com.johnny.bank.model.configuration.TilePath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.FileInputStream;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@Repository("RasterTileRepo")
@Slf4j
public class IRasterTileRepo {

    private final TilePath tilePathConfig;

    @Autowired
    public IRasterTileRepo(TilePath tilePath) {
        this.tilePathConfig = tilePath;
    }

    private byte[] getRasterDataAsByteArray(String fullPath) throws Exception {
        File file = new File(fullPath);
        if(!file.exists()) {
            fullPath = tilePathConfig.getMzsTilePath() + "blank.png";
        }
//        System.out.println(mzsRasterPath);
        try (FileInputStream in = new FileInputStream(fullPath)){
            return IOUtils.toByteArray(in);
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }


    public byte[] getMXSRasterFile(String tilePath) throws Exception {
        String fullPath = tilePathConfig.getMzsTilePath() + tilePath;
//        File file = new File(fullPath);
//        if(!file.exists()) {
//            fullPath = tilePathConfig.getMzsTilePath() + "blank.png";
//        }
////        System.out.println(mzsRasterPath);
//        try (FileInputStream in = new FileInputStream(fullPath)){
//            return IOUtils.toByteArray(in);
//        } catch (Exception e) {
//            log.info(e.getMessage());
//            throw new Exception(e.getMessage());
//        }
        return  getRasterDataAsByteArray(fullPath);
    }

    public byte[] getRiverRasterFile(String tilePath) throws Exception {
        String fullPath = tilePathConfig.getRiverTilePath() + tilePath;
        return  getRasterDataAsByteArray(fullPath);
    }

    public byte[] getMzsFloodRasterFile(String tilePath) throws Exception {
        String fullPath = tilePathConfig.getMzsTilePath() + "floodTile/" + tilePath;
        return  getRasterDataAsByteArray(fullPath);
    }
}
