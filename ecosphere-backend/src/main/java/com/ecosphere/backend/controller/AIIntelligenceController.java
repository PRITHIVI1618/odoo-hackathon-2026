package com.ecosphere.backend.controller;

import com.ecosphere.backend.dto.ai.*;
import com.ecosphere.backend.entity.User;
import com.ecosphere.backend.entity.ai.AiChatHistory;
import com.ecosphere.backend.repository.UserRepository;
import com.ecosphere.backend.service.ai.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIIntelligenceController {

    private final GeminiAiService geminiAiService;
    private final NewsService newsService;
    private final WeatherService weatherService;
    private final ChatHistoryService chatHistoryService;
    private final UserRepository userRepository;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(
            @RequestBody AiChatRequest request,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        String aiResponse = geminiAiService.chat(request.getMessage());
        
        // Persist to MySQL
        chatHistoryService.saveMessage(user, request.getMessage(), aiResponse);
        
        return ResponseEntity.ok(new AiChatResponse(aiResponse, LocalDateTime.now()));
    }

    @GetMapping("/summary/{module}")
    public ResponseEntity<AiChatResponse> generateSummary(
            @PathVariable String module) {
        String summary = geminiAiService.generateExecutiveSummary(module);
        return ResponseEntity.ok(new AiChatResponse(summary, LocalDateTime.now()));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<AiChatResponse> getRecommendations() {
        String recommendations = geminiAiService.generateRecommendations();
        return ResponseEntity.ok(new AiChatResponse(recommendations, LocalDateTime.now()));
    }

    @GetMapping("/departments")
    public ResponseEntity<AiChatResponse> analyzeDepartments() {
        String analysis = geminiAiService.analyzeDepartments();
        return ResponseEntity.ok(new AiChatResponse(analysis, LocalDateTime.now()));
    }

    @GetMapping("/trends")
    public ResponseEntity<AiChatResponse> analyzeTrends() {
        String trends = geminiAiService.analyzeTrends();
        return ResponseEntity.ok(new AiChatResponse(trends, LocalDateTime.now()));
    }

    @GetMapping("/predictions")
    public ResponseEntity<AiChatResponse> getPredictions() {
        String predictions = geminiAiService.generatePredictiveInsights();
        return ResponseEntity.ok(new AiChatResponse(predictions, LocalDateTime.now()));
    }

    @GetMapping("/news")
    public ResponseEntity<NewsResponse> getNews() {
        NewsResponse news = newsService.getLatestEsgNews();
        return ResponseEntity.ok(news);
    }

    @GetMapping("/weather")
    public ResponseEntity<WeatherResponse> getWeather() {
        WeatherResponse weather = weatherService.getCurrentWeather();
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AiChatHistory>> getChatHistory(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(chatHistoryService.getHistoryForUser(user));
    }

    @DeleteMapping("/history")
    public ResponseEntity<Map<String, String>> clearChatHistory(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        chatHistoryService.clearHistory(user);
        return ResponseEntity.ok(Map.of("message", "Chat history cleared successfully"));
    }
}
