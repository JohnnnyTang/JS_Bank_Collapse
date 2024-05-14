package com.johnny.bank.model.resource.dataResource;

import com.johnny.bank.model.resource.dataResource.base.GeoData;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.sql.Timestamp;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: ShpData
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/24 14:51
 * @version: 1.0
 */

public class ShpData extends GeoData {

    @Builder(builderMethodName = "shpBuilder")
    public ShpData(@NotNull String id, @NotNull String name,
                   @NotNull String type, @NotNull String path,
                   Timestamp createTime, Timestamp updateTime) {
        super(id, name, type, path, createTime, updateTime);
    }
}
