package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/5/7
 * @Description:
 */
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class VectorTileSource {
    String tileName;
    String tableName;
    List<String> fieldList;
    int activeStatus;
    String memo;
}
