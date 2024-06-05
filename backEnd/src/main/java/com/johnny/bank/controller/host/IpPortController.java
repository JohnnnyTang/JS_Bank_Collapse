package com.johnny.bank.controller.host;

import com.alibaba.fastjson2.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @Author: Johnny Tang
 * @Date: 2024/6/5
 * @Description:
 */
@Controller
@RequestMapping("api/v1/service")
public class IpPortController {

    @Value("${server.port}")
    int localServerPort;

    @GetMapping
    ResponseEntity<JSONObject> getCurrentIpAndPort() {
        JSONObject ipObject = new JSONObject();
        try {
            ipObject.put("ip", InetAddress.getLocalHost().getHostAddress());
        }
        catch(UnknownHostException e) {
            System.out.println("unknown host exception!!!");
            System.out.println(e.getMessage());
            ipObject.put("ip", null);
        }
        ipObject.put("port", localServerPort);
        return ResponseEntity.ok(ipObject);
    }
}
