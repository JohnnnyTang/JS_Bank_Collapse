package com.johnny.bank.model.configuration;

import com.alibaba.fastjson2.JSON;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.AlgorithmMismatchException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.johnny.bank.utils.TokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/3 9:55
 * @Description:
 */
public class JWTInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Map<String,Object> map = new HashMap<>();
        String token = request.getHeader("token");
        if (token == null || token.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            map.put("error", "Token不能为空");
            response.getWriter().write(JSON.toJSONString(map)); // 假设使用了某个JSON库来转换Map为JSON字符串
            return false;
        }
        try {
            TokenUtil.verifyToken(token);
            return true;
        } catch (SignatureVerificationException e) {
            e.printStackTrace();
            map.put("msg","无效签名");
        } catch (TokenExpiredException e) {
            e.printStackTrace();
            map.put("msg","token过期");
        } catch (AlgorithmMismatchException e) {
            map.put("msg","token算法不一致");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("msg","token失效");
        }
        map.put("state",false);
        String json = new ObjectMapper().writeValueAsString(map);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().print(json);
        return false;
    }
}
