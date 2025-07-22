
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class WeatherCache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

  set<T>(key: string, data: T, ttlMs: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const weatherCache = new WeatherCache();

// Auto cleanup every 5 minutes
setInterval(() => {
  weatherCache.cleanup();
}, 5 * 60 * 1000);

// Generate cache key for weather requests
export const generateWeatherCacheKey = (
  type: 'current' | 'forecast' | 'daily',
  location?: string,
  lat?: number,
  lon?: number
): string => {
  if (lat !== undefined && lon !== undefined) {
    return `weather_${type}_${lat}_${lon}`;
  }
  return `weather_${type}_${location || 'default'}`;
};
