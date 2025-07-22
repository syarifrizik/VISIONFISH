
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChatHistory from "./ChatHistory";
import { History } from "lucide-react";

interface ChatHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat?: (chatId: string) => void;
}

const ChatHistoryDialog: React.FC<ChatHistoryDialogProps> = ({
  isOpen,
  onClose,
  onSelectChat,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Riwayat Chat
          </DialogTitle>
          <DialogDescription>
            Lihat dan pilih percakapan lama Anda
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <ChatHistory onSelectChat={onSelectChat} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatHistoryDialog;
