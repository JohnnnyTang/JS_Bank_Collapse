package com.johnny.bank.model.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @Author: Johnny Tang
 * @Date: 2024/4/12
 * @Description:
 */

@Data            //lombok简化注解，替代get、set和toString方法
@Component        //将该配置文件交由spring容器管理
@ConfigurationProperties(prefix = "tile")
public class TilePath {
    private String mzsTilePath;
    private String worldTilePath;
    private String nodeServicePath;
}
