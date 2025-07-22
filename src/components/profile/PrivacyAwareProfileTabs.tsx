
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BookOpen, Users, Search, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Ultra2025ActivityTab from './enhanced/Ultra2025ActivityTab';
import EnhancedNotesTab from './enhanced/EnhancedNotesTab';
import EnhancedCommunityTab from './enhanced/EnhancedCommunityTab';
import Ultra2025UsersTab from './users/Ultra2025UsersTab';

interface PrivacyAwareProfileTabsProps {
  isOwnProfile: boolean;
  profileUserId?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  profileOwnerName?: string;
}

const PrivacyAwareProfileTabs = ({ 
  isOwnProfile,
  profileUserId,
  searchQuery = '', 
  onSearchChange = () => {}, 
  viewMode = 'grid', 
  onViewModeChange = () => {},
  profileOwnerName = 'User'
}: PrivacyAwareProfileTabsProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('aktivitas');

  console.log('PrivacyAwareProfileTabs: profileUserId:', profileUserId, 'isOwnProfile:', isOwnProfile, 'profileOwnerName:', profileOwnerName);

  // Different tabs for own profile vs others
  const ownProfileTabs = [
    {
      id: 'aktivitas',
      label: 'Aktivitas',
      icon: Activity,
      component: Ultra2025ActivityTab
    },
    {
      id: 'catatan',
      label: 'Catatan',
      icon: BookOpen,
      component: EnhancedNotesTab
    },
    {
      id: 'komunitas',
      label: 'Komunitas',
      icon: Users,
      component: EnhancedCommunityTab
    },
    {
      id: 'jelajahi',
      label: 'Jelajahi',
      icon: Search,
      component: Ultra2025UsersTab
    }
  ];

  const publicProfileTabs = [
    {
      id: 'catatan',
      label: 'Catatan Publik',
      icon: BookOpen,
      component: EnhancedNotesTab
    },
    {
      id: 'aktivitas',
      label: 'Aktivitas Publik', 
      icon: Eye,
      component: Ultra2025ActivityTab
    }
  ];

  const tabs = isOwnProfile ? ownProfileTabs : publicProfileTabs;

  const renderTabContent = (tabId: string, ComponentToRender: any) => {
    const commonProps = {
      profileUserId,
      isOwnProfile,
      profileOwnerName
    };

    console.log('Rendering tab:', tabId, 'with props:', commonProps);

    switch (tabId) {
      case 'catatan':
        return (
          <ComponentToRender 
            {...commonProps}
          />
        );
      case 'aktivitas':
        return (
          <ComponentToRender 
            {...commonProps}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        );
      case 'jelajahi':
        return (
          <ComponentToRender 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        );
      default:
        return <ComponentToRender {...commonProps} />;
    }
  };

  return (
    <div className="w-full">
      {/* Profile Context Indicator */}
      {!isOwnProfile && (
        <div className="mb-4 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Eye className="w-4 h-4" />
            <span>Melihat profil {profileOwnerName}</span>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${isOwnProfile ? 'grid-cols-4' : 'grid-cols-2'} bg-white/10 backdrop-blur-xl border border-white/20`}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 text-xs sm:text-sm text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/20"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {renderTabContent(tab.id, tab.component)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PrivacyAwareProfileTabs;
