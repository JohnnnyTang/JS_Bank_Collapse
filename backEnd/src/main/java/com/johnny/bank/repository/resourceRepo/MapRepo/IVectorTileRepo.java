package com.johnny.bank.repository.resourceRepo.MapRepo;

import com.johnny.bank.model.common.ContourTileBox;
import com.johnny.bank.model.common.TileBox;
import org.springframework.stereotype.Repository;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@Repository("VectorTileRepo")
public interface IVectorTileRepo {
    byte[] getVectorTile(TileBox tileBox);

    Object getContourVectorTile(ContourTileBox contourTileBox);
}
