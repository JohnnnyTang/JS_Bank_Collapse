package com.johnny.bank.utils;

import java.util.UUID;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/8
 * @Description:
 */
public class UidUtils {

    public static String getUUid() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}
