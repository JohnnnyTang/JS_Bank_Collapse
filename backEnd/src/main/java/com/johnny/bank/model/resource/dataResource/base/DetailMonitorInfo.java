package com.johnny.bank.model.resource.dataResource.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource.base
 * @className: DetailMonitorInfo
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/23 18:06
 * @version: 1.0
 */
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DetailMonitorInfo extends StaticInfoData {
    private String machineId;
    private String stationCode;
    private Integer pointNum;
    private Double point1Depth;
    private Double point2Depth;
    private Double point3Depth;
    private Double point4Depth;
    private Double point5Depth;
    private Double point6Depth;
}
