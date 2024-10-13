package com.johnny.bank.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/9/23 21:30
 * @Description:
 */

@Slf4j
@Component
public class NameUtil {
    public static String convertCamelCaseToSnakeCase(String camelCase) {
        StringBuilder snakeCase = new StringBuilder();
        int i = 0;
        for (char c : camelCase.toCharArray()) {
            if (Character.isUpperCase(c) && i!=0) {
                snakeCase.append("_").append(Character.toLowerCase(c));
            } else if (Character.isUpperCase(c)) {
                snakeCase.append(Character.toLowerCase(c));
            } else {
                snakeCase.append(c);
            }
            i++;
        }
        return snakeCase.toString();
    }
}
