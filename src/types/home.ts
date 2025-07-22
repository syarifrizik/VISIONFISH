
import { LucideIcon } from "lucide-react";

export interface TestimonialProps {
  quote: string;
  author: string;
  rating: number;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  preview: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'id';
  notifications: {
    appUpdates: boolean;
    newTips: boolean;
    weatherAlerts: boolean;
    chatMessages: boolean;
  };
}
