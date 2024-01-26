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
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
public class StationInfo extends StaticInfoData {
//    private String operateUser;
//    private Timestamp operateTime;
    private LocalDate beginDate;
    private LocalDate endDate;
//    private int operateFlag;
//    private String operateDesc;


    public StationInfo(String code, String operateUser, Timestamp operateTime,
                       int operateFlag, String operateDesc,
                       LocalDate beginDate, LocalDate endDate) {
        super(code, operateUser, operateTime, operateFlag, operateDesc);
        this.beginDate = beginDate;
        this.endDate = endDate;
    }
}
