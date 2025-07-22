
import { useState } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  media_url?: string;
  created_at: string;
  edited_at?: string;
  message_status: 'sent' | 'delivered' | 'read';
  sender_profile?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface MessageContextMenuProps {
  message: DirectMessage;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

const MessageContextMenu = ({ 
  message, 
  canEdit, 
  canDelete, 
  onEdit, 
  onDelete, 
  children 
}: MessageContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!canEdit && !canDelete) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {children}
      
      {/* Context Menu Trigger */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 shadow-sm"
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-xl"
          >
            {canEdit && (
              <DropdownMenuItem
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100/50 rounded-lg cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MessageContextMenu;
