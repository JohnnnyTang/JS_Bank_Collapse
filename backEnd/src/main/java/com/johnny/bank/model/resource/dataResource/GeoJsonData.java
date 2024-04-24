package com.johnny.bank.model.resource.dataResource;

import com.johnny.bank.model.resource.dataResource.base.GeoData;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: GeoJsonData
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/24 15:05
 * @version: 1.0
 */

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class GeoJsonData extends GeoData {
    @Builder(builderMethodName = "geojsonBuilder")
    public GeoJsonData(@NotNull String id, @NotNull String name,
                      @NotNull String type, @NotNull String path,
                      String createTime, String updateTime) {
        super(id, name, type, path, createTime, updateTime);
    }
}
