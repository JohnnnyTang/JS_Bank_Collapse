package com.johnny.bank.model.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@ConfigurationProperties(prefix = "spring.datasource.default")
@Component
public class DefaultDatasource {
    private String database;
    private String url;
    private String username;
    private String password;
    private String driverClassName;
}
