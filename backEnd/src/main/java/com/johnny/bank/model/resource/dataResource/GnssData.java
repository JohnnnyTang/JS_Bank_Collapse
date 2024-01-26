package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import lombok.*;

import java.sql.Timestamp;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/28
 * @Description:
 */
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GnssData extends MonitorData {
    private double xMove;
    private double yMove;
    private double zMove;

    @Builder(builderMethodName = "gnssDataBuilder")
    public GnssData(
            String stationId, String deviceId, String deviceCode,
            Timestamp measureTime, Timestamp updateTime,
            double x, double y, double z) {
        super(stationId, deviceId, deviceCode, measureTime, updateTime);
        this.xMove = x;
        this.yMove = y;
        this.zMove = z;
    }
}
