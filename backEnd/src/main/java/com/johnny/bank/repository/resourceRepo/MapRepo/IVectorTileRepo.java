package com.johnny.bank.repository.resourceRepo.MapRepo;

import com.johnny.bank.model.common.ContourTileBox;
import com.johnny.bank.model.common.DepthLineTileBox;
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

    List<SectionLineInfo> selectSectionLineInfo();

    SectionLineInfo selectSectionLineInfoById(Integer id);
    SectionLineInfo selectLongSectionLineInfoById(Integer id);
}
