package com.johnny.bank.service.common;

import com.alibaba.fastjson2.JSONObject;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/2 22:26
 * @Description:
 */
public interface IUserService {
    String login(JSONObject userInfo);
}
