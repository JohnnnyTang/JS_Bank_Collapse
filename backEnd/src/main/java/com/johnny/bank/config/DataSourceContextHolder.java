package com.johnny.bank.config;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/26
 * @Description:
 */
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class DataSourceContextHolder {
    private static final ThreadLocal<String> contextHolder = new ThreadLocal<String>() {
        /**
         * 设置默认数据源的key
         */
        @Override
        protected String initialValue() {
            return "default";
        }
    };

    /**
     * 数据源key的集合
     */
    public static Set<Object> dataSourceKeys = new HashSet<>();

    /**
     * 切换数据源
     */
    public static void setDataSourceKey(String key) {
        contextHolder.set(key);
    }

    /**
     * 获取数据源
     */
    public static String getDataSourceKey() {
        return contextHolder.get();
    }

    /**
     * 重置数据源
     */
    public static void clearDataSourceKey() {
        contextHolder.remove();
    }

    /**
     * 判断数据源是否存在
     */
    public static boolean containDataSourceKey(String key) {
        return dataSourceKeys.contains(key);
    }

    /**
     * 添加数据源key
     */
    public static boolean addDataSourceKey(Object key) {
        return dataSourceKeys.add(key);
    }

    /**
     * 添加多个数据源keys
     */
    public static boolean addDataSourceKeys(Collection<? extends Object> keys) {
        return dataSourceKeys.addAll(keys);
    }
}
