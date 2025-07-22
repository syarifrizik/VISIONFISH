
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePostActions } from '@/hooks/usePostActions';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}

const reportReasons = [
  { value: 'spam', label: 'Spam or misleading content' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'copyright', label: 'Copyright violation' },
  { value: 'misinformation', label: 'False information' },
  { value: 'other', label: 'Other' }
];

export const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  postId
}) => {
  const { reportPost, isLoading } = usePostActions();
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!selectedReason) return;

    const success = await reportPost(postId, selectedReason, description);
    if (success) {
      onOpenChange(false);
      setSelectedReason('');
      setDescription('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Report Post
          </DialogTitle>
        </DialogHeader>

        <motion.div 
          className="space-y-6 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <Label className="text-sm font-medium text-slate-200 mb-3 block">
              Why are you reporting this post?
            </Label>
            <RadioGroup 
              value={selectedReason} 
              onValueChange={setSelectedReason}
              className="space-y-3"
            >
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={reason.value} 
                    id={reason.value}
                    className="border-slate-600 text-blue-400"
                  />
                  <Label 
                    htmlFor={reason.value}
                    className="text-sm text-slate-300 cursor-pointer flex-1"
                  >
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-200 mb-2 block">
              Additional details (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context about why you're reporting this post..."
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-slate-400 mt-1">
              {description.length}/500 characters
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedReason || isLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {isLoading ? 'Reporting...' : 'Submit Report'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
