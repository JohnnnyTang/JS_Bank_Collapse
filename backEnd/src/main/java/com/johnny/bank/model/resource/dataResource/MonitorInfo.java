package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.resource.dataResource.base.StaticInfoData;
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
public class MonitorInfo extends StaticInfoData {
     private String stationCode;
     private String machineId;
     private String name;
     private Character type;
     private Double longitude;
     private Double latitude;
     private Double elevation;
     private Timestamp inTime;
     private Timestamp begTime;
     private Timestamp endTime;
}
