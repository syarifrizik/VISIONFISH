
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export interface ExportActivityData {
  id: string;
  activity_type: string;
  created_at: string;
  metadata?: any;
  action_details?: {
    item_type?: string;
    item_title?: string;
    changes?: string[];
    location?: string;
    image_count?: number;
    target_user?: string;
    species?: string;
    weight?: number;
  };
}

export const exportToCSV = (activities: ExportActivityData[], filename?: string) => {
  const headers = [
    'Tanggal',
    'Waktu',
    'Tipe Aktivitas',
    'Deskripsi',
    'Detail',
    'Lokasi',
    'Metadata'
  ];

  const rows = activities.map(activity => {
    const date = new Date(activity.created_at);
    const description = getActivityDescription(activity);
    const details = getActivityDetails(activity);
    
    return [
      format(date, 'dd/MM/yyyy', { locale: idLocale }),
      format(date, 'HH:mm', { locale: idLocale }),
      getActivityLabel(activity.activity_type),
      description,
      details,
      activity.action_details?.location || '',
      activity.metadata ? JSON.stringify(activity.metadata) : ''
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `aktivitas_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToJSON = (data: any, filename?: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `aktivitas_${format(new Date(), 'yyyy-MM-dd')}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const shareActivityStats = async (stats: any) => {
  const shareText = `Statistik Aktivitas Saya:
📊 Total Aktivitas: ${stats.totalActivities}
📈 Pertumbuhan: ${stats.weeklyGrowth > 0 ? '+' : ''}${stats.weeklyGrowth.toFixed(1)}%
🔥 Aktivitas Teratas: ${stats.topActivities[0]?.label || 'Belum ada'}

Dibuat dengan VirtualFish 🎣`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Statistik Aktivitas VirtualFish',
        text: shareText,
        url: window.location.origin
      });
      return true;
    } catch (error) {
      console.log('Error sharing:', error);
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

const getActivityLabel = (type: string) => {
  switch (type) {
    case 'message_sent': return 'Mengirim Pesan';
    case 'profile_updated': return 'Update Profil';
    case 'content_created': return 'Buat Konten';
    case 'note_created': return 'Buat Catatan';
    case 'fish_caught': return 'Tangkap Ikan';
    case 'user_followed': return 'Follow User';
    case 'user_unfollowed': return 'Unfollow User';
    case 'community_post_created': return 'Post Komunitas';
    case 'achievement_earned': return 'Raih Achievement';
    default: return 'Aktivitas';
  }
};

const getActivityDescription = (activity: ExportActivityData) => {
  const details = activity.action_details;
  
  switch (activity.activity_type) {
    case 'profile_updated':
      return details?.changes ? 
        `Mengubah ${details.changes.join(', ')}` : 
        'Memperbarui informasi profil';
    case 'content_created':
      return `Membuat konten: ${details?.item_title || 'konten baru'}`;
    case 'note_created':
      return `Membuat catatan: ${details?.item_title || 'catatan baru'}`;
    case 'fish_caught':
      const weight = details?.weight ? ` (${details.weight}kg)` : '';
      return `Menangkap ${details?.species || 'ikan'}${weight}`;
    case 'user_followed':
      return `Mengikuti pengguna baru`;
    case 'user_unfollowed':
      return `Berhenti mengikuti pengguna`;
    case 'community_post_created':
      return `Membuat postingan: ${details?.item_title || 'postingan baru'}`;
    case 'achievement_earned':
      return `Meraih pencapaian: ${details?.item_title || 'pencapaian baru'}`;
    default:
      return 'Melakukan aktivitas';
  }
};

const getActivityDetails = (activity: ExportActivityData) => {
  const details = activity.action_details;
  const parts = [];
  
  if (details?.item_type) parts.push(`Tipe: ${details.item_type}`);
  if (details?.weight) parts.push(`Berat: ${details.weight}kg`);
  if (details?.species) parts.push(`Spesies: ${details.species}`);
  if (details?.changes?.length) parts.push(`Perubahan: ${details.changes.join(', ')}`);
  
  return parts.join(' | ');
};
