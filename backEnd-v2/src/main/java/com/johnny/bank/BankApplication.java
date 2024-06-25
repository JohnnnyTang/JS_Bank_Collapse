package com.johnny.bank;

import com.johnny.bank.config.DataSourceConfig;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
//@EnableConfigurationProperties(DataSourceConfig.class)
@MapperScan("com.johnny.bank.repository.resourceRepo")
public class BankApplication {
    public static void main(String[] args) {
//        System.out.println(Arrays.toString(",asd,".split(",")));
//        System.out.println(System.getProperty("user.dir"));
        SpringApplication.run(BankApplication.class, args);
    }

}
