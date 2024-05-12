package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import lombok.*;

import java.sql.Timestamp;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: InclinometerData
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/25 11:20
 * @version: 1.0
 */
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InclinometerData extends MonitorData {
    private Double topMove;
    private Double middleMove;
    private Double bottomMove;
    private Double topMovePerDay;
    private Double middleMovePerDay;
    private Double bottomMovePerDay;
    private Double topMoveAvg;
    private Double middleMoveAvg;
    private Double bottomMoveAvg;

    @Builder(builderMethodName = "inclinometerDataBuilder")
    public InclinometerData(
            String stationId, String deviceId, String deviceCode,
            Timestamp measureTime, Timestamp updateTime,
            Double topMove, Double middleMove, Double bottomMove,
            Double topMovePerDay, Double middleMovePerDay, Double bottomMovePerDay,
            Double topMoveAvg, Double middleMoveAvg, Double bottomMoveAvg) {
        super(stationId, deviceId, deviceCode, measureTime, updateTime);
        this.topMove = topMove;
        this.middleMove = middleMove;
        this.bottomMove = bottomMove;
        this.topMovePerDay = topMovePerDay;
        this.middleMovePerDay = middleMovePerDay;
        this.bottomMovePerDay = bottomMovePerDay;
    }
}
