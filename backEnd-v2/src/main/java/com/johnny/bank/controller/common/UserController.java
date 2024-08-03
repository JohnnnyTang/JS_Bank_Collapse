package com.johnny.bank.controller.common;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.service.common.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/2 22:20
 * @Description:
 */

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    @Autowired
    IUserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody JSONObject userInfo) {
        String token = userService.login(userInfo);
        return ResponseEntity.ok(token);
    }
}
