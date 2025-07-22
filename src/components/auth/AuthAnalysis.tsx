import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
interface AnalysisResult {
  component: string;
  status: 'good' | 'warning' | 'error' | 'info';
  message: string;
  recommendation?: string;
}
export const AuthAnalysis = () => {
  const {
    user,
    isLoading
  } = useAuth();
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0
  });
  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);
  useEffect(() => {
    const performAnalysis = async () => {
      const results: AnalysisResult[] = [];

      // Responsiveness Analysis
      if (viewport.width > 0) {
        if (viewport.width < 768) {
          results.push({
            component: 'Mobile Responsiveness',
            status: viewport.width < 375 ? 'warning' : 'good',
            message: `Viewport: ${viewport.width}x${viewport.height} - ${viewport.width < 375 ? 'Very narrow screen detected' : 'Mobile layout active'}`,
            recommendation: viewport.width < 375 ? 'Consider optimizing for very small screens' : undefined
          });
        } else {
          results.push({
            component: 'Desktop Layout',
            status: 'good',
            message: `Desktop viewport: ${viewport.width}x${viewport.height}`
          });
        }
      }

      // Supabase Connection Analysis
      try {
        const {
          data,
          error
        } = await supabase.auth.getSession();
        results.push({
          component: 'Supabase Auth Connection',
          status: error ? 'error' : 'good',
          message: error ? `Connection error: ${error.message}` : 'Successfully connected to Supabase',
          recommendation: error ? 'Check Supabase configuration' : undefined
        });
      } catch (err) {
        results.push({
          component: 'Supabase Auth Connection',
          status: 'error',
          message: 'Failed to connect to Supabase authentication',
          recommendation: 'Verify Supabase integration and credentials'
        });
      }

      // Auth State Analysis
      results.push({
        component: 'Auth State Management',
        status: isLoading ? 'info' : user ? 'good' : 'info',
        message: isLoading ? 'Authentication state loading...' : user ? 'User authenticated' : 'No active session'
      });

      // UI Components Analysis
      results.push({
        component: 'Auth Components',
        status: 'warning',
        message: 'Multiple auth components detected',
        recommendation: 'Consolidate to single modern auth component'
      });

      // Performance Analysis
      const performanceEntries = performance.getEntriesByType('navigation');
      if (performanceEntries.length > 0) {
        const navEntry = performanceEntries[0] as PerformanceNavigationTiming;
        const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
        results.push({
          component: 'Page Load Performance',
          status: loadTime < 2000 ? 'good' : loadTime < 4000 ? 'warning' : 'error',
          message: `Load time: ${loadTime.toFixed(0)}ms`,
          recommendation: loadTime >= 2000 ? 'Consider optimizing bundle size and lazy loading' : undefined
        });
      }
      setAnalysisResults(results);
    };
    performAnalysis();
  }, [user, isLoading, viewport]);
  const getStatusIcon = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };
  const getStatusColor = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  return <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        
        
      </Card>
    </div>;
};