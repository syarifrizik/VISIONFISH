
import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '@/utils/supabase-connection-test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';

const SupabaseStatus = () => {
  const [status, setStatus] = useState<{
    loading: boolean;
    connected: boolean;
    message: string;
    projectId?: string;
    tablesAccessible?: boolean;
  }>({
    loading: true,
    connected: false,
    message: 'Testing VisionFish connection...'
  });

  useEffect(() => {
    const checkConnection = async () => {
      const result = await testSupabaseConnection();
      setStatus({
        loading: false,
        connected: result.success,
        message: result.success ? result.message || 'Connected' : result.error || 'Connection failed',
        projectId: result.success ? result.projectId : undefined,
        tablesAccessible: result.success ? result.tablesAccessible : false
      });
    };

    checkConnection();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status.connected ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <Database className="w-5 h-5" />
          VisionFish Database
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${
          status.loading ? 'text-gray-500' : 
          status.connected ? 'text-green-600' : 'text-red-600'
        }`}>
          {status.message}
        </p>
        {status.projectId && (
          <p className="text-xs text-muted-foreground mt-2">
            Project ID: {status.projectId}
          </p>
        )}
        {status.tablesAccessible && (
          <p className="text-xs text-green-600 mt-1">
            ✓ Database tables accessible
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseStatus;
