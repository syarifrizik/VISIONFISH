
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BookOpen, Users, BarChart3, Search } from 'lucide-react';
import ModernEnhancedActivityTab from './enhanced/ModernEnhancedActivityTab';
import EnhancedNotesTab from './enhanced/EnhancedNotesTab';
import EnhancedCommunityTab from './enhanced/EnhancedCommunityTab';
import ImprovedUsersTab from './users/ImprovedUsersTab';

interface ProfileTabsProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  isOwnProfile?: boolean;
  profileUserId?: string;
}

const ProfileTabs = ({ 
  searchQuery = '', 
  onSearchChange = () => {}, 
  viewMode = 'grid', 
  onViewModeChange = () => {},
  isOwnProfile = false,
  profileUserId
}: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('aktivitas');

  const tabs = [
    {
      id: 'aktivitas',
      label: 'Aktivitas',
      icon: Activity,
      component: ModernEnhancedActivityTab
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
      component: ImprovedUsersTab
    }
  ];

  const renderTabContent = (tabId: string, ComponentToRender: any) => {
    switch (tabId) {
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
        return <ComponentToRender />;
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 text-xs sm:text-sm"
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

export default ProfileTabs;
