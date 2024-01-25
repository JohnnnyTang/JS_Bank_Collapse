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
public class InclinometerData extends MonitorData {
    private Double xMove1;
    private Double yMove1;
    private Double xMove2;
    private Double yMove2;
    private Double xMove3;
    private Double yMove3;
    private Double xMove4;
    private Double yMove4;
    private Double xMove5;
    private Double yMove5;
    private Double xMove6;
    private Double yMove6;
}
