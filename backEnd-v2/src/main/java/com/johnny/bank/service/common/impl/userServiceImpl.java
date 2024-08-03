package com.johnny.bank.service.common.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.common.User;
import com.johnny.bank.repository.localRepo.IUserRepo;
import com.johnny.bank.service.common.IUserService;
import com.johnny.bank.utils.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/2 22:27
 * @Description:
 */

@Service("userServiceImpl")
public class userServiceImpl implements IUserService {

    @Autowired
    IUserRepo userRepository;

    @Override
    public String login(JSONObject userInfo) {
        String email = userInfo.getString("email");
        String password = userInfo.getString("password");
        User user = userRepository.findByEmailAndPassword(email,password);
        if (user != null) {
            return TokenUtil.generateToken(user);
        } else {
            return null;
        }
    }
}
