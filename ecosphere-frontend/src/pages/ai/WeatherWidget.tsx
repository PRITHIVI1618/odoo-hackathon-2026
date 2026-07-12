import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Wind, Droplets, Thermometer, Loader2, MapPin } from 'lucide-react';
import type { WeatherData } from '@/services/aiApi';

export function WeatherWidget({ weather, loading }: { weather: WeatherData | null; loading: boolean }) {
  if (loading) {
    return (
      <Card className="glass">
        <CardHeader><CardTitle className="flex items-center gap-2"><CloudSun className="w-5 h-5 text-yellow-500" /> Weather</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="glass">
        <CardHeader><CardTitle className="flex items-center gap-2"><CloudSun className="w-5 h-5 text-yellow-500" /> Weather</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm">Weather data unavailable.</p></CardContent>
      </Card>
    );
  }

  const temp = Math.round(weather.main.temp);
  const icon = weather.weather[0]?.icon;
  const description = weather.weather[0]?.description;

  // Generate env recommendation based on weather
  const getRecommendation = () => {
    if (temp > 35) return "🌡️ Extreme heat alert! Reduce AC usage by shifting work hours or using passive cooling.";
    if (temp > 30) return "☀️ Hot day. Encourage employees to use public transport to cut vehicle emissions.";
    if (weather.main.humidity > 80) return "💧 High humidity. Consider HVAC optimization to reduce energy consumption.";
    if (weather.wind.speed > 10) return "💨 Windy conditions ideal for wind energy generation today!";
    return "🌿 Great weather conditions! Encourage outdoor sustainability activities and walking.";
  };

  return (
    <Card className="glass bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <CloudSun className="w-5 h-5 text-yellow-500" />
          Weather Intelligence
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground font-normal">
            <MapPin className="w-3 h-3" /> {weather.name}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
                className="w-14 h-14"
              />
            )}
            <div>
              <p className="text-4xl font-bold">{temp}°C</p>
              <p className="text-sm text-muted-foreground capitalize">{description}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>{weather.main.humidity}% humidity</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>{weather.wind.speed} m/s wind</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span>Feels {Math.round(weather.main.feels_like)}°C</span>
            </div>
          </div>
        </div>
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-xs font-medium text-green-600 dark:text-green-400">🌱 ESG Recommendation</p>
          <p className="text-sm mt-1">{getRecommendation()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
