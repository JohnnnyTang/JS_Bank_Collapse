package com.johnny.bank.model.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/9/24 17:00
 * @Description:
 */

@NoArgsConstructor
@AllArgsConstructor
@Data
@ConfigurationProperties(prefix = "spring.datasource.public")
@Component
public class PublicDatasource {
    private String database;
    private String url;
    private String username;
    private String password;
    private String driverClassName;
}
