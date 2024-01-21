package com.johnny.bank.model.resource.dataResource.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;

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
    private String uid;
    private int code;
    private String name;
    private int type;
    private double lng;
    private double lat;
    private double baseHeight;
    private String operateUser;
    private Timestamp operateTime;
    private LocalDate beginDate;
    private LocalDate endDate;
    private int operateFlag;
    private String operateDesc;
}
