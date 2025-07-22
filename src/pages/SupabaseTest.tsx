
import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '@/utils/supabase-connection-test';
import SupabaseStatus from '@/components/SupabaseStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const SupabaseTestPage = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
      console.log('Supabase connection test result:', result);
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResult({ success: false, error: 'Test failed' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runConnectionTest();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        VisionFish Supabase Connection Test
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <SupabaseStatus />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Connection Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runConnectionTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Run Test'}
              </Button>
              
              {testResult && (
                <div className={`p-4 rounded-lg ${
                  testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <h3 className="font-semibold">Test Result:</h3>
                  <p>{testResult.success ? testResult.message : testResult.error}</p>
                  {testResult.projectId && (
                    <p className="text-sm mt-2">Project ID: {testResult.projectId}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Project Name:</h4>
              <p>VisionFish</p>
            </div>
            <div>
              <h4 className="font-semibold">Project ID:</h4>
              <p>hxekcssuzixhieadgcxx</p>
            </div>
            <div>
              <h4 className="font-semibold">Database Type:</h4>
              <p>PostgreSQL</p>
            </div>
            <div>
              <h4 className="font-semibold">Connection Status:</h4>
              <p className="text-green-600">Connected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseTestPage;
