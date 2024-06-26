package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.resource.dataResource.base.MonitorData;
import lombok.*;

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
public class StressPileData extends MonitorData {
    private Double topAngle;
    private Double middleAngle;
    private Double bottomAngle;
    private Double topPower;
    private Double middlePower;
    private Double bottomPower;
    private Double topChange;
    private Double middleChange;
    private Double bottomChange;
    private Double topChangeAvg;
    private Double middleChangeAvg;
    private Double bottomChangeAvg;
}
