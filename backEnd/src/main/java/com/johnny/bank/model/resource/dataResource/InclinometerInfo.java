package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.resource.dataResource.base.DetailMonitorInfo;
import lombok.*;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: InclinometerInfo
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/23 16:47
 * @version: 1.0
 */
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InclinometerInfo extends DetailMonitorInfo {
    private Double point1Depth;
    private Double point2Depth;
    private Double point3Depth;
    private Double point4Depth;
    private Double point5Depth;
    private Double point6Depth;
}
