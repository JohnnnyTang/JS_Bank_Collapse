package com.johnny.bank.jobs;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * @Author: Johnny Tang
 * @Date: 2024/4/12
 * @Description:
 */
@Slf4j
@Component
public class NodeServiceRunner implements Runnable{

    @PostConstruct
    public void init(){
        //启动线程实例
        new Thread(this).start();
    }

    @Override
    public void run() {
        try {

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
