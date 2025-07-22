import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Key, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Activity, 
  Crown, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface APIKey {
  id: string;
  name: string;
  key: string;
  provider: 'gemini' | 'openai' | 'anthropic';
  status: 'active' | 'inactive' | 'expired';
  usageCount: number;
  dailyLimit: number;
  createdAt: Date;
  lastUsed?: Date;
}

const APIKeyManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [newKey, setNewKey] = useState({
    name: '',
    key: '',
    provider: 'gemini' as 'gemini' | 'openai' | 'anthropic',
    dailyLimit: 1000
  });

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual implementation
      const mockKeys: APIKey[] = [
        {
          id: '1',
          name: 'Primary Gemini Key',
          key: 'AIzaSyC...abc123',
          provider: 'gemini',
          status: 'active',
          usageCount: 250,
          dailyLimit: 1000,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          lastUsed: new Date()
        },
        {
          id: '2',
          name: 'Backup OpenAI Key',
          key: 'sk-proj-...xyz789',
          provider: 'openai',
          status: 'inactive',
          usageCount: 0,
          dailyLimit: 500,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];
      setApiKeys(mockKeys);
    } catch (error) {
      toast.error('Gagal memuat API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const addAPIKey = async () => {
    if (!newKey.name || !newKey.key) {
      toast.error('Nama dan API key harus diisi');
      return;
    }

    try {
      const newApiKey: APIKey = {
        id: Date.now().toString(),
        name: newKey.name,
        key: newKey.key,
        provider: newKey.provider,
        status: 'active',
        usageCount: 0,
        dailyLimit: newKey.dailyLimit,
        createdAt: new Date()
      };

      setApiKeys(prev => [...prev, newApiKey]);
      setNewKey({ name: '', key: '', provider: 'gemini', dailyLimit: 1000 });
      setShowAddForm(false);
      toast.success('API key berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan API key');
    }
  };

  const deleteAPIKey = async (id: string) => {
    try {
      setApiKeys(prev => prev.filter(key => key.id !== id));
      toast.success('API key berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus API key');
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusBadge = (status: APIKey['status']) => {
    const configs = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
      expired: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    
    const config = configs[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getProviderBadge = (provider: APIKey['provider']) => {
    const colors = {
      gemini: 'bg-blue-100 text-blue-800',
      openai: 'bg-green-100 text-green-800',
      anthropic: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={colors[provider]}>
        {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </Badge>
    );
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '....' + key.substring(key.length - 4);
  };

  const getUsagePercentage = (usage: number, limit: number) => {
    return Math.min((usage / limit) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink bg-clip-text text-transparent">
            API Key Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola API keys untuk VisionFish AI services
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah API Key
        </Button>
      </div>

      {/* Add API Key Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-visionfish-neon-blue/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-visionfish-neon-blue" />
                  Tambah API Key Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="keyName">Nama API Key</Label>
                    <Input
                      id="keyName"
                      value={newKey.name}
                      onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Primary Gemini Key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="provider">Provider</Label>
                    <select
                      id="provider"
                      value={newKey.provider}
                      onChange={(e) => setNewKey(prev => ({ ...prev, provider: e.target.value as any }))}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="gemini">Google Gemini</option>
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Textarea
                    id="apiKey"
                    value={newKey.key}
                    onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="Masukkan API key..."
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="dailyLimit">Daily Limit</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={newKey.dailyLimit}
                    onChange={(e) => setNewKey(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) }))}
                    placeholder="1000"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={addAPIKey} className="bg-visionfish-neon-blue text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Keys List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-visionfish-neon-blue" />
              <p className="mt-2 text-gray-600">Memuat API keys...</p>
            </CardContent>
          </Card>
        ) : apiKeys.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Key className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Belum ada API key yang dikonfigurasi</p>
              <p className="text-sm text-gray-500">Tambahkan API key pertama untuk mulai menggunakan VisionFish AI</p>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((apiKey) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Card className="border-gray-200 dark:border-gray-700 hover:border-visionfish-neon-blue/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{apiKey.name}</h3>
                        {getStatusBadge(apiKey.status)}
                        {getProviderBadge(apiKey.provider)}
                      </div>

                      <div className="space-y-3">
                        {/* API Key Display */}
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium w-16">Key:</Label>
                          <code className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm font-mono">
                            {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys[apiKey.id] ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </Button>
                        </div>

                        {/* Usage Statistics */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Usage Today:</Label>
                            <span className="text-sm">
                              {apiKey.usageCount}/{apiKey.dailyLimit} requests
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getUsagePercentage(apiKey.usageCount, apiKey.dailyLimit)}%` }}
                            />
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <span className="font-medium">Created:</span> {apiKey.createdAt.toLocaleDateString()}
                          </div>
                          {apiKey.lastUsed && (
                            <div>
                              <span className="font-medium">Last Used:</span> {apiKey.lastUsed.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAPIKey(apiKey.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Usage Analytics */}
      {apiKeys.length > 0 && (
        <Card className="border-visionfish-neon-pink/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-visionfish-neon-pink" />
              Analytics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {apiKeys.reduce((sum, key) => sum + key.usageCount, 0)}
                </div>
                <div className="text-sm text-blue-600">Total Requests Today</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {apiKeys.filter(key => key.status === 'active').length}
                </div>
                <div className="text-sm text-green-600">Active Keys</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {apiKeys.reduce((sum, key) => sum + key.dailyLimit, 0)}
                </div>
                <div className="text-sm text-purple-600">Total Daily Limit</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default APIKeyManagement;