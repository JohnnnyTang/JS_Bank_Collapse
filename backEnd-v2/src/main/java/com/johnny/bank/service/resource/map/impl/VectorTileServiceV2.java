package com.johnny.bank.service.resource.map.impl;

import com.johnny.bank.model.common.TileBox;
import com.johnny.bank.model.resource.dataResource.VectorTileSource;
import com.johnny.bank.repository.resourceRepo.MapRepo.IVectorTileRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.ITileSourceRepo;
import com.johnny.bank.service.resource.map.IVectorTileServiceV2;
import com.johnny.bank.utils.TileUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/9/6 10:01
 * @Description:
 */

@Service("VectorTileServiceV2")
@Slf4j
public class VectorTileServiceV2 implements IVectorTileServiceV2 {

    private final IVectorTileRepo vectorTileRepo;
    private final ITileSourceRepo tileSourceRepo;

    @Autowired
    public VectorTileServiceV2(
            @Qualifier("VectorTileRepo") IVectorTileRepo vectorTileRepo,
            @Qualifier("TileSourceRepo") ITileSourceRepo tileSourceRepo) {
        this.tileSourceRepo = tileSourceRepo;
        this.vectorTileRepo = vectorTileRepo;
    }

    @Override
    public byte[] getVectorTiles(String bank, String visualId, int x, int y, int z) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(visualId);
        if(vectorTileSource == null) return null;
//        if(!tableNameMap.containsKey(visualId)) return null;

        TileBox tileBox = TileUtil.tile2boundingBox(
                x, y, z,
                vectorTileSource.getTableName(), vectorTileSource.getMapField()
        );
        return (byte[]) vectorTileRepo.getVectorTile(tileBox);
    }

}
