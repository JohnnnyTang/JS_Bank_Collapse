package com.johnny.bank.aop;

import com.johnny.bank.config.DataSourceContextHolder;
import com.johnny.bank.config.DataSourceRouting;
import com.johnny.bank.model.node.DataNode;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/27
 * @Description:
 */
@Slf4j
@Aspect
@Component
public class DynamicDataSourceAspect {

    private DataSourceRouting dynamicDataSource;
    private final Map<String, String> datasourceDriverMapper = new HashMap<>(){{
        put("mysql", "com.mysql.cj.jdbc.Driver");
        put("oracle", "oracle.jdbc.driver.OracleDriver");
        put("postgresql", "org.postgresql.Driver");
        put("sqlite", "org.sqlite.JDBC");
        put("sqlserver", "com.microsoft.sqlserver.jdbc.SQLServerDriver");
    }};

    @Qualifier("dynamicDataSource")
    @Autowired
    public void setDynamicDataSource(DataSourceRouting dynamicDataSource) {
        this.dynamicDataSource = dynamicDataSource;
    }

    /**
     * 切换数据源
     */
//    @Around("execution(* com.johnny.bank.service.resource.*.*(..))")
    @Around("@annotation(com.johnny.bank.aop.DynamicNodeData)")
    public Object switchDataSource(ProceedingJoinPoint joinPoint) throws Throwable {
        Object[] args = joinPoint.getArgs();
        DataNode dataNode = (DataNode) args[0];

//        if(DataSourceContextHolder.getDataSourceKey().equals(dataNode.getId())) {
//            return joinPoint.proceed();
//        }
        if (!DataSourceContextHolder.containDataSourceKey(dataNode.getId())) {
            DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
            dataSourceBuilder.url(dataNode.getApiPrefix());
            dataSourceBuilder.driverClassName(datasourceDriverMapper.get((String) dataNode.getUsage().get("driver")));
            if(dataNode.getUsage().containsKey("userName")) {
                dataSourceBuilder.username((String) dataNode.getUsage().get("userName"));
            }
            if(dataNode.getUsage().containsKey("password")) {
                dataSourceBuilder.password((String) dataNode.getUsage().get("password"));
            }
            DataSource source = dataSourceBuilder.build();
            dynamicDataSource.addDataSource(dataNode.getId(), source);
        }
        // 切换数据源
        DataSourceContextHolder.setDataSourceKey(dataNode.getId());
        log.info(DataSourceContextHolder.getDataSourceKey());

        Object result = joinPoint.proceed();

        DataSourceContextHolder.setDataSourceKey("default");

        return result;
    }

}
