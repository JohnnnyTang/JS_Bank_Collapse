package com.johnny.bank.service.resource.map.impl;

import com.johnny.bank.model.common.ContourTileBox;
import com.johnny.bank.model.common.DepthLineTileBox;
import com.johnny.bank.model.common.TileBox;
import com.johnny.bank.repository.resourceRepo.MapRepo.IVectorTileRepo;
import com.johnny.bank.service.resource.map.IVectorTileService;
import com.johnny.bank.utils.TileUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@Service
@Slf4j
public class VectorTileService implements IVectorTileService {

    private final IVectorTileRepo IVectorTileRepo;
    private final Map<String, String> tableNameMap = Map.of(
            "placeLabel", "place_label_pt", "riverBg", "river_bg_vec",
            "riverLand", "river_land", "riverSection", "river_section_label"
    );

    @Autowired
    public VectorTileService(@Qualifier("VectorTileRepo") IVectorTileRepo IVectorTileRepo) {
        this.IVectorTileRepo = IVectorTileRepo;
    }

    @Override
    public byte[] getVectorTiles(String visualId, int x, int y, int z) {
        if(!tableNameMap.containsKey(visualId)) return null;

        TileBox tileBox = TileUtil.tile2boundingBox(x, y, z, tableNameMap.get(visualId));
        return (byte[]) IVectorTileRepo.getVectorTile(tileBox);
    }

    @Override
    public byte[] getContourVectorTiles(int x, int y, int z, String year, String tide) {
        ContourTileBox tileBox = new ContourTileBox(TileUtil.tile2boundingBox(x, y, z, "mzs_contour"), year, tide);
        return (byte[]) IVectorTileRepo.getContourVectorTile(tileBox);
    }

    @Override
    public byte[] getDepthLineVectorTiles(int x, int y, int z, String year) {
        DepthLineTileBox depthLineTileBox = new DepthLineTileBox(TileUtil.tile2boundingBox(x, y, z, "depth_line"), year);
        return (byte[]) IVectorTileRepo.getDepthLineVectorTile(depthLineTileBox);
    }
}
