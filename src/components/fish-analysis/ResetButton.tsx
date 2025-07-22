
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  className = "",
}) => {
  return (
    <motion.div 
      className={`${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Reset Parameter
              </h3>
              <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                Kembalikan semua parameter ke nilai awal (kosong)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-red-300 dark:border-red-700/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 bg-white dark:bg-gray-900/50"
              onClick={onReset}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResetButton;
