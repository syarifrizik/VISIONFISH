
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Search, MessageSquare, Pin, Plus, Trash2, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  message_type: string;
  is_pinned: boolean;
  is_promotion: boolean;
  likes_count: number;
  created_at: string;
  user_profile?: {
    display_name?: string;
    username?: string;
  };
}

const ContentManagementSection = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [stats, setStats] = useState({
    totalMessages: 0,
    pinnedMessages: 0,
    promotionMessages: 0
  });

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: allMessages } = await supabase
        .from('chat_messages')
        .select('id, is_pinned, is_promotion');

      if (allMessages) {
        setStats({
          totalMessages: allMessages.length,
          pinnedMessages: allMessages.filter(m => m.is_pinned).length,
          promotionMessages: allMessages.filter(m => m.is_promotion).length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const userIds = [...new Set(messagesData?.map(m => m.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .in('id', userIds);

      const profilesMap = new Map(
        profilesData?.map(profile => [profile.id, profile]) || []
      );

      const messagesWithProfiles = messagesData?.map(message => ({
        ...message,
        user_profile: profilesMap.get(message.user_id)
      })) || [];

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error("Gagal memuat pesan");
    } finally {
      setLoading(false);
    }
  };

  const togglePinMessage = async (messageId: string, currentPinStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_pinned: !currentPinStatus })
        .eq('id', messageId);

      if (error) throw error;

      toast.success(currentPinStatus ? "Pin pesan dibatalkan" : "Pesan berhasil di-pin");
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error("Gagal mengubah status pin");
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      toast.success("Pesan berhasil dihapus");
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Gagal menghapus pesan");
    }
  };

  const createAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: newAnnouncement,
          user_id: user.id,
          message_type: 'announcement',
          is_pinned: true
        });

      if (error) throw error;

      toast.success("Pengumuman berhasil dibuat");
      setNewAnnouncement("");
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error("Gagal membuat pengumuman");
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.user_profile?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.user_profile?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || 
      (selectedType === 'pinned' && message.is_pinned) ||
      (selectedType === 'promotion' && message.is_promotion) ||
      (selectedType === message.message_type);

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Pesan</p>
                <p className="text-xl font-bold">{stats.totalMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Pin className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pesan Pinned</p>
                <p className="text-xl font-bold">{stats.pinnedMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Promosi</p>
                <p className="text-xl font-bold">{stats.promotionMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Buat Pengumuman
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Tulis pengumuman..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            rows={3}
          />
          <Button onClick={createAnnouncement} disabled={!newAnnouncement.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Pengumuman
          </Button>
        </CardContent>
      </Card>

      {/* Content Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Kelola Konten ({filteredMessages.length} pesan)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pesan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Semua</option>
              <option value="pinned">Pinned</option>
              <option value="promotion">Promosi</option>
              <option value="general">General</option>
              <option value="question">Pertanyaan</option>
              <option value="news">Berita</option>
              <option value="announcement">Pengumuman</option>
            </select>
          </div>

          {/* Messages List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {message.user_profile?.display_name || 
                         message.user_profile?.username || 
                         'Unknown User'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {message.message_type}
                      </Badge>
                      {message.is_pinned && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Pin className="w-3 h-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      {message.is_promotion && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Promotion
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(message.created_at).toLocaleString('id-ID')}</span>
                      <span>{message.likes_count} likes</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePinMessage(message.id, message.is_pinned)}
                      className={message.is_pinned ? "bg-yellow-50" : ""}
                    >
                      <Pin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessage(message.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada pesan yang ditemukan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagementSection;
