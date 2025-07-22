
import { useEffect } from "react";
import { WeatherPage } from "@/components/weather/WeatherPage";

const Weather = () => {
  useEffect(() => {
    document.title = "VisionFish - Weather Intelligence | Cuaca Modern";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Dapatkan informasi cuaca terkini dengan UI modern 2025. Prakiraan per jam, harian, dan fitur premium untuk analisis detail.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Dapatkan informasi cuaca terkini dengan UI modern 2025. Prakiraan per jam, harian, dan fitur premium untuk analisis detail.';
      document.head.appendChild(meta);
    }
  }, []);

  return <WeatherPage />;
};

export default Weather;
