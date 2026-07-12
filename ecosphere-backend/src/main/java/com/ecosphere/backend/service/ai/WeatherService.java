package com.ecosphere.backend.service.ai;

import com.ecosphere.backend.dto.ai.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class WeatherService {

    private final WebClient webClient;

    @Value("${ai.weather.api.key}")
    private String apiKey;

    @Value("${ai.weather.api.url}")
    private String apiUrl;

    @Value("${ai.weather.default.location}")
    private String defaultLocation;

    public WeatherService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public WeatherResponse getCurrentWeather() {
        try {
            return webClient.get()
                    .uri(apiUrl + "?q=" + defaultLocation + "&appid=" + apiKey + "&units=metric")
                    .retrieve()
                    .bodyToMono(WeatherResponse.class)
                    .block(); // Blocking because we're calling this synchronously for now
        } catch (Exception e) {
            System.err.println("Failed to fetch weather: " + e.getMessage());
            return null;
        }
    }
}
