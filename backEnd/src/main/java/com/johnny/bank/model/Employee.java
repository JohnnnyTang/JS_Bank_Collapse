package com.johnny.bank.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/26
 * @Description:
 */

@Data
@Builder
public class Employee {
    @Id
    private int employeeId;

    private String employeeName;

    private String employeeRole;
}
