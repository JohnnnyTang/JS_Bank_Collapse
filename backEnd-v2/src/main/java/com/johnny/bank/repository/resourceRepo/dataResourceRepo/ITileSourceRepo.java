package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import com.johnny.bank.model.resource.dataResource.VectorTileSource;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/5/7
 * @Description:
 */
@Repository("TileSourceRepo")
public interface ITileSourceRepo {
    List<VectorTileSource> getAllTileSource();

    VectorTileSource getSourceByTileName(String tileName);

    void insertTileSource(VectorTileSource vectorTileSource);
}
