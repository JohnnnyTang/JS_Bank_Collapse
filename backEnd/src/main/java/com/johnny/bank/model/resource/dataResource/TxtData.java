package com.johnny.bank.model.resource.dataResource;

import com.johnny.bank.model.resource.dataResource.base.GeoData;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: TxtData
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/28 22:49
 * @version: 1.0
 */


public class TxtData extends GeoData {
    @Builder(builderMethodName = "txtBuilder")
    public TxtData(@NotNull String id, @NotNull String name,
                   @NotNull String type, @NotNull String path,
                   String createTime, String updateTime) {
        super(id, name, type, path, createTime, updateTime);
    }
}
