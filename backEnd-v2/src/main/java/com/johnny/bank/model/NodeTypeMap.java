package com.johnny.bank.model;

import lombok.Getter;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/22
 * @Description:
 */
@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
@Getter
public class NodeTypeMap {
    // 初始化参数
    private Map<String, Object> map = new HashMap<>(){{
        put("", "");
    }};

    private NodeTypeMap() {}

//    public Map<String, Object> getMap() {
//        return map;
//    }

    private void setMap(Map<String, Object> map) {
        this.map = map;
    }
}

