
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, Plus, Trash2, Eye, EyeOff, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserApiKey {
  id: string;
  name: string;
  key_value: string;
  provider: string;
  daily_limit: number;
  current_usage: number;
  is_active: boolean;
  created_at: string;
}

interface UserApiKeyManagerProps {
  userId: string;
  isPremium: boolean;
}

const UserApiKeyManager = ({ userId, isPremium }: UserApiKeyManagerProps) => {
  const [apiKeys, setApiKeys] = useState<UserApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showKeyValues, setShowKeyValues] = useState<{[key: string]: boolean}>({});
  
  // Form states
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyLimit, setNewKeyLimit] = useState("1000");

  useEffect(() => {
    // Load API keys for all users (admin can manage any user's API keys)
    loadUserApiKeys();
  }, [userId]);

  const loadUserApiKeys = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_user_api_keys', { 
        target_user_id: userId 
      });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map((key: any) => ({
        id: key.id,
        name: key.name,
        key_value: key.key_value,
        provider: key.provider || 'gemini',
        daily_limit: key.daily_limit || 1000,
        current_usage: key.current_usage || 0,
        is_active: key.is_active !== false,
        created_at: key.created_at || ''
      }));
      
      setApiKeys(transformedData);
    } catch (error) {
      console.error('Error loading user API keys:', error);
      toast.error("Gagal memuat API keys");
    } finally {
      setLoading(false);
    }
  };

  const addApiKey = async () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      toast.error("Nama dan API key harus diisi");
      return;
    }

    try {
      const { error } = await supabase.rpc('add_user_api_key', {
        target_user_id: userId,
        key_name: newKeyName,
        key_value: newKeyValue,
        key_provider: 'gemini',
        key_limit: parseInt(newKeyLimit)
      });

      if (error) throw error;

      toast.success("API key berhasil ditambahkan");
      setNewKeyName("");
      setNewKeyValue("");
      setNewKeyLimit("1000");
      setShowAddDialog(false);
      loadUserApiKeys();
    } catch (error) {
      console.error('Error adding API key:', error);
      toast.error("Gagal menambahkan API key");
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Yakin ingin menghapus API key ini?")) return;

    try {
      const { error } = await supabase.rpc('delete_user_api_key', {
        key_id: keyId
      });

      if (error) throw error;

      toast.success("API key berhasil dihapus");
      loadUserApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error("Gagal menghapus API key");
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeyValues(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys Pengguna
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah API Key Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyName">Nama API Key</Label>
                  <Input
                    id="keyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Personal Gemini Key"
                  />
                </div>
                <div>
                  <Label htmlFor="keyValue">API Key Value</Label>
                  <Input
                    id="keyValue"
                    type="password"
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                    placeholder="AIza..."
                  />
                </div>
                <div>
                  <Label htmlFor="keyLimit">Daily Limit</Label>
                  <Input
                    id="keyLimit"
                    type="number"
                    value={newKeyLimit}
                    onChange={(e) => setNewKeyLimit(e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addApiKey} className="flex-1">
                    Tambah API Key
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Info section for non-premium users */}
        {!isPremium && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">User Non-Premium</p>
                <p>Sebagai admin, Anda dapat menambahkan API key untuk user ini. User non-premium akan menggunakan API key yang Anda berikan atau sistem API key bersama.</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-4">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Belum ada API key yang ditambahkan</p>
            <p className="text-sm text-muted-foreground">
              {isPremium 
                ? "Tambahkan API key Gemini personal untuk user ini"
                : "Sebagai admin, Anda dapat menambahkan API key untuk user non-premium ini"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                      {apiKey.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                    {!isPremium && (
                      <Badge variant="outline" className="text-xs">
                        Admin Managed
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    API Key: {showKeyValues[apiKey.id] ? apiKey.key_value : maskApiKey(apiKey.key_value)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Usage: {apiKey.current_usage} / {apiKey.daily_limit}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKeyValues[apiKey.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteApiKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserApiKeyManager;
