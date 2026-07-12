package com.ecosphere.backend.repository.ai;

import com.ecosphere.backend.entity.User;
import com.ecosphere.backend.entity.ai.AiChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiChatHistoryRepository extends JpaRepository<AiChatHistory, Long> {
    List<AiChatHistory> findByUserOrderByTimestampAsc(User user);
    void deleteByUser(User user);
}
