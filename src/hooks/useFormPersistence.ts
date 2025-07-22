
import { useState, useEffect, useCallback, useRef } from 'react';

interface FormPersistenceOptions<T> {
  key: string;
  initialData: T;
  autoSaveDelay?: number;
  enablePersistence?: boolean;
}

export const useFormPersistence = <T extends Record<string, any>>({
  key,
  initialData,
  autoSaveDelay = 2000,
  enablePersistence = true
}: FormPersistenceOptions<T>) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitializedRef = useRef(false);

  // Load saved data on mount
  useEffect(() => {
    if (!enablePersistence) return;
    
    try {
      const saved = localStorage.getItem(`form_draft_${key}`);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Only merge if the saved data has actual content
        const hasContent = Object.values(parsedData).some(value => 
          value !== '' && value !== null && value !== undefined
        );
        
        if (hasContent) {
          setFormData({ ...initialData, ...parsedData });
          setIsDirty(true);
        }
      }
    } catch (error) {
      console.error('Error loading form draft:', error);
    } finally {
      isInitializedRef.current = true;
    }
  }, [key, enablePersistence]);

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    if (!enablePersistence || !isDirty || !isInitializedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsAutoSaving(true);
    
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`form_draft_${key}`, JSON.stringify(formData));
        setLastSaved(new Date());
        setIsAutoSaving(false);
      } catch (error) {
        console.error('Error saving form draft:', error);
        setIsAutoSaving(false);
      }
    }, autoSaveDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, isDirty, key, autoSaveDelay, enablePersistence]);

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      // Only mark as dirty if there are actual changes
      const hasChanges = Object.keys(updates).some(key => 
        updates[key] !== prev[key]
      );
      
      if (hasChanges && isInitializedRef.current) {
        setIsDirty(true);
      }
      
      return newData;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setIsDirty(false);
    setLastSaved(null);
    if (enablePersistence) {
      localStorage.removeItem(`form_draft_${key}`);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [initialData, key, enablePersistence]);

  const clearDraft = useCallback(() => {
    if (enablePersistence) {
      localStorage.removeItem(`form_draft_${key}`);
    }
    setIsDirty(false);
    setLastSaved(null);
    setIsAutoSaving(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [key, enablePersistence]);

  const saveNow = useCallback(async () => {
    if (!enablePersistence || !isDirty) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    try {
      localStorage.setItem(`form_draft_${key}`, JSON.stringify(formData));
      setLastSaved(new Date());
      setIsAutoSaving(false);
    } catch (error) {
      console.error('Error saving form draft:', error);
    }
  }, [formData, isDirty, key, enablePersistence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    formData,
    updateFormData,
    resetForm,
    clearDraft,
    saveNow,
    isDirty,
    lastSaved,
    isAutoSaving
  };
};
