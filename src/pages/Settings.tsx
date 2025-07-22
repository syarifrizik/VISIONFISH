
import { useEffect } from "react";
import { toast } from "sonner";
import { Check, BellRing, Moon, Sun, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useSettings } from "@/hooks/useSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import PrivacySettings from "@/components/profile/PrivacySettings";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const isMobile = useIsMobile();
  
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!", {
      position: "bottom-center",
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className={`grid grid-cols-3 mb-8 ${isMobile ? 'h-auto p-1' : ''}`}>
          <TabsTrigger 
            value="appearance" 
            className={`flex items-center gap-2 ${
              isMobile 
                ? 'flex-col px-2 py-3 text-xs relative' 
                : ''
            }`}
          >
            <div className="relative">
              <Moon className={`h-4 w-4 ${isMobile ? 'mb-1' : ''}`} />
              {isMobile && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className={isMobile ? 'text-[10px] leading-tight' : ''}>
              {isMobile ? 'Theme' : 'Appearance'}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className={`flex items-center gap-2 ${
              isMobile 
                ? 'flex-col px-2 py-3 text-xs relative' 
                : ''
            }`}
          >
            <div className="relative">
              <BellRing className={`h-4 w-4 ${isMobile ? 'mb-1' : ''}`} />
              {isMobile && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className={isMobile ? 'text-[10px] leading-tight' : ''}>
              {isMobile ? 'Notif' : 'Notifications'}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="privacy" 
            className={`flex items-center gap-2 ${
              isMobile 
                ? 'flex-col px-2 py-3 text-xs relative' 
                : ''
            }`}
          >
            <div className="relative">
              <Lock className={`h-4 w-4 ${isMobile ? 'mb-1' : ''}`} />
              {isMobile && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className={isMobile ? 'text-[10px] leading-tight' : ''}>
              Privacy
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how VisionFish looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">Theme</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className={`flex flex-col items-center justify-center h-32 p-6 ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="h-full w-full bg-gradient-to-br from-ocean-blue to-ocean-light rounded-md mb-2 relative">
                      {theme === 'light' && (
                        <div className="absolute -right-2 -top-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm">Light</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex flex-col items-center justify-center h-32 p-6 ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="h-full w-full bg-gradient-to-br from-purple-deep to-purple-light rounded-md mb-2 relative">
                      {theme === 'dark' && (
                        <div className="absolute -right-2 -top-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm">Dark</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure what notifications you receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="app-updates" className="flex items-center gap-2">
                  App Updates
                </Label>
                <Switch 
                  id="app-updates" 
                  checked={settings.notifications_app_updates}
                  onCheckedChange={(checked) => 
                    updateSettings({ notifications_app_updates: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-tips" className="flex items-center gap-2">
                  New Tips
                </Label>
                <Switch 
                  id="new-tips" 
                  checked={settings.notifications_new_tips}
                  onCheckedChange={(checked) => 
                    updateSettings({ notifications_new_tips: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="weather-alerts" className="flex items-center gap-2">
                  Weather Alerts
                </Label>
                <Switch 
                  id="weather-alerts" 
                  checked={settings.notifications_weather_alerts}
                  onCheckedChange={(checked) => 
                    updateSettings({ notifications_weather_alerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="chat-messages" className="flex items-center gap-2">
                  Chat Messages
                </Label>
                <Switch 
                  id="chat-messages" 
                  checked={settings.notifications_chat_messages}
                  onCheckedChange={(checked) => 
                    updateSettings({ notifications_chat_messages: checked })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="w-full">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
