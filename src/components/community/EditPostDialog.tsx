
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  onEdit?: () => void;
}

export const EditPostDialog: React.FC<EditPostDialogProps> = ({
  open,
  onOpenChange,
  postId,
  onEdit
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: ''
  });

  useEffect(() => {
    if (open && postId) {
      loadPostData();
    }
  }, [open, postId]);

  const loadPostData = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('title, content, location')
        .eq('id', postId)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || '',
        content: data.content || '',
        location: data.location || ''
      });
    } catch (error) {
      console.error('Error loading post data:', error);
      toast.error('Failed to load post data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({
          title: formData.title,
          content: formData.content,
          location: formData.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post updated successfully');
      onOpenChange(false);
      if (onEdit) onEdit();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Post
          </DialogTitle>
        </DialogHeader>

        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-slate-200 mb-2 block">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
              placeholder="Enter post title..."
              maxLength={100}
              required
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-medium text-slate-200 mb-2 block">
              Content
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white min-h-[100px] resize-none"
              placeholder="Share your thoughts..."
              maxLength={1000}
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-medium text-slate-200 mb-2 block">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
              placeholder="Where was this taken?"
              maxLength={100}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Post'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};
