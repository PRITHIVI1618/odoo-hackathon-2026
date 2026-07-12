package com.ecosphere.backend.dto.ai;

import lombok.Data;
import java.util.List;

@Data
public class WeatherResponse {
    private List<Weather> weather;
    private Main main;
    private Wind wind;
    private String name;

    @Data
    public static class Weather {
        private int id;
        private String main;
        private String description;
        private String icon;
    }

    @Data
    public static class Main {
        private double temp;
        private double feels_like;
        private double temp_min;
        private double temp_max;
        private int pressure;
        private int humidity;
    }

    @Data
    public static class Wind {
        private double speed;
        private int deg;
    }
}
