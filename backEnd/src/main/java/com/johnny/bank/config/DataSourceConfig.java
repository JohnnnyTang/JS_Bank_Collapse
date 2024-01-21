package com.johnny.bank.config;

import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/26
 * @Description:
 */
@Configuration
@EnableTransactionManagement
public class DataSourceConfig {
    /**
     * 默认基础数据源
     */
    @Bean("defaultSource")
    @ConfigurationProperties("spring.datasource")
    public DataSource defaultSource() {
        return DataSourceBuilder.create().build();
    }

//    @Bean("oneSource")
//    @ConfigurationProperties("test-data.datasource-one")
//    public DataSource oneSource() { return DataSourceBuilder.create().build(); }
//
//    @Bean("twoSource")
//    @ConfigurationProperties("test-data.datasource-two")
//    public DataSource twoSource() { return DataSourceBuilder.create().build(); }

    /**
     * 自定义动态数据源
     */
    @Bean("dynamicDataSource")
    public DataSourceRouting dynamicDataSource() {
        DataSourceRouting dynamicDataSource = new DataSourceRouting();
        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put("default", defaultSource());
//        dataSourceMap.put("one", oneSource());
//        dataSourceMap.put("two", twoSource());

        // 默认数据源
        dynamicDataSource.setDefaultDataSource(defaultSource());
        // 动态数据源
        dynamicDataSource.setDataSources(dataSourceMap);

        return dynamicDataSource;
    }

    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean() throws IOException {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        // 配置自定义动态数据源
        sessionFactory.setDataSource(dynamicDataSource());
        // 开启驼峰转下划线设置
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        sessionFactory.setConfiguration(configuration);
        // 实体、Mapper类映射
//        sessionFactory.setTypeAliasesPackage(typeAliasesPackage);
        sessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/resourceRepo/*/*.xml"));
        return sessionFactory;
    }

    /**
     * 开启动态数据源@Transactional注解事务管理的支持
     */
    @Bean
    public PlatformTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dynamicDataSource());
    }
}
