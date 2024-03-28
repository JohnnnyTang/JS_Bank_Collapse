package com.johnny.bank.repository.resourceRepo.MapRepo;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@Repository("RasterTileRepo")
@Slf4j
public class IRasterTileRepo {

    @Value("${mzsTilePath}")
    String mzsRasterPath;

    public byte[] getMXSRasterFile(String tilePath) throws Exception {
        String fullPath = mzsRasterPath + tilePath;
        File file = new File(fullPath);
        if(!file.exists()) {
            fullPath = mzsRasterPath + "blank.png";
        }
//        System.out.println(mzsRasterPath);
        try (FileInputStream in = new FileInputStream(fullPath)){
            return IOUtils.toByteArray(in);
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }
}
