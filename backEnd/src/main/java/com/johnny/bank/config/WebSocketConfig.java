package com.johnny.bank.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/9
 * @Description:
 */
@Configuration
//@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
//        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:5173").withSockJS();
        WebSocketMessageBrokerConfigurer.super.registerStompEndpoints(registry);
    }

//    @Override
//    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
//
//        return WebSocketMessageBrokerConfigurer.super.configureMessageConverters(messageConverters);
//    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
//        registry.setUserDestinationPrefix("");
//        WebSocketMessageBrokerConfigurer.super.configureMessageBroker(registry);
    }
}
