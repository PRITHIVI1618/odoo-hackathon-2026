package com.ecosphere.backend.service.ai;

import com.ecosphere.backend.entity.User;
import com.ecosphere.backend.entity.ai.AiChatHistory;
import com.ecosphere.backend.repository.ai.AiChatHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatHistoryService {

    private final AiChatHistoryRepository chatHistoryRepository;

    public List<AiChatHistory> getHistoryForUser(User user) {
        return chatHistoryRepository.findByUserOrderByTimestampAsc(user);
    }

    @Transactional
    public AiChatHistory saveMessage(User user, String userMessage, String aiResponse) {
        AiChatHistory history = new AiChatHistory();
        history.setUser(user);
        history.setUserMessage(userMessage);
        history.setAiResponse(aiResponse);
        history.setTimestamp(LocalDateTime.now());
        return chatHistoryRepository.save(history);
    }

    @Transactional
    public void clearHistory(User user) {
        chatHistoryRepository.deleteByUser(user);
    }
}
