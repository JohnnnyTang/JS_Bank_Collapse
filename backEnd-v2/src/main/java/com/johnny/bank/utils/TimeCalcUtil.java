package com.johnny.bank.utils;

import java.sql.Timestamp;
import java.util.Calendar;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/4
 * @Description:
 */
public class TimeCalcUtil {
    public static Timestamp calcTimeBeforeNow(int timeUnit, int count) {
        Calendar cal = Calendar.getInstance();
        cal.add(timeUnit, -count);
        return new Timestamp(cal.getTime().getTime());
    }
}
