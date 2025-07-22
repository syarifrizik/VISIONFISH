
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherRequest {
  location?: string;
  lat?: number;
  lon?: number;
  type: 'current' | 'forecast' | 'daily';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const weatherApiKey = Deno.env.get('WEATHER_API_KEY');
    if (!weatherApiKey) {
      throw new Error('Weather API key not configured');
    }

    const { location, lat, lon, type }: WeatherRequest = await req.json();
    
    let url: string;
    
    if (type === 'current') {
      if (lat !== undefined && lon !== undefined) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=id`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric&lang=id`;
      }
    } else if (type === 'forecast' || type === 'daily') {
      if (lat !== undefined && lon !== undefined) {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=id`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${weatherApiKey}&units=metric&lang=id`;
      }
    } else {
      throw new Error('Invalid request type');
    }

    console.log('Calling weather API:', { type, location, lat, lon });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in weather-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
