package com.johnny.bank.model.resource.dataResource.base;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * @Author: Johnny Tang
 * @Date: 2024/7/3
 * @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MonitorDataQueryParam {
    String tableName;
    Integer precedentNum;
    String stationCode;
    String deviceId;
    Timestamp begTime;
    Timestamp endTime;
    Integer rowLimit;
    Integer type;
}
