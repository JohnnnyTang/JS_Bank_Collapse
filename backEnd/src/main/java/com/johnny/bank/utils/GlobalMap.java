package com.johnny.bank.utils;

import lombok.Getter;
import net.jodah.expiringmap.ExpiringMap;
import org.springframework.stereotype.Component;

/**
 * @Author: Johnny Tang
 * @Date: 2024/5/1
 * @Description:
 */
@Component
@Getter
public class GlobalMap {
    ExpiringMap<String, Double> warMessageMap = ExpiringMap.builder()
            .variableExpiration()
            .build();
}
