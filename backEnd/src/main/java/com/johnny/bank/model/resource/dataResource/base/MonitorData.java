package com.johnny.bank.model.resource.dataResource.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description:
 */
@Data
@Builder(builderMethodName = "monitorDataBuilder")
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MonitorData {
    private int stationCode;
    private int deviceCode;
    private Timestamp measureTime;
    private Timestamp updateTime;
}
