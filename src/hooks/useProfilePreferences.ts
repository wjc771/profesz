
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface UserPreferences {
  subjects?: string[];
  grade_level?: string;
  institution_type?: string;
  experience?: string;
  goals?: string[];
  frequency?: string;
  child_name?: string;
  child_grade?: string;
}

export const useProfilePreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPreferences = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('useProfilePreferences: Fetching preferences for user', user.id);
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data) {
        const fetchedPreferences = {
          subjects: data.subjects || [],
          grade_level: data.grade_level || '',
          institution_type: data.institution_type || '',
          experience: data.experience || '',
          goals: data.goals || [],
          frequency: data.frequency || '',
          child_name: data.child_name || '',
          child_grade: data.child_grade || ''
        };
        
        console.log('useProfilePreferences: Fetched preferences', fetchedPreferences);
        setPreferences(fetchedPreferences);
      } else {
        console.log('useProfilePreferences: No preferences found, using empty object');
        setPreferences({});
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const savePreferences = async (newPreferences: UserPreferences) => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Usuário não autenticado'
      });
      return false;
    }

    setSaving(true);
    try {
      console.log('useProfilePreferences: Saving preferences', newPreferences);
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          subjects: newPreferences.subjects || [],
          grade_level: newPreferences.grade_level || null,
          institution_type: newPreferences.institution_type || null,
          experience: newPreferences.experience || null,
          goals: newPreferences.goals || [],
          frequency: newPreferences.frequency || null,
          child_name: newPreferences.child_name || null,
          child_grade: newPreferences.child_grade || null
        });

      if (error) {
        console.error('Error saving preferences:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar suas preferências'
        });
        return false;
      }

      console.log('useProfilePreferences: Preferences saved successfully');
      setPreferences(newPreferences);
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar suas preferências'
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const markOnboardingComplete = async () => {
    if (!user?.id) return false;

    try {
      console.log('useProfilePreferences: Marking onboarding complete for user', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        console.error('Error marking onboarding complete:', error);
        return false;
      }

      console.log('useProfilePreferences: Onboarding marked as complete');
      return true;
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      return false;
    }
  };

  const checkOnboardingStatus = async () => {
    if (!user?.id) return false;

    try {
      console.log('useProfilePreferences: Checking onboarding status for user', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed_at')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking onboarding status:', error);
        return false;
      }

      const isCompleted = !!data?.onboarding_completed_at;
      console.log('useProfilePreferences: Onboarding status', { isCompleted, completedAt: data?.onboarding_completed_at });
      
      return isCompleted;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };

  // Only fetch preferences once when user changes
  useEffect(() => {
    if (user?.id) {
      fetchPreferences();
    } else {
      setLoading(false);
      setPreferences({});
    }
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    saving,
    savePreferences,
    markOnboardingComplete,
    checkOnboardingStatus,
    refetch: fetchPreferences
  };
};
