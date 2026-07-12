package com.ecosphere.backend.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GeminiAiService {

    private final WebClient.Builder webClientBuilder;
    private final PromptBuilderService promptBuilderService;

    @Value("${ai.gemini.api.key}")
    private String apiKey;

    @Value("${ai.gemini.api.url}")
    private String apiUrl;

    public String chat(String userMessage) {
        try {
            String esgContext = promptBuilderService.buildEsgContext();
            String fullPrompt = buildSystemPrompt(esgContext, userMessage);
            return callGemini(fullPrompt);
        } catch (Exception e) {
            System.err.println("Gemini AI chat error: " + e.getMessage());
            return "⚠️ **Gemini API Error:** " + e.getMessage() + "\n\nPlease check that your API key is valid. Go to [Google AI Studio](https://aistudio.google.com/apikey) to get a free API key starting with `AIza...`";
        }
    }

    public String generateExecutiveSummary(String module) {
        try {
            String esgContext = promptBuilderService.buildEsgContext();
            String prompt = String.format("""
                    %s
                    
                    You are an expert ESG advisor for EcoSphere AI. Based on the ESG performance data above, generate a concise executive summary for the %s module.
                    
                    Structure your response with these sections:
                    - **Overview**: A 2-3 sentence snapshot of the current performance.
                    - **Key Achievements**: 2-3 bullet points highlighting the best results.
                    - **Critical Risks**: 2-3 bullet points identifying the biggest concerns.
                    - **Top Recommendations**: 3 concrete, actionable recommendations for leadership.
                    
                    Keep the tone professional, concise, and executive-friendly. Use data from the context wherever possible.
                    """, esgContext, module);
            return callGemini(prompt);
        } catch (Exception e) {
            return "Unable to generate summary at this time. Please try again.";
        }
    }

    public String generateRecommendations() {
        try {
            String esgContext = promptBuilderService.buildEsgContext();
            String prompt = esgContext + """
                    
                    You are an expert ESG strategist for EcoSphere AI. Based on the data above, generate 5 actionable, specific, and prioritized sustainability recommendations.
                    
                    For each recommendation:
                    - Use the format: **[Priority] Recommendation Title**
                    - Explain the problem with reference to the actual data
                    - Provide a concrete action plan
                    - Estimate the potential ESG impact
                    
                    Prioritize: Critical > High > Medium
                    Focus on areas with the biggest gaps. Be specific, not generic.
                    """;
            return callGemini(prompt);
        } catch (Exception e) {
            return "Unable to generate recommendations at this time.";
        }
    }

    public String analyzeDepartments() {
        try {
            String esgContext = promptBuilderService.buildEsgContext();
            String prompt = esgContext + """
                    
                    You are an expert ESG analyst for EcoSphere AI. Based on the department performance data above, provide a comparative analysis of all departments.
                    
                    For each department mentioned in the data, explain:
                    - **Strengths**: What they are doing well
                    - **Weaknesses**: Areas needing improvement
                    - **Improvement Plan**: 2 specific actions they should take
                    
                    End with an overall ranking of departments and which department needs the most urgent attention.
                    """;
            return callGemini(prompt);
        } catch (Exception e) {
            return "Unable to analyze departments at this time.";
        }
    }

    public String analyzeTrends() {
        try {
            String esgContext = promptBuilderService.buildEsgContext();
            String prompt = esgContext + """
                    
                    You are an expert ESG trend analyst for EcoSphere AI. Based on the ESG performance data above, provide a trend analysis.
                    
                    Cover these areas:
                    - **Carbon Emissions Trend**: Is performance improving or declining?
                    - **Social Engagement Trend**: Are employees becoming more engaged?
                    - **Governance Trend**: Is compliance improving?
                    - **Gamification Impact**: How is employee engagement affecting ESG scores?
                    
                    Predict the likely trajectory over the next 3 months if current trends continue.
                    """;
            return callGemini(prompt);
        } catch (Exception e) {
            return "Unable to analyze trends at this time.";
        }
    }

    public String generatePredictiveInsights() {
        try {
            String esgContext = promptBuilderService.buildEsgContext();
            String prompt = esgContext + """
                    
                    You are an expert ESG risk analyst for EcoSphere AI. Based on the data above, generate predictive insights.
                    
                    Provide:
                    - **Goal Completion Probability**: For each active goal type, estimate completion probability (%)
                    - **High-Risk Areas**: Which areas are most likely to see ESG failures in the next quarter?
                    - **Quick Wins**: Which 3 improvements could be achieved in less than 30 days with the highest ESG impact?
                    - **Long-term Prediction**: Where will ESG performance be in 6 months if no action is taken?
                    """;
            return callGemini(prompt);
        } catch (Exception e) {
            return "Unable to generate predictive insights at this time.";
        }
    }

    private String buildSystemPrompt(String esgContext, String userMessage) {
        return String.format("""
                %s
                
                You are an expert ESG advisor embedded in the EcoSphere AI platform. The data above is LIVE data from the organization's EcoSphere ESG management system.
                
                Important rules:
                - Always reference specific data from the context above
                - Never give generic advice; be specific to this organization's numbers
                - Be concise and executive-friendly
                - Use bullet points where appropriate
                - If the user asks about something not in the data, say so politely
                
                User Question: %s
                """, esgContext, userMessage);
    }

    private String callGemini(String prompt) throws Exception {
        WebClient webClient = webClientBuilder.build();

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            String response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.isError(), clientResponse ->
                            clientResponse.bodyToMono(String.class).map(body -> {
                                System.err.println("Gemini API error status: " + clientResponse.statusCode());
                                System.err.println("Gemini API error body: " + body);
                                return new RuntimeException("Gemini API error: " + clientResponse.statusCode() + " - " + body);
                            })
                    )
                    .bodyToMono(String.class)
                    .block();

            // Parse response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode candidates = root.path("candidates");
            if (candidates.isMissingNode() || candidates.isEmpty()) {
                System.err.println("Gemini unexpected response: " + response);
                return "AI response was empty. The model may have refused to answer. Please try rephrasing your question.";
            }
            return candidates.get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            System.err.println("callGemini exception: " + e.getMessage());
            throw e;
        }
    }
}
