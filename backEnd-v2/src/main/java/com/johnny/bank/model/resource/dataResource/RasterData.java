package com.johnny.bank.model.resource.dataResource;

import com.johnny.bank.model.resource.dataResource.base.GeoData;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.sql.Timestamp;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: RasterData
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/24 15:04
 * @version: 1.0
 */

public class RasterData extends GeoData {
    @Builder(builderMethodName = "rasterBuilder")
    public RasterData(@NotNull String id, @NotNull String name,
                      @NotNull String type, @NotNull String path,
                      Timestamp createTime, Timestamp updateTime) {
        super(id, name, type, path, createTime, updateTime);
    }
}
