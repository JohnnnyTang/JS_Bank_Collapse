package com.johnny.bank.service.resource.map.impl;

import com.alibaba.fastjson2.JSONArray;
import com.johnny.bank.model.common.TileBox;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.resource.dataResource.VectorTileSource;
import com.johnny.bank.repository.resourceRepo.MapRepo.IVectorTileRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.ITileSourceRepo;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.resource.map.IVectorTileServiceV2;
import com.johnny.bank.utils.TileUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    private final DataNodeServiceV2 dataNodeService;

    @Autowired
    public VectorTileServiceV2(
            @Qualifier("VectorTileRepo") IVectorTileRepo vectorTileRepo,
            @Qualifier("TileSourceRepo") ITileSourceRepo tileSourceRepo,
            @Qualifier("DataNodeServiceV2") DataNodeServiceV2 dataNodeService) {
        this.tileSourceRepo = tileSourceRepo;
        this.vectorTileRepo = vectorTileRepo;
        this.dataNodeService = dataNodeService;
    }

    @Override
    public byte[] getVectorTiles(String bank, String visualId, int x, int y, int z) {
        DataNodeV2 vectorDataNode = dataNodeService.getDataNodeByCategoryBankName("VectorDataItem", bank, visualId);
        if(vectorDataNode == null) return null;
        String tableName = vectorDataNode.getUsage().getString("tableName");
        JSONArray fieldsArray = vectorDataNode.getBasicInfo().getJSONArray("fields");
        List<String> mapFields = new ArrayList<>();
        for (int i = 0; i < fieldsArray.size(); i++) {
            mapFields.add(fieldsArray.getString(i));
        }
        TileBox tileBox = TileUtil.tile2boundingBox(
                x, y, z,
                tableName, mapFields
        );
        return (byte[]) vectorTileRepo.getVectorTile(tileBox);
    }

}
