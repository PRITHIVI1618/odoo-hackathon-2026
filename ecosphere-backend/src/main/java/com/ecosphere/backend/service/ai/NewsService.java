package com.ecosphere.backend.service.ai;

import com.ecosphere.backend.dto.ai.NewsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class NewsService {

    private final WebClient webClient;

    @Value("${ai.news.api.key}")
    private String apiKey;

    @Value("${ai.news.api.url}")
    private String apiUrl;

    public NewsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public NewsResponse getLatestEsgNews() {
        try {
            return webClient.get()
                    .uri(apiUrl + "&apiKey=" + apiKey)
                    .retrieve()
                    .bodyToMono(NewsResponse.class)
                    .block();
        } catch (Exception e) {
            System.err.println("Failed to fetch news: " + e.getMessage());
            return null;
        }
    }
}
