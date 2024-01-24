package com.johnny.bank.model.resource.dataResource.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
@Data
@Builder(builderMethodName = "staticInfoBuilder")
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StaticInfoData {
    private String code; // id
    private String operateUser;
    private Timestamp operateTime; // operate time || in time
    private int operateFlag;
    private String operateDesc;
}
