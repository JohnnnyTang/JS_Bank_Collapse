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
public class ManometerData extends MonitorData {
    private Double pressure1;
    private Double pressure2;
    private Double pressure3;
    private Double pressure4;
    private Double pressure5;
    private Double pressure6;
}
