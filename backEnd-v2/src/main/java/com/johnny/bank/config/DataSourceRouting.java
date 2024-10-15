package com.johnny.bank.config;

import jakarta.annotation.Nonnull;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/26
 * @Description:
 */
public class DataSourceRouting extends AbstractRoutingDataSource {
    private Map<Object, Object> dataSources = new HashMap<>();
    /**
     * 获取当前数据源的键
     */
    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceContextHolder.getDataSourceKey();
    }

    /**
     * 获取当前数据源
     */
    @Override
    @Nonnull
    protected DataSource determineTargetDataSource() {
        return super.determineTargetDataSource();
    }

    /**
     * 设置默认数据源
     */
    public void setDefaultDataSource(Object defaultDataSource) {
        super.setDefaultTargetDataSource(defaultDataSource);
    }


    /**
     * 设置数据源
     */
    public void setDataSources(Map<Object, Object> dataSources) {
        this.dataSources = dataSources;
        super.setTargetDataSources(dataSources);
        // 保存数据源的key
        DataSourceContextHolder.addDataSourceKeys(dataSources.keySet());
    }

    /**
     * 追加数据源
     */
    public void addDataSource(String key, DataSource dataSource) {
        this.dataSources.put(key, dataSource);
        super.setTargetDataSources(dataSources);
        // 保存数据源的key
        DataSourceContextHolder.addDataSourceKey(key);
        // 加载新的数据源
        super.afterPropertiesSet();
    }
}
