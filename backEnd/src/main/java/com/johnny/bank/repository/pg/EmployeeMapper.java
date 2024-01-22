package com.johnny.bank.repository.pg;

import com.johnny.bank.model.Employee;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/26
 * @Description:
 */
@Repository
public interface EmployeeMapper {
    List<Employee> findAll();
}
