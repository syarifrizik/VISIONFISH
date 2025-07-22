
import { LucideIcon } from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  badge?: number; // For notification counts
}
