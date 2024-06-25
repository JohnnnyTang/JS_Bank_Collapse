package com.johnny.bank.model.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.configuration
 * @className: MultiIndexPath
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/4/24 13:46
 * @version: 1.0
 */
@Data            //lombok简化注解，替代get、set和toString方法
@Component        //将该配置文件交由spring容器管理
@ConfigurationProperties(prefix = "multi-index")
public class MultiIndexPath {
    private String dataPath;
    private String resPath;
    private String wholeDataPath;
    private String condaEnv;
}
