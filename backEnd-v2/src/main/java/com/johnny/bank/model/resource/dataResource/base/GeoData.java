package com.johnny.bank.model.resource.dataResource.base;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import nonapi.io.github.classgraph.json.Id;

import java.sql.Timestamp;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: GeoData
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/24 14:48
 * @version: 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GeoData {
    @Id
    @NotNull
    String id;
    @NotNull
    String name;
    @NotNull
    String type; // 数据类型
    @NotNull
    String path; // 数据路径
    Timestamp createTime;
    Timestamp updateTime;
}