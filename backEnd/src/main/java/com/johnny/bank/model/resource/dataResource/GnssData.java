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
    private double x;
    private double y;
    private double z;

    @Builder(builderMethodName = "gnssDataBuilder")
    public GnssData(
            int stationCode, int deviceCode, Timestamp measureTime, Timestamp updateTime,
            double x, double y, double z) {
        super(stationCode, deviceCode, measureTime, updateTime);
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
