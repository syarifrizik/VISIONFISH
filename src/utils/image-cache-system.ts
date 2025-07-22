/**
 * Advanced Image Caching & Memory System
 * Implements hash-based caching and similarity detection
 */

import { AnalysisType } from '@/components/species/DualAnalysisSelector';

export interface CachedResult {
  id: string;
  imageHash: string;
  analysisType: AnalysisType;
  result: string;
  confidence: number;
  timestamp: number;
  usage_count: number;
}

export interface SimilarityMatch {
  result: CachedResult;
  similarity: number;
  reason: string;
}

/**
 * Generate stable hash for image data
 */
export function generateImageHash(imageData: string): string {
  // Use a portion of base64 data for hashing
  const sampleData = imageData.substring(0, 2000);
  
  let hash = 0;
  for (let i = 0; i < sampleData.length; i++) {
    const char = sampleData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Cache management class
 */
export class ImageCacheSystem {
  private cacheKey = 'visionfish-image-cache';
  private maxCacheSize = 100;
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get cached result for exact image match
   */
  getCachedResult(imageHash: string, analysisType: AnalysisType): CachedResult | null {
    try {
      const cache = this.getCache();
      const key = `${imageHash}_${analysisType}`;
      const cached = cache[key];
      
      if (cached && (Date.now() - cached.timestamp) < this.maxAge) {
        // Update usage count
        cached.usage_count++;
        this.updateCache(cache);
        console.log('🎯 Cache HIT: Using exact match for image', imageHash);
        return cached;
      }
      
      return null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  /**
   * Find similar cached results
   */
  findSimilarResults(imageHash: string, analysisType: AnalysisType): SimilarityMatch[] {
    try {
      const cache = this.getCache();
      const matches: SimilarityMatch[] = [];
      
      Object.values(cache).forEach(cached => {
        if (cached.analysisType === analysisType && cached.imageHash !== imageHash) {
          const similarity = this.calculateHashSimilarity(imageHash, cached.imageHash);
          
          if (similarity > 0.7) { // 70% similarity threshold
            matches.push({
              result: cached,
              similarity,
              reason: similarity > 0.9 ? 'Hampir identik' : 
                     similarity > 0.8 ? 'Sangat mirip' : 'Mirip'
            });
          }
        }
      });
      
      // Sort by similarity
      return matches.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
    } catch (error) {
      console.error('Similarity search error:', error);
      return [];
    }
  }

  /**
   * Store result in cache
   */
  setCachedResult(
    imageHash: string, 
    analysisType: AnalysisType, 
    result: string, 
    confidence: number
  ): void {
    try {
      const cache = this.getCache();
      const key = `${imageHash}_${analysisType}`;
      
      cache[key] = {
        id: key,
        imageHash,
        analysisType,
        result,
        confidence,
        timestamp: Date.now(),
        usage_count: 1
      };
      
      this.cleanupCache(cache);
      this.updateCache(cache);
      
      console.log('💾 Cached result for image:', imageHash, 'type:', analysisType);
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  }

  /**
   * Clear old or excess cache entries
   */
  private cleanupCache(cache: Record<string, CachedResult>): void {
    const entries = Object.entries(cache);
    
    // Remove expired entries
    const validEntries = entries.filter(([_, cached]) => 
      (Date.now() - cached.timestamp) < this.maxAge
    );
    
    // Keep only most used entries if over limit
    if (validEntries.length > this.maxCacheSize) {
      validEntries.sort((a, b) => b[1].usage_count - a[1].usage_count);
      validEntries.splice(this.maxCacheSize);
    }
    
    // Rebuild cache
    Object.keys(cache).forEach(key => delete cache[key]);
    validEntries.forEach(([key, value]) => cache[key] = value);
  }

  /**
   * Get cache from localStorage
   */
  private getCache(): Record<string, CachedResult> {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem(this.cacheKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Update cache in localStorage
   */
  private updateCache(cache: Record<string, CachedResult>): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache update error:', error);
    }
  }

  /**
   * Calculate similarity between two hashes
   */
  private calculateHashSimilarity(hash1: string, hash2: string): number {
    if (hash1 === hash2) return 1.0;
    
    // Simple character similarity
    const maxLen = Math.max(hash1.length, hash2.length);
    let matches = 0;
    
    for (let i = 0; i < maxLen; i++) {
      if (hash1[i] === hash2[i]) matches++;
    }
    
    return matches / maxLen;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { entries: number; oldestEntry: number; mostUsed: number } {
    const cache = this.getCache();
    const entries = Object.values(cache);
    
    if (entries.length === 0) {
      return { entries: 0, oldestEntry: 0, mostUsed: 0 };
    }
    
    const oldestEntry = Math.min(...entries.map(e => e.timestamp));
    const mostUsed = Math.max(...entries.map(e => e.usage_count));
    
    return {
      entries: entries.length,
      oldestEntry: Date.now() - oldestEntry,
      mostUsed
    };
  }
}

// Export singleton instance
export const imageCacheSystem = new ImageCacheSystem();
