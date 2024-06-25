package com.johnny.bank.repository.resourceRepo.MapRepo;

import com.johnny.bank.model.common.ContourTileBox;
import com.johnny.bank.model.common.DepthLineTileBox;
import com.johnny.bank.model.common.SimpleBboxInfo;
import com.johnny.bank.model.common.TileBox;
import com.johnny.bank.model.resource.dataResource.SectionLineInfo;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@Repository("VectorTileRepo")
public interface IVectorTileRepo {

    Object getVectorTile(TileBox tileBox);
    Object getVectorCenterPtTile(TileBox tileBox);
    Object getVectorGeomCenterPtTile(TileBox tileBox);

    Object getContourVectorTile(ContourTileBox contourTileBox);

    Object getDepthLineVectorTile(DepthLineTileBox depthLineTileBox);

    @MapKey("id")
    List<Map<String, Object>> getLayerBasicInfo(@Param("tableName") String tableName, @Param("fieldList") List<String> fieldList);
    @MapKey("id")
    List<Map<String, Object>> getLayerWholeInfo(@Param("tableName") String tableName, @Param("fieldList") List<String> fieldList);

//    @MapKey("id")
    Object getLayerBboxInfoById(@Param("tableName") String tableName, @Param("fieldList") List<String> fieldList, @Param("id") String id);
    @MapKey("id")
    List<Map<String, Object>> getRiverLinkedLayerWholeInfo(@Param("tableName") String tableName);
    @MapKey("id")
    Map<String, Object> getRiverLinkedLayerWholeInfoById(@Param("tableName") String tableName, @Param("id") String id);
    @MapKey("id")
    SimpleBboxInfo getRiverLinkedLayerWholeInfoByIdWithRad(@Param("tableName") String tableName, @Param("id") String id, @Param("bufferRad") Integer bufferRad);
    @MapKey("id")
    SimpleBboxInfo getRiverLayerWholeInfoByIdWithRad(@Param("tableName") String tableName, @Param("id") String id, @Param("bufferRad") Integer bufferRad);

    List<SectionLineInfo> selectSectionLineInfo();

    SectionLineInfo selectSectionLineInfoById(Integer id);
    SectionLineInfo selectLongSectionLineInfoById(Integer id);
}
