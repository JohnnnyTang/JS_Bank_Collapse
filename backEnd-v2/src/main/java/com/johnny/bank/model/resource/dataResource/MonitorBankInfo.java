package com.johnny.bank.model.resource.dataResource;

import lombok.*;

/**
 * @Author: Johnny Tang
 * @Date: 2024/7/3
 * @Description:
 */
@Getter
@Setter
@EqualsAndHashCode()
@ToString()
@NoArgsConstructor
public class MonitorBankInfo {
    private String name;
    private String length;
    private Integer warnLevel;
    private Integer deviceNumber;
    private String startDate;
    private String code;
}
