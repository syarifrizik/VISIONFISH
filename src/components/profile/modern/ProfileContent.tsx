
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Fish,
  Target,
  TrendingUp,
  Search,
  Users,
  BookOpen,
  User,
  PlusCircle,
  UserPlus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProfileContentProps {
  activeTab: string;
  userId: string;
}

interface Activity {
  id: string;
  activity_type: string;
  created_at: string;
  metadata: any;
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

interface FishCatch {
  id: string;
  species_name: string;
  weight_kg: number;
  location: string;
  created_at: string;
  image_urls: string[];
}

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  followers_count: number;
}

const ProfileContent = ({ activeTab, userId }: ProfileContentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [catches, setCatches] = useState<FishCatch[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data based on active tab
  useEffect(() => {
    loadTabData();
  }, [activeTab, userId]);

  const loadTabData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'aktivitas':
          await loadActivities();
          break;
        case 'catatan':
          await loadNotes();
          break;
        case 'komunitas':
          await loadUsers();
          break;
        case 'riwayat':
          await loadCatches();
          break;
        case 'pengguna':
          await loadUsers();
          break;
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivities = async () => {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    setActivities(data || []);
  };

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    setNotes(data || []);
  };

  const loadCatches = async () => {
    const { data, error } = await supabase
      .from('fish_catches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    setCatches(data || []);
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, followers_count')
      .neq('id', userId)
      .order('followers_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    setUsers(data || []);
  };

  const createNewNote = async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        title: 'Catatan Baru',
        content: 'Mulai menulis catatan Anda di sini...',
        category: 'personal'
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Gagal membuat catatan baru",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Berhasil",
      description: "Catatan baru telah dibuat"
    });
    
    loadNotes();
  };

  const createNewCatch = async () => {
    const { data, error } = await supabase
      .from('fish_catches')
      .insert({
        user_id: userId,
        species_name: 'Ikan Baru',
        location: 'Lokasi Memancing',
        weight_kg: 0
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menambah tangkapan",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Berhasil",
      description: "Tangkapan baru telah ditambahkan"
    });
    
    loadCatches();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message_sent': return <MessageSquare className="w-4 h-4" />;
      case 'message_liked': return <Heart className="w-4 h-4" />;
      case 'fish_caught': return <Fish className="w-4 h-4" />;
      case 'note_created': return <BookOpen className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'message_sent': return 'Mengirim Pesan';
      case 'message_liked': return 'Menyukai Pesan';
      case 'fish_caught': return 'Menangkap Ikan';
      case 'note_created': return 'Membuat Catatan';
      default: return 'Aktivitas';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'aktivitas':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Aktivitas Terbaru ({activities.length})
              </h2>
            </div>
            
            {activities.length === 0 ? (
              <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Belum Ada Aktivitas
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Mulai berinteraksi untuk melihat aktivitas di sini
                </p>
              </Card>
            ) : (
              activities.map((activity) => (
                <Card key={activity.id} className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {getActivityLabel(activity.activity_type)}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );
      
      case 'catatan':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Catatan Memancing ({notes.length})
              </h2>
              {user?.id === userId && (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600"
                  onClick={createNewNote}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tulis
                </Button>
              )}
            </div>
            
            {notes.length === 0 ? (
              <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Belum Ada Catatan
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Mulai tulis catatan memancing dan tips Anda
                </p>
                {user?.id === userId && (
                  <Button onClick={createNewNote} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Buat Catatan Pertama
                  </Button>
                )}
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{note.title}</h3>
                        <Badge variant="secondary" className="text-xs">{note.category}</Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{note.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(note.created_at)}</span>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        );
      
      case 'komunitas':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Komunitas Memancing ({users.length})
              </h2>
            </div>
            
            {users.length === 0 ? (
              <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Komunitas Memancing
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Terhubung dengan sesama pemancing dan berbagi pengalaman
                </p>
              </Card>
            ) : (
              users.map((userProfile) => (
                <Card key={userProfile.id} className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {userProfile.display_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {userProfile.display_name || userProfile.username}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {userProfile.followers_count || 0} pengikut
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <UserPlus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );
      
      case 'riwayat':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Riwayat Tangkapan ({catches.length})
              </h2>
              {user?.id === userId && (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                  onClick={createNewCatch}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              )}
            </div>
            
            {catches.length === 0 ? (
              <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 text-center">
                <Fish className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Belum Ada Tangkapan
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Mulai catat tangkapan ikan Anda dan buat riwayat memancing
                </p>
                {user?.id === userId && (
                  <Button onClick={createNewCatch} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Tambah Tangkapan Pertama
                  </Button>
                )}
              </Card>
            ) : (
              catches.map((fishCatch) => (
                <Card key={fishCatch.id} className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <Fish className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {fishCatch.species_name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {fishCatch.weight_kg}kg • {fishCatch.location}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(fishCatch.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );
      
      case 'pengguna':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Jelajahi Pengguna ({users.length})
              </h2>
            </div>
            
            {users.length === 0 ? (
              <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Jelajahi Pengguna
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Temukan pemancing berpengalaman dan pelajari teknik baru
                </p>
              </Card>
            ) : (
              users.map((userProfile) => (
                <Card key={userProfile.id} className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {userProfile.display_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {userProfile.display_name || userProfile.username}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          @{userProfile.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-blue-600 h-6 w-6 p-0">
                        <UserPlus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileContent;
