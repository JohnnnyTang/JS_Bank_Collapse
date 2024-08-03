package com.johnny.bank.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.johnny.bank.model.common.User;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/3 9:17
 * @Description:
 */
public class TokenUtil {
    private static final String SECRET_KEY = "your-secret-key";

    public static String generateToken(User user) {
        Map<String, Object> map = new HashMap<>();
        Calendar instance = Calendar.getInstance();
        instance.add(Calendar.HOUR,72);
//        instance.add(Calendar.SECOND, 30);
        return JWT.create()
                .withHeader(map)
                .withClaim("userId",user.getId())
                .withClaim("username",user.getName())
                .withExpiresAt(instance.getTime())
                .sign(Algorithm.HMAC256("nanshidashuikeyuan12138"));
    }

    public static void verifyToken(String token) {
        JWT.require(Algorithm.HMAC256("nanshidashuikeyuan12138")).build().verify(token);
    }

    public static DecodedJWT getToken(String token) {
        return JWT.require(Algorithm.HMAC256("nanshidashuikeyuan12138")).build().verify(token);
    }
}
