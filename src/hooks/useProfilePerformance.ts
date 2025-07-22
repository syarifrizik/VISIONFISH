
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  isSlowConnection: boolean;
}

export const useProfilePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    isSlowConnection: false
  });
  const [isOptimized, setIsOptimized] = useState(false);
  const { toast } = useToast();
  const startTimeRef = useRef<number>();
  const renderStartRef = useRef<number>();

  // Detect slow connection
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.downlink < 1;
      
      setMetrics(prev => ({ ...prev, isSlowConnection }));
      
      if (isSlowConnection) {
        setIsOptimized(true);
        toast({
          title: "🚀 Mode Optimisasi Aktif",
          description: "Koneksi lambat terdeteksi, mengoptimalkan performa...",
          duration: 3000
        });
      }
    }
  }, [toast]);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    startTimeRef.current = performance.now();
    renderStartRef.current = performance.now();
  }, []);

  // End performance measurement
  const endMeasurement = useCallback((phase: 'load' | 'render') => {
    if (!startTimeRef.current) return;

    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;

    if (phase === 'load') {
      setMetrics(prev => ({ ...prev, loadTime: duration }));
    } else if (phase === 'render') {
      setMetrics(prev => ({ ...prev, renderTime: duration }));
    }

    // Auto-optimize if performance is poor
    if (duration > 3000 && !isOptimized) {
      setIsOptimized(true);
      toast({
        title: "⚡ Auto-Optimisasi",
        description: "Performa lambat terdeteksi, mengaktifkan mode hemat...",
        duration: 3000
      });
    }
  }, [isOptimized, toast]);

  // Memory usage monitoring
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          setMetrics(prev => ({
            ...prev,
            memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
          }));
        }
      };

      updateMemory();
      const interval = setInterval(updateMemory, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  // Performance recommendations
  const getOptimizationTips = useCallback(() => {
    const tips = [];
    
    if (metrics.loadTime > 2000) {
      tips.push('Pertimbangkan untuk menggunakan koneksi yang lebih cepat');
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 100) {
      tips.push('Tutup tab browser lain untuk mengoptimalkan memori');
    }
    
    if (metrics.isSlowConnection) {
      tips.push('Mode hemat data telah diaktifkan');
    }

    return tips;
  }, [metrics]);

  return {
    metrics,
    isOptimized,
    startMeasurement,
    endMeasurement,
    getOptimizationTips,
    setOptimized: setIsOptimized
  };
};
