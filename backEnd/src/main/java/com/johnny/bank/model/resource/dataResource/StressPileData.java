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
    private Double horizontal1;
    private Double horizontal2;
    private Double horizontal3;
    private Double horizontal4;
    private Double horizontal5;
    private Double horizontal6;
    private Double horizontal_stress1;
    private Double horizontal_stress2;
    private Double horizontal_stress3;
    private Double horizontal_stress4;
    private Double horizontal_stress5;
    private Double horizontal_stress6;
    private Double vertical_stress1;
    private Double vertical_stress2;
    private Double vertical_stress3;
    private Double vertical_stress4;
    private Double vertical_stress5;
    private Double vertical_stress6;
}
