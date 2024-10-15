package com.johnny.bank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.config
 * @className: MailSenderCofig
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/4/24 22:09
 * @version: 1.0
 */
@Configuration
public class MailSenderConfig {
    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.qq.com");
        mailSender.setPort(465);

        mailSender.setUsername("1275441282@qq.com");
        mailSender.setPassword("ezuxlysqewrgfhhi");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.debug", "true");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.ssl.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        return mailSender;
    }
}
