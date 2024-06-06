package com.johnny.bank.service.resource.map.impl;

import com.johnny.bank.model.common.ContourTileBox;
import com.johnny.bank.model.common.DepthLineTileBox;
import com.johnny.bank.model.common.SimpleBboxInfo;
import com.johnny.bank.model.common.TileBox;
import com.johnny.bank.model.resource.dataResource.VectorTileSource;
import com.johnny.bank.repository.resourceRepo.MapRepo.IVectorTileRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.ITileSourceRepo;
import com.johnny.bank.service.resource.map.IVectorTileService;
import com.johnny.bank.utils.TileUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
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
    private final ITileSourceRepo tileSourceRepo;
//    private final Map<String, String> tableNameMap = new HashMap<>(Map.of(
//            "placeLabel", "place_label_pt", "riverBg", "river_bg_vec",
//            "riverLand", "river_land", "riverSection", "river_section_label",
//            "riverName", "river_name_label", "mzsPlaceLabel", "mzs_place_label",
//            "mzsPlaceLine", "mzs_place_line", "mzsBankLabel", "mzs_bank_label",
//            "mzsSectionLine", "mzs_section_line", "mzsBankLine", "mzs_bank_line"
//    ));

    @Autowired
    public VectorTileService(
            @Qualifier("VectorTileRepo") IVectorTileRepo IVectorTileRepo,
            @Qualifier("TileSourceRepo") ITileSourceRepo tileSourceRepo) {
        this.tileSourceRepo = tileSourceRepo;
        this.IVectorTileRepo = IVectorTileRepo;
//        tableNameMap.put("mzsSectionLineLabel", "mzs_section_line_label");
//        tableNameMap.put("mzsBankAreaW", "mzs_bank_area_w");
//        tableNameMap.put("mzsBankAreaS", "mzs_bank_area_s");
//        tableNameMap.put("mzsOverWaterBound", "mzs_overwater_bound");
//        tableNameMap.put("mzsUnderWaterBound", "mzs_underwater_bound");
    }

    @Override
    public byte[] getVectorTiles(String visualId, int x, int y, int z) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(visualId);
        if(vectorTileSource == null) return null;
//        if(!tableNameMap.containsKey(visualId)) return null;

        TileBox tileBox = TileUtil.tile2boundingBox(
                x, y, z,
                vectorTileSource.getTableName(), vectorTileSource.getMapField()
        );
        return (byte[]) IVectorTileRepo.getVectorTile(tileBox);
    }

    public byte[] getVectorCenterPtTiles(String visualId, int x, int y, int z) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(visualId);
        if(vectorTileSource == null) return null;
//        if(!tableNameMap.containsKey(visualId)) return null;

        TileBox tileBox = TileUtil.tile2boundingBox(
                x, y, z,
                vectorTileSource.getTableName(), vectorTileSource.getMapField()
        );
        return (byte[]) IVectorTileRepo.getVectorCenterPtTile(tileBox);
    }

    public byte[] getVectorGeomCenterPtTiles(String visualId, int x, int y, int z) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(visualId);
        if(vectorTileSource == null) return null;
//        if(!tableNameMap.containsKey(visualId)) return null;

        TileBox tileBox = TileUtil.tile2boundingBox(
                x, y, z,
                vectorTileSource.getTableName(), vectorTileSource.getMapField()
        );
        return (byte[]) IVectorTileRepo.getVectorGeomCenterPtTile(tileBox);
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

    public List<Map<String, Object>> getLayerInfo(String tileName) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(tileName);
        return IVectorTileRepo.getLayerBasicInfo(vectorTileSource.getTableName(), vectorTileSource.getBasicField());
    }

    public List<Map<String, Object>> getLayerWholeInfo(String tileName) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(tileName);
        return IVectorTileRepo.getLayerWholeInfo(vectorTileSource.getTableName(), vectorTileSource.getDetailField());
    }

    public Object getLayerBboxInfoById(String tileName, String id) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(tileName);
        return IVectorTileRepo.getLayerBboxInfoById(vectorTileSource.getTableName(), vectorTileSource.getDetailField(), id);
    }

    public List<Map<String, Object>> getLinkedRiverLayerBboxInfo(String tileName) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(tileName);
        return IVectorTileRepo.getRiverLinkedLayerWholeInfo(vectorTileSource.getTableName());
    }

    public Map<String, Object> getLinkedRiverLayerBboxInfoById(String tileName, String id) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(tileName);
        return IVectorTileRepo.getRiverLinkedLayerWholeInfoById(vectorTileSource.getTableName(), id);
    }

    public SimpleBboxInfo getLinkedRiverLayerBboxInfoByIdWithBuffer(String tileName, String id, Integer bufferRad) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(tileName);
        return IVectorTileRepo.getRiverLinkedLayerWholeInfoByIdWithRad(vectorTileSource.getTableName(), id, bufferRad);
    }

    public SimpleBboxInfo getRiverLayerBboxInfoByIdWithBuffer(String tileName, String id, Integer bufferRad) {
        VectorTileSource vectorTileSource = tileSourceRepo.getSourceByTileName(tileName);
        return IVectorTileRepo.getRiverLayerWholeInfoByIdWithRad(vectorTileSource.getTableName(), id, bufferRad);
    }
}
