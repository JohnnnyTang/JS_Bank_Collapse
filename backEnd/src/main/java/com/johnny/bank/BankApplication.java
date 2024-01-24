package com.johnny.bank;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
@MapperScan("com.johnny.bank.repository.resourceRepo")
public class BankApplication {


    public static void main(String[] args) {
//        System.out.println(Arrays.toString(",asd,".split(",")));
        SpringApplication.run(BankApplication.class, args);
    }

}
