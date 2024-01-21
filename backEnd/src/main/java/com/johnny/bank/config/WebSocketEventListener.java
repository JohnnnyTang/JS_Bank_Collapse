package com.johnny.bank.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/9
 * @Description:
 */
//@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messageSendingOperations;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent disconnectEvent) {
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(disconnectEvent.getMessage());
//        String username = (String) headerAccessor.getSessionAttributes().get("username");
//        if(username != null) {
//            log.info("User disconnected: {}", username);
//            var chatMessage = ChatMessage.builder()
//                    .messageType("LEAVE")
//                    .sender(username)
//                    .build();
//            messageSendingOperations.convertAndSend("/topic/public", chatMessage);
//        }
    }
}
