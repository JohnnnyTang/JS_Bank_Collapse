package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.resource.dataResource.base.StaticInfoData;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDate;

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
     private int stationCode;

     @Builder(buildMethodName = "deviceInfoBuilder")
     public MonitorInfo(String uid, int code, String name,
                        int type, double lng, double lat,
                        double baseHeight, String operateUser,
                        Timestamp operateTime, LocalDate beginDate,
                        LocalDate endDate, int operateFlag, String operateDesc, int stationCode) {
          super(uid, code, name,
                  type, lng, lat,
                  baseHeight, operateUser,
                  operateTime, beginDate, endDate,
                  operateFlag, operateDesc);
          this.stationCode = stationCode;
     }
}
